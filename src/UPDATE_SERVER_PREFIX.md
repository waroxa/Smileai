# Server Prefix Update Required

The correct server prefix is `make-server-c5a5d193` not `make-server-1ddb0231`.

The OAuth callback URL is:
```
https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/callback
```

## Files That Need Updating

I need to do a global find and replace:
- Find: `make-server-1ddb0231`
- Replace: `make-server-c5a5d193`

This affects about 99 instances across 20 files.

## Critical Files to Update First:

1. `/supabase/functions/server/index.tsx`
2. `/supabase/functions/server/oauth-routes-db.tsx`
3. `/supabase/functions/server/ghl-api-routes-db.tsx`
4. `/components/admin/GHLOAuthConnect.tsx`
5. `/components/SmileTransformationSection.tsx`

Let me update these now...
