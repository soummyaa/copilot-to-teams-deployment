# Deploy Your Copilot Studio Agent to Microsoft Teams (GCC High Compatible)

Welcome! This lab guides you through **migrating your Copilot Studio agent to Microsoft Teams via Azure OpenAI**. This approach is designed for customers who need to deploy their agent to **GCC High Teams** where native Copilot Studio integration may not be available.

**Total time: ~45 minutes**

**✅ Fully supports Azure Government (GCC High) deployments**

---

## 🚀 Quick Start

**New to this project?** Here's where to go:

- **Development Team**: Start with [Lab 1](./lab-1-setup/README.md) to set up your environment
- **Teams Administrators**: Review [Admin Guide for GCC High](./ADMIN-GUIDE-GCC-HIGH.md) for deployment approval process
- **Security/Compliance**: Check [GCC High FAQ](./GCC-HIGH-FAQ.md) for compliance details
- **Current Status**: This is a development-ready codebase that needs Azure Government migration for production

---

## Important: Understanding This Approach

### What This Lab Does

This is **NOT** a native Copilot Studio → Teams integration. Instead, it's a **migration path** that:

1. **Exports** your agent's configuration from Copilot Studio (instructions, behavior)
2. **Re-implements** the agent in Azure OpenAI (GCC High compatible)
3. **Deploys** to Teams via a custom bot

### Why Use This Approach?

**Scenario**: Your organization uses GCC High, but:
- Copilot Studio may not be available or fully featured in GCC High
- Native Copilot Studio → Teams integration isn't available in government clouds
- You need compliance with FedRAMP High / DoD IL4+ requirements
- You want full control over the deployment in your Azure Government tenant

**Solution**: Design your agent in Copilot Studio (commercial or if available in GCC High), then migrate it to Azure Government OpenAI and deploy to GCC High Teams using this lab.

---

## Architecture

```
┌──────────────────────┐      ┌─────────────────────┐      ┌──────────────────────┐
│  Copilot Studio      │      │  Azure OpenAI       │      │  Microsoft Teams     │
│  (Design/Export)     │  →   │  (GCC High)         │  →   │  (GCC High)          │
│  Commercial Cloud    │      │  Run Agent          │      │  User Interface      │
└──────────────────────┘      └─────────────────────┘      └──────────────────────┘
```

**One-time export** → **Deploy to compliant infrastructure** → **Use in GCC High Teams**

---

## Prerequisites

Before starting, you must have:

