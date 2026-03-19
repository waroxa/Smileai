# platform OAuth Configuration

## Required Environment Variables

Add these to your Supabase Edge Function secrets:

```
GHL_CLIENT_ID=your_client_id_here
GHL_CLIENT_SECRET=your_client_secret_here
GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
```

## marketplace portal Settings

When submitting to marketplace portal, use these values:

### 1. Redirect URL
```
https://www.smilevisionpro.ai/oauth/callback
```

### 2. Scopes (Minimal Required)
Request ONLY these scopes:
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

**Why these scopes?**
- `locations.readonly` - Read location info (name, ID)
- `locations/customFields.*` - Create/read custom fields for smile data
- `locations/customValues.*` - Store video metadata and transformation data
- `contacts.*` - Create/update patient contacts
- `forms.*` - Create/manage smile transformation forms

**Scopes we DO NOT request:**
- ❌ conversations.* (not needed)
- ❌ calendars.* (not needed)
- ❌ opportunities.* (not needed)
- ❌ payments.* (not needed)
- ❌ workflows.* (not needed)

### 3. Client Keys
After creating your app in marketplace portal:
1. Copy the `Client ID`
2. Copy the `Client Secret`
3. Add both to Supabase secrets (see above)

## platform OAuth Endpoints

**Authorization URL:**
```
https://marketplace.gohighlevel.com/oauth/chooselocation
```

**Token Exchange URL:**
```
https://services.leadconnectorhq.com/oauth/token
```

**Token Refresh URL:**
```
https://services.leadconnectorhq.com/oauth/token
```

## Setup Steps

1. **Create marketplace portal App**
   - Go to https://marketplace.gohighlevel.com/
   - Create new app
   - Set app name: "SmileVision Pro"
   - Set redirect URL: `https://www.smilevisionpro.ai/oauth/callback`
   - Select scopes listed above
   - Generate client keys

2. **Add Secrets to Supabase**
   ```bash
   # In Supabase Dashboard → Edge Functions → Secrets
   GHL_CLIENT_ID=<your_client_id>
   GHL_CLIENT_SECRET=<your_client_secret>
   GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
   ```

3. **Deploy Code**
   - Deploy updated Edge Function with OAuth routes
   - Deploy frontend with Connect button

4. **Test OAuth Flow**
   - Click "Connect Platform"
   - Authorize app
   - Select location
   - Verify connection in admin dashboard

## Security Notes

✅ **What we do right:**
- State parameter for CSRF protection
- Tokens stored server-side only (never in localStorage)
- Tokens encrypted at rest in database
- HTTPS only
- Minimal scopes requested
- Token refresh before expiration
- Secure disconnect function

❌ **What NOT to do:**
- Never store tokens in frontend
- Never request more scopes than needed
- Never share client_secret publicly
- Never skip state validation
- Never use HTTP (always HTTPS)

## Database Schema

We'll use the existing KV store to save:

```typescript
// Key format: ghl_oauth:{locationId}
{
  locationId: string,
  locationName: string,
  access_token: string, // encrypted
  refresh_token: string, // encrypted
  expires_at: number, // timestamp
  scope: string,
  connected_at: string,
  companyId: string,
  userId: string
}

// Key format: ghl_oauth_state:{state}
{
  state: string,
  created_at: number,
  expires_at: number
}

// Key format: ghl_audit:{locationId}:{timestamp}
{
  locationId: string,
  action: string,
  details: object,
  timestamp: number,
  user: string
}
```

## API Routes

**Frontend Routes:**
- `/admin/ghl-connect` - OAuth connection management page
- `/oauth/callback` - OAuth callback handler (server-side)

**Backend Routes:**
- `POST /make-server-1ddb0231/oauth/initiate` - Start OAuth flow
- `GET /make-server-1ddb0231/oauth/callback` - Handle OAuth callback
- `POST /make-server-1ddb0231/oauth/disconnect` - Disconnect location
- `GET /make-server-1ddb0231/oauth/status` - Check connection status
- `POST /make-server-1ddb0231/oauth/refresh` - Manual token refresh
- `GET /make-server-1ddb0231/ghl/forms` - List forms in location
- `POST /make-server-1ddb0231/ghl/forms` - Create form
- `POST /make-server-1ddb0231/ghl/videos` - Save video metadata
- `GET /make-server-1ddb0231/ghl/audit` - Get audit log

## Testing Checklist

- [ ] Environment variables set in Supabase
- [ ] marketplace portal app created with correct settings
- [ ] Redirect URL matches exactly
- [ ] Scopes match our minimal list
- [ ] OAuth flow completes successfully
- [ ] Tokens stored securely (check KV store)
- [ ] Location name displays correctly
- [ ] Can create forms in platform
- [ ] Can save video metadata
- [ ] Disconnect works and deletes tokens
- [ ] Token refresh works before expiration
- [ ] Audit log shows actions

## Support

If OAuth fails:
1. Check Supabase Edge Function logs
2. Verify environment variables are set
3. Confirm redirect URL matches exactly
4. Check scopes are approved in platform
5. Verify client_id and client_secret are correct
