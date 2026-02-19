# 🚀 Marketplace Implementation Checklist

## Files Created

✅ **Components:**
- `/components/marketplace/EmbeddedAppLayout.tsx` - Main iframe container
- `/components/marketplace/MarketplaceContainer.tsx` - Spacing wrapper
- `/components/marketplace/MarketplaceCard.tsx` - Reusable card component
- `/components/marketplace/GHLMarketplaceConnect.tsx` - OAuth UI

✅ **App Entry Point:**
- `/App.marketplace.tsx` - Marketplace-ready version

✅ **Documentation:**
- `/MARKETPLACE_REFACTOR_GUIDE.md` - Complete guide
- `/BEFORE_AFTER_MARKETPLACE.md` - Visual comparison
- `/MARKETPLACE_IMPLEMENTATION.md` - This file

---

## Quick Start

### 1. Switch to Marketplace Version

```bash
# Backup original
cp App.tsx App.original.tsx

# Use marketplace version
cp App.marketplace.tsx App.tsx
```

### 2. Test Locally

#### Standalone Mode:
```bash
npm run dev
# Visit: http://localhost:5173/marketplace/connect
```

#### Embedded Mode (Create test file):
```html
<!-- test-iframe.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Iframe Test</title>
  <style>
    body { margin: 0; padding: 20px; font-family: sans-serif; }
    iframe { border: 1px solid #ccc; border-radius: 8px; }
  </style>
</head>
<body>
  <h1>GoHighLevel Iframe Test</h1>
  <p>Testing SmileVision Pro in embedded mode:</p>
  
  <!-- Small mobile size -->
  <h3>Mobile (375px)</h3>
  <iframe 
    src="http://localhost:5173/marketplace/connect"
    width="375px"
    height="667px"
    frameborder="0"
  ></iframe>
  
  <!-- Tablet size -->
  <h3>Tablet (768px)</h3>
  <iframe 
    src="http://localhost:5173/marketplace/connect"
    width="768px"
    height="600px"
    frameborder="0"
  ></iframe>
  
  <!-- Desktop size -->
  <h3>Desktop (1024px)</h3>
  <iframe 
    src="http://localhost:5173/marketplace/connect"
    width="1024px"
    height="700px"
    frameborder="0"
  ></iframe>
</body>
</html>
```

Open `test-iframe.html` in your browser to test embedded mode.

---

## Testing Checklist

### ✅ Visual Testing

#### Standalone Mode
- [ ] Landing page loads
- [ ] All sections visible
- [ ] Navigation works
- [ ] Footer present
- [ ] Responsive on mobile

#### Embedded Mode (`/marketplace/connect`)
- [ ] Loads in iframe without errors
- [ ] No horizontal scroll at 375px width
- [ ] No horizontal scroll at 768px width
- [ ] No horizontal scroll at 1024px width
- [ ] Modals stay within viewport
- [ ] Dropdowns don't overflow

---

### ✅ Functionality Testing

#### OAuth Flow
- [ ] "Connect GoHighLevel" button works
- [ ] Redirects to GHL authorization
- [ ] Callback returns to app
- [ ] Success message displays
- [ ] Connection card appears
- [ ] Refresh button works
- [ ] Disconnect button works

#### Responsive Behavior
- [ ] Mobile: Single column layout
- [ ] Mobile: Stacked buttons
- [ ] Tablet: Two column layout
- [ ] Desktop: Three column layout
- [ ] Text truncates properly
- [ ] Icons scale appropriately

#### Error Handling
- [ ] Network errors show inline alert
- [ ] OAuth errors display properly
- [ ] Alert dismissal works
- [ ] Error messages are readable

---

### ✅ Spacing Audit

Check that all spacing follows 8px grid:

#### Padding
- [ ] MarketplaceContainer uses p-4 or p-6
- [ ] MarketplaceCard uses p-4 or p-6
- [ ] No arbitrary padding values

