import { ArrowRight, Star, MapPin, Shield, Award } from 'lucide-react';
import { Button } from './ui/button';
import { ClinicBranding } from '../App';
import { useState, useEffect } from 'react';

interface HeroProps {
  clinicBranding: ClinicBranding;
}

// Generate random but realistic numbers on component mount
const generateRandomStats = () => {
  return {
    patients: Math.floor(Math.random() * (2500 - 850) + 850), // 850-2500
    previews: Math.floor(Math.random() * (8900 - 3200) + 3200), // 3200-8900
    reviews: Math.floor(Math.random() * (950 - 380) + 380), // 380-950
  };
};

export function Hero({ clinicBranding }: HeroProps) {
  const [stats, setStats] = useState(generateRandomStats());

  // Regenerate stats on mount to ensure different numbers each session
  useEffect(() => {
    setStats(generateRandomStats());
  }, []);

  const scrollToTransform = () => {
    const section = document.getElementById('smile-transform');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-blue-50 overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            {clinicBranding.logo ? (
              <img 
                src={clinicBranding.logo} 
                alt={clinicBranding.clinicName}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain rounded-lg"
              />
            ) : (
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg sm:text-xl">✨</span>
              </div>
            )}
            <div>
              <h1 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">{clinicBranding.clinicName}</h1>
              <p className="text-xs text-gray-600 hidden sm:block">AI-Powered Smile Previews</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Miami, FL</span>
            </div>
            <Button 
              onClick={scrollToTransform}
              className="bg-teal-600 hover:bg-teal-700 text-sm sm:text-base h-9 sm:h-10 px-3 sm:px-6"
            >
              Try AI Now
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-white rounded-full shadow-sm mb-4 sm:mb-6">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500" />
              <span className="text-xs sm:text-sm font-medium text-gray-700">Trusted by {stats.patients}+ patients in Miami</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              See Your Dream Smile
              <span className="block bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mt-2">
                With AI in 30 Seconds
              </span>
            </h1>
            
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-xl mx-auto lg:mx-0">
              Upload a photo and instantly see what your smile could look like with AI-powered dental treatment preview. No commitment, completely free.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-8 sm:mb-12">
              <Button 
                onClick={scrollToTransform}
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg shadow-lg font-semibold"
              >
                Try AI Smile Preview Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg border-2 font-semibold"
                onClick={() => {
                  const section = document.getElementById('how-it-works');
                  section?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                How AI Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-lg mx-auto lg:mx-0">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">Board Certified</p>
                <p className="text-xs text-gray-500">Dentists</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-teal-600" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">15+ Years</p>
                <p className="text-xs text-gray-500">Experience</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                  <Star className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-xs sm:text-sm font-semibold text-gray-900">4.9/5 Rating</p>
                <p className="text-xs text-gray-500">{stats.reviews}+ Reviews</p>
              </div>
            </div>
          </div>

          {/* Right Column - Hero Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={clinicBranding.heroImage || "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=800&q=80"}
                alt="Beautiful smile transformation"
                className="w-full h-[250px] sm:h-[350px] lg:h-[450px] xl:h-[500px] object-cover"
              />
              {/* Overlay Badge */}
              <div className="absolute bottom-3 left-3 right-3 sm:bottom-6 sm:left-6 sm:right-6 bg-white/95 backdrop-blur-sm rounded-xl p-3 sm:p-4 shadow-lg">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-lg sm:text-xl">✨</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">AI-Powered Smile Preview</p>
                    <p className="text-xs text-gray-600">See results in seconds</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Stats */}
            <div className="hidden sm:block absolute -top-3 -right-3 lg:-top-4 lg:-right-4 bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <p className="text-2xl sm:text-3xl font-bold text-teal-600">{stats.previews}+</p>
              <p className="text-xs sm:text-sm text-gray-600">AI Previews</p>
            </div>
            <div className="hidden sm:block absolute -bottom-3 -left-3 lg:-bottom-4 lg:-left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <p className="text-2xl sm:text-3xl font-bold text-blue-600">100%</p>
              <p className="text-xs sm:text-sm text-gray-600">Free Preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -z-0 w-1/2 h-1/2 bg-gradient-to-br from-teal-100/30 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-0 w-1/2 h-1/2 bg-gradient-to-tr from-blue-100/30 to-transparent rounded-full blur-3xl"></div>
    </section>
  );
}