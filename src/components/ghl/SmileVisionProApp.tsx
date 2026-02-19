import React, { useState } from 'react';
import { Menu, X, LayoutDashboard, Users, Sparkles, Settings } from 'lucide-react';
import { AppHeader } from './AppHeader';
import { AppNavigation } from './AppNavigation';
import { DashboardView } from './DashboardView';
import { PatientsView } from './PatientsView';
import { SmileToolView } from './SmileToolView';
import { SettingsView } from './SettingsView';
import { ContactProfile } from './ContactProfile';
import { DemoPanel } from './DemoPanel';
import { Footer } from '../Footer';
import { ViewType, ClinicBranding } from '../../App';

interface SmileVisionProAppProps {
  clinicBranding: ClinicBranding;
  onBrandingChange: (branding: ClinicBranding) => void;
}

export function SmileVisionProApp({ clinicBranding, onBrandingChange }: SmileVisionProAppProps) {
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleViewContact = (contactId: string) => {
    setSelectedContactId(contactId);
  };

  const handleBackFromContact = () => {
    setSelectedContactId(null);
  };

  const handleNavigate = (view: ViewType) => {
    setActiveView(view);
    setIsMobileMenuOpen(false); // Close mobile menu on navigation
  };

  // If viewing a contact profile, show that instead
  if (selectedContactId) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader clinicBranding={clinicBranding} />
        <ContactProfile 
          contactId={selectedContactId}
          onBack={handleBackFromContact}
          primaryColor={clinicBranding.primaryColor}
        />
      </div>
    );
  }

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView clinicBranding={clinicBranding} />;
      case 'patients':
        return <PatientsView clinicBranding={clinicBranding} onViewContact={handleViewContact} />;
      case 'smile-tool':
        return <SmileToolView clinicBranding={clinicBranding} />;
      case 'settings':
        return (
          <SettingsView
            clinicBranding={clinicBranding}
            onBrandingChange={onBrandingChange}
          />
        );
      default:
        return <DashboardView clinicBranding={clinicBranding} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader clinicBranding={clinicBranding} />
      
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-[100] bg-cyan-500 hover:bg-cyan-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      <div className="flex">
        {/* Desktop Sidebar - Hidden on mobile */}
        <div className="hidden lg:block">
          <AppNavigation
            activeView={activeView}
            onNavigate={handleNavigate}
            primaryColor={clinicBranding.primaryColor}
          />
        </div>

        {/* Mobile Sidebar - Overlay */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Sidebar */}
            <div className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl overflow-y-auto">
              {/* Close button at top */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <span className="font-semibold text-gray-900">Menu</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="p-4">
                {/* Navigation Items */}
                <div className="space-y-1">
                  {[
                    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
                    { id: 'patients' as ViewType, label: 'Patients', icon: Users },
                    { id: 'smile-tool' as ViewType, label: 'Smile Tool', icon: Sparkles },
                    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    const isActive = activeView === item.id;
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavigate(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          isActive
                            ? 'text-white shadow-sm'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={isActive ? { backgroundColor: clinicBranding.primaryColor } : {}}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
      </div>

      <Footer clinicBranding={clinicBranding} />
    </div>
  );
}