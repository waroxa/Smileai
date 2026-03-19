/**
 * platform SSO Integration
 * Automatically detects when app is installed in platform and sets up credentials
 */

export interface GHLSSOData {
  locationId: string;
  apiKey: string;
  userId?: string;
  companyId?: string;
}

/**
 * Check if the app is running inside platform iframe
 */
export function isInsideplatform(): boolean {
  try {
    // Check if we're in an iframe
    if (window.self !== window.top) {
      // Check for platform-specific URL parameters or parent window indicators
      const urlParams = new URLSearchParams(window.location.search);
      return urlParams.has('location_id') || urlParams.has('ghl_location');
    }
    
    // Also check URL params even if not in iframe (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.has('location_id') || urlParams.has('ghl_location');
  } catch (e) {
    return false;
  }
}

/**
 * Extract platform SSO data from URL parameters
 */
export function getGHLSSOData(): GHLSSOData | null {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Get location ID from various possible parameter names
    const locationId = 
      urlParams.get('location_id') || 
      urlParams.get('ghl_location') ||
      urlParams.get('locationId');
    
    // Get API key if provided (in production, this would come from OAuth)
    const apiKey = 
      urlParams.get('api_key') || 
      urlParams.get('ghl_api_key') ||
      urlParams.get('access_token');
    
    // Get optional user/company IDs
    const userId = urlParams.get('user_id') || urlParams.get('userId');
    const companyId = urlParams.get('company_id') || urlParams.get('companyId');
    
    if (locationId) {
      return {
        locationId,
        apiKey: apiKey || '', // Will be empty until OAuth is set up
        userId: userId || undefined,
        companyId: companyId || undefined,
      };
    }
    
    return null;
  } catch (e) {
    console.error('Error extracting platform SSO data:', e);
    return null;
  }
}

/**
 * Save platform credentials to localStorage
 */
export function saveGHLCredentials(data: GHLSSOData): void {
  try {
    if (data.locationId) {
      localStorage.setItem('ghl_location_id', data.locationId);
      console.log('✅ platform Location ID saved:', data.locationId);
    }
    
    if (data.apiKey) {
      localStorage.setItem('ghl_api_key', data.apiKey);
      console.log('✅ platform API Key saved');
    }
    
    if (data.userId) {
      localStorage.setItem('ghl_user_id', data.userId);
    }
    
    if (data.companyId) {
      localStorage.setItem('ghl_company_id', data.companyId);
    }
    
    // Mark that SSO setup is complete
    localStorage.setItem('ghl_sso_configured', 'true');
    
  } catch (e) {
    console.error('Error saving platform credentials:', e);
  }
}

/**
 * Initialize platform SSO if detected
 * Call this on app startup
 */
export function initializeGHLSSO(): boolean {
  console.log('🔍 Checking for platform SSO...');
  
  const ssoData = getGHLSSOData();
  
  if (ssoData && ssoData.locationId) {
    console.log('✅ platform SSO detected! Location ID:', ssoData.locationId);
    saveGHLCredentials(ssoData);
    return true;
  }
  
  // Check if already configured
  const alreadyConfigured = localStorage.getItem('ghl_sso_configured') === 'true';
  if (alreadyConfigured) {
    const locationId = localStorage.getItem('ghl_location_id');
    console.log('ℹ️ platform already configured with Location ID:', locationId);
  } else {
    console.log('ℹ️ No platform SSO detected - running in standalone mode');
  }
  
  return alreadyConfigured;
}

/**
 * Check if platform is properly configured
 */
export function isGHLConfigured(): boolean {
  const locationId = localStorage.getItem('ghl_location_id');
  const apiKey = localStorage.getItem('ghl_api_key');
  return !!(locationId && apiKey);
}

/**
 * Get current platform configuration status
 */
export function getGHLConfigStatus(): {
  configured: boolean;
  hasLocationId: boolean;
  hasApiKey: boolean;
  locationId?: string;
} {
  const locationId = localStorage.getItem('ghl_location_id');
  const apiKey = localStorage.getItem('ghl_api_key');
  
  return {
    configured: !!(locationId && apiKey),
    hasLocationId: !!locationId,
    hasApiKey: !!apiKey,
    locationId: locationId || undefined,
  };
}
