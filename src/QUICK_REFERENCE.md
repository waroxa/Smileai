# Quick Reference - GoHighLevel OAuth

## ✅ What Was Done

### Frontend (COMPLETE)
- Updated `/components/admin/GHLOAuthConnect.tsx`
- Removed all Supabase URLs
- Removed all auth headers
- Uses public endpoints only

### Backend (NEEDS UPDATE)
- Routes need to accept public access
- Remove auth header requirements
- Already has correct logic

---

## Public Endpoints

| Route | Method | Purpose |
|-------|--------|---------|
| `/oauth/start` | GET | Start OAuth (redirects to GHL) |
| `/oauth/callback` | GET | Handle callback (redirects to frontend) |
| `/oauth/status` | GET | Get connections list (returns JSON) |
| `/oauth/disconnect` | POST | Disconnect location (returns JSON) |
| `/oauth/refresh` | POST | Refresh token (returns JSON) |

---

## Frontend Code

### Connect Button
```typescript
const handleConnect = () => {
  window.location.href = '/oauth/start';
};
```

### Load Connections
```typescript
const loadConnections = async () => {
  const response = await fetch('/oauth/status');
  const data = await response.json();
  setConnections(data.connections);
};
```

### Parse Callback
```typescript
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const success = params.get('success');
  const locationId = params.get('locationId');
  const locationName = params.get('locationName');
  
  if (success === 'true') {
    setSuccess(`✅ Connected to ${locationName}!`);
    loadConnections();
  }
}, []);
```

---

## Backend Updates Needed

### 1. Change Route Name
**Before:**
```typescript
app.post("/make-server-c5a5d193/oauth/initiate", async (c) => {
```

**After:**
```typescript
app.get("/make-server-c5a5d193/oauth/start", async (c) => {
```

### 2. Return Redirect (not JSON)
**Before:**
```typescript
return c.json({
  success: true,
  authUrl: authUrl.toString(),
});
```

**After:**
```typescript
return c.redirect(authUrl.toString());
```

### 3. Remove Auth Headers
**Before:**
```typescript
app.get("/make-server-c5a5d193/oauth/status", async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  // ...
});
```

**After:**
```typescript
app.get("/make-server-c5a5d193/oauth/status", async (c) => {
  // No auth check - public endpoint
  const supabase = getSupabase();
  // ...
});
```

---

## Testing

### 1. Test Connect Flow
```bash
# Open in browser:
https://www.smilevisionpro.ai/admin/ghl-connect

# Click "Connect GoHighLevel"
# Should redirect to: /oauth/start
# Then to: GHL authorization
# Then back to: /admin/ghl-connect?success=true
```

### 2. Test Status Endpoint
```bash
curl https://www.smilevisionpro.ai/oauth/status

# Expected response:
{
  "success": true,
  "connections": [],
  "count": 0
}
```

### 3. Test in DevTools
```javascript
// Open console on /admin/ghl-connect
fetch('/oauth/status')
  .then(r => r.json())
  .then(console.log);

// Should see connections list
```

---

## Environment Variables

### Supabase Secrets
```bash
GHL_CLIENT_ID=<your_client_id_from_ghl>
GHL_CLIENT_SECRET=<your_client_secret_from_ghl>
GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
```

### GHL Marketplace App
**Redirect URI:**
```
https://www.smilevisionpro.ai/oauth/callback
```

---

## Troubleshooting

### Frontend redirects but nothing happens
- Check backend `/oauth/start` endpoint exists
- Check it returns 302 redirect (not JSON)
- Check DevTools Network tab for errors

### GHL callback fails
- Check `GHL_REDIRECT_URI` matches exactly
- Check GHL Marketplace app redirect URI
- Check backend `/oauth/callback` endpoint exists

### Connections don't load
- Check `/oauth/status` endpoint exists
- Check it returns JSON (not redirect)
- Check database has `ghl_connections` table

### "Failed to load connections" error
- Check `/oauth/status` endpoint is accessible
- Check CORS headers if cross-domain
- Check database connection

---

## File Locations

### Frontend
- Component: `/components/admin/GHLOAuthConnect.tsx`
- Route: `/App.tsx` line 113

### Backend
- OAuth routes: `/supabase/functions/server/oauth-routes-db.tsx`
- Main server: `/supabase/functions/server/index.tsx`

### Documentation
- Full spec: `/OAUTH_PUBLIC_ENDPOINTS_COMPLETE.md`
- Backend guide: `/BACKEND_ROUTES_TODO.md`
- Summary: `/IMPLEMENTATION_SUMMARY.md`
- Comparison: `/BEFORE_AFTER_COMPARISON.md`
- This file: `/QUICK_REFERENCE.md`

---

## Next Steps

### 1. Update Backend
- [ ] Change `POST /oauth/initiate` to `GET /oauth/start`
- [ ] Remove auth header checks
- [ ] Test redirects work

### 2. Configure Proxy (if needed)
- [ ] Add Vercel rewrites OR Next.js API routes
- [ ] Test `/oauth/start` redirects to GHL

### 3. Test End-to-End
- [ ] Visit `/admin/ghl-connect`
- [ ] Click "Connect GoHighLevel"
- [ ] Complete OAuth in GHL
- [ ] Verify success banner appears
- [ ] Check connection in list

### 4. Deploy
- [ ] Deploy backend changes
- [ ] Deploy frontend changes
- [ ] Test in production

---

## Support

### Common Issues

**Issue:** "Missing authorization header"  
**Fix:** Backend route still requires auth header. Remove the check.

**Issue:** "Invalid redirect_uri"  
**Fix:** Check `GHL_REDIRECT_URI` matches GHL Marketplace app exactly.

**Issue:** "State parameter missing or invalid"  
**Fix:** Check `ghl_oauth_states` table exists and state is being saved.

**Issue:** CORS errors  
**Fix:** Add CORS headers to backend responses.

---

## Status

- ✅ Frontend: COMPLETE
- ⏳ Backend: Needs updates
- ⏳ Testing: Pending
- ⏳ Deployment: Pending

**Ready for:** Backend implementation and testing
