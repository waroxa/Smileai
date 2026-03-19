# Backend Routes - TODO for Public Endpoints

The frontend now uses these public routes on `https://www.smilevisionpro.ai`:

## Routes That Need Public Access

### 1. `/oauth/start` (GET)
**Current Supabase Route:** `POST /make-server-c5a5d193/oauth/initiate`

**Required Changes:**
- Change from POST to **GET** (browser navigates directly)
- Remove Authorization header requirement
- Return **302 redirect** instead of JSON
- Add CORS headers

**Implementation:**
```typescript
app.get("/make-server-c5a5d193/oauth/start", async (c) => {
  try {
    const { clientId, redirectUri } = getOAuthConfig();
    const supabase = getSupabase();
    
    // Generate state
    const state = generateState();
    
    // Save state to DB
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    await supabase.from('ghl_oauth_states').insert({
      state,
      expires_at: expiresAt.toISOString(),
    });
    
    // Build platform authorization URL
    const scopes = [
      'locations.readonly',
      'locations/customFields.write',
      'locations/customFields.readonly',
      'locations/customValues.write',
      'locations/customValues.readonly',
      'contacts.write',
      'contacts.readonly',
      'forms.write',
      'forms.readonly',
    ].join(' ');
    
    const authUrl = new URL('https://marketplace.gohighlevel.com/oauth/chooselocation');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', state);
    
    // Redirect to platform
    return c.redirect(authUrl.toString());
  } catch (error: any) {
    console.error('OAuth start error:', error);
    return c.redirect(`https://www.smilevisionpro.ai/admin/ghl-connect?error=${encodeURIComponent(error.message)}`);
  }
});
```

---

### 2. `/oauth/callback` (GET)
**Current Supabase Route:** `GET /make-server-c5a5d193/oauth/callback`

**Already Correct! ✅** Just needs to be accessible publicly.

**Make sure it:**
- Returns **302 redirect** to frontend (already does)
- Handles success: `https://www.smilevisionpro.ai/admin/ghl-connect?success=true&locationId=xxx&locationName=xxx`
- Handles errors: `https://www.smilevisionpro.ai/admin/ghl-connect?error=xxx`
- No Authorization header required

---

### 3. `/oauth/status` (GET)
**Current Supabase Route:** `GET /make-server-c5a5d193/oauth/status`

**Required Changes:**
- Remove Authorization header requirement
- Add CORS headers
- Return same JSON format (already correct)

**Implementation:**
```typescript
app.get("/make-server-c5a5d193/oauth/status", async (c) => {
  try {
    const supabase = getSupabase();
    
    // Get all OAuth connections
    const { data: connections, error } = await supabase
      .from('ghl_connections')
      .select('location_id, location_name, created_at, scope, expires_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const activeConnections = (connections || []).map((conn: any) => ({
      locationId: conn.location_id,
      locationName: conn.location_name,
      connected_at: conn.created_at,
      scope: conn.scope,
      expires_at: new Date(conn.expires_at).getTime(),
      is_expired: new Date(conn.expires_at) < new Date(),
    }));
    
    return c.json({
      success: true,
      connections: activeConnections,
      count: activeConnections.length,
    });
  } catch (error: any) {
    console.error('OAuth status error:', error);
    return c.json({
      error: 'Failed to load connections',
      message: error.message,
    }, 500);
  }
});
```

---

### 4. `/oauth/disconnect` (POST) - Optional
**Current Supabase Route:** `POST /make-server-c5a5d193/oauth/disconnect`

**Required Changes:**
- Remove Authorization header requirement
- Add CORS headers

**Implementation:**
```typescript
app.post("/make-server-c5a5d193/oauth/disconnect", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId } = body;
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    const supabase = getSupabase();
    
    // Delete connection
    const { error } = await supabase
      .from('ghl_connections')
      .delete()
      .eq('location_id', locationId);
    
    if (error) throw error;
    
    // Log audit
    await supabase.from('ghl_audit_log').insert({
      location_id: locationId,
      action: 'oauth_disconnected',
      details: {},
    });
    
    return c.json({
      success: true,
      message: 'Location disconnected successfully',
    });
  } catch (error: any) {
    console.error('Disconnect error:', error);
    return c.json({
      error: 'Failed to disconnect',
      message: error.message,
    }, 500);
  }
});
```

