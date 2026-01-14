import axios from "axios";
import { DefaultAzureCredential } from "@azure/identity";

// System instructions for the assistant
// NOTE: You'll customize this in Lab 2 with your actual Copilot Studio agent's instructions
const SYSTEM_INSTRUCTIONS = process.env.AGENT_INSTRUCTIONS || `You are a helpful claims assistant for an insurance company. 
Answer questions about filing claims, coverage eligibility, required documentation, 
and claim status. Be clear, professional, and direct. If you don't know the answer, 
say so and suggest contacting support.`;

let credential: DefaultAzureCredential | null = null;
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAzureToken(): Promise<string> {
  const configuredToken = process.env.AZURE_OPENAI_API_KEY || "";
  if (configuredToken && configuredToken !== "USE_AZURE_AD_TOKEN") {
    return configuredToken;
  }
  
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }
  
  // Determine scope based on cloud environment
  const cloudType = process.env.AZURE_CLOUD || "commercial";
  const scope = cloudType === "government" 
    ? "https://cognitiveservices.azure.us/.default"
    : "https://cognitiveservices.azure.com/.default";
  
  try {
    if (!credential) {
      credential = new DefaultAzureCredential();
    }
    
    const tokenResponse = await credential.getToken(scope);
    
    // Cache the token (expires 5 minutes before actual expiry for safety)
    cachedToken = {
      token: tokenResponse.token,
      expiresAt: tokenResponse.expiresOnTimestamp - (5 * 60 * 1000)
    };
    
    return tokenResponse.token;
  } catch (error: any) {
    throw new Error(`Failed to get Azure AD token: ${error.message}. Please run 'az login' in your terminal.`);
  }
}

export async function handleClaimsQuestion(text: string): Promise<string> {
  if (!text || typeof text !== "string") {
    throw new Error("text is required");
  }
  
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT || "gpt-4o";
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-08-01-preview";
  
  if (!endpoint) {
    throw new Error("AZURE_OPENAI_ENDPOINT is missing");
  }

  const token = await getAzureToken();
  
  // Simple single API call to Chat Completions
  const response = await axios.post(
    `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
    {
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: text }
      ],
      temperature: 0.7,
      max_tokens: 800
    },
    {
      headers: {
        "api-key": token,
        "Content-Type": "application/json",
      }
    }
  );

  return response.data.choices[0].message.content;
}
