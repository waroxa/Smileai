# 🚀 platform Setup Guide

## SmileVisionPro AI - Complete platform Integration

This guide will help you install and configure SmileVisionPro AI in your platform account.

---

## 📋 Overview

When properly configured, SmileVisionPro AI will:
- ✅ Automatically create new contacts in platform when leads submit the form
- ✅ Save customer information (name, email, phone, service interest, notes)
- ✅ Upload before/after smile transformation images
- ✅ **Save video URLs** directly to contact custom fields and notes
- ✅ Track transformation status through the pipeline
- ✅ Tag contacts automatically for workflow automation

---

## 🔧 Installation Methods

### Method 1: Automatic SSO Integration (Recommended)

When you install this app in platform as a Custom App, it will:

1. **Automatically detect** it's running inside platform
2. **Extract the Location ID** from URL parameters
3. **Connect to your platform account** seamlessly

**Installation URL Format:**
```
https://your-app-url.com/?location_id=YOUR_LOCATION_ID&api_key=YOUR_API_KEY
```

The app will automatically:
- Save the Location ID to localStorage
- Configure API credentials
- Start sending leads to your platform account

---

### Method 2: Manual Configuration

If you're not using SSO, you can manually configure credentials:

1. **Login as Staff** (click "Staff Login" in footer)
2. Go to **Settings** → **Integration** tab
3. Enter your platform credentials:
   - **API Key**: Get from platform → Settings → API → Create API Key
   - **Location ID**: Get from platform → Settings → Business Profile → Location ID

---

## 🔑 Getting Your platform Credentials

### Step 1: Get Your API Key

1. Login to your **platform** account
2. Navigate to **Settings** (gear icon)
3. Click **API** in the left sidebar
4. Click **Create API Key**
5. Name it: `SmileVisionPro AI`
6. **Copy the API key** (save it securely!)

### Step 2: Get Your Location ID

1. In platform, go to **Settings**
2. Click **Business Profile**
3. Find **Location ID** (usually at the top)
4. **Copy the Location ID**

---

## 📊 Required Custom Fields in platform

For the app to work properly, create these custom fields in platform:

### Navigate to: Settings → Custom Fields → Contact Fields

Create the following fields:

| Field Name | Field Type | Description |
|------------|-----------|-------------|
| `service_interest` | Dropdown | Services they're interested in (Veneers, Invisalign, Whitening, etc.) |
| `transformation_status` | Text | Current status (Pending, Processing, Complete, etc.) |
| `before_image_url` | URL | Link to original smile photo |
| `after_image_url` | URL | Link to AI-enhanced smile photo |
| `smile_video_url` | URL | **Video transformation link** |
| `lead_source` | Text | Where the lead came from |

---

## 🎥 How Video Saving Works

When a customer generates a smile video:

1. **Video is generated** using FAL AI (Kling Video API)
2. **Video URL is returned** from the API
3. **Contact is updated** in platform with:
   - `smile_video_url` custom field = video URL
   - A note is added with clickable video link
   - Status updated to "Complete - Video Generated"

### Accessing the Video in platform

**Option 1: Custom Field**
- Open contact → Custom Fields → `smile_video_url`
- Click the URL to watch the video

**Option 2: Notes**
- Open contact → Notes tab
- Look for "🎥 AI Smile Video Generated!"
- Click the video link

---

## 🏷️ Tags & Automation

### Auto-Applied Tags

Every lead gets tagged with:
- `smile-transformation`
- `ai-lead`

### Recommended Workflows

Create platform workflows triggered by these tags:

**Workflow 1: New Lead Welcome**
- Trigger: Tag added `smile-transformation`
- Action: Send welcome email with video preview
- Action: SMS with consultation booking link

**Workflow 2: Video Generated**
- Trigger: Custom field `transformation_status` = "Complete - Video Generated"
- Action: Send email: "Your Smile Video is Ready!"
- Action: Add to "Hot Leads" pipeline

---

## 📱 Testing the Integration

### Test Checklist

1. ✅ Submit a test lead through the form
2. ✅ Check platform Contacts - new contact should appear
3. ✅ Verify contact has correct:
   - Name, email, phone
   - Tags: `smile-transformation`, `ai-lead`
   - Custom field: `service_interest`
   - Custom field: `transformation_status` = "Pending"
4. ✅ Upload a photo and generate transformation
5. ✅ Check custom fields for image URLs
6. ✅ Generate video transformation
7. ✅ **Check `smile_video_url` custom field for video link**
8. ✅ **Check contact notes for video message**

---

## 🐛 Troubleshooting

### Issue: "platform API credentials not configured"

**Solution:**
- Verify API Key is saved in Settings → Integration
- Check that Location ID is correct
- Ensure API key has proper permissions:
  - `contacts.write`
  - `contacts.readonly`
  - `notes.write`

### Issue: Contacts created but no video URL

**Solution:**
- Check that custom field `smile_video_url` exists in platform
- Verify field type is set to "URL" or "Text"
- Check browser console for API errors
- Ensure FAL_API_KEY is configured in environment

### Issue: App not detecting platform SSO

**Solution:**
- Check URL parameters include `location_id`
- Verify you're accessing the app through embedded iframe
- Try manual configuration as fallback

---

## 🎯 Data Flow Diagram

```
User Submits Form
        ↓
  Contact Created in platform
        ↓
   Tags Applied
        ↓
User Uploads Photo
        ↓
AI Generates Transformation
        ↓
Image URLs Saved to Custom Fields
        ↓
User Generates Video
        ↓
Video URL Saved to:
  - Custom Field (smile_video_url)
  - Contact Notes (with clickable link)
        ↓
Status Updated: "Complete - Video Generated"
        ↓
platform Workflow Triggered
        ↓
Follow-up Email Sent
```

---

## 🔒 Security Best Practices

1. **Never share your API Key** publicly
2. Use **environment variables** for API keys in production
3. Enable **CORS restrictions** on your API key in platform
4. Set **IP restrictions** if possible
5. Regularly **rotate API keys** (every 90 days)

---

## 📞 Support

If you need help with the integration:

1. Check the browser console for error messages
2. Review the `/utils/ghl-api.ts` file for API call details
3. Test API calls directly using Postman/Insomnia
4. Contact platform support if API permissions are incorrect

---

## 🎉 Success!

Once configured, your SmileVisionPro AI app will:
- Capture leads automatically
- Save all transformation data to platform
- **Include video URLs** for easy access
- Trigger your marketing automation
- Help you convert more leads into patients!

**Happy smile transformations! 😁✨**
