/**
 * platform Storage Utility - Location-Specific Storage using Custom Values API
 * 
 * This utility stores all app settings in platform Custom Values
 * to ensure each sub-account has isolated data (marketplace-ready).
 * 
 * Data stored with SEPARATE KEYS for better organization:
 * - Hashed admin password (PBKDF2 via Web Crypto API)
 * - Clinic branding (logo, name, colors, hero image)
 * - Contact info (address, phone, email)
 * - Social media (facebook, instagram, tiktok, linkedin, youtube)
 * - Testimonials (patient reviews)
 * - Google Reviews script (widget embed code)
 * - API credentials (for platform integration)
 */

import { hashPassword, verifyPassword, isHashedPassword } from './password-utils';

// Custom Values keys for platform storage - SEPARATE KEYS FOR EACH DATA TYPE
const STORAGE_KEYS = {
  ADMIN_PASSWORD_HASH: 'smileai_admin_password_hash',
  BRANDING: 'smileai_branding',
  CONTACT_INFO: 'smileai_contact_info',
  SOCIAL_MEDIA: 'smileai_social_media',
  TESTIMONIALS: 'smileai_testimonials',
  GOOGLE_REVIEWS: 'smileai_google_reviews',
  API_CREDENTIALS: 'smileai_api_credentials',
  // Legacy key for migration
  LEGACY_CLINIC_BRANDING: 'smileai_clinic_branding',
} as const;

// Default password (for first-time setup: "admin123")
const DEFAULT_PASSWORD = 'admin123';

/**
 * Get platform Location ID from URL params or localStorage fallback
 */
function getLocationId(): string | null {
  // First, try to get from URL params (embedded iframe context)
  const urlParams = new URLSearchParams(window.location.search);
  const locationId = urlParams.get('location_id') || urlParams.get('locationId');
  
  if (locationId) {
    // Cache it in sessionStorage for this session
    sessionStorage.setItem('ghl_current_location_id', locationId);
    return locationId;
  }
  
  // Fallback to sessionStorage
  const cached = sessionStorage.getItem('ghl_current_location_id');
  if (cached) return cached;
  
  // Last resort: get from settings (set by user in API Settings)
  return localStorage.getItem('ghl_location_id');
}

/**
 * Get platform API Key from localStorage
 * NOTE: In production marketplace, this should come from platform's SSO token
 */
function getApiKey(): string | null {
  return localStorage.getItem('ghl_api_key');
}

/**
 * Generic function to get custom value from platform
 */
async function getCustomValue(key: string): Promise<string | null> {
  try {
    const apiKey = getApiKey();
    const locationId = getLocationId();

    if (!apiKey || !locationId) {
      console.warn('platform credentials not configured, falling back to localStorage');
      return localStorage.getItem(key);
    }

    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues/${key}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Version': '2021-07-28',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        // Custom value doesn't exist yet
        return null;
      }
      throw new Error(`Failed to get custom value: ${response.status}`);
    }

    const data = await response.json();
    return data.value || null;
  } catch (error) {
    console.error(`Error getting custom value ${key}:`, error);
    // Fallback to localStorage during development
    return localStorage.getItem(key);
  }
}

/**
 * Generic function to set custom value in platform
 */
async function setCustomValue(key: string, value: string): Promise<boolean> {
  try {
    const apiKey = getApiKey();
    const locationId = getLocationId();

    if (!apiKey || !locationId) {
      console.warn('platform credentials not configured, falling back to localStorage');
      localStorage.setItem(key, value);
      return true;
    }

    const response = await fetch(
      `https://services.leadconnectorhq.com/locations/${locationId}/customValues`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Version': '2021-07-28',
        },
        body: JSON.stringify({
          key: key,
          value: value,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to set custom value: ${response.status}`);
    }

    // Also cache in localStorage for faster access
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting custom value ${key}:`, error);
    // Fallback to localStorage during development
    localStorage.setItem(key, value);
    return false;
  }
}

// ============================================
// PASSWORD MANAGEMENT (Hashed with PBKDF2 via Web Crypto API)
// ============================================

/**
 * Get stored password hash from platform
 */
export async function getPasswordHash(): Promise<string | null> {
  const hash = await getCustomValue(STORAGE_KEYS.ADMIN_PASSWORD_HASH);
  
  // If no password is set, create default password hash
  if (!hash) {
    const defaultHash = await hashPassword(DEFAULT_PASSWORD);
    await setPasswordHash(defaultHash);
    return defaultHash;
  }
  
  return hash;
}

/**
 * Set password hash in platform
 */
export async function setPasswordHash(hash: string): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.ADMIN_PASSWORD_HASH, hash);
}

/**
 * Update password (hashes it before storing)
 */
export async function updatePassword(newPassword: string): Promise<boolean> {
  const hash = await hashPassword(newPassword);
  return setPasswordHash(hash);
}

