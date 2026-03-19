import React, { useEffect, useMemo, useState } from 'react';
import { Hero } from './components/Hero';
import { SmileTransformationSection } from './components/SmileTransformationSection';
import { HowItWorks } from './components/HowItWorks';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { RealResultsVideos } from './components/RealResultsVideos';
import { Support } from './components/docs/Support';
import { Privacy } from './components/docs/Privacy';
import { Terms } from './components/docs/Terms';
import { NotFoundPage } from './components/NotFoundPage';


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
  googleReviewsScript?: string;
}

const publicRoutes = new Set(['/', '/privacy', '/privacy.html', '/terms', '/terms.html', '/support', '/support.html']);

function App() {
  const [clinicBranding, setClinicBranding] = useState<ClinicBranding>({
    clinicName: 'SmileVisionPro AI',
    primaryColor: '#0EA5E9',
    accentColor: '#06B6D4',
  });

  const path = window.location.pathname;

  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'SmileVisionPro AI',
      '/privacy': 'Privacy Policy - SmileVisionPro AI',
      '/terms': 'Terms of Service - SmileVisionPro AI',
      '/support': 'Support - SmileVisionPro AI',
    };

    document.title = routeTitles[path] || 'SmileVisionPro AI';
  }, [path]);

  const publicView = useMemo(() => {
    if (path === '/support' || path === '/support.html') return <Support />;
    if (path === '/privacy' || path === '/privacy.html') return <Privacy />;
    if (path === '/terms' || path === '/terms.html') return <Terms />;
    if (path === '/') {
      return (
        <div className="min-h-screen bg-white">
          <Hero clinicBranding={clinicBranding} />
          <SmileTransformationSection />
          <RealResultsVideos />
          <HowItWorks />
          <Testimonials clinicBranding={clinicBranding} />
          <Footer clinicBranding={clinicBranding} />
        </div>
      );
    }

    return null;
  }, [clinicBranding, path]);


  if (publicView) return publicView;
  if (!publicRoutes.has(path)) return <NotFoundPage />;

  return publicView;
}

export default App;
