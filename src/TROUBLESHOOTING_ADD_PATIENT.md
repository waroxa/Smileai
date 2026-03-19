# 🔧 Troubleshooting: Add Patient Feature

## Error: "platform credentials not configured"

This error means the app can't find your platform API credentials in localStorage. Follow these steps:

---

## ✅ Step-by-Step Fix

### Step 1: Save Your Credentials

1. **Open Staff Dashboard**
   - Click the hamburger menu (☰) in bottom-right
   - Click **"Settings"**

2. **Go to Integration Section**
   - You should see "CRM API Settings" panel

3. **Enter Your Credentials**
   - **API Key**: Get from platform → Settings → API → Create API Key
   - **Location ID**: Get from platform → Settings → Business Profile

4. **IMPORTANT: Click "Save Settings"**
   - Wait for green success message: "Settings saved successfully!"
   - Do NOT skip this step

5. **Test Your Credentials**
   - Click the **"Test Saved Credentials"** button
   - You should see an alert: "✅ Credentials Found!"
   - If you see "❌ Credentials NOT found", go back to step 3

---

### Step 2: Verify in Browser Console

1. **Open Browser Developer Tools**
   - Press `F12` or `Right-click → Inspect`
   - Go to **Console** tab

2. **Check localStorage**
   - Type this in the console:
   ```javascript
   console.log('API Key:', localStorage.getItem('ghl_api_key'));
   console.log('Location ID:', localStorage.getItem('ghl_location_id'));
   ```

3. **What You Should See**
   - API Key should show your actual key (not null, not empty)
   - Location ID should show your location ID (not null, not empty)

4. **If You See `null` or Empty**
   - Go back to Settings
   - Re-enter credentials
   - Click "Save Settings" again

---

### Step 3: Try Adding a Patient

1. **Go to Patients Tab**
   - Click "Patients" in the sidebar

2. **Click "Add Patient"**
   - Top-right corner OR center button

3. **Fill the Form**
   - **Required**: First Name, Last Name
   - **Required**: Email OR Phone (at least one)
   - **Optional**: Address, DOB, Notes

4. **Submit**
   - Click "Add Patient" button
   - Check console for debug logs

5. **Check Console Output**
   - You should see:
   ```
   DEBUG - Checking credentials:
   API Key exists: true Length: XX
   Location ID exists: true Value: YOUR_LOCATION_ID
   ```

---

## 🐛 Common Issues & Solutions

### Issue 1: Credentials Save But Still Get Error

**Cause**: Browser may have localStorage disabled or in private mode

**Solution**:
1. Check if you're in **Incognito/Private** mode (close and use normal mode)
2. Check browser settings for localStorage permissions
3. Try a different browser (Chrome recommended)
4. Clear cache and reload page

---

### Issue 2: "Test Credentials" Shows Empty

**Cause**: Settings not actually saved

**Solution**:
1. Make sure BOTH fields are filled (API Key AND Location ID)
2. Check that "Save Settings" button is NOT disabled
3. Wait for success message before navigating away
4. Reload the page and check if fields are pre-filled

---

### Issue 3: API Key Looks Correct But Fails

**Cause**: Extra spaces or invisible characters

**Solution**:
1. Copy API Key fresh from platform (don't paste from notes)
2. The code now auto-trims whitespace
3. Check console for "API Key length:" - should match expected length
4. Re-generate API key in platform if needed

---

### Issue 4: 401 Unauthorized Error

**Cause**: Invalid or expired API key

**Solution**:
1. Go to platform → Settings → API
2. Delete old API key
3. Create a new API key
4. Make sure it has "Contacts" permission
5. Copy and save in Settings

---

### Issue 5: 403 Forbidden Error

**Cause**: API key doesn't have permission for this location

**Solution**:
1. Verify Location ID is correct
2. Check API key has access to this location
3. Make sure API key has "Contacts: Write" permission
4. Try creating a new API key with full permissions

---

## 🔍 Debug Mode

The Add Patient modal now includes debug logging. When you submit:

### What Gets Logged:
```javascript
DEBUG - Checking credentials:
API Key exists: true/false
API Key Length: XX
Location ID exists: true/false
Location ID Value: YOUR_ID
All localStorage keys: [...]
```

### How to Use:
1. Open browser console (F12)
2. Try to add a patient
3. Check the console output
4. Share the logs (but hide your actual API key!) if you need help

---

## 🧪 Manual localStorage Test

If all else fails, manually set credentials:

```javascript
// Open browser console and run:
localStorage.setItem('ghl_api_key', 'YOUR_ACTUAL_API_KEY_HERE');
localStorage.setItem('ghl_location_id', 'YOUR_ACTUAL_LOCATION_ID_HERE');

// Verify it worked:
console.log(localStorage.getItem('ghl_api_key'));
console.log(localStorage.getItem('ghl_location_id'));
```

Then try adding a patient again.

---

## ✅ Success Checklist

Before trying to add a patient, verify:

- [ ] You're logged into Staff Dashboard
- [ ] You've navigated to Settings → Integration
- [ ] You've entered both API Key AND Location ID
- [ ] You've clicked "Save Settings"
- [ ] You've seen the green success message
- [ ] "Test Saved Credentials" shows ✅ Credentials Found
- [ ] Browser console shows credentials are NOT null
- [ ] You're NOT in private/incognito mode

---

## 📞 Still Having Issues?

### Check These Files:
1. `/components/ghl/ApiSettingsPanel.tsx` - Settings UI
2. `/components/ghl/AddPatientModal.tsx` - Add Patient logic
3. `/components/ghl/PatientsView.tsx` - Patients page

### Console Commands to Debug:
```javascript
// Check all localStorage
Object.keys(localStorage).forEach(key => {
  console.log(key + ':', localStorage.getItem(key));
});

// Clear all localStorage (nuclear option)
localStorage.clear();
```

### What to Share If Asking for Help:
1. Screenshot of Settings page (with credentials hidden)
2. Console logs when trying to add patient
3. Browser name and version
4. Whether you're in private mode
5. Full error message

---

## 🎯 Expected Workflow

**✅ Correct Flow:**
```
1. Settings → Enter Credentials → Save → Success Message
2. Click "Test Saved Credentials" → ✅ Found
3. Go to Patients → Add Patient → Fill Form → Submit
4. Success! Patient appears in list
```

**❌ Wrong Flow:**
```
1. Settings → Enter Credentials → (Don't click Save)
2. Go to Patients → Add Patient → ERROR
```

**The key is SAVING in Settings first!**

---

## 🔐 Security Note

Credentials are stored in **localStorage** which persists across sessions. This is intentional for ease of use. In production, consider:

- Using platform's SSO token instead
- Server-side credential management
- Encrypted storage
- Token refresh mechanisms

For now, localStorage is acceptable for internal staff use.

---

## ✨ Quick Fix Summary

**95% of the time, the issue is:**
1. Forgot to click "Save Settings"
2. Browser in private mode
3. Fields had extra spaces (now auto-trimmed)

**Try this:**
1. Go to Settings
2. Re-enter credentials (copy fresh from platform)
3. Click "Save Settings"
4. Click "Test Saved Credentials"
5. See ✅? You're good to go!
6. Try adding patient again

---

**Good luck! The feature works - just need to save those credentials! 🚀**
