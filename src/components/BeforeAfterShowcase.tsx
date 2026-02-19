import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import beforeImage from 'figma:asset/e48e1508ae690e5a9f1735226e02db94194bc3f0.png';
import afterImage from 'figma:asset/bb8752ca16ec53e8474c9de1a2495cdfa2e1fb81.png';

export function BeforeAfterShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const examples = [
    { before: beforeImage, after: afterImage, video: afterImage }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % examples.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [examples.length]);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Three Column Layout - Before, After, Video */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Before */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200"
        >
          <div className="bg-gray-100 p-4 border-b border-gray-200">
            <h3 className="text-center text-gray-900">Before</h3>
          </div>
          <div className="relative aspect-square">
            <img
              src={examples[currentIndex].before}
              alt="Before"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>

        {/* After */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg border border-blue-300"
        >
          <div className="bg-blue-600 p-4 border-b border-blue-700">
            <h3 className="text-center text-white">After - AI Enhanced</h3>
          </div>
          <div className="relative aspect-square">
            <motion.img
              src={examples[currentIndex].after}
              alt="After"
              className="w-full h-full object-cover"
              animate={{
                filter: ['brightness(1)', 'brightness(1.05)', 'brightness(1)']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl overflow-hidden shadow-lg border border-purple-300"
        >
          <div className="bg-purple-600 p-4 border-b border-purple-700">
            <h3 className="text-center text-white">7-Second Video</h3>
          </div>
          <div className="relative aspect-square">
            <motion.img
              src={examples[currentIndex].video}
              alt="Video"
              className="w-full h-full object-cover"
              animate={{
                scale: [1, 1.08, 1],
                filter: [
                  'brightness(1) contrast(1)',
                  'brightness(1.15) contrast(1.1)',
                  'brightness(1) contrast(1)'
                ]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-blue-500/20 pointer-events-none"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.8, 1, 0.8]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="bg-white/95 backdrop-blur-sm rounded-full p-5 shadow-2xl"
              >
                <svg className="w-10 h-10 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>

      <p className="text-center text-gray-500 mt-10 italic">
        "Static images show the destination. Videos show the journey."
      </p>
    </div>
  );
}