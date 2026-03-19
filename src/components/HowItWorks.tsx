import { Upload, Sparkles, Video, MessageSquareQuote } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Capture the lead',
      description: 'Visitors share their name, email, phone number, and treatment interest before they upload a photo.',
      color: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: Sparkles,
      title: 'Generate the preview',
      description: 'The image is sent to a secure backend that returns an AI smile transformation without shipping provider keys to the browser.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Video,
      title: 'Create an optional video',
      description: 'If video generation is configured, the transformed image is turned into a short cinematic smile reveal for follow-up.',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: MessageSquareQuote,
      title: 'Follow up with confidence',
      description: 'The practice reviews the submission, contacts the lead, and books the consultation from the internal workflow.',
      color: 'from-emerald-500 to-emerald-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-16 lg:py-20 px-6 lg:px-12 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan-50 border border-cyan-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span className="text-sm font-medium text-cyan-700">Guided user journey</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-950 mb-4">How SmileVisionPro AI works</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The experience is designed to feel simple for patients while keeping the sensitive automation and integrations on the backend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={step.title} className="relative rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="absolute top-4 right-4 text-xs font-semibold text-slate-400">0{index + 1}</div>
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg mb-5`}>
                <step.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-950 mb-3">{step.title}</h3>
              <p className="text-slate-600 leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