/**
 * Verify login password
 */
export async function verifyLoginPassword(password: string): Promise<boolean> {
  const hash = await getPasswordHash();
  if (!hash) return false;
  return verifyPassword(password, hash);
}

// ============================================
// CLINIC BRANDING MANAGEMENT
// ============================================

export interface Branding {
  clinicName: string;
  logo: string | null;
  heroImage: string | null;
  colors: {
    primary: string;
    secondary: string;
  };
}

/**
 * Get clinic branding from platform
 */
export async function getBranding(): Promise<Branding | null> {
  const data = await getCustomValue(STORAGE_KEYS.BRANDING);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing clinic branding:', error);
    return null;
  }
}

/**
 * Set clinic branding in platform
 */
export async function setBranding(branding: Branding): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.BRANDING, JSON.stringify(branding));
}

// ============================================
// CONTACT INFO MANAGEMENT
// ============================================

export interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
}

/**
 * Get contact info from platform
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  const data = await getCustomValue(STORAGE_KEYS.CONTACT_INFO);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing contact info:', error);
    return null;
  }
}

/**
 * Set contact info in platform
 */
export async function setContactInfo(contactInfo: ContactInfo): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.CONTACT_INFO, JSON.stringify(contactInfo));
}

// ============================================
// SOCIAL MEDIA MANAGEMENT
// ============================================

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  linkedin?: string;
  youtube?: string;
}

/**
 * Get social media links from platform
 */
export async function getSocialMedia(): Promise<SocialMedia | null> {
  const data = await getCustomValue(STORAGE_KEYS.SOCIAL_MEDIA);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing social media links:', error);
    return null;
  }
}

/**
 * Set social media links in platform
 */
export async function setSocialMedia(socialMedia: SocialMedia): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.SOCIAL_MEDIA, JSON.stringify(socialMedia));
}

// ============================================
// TESTIMONIALS MANAGEMENT
// ============================================

export interface Testimonial {
  id: string;
  text: string;
  rating: number;
  image: string | null;
  name: string;
  city: string;
  service: string;
}

/**
 * Get testimonials from platform
 */
export async function getTestimonials(): Promise<Testimonial[] | null> {
  const data = await getCustomValue(STORAGE_KEYS.TESTIMONIALS);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing testimonials:', error);
    return null;
  }
}

/**
 * Set testimonials in platform
 */
export async function setTestimonials(testimonials: Testimonial[]): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
}

// ============================================
// GOOGLE REVIEWS MANAGEMENT
// ============================================

export interface GoogleReviews {
  script: string;
}

/**
 * Get Google Reviews script from platform
 */
export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  const data = await getCustomValue(STORAGE_KEYS.GOOGLE_REVIEWS);
  if (!data) return null;
  
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing Google Reviews script:', error);
    return null;
  }
}

/**
 * Set Google Reviews script in platform
 */
export async function setGoogleReviews(googleReviews: GoogleReviews): Promise<boolean> {
  return setCustomValue(STORAGE_KEYS.GOOGLE_REVIEWS, JSON.stringify(googleReviews));
}

// ============================================
// API CREDENTIALS MANAGEMENT
// ============================================

export interface ApiCredentials {
  ghlApiKey: string;
  ghlLocationId: string;
}

/**
 * Get API credentials from platform
 * NOTE: In production, API key should come from platform SSO, not stored
 */
export async function getApiCredentials(): Promise<ApiCredentials | null> {
  // For now, use localStorage (will be replaced with platform SSO in production)
  const apiKey = localStorage.getItem('ghl_api_key');
  const locationId = localStorage.getItem('ghl_location_id');
  
  if (!apiKey || !locationId) return null;
  
  return { ghlApiKey: apiKey, ghlLocationId: locationId };
}

/**
 * Set API credentials
 * NOTE: In production, this should not be needed (platform SSO handles it)
 */
export async function setApiCredentials(credentials: ApiCredentials): Promise<boolean> {
  // For now, use localStorage (will be replaced with platform SSO in production)
  localStorage.setItem('ghl_api_key', credentials.ghlApiKey);
  localStorage.setItem('ghl_location_id', credentials.ghlLocationId);
  return true;
}

// ============================================
// MIGRATION HELPERS
// ============================================

/**
 * Legacy ClinicBranding interface (for backward compatibility)
 */
export interface ClinicBranding {
  clinicName: string;
  logo: string | null;
  heroImage: string | null;
  primaryColor?: string;
  contactInfo: {
    address?: string;
    phone?: string;
    email?: string;
  };
  socialMedia: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  testimonials: Array<{
    id: string;
    text: string;
    rating: number;
    image: string | null;
    name: string;
    city: string;
    service: string;
  }>;
  googleReviewsScript?: string;
}

