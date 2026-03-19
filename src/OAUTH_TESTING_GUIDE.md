# platform OAuth Testing Guide

## Prerequisites Checklist

Before testing, ensure you have:

- [ ] Applied database migration (`001_create_ghl_connections.sql`)
- [ ] Added environment variables to Supabase
- [ ] Created marketplace portal app (or have test credentials)
- [ ] Deployed Edge Functions
- [ ] Added routing for admin dashboard

---

## Step 1: Apply Database Migration

### Via Supabase Dashboard (Easiest)

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**
5. Copy entire contents of `/supabase/migrations/001_create_ghl_connections.sql`
6. Paste and click **Run**
7. Should see: "Success. No rows returned"

### Verify Tables Created

1. Go to **Database** → **Tables** (left sidebar)
2. You should see 4 new tables:
   - `ghl_connections`
   - `ghl_oauth_states`
   - `ghl_audit_log`
   - `ghl_videos`

3. Click each table to verify structure

---

## Step 2: Add Environment Variables

### In Supabase Dashboard

1. Go to **Edge Functions** → **Secrets**
2. Add these secrets:

```
GHL_CLIENT_ID=<your_client_id_from_marketplace>
GHL_CLIENT_SECRET=<your_client_secret_from_marketplace>
GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
```

### Get platform Credentials

**Option A: Create Real marketplace portal App**

1. Go to https://marketplace.gohighlevel.com/
2. Sign up/login
3. Create new app
4. Set redirect URL: `https://www.smilevisionpro.ai/oauth/callback`
5. Set scopes (see `/GHL_OAUTH_CONFIG.md` for list)
6. Generate client keys
7. Copy `Client ID` and `Client Secret`

**Option B: Use Test Mode (For Development)**

If you don't have platform access yet, you can test the UI flow:
- Leave secrets empty for now
- Test will show error at token exchange (expected)
- You can still verify UI, routing, and database setup

---

## Step 3: Add Admin Route

Update `/App.tsx` to add the OAuth admin route:

### Find the routing section

Look for where routes are handled (probably around `if (path === '/privacy')` etc)

### Add this route:

```typescript
import { GHLOAuthConnect } from './components/admin/GHLOAuthConnect';

// In your routing logic:
if (path === '/admin/ghl-connect') {
  return <GHLOAuthConnect />;
}
```

---

## Step 4: Test OAuth Flow (With Real platform)

### 4.1 Start OAuth Flow

1. Navigate to: `https://www.smilevisionpro.ai/admin/ghl-connect`

2. You should see:
   - "Platform OAuth Connection" header
   - "Connect Platform" button
   - No connections yet message

3. Click **"Connect Platform"** button

### 4.2 Verify Authorization URL

**What should happen:**
- Browser redirects to platform authorization page
- URL should look like:
  ```
  https://marketplace.gohighlevel.com/oauth/chooselocation?
    client_id=xxx&
    redirect_uri=https://www.smilevisionpro.ai/oauth/callback&
    response_type=code&
    scope=locations.readonly%20...&
    state=abc123...
  ```

**Verify in browser:**
- Check URL parameters are present
- State parameter is a long random string

### 4.3 Authorize in platform

1. Login to platform (if not already)
2. Select a location (sub-account)
3. Review permissions requested
4. Click "Authorize" or "Allow"

### 4.4 Verify Callback

**What should happen:**
- Redirects back to: `https://www.smilevisionpro.ai/admin/ghl-connect?success=true&locationId=xxx&locationName=xxx`
- Green success message appears
- Location appears in "Connected Locations" list

### 4.5 Verify in Database

Open Supabase Dashboard → SQL Editor:

```sql
-- Check OAuth connection was saved
SELECT 
  location_id,
  location_name,
  expires_at,
  scope,
  created_at
FROM ghl_connections;
```

**Should return:**
- One row with your location data
- `expires_at` should be ~3600 seconds in future
- `scope` should show all requested scopes

```sql
-- Check audit log
SELECT 
  action,
  location_id,
  details,
  created_at
FROM ghl_audit_log
ORDER BY created_at DESC;
```

**Should show:**
- Action: `oauth_connected`
- Your location_id
- Details with location name and scope

```sql
-- Check OAuth state was cleaned up
SELECT * FROM ghl_oauth_states;
```

**Should return:**
- Empty (state deleted after use)

---

## Step 5: Test Token Refresh

### Manual Refresh