---

### 5. `/oauth/refresh` (POST) - Optional
**Current Supabase Route:** `POST /make-server-c5a5d193/oauth/refresh`

**Required Changes:**
- Remove Authorization header requirement
- Add CORS headers

---

## Proxy Configuration (If Frontend and Backend Are Separate)

If your Figma/Vercel frontend is hosted separately from Supabase, you need to proxy these routes.

### Option 1: Vercel Rewrites (`vercel.json`)
```json
{
  "rewrites": [
    {
      "source": "/oauth/:path*",
      "destination": "https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/:path*"
    }
  ]
}
```

### Option 2: Next.js API Routes
Create `pages/api/oauth/[...path].ts`:
```typescript
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pathParts = req.query.path as string[];
  const path = pathParts.join('/');
  
  const supabaseUrl = `https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/${path}`;
  
  try {
    const response = await fetch(supabaseUrl + (req.url?.includes('?') ? `?${req.url.split('?')[1]}` : ''), {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });
    
    // Handle redirects
    if (response.status === 302 || response.status === 301) {
      const location = response.headers.get('location');
      if (location) {
        res.redirect(response.status, location);
        return;
      }
    }
    
    // Handle JSON responses
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}
```

---

## Security Notes

### Public Endpoints (No Auth Required):
- `/oauth/start` - Generates state (safe, no sensitive data)
- `/oauth/callback` - Validates state (CSRF protected)
- `/oauth/status` - Returns connections (read-only, no tokens)
- `/oauth/disconnect` - Requires locationId (authenticated by possession)
- `/oauth/refresh` - Requires locationId (authenticated by possession)

### Why No Auth Headers?
- Browser navigates directly to `/oauth/start` (can't add headers)
- OAuth callback comes from platform (external redirect)
- Frontend shouldn't handle auth tokens (security best practice)

### Protection Mechanisms:
- CSRF state tokens (5-min expiration)
- Location ID as auth (must know ID to act on it)
- Rate limiting (recommended)
- Audit logging (all actions tracked)

---

## Testing Commands

### 1. Test `/oauth/start`:
```bash
curl -v https://www.smilevisionpro.ai/oauth/start
# Should return: 302 redirect to marketplace.gohighlevel.com
```

### 2. Test `/oauth/status`:
```bash
curl https://www.smilevisionpro.ai/oauth/status
# Should return: {"success":true,"connections":[...],"count":0}
```

### 3. Test `/oauth/disconnect`:
```bash
curl -X POST https://www.smilevisionpro.ai/oauth/disconnect \
  -H "Content-Type: application/json" \
  -d '{"locationId":"test123"}'
# Should return: {"success":true,"message":"Location disconnected successfully"}
```

---

## Summary

### What You Need To Do:

1. **Update Supabase Edge Function Routes:**
   - Change `/oauth/initiate` from POST to GET (rename to `/oauth/start`)
   - Remove Authorization header checks from all `/oauth/*` routes
   - Ensure CORS headers are set

2. **Configure Proxy (if needed):**
   - Add Vercel rewrites OR Next.js API routes
   - Test that `/oauth/start` redirects correctly

3. **Update Environment Variables:**
   - Set `GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback`

4. **Test End-to-End:**
   - Visit `https://www.smilevisionpro.ai/admin/ghl-connect`
   - Click "Connect Platform"
   - Verify redirects work
   - Check database for saved connection

### Key Files to Update:
- `/supabase/functions/server/oauth-routes-db.tsx` (backend)
- `vercel.json` OR `pages/api/oauth/[...path].ts` (proxy)

**Status:** Frontend complete ✅  
**Next:** Backend routes + proxy configuration
