import { MapPin, Phone, Mail, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { useState } from 'react';
import { ClinicBranding } from '../App';
import { StaffLoginModal } from './StaffLoginModal';

// TikTok icon (Lucide doesn't have it, so we'll create a simple SVG)
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

interface FooterProps {
  clinicBranding?: ClinicBranding;
}

export function Footer({ clinicBranding }: FooterProps) {
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleStaffLogin = () => {
    // Show login modal
    setShowLoginModal(true);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    // Reload the page to show the staff dashboard
    window.location.reload();
  };

  const clinicName = clinicBranding?.clinicName || 'SmileAI Miami';
  const logo = clinicBranding?.logo;
  const contactInfo = clinicBranding?.contactInfo || {};
  const socialMedia = clinicBranding?.socialMedia || {};

  // Social media items - only show if link is provided
  const socialItems = [
    { name: 'Facebook', icon: Facebook, url: socialMedia.facebook },
    { name: 'Instagram', icon: Instagram, url: socialMedia.instagram },
    { name: 'TikTok', icon: TikTokIcon, url: socialMedia.tiktok },
    { name: 'LinkedIn', icon: Linkedin, url: socialMedia.linkedin },
    { name: 'YouTube', icon: Youtube, url: socialMedia.youtube },
  ].filter(item => item.url && item.url.trim() !== '');

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              {logo ? (
                <img 
                  src={logo} 
                  alt={clinicName}
                  className="w-10 h-10 object-contain rounded-lg"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">✨</span>
                </div>
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{clinicName}</h3>
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Transform your smile with AI-powered previews and expert dental care.
            </p>
            {socialItems.length > 0 && (
              <div className="flex gap-3">
                {socialItems.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-r hover:from-teal-600 hover:to-blue-600 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg"
                      aria-label={social.name}
                    >
                      <Icon className="w-5 h-5" />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Services Column */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4">Services</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Dental Implants
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Veneers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Teeth Whitening
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Smile Makeover
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Invisalign
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-base sm:text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Our Team
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Before & After
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Patient Reviews
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h4 className="text-base sm:text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              {contactInfo.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-300" style={{ whiteSpace: 'pre-line' }}>
                    {contactInfo.address}
                  </span>
                </li>
              )}
              {contactInfo.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <a href={`tel:${contactInfo.phone.replace(/\D/g, '')}`} className="text-gray-300 hover:text-teal-400 transition-colors duration-200">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo.email && (
                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${contactInfo.email}`} className="text-gray-300 hover:text-teal-400 transition-colors duration-200 break-all">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {!contactInfo.address && !contactInfo.phone && !contactInfo.email && (
                <li className="text-gray-500 text-xs italic">
                  Contact information can be set in Settings
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">
              © 2026 {clinicName}. All rights reserved. HIPAA compliant and regulated by the United States of America.
            </p>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-xs sm:text-sm text-gray-400 justify-center">
              <a href="#privacy-policy" className="hover:text-teal-400 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#terms-of-service" className="hover:text-teal-400 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#hipaa-notice" className="hover:text-teal-400 transition-colors duration-200">
                HIPAA Notice
              </a>
              {/* Subtle Admin Access Link */}
              <button
                onClick={handleStaffLogin}
                className="hover:text-teal-400 transition-colors duration-200 cursor-pointer"
              >
                Staff Login
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Login Modal */}
      <StaffLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </footer>
  );
}