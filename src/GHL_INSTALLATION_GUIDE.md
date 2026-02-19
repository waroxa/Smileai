# SmileVisionPro - GoHighLevel Installation & Testing Guide

## Overview
SmileVisionPro is a complete AI smile transformation landing page and GHL marketplace app that captures leads, generates AI smile transformations, and automatically syncs data to GoHighLevel.

**🔐 Security**: Password-protected admin dashboard with customizable credentials.

---

## 🚀 Part 1: Installing in GoHighLevel Marketplace

### Step 1: Prepare Your App Package
1. **Package your application files**:
   - All React components in `/components`
   - Utility files in `/utils`
   - Styles in `/styles`
   - Main `App.tsx` entry point

2. **Create your GHL marketplace listing**:
   - App Name: **SmileVisionPro**
   - Category: Lead Generation / Dental Tools
   - Pricing: Set your monthly subscription price (e.g., $97/month)

### Step 2: Configure GHL App Settings
1. **Navigate to**: GoHighLevel → Marketplace → Developer → Create New App

2. **Basic Information**:
   - **App Name**: SmileVisionPro
   - **Description**: AI-powered smile transformation tool that captures and converts dental leads with instant visual previews
   - **Icon**: Upload your app icon (smile/tooth icon recommended)
   - **Screenshots**: Add screenshots of:
     - Landing page with before/after transformations
     - Lead capture form
     - Dashboard view
     - Settings panel

3. **Permissions Required**:
   ```
   ✅ contacts.readonly
   ✅ contacts.write
   ✅ locations.readonly
   ✅ files.write (for uploading images)
   ✅ notes.write (for attaching transformation details)
   ```

4. **OAuth Scopes**:
   - Request the above permissions when users install your app
   - Users will authorize once during installation

### Step 3: Deployment Options

#### Option A: Host as Standalone Web App
1. Deploy your React app to a hosting provider:
   - **Vercel** (Recommended for React apps)
   - **Netlify**
   - **AWS Amplify**
   - Your own server

2. Configure your domain:
   ```
   Production URL: https://yourapp.com
   Callback URL: https://yourapp.com/auth/callback
   ```

3. In GHL App Settings:
   - Set **App URL** to your deployed URL
   - Configure **Redirect URI** for OAuth

#### Option B: Embed Within GHL (iFrame)
1. Deploy your app as described in Option A
2. In GHL App Settings:
   - Enable "Embed in location"
   - Set iframe URL to your app's URL
   - Users will access it from: GHL → [Location] → SmileVisionPro

---

## 🔧 Part 2: Configuring the App (User Side)

### For Dental Practices Installing Your App:

#### Step 1: Install from GHL Marketplace
1. Log into GoHighLevel
2. Go to **Marketplace** → **Apps**
3. Search for **SmileVisionPro**
4. Click **Install** and authorize permissions
5. Select the location(s) to install the app

#### Step 2: First Login & Password Setup 🔐

**Important Security Feature**: The admin dashboard is password-protected!

1. **First Time Login**:
   - Go to Landing Page → Footer → Click **"Staff Login"**
   - A login modal will appear
   - Enter the **default password**: `admin123`
   - Click **"Login"**

2. **Change Default Password** (CRITICAL!):
   - Once logged in, go to **Settings** → **Security** tab
   - Enter current password: `admin123`
   - Set a NEW strong password (min. 6 characters)
   - Confirm new password
   - Click **"Update Password"**

**Security Best Practices**:
- ✅ Change the default password immediately
- ✅ Use a unique, strong password
- ✅ Don't share your password with unauthorized staff
- ✅ Use the Logout button when finished

**Logging In Again**:
- Click "Staff Login" in footer
- Enter your custom password
- Access granted!

**Logging Out**:
- Click the **"Logout"** button in the top-right corner of the dashboard
- This clears your session and returns you to the landing page

#### Step 3: Configure API Settings (Inside SmileVisionPro)
After installation, users need to configure their API credentials:

1. **Access the app**:
   - Go to Landing Page → Footer → Click **"Staff Login"**
   - This switches to the GHL Dashboard view

2. **Navigate to Settings**:
   - Click **Settings** in the left sidebar
   - Click the **Integration** tab

3. **Get GHL API Credentials**:
   
   **API Key**:
   - In GoHighLevel: Settings → API → API Keys
   - Click **Create API Key**
   - Name it "SmileVisionPro"
   - Copy the generated API key
   - Paste into SmileVisionPro → Settings → Integration → **GHL API Key**

   **Location ID**:
   - In GoHighLevel: Settings → Business Profile
   - Scroll to find **Location ID** (format: `abc123xyz...`)
   - Copy and paste into SmileVisionPro → **GHL Location ID**

4. **Click "Save Settings"**

✅ **Configuration Complete!** The app will now automatically:
- Create contacts in GHL when leads submit the form
- Upload before/after images to the contact
- Update custom fields and tags
- Track transformation status

---

## 🧪 Part 3: Testing the Integration

### Test 1: Lead Capture
1. **Go to the public landing page** (not Staff Login view)
2. Scroll to **"Get Your Free Smile Preview"** section
3. Fill out the form:
   ```
   Full Name: Test User
   Email: test@example.com
   Phone: (555) 123-4567
   Interested In: Veneers
   Notes: Just testing the integration
   ```
4. Click **"Continue to Smile Preview →"**

**Expected Result**:
- Form submits successfully
- You see "Step 2: Upload Your Photo"
- Check GHL → Contacts → You should see a new contact "Test User" created

**GHL Contact Should Have**:
```
✅ Name: Test User (split into firstName/lastName)
✅ Email: test@example.com
✅ Phone: (555) 123-4567
✅ Tags: smile-transformation, ai-lead
✅ Source: SmileVision AI Landing Page
✅ Custom Fields:
   - service_interest: Veneers
   - notes: Just testing the integration
   - lead_source: Smile AI Website
   - transformation_status: Pending
```

