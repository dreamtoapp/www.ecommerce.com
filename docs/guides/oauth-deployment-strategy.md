# Safe OAuth Deployment Strategy

## 🛡️ Zero-Downtime OAuth URL Updates

### Strategy Overview
Never remove old callback URLs until new ones are confirmed working. Use a phased approach to prevent service disruption.

## 📋 Phase 1: Preparation (Before Deployment)

### 1. Google OAuth Console Setup
```
Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client IDs

Current Authorized redirect URIs:
✅ http://localhost:3000/api/auth/callback/google
✅ https://your-current-domain.vercel.app/api/auth/callback/google

ADD (don't replace):
✅ https://your-new-domain.vercel.app/api/auth/callback/google
✅ https://www.yourdomain.com/api/auth/callback/google
✅ https://yourdomain.com/api/auth/callback/google
```

### 2. Multiple Environment Approach (Recommended)
Create separate OAuth clients for different environments:

#### Development OAuth Client
```
Name: "YourApp - Development"
Authorized redirect URIs:
- http://localhost:3000/api/auth/callback/google
- http://localhost:3001/api/auth/callback/google
```

#### Staging OAuth Client  
```
Name: "YourApp - Staging"
Authorized redirect URIs:
- https://staging-yourapp.vercel.app/api/auth/callback/google
- https://preview-*.vercel.app/api/auth/callback/google
```

#### Production OAuth Client
```
Name: "YourApp - Production"
Authorized redirect URIs:
- https://yourdomain.com/api/auth/callback/google
- https://www.yourdomain.com/api/auth/callback/google
```

## 🚀 Phase 2: Vercel Environment Variables

### Environment-Specific Configuration

#### Development (.env.local)
```bash
GOOGLE_CLIENT_ID=dev_client_id
GOOGLE_CLIENT_SECRET=dev_client_secret
NEXTAUTH_URL=http://localhost:3000
```

#### Staging (Vercel Environment Variables)
```bash
# Environment: Preview
GOOGLE_CLIENT_ID=staging_client_id
GOOGLE_CLIENT_SECRET=staging_client_secret
NEXTAUTH_URL=https://staging-yourapp.vercel.app
```

#### Production (Vercel Environment Variables)
```bash
# Environment: Production
GOOGLE_CLIENT_ID=production_client_id
GOOGLE_CLIENT_SECRET=production_client_secret
NEXTAUTH_URL=https://yourdomain.com
```

## 🔧 Phase 3: Dynamic Configuration (Advanced)

### Smart Environment Detection
```typescript
// lib/auth-config.ts
const getAuthConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  const isPreview = process.env.VERCEL_ENV === 'preview';
  const isProduction = process.env.VERCEL_ENV === 'production';
  
  if (isDev) {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID_DEV!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_DEV!,
      redirectUri: 'http://localhost:3000/api/auth/callback/google'
    };
  }
  
  if (isPreview) {
    return {
      clientId: process.env.GOOGLE_CLIENT_ID_STAGING!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET_STAGING!,
      redirectUri: `${process.env.VERCEL_URL}/api/auth/callback/google`
    };
  }
  
  return {
    clientId: process.env.GOOGLE_CLIENT_ID_PRODUCTION!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET_PRODUCTION!,
    redirectUri: 'https://yourdomain.com/api/auth/callback/google'
  };
};
```

## 📱 Phase 4: Testing Strategy

### 1. Local Testing
```bash
# Test development OAuth
npm run dev
# Visit: http://localhost:3000
# Try Google login
```

### 2. Preview Testing
```bash
# Deploy to preview branch
git push origin feature/oauth-update
# Visit Vercel preview URL
# Test Google login on preview deployment
```

### 3. Production Testing
```bash
# After production deployment
# Test Google login on live site
# Monitor for any OAuth errors
```

## 🛠️ Phase 5: Deployment Steps

### Step-by-Step Deployment
```bash
# 1. Update OAuth URLs in Google Console (ADD, don't remove)
# 2. Set environment variables in Vercel
# 3. Deploy to preview first
# 4. Test OAuth on preview
# 5. Deploy to production
# 6. Test OAuth on production
# 7. Remove old URLs after 24-48 hours
```

## 🚨 Troubleshooting Common Issues

### Issue 1: "redirect_uri_mismatch" Error
```
Error: The redirect URI in the request does not match the ones authorized for the OAuth client.

Solution:
1. Check exact URL in browser address bar
2. Ensure URL in Google Console matches exactly
3. Check for trailing slashes, www vs non-www
4. Verify NEXTAUTH_URL environment variable
```

### Issue 2: Wrong Environment Variables
```
Error: OAuth client not found or unauthorized

Solution:
1. Verify environment variables are set correctly in Vercel
2. Check which environment (dev/preview/production) is being used
3. Ensure client ID and secret match the environment
```

### Issue 3: HTTPS vs HTTP Issues
```
Error: OAuth only works with HTTPS in production

Solution:
1. Always use HTTPS URLs for production OAuth callbacks
2. Update NEXTAUTH_URL to use HTTPS
3. Ensure your domain has valid SSL certificate
```

## 📊 Monitoring and Verification

### Verification Checklist
- [ ] Development OAuth works locally
- [ ] Preview OAuth works on Vercel preview URLs
- [ ] Production OAuth works on live domain
- [ ] All environment variables are correctly set
- [ ] No console errors during OAuth flow
- [ ] User sessions persist correctly

### Monitoring Tools
```typescript
// Add OAuth monitoring
export async function signIn(provider: string) {
  try {
    const result = await signIn(provider);
    console.log('OAuth success:', { provider, timestamp: new Date() });
    return result;
  } catch (error) {
    console.error('OAuth error:', { provider, error, timestamp: new Date() });
    // Optional: Send to monitoring service
    throw error;
  }
}
```

## 🔄 Rollback Strategy

### If Something Goes Wrong
1. **Immediate Fix**: Revert to previous OAuth URLs
2. **Environment Variables**: Switch back to working client ID/secret
3. **Code Rollback**: Use Vercel instant rollback feature
4. **DNS**: If domain issues, use Vercel domain temporarily

### Emergency OAuth URLs
Keep these working as backup:
```
https://your-app-backup.vercel.app/api/auth/callback/google
```

## 🎯 Best Practices Summary

1. **Never remove old URLs immediately** - Add new ones first
2. **Use separate OAuth clients** for different environments  
3. **Test thoroughly** on preview before production
4. **Monitor OAuth flows** after deployment
5. **Have a rollback plan** ready
6. **Update URLs gradually** over 24-48 hours
7. **Use environment-specific configurations**

This strategy ensures zero downtime and prevents OAuth-related crashes during deployment. 