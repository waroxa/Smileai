import { projectId } from '../utils/supabase/info';
import { motion } from 'motion/react';
import { Play, Star } from 'lucide-react';

export function RealResultsVideos() {
  // Construct public URLs for videos in "ai Videos" bucket
  const video1Url = `https://${projectId}.supabase.co/storage/v1/object/public/ai%20Videos/B1mMj15qALV62RoTfjk7l_output.mp4`;
  const video2Url = `https://${projectId}.supabase.co/storage/v1/object/public/ai%20Videos/R0BPFcfU_zKvylZQP-oRK_output.mp4`;

  return (
    <section className="bg-gradient-to-b from-white to-gray-50 py-16 sm:py-20 lg:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
            <Play className="w-4 h-4" />
            <span className="text-sm font-semibold">Real Transformations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl text-gray-900 mb-4">
            See Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Smile Transformations</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Watch actual patients show off their stunning new smiles. These are real results from people just like you.
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-6xl mx-auto">
          {/* Video 1 */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl">
              {/* Video Container */}
              <div className="relative bg-black aspect-square">
                <video
                  src={video1Url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster=""
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  ✨ Real Result
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(5.0)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "I couldn't believe the transformation! My smile looks exactly like I always dreamed it would."
                </p>
                <p className="text-sm text-gray-500 mt-3">- Happy Patient</p>
              </div>
            </div>
          </motion.div>

          {/* Video 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-gray-100 hover:border-purple-300 transition-all duration-300 hover:shadow-2xl">
              {/* Video Container */}
              <div className="relative bg-black aspect-square">
                <video
                  src={video2Url}
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster=""
                >
                  Your browser does not support the video tag.
                </video>
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
                  ✨ Real Result
                </div>
              </div>
              
              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-1 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">(5.0)</span>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  "The preview showed me exactly what was possible. Now I can't stop smiling!"
                </p>
                <p className="text-sm text-gray-500 mt-3">- Happy Patient</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* CTA Below Videos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-xl text-gray-700 mb-6">
            Ready to see your own transformation?
          </p>
          <a
            href="#smile-transform"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Get Your Free Preview Now
            <span className="text-2xl">→</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}