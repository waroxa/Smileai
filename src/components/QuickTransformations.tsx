import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import beforeImage1 from 'figma:asset/e48e1508ae690e5a9f1735226e02db94194bc3f0.png';
import naturalImage1 from 'figma:asset/05a9c44d915ba53264dcf88fa1ff97bfe86621e6.png';
import hollywoodImage1 from 'figma:asset/ba88f5071e0e5b56767bf8cea28598b75d5eaf55.png';
import beforeImage2 from 'figma:asset/5e0c2f0e653e36e8b3c861194ace748aeb9fd03c.png';
import naturalImage2 from 'figma:asset/ec1dad070976983db727150abe4e0283213dc7cc.png';
import hollywoodImage2 from 'figma:asset/5667734a38eb1b644cf323309c5e73c4a65ce4f6.png';
import beforeImage3 from 'figma:asset/c12aff1d63db36bbfabf3d6d639aac5a3ebb42d5.png';
import naturalImage3 from 'figma:asset/16a80c7d618612a3d58a9ccc7c531964213086a2.png';
import hollywoodImage3 from 'figma:asset/87d6c1ab1b01ef75b0860c9653a9c13a4a2d97d9.png';

export function QuickTransformations() {
  const [selectedViews, setSelectedViews] = useState<{[key: number]: string}>({
    0: 'before',
    1: 'before',
    2: 'before'
  });

  const transformations = [
    {
      id: 0,
      images: {
        'before': beforeImage1,
        'natural': naturalImage1,
        'hollywood': hollywoodImage1
      }
    },
    {
      id: 1,
      images: {
        'before': beforeImage2,
        'natural': naturalImage2,
        'hollywood': hollywoodImage2
      }
    },
    {
      id: 2,
      images: {
        'before': beforeImage3,
        'natural': naturalImage3,
        'hollywood': hollywoodImage3
      }
    }
  ];

  const buttons = [
    { id: 'before', label: 'Before' },
    { id: 'natural', label: 'Natural' },
    { id: 'hollywood', label: 'Hollywood' }
  ];

  return (
    <div className="mb-8 sm:mb-12 px-4 sm:px-6 lg:px-8">
      {/* Section Title */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 px-4">
          <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
            Real Transformations in Under 30 Seconds
          </span>
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-300 px-4">
          Every image is watermarked with your practice logo. Click buttons to see shade options.
        </p>
      </div>

      {/* Transformations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
        {transformations.map((transformation) => (
          <div key={transformation.id} className="flex flex-col w-full">
            {/* Single Image Card */}
            <div className="mb-3 sm:mb-4">
              <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-4 py-2.5 sm:py-3 rounded-t-xl text-center">
                <p className="text-white text-sm sm:text-base font-semibold">AI Enhanced Smile</p>
              </div>
              <div className="border-2 border-teal-600 border-t-0 rounded-b-xl overflow-hidden shadow-lg relative">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={selectedViews[transformation.id]}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    src={transformation.images[selectedViews[transformation.id] as keyof typeof transformation.images]}
                    alt={`${selectedViews[transformation.id]}`}
                    className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Smile Intensity Controls with 3 buttons */}
            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <p className="text-gray-900 text-xs sm:text-sm font-medium mb-2 sm:mb-3">Smile Intensity</p>
              <div className="flex gap-1.5 sm:gap-2">
                {buttons.map((button) => (
                  <label key={button.id} className="flex-1 cursor-pointer min-w-0">
                    <input
                      type="radio"
                      name={`intensity-${transformation.id}`}
                      value={button.id}
                      checked={selectedViews[transformation.id] === button.id}
                      onChange={() => setSelectedViews({
                        ...selectedViews,
                        [transformation.id]: button.id
                      })}
                      className="peer sr-only"
                    />
                    <div className="border-2 border-gray-300 text-gray-700 peer-checked:border-teal-600 peer-checked:bg-gradient-to-r peer-checked:from-teal-600 peer-checked:to-blue-600 peer-checked:text-white rounded-md sm:rounded-lg p-2 sm:p-2.5 md:p-3 text-center transition-all">
                      <p className="text-xs sm:text-sm font-medium truncate">{button.label}</p>
                    </div>
                  </label>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2 sm:mt-3 leading-relaxed">We only adjust teeth and smile – we don't change your face.</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}