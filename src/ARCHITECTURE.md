# SmileVisionPro - Dental AI Intake System

## 🏗️ Architecture Overview

This application consists of **TWO SEPARATE VIEWS**:

### 1️⃣ Public Landing Page (Patient-Facing)
**URL:** `/` or `https://your-domain.com`

**Purpose:** 
- Marketing landing page for potential patients
- Showcases before/after transformations
- Collects patient information via intake form
- Uploads smile photos/videos
- Processes AI smile enhancements (Gemini 2.5 Flash)

**Sections:**
- Hero with headline & CTA
- Before/After transformation gallery
- Two-column section (AI Upload + Intake Form)
- How It Works
- Testimonials
- Footer

---

### 2️⃣ platform Internal Dashboard (Staff-Only)
**URL:** `/?ghl=true` (demo mode)

**Purpose:**
- Internal marketplace portal app
- Dental staff manage patient submissions
- Review uploaded media
- Update patient status through pipeline
- Track leads and conversions

**Views:**
- 📊 Dashboard - Metrics & analytics
- 👥 Patients - Patient database & cards
- 🦷 Smile Tool - AI processing interface
- ⚙️ Settings - Clinic branding & configuration

---

## 🔄 How to Switch Between Views

### In Development (Current):
Look for the **floating button in bottom-right corner**:
- **"🌐 Public Landing Page"** - Currently viewing landing page
- **"🏥 platform Internal App"** - Currently viewing internal dashboard

Click the button to expand and see details, then click:
- **"Open platform Internal Dashboard"** - Switch to staff view
- **"Switch to Public Landing Page"** - Switch to patient view

### In Production:
The app mode switcher is **removed in production**. Instead:

**Public Landing Page:**
- Hosted on your domain: `https://your-dental-practice.com`
- Accessible to everyone
- No authentication required

**platform Internal Dashboard:**
- Accessed through marketplace portal
- URL: `https://app.gohighlevel.com/location/{locationId}/marketplace/apps/smilevisionpro`
- **OAuth Authentication** handled automatically by platform
- Only authorized clinic staff can access
- platform passes authentication tokens in URL/headers

---

## 🔐 Authentication & Security

### Public Landing Page
- ✅ No authentication required (public-facing)
- ✅ Form submissions create CRM contacts via webhook
- ✅ CORS configured for platform API calls
- ✅ API keys stored securely (environment variables)

### platform Internal Dashboard
**Development Mode:**
- No authentication (demo purposes)
- Access via `/?ghl=true` URL parameter

**Production Mode:**
- 🔒 **OAuth 2.0** authentication via platform
- 🔒 platform automatically validates user sessions
- 🔒 Location/Agency permissions enforced by platform
- 🔒 Only staff with proper roles can access

---

## 📊 Data Flow

### Patient Submission Flow:
```
1. Patient visits landing page
   ↓
2. Fills out intake form (name, email, phone, etc.)
   ↓
3. Uploads smile photos/videos
   ↓
4. (Optional) AI processes smile enhancement preview
   ↓
5. Submits form
   ↓
6. Webhook fires to CRM API
   ↓
7. New contact created in platform with:
   - Contact info (name, email, phone)
   - Custom fields (interested in, notes)
   - Uploaded media files
   - Tags ("New Lead", "Veneers Interest", etc.)
   ↓
8. Contact appears in platform Internal Dashboard
   ↓
9. Dental staff reviews submission
   ↓
10. Staff updates review status pipeline
    - New Smile Submission
    - Media Received
    - Under Review
    - Dentist Reviewed
    - Patient Contacted
   ↓
11. Automated follow-up workflows trigger (platform automations)
```

---

## 🎨 marketplace portal App Components

### SmileVisionPro Dashboard Features:

#### **Dashboard View** (`/components/ghl/DashboardView.tsx`)
- Metric cards (New Leads, Pending Reviews, etc.)
- Recent activity feed
- Quick actions
- Pipeline overview

#### **Patients View** (`/components/ghl/PatientsView.tsx`)
- Patient list with search/filter
- Patient cards with status badges
- Quick actions (View, Message)
- Pagination

#### **Contact Profile** (`/components/ghl/ContactProfile.tsx`)
- Full patient information
- Contact details (phone, email, location)
- Applied tags (color-coded pills)
- Service interest
- Uploaded media gallery (images/videos)
- Review status dropdown
- Clinical notes
- Activity timeline

#### **Smile Tool View** (`/components/ghl/SmileToolView.tsx`)
- AI smile enhancement interface
- Before/after comparison
- Batch processing
- Export options

#### **Settings View** (`/components/ghl/SettingsView.tsx`)
- Clinic branding customization
- Logo upload
- Primary/accent color pickers
- Clinic name
- Live preview

---

## 🏷️ Review Status Pipeline

5 stages for tracking patient submissions:

1. **New Smile Submission** (Blue)
   - Initial submission received
   - Awaiting first review

2. **Media Received** (Purple)
   - Photos/videos uploaded successfully
   - Files verified

3. **Under Review** (Amber)
   - Staff reviewing submission
   - Assessing patient needs

4. **Dentist Reviewed** (Green)
   - Licensed professional reviewed
   - Treatment plan determined

5. **Patient Contacted** (Gray)
   - Follow-up completed
   - Appointment scheduled or closed

**Components:**
- `ReviewStatus` - Badge or pipeline visualization
- `StatusDropdown` - Interactive status changer
- Color-coded with icons
- Integrated into Contact Profile

---

## 🚀 Deployment to platform

