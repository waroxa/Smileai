# How to Get GoHighLevel Marketplace Credentials

## Option 1: Create a Real GHL Marketplace App (Recommended)

### Step 1: Create GoHighLevel Account

1. Go to https://www.gohighlevel.com/
2. Sign up for an account
3. Choose a plan (you need at least Agency plan to create marketplace apps)
4. Complete account setup

### Step 2: Access Marketplace Developer Portal

1. Login to GoHighLevel
2. Go to: https://marketplace.gohighlevel.com/
3. Click **"Developer"** or **"Build Apps"** in the navigation
4. If you don't see this option, you may need to:
   - Contact GHL support to enable developer access
   - Or use an Agency/SaaS account that has marketplace access

### Step 3: Create New App

1. Click **"Create New App"** or **"Add App"**
2. Fill in app details:
   - **App Name:** SmileVision Pro
   - **Description:** AI-powered smile transformation previews for dental practices
   - **Category:** Healthcare / Dental
   - **App Type:** Private or Public (choose Private for testing)

### Step 4: Configure OAuth Settings

In the app configuration:

1. **Redirect URLs** - Add:
   ```
   https://www.smilevisionpro.ai/oauth/callback
   ```

2. **Scopes** - Select these (copy exactly):
   ```
   locations.readonly
   locations/customFields.write
   locations/customFields.readonly
   locations/customValues.write
   locations/customValues.readonly
   contacts.write
   contacts.readonly
   forms.write
   forms.readonly
   ```

3. **App Distribution:**
   - Choose "Private" for testing
   - Can change to "Public" later for marketplace submission

### Step 5: Generate Client Credentials

1. After creating the app, go to **"Settings"** or **"OAuth Settings"**
2. Click **"Generate Credentials"** or **"Create Client Keys"**
3. You'll see:
   - **Client ID** - Long alphanumeric string (like: `abc123-def456-...`)
   - **Client Secret** - Longer secret key (like: `xyz789-secret-...`)
4. **⚠️ IMPORTANT:** Copy both immediately - the secret may only be shown once!

### Step 6: Add to Supabase

1. Go to Supabase Dashboard
2. Select your project
3. Go to **Edge Functions** → **Secrets**
4. Add three secrets:

```
GHL_CLIENT_ID=<paste_client_id_here>
GHL_CLIENT_SECRET=<paste_client_secret_here>
GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
```

5. Save each secret

---

## Option 2: Test Without GHL (Development Mode)

If you want to test the UI without GHL credentials yet:

### What Works:
- ✅ Admin page loads
- ✅ "Connect GoHighLevel" button appears
- ✅ UI is fully functional

### What Doesn't Work:
- ❌ OAuth flow (will show error)
- ❌ Can't actually connect to GHL
- ❌ API calls won't work

### To Enable Development Mode:

Just skip adding the credentials for now. The app will show:
- Error: "GHL OAuth credentials not configured"
- This is expected and safe for testing UI

---

## Option 3: Use Test Credentials (If Available)

If you have a GHL development/test account:

### From GHL Dashboard:

1. Login to your GHL account
2. Go to **Settings** → **Integrations** → **Developer Settings**
3. Or direct link: `https://app.gohighlevel.com/settings/integrations`
4. Look for "OAuth Apps" or "API Settings"
5. Create test credentials there

---

## Troubleshooting

### Can't Find Marketplace Developer Portal

**Problem:** No "Developer" or "Build Apps" option

**Solutions:**
- Check if you have Agency or SaaS Mode enabled
- Contact GHL support: support@gohighlevel.com
- Ask to enable developer/marketplace access
- May need to upgrade plan

### Don't Have GHL Account

**Problem:** Don't want to pay for GHL yet

**Solutions:**
1. **Request trial:** GHL offers 14-day trials
2. **Use test mode:** Test UI without credentials (see Option 2)
3. **Partner account:** Ask if GHL has partner/developer accounts
4. **Sandbox:** Ask GHL if they have a sandbox environment

### Can't Create Marketplace App

**Problem:** Account doesn't have permission

**Solutions:**
- Verify account type (needs Agency/SaaS Mode)
- Contact GHL support to enable marketplace access
- Check if company account vs personal account
- May need company verification

---

## What You Need Right Now

**For Testing:**
- You can test the UI immediately without credentials
- Page will load at `/admin/ghl-connect`
- Button will show error (expected)

**For Full OAuth:**
- Need GHL Marketplace account
- Need to create app and get Client ID/Secret
- Then add to Supabase secrets

---

## Quick Summary

| Have GHL Account? | Have Marketplace Access? | What to Do |
|-------------------|-------------------------|------------|
| ✅ Yes | ✅ Yes | Create app, get credentials, add to Supabase |
| ✅ Yes | ❌ No | Contact GHL support to enable marketplace |
| ❌ No | ❌ No | Sign up for GHL trial OR test UI without credentials |

---

## Testing Without Credentials

You can test right now without any GHL setup:

1. Navigate to: `https://www.smilevisionpro.ai/admin/ghl-connect`
2. You should see the admin dashboard
3. Click "Connect GoHighLevel" 
4. Will show error: "GHL OAuth credentials not configured"
5. This proves the UI works!

Later, when you get credentials:
1. Add them to Supabase secrets
2. Refresh page
3. OAuth will work

---

## Support Contacts

**GoHighLevel:**
- Support: support@gohighlevel.com
- Documentation: https://highlevel.stoplight.io/
- Community: https://www.facebook.com/groups/gohighlevel

**For Marketplace:**
- Ask about developer/marketplace access
- Request sandbox/test credentials
- Ask about partner programs

---

## Next Steps

### Right Now (Without Credentials):
1. ✅ Navigate to `/admin/ghl-connect`
2. ✅ Verify page loads
3. ✅ See the UI and layout
4. ✅ Test that button triggers error (expected)

### When You Get Credentials:
1. Add to Supabase Edge Function Secrets
2. Reload page
3. Click "Connect GoHighLevel"
4. Complete OAuth flow
5. Test full integration

---

**Important:** You DON'T need credentials to verify the code works! The page will load and show you everything except the actual OAuth connection.

**Timeline:**
- UI Testing: 5 minutes (now)
- Get GHL Account: 15-30 minutes (trial signup)
- Get Marketplace Access: 1-3 days (support request)
- Create App & Get Keys: 10 minutes (once access granted)
- Full Testing: 15 minutes (after credentials added)
