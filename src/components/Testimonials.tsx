import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ClinicBranding } from '../App';

interface TestimonialsProps {
  clinicBranding?: ClinicBranding;
}

export function Testimonials({ clinicBranding }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default testimonials if none are configured
  const defaultTestimonials = [
    {
      id: '1',
      name: 'Maria Gonzalez',
      city: 'Miami Beach, FL',
      rating: 5,
      text: 'The AI preview gave me confidence to move forward with veneers. The actual results exceeded my expectations! My smile has completely transformed my life.',
      service: 'Veneers',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80',
    },
    {
      id: '2',
      name: 'David Chen',
      city: 'Brickell, FL',
      rating: 5,
      text: 'I was skeptical at first, but the AI showed me exactly what was possible. The team delivered on every promise. Highly recommend for anyone considering dental work.',
      service: 'Dental Implants',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80',
    },
    {
      id: '3',
      name: 'Amanda Rodriguez',
      city: 'Coconut Grove, FL',
      rating: 5,
      text: 'Best decision ever! The AI preview was spot-on. The staff was professional, caring, and the results speak for themselves. I can\'t stop smiling!',
      service: 'Smile Makeover',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80',
    },
    {
      id: '4',
      name: 'James Patterson',
      city: 'Coral Gables, FL',
      rating: 5,
      text: 'From consultation to final result, everything was perfect. The technology made it easy to visualize my new smile, and the team made it a reality.',
      service: 'Full Mouth Reconstruction',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80',
    },
    {
      id: '5',
      name: 'Sarah Williams',
      city: 'Kendall, FL',
      rating: 5,
      text: 'After years of hiding my smile, I finally have the confidence I always wanted. The preview tool was incredible and gave me hope. Couldn\'t be happier!',
      service: 'Teeth Whitening & Veneers',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80',
    },
  ];

  const testimonials = (clinicBranding?.testimonials && clinicBranding.testimonials.length > 0)
    ? clinicBranding.testimonials
    : defaultTestimonials;

  const googleReviewsScript = clinicBranding?.googleReviewsScript;

  // Inject Google Reviews script if provided
  useEffect(() => {
    if (googleReviewsScript && googleReviewsScript.trim() !== '') {
      const scriptContainer = document.getElementById('google-reviews-container');
      if (scriptContainer) {
        scriptContainer.innerHTML = googleReviewsScript;
        
        // Execute any scripts in the HTML
        const scripts = scriptContainer.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
          const script = scripts[i];
          const newScript = document.createElement('script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          script.parentNode?.replaceChild(newScript, script);
        }
      }
    }
  }, [googleReviewsScript]);

  // Auto-play slider
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 3) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  // Get visible testimonials based on screen size
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length;
      visible.push({ ...testimonials[index], displayIndex: i });
    }
    return visible;
  };

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-4">
            <Star className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">Real Patient Results</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Our Patients Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join hundreds of satisfied patients who transformed their smiles with AI-powered previews
          </p>
        </div>

        {/* Testimonials Slider */}
        <div className="relative">
          {/* Navigation Arrows - Only show if more than 3 testimonials */}
          {testimonials.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-10 w-12 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>
              <button
                onClick={nextSlide}
                className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-10 w-12 h-12 bg-white hover:bg-gray-50 border-2 border-gray-200 rounded-full items-center justify-center shadow-lg transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>
            </>
          )}

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {visibleTestimonials.map((testimonial, idx) => (
              <div
                key={`${testimonial.id}-${idx}`}
                className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all duration-300 relative animate-in fade-in slide-in-from-bottom-4"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-teal-200">
                  <Quote className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 fill-yellow-500"
                    />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed min-h-[100px]">
                  "{testimonial.text}"
                </p>

                {/* Patient Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                  {testimonial.image ? (
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-600 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {testimonial.city}
                    </p>
                    <p className="text-xs font-medium text-teal-600">{testimonial.service}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation - Only show if more than 3 testimonials */}
          {testimonials.length > 3 && (
            <div className="flex justify-center gap-2 mt-8">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 ${
                    index === currentIndex
                      ? 'w-8 bg-teal-600'
                      : 'w-2 bg-teal-200 hover:bg-teal-300'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-3 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-full">
            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm sm:text-base font-medium text-gray-700">
              <strong>4.9/5</strong> Average Rating from 500+ Reviews
            </span>
          </div>
        </div>

        {/* Google Reviews Integration */}
        {googleReviewsScript && googleReviewsScript.trim() !== '' && (
          <div className="mt-12">
            <div id="google-reviews-container" className="max-w-4xl mx-auto"></div>
          </div>
        )}
      </div>
    </section>
  );
}