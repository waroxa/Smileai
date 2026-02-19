import React, { useState } from 'react';
import { Save, Key, MapPin, Check, X, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

interface ApiSettings {
  ghlApiKey: string;
  ghlLocationId: string;
}

export function ApiSettingsPanel() {
  const [settings, setSettings] = useState<ApiSettings>({
    ghlApiKey: localStorage.getItem('ghl_api_key') || '',
    ghlLocationId: localStorage.getItem('ghl_location_id') || '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Trim values before saving
      const trimmedApiKey = settings.ghlApiKey.trim();
      const trimmedLocationId = settings.ghlLocationId.trim();

      // Save to localStorage
      localStorage.setItem('ghl_api_key', trimmedApiKey);
      localStorage.setItem('ghl_location_id', trimmedLocationId);

      console.log('✅ Settings saved to localStorage:');
      console.log('API Key length:', trimmedApiKey.length);
      console.log('Location ID:', trimmedLocationId);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('❌ Error saving settings:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Test function to verify credentials are saved
  const handleTestCredentials = () => {
    const apiKey = localStorage.getItem('ghl_api_key');
    const locationId = localStorage.getItem('ghl_location_id');
    
    console.log('🔍 Testing localStorage credentials:');
    console.log('API Key exists:', !!apiKey, '| Length:', apiKey?.length || 0);
    console.log('Location ID exists:', !!locationId, '| Value:', locationId || 'EMPTY');
    console.log('All localStorage keys:', Object.keys(localStorage));
    
    if (apiKey && locationId) {
      alert(`✅ Credentials Found!\n\nAPI Key: ${apiKey.substring(0, 10)}... (${apiKey.length} chars)\nLocation ID: ${locationId}`);
    } else {
      alert('❌ Credentials NOT found in localStorage.\n\nPlease save your settings first.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">GoHighLevel API Settings</h3>
        <p className="text-sm text-gray-600">
          Configure your GoHighLevel marketplace app credentials to enable automatic lead capture and contact syncing.
        </p>
      </div>

      <div className="space-y-5">
        {/* API Key */}
        <div>
          <Label htmlFor="ghlApiKey" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
            <Key className="w-4 h-4 text-gray-600" />
            GoHighLevel API Key *
          </Label>
          <Input
            id="ghlApiKey"
            type="password"
            value={settings.ghlApiKey}
            onChange={(e) => setSettings({ ...settings, ghlApiKey: e.target.value })}
            placeholder="Enter your GHL API key"
            className="h-11 text-base font-mono"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Get your API key from: GoHighLevel → Settings → API → Create API Key
          </p>
        </div>

        {/* Location ID */}
        <div>
          <Label htmlFor="ghlLocationId" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
            <MapPin className="w-4 h-4 text-gray-600" />
            GoHighLevel Location ID *
          </Label>
          <Input
            id="ghlLocationId"
            type="text"
            value={settings.ghlLocationId}
            onChange={(e) => setSettings({ ...settings, ghlLocationId: e.target.value })}
            placeholder="Enter your GHL Location ID"
            className="h-11 text-base font-mono"
          />
          <p className="text-xs text-gray-500 mt-1.5">
            Find your Location ID in: GoHighLevel → Settings → Business Profile → Location ID
          </p>
        </div>

        {/* Save Button */}
        <div className="space-y-2">
          <Button
            onClick={handleSave}
            disabled={isSaving || !settings.ghlApiKey || !settings.ghlLocationId}
            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
          >
            {isSaving ? (
              <>
                <Save className="w-4 h-4 mr-2 animate-pulse" />
                Saving...
              </>
            ) : saveStatus === 'success' ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Saved Successfully!
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>

          {/* Test Credentials Button */}
          <Button
            onClick={handleTestCredentials}
            variant="outline"
            className="w-full h-11 border-gray-300"
          >
            <AlertCircle className="w-4 h-4 mr-2" />
            Test Saved Credentials
          </Button>
        </div>

        {/* Status Messages */}
        {saveStatus === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
            <p className="text-sm text-green-700">Settings saved successfully! Lead capture is now enabled.</p>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <X className="w-4 h-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">Failed to save settings. Please try again.</p>
          </div>
        )}

        {/* Info Box */}
        <div className="flex items-start gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">How Lead Capture Works:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>User submits their contact info on the landing page</li>
              <li>Contact is automatically created in GoHighLevel</li>
              <li>After smile transformation, before/after images are uploaded to the contact</li>
              <li><strong>Video URLs are saved to custom field <code>smile_video_url</code> and contact notes</strong></li>
              <li>Custom fields include: Service Interest, Notes, and transformation status</li>
            </ul>
          </div>
        </div>

        {/* Video Integration Info */}
        <div className="flex items-start gap-2 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-purple-800">
            <p className="font-semibold mb-1">🎥 Video Integration:</p>
            <p className="mb-2">
              When customers generate smile videos, the video URL is automatically saved to:
            </p>
            <ul className="space-y-1 ml-4 list-disc">
              <li><strong>Custom Field:</strong> <code className="bg-purple-100 px-1.5 py-0.5 rounded">smile_video_url</code></li>
              <li><strong>Contact Notes:</strong> Clickable video link for easy access</li>
            </ul>
            <p className="mt-2 text-xs">
              💡 Make sure to create the <code>smile_video_url</code> custom field in GHL (type: URL or Text)
            </p>
          </div>
        </div>

        {/* Fields that will be sent */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Data Sent to GoHighLevel:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Full Name (firstName/lastName)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Email Address</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Phone Number</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Service Interest</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Notes/Concerns</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Before/After Images</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Source Tag (SmileVision AI)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Check className="w-3 h-3 text-green-600" />
              <span>Smile Video (if generated)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}