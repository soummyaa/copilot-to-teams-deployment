# Setup Instructions

## Before Sharing This Repository

This repository is configured with placeholder values. Before deployment, you need to configure it with your actual Azure resources.

### 1. Configure Bot Credentials

Edit `teams-bot/manifest.json` and replace:
```json
"id": "YOUR-MICROSOFT-APP-ID-HERE"
"botId": "YOUR-MICROSOFT-APP-ID-HERE"
```

With your actual Microsoft App ID from Azure Bot registration.

### 2. Configure Environment Variables

Copy `teams-bot/.env.example` to `teams-bot/.env`:
```bash
cp teams-bot/.env.example teams-bot/.env
```

Then edit `.env` with your actual values:
- Azure OpenAI endpoint
- Microsoft App ID and Password
- Other configuration as needed

**IMPORTANT**: Never commit `.env` file to git! It's already in `.gitignore`.

### 3. Create Teams App Package

After configuring the manifest with your App ID:
```bash
cd teams-bot
zip -r ClaimsAssistant.zip manifest.json icons/
```

This creates the Teams app package ready for upload.

**Note**: `ClaimsAssistant.zip` is in `.gitignore` to prevent committing credentials.

---

## Security Notes

✅ **Protected** (Never commit these):
- `teams-bot/.env` - Contains secrets
- `teams-bot/ClaimsAssistant.zip` - Contains your App ID
- Any files with actual credentials

✅ **Safe to commit** (Templates only):
- `teams-bot/.env.example` - Template with placeholders
- `teams-bot/manifest.json` - Now has placeholders
- All documentation files

---

## Quick Start After Configuration

1. Configure credentials (steps above)
2. Follow [Lab 1](lab-1-setup/README.md) to set up environment
3. Follow [Lab 2](lab-2-foundry/README.md) to configure Azure OpenAI
4. Follow [Lab 3](lab-3-teams/README.md) to deploy to Teams

For GCC High deployment, see [ADMIN-GUIDE-GCC-HIGH.md](ADMIN-GUIDE-GCC-HIGH.md).