1. In admin dashboard, find your connected location
2. Click **"Refresh"** button

**Expected result:**
- Success message appears
- Token refreshed

### Verify in Database

```sql
SELECT 
  location_id,
  updated_at,
  expires_at
FROM ghl_connections;
```

**Should show:**
- `updated_at` changed to now
- `expires_at` extended by ~3600 seconds

### Check Audit Log

```sql
SELECT * FROM ghl_audit_log 
WHERE action = 'token_refreshed' 
ORDER BY created_at DESC;
```

---

## Step 6: Test API Endpoints

### Test Forms Endpoint

```bash
# Replace with your values
PROJECT_ID="your-supabase-project-id"
ANON_KEY="your-supabase-anon-key"
LOCATION_ID="your-location-id"

curl "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/forms?locationId=${LOCATION_ID}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Expected response:**
```json
{
  "success": true,
  "forms": [
    {
      "id": "form_xxx",
      "name": "Contact Form",
      ...
    }
  ]
}
```

### Test Custom Fields Setup

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/setup-custom-fields" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"locationId\":\"${LOCATION_ID}\"}"
```

**Expected response:**
```json
{
  "success": true,
  "createdFields": [
    {
      "id": "field_xxx",
      "name": "Smile Before Image",
      ...
    }
  ],
  "message": "Created 5 custom fields"
}
```

### Test Save Video

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "locationId": "'${LOCATION_ID}'",
    "videoData": {
      "url": "https://example.com/test-video.mp4",
      "title": "Test Smile Transformation",
      "tags": ["test"],
      "contactId": "contact_test123"
    }
  }'
```

**Verify in database:**
```sql
SELECT * FROM ghl_videos ORDER BY created_at DESC LIMIT 5;
```

---

## Step 7: Test Disconnect

1. In admin dashboard, find your connection
2. Click **"Disconnect"** button
3. Confirm the dialog

**Expected:**
- Connection removed from list
- Success message appears

**Verify in database:**
```sql
-- Should be empty or not show your location
SELECT * FROM ghl_connections WHERE location_id = 'your_location_id';

-- Should show disconnect action
SELECT * FROM ghl_audit_log 
WHERE action = 'oauth_disconnected' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## Step 8: Test Without platform (UI Only)

If you don't have platform credentials yet, you can still test:

### Test UI Rendering

1. Navigate to `/admin/ghl-connect`
2. Should see admin dashboard
3. Should see "Connect Platform" button

### Test OAuth Initiate (Will Fail)

1. Click "Connect Platform"
2. Will show error: "platform OAuth credentials not configured"
3. This is expected - proves UI works

### Add Mock Environment Variables

