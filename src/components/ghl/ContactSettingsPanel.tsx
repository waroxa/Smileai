import { useState } from 'react';
import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ClinicBranding } from '../../App';

// TikTok icon
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

interface ContactSettingsPanelProps {
  branding: ClinicBranding;
  onBrandingChange: (branding: ClinicBranding) => void;
}

export function ContactSettingsPanel({ branding, onBrandingChange }: ContactSettingsPanelProps) {
  const contactInfo = branding.contactInfo || {};
  const socialMedia = branding.socialMedia || {};

  const handleContactChange = (field: string, value: string) => {
    onBrandingChange({
      ...branding,
      contactInfo: {
        ...contactInfo,
        [field]: value,
      },
    });
  };

  const handleSocialChange = (platform: string, value: string) => {
    onBrandingChange({
      ...branding,
      socialMedia: {
        ...socialMedia,
        [platform]: value,
      },
    });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Contact Information Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Information</h3>
        <p className="text-sm text-gray-600 mb-6">
          This information will appear in your landing page footer
        </p>

        <div className="space-y-6">
          {/* Address */}
          <div>
            <Label htmlFor="address" className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              Address
            </Label>
            <Input
              id="address"
              placeholder="123 Main Street, City, State ZIP"
              value={contactInfo.address || ''}
              onChange={(e) => handleContactChange('address', e.target.value)}
              className="max-w-xl"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use line breaks for multi-line addresses (e.g., "123 Main St\nMiami, FL 33132")
            </p>
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
              <Phone className="w-4 h-4 text-gray-500" />
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(305) 555-1234"
              value={contactInfo.phone || ''}
              onChange={(e) => handleContactChange('phone', e.target.value)}
              className="max-w-xl"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email" className="flex items-center gap-2 mb-2">
              <Mail className="w-4 h-4 text-gray-500" />
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="info@yourpractice.com"
              value={contactInfo.email || ''}
              onChange={(e) => handleContactChange('email', e.target.value)}
              className="max-w-xl"
            />
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Social Media Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Social Media Links</h3>
        <p className="text-sm text-gray-600 mb-6">
          Add your social media URLs. Only links with values will appear in the footer.
        </p>

        <div className="space-y-6">
          {/* Facebook */}
          <div>
            <Label htmlFor="facebook" className="flex items-center gap-2 mb-2">
              <Facebook className="w-4 h-4 text-blue-600" />
              Facebook
            </Label>
            <Input
              id="facebook"
              type="url"
              placeholder="https://facebook.com/yourpractice"
              value={socialMedia.facebook || ''}
              onChange={(e) => handleSocialChange('facebook', e.target.value)}
              className="max-w-xl"
            />
          </div>

          {/* Instagram */}
          <div>
            <Label htmlFor="instagram" className="flex items-center gap-2 mb-2">
              <Instagram className="w-4 h-4 text-pink-600" />
              Instagram
            </Label>
            <Input
              id="instagram"
              type="url"
              placeholder="https://instagram.com/yourpractice"
              value={socialMedia.instagram || ''}
              onChange={(e) => handleSocialChange('instagram', e.target.value)}
              className="max-w-xl"
            />
          </div>

          {/* TikTok */}
          <div>
            <Label htmlFor="tiktok" className="flex items-center gap-2 mb-2">
              <TikTokIcon className="w-4 h-4" />
              TikTok
            </Label>
            <Input
              id="tiktok"
              type="url"
              placeholder="https://tiktok.com/@yourpractice"
              value={socialMedia.tiktok || ''}
              onChange={(e) => handleSocialChange('tiktok', e.target.value)}
              className="max-w-xl"
            />
          </div>

          {/* LinkedIn */}
          <div>
            <Label htmlFor="linkedin" className="flex items-center gap-2 mb-2">
              <Linkedin className="w-4 h-4 text-blue-700" />
              LinkedIn
            </Label>
            <Input
              id="linkedin"
              type="url"
              placeholder="https://linkedin.com/company/yourpractice"
              value={socialMedia.linkedin || ''}
              onChange={(e) => handleSocialChange('linkedin', e.target.value)}
              className="max-w-xl"
            />
          </div>

          {/* YouTube */}
          <div>
            <Label htmlFor="youtube" className="flex items-center gap-2 mb-2">
              <Youtube className="w-4 h-4 text-red-600" />
              YouTube
            </Label>
            <Input
              id="youtube"
              type="url"
              placeholder="https://youtube.com/@yourpractice"
              value={socialMedia.youtube || ''}
              onChange={(e) => handleSocialChange('youtube', e.target.value)}
              className="max-w-xl"
            />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Click "Save Changes" at the top of the page to save your contact information and social media links to the database.
        </p>
      </div>
    </div>
  );
}