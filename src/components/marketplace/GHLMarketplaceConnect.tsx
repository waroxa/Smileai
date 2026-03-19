import { useState, useEffect } from 'react';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Link2, Unlink, CheckCircle, AlertCircle, Loader2, 
  RefreshCw, Shield, Settings 
} from 'lucide-react';
import { Button } from '../ui/button';
import { MarketplaceCard } from './MarketplaceCard';
import { MarketplaceContainer } from './MarketplaceContainer';
import { EmbeddedAppLayout } from './EmbeddedAppLayout';

interface OAuthConnection {
  locationId: string;
  locationName: string;
  connected_at: string;
  scope: string;
  expires_at: number;
  is_expired: boolean;
}

// Backend API wrapper
const API = {
  baseUrl: `https://${projectId}.supabase.co/functions/v1/make-server-c5a5d193`,
  
  async startOAuth() {
    try {
      console.log('🚀 Starting OAuth flow...');
      console.log('📍 Calling:', `${this.baseUrl}/oauth/start`);
      
      const response = await fetch(`${this.baseUrl}/oauth/start`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        redirect: 'manual',
      });
      
      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', Object.fromEntries(response.headers.entries()));
      
      const redirectUrl = response.headers.get('location') || response.url;
      console.log('🔗 Redirect URL:', redirectUrl);
      
      if (redirectUrl && redirectUrl.includes('gohighlevel.com')) {
        console.log('✅ Redirecting to platform...');
        window.location.href = redirectUrl;
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('📦 Response data:', data);
        if (data.authUrl) {
          console.log('✅ Using authUrl from JSON response');
          window.location.href = data.authUrl;
          return;
        }
      }
      
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

/**
 * GHLMarketplaceConnect - OAuth connection component optimized for marketplace portal
 * 
 * Features:
 * - Embedded-friendly layout
 * - Mobile-first responsive design
 * - Consistent 8px grid spacing
 * - No horizontal scroll
 * - Proper modal/dropdown containment
 */
export function GHLMarketplaceConnect() {
  const [connections, setConnections] = useState<OAuthConnection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Check URL params for OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const successParam = params.get('success');
    const errorParam = params.get('error');
    const locationId = params.get('locationId');
    const locationName = params.get('locationName');

    if (successParam === 'true' && locationId) {
      setSuccess(`Connected to ${locationName || locationId}!`);
      window.history.replaceState({}, '', window.location.pathname);
      loadConnections();
    } else if (errorParam) {
      setError(`Connection Failed: ${errorParam}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const loadConnections = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await API.getStatus();
      setConnections(data.connections || []);
    } catch (err: any) {
      console.error('Error loading connections:', err);
      setError(err.message || 'Failed to load connections');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnecting(true);
      setError(null);
      await API.startOAuth();
    } catch (err: any) {
      console.error('Error connecting:', err);
      setError(err.message || 'Failed to start OAuth flow');
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async (locationId: string) => {
    if (!confirm('Disconnect this location? All OAuth tokens will be deleted.')) {
      return;
    }

    try {
      await API.disconnect(locationId);
      setSuccess('Location disconnected successfully');
      await loadConnections();
    } catch (err: any) {
      console.error('Error disconnecting:', err);
      setError(err.message);
    }
  };

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

  return (
    <EmbeddedAppLayout maxWidth="container">
      <MarketplaceContainer spacing="normal">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Platform Connection
          </h1>
          <p className="text-sm text-gray-600">
            Connect your account to sync data and automate workflows
          </p>
        </div>

        {/* Alerts */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-red-800">Error</p>
                <p className="text-sm text-red-700 break-words">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3"
            >
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-green-800">Success</p>
                <p className="text-sm text-green-700 break-words">{success}</p>
              </div>
              <button
                onClick={() => setSuccess(null)}
                className="text-green-600 hover:text-green-800 text-lg leading-none"
              >
                ×
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Connections Card */}
          <div className="lg:col-span-2">
            <MarketplaceCard
              title="Connected Locations"
              action={
                <div className="flex gap-2">
                  <Button
                    onClick={loadConnections}
                    disabled={isLoading}
                    variant="outline"
                    size="sm"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={handleConnect}
                    disabled={isConnecting}
                    size="sm"
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
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              }
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : connections.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm text-gray-600 mb-4">No locations connected</p>
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
                <div className="space-y-3">
                  {connections.map((conn) => (
                    <div
                      key={conn.locationId}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {conn.locationName}
                            </h4>
                            {conn.is_expired && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                Expired
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600">
                            ID: <code className="bg-gray-100 px-1 rounded">{conn.locationId}</code>
                          </p>
                        </div>

                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefreshToken(conn.locationId)}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(conn.locationId)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Unlink className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </MarketplaceCard>
          </div>

          {/* Info Card */}
          <div className="space-y-4">
            <MarketplaceCard spacing="compact">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    Secure Integration
                  </h4>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>✓ Server-side token storage</li>
                    <li>✓ CSRF protection</li>
                    <li>✓ Auto token refresh</li>
                    <li>✓ Encrypted storage</li>
                  </ul>
                </div>
              </div>
            </MarketplaceCard>

            <MarketplaceCard spacing="compact">
              <div className="flex items-start gap-3">
                <Settings className="w-5 h-5 text-gray-600 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-sm text-gray-900 mb-2">
                    How It Works
                  </h4>
                  <ol className="text-xs text-gray-600 space-y-2">
                    <li className="flex gap-2">
                      <span className="font-bold">1.</span>
                      Click "Connect" to authorize
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">2.</span>
                      Select your platform location
                    </li>
                    <li className="flex gap-2">
                      <span className="font-bold">3.</span>
                      You'll be redirected back
                    </li>
                  </ol>
                </div>
              </div>
            </MarketplaceCard>
          </div>
        </div>
      </MarketplaceContainer>
    </EmbeddedAppLayout>
  );
}
