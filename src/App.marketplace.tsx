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
import { GHLMarketplaceConnect } from './components/marketplace/GHLMarketplaceConnect';
import { EmbeddedAppLayout } from './components/marketplace/EmbeddedAppLayout';

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

/**
 * App Component - Marketplace-Ready Version
 * 
 * Features:
 * - Detects embedded/standalone mode
 * - Optimized for marketplace portal iframe
 * - Responsive with 8px grid spacing
 * - No horizontal scroll
 * - Proper viewport handling
 */
function App() {
  const [isStaffMode, setIsStaffMode] = useState(false);
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [clinicBranding, setClinicBranding] = useState<ClinicBranding>({
    clinicName: 'SmileAI Miami',
    primaryColor: '#0EA5E9',
    accentColor: '#06B6D4',
  });

  // Simple router - check URL path
  const path = window.location.pathname;

  // Detect embedded mode
  useEffect(() => {
    const embedded = window.self !== window.top;
    setIsEmbedded(embedded);
    
    if (embedded) {
      console.log('🎯 Running in embedded mode (iframe)');
      // Add body class for embedded-specific styles
      document.body.classList.add('embedded-mode');
    }
  }, []);

  // Initialize platform SSO on mount
  useEffect(() => {
    const ghlDetected = initializeGHLSSO();
    
    if (ghlDetected) {
      const status = getGHLConfigStatus();
      console.log('🎉 platform Integration Status:', status);
      
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
    return <Privacy />;
  }
  if (path === '/terms' || path === '/terms.html') {
    return <Terms />;
  }

  // OAuth Admin page - Marketplace version
  if (path === '/admin/ghl-connect' || path === '/marketplace/connect') {
    return <GHLMarketplaceConnect />;
  }

  // If in staff mode, show dashboard with embedded layout
  if (isStaffMode) {
    return (
      <EmbeddedAppLayout maxWidth="full">
        <SmileVisionProApp 
          clinicBranding={clinicBranding} 
          onBrandingChange={setClinicBranding} 
        />
      </EmbeddedAppLayout>
    );
  }

  // Customer landing page
  // If embedded, show simplified version
  if (isEmbedded) {
    return (
      <EmbeddedAppLayout maxWidth="full">
        <div className="bg-white">
          <SmileTransformationSection />
        </div>
      </EmbeddedAppLayout>
    );
  }

  // Otherwise show full landing page
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
