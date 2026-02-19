# 🚀 Deployment Checklist - OAuth Fix

## ✅ Changes Made

- [x] Updated frontend component with API wrapper
- [x] Changed backend route from POST to GET
- [x] Backend now returns 302 redirects
- [x] Frontend handles redirects properly

---

## 📋 Deployment Steps

### 1. Deploy Backend Changes

```bash
# Navigate to your project
cd <your-project-directory>

# Deploy the Supabase Edge Function
supabase functions deploy make-server-c5a5d193
```

**What this does:**
- Deploys updated OAuth routes
- GET /oauth/start now works
- Returns proper redirects

---

### 2. Verify Environment Variables

Make sure these are set in **Supabase Dashboard → Edge Functions → Secrets**:

```
GHL_CLIENT_ID=<your_client_id>
GHL_CLIENT_SECRET=<your_client_secret>
GHL_REDIRECT_URI=https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/callback
```

---

### 3. Test Backend Endpoint

```bash
# Replace YOUR_ANON_KEY with your actual Supabase anon key
curl -v \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/start

# Expected response:
# HTTP/1.1 302 Found
# Location: https://marketplace.gohighlevel.com/oauth/chooselocation?...
```

---

### 4. Test Frontend

1. **Open your app:**
   ```
   https://www.smilevisionpro.ai/admin/ghl-connect
   ```

2. **Click "Connect GoHighLevel"**
   - Should redirect to GHL authorization page
   - If it doesn't, check browser console for errors

3. **Authorize in GHL**
   - Select a location
   - Click "Allow"

4. **Verify redirect back**
   - Should return to: `/admin/ghl-connect?success=true&locationId=xxx`
   - Should see green success banner
   - Connection should appear in list

---

### 5. Check Database

Verify data was saved:

```sql
-- Check OAuth connections
SELECT * FROM ghl_connections;

-- Check audit log
SELECT * FROM ghl_audit_log ORDER BY created_at DESC LIMIT 5;
```

---

## 🐛 Troubleshooting

### Issue: "Connect" button does nothing

**Check:**
```javascript
// Open browser console
console.log('Testing API...');
fetch('https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/start', {
  headers: { 'Authorization': 'Bearer YOUR_ANON_KEY' }
})
.then(r => console.log('Response:', r.status, r.headers.get('location')))
.catch(console.error);
```

**Possible causes:**
- Backend not deployed
- Wrong anon key
- CORS issues

---

### Issue: Redirects but doesn't come back

**Check:**
- GHL_REDIRECT_URI matches exactly:
  ```
  https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/callback
  ```
- GHL Marketplace app has same redirect URI
- Check Supabase Edge Function logs

---

### Issue: Error after GHL authorization

**Check Supabase logs:**
1. Go to: Supabase Dashboard → Edge Functions
2. Click: `make-server-c5a5d193`
3. Click: "Logs" tab
4. Look for errors in `/oauth/callback` route

**Common issues:**
- State validation failed (expired or invalid)
- Token exchange failed (wrong credentials)
- Database error (table doesn't exist)

---

### Issue: "Missing authorization header"

**Fix:** Make sure frontend includes header:
```typescript
await fetch(url, {
  headers: {
    'Authorization': `Bearer ${publicAnonKey}`
  }
});
```

---

## ✅ Success Indicators

You'll know it's working when:

1. **Click "Connect"** → Browser redirects to GHL
2. **Authorize in GHL** → Redirects back to your app
3. **Success banner** → Shows "✅ GoHighLevel Connected!"
4. **Connection card** → Appears with location name and ID
5. **Database** → Has entry in `ghl_connections` table

---

## 📊 Monitoring

### Check Logs
```bash
# View Edge Function logs
supabase functions logs make-server-c5a5d193 --follow
```

### Check Database
```sql
-- Connection count
SELECT COUNT(*) FROM ghl_connections;

-- Recent audit entries
SELECT 
  action,
  location_id,
  created_at,
  details
FROM ghl_audit_log
ORDER BY created_at DESC
LIMIT 10;
```

---

## 🔐 Security Checklist

- [ ] GHL_CLIENT_SECRET in Supabase secrets (not frontend)
- [ ] SUPABASE_SERVICE_ROLE_KEY never exposed
- [ ] OAuth tokens encrypted in database
- [ ] State validation enabled
- [ ] Audit logging working
- [ ] Token auto-refresh enabled

---

## 📝 Quick Reference

### Frontend API Wrapper
```typescript
// Connect
await API.startOAuth();

// Get connections
const data = await API.getStatus();

// Disconnect
await API.disconnect(locationId);

// Refresh token
await API.refresh(locationId);
```

### Backend Endpoints
```
GET  /oauth/start      - Start OAuth (redirects to GHL)
GET  /oauth/callback   - Handle callback (redirects to frontend)
GET  /oauth/status     - Get connections list
POST /oauth/disconnect - Disconnect location
POST /oauth/refresh    - Refresh token
```

---

## 🎯 Final Test Sequence

1. Deploy backend: ✅
2. Test endpoint with curl: ✅
3. Open /admin/ghl-connect: ✅
4. Click "Connect GoHighLevel": ✅
5. Authorize in GHL: ✅
6. Redirected back with success: ✅
7. Connection appears in list: ✅
8. Database has entry: ✅

**All checks pass?** You're done! 🎉

---

## 📞 Support

If you encounter issues:

1. **Check Supabase logs** (most common issues show here)
2. **Check browser console** (frontend errors)
3. **Verify environment variables** (missing credentials)
4. **Test endpoints individually** (isolate the problem)

**Need help?** Check:
- `/SOLUTION_STATIC_SITE_OAUTH.md` - Detailed explanation
- `/QUICK_REFERENCE.md` - Quick commands
- Supabase Edge Function logs - Real-time errors
