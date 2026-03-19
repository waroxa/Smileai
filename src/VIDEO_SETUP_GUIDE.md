# 🎥 Video Generation Setup Guide

## Current Issues

### 1. ❌ platform API Credentials Warning
**Status:** ⚠️ Warning only - app works without it  
**Impact:** Lead capture works, but data won't sync to platform  
**Fix:** Optional - only needed if you want platform integration

### 2. ❌ Video Generation Error (500)
**Status:** 🔴 Blocking video generation  
**Cause:** FAL_API_KEY not configured in Supabase  
**Fix:** Required for video generation to work

---

## 🔧 Fix Video Generation (Required)

### Step 1: Get Your FAL AI API Key

1. Go to **[FAL AI Dashboard](https://fal.ai/dashboard/keys)**
2. Sign up or log in
3. Click **"Create new key"** or copy existing key
4. Copy your API key (starts with something like `fal_...` or similar)

### Step 2: Add FAL_API_KEY to Supabase

1. **Go to Supabase Dashboard:**
   - Open: https://supabase.com/dashboard
   - Select your project: `idusbiekeyganoy3`

2. **Navigate to Edge Function Secrets:**
   - Click: **Project Settings** (⚙️ icon in left sidebar)
   - Click: **Edge Functions** (in the left menu)
   - Scroll down to: **Environment Variables** section

3. **Add the Secret:**
   - Click: **"Add new secret"** button
   - **Name:** `FAL_API_KEY`
   - **Value:** Paste your FAL AI API key
   - Click: **"Save"**

4. **Redeploy the Edge Function:**
   ```bash
   # In your terminal, run:
   supabase functions deploy make-server-1ddb0231
   ```

### Step 3: Test Video Generation

1. Refresh your app
2. Upload a photo and generate smile
3. Click **"🎬 Generate Smile Video"**
4. Should work now! ✅

---

## 🔧 Fix platform Integration (Optional)

Only needed if you want leads to sync to platform.

### Step 1: Get platform API Key & Location ID

1. **Go to platform Dashboard:**
   - Open: https://app.gohighlevel.com
   - Click: **Settings** → **API**
   - Copy your **API Key**

2. **Get Location ID:**
   - In platform, go to **Settings** → **Business Profile**
   - Copy your **Location ID**

### Step 2: Add platform Credentials to Security Settings

1. **Open your app**
2. Click **Staff Login** (lock icon in top right)
3. Enter staff password
4. Go to **⚙️ Settings** → **🔐 Security**
5. Scroll to **platform Integration**
6. Enter:
   - **platform API Key:** Your API key
   - **platform Location ID:** Your location ID
7. Click **"Save Settings"**

---

## ✅ Verification Checklist

### Video Generation:
- [ ] FAL_API_KEY added to Supabase Edge Functions
- [ ] Edge Function redeployed
- [ ] Video generation works (no more 500 error)

### platform Integration (Optional):
- [ ] platform API Key added to Security settings
- [ ] platform Location ID added to Security settings
- [ ] Lead form creates contacts in platform
- [ ] Images upload to platform contact

---

## 🐛 Troubleshooting

### Still Getting 500 Error?

1. **Check Supabase Function Logs:**
   - Go to Supabase Dashboard
   - Click: **Edge Functions** (in left sidebar)
   - Click: **make-server-1ddb0231**
   - Click: **Logs** tab
   - Look for error messages

2. **Verify FAL_API_KEY:**
   - Make sure it's spelled exactly: `FAL_API_KEY`
   - No spaces before/after
   - Key is valid and not expired

3. **Check Backend Response:**
   - Open browser console (F12)
   - Look for the error message in the red alert box
   - Share the error message if still not working

### Backend Not Deployed?

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref idusbiekeyganoy3

# Deploy the function
supabase functions deploy make-server-1ddb0231
```

---

## 📝 Quick Reference

| Error | Solution |
|-------|----------|
| **Server error (500)** | Add FAL_API_KEY to Supabase |
| **FAL_API_KEY not configured** | Add to Supabase environment variables |
| **platform API credentials not configured** | Add to Security settings (optional) |
| **Function not found (404)** | Deploy Edge Function |

---

## 🎯 Expected Behavior After Fix

### With FAL_API_KEY Configured:
- ✅ Video generates in ~20-30 seconds
- ✅ Real video plays (not animated preview)
- ✅ Video shows person smiling naturally
- ✅ Video auto-uploaded to platform (if configured)

### Without FAL_API_KEY:
- ⚠️ Falls back to animated preview
- ⚠️ Shows crossfade between before/after
- ⚠️ Still works, just not as impressive

---

**Need help?** Check the error message in the red alert box - it now shows the exact issue!
