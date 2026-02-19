# Quick Test Commands - Copy & Paste

Replace these values with yours:
```bash
PROJECT_ID="your-supabase-project-id"
ANON_KEY="your-supabase-anon-key"
LOCATION_ID="your-location-id-after-connecting"
```

---

## 1. Check OAuth Status

```bash
curl "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/oauth/status" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Expected:** List of connected locations (or empty array)

---

## 2. Test Forms List

```bash
curl "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/forms?locationId=${LOCATION_ID}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Expected:** List of forms from GHL

---

## 3. Setup Custom Fields

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/setup-custom-fields" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"locationId\":\"${LOCATION_ID}\"}"
```

**Expected:** Creates 5 custom fields for SmileVision

---

## 4. Save Test Video

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/videos" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "locationId": "'${LOCATION_ID}'",
    "videoData": {
      "url": "https://fal.media/files/test-video.mp4",
      "title": "Test Smile Transformation",
      "tags": ["test", "smile"],
      "contactId": "contact_test123",
      "workflowStep": "transformation"
    }
  }'
```

**Expected:** Video saved to database and GHL

---

## 5. Get Videos

```bash
curl "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/videos?locationId=${LOCATION_ID}" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Expected:** List of videos for location

---

## 6. Get Audit Log

```bash
curl "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/audit?locationId=${LOCATION_ID}&limit=20" \
  -H "Authorization: Bearer ${ANON_KEY}"
```

**Expected:** List of recent actions

---

## 7. Refresh Token

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/oauth/refresh" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"locationId\":\"${LOCATION_ID}\"}"
```

**Expected:** Token refreshed successfully

---

## 8. Disconnect Location

```bash
curl -X POST "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/oauth/disconnect" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d "{\"locationId\":\"${LOCATION_ID}\"}"
```

**Expected:** Location disconnected

---

## Database Queries (Supabase SQL Editor)

### Check Connections
```sql
SELECT 
  location_id,
  location_name,
  expires_at,
  expires_at < now() as is_expired,
  created_at,
  updated_at
FROM ghl_connections
ORDER BY created_at DESC;
```

### Check Audit Log
```sql
SELECT 
  created_at,
  location_id,
  action,
  details
FROM ghl_audit_log
ORDER BY created_at DESC
LIMIT 20;
```

### Check Videos
```sql
SELECT 
  created_at,
  location_id,
  contact_id,
  title,
  video_url,
  tags,
  workflow_step
FROM ghl_videos
ORDER BY created_at DESC
LIMIT 20;
```

### Check OAuth States (should be empty after use)
```sql
SELECT 
  state,
  created_at,
  expires_at,
  expires_at < now() as is_expired
FROM ghl_oauth_states;
```

### Clean Expired States (manual)
```sql
DELETE FROM ghl_oauth_states WHERE expires_at < now();
```

### Count by Action
```sql
SELECT 
  action,
  COUNT(*) as count
FROM ghl_audit_log
GROUP BY action
ORDER BY count DESC;
```

### Videos by Location
```sql
SELECT 
  location_id,
  COUNT(*) as video_count,
  MAX(created_at) as latest_video
FROM ghl_videos
GROUP BY location_id;
```

---

## Browser Testing URLs

### Admin Dashboard
```
https://www.smilevisionpro.ai/admin/ghl-connect
```

### Expected OAuth Redirect (after clicking Connect)
```
https://marketplace.gohighlevel.com/oauth/chooselocation?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://www.smilevisionpro.ai/oauth/callback&
  response_type=code&
  scope=locations.readonly%20...&
  state=RANDOM_STATE_STRING
```

### Expected Callback (after authorizing)
```
https://www.smilevisionpro.ai/oauth/callback?
  code=AUTH_CODE&
  state=RANDOM_STATE_STRING
```

### Expected Success Redirect
```
https://www.smilevisionpro.ai/admin/ghl-connect?
  success=true&
  locationId=YOUR_LOCATION_ID&
  locationName=YOUR_LOCATION_NAME
```

---

## Environment Variables to Set

In Supabase Dashboard → Edge Functions → Secrets:

```
GHL_CLIENT_ID=your_client_id_from_marketplace
GHL_CLIENT_SECRET=your_client_secret_from_marketplace
GHL_REDIRECT_URI=https://www.smilevisionpro.ai/oauth/callback
```

---

## How to Find Your Values

### PROJECT_ID
- Go to Supabase Dashboard
- Look at URL: `https://supabase.com/dashboard/project/[PROJECT_ID]`
- Or: Settings → General → Reference ID

### ANON_KEY
- Supabase Dashboard → Settings → API
- Copy "anon" / "public" key (not service_role!)

### LOCATION_ID
- After connecting OAuth, check database:
```sql
SELECT location_id FROM ghl_connections;
```
- Or check the success URL parameter after connecting

---

## Testing Order

1. ✅ Apply database migration
2. ✅ Set environment variables
3. ✅ Add admin route to App.tsx
4. ✅ Visit `/admin/ghl-connect`
5. ✅ Click "Connect GoHighLevel"
6. ✅ Authorize in GHL
7. ✅ See success message
8. ✅ Test API endpoints (commands above)
9. ✅ Check database (queries above)
10. ✅ Test disconnect

---

## One-Line Test (After OAuth Connected)

```bash
# Set your values
export PROJECT_ID="your-project"
export ANON_KEY="your-anon-key"
export LOCATION_ID="your-location"

# Test all endpoints
echo "=== OAuth Status ===" && \
curl -s "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/oauth/status" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq && \
echo -e "\n=== Forms ===" && \
curl -s "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/forms?locationId=${LOCATION_ID}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq && \
echo -e "\n=== Audit Log ===" && \
curl -s "https://${PROJECT_ID}.supabase.co/functions/v1/make-server-1ddb0231/ghl/audit?locationId=${LOCATION_ID}" \
  -H "Authorization: Bearer ${ANON_KEY}" | jq
```

(Requires `jq` for pretty JSON. Remove `| jq` if you don't have it)

---

## Success Indicators

✅ **OAuth Status:** Returns array with your location  
✅ **Forms:** Returns list from GHL  
✅ **Videos:** Can save and retrieve  
✅ **Audit Log:** Shows all actions  
✅ **Database:** Has records in all tables  
✅ **Token Refresh:** Updates expires_at  
✅ **Disconnect:** Removes from database  

---

**Quick Reference:** Copy commands as needed  
**Full Guide:** See `/OAUTH_TESTING_GUIDE.md`