### Test 2: Image Transformation & Upload
1. **After completing Test 1**, you should see the upload section
2. Upload a smile photo (use a test image or stock photo)
3. Select smile intensity: Natural or Hollywood
4. Click **"See My New Smile"**
5. Wait for AI to process (~10-20 seconds)

**Expected Result**:
- AI generates the enhanced smile image
- Before/After images display side-by-side
- Check GHL → Contacts → Open "Test User" → Notes

**GHL Contact Should Show**:
```
✅ New note: "AI Smile Transformation - before-smile.jpg uploaded successfully"
✅ New note: "AI Smile Transformation - after-smile-ai.jpg uploaded successfully"
✅ Custom field updated: transformation_status: Images Generated
```

### Test 3: Video Generation & Upload
1. **After image generation** in Test 2, scroll down
2. Click **"🎬 Generate Smile Video"**
3. Wait for video processing (~30-60 seconds)

**Expected Result**:
- Video generates (or animated fallback if backend unavailable)
- Video player displays the smile animation
- Check GHL again

**GHL Contact Should Show**:
```
✅ New note (if video generated): "AI Smile Transformation - smile-video.mp4 uploaded successfully"
✅ Custom field updated: transformation_status: Complete - Video Generated
   OR transformation_status: Complete - Animated Preview (if fallback)
```

### Test 4: Dashboard View
1. Go to landing page → Footer → Click **"Staff Login"**
2. You should see the GHL Dashboard view
3. Click **"Patients"** in sidebar
4. Find your test patient "Test User"
5. Click to view details

**Expected Dashboard Data**:
```
✅ Patient name and contact info displayed
✅ Service interest shown
✅ Review status pipeline (Lead → Reviewed → Scheduled → etc.)
✅ Notes section with transformation notes
✅ Before/after images (if file attachments work)
```

---

## 🎨 Part 4: Customizing for Each Practice (White-Label)

### Enable Branding Customization:
1. **Staff Login** → **Settings** → **Branding Tab**
2. Practice can customize:
   - Practice Name (replaces "SmileVisionPro")
   - Logo upload
   - Primary Color (buttons, accents)
   - Secondary Color
3. Click **"Save Changes"**

**Changes Apply To**:
- ✅ Landing page header
- ✅ GHL Dashboard branding
- ✅ Button colors
- ✅ All patient-facing materials

### Quick Theme Demo (For Testing):
- On the GHL Dashboard, look for **"Quick Theme Demo"** panel (top-right)
- Click different theme presets to see instant branding changes:
  - Ocean Blue (Dental Spa vibe)
  - Forest Green (Natural wellness)
  - Royal Purple (Premium luxury)
  - etc.
- Close with the X button when done testing

---

## 📊 Part 5: Monitoring & Analytics

### Check Lead Flow:
1. **GHL Dashboard** → **Reports** → **Contacts**
2. Filter by:
   - Source: "SmileVision AI Landing Page"
   - Tags: "smile-transformation"
3. You'll see all captured leads

### Track Transformation Status:
All contacts have a custom field **"transformation_status"** with values:
- **Pending**: Form submitted, awaiting upload
- **Processing**: Image being enhanced by AI
- **Images Generated**: Before/after created
- **Complete - Video Generated**: Full transformation complete
- **Complete - Animated Preview**: Fallback animation used

### Pipeline Integration:
- Optionally create a GHL Pipeline: "Smile Transformation Pipeline"
- Stages: Lead → Preview Generated → Consultation Booked → Treatment Started
- Auto-move contacts through stages based on transformation_status

---

## 🐛 Troubleshooting

### Issue: "GHL API credentials not configured"
**Solution**: 
- Verify API Key and Location ID are saved in Settings → Integration
- Check that API key has correct permissions (contacts.write, etc.)
- Make sure you're using the correct Location ID for the GHL location

### Issue: Contact created but no images uploaded
**Solution**:
- GHL API file upload requires additional endpoint setup
- Current version adds notes instead of direct file attachments
- For full file uploads, implement multipart form upload to GHL's file storage endpoint

### Issue: Video generation fails
**Solution**:
- Video generation requires the Supabase Edge Function backend
- If not deployed, the app automatically falls back to animated preview
- This is expected behavior and doesn't affect lead capture

### Issue: Landing page doesn't capture leads (forms submit but nothing happens)
**Solution**:
- Check browser console for errors
- Verify localStorage is enabled (API keys stored there)
- Try clearing browser cache and re-entering API credentials
- Test with a different GHL location/API key

---

## 📞 Support & Next Steps

### For End Users (Dental Practices):
- Contact your GHL account manager
- Check SmileVisionPro documentation in the app
- Submit support ticket through GHL Marketplace

### For Developers:
- API endpoint: `https://rest.gohighlevel.com/v1/`
- Documentation: https://highlevel.stoplight.io/
- Test with GHL API sandbox before production

---

## ✅ Installation Checklist

- [ ] App deployed to hosting provider
- [ ] GHL Marketplace listing created
- [ ] OAuth permissions configured
- [ ] Test dental practice installs app
- [ ] API credentials configured in app Settings
- [ ] Test lead submission → verify contact created in GHL
- [ ] Test image upload → verify transformation works
- [ ] Test video generation → verify fallback works
- [ ] Customize branding for test practice
- [ ] Verify all data syncs to GHL correctly
- [ ] Launch to production!

---

**🎉 Congratulations!** Your SmileVisionPro app is now fully integrated with GoHighLevel and ready to capture and convert dental leads with AI-powered smile transformations!