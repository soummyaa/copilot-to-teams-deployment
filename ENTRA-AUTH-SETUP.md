# Microsoft Entra (Azure AD) Authentication Setup Guide

This guide shows how to configure your bot to use Microsoft Entra authentication instead of API keys for Azure OpenAI.

## ⚠️ Recommended for GCC High Production Deployments

**If you're deploying to GCC High**, Entra authentication is **strongly recommended** or may even be **required** by your organization's security policies:
- ✅ Meets FedRAMP High / DoD IL4+ compliance requirements
- ✅ No static credentials to manage or rotate
- ✅ Full audit trail for security reviews
- ✅ Aligns with government cloud best practices

For **testing/POC**, API keys are acceptable. For **production**, use Entra authentication.

## Benefits of Entra Authentication

- ✅ **No API keys to manage** - More secure, no keys in code or env files
- ✅ **Automatic rotation** - No manual key rotation needed
- ✅ **Audit trail** - Better tracking of who accessed what
- ✅ **Role-based access** - Granular permissions via Azure RBAC
- ✅ **Compliance-friendly** - Meets most government security policies

---

## Step 1: Install Azure CLI

### For Commercial Azure:
```bash
# Login to Azure
az login
```

### For GCC High (Azure Government):
```bash
# Login to Azure Government
az cloud set --name AzureUSGovernment
az login
```

You should see a browser window open for authentication. Complete the sign-in.

Verify your login:
```bash
az account show
```

---

## Step 2: Grant Yourself Access to Azure OpenAI

After creating your Azure OpenAI resource (see Lab 2 main README), grant yourself the **Cognitive Services OpenAI User** role:

### Option A: Via Azure Portal

1. Go to your Azure OpenAI resource
2. Click **Access control (IAM)** in the left menu
3. Click **+ Add** → **Add role assignment**
4. Select **Cognitive Services OpenAI User** role
5. Click **Next**
6. Click **+ Select members**
7. Search for your email/username and select it
8. Click **Review + assign**

### Option B: Via Azure CLI

```bash
# Get your Azure OpenAI resource ID
RESOURCE_ID=$(az cognitiveservices account show \
  --name <your-openai-resource-name> \
  --resource-group <your-resource-group> \
  --query id -o tsv)

# Get your user object ID
USER_ID=$(az ad signed-in-user show --query id -o tsv)

# Assign the role
az role assignment create \
  --role "Cognitive Services OpenAI User" \
  --assignee-object-id $USER_ID \
  --scope $RESOURCE_ID
```

**Replace**:
- `<your-openai-resource-name>` with your Azure OpenAI resource name
- `<your-resource-group>` with your resource group name

Wait 2-5 minutes for the role assignment to propagate.

---

## Step 3: Configure Your .env File

Your `.env` file should look like this:

### For Commercial Azure:
```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
AZURE_OPENAI_API_KEY=USE_AZURE_AD_TOKEN
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview
PORT=3978
```

### For GCC High (Azure Government):
```bash
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.us
AZURE_OPENAI_API_KEY=USE_AZURE_AD_TOKEN
AZURE_OPENAI_DEPLOYMENT=gpt-4o
AZURE_OPENAI_API_VERSION=2024-08-01-preview
AZURE_CLOUD=government
PORT=3978
```

**Key points**:
- Set `AZURE_OPENAI_API_KEY=USE_AZURE_AD_TOKEN` - this triggers Entra authentication
- For GCC High, add `AZURE_CLOUD=government` - this ensures the correct token resource endpoint
- Replace `your-resource` with your actual Azure OpenAI resource name

---

## Step 4: How It Works (Behind the Scenes)

The bot's code in `src/handlers/claims.ts` automatically handles Entra authentication:

```typescript
async function getAzureToken(): Promise<string> {
  const configuredToken = process.env.AZURE_OPENAI_API_KEY || "";
  if (configuredToken && configuredToken !== "USE_AZURE_AD_TOKEN") {
    return configuredToken;  // Use API key if provided
  }
  
  // Determine resource endpoint based on cloud environment
  const cloudType = process.env.AZURE_CLOUD || "commercial";
  const resource = cloudType === "government" 
    ? "https://cognitiveservices.azure.us"      // GCC High
    : "https://cognitiveservices.azure.com";    // Commercial
  
  // Get token from Azure CLI
  const { stdout } = await execAsync(
    `az account get-access-token --resource ${resource} --query accessToken -o tsv`
  );
  return stdout.trim();
}
```

When you set `AZURE_OPENAI_API_KEY=USE_AZURE_AD_TOKEN`, the bot:
1. Detects you want Entra authentication
2. Determines the correct resource endpoint (commercial vs government)
3. Calls `az account get-access-token` to get a token for your authenticated Azure CLI session
4. Uses that token to call Azure OpenAI

---

## Step 5: Test Your Setup

### 5.1 Verify Azure CLI is logged in:
```bash
# Check your current Azure account
az account show

# Test getting a token manually (Commercial)
az account get-access-token --resource https://cognitiveservices.azure.com

# Test getting a token manually (GCC High)
az account get-access-token --resource https://cognitiveservices.azure.us
```

