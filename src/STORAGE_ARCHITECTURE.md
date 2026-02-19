# 🔐 Secure Storage Architecture for GHL Marketplace

## Overview

This app uses **GoHighLevel Custom Values API** for all persistent storage, making it marketplace-ready with proper data isolation per sub-account.

## ✅ What's Stored Where

### 1. **Session Data** (sessionStorage) ✅
- `smileai_admin_authenticated` - Temporary authentication flag
- `ghl_current_location_id` - Cached location ID for current session
- **Why sessionStorage?** Cleared when tab/browser closes, perfect for sessions

### 2. **Persistent Data** (GHL Custom Values) ✅
All of the following are stored in GoHighLevel Custom Values API:

#### a. **Admin Password** 🔒
- **Key**: `smileai_admin_password_hash`
- **Format**: PBKDF2 hash (not plain text!)
- **Example**: `pbkdf2$YWJjMTIzZGVmNDU2...`
- **Default**: Hash of "admin123" (created on first launch)
- **Security**: Uses Web Crypto API with PBKDF2-SHA256, 100,000 iterations

#### b. **Clinic Branding** 🎨
- **Key**: `smileai_clinic_branding`
- **Format**: JSON string
- **Contains**:
  - Clinic name
  - Logo URL
  - Hero image URL
  - Contact info (address, phone, email)
  - Social media links
  - Testimonials array
  - Google Reviews script

#### c. **API Credentials** 🔑
- **Key**: `smileai_api_credentials`
- **Format**: JSON string
- **Contains**:
  - GHL API key
  - GHL Location ID
- **Note**: In production, these come from GHL SSO (not stored)

### 3. **Lead Data** (GHL Contacts) ✅
- All form submissions go directly to GHL Contacts API
- Images/videos uploaded to GHL Media API
- Contact custom fields track status

### 4. **Cache** (localStorage - temporary) ⚡
- `smileai_clinic_branding` - Local cache for faster loading
- `ghl_api_key` - Development only (SSO in production)
- `ghl_location_id` - Development only (SSO in production)
- **Note**: This is a READ cache only. Source of truth is GHL Custom Values.

## 🔒 Security Features

### Password Security - PBKDF2 Implementation
```typescript
// ✅ CORRECT - Using Web Crypto API (built into browsers)
const hash = await hashPassword('mypassword123');
// Returns: pbkdf2$YWJjMTIzZGVmNDU2...

// ✅ CORRECT - Verify login
const isValid = await verifyPassword('mypassword123', hash);
// Returns: true/false

// ❌ WRONG - Never store plain text
localStorage.setItem('password', 'mypassword123'); // DON'T DO THIS!
```

### PBKDF2 Details
- **Algorithm**: PBKDF2 (Password-Based Key Derivation Function 2)
- **Hash**: SHA-256
- **Iterations**: 100,000 (OWASP recommended minimum)
- **Salt**: 16 bytes random (crypto.getRandomValues)
- **Output**: 32 bytes (256 bits)
- **Format**: `pbkdf2$[base64(salt+hash)]`
- **Bundle Size**: 0KB (native Web Crypto API)
- **Browser Support**: All modern browsers ✅

### Why PBKDF2 Instead of bcrypt?
- ✅ **Native**: Built into browsers (Web Crypto API)
- ✅ **0KB**: No external dependencies
- ✅ **Secure**: OWASP-recommended, used by 1Password, LastPass
- ✅ **Fast**: No library loading time
- ❌ bcryptjs: 50KB bundle size, requires polyfill

## 📡 GHL Custom Values API Integration

### How It Works
```typescript
// Get custom value from GHL
const value = await getCustomValue('smileai_admin_password_hash');

// Set custom value in GHL
await setCustomValue('smileai_clinic_branding', JSON.stringify(branding));
```

### Location Isolation
Each GHL sub-account has its own Custom Values, ensuring:
- ✅ Clinic A cannot see Clinic B's settings
- ✅ Each location has independent branding
- ✅ Passwords are unique per location
- ✅ Testimonials are location-specific

### Fallback Behavior
```typescript
// If GHL credentials are not configured:
// 1. Tries to get from GHL Custom Values API
// 2. If API fails or no credentials → falls back to localStorage
// 3. When credentials are added → syncs localStorage to GHL
```

## 🔄 Migration from localStorage

### Automatic Migration
On first load with GHL credentials configured:
```typescript
await migrateLocalStorageToGHL();
```

This will:
1. Read old password from localStorage
2. Hash it with PBKDF2 (if plain text)
3. Store hash in GHL Custom Values
4. Migrate branding JSON to GHL
5. Log completion

### Manual Migration
In Settings → Security, there's a migration button that staff can click.

## 🚀 Marketplace Deployment Checklist

### Before Publishing
- ✅ All settings use GHL Custom Values API
- ✅ Passwords are hashed with PBKDF2
- ✅ No sensitive data in localStorage
- ✅ sessionStorage only for temporary session data
- ✅ Lead data goes to GHL Contacts API
- ✅ Images/videos use GHL Media API

### After Publishing
- ✅ Each location gets isolated data
- ✅ Default password works on first install
- ✅ Staff can change password in Settings
- ✅ Branding is location-specific
- ✅ No data leakage between sub-accounts

## 🛠️ Developer Notes

### Testing Locally
```bash
# Without GHL credentials:
# - Falls back to localStorage (for development)
# - Still uses bcrypt for passwords

# With GHL credentials:
# - Uses Custom Values API
# - Full marketplace behavior
```

### API Endpoints Used
```
GET  /locations/{locationId}/customValues/{key}
POST /locations/{locationId}/customValues
POST /contacts
POST /contacts/{contactId}/media
PUT  /contacts/{contactId}
```

### Rate Limits
- Custom Values: No documented limits
- Contacts API: 100 requests/minute
- Media Upload: 10MB per file

## 🔐 Security Best Practices

### DO:
✅ Use PBKDF2 for passwords  
✅ Store hashes in GHL Custom Values  
✅ Use sessionStorage for temporary data  
✅ Validate all inputs  
✅ Use HTTPS for all API calls  

### DON'T:
❌ Store plain text passwords  
❌ Use localStorage for cross-location data  
❌ Store API keys in code  
❌ Skip input validation  
❌ Log sensitive data  

## 📊 Data Flow

```
User fills form
    ↓
Lead data → GHL Contacts API ✅
    ↓
User uploads image
    ↓
Image → Gemini API → Enhanced image
    ↓
Images → GHL Media API (attached to contact) ✅
    ↓
Status updated → GHL Contact custom field ✅
```

## 🎯 Key Takeaways

1. **No localStorage for persistent data** - Only sessionStorage for session state
2. **All settings in GHL Custom Values** - Location-isolated storage
3. **Passwords are hashed** - Never store plain text
4. **Lead data in GHL Contacts** - Proper CRM integration
5. **Marketplace-ready** - Each sub-account is isolated

---

**Last Updated**: January 19, 2026  
**Storage Version**: 2.0 (GHL Custom Values + PBKDF2)