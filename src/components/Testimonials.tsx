import { ShieldCheck, Star } from 'lucide-react';
import { ClinicBranding } from '../App';

interface TestimonialsProps {
  clinicBranding?: ClinicBranding;
}

const sampleTestimonials = [
  {
    id: '1',
    name: 'Sample patient story',
    city: 'Illustrative example',
    rating: 5,
    text: 'This sample quote demonstrates how a practice can present social proof once it has approved real patient testimonials for publishing.',
    service: 'Cosmetic consultation',
  },
  {
    id: '2',
    name: 'Approved case study',
    city: 'Replace with real data',
    rating: 5,
    text: 'Use this section for authentic, permission-based testimonials. Remove placeholders before going live if no real testimonials are available.',
    service: 'Smile makeover',
  },
  {
    id: '3',
    name: 'Practice follow-up',
    city: 'Sample only',
    rating: 5,
    text: 'SmileVisionPro AI works best when paired with fast patient follow-up and a clear consultation booking path.',
    service: 'Treatment planning',
  },
];

export function Testimonials({ clinicBranding }: TestimonialsProps) {
  const testimonials = clinicBranding?.testimonials?.length ? clinicBranding.testimonials : sampleTestimonials;
  const usingSampleContent = !clinicBranding?.testimonials?.length;

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-full mb-4 text-amber-700 text-sm font-medium">
            <ShieldCheck className="w-4 h-4" />
            {usingSampleContent ? 'Sample content — replace before publishing' : 'Published patient testimonials'}
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-950 mb-4">Social proof section</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Keep only real, approved testimonials on the public site. If you do not have them yet, clearly mark the content as sample data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {testimonials.map((testimonial: any) => (
            <div key={testimonial.id || testimonial.name} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-slate-700 leading-relaxed mb-5">“{testimonial.text}”</p>
              <div>
                <p className="font-semibold text-slate-950">{testimonial.name}</p>
                <p className="text-sm text-slate-500">{testimonial.city || testimonial.location}</p>
                <p className="text-sm text-cyan-700 mt-1">{testimonial.service || 'Approved testimonial'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