/**
 * Get all clinic data (combined from separate keys) - Legacy support
 * This maintains backward compatibility with existing code
 */
export async function getClinicBranding(): Promise<ClinicBranding | null> {
  // First, check if we need to migrate from legacy single-key structure
  const legacyData = await getCustomValue(STORAGE_KEYS.LEGACY_CLINIC_BRANDING);
  if (legacyData) {
    console.log('🔄 Detected legacy data, migrating to new structure...');
    try {
      const legacy: ClinicBranding = JSON.parse(legacyData);
      
      // Migrate to new separate-key structure
      if (legacy.clinicName || legacy.logo || legacy.heroImage) {
        await setBranding({
          clinicName: legacy.clinicName || '',
          logo: legacy.logo,
          heroImage: legacy.heroImage,
          colors: {
            primary: legacy.primaryColor || '#3b82f6',
            secondary: '#8b5cf6',
          },
        });
      }
      
      if (legacy.contactInfo && Object.keys(legacy.contactInfo).length > 0) {
        await setContactInfo(legacy.contactInfo);
      }
      
      if (legacy.socialMedia && Object.keys(legacy.socialMedia).length > 0) {
        await setSocialMedia(legacy.socialMedia);
      }
      
      if (legacy.testimonials && legacy.testimonials.length > 0) {
        await setTestimonials(legacy.testimonials);
      }
      
      if (legacy.googleReviewsScript) {
        await setGoogleReviews({ script: legacy.googleReviewsScript });
      }
      
      console.log('✅ Migration complete! Removing legacy key...');
      // Don't delete the legacy key immediately - keep it as backup for now
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
    }
  }
  
  // Load from new separate-key structure
  const [branding, contactInfo, socialMedia, testimonials, googleReviews] = await Promise.all([
    getBranding(),
    getContactInfo(),
    getSocialMedia(),
    getTestimonials(),
    getGoogleReviews(),
  ]);
  
  // Combine into legacy format for backward compatibility
  return {
    clinicName: branding?.clinicName || 'SmileVisionPro',
    logo: branding?.logo || null,
    heroImage: branding?.heroImage || null,
    primaryColor: branding?.colors?.primary || '#3b82f6',
    contactInfo: contactInfo || {},
    socialMedia: socialMedia || {},
    testimonials: testimonials || [],
    googleReviewsScript: googleReviews?.script || '',
  };
}

/**
 * Set all clinic data (saves to separate keys) - Legacy support
 * This maintains backward compatibility with existing code
 */
export async function setClinicBranding(branding: ClinicBranding): Promise<boolean> {
  try {
    // Save to new separate-key structure
    const results = await Promise.all([
      setBranding({
        clinicName: branding.clinicName,
        logo: branding.logo,
        heroImage: branding.heroImage,
        colors: {
          primary: branding.primaryColor || '#3b82f6',
          secondary: '#8b5cf6',
        },
      }),
      setContactInfo(branding.contactInfo || {}),
      setSocialMedia(branding.socialMedia || {}),
      setTestimonials(branding.testimonials || []),
      branding.googleReviewsScript 
        ? setGoogleReviews({ script: branding.googleReviewsScript })
        : Promise.resolve(true),
    ]);
    
    // Return true only if all saves succeeded
    return results.every(result => result === true);
  } catch (error) {
    console.error('Error saving clinic branding:', error);
    return false;
  }
}

/**
 * Migrate old localStorage data to Platform Custom Values
 */
export async function migrateLocalStorageToplatform(): Promise<void> {
  console.log('🔄 Starting migration from localStorage to Platform Custom Values...');
  
  try {
    // Migrate password (hash it if not already hashed)
    const oldPassword = localStorage.getItem('smileai_admin_password');
    if (oldPassword) {
      console.log('  📝 Migrating password...');
      // Check if it's already a bcrypt hash
      if (isHashedPassword(oldPassword)) {
        await setPasswordHash(oldPassword);
      } else {
        // Plain text password, hash it
        const hash = await hashPassword(oldPassword);
        await setPasswordHash(hash);
      }
      console.log('  ✅ Password migrated and hashed');
    }
    
    // Migrate clinic branding (will auto-migrate via getClinicBranding)
    const oldBranding = localStorage.getItem('smileai_clinic_branding');
    if (oldBranding) {
      console.log('  📝 Migrating clinic branding to new structure...');
      try {
        const legacy: ClinicBranding = JSON.parse(oldBranding);
        await setClinicBranding(legacy);
        console.log('  ✅ Clinic branding migrated to separate keys');
      } catch (error) {
        console.error('  ❌ Failed to migrate branding:', error);
      }
    }
    
    console.log('✅ Migration complete!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

/**
 * Check if Platform Custom Values are configured
 */
export function isGHLStorageConfigured(): boolean {
  const apiKey = getApiKey();
  const locationId = getLocationId();
  return !!(apiKey && locationId);
}