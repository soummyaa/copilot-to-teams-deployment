# GCC High Administrator Quick Start Guide

## For Teams Administrators

This guide is for GCC High Teams administrators who need to approve and deploy the Claims Assistant bot.

---

## 📋 What You're Approving

**App Name**: Claims Assistant  
**App ID**: Provided by development team (unique per environment)  
**Purpose**: AI-powered assistant for insurance claims questions  
**Deployment**: Custom Teams app for GCC High environment  

---

## ⚠️ Important: Two-Phase Deployment

### Phase 1: Development (Current)
- **Environment**: Commercial Azure (non-GCC High)
- **Purpose**: Development and testing only
- **App ID**: Development team will provide
- **Status**: Complete, ready for testing in commercial Teams

### Phase 2: Production (Required for GCC High)
- **Environment**: Azure Government
- **Purpose**: Production deployment for GCC High Teams
- **App ID**: Will be different (new registration required)
- **Status**: Pending - requires Azure Government resources

---

## 🚀 Deployment Options for Your Organization

### Option A: Allow Custom App Upload (Testing)
**Quickest for POC/Testing**

1. Go to [Teams Admin Center](https://admin.teams.microsoft.com) (commercial) or [GCC High Admin Center](https://admin.teams.microsoft.us)
2. Navigate to **Teams apps** → **Setup policies**
3. Select or create a policy
4. Enable **"Allow user to upload custom apps"**
5. Assign policy to test users

**Pros**: Fast, good for testing  
**Cons**: Not ideal for org-wide deployment  

### Option B: Upload to Org Catalog (Recommended)
**Best for Production**

1. Get `ClaimsAssistant.zip` from development team
2. Go to Teams Admin Center → **Teams apps** → **Manage apps**
3. Click **"Upload"** → **"Upload new app"**
4. Select `ClaimsAssistant.zip`
5. Set availability:
   - **Specific users/groups**: Pilot group
   - **Everyone**: Org-wide deployment
6. Click **"Submit"**

**Pros**: Centralized control, better for compliance  
**Cons**: Requires more admin involvement  

### Option C: Whitelist Specific App ID
**Balanced Approach**

1. Go to Teams Admin Center → **Teams apps** → **Permission policies**
2. Create or edit a policy
3. Under **Custom apps**, select **"Allow specific apps and block all others"**
4. Click **"Allow apps"** and add the App ID provided by development team
5. Assign policy to relevant users

**Pros**: Controlled access, doesn't require app package  
**Cons**: Users still need the package file  

---

## 🏛️ GCC High Specific Requirements

### Before Production Deployment
Development team must complete:

1. **Migrate to Azure Government**
   - Create Azure OpenAI in portal.azure.us
   - Use USGov Virginia or USGov Arizona regions
   - Deploy in Azure Government App Service

2. **Register New Bot**
   - New bot registration in Azure Government
   - New App ID (different from development environment)
   - Update Teams manifest with government bot credentials

3. **Provide You**
   - New `ClaimsAssistant.zip` with government App ID
   - Documentation of government cloud resources
   - Compliance verification

### Your Deployment Steps (GCC High)
Once development team provides government-ready package:

1. **Verify Compliance**
   - Confirm all resources in Azure Government
   - Verify data residency (USGov regions)
   - Check FedRAMP High alignment

2. **Deploy to GCC High Teams**
   - Use [admin.teams.microsoft.us](https://admin.teams.microsoft.us)
   - Upload new package to org catalog
   - Set appropriate availability policies

3. **Test Before Rollout**
   - Assign to pilot group first
   - Verify bot responds in teams.microsoft.us
   - Confirm no data leaves government boundary

---

## 🔍 What to Check

### Security Checklist
- [ ] All Azure resources in Azure Government (portal.azure.us)
- [ ] Bot hosted in USGov regions
- [ ] No connections to commercial Azure services
- [ ] Managed Identity used (no API keys in code)
- [ ] All secrets in Azure Key Vault (government instance)

### Compliance Checklist
- [ ] FedRAMP High compliant services only
- [ ] Data residency requirements met
- [ ] Audit logging enabled
- [ ] Access controls configured
- [ ] Incident response plan documented

### Functional Checklist
- [ ] Bot responds to messages
- [ ] No errors in bot framework logs
- [ ] Response times acceptable
- [ ] User authentication works
- [ ] Appropriate error handling

---

## 📞 Questions to Ask Development Team

Before approving for production:

1. **"Have all resources been migrated to Azure Government?"**
   - Expected: Yes, with portal.azure.us screenshots

2. **"What is the new App ID for the government bot?"**
   - Expected: New GUID for government cloud deployment

3. **"Where is the bot hosted?"**
   - Expected: Azure Government App Service in USGov region

4. **"How is authentication handled?"**
   - Expected: Managed Identity with government Entra ID

5. **"Where does data get processed?"**
   - Expected: Azure OpenAI in Azure Government only

6. **"What's the disaster recovery plan?"**
   - Expected: Documented backup/recovery in government cloud

---

## 🚫 Common Issues & Solutions

### Issue: "App installation blocked by policy"
**Cause**: Custom app uploads disabled  
**Solution**: Enable via Setup policies or use org catalog

### Issue: "Bot doesn't respond"
**Cause**: Messaging endpoint not configured or unreachable  
**Solution**: Verify bot registration has correct endpoint URL

### Issue: "Authentication errors"
**Cause**: Wrong cloud configuration or missing permissions  
**Solution**: Verify AZURE_CLOUD=government and managed identity roles

### Issue: "Data residency concerns"
**Cause**: Resources in wrong cloud  
**Solution**: All must be in Azure Government, verify with development team

---

## 📋 Approval Template

When development team requests production approval, use this checklist:

```
Claims Assistant Bot - Production Approval

App Name: Claims Assistant
Requested By: [Name]
Date: [Date]

Development Phase:
✅ Code review completed
✅ Security scan passed
✅ Testing completed in commercial environment

Government Cloud Migration:
□ All resources in Azure Government (portal.azure.us)
□ Bot hosted in USGov Virginia/Arizona
□ New App ID provided: _______________
□ Data residency verified
□ FedRAMP High compliance confirmed

Teams Deployment:
□ Updated Teams package received
□ Pilot deployment successful
□ User acceptance testing complete
□ Documentation provided

Approval Decision:
□ Approved for production
□ Approved for pilot only
□ Denied - reasons: _______________

Approved By: _______________
Date: _______________
```

---

## 📚 Additional Resources

- **GCC High Overview**: [Microsoft Docs](https://learn.microsoft.com/microsoftteams/plan-for-government-gcc-high)
- **Azure Government**: [Documentation](https://learn.microsoft.com/azure/azure-government/)
- **Bot Framework**: [Government Cloud Support](https://learn.microsoft.com/azure/bot-service/)

---

## 🆘 Need Help?

Contact:
- **Development Team**: For technical questions about the bot
- **Microsoft Support**: For GCC High Teams configuration
- **Your Compliance Team**: For FedRAMP/compliance verification

---

**Document Version**: 1.0  
**Last Updated**: January 13, 2026  
**For**: GCC High Teams Administrators
