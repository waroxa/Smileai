import { Hono } from "npm:hono";
import { createClient } from "jsr:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const getSupabase = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );
};

// GHL OAuth endpoints
const GHL_AUTH_URL = 'https://marketplace.gohighlevel.com/oauth/chooselocation';
const GHL_TOKEN_URL = 'https://services.leadconnectorhq.com/oauth/token';
const GHL_API_BASE = 'https://services.leadconnectorhq.com';

// Get OAuth config from environment
const getOAuthConfig = () => {
  const clientId = Deno.env.get('GHL_CLIENT_ID');
  const clientSecret = Deno.env.get('GHL_CLIENT_SECRET');
  const redirectUri = Deno.env.get('GHL_REDIRECT_URI') || 'https://www.smilevisionpro.ai/oauth/callback';
  
  if (!clientId || !clientSecret) {
    throw new Error('GHL OAuth credentials not configured');
  }
  
  return { clientId, clientSecret, redirectUri };
};

// Generate random state for CSRF protection
const generateState = () => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// Simple encryption helper (replace with proper encryption in production)
const encryptToken = async (token: string): Promise<string> => {
  return btoa(token);
};

const decryptToken = async (encrypted: string): Promise<string> => {
  return atob(encrypted);
};

// Log to audit table
const logAudit = async (supabase: any, locationId: string, action: string, details: any = {}, userId: string | null = null) => {
  try {
    await supabase.from('ghl_audit_log').insert({
      location_id: locationId,
      action,
      details,
      user_id: userId,
    });
  } catch (error) {
    console.error('Failed to log audit:', error);
  }
};

// GET /oauth/start - Start OAuth flow (public endpoint)
app.get("/make-server-c5a5d193/oauth/start", async (c) => {
  try {
    const { clientId, redirectUri } = getOAuthConfig();
    const supabase = getSupabase();
    
    // Generate state for CSRF protection
    const state = generateState();
    
    // Store state with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + (5 * 60 * 1000));
    
    const { error } = await supabase.from('ghl_oauth_states').insert({
      state,
      expires_at: expiresAt.toISOString(),
    });
    
    if (error) {
      console.error('Failed to store state:', error);
      throw new Error('Failed to initialize OAuth flow');
    }
    
    // Clean up expired states
    await supabase.from('ghl_oauth_states')
      .delete()
      .lt('expires_at', new Date().toISOString());
    
    // Minimal scopes - only what we need
    const scopes = [
      'locations.readonly',
      'locations/customFields.write',
      'locations/customFields.readonly',
      'locations/customValues.write',
      'locations/customValues.readonly',
      'contacts.write',
      'contacts.readonly',
      'forms.write',
      'forms.readonly',
    ].join(' ');
    
    // Build authorization URL
    const authUrl = new URL(GHL_AUTH_URL);
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', scopes);
    authUrl.searchParams.set('state', state);
    
    console.log('🔐 OAuth flow initiated with state:', state);
    console.log('🔗 Redirecting to:', authUrl.toString());
    
    // Return 302 redirect
    return c.redirect(authUrl.toString(), 302);
    
  } catch (error: any) {
    console.error('❌ Error initiating OAuth:', error);
    // Redirect to admin page with error
    return c.redirect(`https://www.smilevisionpro.ai/admin/ghl-connect?error=${encodeURIComponent(error.message)}`, 302);
  }
});