### Required:
- ✅ **Copilot Studio access** to export your agent's configuration
  - Access to [copilotstudio.microsoft.com](https://copilotstudio.microsoft.com) 
  - OR a text file with your agent's instructions if designed elsewhere
- ✅ **Azure Government subscription** (for GCC High deployments)
  - Access to [portal.azure.us](https://portal.azure.us)
  - Permissions to create Azure OpenAI and Bot Service resources
- ✅ **GCC High Teams** environment
  - Access to [teams.microsoft.us](https://teams.microsoft.us)
  - Ability to upload custom apps (may require admin approval)
- ✅ **Local development tools**
  - Node.js 18+ and npm
  - Git CLI
  - Basic TypeScript/JavaScript knowledge

### Optional:
- Azure CLI (`az` command) for authentication
- ngrok for local testing

### Important Notes:

**Copilot Studio in GCC High**: As of 2026, Copilot Studio may have limited availability in GCC High environments. If you don't have direct access:
- Design your agent in Commercial Copilot Studio
- Export the configuration (instructions, knowledge base)
- Deploy to GCC High Azure OpenAI using this lab

**Compliance**: This approach keeps all runtime operations in your GCC High tenant. Only the design/export happens in commercial cloud.

**Have Questions?** See the [GCC High FAQ](./GCC-HIGH-FAQ.md) for detailed answers about compliance, costs, capabilities, and more.

**Don't Have GCC High Access?** You can test everything in commercial Azure first! See [Testing Without GCC High](./TESTING-WITHOUT-GCC-HIGH.md) for a complete guide.

---

## ⚙️ Configuration Required

This repository contains **template files with placeholders** that you'll fill in during the labs:

- 🔧 **Azure OpenAI credentials** - Configured in Lab 2
- 🔧 **Microsoft App ID & Password** - Created in Lab 3  
- 🔧 **Teams manifest** - Updated with your App ID in Lab 3
- 🔧 **Agent instructions** - Customized with your Copilot Studio agent in Lab 2

**Don't worry!** Each lab walks you through exactly what to configure and when.

---

## Start Your Labs

Follow the three labs in order. Each lab is contained in its own folder with step-by-step instructions:

### 1. [Lab 1: Set Up Your Environment](./lab-1-setup/README.md) (10 min)
   - Clone repository
   - Install dependencies
   - Verify bot setup locally
   
### 2. [Lab 2: Export from Copilot Studio & Configure Azure OpenAI](./lab-2-foundry/README.md) (15 min)
   - Export your agent's instructions from Copilot Studio
   - Deploy GPT-4o model in Azure OpenAI
   - Configure bot with your agent's behavior
   
### 3. [Lab 3: Deploy to Teams](./lab-3-teams/README.md) (20 min)
   - Register bot in Azure
   - Test locally
   - Package and deploy to Microsoft Teams

---

## Quick Reference

### Repository Structure

```
lab-1-setup/                  # Lab 1: Environment setup
lab-2-foundry/                # Lab 2: Export & configure Azure OpenAI
lab-3-teams/                  # Lab 3: Deploy to Teams

teams-bot/                    # Your Teams bot code
├── src/
│   ├── index.ts             # Express server
│   └── handlers/claims.ts   # Azure OpenAI integration
├── package.json             # Dependencies
└── manifest.json            # Teams app configuration

corpus/
└── claims-corpus.md         # Sample agent instructions

GCC-HIGH-FAQ.md               # Detailed FAQ for GCC High deployments
KNOWLEDGE-SOURCES.md          # Guide for adding knowledge bases
```

### Key Resources

- **[GCC High FAQ](./GCC-HIGH-FAQ.md)**: Compliance, costs, capabilities, and common questions
- **[Testing Without GCC High](./TESTING-WITHOUT-GCC-HIGH.md)**: How to test in commercial Azure first
- **[Knowledge Sources Guide](./KNOWLEDGE-SOURCES.md)**: How to migrate Copilot Studio knowledge bases
- **[Entra Auth Setup](./ENTRA-AUTH-SETUP.md)**: Secure authentication (recommended for GCC High production)
- **[Admin Guide](./ADMIN-GUIDE-GCC-HIGH.md)**: For Teams administrators managing deployment
- **Labs 1-3**: Step-by-step deployment instructions

### Key Commands

```bash
# Lab 1: Setup
cd teams-bot && npm install && npm run dev

# Lab 3: Test locally
curl -X POST http://localhost:3978/message \
  -H "Content-Type: application/json" \
  -d '{"text":"What should I know about filing a claim?"}'
```

---

## GCC High Support

This lab **fully supports Azure Government (GCC High)** deployments:
- Use Azure Government portal for all resource creation
- Update endpoints to `.azure.us` domains
- Follow GCC High-specific notes in each lab
- See [Lab 2](./lab-2-foundry/README.md) for government cloud configuration

### Knowledge Sources

If your Copilot Studio agent uses knowledge bases (documents, files, websites), see [KNOWLEDGE-SOURCES.md](./KNOWLEDGE-SOURCES.md) for detailed guidance on recreating this in Azure OpenAI:
- **Option 1**: Embed knowledge in instructions (simplest, < 3KB knowledge)
- **Option 2**: Use Azure AI Search with RAG pattern (recommended for production)
- **Option 3**: Use Assistants API with file upload (if available in your region)

---

## Troubleshooting & Resources

Common issues are covered in each lab's README. For additional help:

- [Azure OpenAI Service](https://learn.microsoft.com/en-us/azure/ai-services/openai/)
- [Azure OpenAI Chat Completions API](https://learn.microsoft.com/en-us/azure/ai-services/openai/reference)
- [Teams Bot Development](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots)
- [Azure Government Documentation](https://learn.microsoft.com/en-us/azure/azure-government/
- [Teams Bot Development](https://learn.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots)
- [Teams App Manifest Schema](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema)

---

## Ready to Start?

Begin with **[Lab 1: Set Up Your Environment](./lab-1-setup/README.md)** →