You should see a JSON response with an `accessToken` field.

### 5.2 Start your bot:
```bash
cd teams-bot
npm run dev
```

You should see:
```
Teams bot listening on http://localhost:3978
```

(No warning about missing credentials if Entra is configured correctly)

### 5.3 Test the health endpoint:
```bash
curl http://localhost:3978/health
```

Expected response:
```json
{
  "ok": true,
  "ready": true
}
```

**Note**: `ready: true` means Entra authentication is working!

### 5.4 Test with a sample question:
```bash
curl -X POST http://localhost:3978/message \
  -H "Content-Type: application/json" \
  -d '{"text":"What documents do I need to file a claim?"}'
```

Expected response:
```json
{
  "ok": true,
  "data": {
    "text": "To file a claim, you typically need..."
  }
}
```

---

## Troubleshooting

### Error: "Failed to get Azure AD token"
**Cause**: Azure CLI is not logged in or session expired

**Solution**:
```bash
# Commercial
az login

# GCC High
az cloud set --name AzureUSGovernment
az login
```

### Error: 403 Forbidden
**Cause**: You don't have the required role on the Azure OpenAI resource

**Solution**: Grant yourself the "Cognitive Services OpenAI User" role (see Step 2)

### Error: "AZURE_OPENAI_ENDPOINT is missing"
**Cause**: Your `.env` file is not configured

**Solution**: Create or update `teams-bot/.env` with your endpoint

### Token expires after 1 hour
**Behavior**: This is normal. The `getAzureToken()` function gets a fresh token on each request.

**If needed**: You can implement token caching to improve performance:
```typescript
let cachedToken: { token: string; expires: number } | null = null;

async function getAzureToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expires) {
    return cachedToken.token;
  }
  
  // ... get new token logic ...
  
  cachedToken = {
    token: newToken,
    expires: Date.now() + 50 * 60 * 1000  // Cache for 50 minutes
  };
  
  return newToken;
}
```

---

## Comparison: API Key vs Entra Authentication

| Feature | API Key | Entra Authentication |
|---------|---------|---------------------|
| **Setup complexity** | Simple (copy/paste key) | Moderate (role assignment) |
| **Security** | Key can be leaked | No keys to leak |
| **Key rotation** | Manual every 90 days | Automatic |
| **Audit trail** | Limited | Full Azure AD audit logs |
| **Works in CI/CD** | Yes (with secrets) | Yes (with managed identity) |
| **Local dev** | Simple | Requires `az login` |
| **Production** | Good | Better (use Managed Identity) |

---

## Next Steps

Once Entra authentication is working:
1. ✅ Continue to [Lab 3: Deploy to Teams](lab-3-teams/README.md)
2. 🚀 For production, use **Managed Identity** instead of `az login` (see below)

---

## Production Setup: Managed Identity (Optional)

For production deployments (Azure App Service, Container Apps, etc.), use **Managed Identity** instead of `az login`:

### 1. Enable Managed Identity on your Azure service
```bash
az webapp identity assign --name <your-app-name> --resource-group <your-rg>
```

### 2. Grant the Managed Identity access to Azure OpenAI
```bash
# Get the managed identity principal ID
MI_PRINCIPAL_ID=$(az webapp identity show \
  --name <your-app-name> \
  --resource-group <your-rg> \
  --query principalId -o tsv)

# Grant access
az role assignment create \
  --role "Cognitive Services OpenAI User" \
  --assignee-object-id $MI_PRINCIPAL_ID \
  --scope /subscriptions/<sub-id>/resourceGroups/<rg>/providers/Microsoft.CognitiveServices/accounts/<openai-name>
```

### 3. Update your code to use DefaultAzureCredential
Install the Azure Identity SDK:
```bash
npm install @azure/identity
```

Update `src/handlers/claims.ts`:
```typescript
import { DefaultAzureCredential } from "@azure/identity";

async function getAzureToken(): Promise<string> {
  const configuredToken = process.env.AZURE_OPENAI_API_KEY || "";
  if (configuredToken && configuredToken !== "USE_AZURE_AD_TOKEN") {
    return configuredToken;
  }
  
  const cloudType = process.env.AZURE_CLOUD || "commercial";
  const scope = cloudType === "government"
    ? "https://cognitiveservices.azure.us/.default"
    : "https://cognitiveservices.azure.com/.default";
  
  const credential = new DefaultAzureCredential();
  const tokenResponse = await credential.getToken(scope);
  return tokenResponse.token;
}
```

This automatically works with:
- Managed Identity (production)
- Azure CLI (local development)
- Service Principal (CI/CD)
- Visual Studio Code credentials
- And more!

---

## Summary

✅ **Entra authentication is more secure** - No API keys to manage  
✅ **Already implemented** - The code supports it out of the box  
✅ **Easy to use locally** - Just run `az login` and set `AZURE_OPENAI_API_KEY=USE_AZURE_AD_TOKEN`  
✅ **Production-ready** - Upgrade to Managed Identity for deployed apps

You're now ready to continue with Lab 3!