### Step 1: Deploy Landing Page
```bash
# Build the public landing page
npm run build

# Deploy to your hosting (Vercel, Netlify, etc.)
# Set environment variables:
# - VITE_GHL_API_KEY
# - VITE_GHL_LOCATION_ID
# - VITE_GEMINI_API_KEY
```

### Step 2: Register marketplace portal App
1. Go to platform developer portal
2. Create new Marketplace App
3. App Name: **SmileVisionPro**
4. App Type: **Location-level App**
5. OAuth Scopes:
   - `contacts.readonly`
   - `contacts.write`
   - `media.readonly`
   - `media.write`
   - `opportunities.readonly`
   - `opportunities.write`

### Step 3: Configure App URLs
- **App URL:** `https://your-app.com/?ghl=true`
- **OAuth Redirect:** `https://your-app.com/auth/callback`
- **Webhook URL:** `https://your-app.com/api/ghl/webhook`

### Step 4: Implement OAuth
```typescript
// Handle platform OAuth callback
// Extract location_id and access_token
// Store securely in session/database
// Redirect to internal dashboard
```

### Step 5: Submit for Review
- Upload app screenshots
- Write app description
- Set pricing (free or paid)
- Submit to platform for approval

---

## 🧪 Testing

### Test Public Landing Page:
1. Visit `/` (or click "View Landing" button)
2. Scroll through sections
3. Fill out intake form
4. Upload test image
5. Submit form
6. Check platform for new contact

### Test platform Dashboard:
1. Click floating button → "Open platform Internal Dashboard"
2. Explore Dashboard view (metrics)
3. Navigate to Patients view
4. Click "View" on patient card
5. See Contact Profile with:
   - Contact info
   - Tags
   - Media gallery
   - Review status
6. Change review status via dropdown
7. Test Settings view (change branding)

---

## 📦 File Structure

```
/
├── App.tsx                           # Main app router
├── components/
│   ├── AppModeSwitcher.tsx          # Toggle between landing/platform
│   ├── Hero.tsx                     # Landing page hero
│   ├── SmileTransformationSection.tsx
│   ├── PatientIntakeFormSection.tsx # Form with upload
│   ├── HowItWorks.tsx
│   ├── Testimonials.tsx
│   ├── Footer.tsx
│   └── ghl/
│       ├── SmileVisionProApp.tsx    # embedded app container
│       ├── AppHeader.tsx            # platform header with branding
│       ├── AppNavigation.tsx        # platform sidebar nav
│       ├── DashboardView.tsx        # Metrics & overview
│       ├── PatientsView.tsx         # Patient list
│       ├── ContactProfile.tsx       # Full patient profile ⭐
│       ├── SmileToolView.tsx        # AI processing
│       ├── SettingsView.tsx         # Branding settings
│       ├── ReviewStatus.tsx         # Pipeline component ⭐
│       ├── DemoPanel.tsx            # Quick branding test
│       └── shared/
│           ├── PatientCard.tsx      # Patient card component
│           └── MetricCard.tsx       # Dashboard metrics
```

---

## 🎯 Key Features

### ✅ Public Landing Page
- AI smile enhancement preview (Gemini 2.5 Flash)
- Comprehensive patient intake form
- Real-time validation & auto-formatting
- Drag & drop file upload
- Mobile-responsive design
- Before/after gallery
- Social proof notifications
- Compliance disclaimer

### ✅ platform Internal Dashboard
- Multi-view navigation (Dashboard, Patients, Smile Tool, Settings)
- Customizable clinic branding
- Patient contact management
- Media gallery with lightbox viewer
- Review status pipeline (5 stages)
- Tag system (color-coded)
- Activity timeline
- Quick actions (Message, Book Appointment)

---

## 🔧 Environment Variables

```env
# platform
VITE_GHL_API_KEY=your-ghl-api-key
VITE_GHL_LOCATION_ID=your-location-id

# Google Gemini AI
VITE_GEMINI_API_KEY=your-gemini-api-key

# App URLs
VITE_PUBLIC_URL=https://your-domain.com
VITE_GHL_OAUTH_REDIRECT=https://your-domain.com/auth/callback
```

---

## ❓ FAQ

### Q: How do I access the internal dashboard?
**A:** Click the floating button in the bottom-right corner that says "🌐 Public Landing Page" or "🏥 platform Internal App" and click "Open platform Internal Dashboard"

### Q: Why don't I see a login screen?
**A:** In development mode, authentication is bypassed for demo purposes. In production, platform handles OAuth automatically when users access the app through the marketplace portal.

### Q: How do patient submissions reach the internal dashboard?
**A:** When a patient submits the intake form, a webhook fires to the platform API creating a new contact with all form data and uploaded media. This contact then appears in the Patients view of the internal dashboard.

### Q: Can I customize the branding?
**A:** Yes! In the internal dashboard, go to Settings view to upload your clinic logo and change primary/accent colors. Changes apply instantly. There's also a quick demo panel in the bottom-left corner for testing.

### Q: What happens to uploaded photos?
**A:** Photos are stored in platform's media library and linked to the contact record. Dental staff can view, download, and manage all uploaded media in the Contact Profile's media gallery.

### Q: How does the review status pipeline work?
**A:** Staff can update a patient's status through 5 stages (New Submission → Media Received → Under Review → Dentist Reviewed → Patient Contacted). This is visible in the Contact Profile and can trigger automated workflows in platform.

---

## 📞 Support

For questions about:
- **platform Integration:** [platform Developer Docs](https://developers.gohighlevel.com/)
- **App Configuration:** See Settings view in internal dashboard
- **Technical Issues:** Check browser console for errors

---

**Built with:** React, TypeScript, Tailwind CSS, CRM API, Google Gemini AI