// GET /oauth/callback - Handle OAuth callback
app.get("/make-server-c5a5d193/oauth/callback", async (c) => {
  try {
    const code = c.req.query('code');
    const state = c.req.query('state');
    
    console.log('📥 OAuth callback received');
    console.log('   Code:', code ? 'present' : 'missing');
    console.log('   State:', state);
    
    if (!code || !state) {
      return c.json({ error: 'Missing code or state parameter' }, 400);
    }
    
    const supabase = getSupabase();
    
    // Validate state (CSRF protection)
    const { data: storedState, error: stateError } = await supabase
      .from('ghl_oauth_states')
      .select('*')
      .eq('state', state)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (stateError || !storedState) {
      console.error('❌ Invalid or expired state');
      return c.json({ error: 'Invalid or expired state parameter' }, 400);
    }
    
    // Delete used state
    await supabase.from('ghl_oauth_states').delete().eq('state', state);
    
    const { clientId, clientSecret, redirectUri } = getOAuthConfig();
    
    // Exchange code for tokens
    console.log('🔄 Exchanging code for tokens...');
    
    const tokenResponse = await fetch(GHL_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token exchange failed:', errorText);
      return c.json({
        error: 'Token exchange failed',
        details: errorText,
      }, tokenResponse.status);
    }
    
    const tokens = await tokenResponse.json();
    console.log('✅ Tokens received');
    console.log('   Access token:', tokens.access_token ? 'present' : 'missing');
    console.log('   Refresh token:', tokens.refresh_token ? 'present' : 'missing');
    console.log('   Expires in:', tokens.expires_in, 'seconds');
    
    // Get location info
    const locationId = tokens.locationId || tokens.location_id;
    const companyId = tokens.companyId || tokens.company_id;
    const userId = tokens.userId || tokens.user_id;
    
    if (!locationId) {
      console.error('❌ No locationId in token response');
      return c.json({ error: 'No locationId in response' }, 400);
    }
    
    // Fetch location details
    let locationName = 'Unknown Location';
    try {
      const locationResponse = await fetch(`${GHL_API_BASE}/locations/${locationId}`, {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
          'Version': '2021-07-28',
        },
      });
      
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        locationName = locationData.location?.name || locationData.name || 'Unknown Location';
      }
    } catch (err) {
      console.warn('⚠️ Could not fetch location name:', err);
    }
    
    // Encrypt tokens
    const encryptedAccessToken = await encryptToken(tokens.access_token);
    const encryptedRefreshToken = await encryptToken(tokens.refresh_token);
    
    // Calculate expiration time
    const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));
    
    // Store or update connection in database
    const { error: upsertError } = await supabase
      .from('ghl_connections')
      .upsert({
        location_id: locationId,
        location_name: locationName,
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: expiresAt.toISOString(),
        scope: tokens.scope,
        company_id: companyId,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'location_id',
      });
    
    if (upsertError) {
      console.error('❌ Failed to store connection:', upsertError);
      throw new Error('Failed to save OAuth connection');
    }
    
    // Log connection in audit log
    await logAudit(supabase, locationId, 'oauth_connected', {
      locationName,
      scope: tokens.scope,
    });
    
    console.log('✅ OAuth connection saved for location:', locationId);
    console.log('   Location name:', locationName);
    
    // Redirect to admin page with success
    const successUrl = new URL('https://www.smilevisionpro.ai/admin/ghl-connect');
    successUrl.searchParams.set('success', 'true');
    successUrl.searchParams.set('locationId', locationId);
    successUrl.searchParams.set('locationName', locationName);
    
    return c.redirect(successUrl.toString());
    
  } catch (error: any) {
    console.error('❌ Error in OAuth callback:', error);
    
    // Redirect to admin page with error
    const errorUrl = new URL('https://www.smilevisionpro.ai/admin/ghl-connect');
    errorUrl.searchParams.set('error', error.message);
    
    return c.redirect(errorUrl.toString());
  }
});

// GET /oauth/status - Check connection status
app.get("/make-server-c5a5d193/oauth/status", async (c) => {
  try {
    const supabase = getSupabase();
    
    // Get all OAuth connections
    const { data: connections, error } = await supabase
      .from('ghl_connections')
      .select('location_id, location_name, created_at, scope, expires_at')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    const activeConnections = (connections || []).map((conn: any) => ({
      locationId: conn.location_id,
      locationName: conn.location_name,
      connected_at: conn.created_at,
      scope: conn.scope,
      expires_at: new Date(conn.expires_at).getTime(),
      is_expired: new Date(conn.expires_at) < new Date(),
    }));
    
    return c.json({
      success: true,
      connections: activeConnections,
      count: activeConnections.length,
    });
    
  } catch (error: any) {
    console.error('❌ Error checking OAuth status:', error);
    return c.json({
      error: 'Failed to check status',
      message: error.message,
    }, 500);
  }
});

// POST /oauth/disconnect - Disconnect a location
app.post("/make-server-c5a5d193/oauth/disconnect", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId } = body;
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('🔌 Disconnecting location:', locationId);
    
    const supabase = getSupabase();
    
    // Get connection data for audit log
    const { data: connection } = await supabase
      .from('ghl_connections')
      .select('location_name')
      .eq('location_id', locationId)
      .single();
    
    // Delete OAuth connection
    const { error } = await supabase
      .from('ghl_connections')
      .delete()
      .eq('location_id', locationId);
    
    if (error) throw error;
    
    // Log disconnection in audit log
    await logAudit(supabase, locationId, 'oauth_disconnected', {
      locationName: connection?.location_name || 'Unknown',
    });
    
    console.log('✅ Location disconnected:', locationId);
    
    return c.json({
      success: true,
      message: 'Location disconnected successfully',
    });
    
  } catch (error: any) {
    console.error('❌ Error disconnecting location:', error);
    return c.json({
      error: 'Failed to disconnect',
      message: error.message,
    }, 500);
  }
});

