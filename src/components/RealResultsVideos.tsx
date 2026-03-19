import { PlayCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { projectId } from '../utils/supabase/info';

const videos = [
  {
    title: 'Sample cinematic reveal',
    description: 'Example output showing the optional short-form smile reveal video workflow.',
    src: `https://${projectId}.supabase.co/storage/v1/object/public/ai%20Videos/B1mMj15qALV62RoTfjk7l_output.mp4`,
  },
  {
    title: 'Sample follow-up asset',
    description: 'Another sample video generated from a transformed smile image.',
    src: `https://${projectId}.supabase.co/storage/v1/object/public/ai%20Videos/R0BPFcfU_zKvylZQP-oRK_output.mp4`,
  },
];

export function RealResultsVideos() {
  return (
    <section className="bg-gradient-to-b from-white to-slate-50 py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-violet-100 text-violet-700 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
            <PlayCircle className="w-4 h-4" />
            Optional video output
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-950 mb-4">Sample smile-reveal videos</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            These clips demonstrate the optional video-generation stage. Label them as samples unless they are approved real patient assets.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {videos.map((video, index) => (
            <motion.article key={video.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.12 }} className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl">
              <div className="aspect-square bg-black">
                <video src={video.src} controls muted loop playsInline className="w-full h-full object-cover">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="p-6">
                <p className="text-sm font-medium text-violet-700 mb-2">Sample asset</p>
                <h3 className="text-xl font-semibold text-slate-950 mb-2">{video.title}</h3>
                <p className="text-slate-600">{video.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
