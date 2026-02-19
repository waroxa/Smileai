import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Link2, Unlink, CheckCircle, AlertCircle, Loader2, 
  RefreshCw, Shield, Database, Video, FileText, Activity 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface OAuthConnection {
  locationId: string;
  locationName: string;
  connected_at: string;
  scope: string;
  expires_at: number;
  is_expired: boolean;
}

// Backend API wrapper - all calls go through this
const API = {
  baseUrl: `https://${projectId}.supabase.co/functions/v1/make-server-c5a5d193`,
  
  // Start OAuth flow - this will redirect the browser
  async startOAuth() {
    try {
      console.log('🚀 Starting OAuth flow...');
      console.log('📍 Calling:', `${this.baseUrl}/oauth/start`);
      
      const response = await fetch(`${this.baseUrl}/oauth/start`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        redirect: 'manual', // Don't follow redirects automatically
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Get the redirect URL from response
      const redirectUrl = response.headers.get('location') || response.url;
      console.log('🔗 Redirect URL:', redirectUrl);
      
      // If we got a redirect location, use it
      if (redirectUrl && redirectUrl.includes('gohighlevel.com')) {
        console.log('✅ Redirecting to GHL...');
        window.location.href = redirectUrl;
        return;
      }
      
      // Otherwise, try to get it from JSON response
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Response data:', data);
        if (data.authUrl) {
          console.log('✅ Using authUrl from JSON response');
          window.location.href = data.authUrl;
          return;
        }
      }
      
      // If we got an error response, try to parse it
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend error:', errorText);
        throw new Error(`Backend error (${response.status}): ${errorText}`);
      }
      
      throw new Error('Failed to start OAuth flow - no redirect URL received');
    } catch (error) {
      console.error('❌ OAuth start error:', error);
      throw error;
    }
  },
  
  // Get connection status
  async getStatus() {
    const response = await fetch(`${this.baseUrl}/oauth/status`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to load connections' }));
      throw new Error(errorData.error || 'Failed to load connections');
    }
    
    return await response.json();
  },
  
  // Disconnect location
  async disconnect(locationId: string) {
    const response = await fetch(`${this.baseUrl}/oauth/disconnect`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ locationId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to disconnect' }));
      throw new Error(errorData.error || 'Failed to disconnect');
    }
    
    return await response.json();
  },
  
  // Refresh token
  async refresh(locationId: string) {
    const response = await fetch(`${this.baseUrl}/oauth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ locationId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to refresh token' }));
      throw new Error(errorData.error || 'Failed to refresh token');
    }
    
    return await response.json();
  },
};

export function GHLOAuthConnect() {
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  // Check URL params for OAuth callback on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');
    const errorParam = params.get('error');
    const locationId = params.get('locationId');
    const locationName = params.get('locationName');

    if (successParam === 'true' && locationId) {
      setSuccess(`✅ GoHighLevel Connected! Location: ${locationName || locationId}`);
      setSelectedLocation(locationId);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Load connections to refresh UI
      loadConnections();
    } else if (errorParam) {
      setError(`❌ Connection Failed: ${errorParam}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Load connections using API wrapper
  const loadConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await API.getStatus();
      setConnections(data.connections || []);
      
      // Auto-select first connection if none selected
      if (data.connections?.length > 0 && !selectedLocation) {
        setSelectedLocation(data.connections[0].locationId);
      }
    } catch (err: any) {
      console.error('Error loading connections:', err);
      setError(err.message || 'Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  };

  // Connect to GoHighLevel - calls backend which redirects
  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      
      // This will redirect the browser to GHL
      await API.startOAuth();
    } catch (err: any) {
      console.error('Error connecting:', err);
      setError(err.message || 'Failed to start OAuth flow');
      setIsConnecting(false);
    }
  };

  // Disconnect location
  const handleDisconnect = async (locationId: string) => {
    if (!confirm('Are you sure you want to disconnect this location? This will delete all OAuth tokens.')) {
      return;
    }

    try {
      await API.disconnect(locationId);
      setSuccess('Location disconnected successfully');
      await loadConnections();
      setSelectedLocation(null);
    } catch (err: any) {
      console.error('Error disconnecting:', err);
      setError(err.message);
    }
  };

  // Refresh token
  const handleRefreshToken = async (locationId: string) => {
    try {
      await API.refresh(locationId);
      setSuccess('Token refreshed successfully');
      await loadConnections();
    } catch (err: any) {
      console.error('Error refreshing token:', err);
      setError(err.message);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'oauth_connected':
        return <Link2 className="w-4 h-4 text-green-600" />;
      case 'oauth_disconnected':
        return <Unlink className="w-4 h-4 text-red-600" />;
      case 'form_created':
      case 'form_updated':
        return <FileText className="w-4 h-4 text-blue-600" />;
      case 'video_saved':
        return <Video className="w-4 h-4 text-purple-600" />;
      case 'custom_field_created':
        return <Database className="w-4 h-4 text-teal-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            GoHighLevel OAuth Connection
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Securely connect your GoHighLevel sub-account to enable forms, custom fields, and video metadata management.
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 sm:mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-red-800 font-medium text-sm sm:text-base">Error</p>
                <p className="text-red-700 text-xs sm:text-sm break-words">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0"
              >
                ✕
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 sm:mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-green-800 font-medium text-sm sm:text-base">Success</p>
                <p className="text-green-700 text-xs sm:text-sm break-words">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="ml-2 text-green-600 hover:text-green-800 flex-shrink-0"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Connections Panel */}
          <div className="lg:col-span-2">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Connected Locations
                </h2>
                <div className="flex gap-2">
                  <Button
                    onClick={loadConnections}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect GoHighLevel
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : connections.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base text-gray-600 mb-2">No locations connected yet</p>
                  <p className="text-xs sm:text-sm text-gray-500 mb-6 px-4">
                    Click "Connect GoHighLevel" to authorize access to your sub-account
                  </p>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isConnecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Link2 className="w-4 h-4 mr-2" />
                        Connect Now
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 sm:space-y-4">
                  {connections.map((conn) => (
                    <div
                      key={conn.locationId}
                      className={`border rounded-lg p-3 sm:p-4 transition-all ${
                        selectedLocation === conn.locationId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                            <h3 className="font-semibold text-sm sm:text-base text-gray-900 break-words">
                              {conn.locationName}
                            </h3>
                            {conn.is_expired && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                Expired
                              </span>
                            )}
                          </div>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1 break-all">
                            Location ID: <code className="text-xs bg-gray-100 px-1 rounded">{conn.locationId}</code>
                          </p>
                          <p className="text-xs sm:text-sm text-gray-600 mb-1">
                            Connected: {new Date(conn.connected_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-500">
                            Expires: {formatDate(conn.expires_at)}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefreshToken(conn.locationId)}
                            className="text-xs"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Refresh
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(conn.locationId)}
                            className="text-xs text-red-600 hover:bg-red-50"
                          >
                            <Unlink className="w-3 h-3 mr-1" />
                            Disconnect
                          </Button>
                        </div>
                      </div>

                      {/* Scopes */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Scopes:</p>
                        <div className="flex flex-wrap gap-1">
                          {conn.scope.split(' ').map((scope) => (
                            <span
                              key={scope}
                              className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded"
                            >
                              {scope}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Info Panel */}
          <div>
            <Card className="p-4 sm:p-6 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-blue-900 mb-2">
                    Secure OAuth Implementation
                  </h3>
                  <ul className="text-xs sm:text-sm text-blue-800 space-y-1.5">
                    <li>✓ Tokens stored server-side only</li>
                    <li>✓ CSRF protection with state parameter</li>
                    <li>✓ Automatic token refresh</li>
                    <li>✓ Minimal scopes (forms, custom fields)</li>
                    <li>✓ Encrypted token storage</li>
                    <li>✓ Audit log for all actions</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* How It Works */}
            <Card className="mt-4 p-4 sm:p-6">
              <h3 className="font-semibold text-sm sm:text-base text-gray-900 mb-3">
                How It Works
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">
                    1
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Click "Connect GoHighLevel" to start
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">
                    2
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Authorize and select your location in GHL
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">
                    3
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    You'll be redirected back here with confirmation
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-green-600">
                    ✓
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Your location will appear in the list above
                  </p>
                </div>
              </div>
            </Card>

            {/* Support Note */}
            <Card className="mt-4 p-4 bg-yellow-50 border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs sm:text-sm text-yellow-800">
                    <strong>Need help?</strong> Make sure you have admin access to your GoHighLevel sub-account before connecting.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}