// POST /oauth/refresh - Refresh access token
app.post("/make-server-c5a5d193/oauth/refresh", async (c) => {
  try {
    const body = await c.req.json();
    const { locationId } = body;
    
    if (!locationId) {
      return c.json({ error: 'Missing locationId' }, 400);
    }
    
    console.log('🔄 Refreshing token for location:', locationId);
    
    const supabase = getSupabase();
    
    // Get stored connection
    const { data: connection, error: fetchError } = await supabase
      .from('ghl_connections')
      .select('*')
      .eq('location_id', locationId)
      .single();
    
    if (fetchError || !connection) {
      return c.json({ error: 'Location not connected' }, 404);
    }
    
    // Decrypt refresh token
    const refreshToken = await decryptToken(connection.refresh_token);
    
    const { clientId, clientSecret } = getOAuthConfig();
    
    // Request new tokens
    const tokenResponse = await fetch(GHL_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Token refresh failed:', errorText);
      return c.json({
        error: 'Token refresh failed',
        details: errorText,
      }, tokenResponse.status);
    }
    
    const tokens = await tokenResponse.json();
    
    // Encrypt new tokens
    const encryptedAccessToken = await encryptToken(tokens.access_token);
    const encryptedRefreshToken = await encryptToken(tokens.refresh_token || refreshToken);
    
    // Calculate new expiration
    const expiresAt = new Date(Date.now() + (tokens.expires_in * 1000));
    
    // Update stored connection
    const { error: updateError } = await supabase
      .from('ghl_connections')
      .update({
        access_token: encryptedAccessToken,
        refresh_token: encryptedRefreshToken,
        expires_at: expiresAt.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('location_id', locationId);
    
    if (updateError) throw updateError;
    
    console.log('✅ Token refreshed for location:', locationId);
    
    return c.json({
      success: true,
      expires_at: expiresAt.getTime(),
    });
    
  } catch (error: any) {
    console.error('❌ Error refreshing token:', error);
    return c.json({
      error: 'Failed to refresh token',
      message: error.message,
    }, 500);
  }
});

// Helper: Get fresh access token (with auto-refresh)
export const getFreshAccessToken = async (locationId: string): Promise<string | null> => {
  try {
    const supabase = getSupabase();
    
    const { data: connection, error } = await supabase
      .from('ghl_connections')
      .select('*')
      .eq('location_id', locationId)
      .single();
    
    if (error || !connection) {
      console.error('❌ No connection found for location:', locationId);
      return null;
    }
    
    // Check if token is expired or will expire in next 5 minutes
    const expiresAt = new Date(connection.expires_at);
    const expiresIn = expiresAt.getTime() - Date.now();
    const needsRefresh = expiresIn < (5 * 60 * 1000); // 5 minutes
    
    if (needsRefresh) {
      console.log('⏰ Token expiring soon, refreshing...');
      
      // Refresh token
      const refreshToken = await decryptToken(connection.refresh_token);
      const { clientId, clientSecret } = getOAuthConfig();
      
      const tokenResponse = await fetch(GHL_TOKEN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });
      
      if (tokenResponse.ok) {
        const tokens = await tokenResponse.json();
        
        const encryptedAccessToken = await encryptToken(tokens.access_token);
        const encryptedRefreshToken = await encryptToken(tokens.refresh_token || refreshToken);
        const newExpiresAt = new Date(Date.now() + (tokens.expires_in * 1000));
        
        await supabase
          .from('ghl_connections')
          .update({
            access_token: encryptedAccessToken,
            refresh_token: encryptedRefreshToken,
            expires_at: newExpiresAt.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('location_id', locationId);
        
        return tokens.access_token;
      } else {
        console.error('❌ Token refresh failed');
        return null;
      }
    }
    
    // Token is still valid
    return await decryptToken(connection.access_token);
    
  } catch (error) {
    console.error('❌ Error getting fresh access token:', error);
    return null;
  }
};

export default app;