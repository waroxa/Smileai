import React, { useState, useRef } from 'react';
import { Upload, Check, X, AlertCircle, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClinicBranding } from '../../App';
import { BrandingPreview } from './BrandingPreview';
import { BrandingTipsCard } from './BrandingTipsCard';

interface BrandCustomizationPanelProps {
  branding: ClinicBranding;
  onBrandingChange: (branding: ClinicBranding) => void;
  onSave: () => void;
}

export function BrandCustomizationPanel({ 
  branding, 
  onBrandingChange, 
  onSave 
}: BrandCustomizationPanelProps) {
  const [localBranding, setLocalBranding] = useState(branding);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [heroImageError, setHeroImageError] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroImageInputRef = useRef<HTMLInputElement>(null);

  // Preset color palettes for easy selection
  const colorPresets = [
    { name: 'Ocean Blue', primary: '#0ea5e9', accent: '#06b6d4' },
    { name: 'Medical Teal', primary: '#14b8a6', accent: '#0d9488' },
    { name: 'Trust Blue', primary: '#3b82f6', accent: '#2563eb' },
    { name: 'Fresh Green', primary: '#10b981', accent: '#059669' },
    { name: 'Warm Orange', primary: '#f97316', accent: '#ea580c' },
    { name: 'Professional Purple', primary: '#8b5cf6', accent: '#7c3aed' },
    { name: 'Elegant Rose', primary: '#ec4899', accent: '#db2777' },
    { name: 'Deep Navy', primary: '#1e40af', accent: '#1e3a8a' },
  ];

  const updateBranding = (updates: Partial<ClinicBranding>) => {
    const newBranding = { ...localBranding, ...updates };
    setLocalBranding(newBranding);
    onBrandingChange(newBranding);
    setHasUnsavedChanges(true);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!validTypes.includes(file.type)) {
      setLogoError('Please upload a PNG, JPG, or SVG file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setLogoError('File size must be less than 2MB');
      return;
    }

    setLogoError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBranding({ logo: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    updateBranding({ logo: null });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setHeroImageError('Please upload a PNG or JPG file');
      return;
    }

    // Validate file size (max 5MB for hero images)
    if (file.size > 5 * 1024 * 1024) {
      setHeroImageError('File size must be less than 5MB');
      return;
    }

    setHeroImageError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBranding({ heroImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const removeHeroImage = () => {
    updateBranding({ heroImage: null });
    if (heroImageInputRef.current) {
      heroImageInputRef.current.value = '';
    }
  };

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    updateBranding({
      primaryColor: preset.primary,
      accentColor: preset.accent,
    });
  };

  const handleSave = () => {
    onSave();
    setHasUnsavedChanges(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Brand Settings */}
      <div className="lg:col-span-2 space-y-6">
        {/* Clinic Name */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-gray-700" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Clinic Information</h3>
          </div>
          
          <div>
            <Label htmlFor="clinicName" className="text-sm sm:text-base">
              Clinic Name
            </Label>
            <p className="text-xs sm:text-sm text-gray-600 mb-3">
              This will appear in the app header and patient communications
            </p>
            <Input
              id="clinicName"
              value={localBranding.clinicName}
              onChange={(e) => updateBranding({ clinicName: e.target.value })}
              placeholder="e.g., Smile Dental Care"
              className="text-sm sm:text-base h-10 sm:h-12"
            />
          </div>
        </div>

        {/* Logo Upload */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-gray-700" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Clinic Logo</h3>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Upload your clinic logo. It will be displayed in the app header.
          </p>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo Preview */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                {localBranding.logo ? (
                  <img 
                    src={localBranding.logo} 
                    alt="Clinic Logo" 
                    className="w-full h-full object-contain p-2" 
                  />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">No logo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleLogoUpload}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {localBranding.logo ? 'Change Logo' : 'Upload Logo'}
                </Button>
                
                {localBranding.logo && (
                  <Button
                    onClick={removeLogo}
                    variant="outline"
                    className="border-gray-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Logo Guidelines:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Square format recommended (1:1 ratio)</li>
                      <li>Minimum 200x200px, ideal 400x400px</li>
                      <li>PNG with transparent background works best</li>
                      <li>Maximum file size: 2MB</li>
                    </ul>
                  </div>
                </div>
              </div>

              {logoError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-800">{logoError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Image Upload */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <ImageIcon className="w-5 h-5 text-gray-700" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Hero Image</h3>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Upload a hero image for your landing page. This appears at the top of your site.
          </p>

          <div className="space-y-4">
            {/* Hero Image Preview */}
            <div className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
              {localBranding.heroImage ? (
                <div className="relative">
                  <img 
                    src={localBranding.heroImage} 
                    alt="Hero" 
                    className="w-full h-48 object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center">
                  <Upload className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">No hero image uploaded</p>
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="space-y-3">
              <input
                ref={heroImageInputRef}
                type="file"
                className="hidden"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleHeroImageUpload}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={() => heroImageInputRef.current?.click()}
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {localBranding.heroImage ? 'Change Hero Image' : 'Upload Hero Image'}
                </Button>
                
                {localBranding.heroImage && (
                  <Button
                    onClick={removeHeroImage}
                    variant="outline"
                    className="border-gray-300 text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex gap-2">
                  <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-blue-800">
                    <p className="font-medium mb-1">Hero Image Guidelines:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Landscape format recommended (16:9 ratio)</li>
                      <li>Minimum 1920x1080px for best quality</li>
                      <li>PNG or JPG format</li>
                      <li>Maximum file size: 5MB</li>
                      <li>Shows dental office, staff, or patients</li>
                    </ul>
                  </div>
                </div>
              </div>

              {heroImageError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-600" />
                  <p className="text-sm text-red-800">{heroImageError}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Color Selection */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-500 rounded" />
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Brand Colors</h3>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            Choose colors that match your clinic's branding. These will appear throughout the app.
          </p>

          {/* Quick Color Presets */}
          <div className="mb-6">
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              Quick Color Themes
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyColorPreset(preset)}
                  className="group relative p-3 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-all hover:shadow-md"
                >
                  <div className="flex gap-2 mb-2">
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: preset.primary }}
                    />
                    <div
                      className="w-8 h-8 rounded border border-gray-200"
                      style={{ backgroundColor: preset.accent }}
                    />
                  </div>
                  <p className="text-xs font-medium text-gray-700 group-hover:text-gray-900">
                    {preset.name}
                  </p>
                  
                  {/* Check if currently selected */}
                  {localBranding.primaryColor === preset.primary && 
                   localBranding.accentColor === preset.accent && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryColor" className="text-sm font-medium text-gray-700 mb-2 block">
                Primary Color
              </Label>
              <p className="text-xs text-gray-600 mb-3">
                Used for buttons, navigation highlights, and key actions
              </p>
              <div className="flex gap-3 items-center">
                <Input
                  id="primaryColor"
                  type="color"
                  value={localBranding.primaryColor}
                  onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                  className="w-20 h-12 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={localBranding.primaryColor}
                  onChange={(e) => updateBranding({ primaryColor: e.target.value })}
                  className="flex-1 h-12 font-mono text-sm"
                  placeholder="#0ea5e9"
                />
                <div 
                  className="w-12 h-12 rounded border-2 border-gray-200"
                  style={{ backgroundColor: localBranding.primaryColor }}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="accentColor" className="text-sm font-medium text-gray-700 mb-2 block">
                Accent Color
              </Label>
              <p className="text-xs text-gray-600 mb-3">
                Used for secondary elements and highlights
              </p>
              <div className="flex gap-3 items-center">
                <Input
                  id="accentColor"
                  type="color"
                  value={localBranding.accentColor}
                  onChange={(e) => updateBranding({ accentColor: e.target.value })}
                  className="w-20 h-12 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={localBranding.accentColor}
                  onChange={(e) => updateBranding({ accentColor: e.target.value })}
                  className="flex-1 h-12 font-mono text-sm"
                  placeholder="#8b5cf6"
                />
                <div 
                  className="w-12 h-12 rounded border-2 border-gray-200"
                  style={{ backgroundColor: localBranding.accentColor }}
                />
              </div>
            </div>
          </div>

          {/* Color Usage Examples */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-3">Preview in Context:</p>
            <div className="space-y-2">
              <button
                className="w-full py-2.5 px-4 rounded-lg text-white font-medium text-sm shadow-sm"
                style={{ backgroundColor: localBranding.primaryColor }}
              >
                Primary Button Example
              </button>
              <button
                className="w-full py-2.5 px-4 rounded-lg text-white font-medium text-sm"
                style={{ backgroundColor: localBranding.accentColor }}
              >
                Accent Button Example
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              {hasUnsavedChanges ? (
                <div className="flex items-center gap-2 text-amber-600">
                  <div className="w-2 h-2 bg-amber-600 rounded-full animate-pulse" />
                  <p className="text-sm font-medium">You have unsaved changes</p>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <Check className="w-4 h-4" />
                  <p className="text-sm font-medium">All changes saved</p>
                </div>
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className="text-white shadow-md"
              style={{ backgroundColor: localBranding.primaryColor }}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Brand Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Right Column - Live Preview */}
      <div className="lg:col-span-1">
        <div className="sticky top-6">
          <BrandingPreview branding={localBranding} />
          
          {/* Preview Info */}
          <div className="mt-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Live Preview</h4>
                <p className="text-xs text-gray-700">
                  Changes update instantly. Preview shows how your brand will appear in the app.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}