Just to test the flow (won't actually work):

```
GHL_CLIENT_ID=test_client_id
GHL_CLIENT_SECRET=test_client_secret
```

Now clicking "Connect" will:
- Generate authorization URL
- Redirect to platform
- Fail at platform (invalid credentials)
- But proves your code works!

---

## Testing Checklist

### Database
- [ ] Migration applied successfully
- [ ] All 4 tables exist
- [ ] Can insert test data manually
- [ ] Indexes created

### Environment
- [ ] GHL_CLIENT_ID set
- [ ] GHL_CLIENT_SECRET set
- [ ] GHL_REDIRECT_URI set
- [ ] Edge Function redeployed

### Frontend
- [ ] Admin route accessible
- [ ] UI renders correctly
- [ ] "Connect" button works
- [ ] Shows error if not configured

### OAuth Flow (Full)
- [ ] Initiate redirects to platform
- [ ] State parameter generated
- [ ] Can authorize in platform
- [ ] Callback returns successfully
- [ ] Success message shown
- [ ] Connection appears in list
- [ ] Database has connection record
- [ ] Audit log has entry

### Token Management
- [ ] Can refresh token manually
- [ ] Auto-refresh works (wait 55min or change expires_at)
- [ ] Database updated_at changes
- [ ] New expires_at calculated

### API Endpoints
- [ ] Can fetch forms
- [ ] Can create custom fields
- [ ] Can save videos
- [ ] Can fetch audit log
- [ ] Errors handled gracefully

### Disconnect
- [ ] Disconnect confirmation works
- [ ] Connection removed from DB
- [ ] Audit log records disconnect

---

## Common Issues & Solutions

### Issue: "Failed to initiate OAuth"

**Solution:**
- Check environment variables set in Supabase
- Verify Edge Function deployed
- Check browser console for errors

### Issue: "Invalid or expired state"

**Causes:**
- Took more than 5 minutes from clicking Connect to authorizing
- Database migration not applied
- State table not created

**Solution:**
- Try again (click Connect, authorize faster)
- Verify `ghl_oauth_states` table exists
- Check table has insert permissions

### Issue: "Token exchange failed"

**Causes:**
- Invalid CLIENT_ID or CLIENT_SECRET
- Redirect URL mismatch
- Code expired

**Solution:**
- Double-check credentials in Supabase secrets
- Verify redirect URL matches exactly in marketplace portal
- Try OAuth flow again

### Issue: "No locationId in response"

**Causes:**
- platform didn't return location info
- User didn't select a location

**Solution:**
- Make sure you select a location during OAuth
- Check marketplace portal app is approved

### Issue: Connection appears but API calls fail

**Causes:**
- Token expired
- Insufficient scopes

**Solution:**
- Click "Refresh" button
- Check scopes in marketplace portal match required list
- Reconnect with new scopes

---

## Browser Console Testing

### Check Network Tab

1. Open DevTools → Network
2. Click "Connect Platform"
3. Should see:
   - POST to `/oauth/initiate`
   - Response with `authUrl`
   - Redirect to platform

4. After authorizing:
   - GET to `/oauth/callback?code=xxx&state=xxx`
   - Redirect back to admin

### Check Console Logs

Server logs (Supabase Edge Functions → Logs):
```
🔐 OAuth flow initiated with state: abc123...
📥 OAuth callback received
   Code: present
   State: abc123...
🔄 Exchanging code for tokens...
✅ Tokens received
   Access token: present
   Refresh token: present
✅ OAuth connection saved for location: loc_xxx
```

---

## Quick Test Script

Create a test file to automate testing:

```typescript
// test-oauth.ts
const baseUrl = 'https://your-project.supabase.co/functions/v1/make-server-1ddb0231';
const anonKey = 'your-anon-key';
const locationId = 'your-location-id';

// Test 1: Check status
const status = await fetch(`${baseUrl}/oauth/status`, {
  headers: { 'Authorization': `Bearer ${anonKey}` }
});
console.log('Status:', await status.json());

// Test 2: Fetch forms
const forms = await fetch(`${baseUrl}/ghl/forms?locationId=${locationId}`, {
  headers: { 'Authorization': `Bearer ${anonKey}` }
});
console.log('Forms:', await forms.json());

// Test 3: Fetch audit log
const audit = await fetch(`${baseUrl}/ghl/audit?locationId=${locationId}`, {
  headers: { 'Authorization': `Bearer ${anonKey}` }
});
console.log('Audit:', await audit.json());
```

---

## Success Criteria

OAuth implementation is working if:

✅ Can click "Connect Platform"  
✅ Redirects to platform authorization  
✅ After authorizing, returns to admin dashboard  
✅ Success message appears  
✅ Location shows in connected list  
✅ Database has connection record  
✅ Can refresh token  
✅ Can call platform API endpoints  
✅ Audit log tracks all actions  
✅ Can disconnect successfully  

---

## Next Steps After Testing

Once OAuth works:

1. **Integrate with your smile transformation flow**
   - Save before/after images to custom fields
   - Save video URL to platform contact
   - Create contact in platform when user submits

2. **Setup custom fields automatically**
   - Call `/ghl/setup-custom-fields` on first connection
   - Map form fields to custom fields

3. **Add form submission integration**
   - When user submits smile transformation
   - Create/update platform contact
   - Save images and video to custom fields
   - Track in workflow

4. **Production hardening**
   - Replace base64 encryption with real encryption
   - Add rate limiting
   - Add monitoring
   - Add user authentication
   - Test token refresh edge cases

---

## Need Help?

**Check logs:**
- Supabase Dashboard → Edge Functions → Logs
- Browser DevTools → Console
- Browser DevTools → Network

**Verify database:**
- Supabase Dashboard → SQL Editor
- Run queries from this guide

**Test incrementally:**
- Start with UI rendering
- Then OAuth initiate
- Then full flow
- Then API calls

**Documentation:**
- `/GHL_OAUTH_CONFIG.md` - Configuration details
- `/GHL_OAUTH_README.md` - Complete guide
- `/DATABASE_OAUTH_COMPLETE.md` - Database info

---

**Testing Date:** February 7, 2026  
**Status:** Ready to test  
**Estimated Time:** 15-30 minutes for full test
