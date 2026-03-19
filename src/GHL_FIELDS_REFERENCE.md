# Quick Reference: platform API Fields & Custom Values

## 📋 Custom Fields to Add in platform

To properly receive all data from SmileVisionPro, add these **Custom Fields** in your platform location:

### Navigate to: platform → Settings → Custom Fields

### Required Custom Fields:

| Field Name | Field Type | API Key | Description |
|------------|------------|---------|-------------|
| **Service Interest** | Dropdown | `service_interest` | What treatment they're interested in |
| **Notes** | Text Area | `notes` | Patient's smile goals and concerns |
| **Lead Source** | Text | `lead_source` | Always set to "Smile AI Website" |
| **Transformation Status** | Dropdown | `transformation_status` | Current stage in the process |

---

## 🔽 Dropdown Options

### Service Interest Options:
```
- Veneers
- Invisalign  
- Whitening
- Smile Makeover
- Other
```

### Transformation Status Options:
```
- Pending (form submitted, awaiting upload)
- Processing (AI generating images)
- Images Generated (before/after ready)
- Complete - Video Generated
- Complete - Animated Preview
```

---

## 🏷️ Tags Auto-Applied

SmileVisionPro automatically tags all contacts with:
- `smile-transformation`
- `ai-lead`

You can use these tags to:
- Create filtered contact views
- Trigger automated workflows
- Build smart lists for campaigns

---

## 📊 Data Mapping: Form → platform

| Form Field | platform Field | Notes |
|------------|-----------|-------|
| Full Name | `firstName` + `lastName` | Auto-split by space |
| Email | `email` | Standard platform field |
| Phone | `phone` | Formatted as (555) 123-4567 |
| Interested In | `customFields.service_interest` | Custom field |
| Optional Notes | `customFields.notes` | Custom field |
| - | `source` | Set to "SmileVision AI Landing Page" |
| - | `customFields.lead_source` | Set to "Smile AI Website" |
| - | `customFields.transformation_status` | Updated as process progresses |
| - | `tags` | Auto-added: smile-transformation, ai-lead |

---

## 🖼️ Media Files Uploaded

When a transformation is completed, these files are attached to the contact:

1. **before-smile.jpg** - Original uploaded photo
2. **after-smile-ai.jpg** - AI-enhanced smile image
3. **smile-video.mp4** - Generated smile animation (if available)

Files are currently attached as **notes** with file references. For direct file uploads, additional API implementation is needed.

---

## 🔐 Required API Permissions

When creating your platform API Key, ensure these permissions are enabled:

```
✅ contacts.readonly - Read contact data
✅ contacts.write - Create and update contacts  
✅ locations.readonly - Read location info
✅ files.write - Upload images/videos (optional)
✅ notes.write - Add transformation notes
✅ customFields.write - Update custom fields
✅ tags.write - Add/manage tags
```

---

## 🔄 Workflow Triggers You Can Set Up

### Trigger 1: New AI Lead Received
**When**: Contact created with tag `ai-lead`  
**Actions**:
- Send thank you email with their preview
- Assign to sales rep
- Add to "Smile Transformation" pipeline

### Trigger 2: Transformation Complete
**When**: Custom field `transformation_status` changes to "Images Generated" or "Complete"  
**Actions**:
- SMS notification to practice
- Email preview to patient with booking link
- Schedule follow-up task for consultation call

### Trigger 3: 24 Hour Follow-Up
**When**: 24 hours after contact creation with tag `smile-transformation`  
**Actions**:
- If no response: Send follow-up SMS
- If no consultation booked: Call from sales rep
- Move to "Follow-Up Needed" stage

---

## 🎯 Pipeline Recommendation

Create a custom pipeline: **"Smile Transformation Pipeline"**

### Stages:
1. **Lead** - Form submitted
2. **Preview Generated** - transformation_status = "Images Generated"
3. **Contacted** - First outreach made
4. **Consultation Booked** - Appointment scheduled
5. **Quote Sent** - Treatment plan provided
6. **Won** - Accepted treatment
7. **Lost** - Declined or no response

### Automation Rules:
- Auto-move to "Preview Generated" when transformation_status updates
- Auto-move to "Contacted" when first outbound call/SMS logged
- Auto-move to "Consultation Booked" when calendar event created

---

## 🧪 Test Data Template

Use this for testing the integration:

```json
{
  "fullName": "John Smith",
  "email": "john.smith.test@example.com",
  "phone": "(555) 123-4567",
  "interestedIn": "Veneers",
  "notes": "Interested in fixing crooked front teeth. Budget is flexible. Would like to complete before June wedding."
}
```

**Expected platform Contact**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith.test@example.com",
  "phone": "+15551234567",
  "source": "SmileVision AI Landing Page",
  "tags": ["smile-transformation", "ai-lead"],
  "customFields": {
    "service_interest": "Veneers",
    "notes": "Interested in fixing crooked front teeth. Budget is flexible. Would like to complete before June wedding.",
    "lead_source": "Smile AI Website",
    "transformation_status": "Pending"
  }
}
```

---

## 🚨 Common Issues & Quick Fixes

### Issue: Custom fields not populating
**Fix**: Make sure the custom field API keys match exactly (case-sensitive):
- `service_interest` (not `serviceInterest`)
- `transformation_status` (not `transformationStatus`)
- `lead_source` (not `leadSource`)

### Issue: Tags not applying
**Fix**: Verify your API key has `tags.write` permission enabled

### Issue: Phone formatting error
**Fix**: App auto-formats to E.164 format. platform expects country code (+1 for US).
Current format: `(555) 123-4567` → Converted to: `+15551234567`

### Issue: Images not uploading
**Fix**: 
- Current version adds notes with file references
- For direct uploads: Implement multipart/form-data to platform's file storage endpoint
- Alternative: Use Cloudinary/AWS S3 and store URLs in custom fields

---

## 📖 API Documentation Links

- **platform API Docs**: https://highlevel.stoplight.io/
- **Create Contact**: `POST /contacts`
- **Update Contact**: `PUT /contacts/{contactId}`
- **Add Note**: `POST /contacts/{contactId}/notes`
- **Upload File**: `POST /medias/upload-file`
- **Get Location**: `GET /locations/{locationId}`

---

## 💡 Pro Tips

1. **Create a test location** in platform to avoid polluting production data
2. **Use different phone formats** to test validation (international, different countries)
3. **Set up a test pipeline** to visualize the lead flow
4. **Create saved filters** for:
   - All AI leads (tag: `ai-lead`)
   - Pending transformations (status: `Pending`)
   - Ready for follow-up (status: `Complete` + no consultation booked)

4. **Monitor API usage** in platform settings to ensure you're within rate limits

---

## 🎓 Training for Your Team

### For Sales Reps:
- Contacts with tag `smile-transformation` are warm leads who've seen their preview
- Check the `transformation_status` field to know if they've seen before/after images
- Reference their `service_interest` when calling - they've already expressed interest
- Use the `notes` field to understand their specific concerns

### For Practice Admins:
- Configure API credentials in Settings → Integration tab
- Customize branding in Settings → Branding tab
- Monitor incoming leads in Dashboard → Patients view
- Review transformation gallery for quality control

### For Dentists:
- Review the before/after previews in each contact's notes
- Understand these are AI simulations, not treatment plans
- Use as conversation starters during consultations
- Set realistic expectations based on actual dental assessment

---

**Need help?** Check the full installation guide in `/GHL_INSTALLATION_GUIDE.md`
