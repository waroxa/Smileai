import React, { useState, useEffect } from 'react';
import { Save, Upload, Palette, Bell, Lock, CreditCard, Zap, Shield, MapPin, MessageSquare } from 'lucide-react';
import { ClinicBranding } from '../../App';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';
import { BrandCustomizationPanel } from './BrandCustomizationPanel';
import { ApiSettingsPanel } from './ApiSettingsPanel';
import { SecuritySettingsPanel } from './SecuritySettingsPanel';
import { ContactSettingsPanel } from './ContactSettingsPanel';
import { TestimonialsSettingsPanel } from './TestimonialsSettingsPanel';
import { setClinicBranding } from '../../utils/ghl-storage';

interface SettingsViewProps {
  clinicBranding: ClinicBranding;
  onBrandingChange: (branding: ClinicBranding) => void;
}

export function SettingsView({ clinicBranding, onBrandingChange }: SettingsViewProps) {
  const [localBranding, setLocalBranding] = useState(clinicBranding);
  const [activeTab, setActiveTab] = useState<'branding' | 'contact' | 'testimonials' | 'notifications' | 'integration' | 'security' | 'billing'>('branding');
  const [isSaving, setIsSaving] = useState(false);

  // Update local state when clinicBranding prop changes
  useEffect(() => {
    setLocalBranding(clinicBranding);
  }, [clinicBranding]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save to Platform Custom Values
      const success = await setClinicBranding(localBranding);
      
      if (success) {
        // Update parent component state
        onBrandingChange(localBranding);
        
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-6 right-6 bg-green-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50 animate-in slide-in-from-top';
        successDiv.innerHTML = `
          <div class="flex items-center gap-3">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <p class="font-semibold">Settings Saved!</p>
              <p class="text-sm text-green-100">Your changes have been saved to the database and will appear on the homepage.</p>
            </div>
          </div>
        `;
        document.body.appendChild(successDiv);
        setTimeout(() => {
          successDiv.remove();
        }, 4000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-6 right-6 bg-red-600 text-white px-6 py-4 rounded-lg shadow-2xl z-50';
      errorDiv.innerHTML = `
        <div class="flex items-center gap-3">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          <div>
            <p class="font-semibold">Save Failed</p>
            <p class="text-sm text-red-100">Could not save settings. Please try again.</p>
          </div>
        </div>
      `;
      document.body.appendChild(errorDiv);
      setTimeout(() => {
        errorDiv.remove();
      }, 4000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Customize your SmileVisionPro experience</p>
        </div>
        <Button 
          onClick={handleSave}
          className="text-white shadow-sm w-full sm:w-auto"
          style={{ backgroundColor: clinicBranding.primaryColor }}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="border-b border-gray-200 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex gap-1 sm:gap-2 md:gap-6 px-3 sm:px-6 min-w-max">
              {[
                { id: 'branding', label: 'Branding', icon: Palette },
                { id: 'contact', label: 'Contact', icon: MapPin },
                { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
                { id: 'notifications', label: 'Notifications', icon: Bell },
                { id: 'integration', label: 'Integration', icon: Zap },
                { id: 'security', label: 'Security', icon: Shield },
                { id: 'billing', label: 'Billing', icon: CreditCard },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 border-b-2 transition-colors whitespace-nowrap ${
                      isActive
                        ? 'font-medium'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                    style={isActive ? { borderColor: clinicBranding.primaryColor, color: clinicBranding.primaryColor } : {}}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm sm:text-base">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 md:p-6">
          {/* Branding Tab */}
          {activeTab === 'branding' && (
            <BrandCustomizationPanel
              branding={localBranding}
              onBrandingChange={setLocalBranding}
              onSave={handleSave}
            />
          )}

          {/* Contact Tab */}
          {activeTab === 'contact' && (
            <ContactSettingsPanel
              branding={localBranding}
              onBrandingChange={setLocalBranding}
            />
          )}

          {/* Testimonials Tab */}
          {activeTab === 'testimonials' && (
            <TestimonialsSettingsPanel
              branding={localBranding}
              onBrandingChange={setLocalBranding}
            />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Notification Preferences</h3>
                <p className="text-sm text-gray-600">Manage how you receive updates and alerts</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox id="email-new-patient" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="email-new-patient" className="font-medium text-gray-900 cursor-pointer">
                      New Patient Submissions
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Get notified when a new patient completes a smile assessment</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox id="email-consultation" className="mt-1" defaultChecked />
                  <div className="flex-1">
                    <Label htmlFor="email-consultation" className="font-medium text-gray-900 cursor-pointer">
                      Consultation Bookings
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Receive alerts for new consultation appointments</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <Checkbox id="email-followup" className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor="email-followup" className="font-medium text-gray-900 cursor-pointer">
                      Follow-up Reminders
                    </Label>
                    <p className="text-sm text-gray-600 mt-1">Get reminders for patient follow-ups and check-ins</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Integration Tab */}
          {activeTab === 'integration' && (
            <div className="space-y-6">
              <ApiSettingsPanel />
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <SecuritySettingsPanel />
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Subscription & Billing</h3>
                <p className="text-sm text-gray-600">Manage your SmileVisionPro subscription</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Professional Plan</h4>
                    <p className="text-sm text-gray-600 mt-1">Unlimited assessments • Priority support</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">$97</p>
                    <p className="text-sm text-gray-600">/month</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-gray-300">
                    Change Plan
                  </Button>
                  <Button variant="outline" className="flex-1 border-gray-300 text-red-600 hover:bg-red-50">
                    Cancel Subscription
                  </Button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Payment Method</h4>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-gray-700 rounded flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">•••• •••• •••• 4242</p>
                    <p className="text-xs text-gray-600">Expires 12/25</p>
                  </div>
                  <Button variant="outline" size="sm" className="border-gray-300">
                    Update
                  </Button>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Billing History</h4>
                <div className="space-y-2">
                  {[
                    { date: 'Jan 1, 2026', amount: '$97.00', status: 'Paid' },
                    { date: 'Dec 1, 2025', amount: '$97.00', status: 'Paid' },
                    { date: 'Nov 1, 2025', amount: '$97.00', status: 'Paid' },
                  ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{invoice.date}</p>
                        <p className="text-xs text-gray-600">{invoice.status}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{invoice.amount}</p>
                        <button className="text-xs text-blue-600 hover:underline">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}