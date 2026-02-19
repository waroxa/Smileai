import React from 'react';
import { Sparkles, Bell, HelpCircle, User, LogOut } from 'lucide-react';
import { ClinicBranding } from '../../App';

interface AppHeaderProps {
  clinicBranding: ClinicBranding;
  onLogout?: () => void;
}

export function AppHeader({ clinicBranding, onLogout }: AppHeaderProps) {
  const handleLogout = () => {
    sessionStorage.removeItem('smileai_admin_authenticated');
    if (onLogout) {
      onLogout();
    } else {
      // Navigate to homepage
      window.location.href = '/';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-3">
        {/* App Branding */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${clinicBranding.primaryColor}15` }}
          >
            <Sparkles 
              className="w-6 h-6" 
              style={{ color: clinicBranding.primaryColor }}
            />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">SmileVisionPro</h1>
            <p className="text-xs text-gray-500">Dental Transformation Suite</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button className="flex items-center gap-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}