#### Gaps
- [ ] Gaps between elements: gap-2, gap-4, gap-6
- [ ] No arbitrary gap values
- [ ] Consistent throughout

#### Margins
- [ ] Margins: mb-2, mb-4, mb-6
- [ ] No arbitrary margin values
- [ ] Consistent spacing between sections

---

### ✅ Typography Check

Verify consistent text sizing:

- [ ] Headings: text-xl, text-2xl
- [ ] Body text: text-sm, text-base
- [ ] Helper text: text-xs
- [ ] No arbitrary font sizes

---

### ✅ Color Consistency

Ensure colors match original:

- [ ] Primary: Blue (#0EA5E9)
- [ ] Success: Green
- [ ] Error: Red
- [ ] Neutrals: Gray scale
- [ ] No new colors introduced

---

## Deployment Steps

### 1. Pre-Deployment

```bash
# Run build
npm run build

# Check for errors
npm run lint

# Test production build locally
npm run preview
```

### 2. Deploy to Production

```bash
# Your deployment command (e.g., Vercel, Netlify, etc.)
npm run deploy

# Or manual deployment:
# Upload /dist folder to your hosting
```

### 3. Verify Production

```bash
# Test production URL
curl https://www.smilevisionpro.ai/marketplace/connect

# Should return 200 OK with HTML
```

### 4. Test in Production Iframe

```html
<iframe 
  src="https://www.smilevisionpro.ai/marketplace/connect"
  width="100%"
  height="800px"
  frameborder="0"
></iframe>
```

---

## GHL Marketplace Configuration

### App Configuration JSON

```json
{
  "name": "SmileVision Pro",
  "description": "AI-powered smile transformation tool for dental practices",
  "version": "1.0.0",
  "author": "Your Company Name",
  "support_email": "support@smilevisionpro.ai",
  "logo_url": "https://www.smilevisionpro.ai/logo.png",
  "iframe_url": "https://www.smilevisionpro.ai/marketplace/connect",
  "oauth": {
    "client_id": "YOUR_CLIENT_ID",
    "client_secret": "YOUR_CLIENT_SECRET",
    "redirect_uri": "https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/oauth/callback",
    "scopes": [
      "locations.readonly",
      "contacts.write",
      "contacts.readonly",
      "forms.write",
      "forms.readonly",
      "locations/customFields.write",
      "locations/customFields.readonly",
      "locations/customValues.write",
      "locations/customValues.readonly"
    ]
  },
  "webhooks": {
    "install": "https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/webhooks/install",
    "uninstall": "https://pvophjpndtqxkoygposy.supabase.co/functions/v1/make-server-c5a5d193/webhooks/uninstall"
  }
}
```

### Required Scopes Explanation

```
locations.readonly - Read location info
contacts.write - Create/update contacts
contacts.readonly - Read contact data
forms.write - Create custom forms
forms.readonly - Read form data
locations/customFields.write - Create custom fields
locations/customFields.readonly - Read custom fields
locations/customValues.write - Save custom field values
locations/customValues.readonly - Read custom field values
```

---

## Post-Deployment Monitoring

### Things to Monitor

1. **Error Rate**
   - Check browser console for errors
   - Monitor Supabase Edge Function logs
   - Track failed OAuth attempts

2. **Performance**
   - Page load time in iframe
   - Time to interactive
   - API response times

3. **User Issues**
   - OAuth connection failures
   - Layout issues in different iframes
   - Mobile responsiveness problems

### Logging Setup

Add console logs to track issues:

```tsx
// In EmbeddedAppLayout
useEffect(() => {
  const embedded = window.self !== window.top;
  console.log('🎯 Embedded mode:', embedded);
  console.log('📐 Viewport:', window.innerWidth, 'x', window.innerHeight);
  
  if (embedded) {
    console.log('✅ Running in iframe');
  }
}, []);
```

---

## Troubleshooting

### Issue: App doesn't load in iframe

**Check:**
1. CORS headers configured?
2. X-Frame-Options allowing embedding?
3. Content-Security-Policy allowing iframe?

**Solution:**
```
# Add to server config
X-Frame-Options: ALLOWALL
Content-Security-Policy: frame-ancestors *
```

---

### Issue: Horizontal scroll in iframe

**Check:**
1. All containers have `max-width: 100%`?
2. No fixed widths on elements?
3. Images have `max-width: 100%`?

**Solution:**
```css
.embedded-app-root {
  overflow-x: hidden;
}

.embedded-app-root * {
  max-width: 100%;
}
```

---

### Issue: Modals overflow iframe

**Check:**
1. Modal uses fixed positioning?
2. Transform centering applied?
3. Max-height set?

**Solution:**
```css
[role="dialog"] {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
  max-height: 90vh;
  overflow-y: auto;
}
```

---

### Issue: OAuth redirect not working

**Check:**
1. GHL_REDIRECT_URI matches GHL app config?
2. Backend route deployed?
3. OAuth credentials correct?

**Solution:**
```bash
# Verify environment variables
echo $GHL_CLIENT_ID
echo $GHL_CLIENT_SECRET
echo $GHL_REDIRECT_URI

# Should match GHL Marketplace app config
```

---

## Rollback Plan

If issues occur in production:

### Step 1: Quick Revert
```bash
# Restore original version
cp App.original.tsx App.tsx

# Rebuild and redeploy
npm run build
npm run deploy
```

### Step 2: Verify Rollback
```bash
# Test original version works
curl https://www.smilevisionpro.ai/admin/ghl-connect
```

### Step 3: Investigate
- Check browser console errors
- Review server logs
- Test iframe locally
- Fix issues in marketplace version

### Step 4: Re-Deploy
```bash
# After fixes
cp App.marketplace.tsx App.tsx
npm run build
npm run deploy
```

---

## Success Criteria

### ✅ Deployment Successful When:

1. **Loads in iframe** - No errors in console
2. **No horizontal scroll** - At 375px, 768px, 1024px
3. **OAuth works** - Full connection flow completes
4. **Responsive** - Works on all screen sizes
5. **Modals contained** - Stay within iframe viewport
6. **Consistent spacing** - 8px grid throughout
7. **Visual match** - Looks like original design
8. **Performance** - Loads in < 3 seconds

---

## Maintenance Notes

### Regular Checks

**Weekly:**
- [ ] Monitor error logs
- [ ] Check OAuth success rate
- [ ] Review user feedback

**Monthly:**
- [ ] Update dependencies
- [ ] Audit accessibility
- [ ] Performance review
- [ ] Mobile testing

**Quarterly:**
- [ ] Design audit (ensure consistency)
- [ ] Refactor opportunities
- [ ] New GHL API features
- [ ] User experience improvements

---

## Support Resources

### Documentation
- `/MARKETPLACE_REFACTOR_GUIDE.md` - Complete guide
- `/BEFORE_AFTER_MARKETPLACE.md` - Visual comparison
- `/MARKETPLACE_IMPLEMENTATION.md` - This checklist

### Code Examples
- `/components/marketplace/` - Reference components
- `/App.marketplace.tsx` - Reference implementation
- `test-iframe.html` - Testing template

### External Resources
- [GHL Marketplace Docs](https://developer.gohighlevel.com/)
- [Tailwind 8px Grid](https://tailwindcss.com/docs/customizing-spacing)
- [React Iframe Communication](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)

---

## Status

- ✅ Components Created
- ✅ Documentation Written
- ✅ Testing Guide Provided
- ⏳ Local Testing Needed
- ⏳ Production Deployment Needed
- ⏳ GHL Marketplace Submission Needed

**Next Step:** Test locally with `test-iframe.html` then deploy!

---

**Date:** February 7, 2026  
**Version:** 1.0.0  
**Status:** Ready for Testing
