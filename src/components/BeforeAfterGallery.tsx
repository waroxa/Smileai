import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import beforeImage1 from 'figma:asset/e48e1508ae690e5a9f1735226e02db94194bc3f0.png';
import afterImage1 from 'figma:asset/bb8752ca16ec53e8474c9de1a2495cdfa2e1fb81.png';

export function BeforeAfterGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const transformations = [
    {
      before: beforeImage1,
      after: afterImage1,
      name: 'Linda S.',
      location: 'Miami, FL',
      treatment: 'Full Smile Restoration',
    },
    {
      before: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      after: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
      name: 'Michael R.',
      location: 'Fort Lauderdale, FL',
      treatment: 'Dental Implants',
    },
    {
      before: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      after: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
      name: 'Jessica L.',
      location: 'Coral Gables, FL',
      treatment: 'Smile Makeover',
    },
  ];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4">
            Real Patient Transformations
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            See the incredible results our Miami patients have achieved
          </p>
        </div>

        {/* Gallery Carousel */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            {/* Before/After Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
              <div>
                <div className="bg-gray-100 px-4 py-2 sm:py-3 rounded-t-xl text-center">
                  <p className="text-sm sm:text-base text-gray-700">Before</p>
                </div>
                <div className="border-2 border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
                  <img
                    src={transformations[currentIndex].before}
                    alt="Before treatment"
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
              </div>
              <div>
                <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2 sm:py-3 rounded-t-xl text-center">
                  <p className="text-sm sm:text-base text-white">After</p>
                </div>
                <div className="border-2 border-teal-600 border-t-0 rounded-b-xl overflow-hidden shadow-lg">
                  <img
                    src={transformations[currentIndex].after}
                    alt="After treatment"
                    className="w-full h-48 sm:h-64 lg:h-80 object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="text-center mb-6">
              <h3 className="text-lg sm:text-xl text-gray-900 mb-1">
                {transformations[currentIndex].name}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-1">
                {transformations[currentIndex].location}
              </p>
              <p className="text-xs sm:text-sm text-teal-600">
                Treatment: {transformations[currentIndex].treatment}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
              
              {/* Dots */}
              <div className="flex gap-2">
                {transformations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                      index === currentIndex
                        ? 'bg-teal-600 w-6 sm:w-8'
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Want results like these?</p>
          <button
            onClick={() => {
              const section = document.getElementById('smile-transform');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-shadow text-sm sm:text-base"
          >
            See Your Transformation
          </button>
        </div>
      </div>
    </section>
  );
}