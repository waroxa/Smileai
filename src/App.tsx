import React, { useState, useEffect } from 'react';
import { SmileVisionProApp } from './components/ghl/SmileVisionProApp';
import { Hero } from './components/Hero';
import { SmileTransformationSection } from './components/SmileTransformationSection';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { SocialProofNotifications } from './components/SocialProofNotifications';
import { RealResultsVideos } from './components/RealResultsVideos';
import { initializeGHLSSO, getGHLConfigStatus } from './utils/ghl-sso';
import { GettingStarted } from './components/docs/GettingStarted';
import { SetupGuide } from './components/docs/SetupGuide';
import { Support } from './components/docs/Support';
import { Privacy } from './components/docs/Privacy';
import { Terms } from './components/docs/Terms';
import { GHLOAuthConnect } from './components/admin/GHLOAuthConnect';
import { DownloadMarketplaceCode } from './components/DownloadMarketplaceCode';
import { SmileVisionMarketplaceApp } from './components/marketplace/SmileVisionMarketplaceApp';

export type ViewType = 'dashboard' | 'patients' | 'smile-tool' | 'settings';

export interface ClinicBranding {
  clinicName: string;
  logo?: string;
  primaryColor: string;
  accentColor: string;
  heroImage?: string;
  contactInfo?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    linkedin?: string;
    youtube?: string;
  };
  testimonials?: Array<{
    name: string;
    location: string;
    text: string;
    rating: number;
    image?: string;
  }>;
}

export interface Submission {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  originalImage: string;
  aiImage?: string;
  videoUrl?: string;
  timestamp: string;
  status: 'pending' | 'completed';
}

function App() {
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [clinicBranding, setClinicBranding] = useState<ClinicBranding>({
    clinicName: 'SmileAI Miami',
    primaryColor: '#0EA5E9',
    accentColor: '#06B6D4',
  });

  // Simple router - check URL path
  const path = window.location.pathname;

  // Initialize platform SSO on mount
  useEffect(() => {
    // Try to detect and configure platform SSO
    const ghlDetected = initializeGHLSSO();
    
    if (ghlDetected) {
      const status = getGHLConfigStatus();
      console.log('🎉 platform Integration Status:', status);
      
      // Show a friendly notification if platform was just configured
      if (status.configured) {
        console.log('✅ App is now connected to platform!');
        console.log('   Location ID:', status.locationId);
      }
    }
  }, []);

  // Check if user is authenticated on mount
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('smileai_admin_authenticated') === 'true';
    setIsStaffMode(isAuthenticated);
  }, []);

  // Route to documentation pages
  if (path === '/getting-started' || path === '/getting-started.html') {
    return <GettingStarted />;
  }
  if (path === '/setup-guide' || path === '/setup-guide.html') {
    return <SetupGuide />;
  }
  if (path === '/support' || path === '/support.html') {
    return <Support />;
  }
  if (path === '/privacy' || path === '/privacy.html') {
    console.log('Rendering Privacy page');
    return <Privacy />;
  }
  if (path === '/terms' || path === '/terms.html') {
    console.log('Rendering Terms page');
    return <Terms />;
  }

  // OAuth Admin page
  if (path === '/admin/ghl-connect') {
    console.log('Rendering OAuth Admin page');
    return <GHLOAuthConnect />;
  }

  // Download marketplace code page
  if (path === '/download-marketplace' || path === '/download') {
    return <DownloadMarketplaceCode />;
  }

  // Marketplace App (platform embedded view)
  if (path === '/marketplace' || path === '/marketplace/') {
    return <SmileVisionMarketplaceApp />;
  }

  // If in staff mode, show dashboard
  if (isStaffMode) {
    return <SmileVisionProApp clinicBranding={clinicBranding} onBrandingChange={setClinicBranding} />;
  }

  // Otherwise show customer landing page
  return (
    <div className="min-h-screen bg-white">
      <Hero clinicBranding={clinicBranding} />
      <SmileTransformationSection />
      <RealResultsVideos />
      <HowItWorks />
      <Testimonials clinicBranding={clinicBranding} />
      <Footer clinicBranding={clinicBranding} />
      <SocialProofNotifications />
    </div>
  );
}

export default App;