import { ArrowRight, Shield, Sparkles, Wand2 } from 'lucide-react';
import { Button } from './ui/button';
import { ClinicBranding } from '../App';

interface HeroProps {
  clinicBranding: ClinicBranding;
}

const summaryStats = [
  { label: 'Guided journey', value: '4 steps' },
  { label: 'Preview turnaround', value: 'About 30 sec' },
  { label: 'Delivery', value: 'Photo + optional video' },
];

export function Hero({ clinicBranding }: HeroProps) {
  const scrollToTransform = () => {
    document.getElementById('smile-transform')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.16),_transparent_40%),linear-gradient(180deg,_#f8fdff,_#ffffff_45%,_#f8fafc)]">
      <nav className="relative z-10 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {clinicBranding.logo ? (
              <img src={clinicBranding.logo} alt={clinicBranding.clinicName} className="w-11 h-11 object-contain rounded-xl" />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5" />
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-slate-950">SmileVisionPro AI</p>
              <p className="text-xs text-slate-500">White-label smile preview platform</p>
            </div>
          </div>

          <Button onClick={scrollToTransform} className="bg-slate-950 hover:bg-slate-800 text-white">
            Start preview
          </Button>
        </div>
      </nav>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-14 lg:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm mb-6">
              <Shield className="w-4 h-4 text-cyan-600" />
              Secure patient intake, AI preview, and follow-up in one flow
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-950 leading-tight">
              Show patients a confident new smile before they book.
            </h1>
            <p className="mt-6 text-lg text-slate-600 max-w-2xl">
              SmileVisionPro AI captures the lead, transforms the smile photo with AI, and can generate a short cinematic preview video for follow-up.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button onClick={scrollToTransform} size="lg" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white">
                Launch your preview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-slate-300 text-slate-900"
              >
                See the workflow
              </Button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {summaryStats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white/80 backdrop-blur p-4 shadow-sm">
                  <p className="text-2xl font-semibold text-slate-950">{stat.value}</p>
                  <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] overflow-hidden border border-slate-200 shadow-2xl bg-white">
              <img
                src={clinicBranding.heroImage || 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?w=1200&q=80'}
                alt="Smile preview experience"
                className="w-full h-[320px] sm:h-[420px] object-cover"
              />
            </div>

            <div className="absolute -bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-72 rounded-2xl bg-slate-950 text-white p-5 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-cyan-300" />
                </div>
                <div>
                  <p className="font-medium">Patient journey</p>
                  <p className="text-sm text-slate-300">Lead form → upload → AI preview → follow-up</p>
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Built for practices that want a polished, white-label consultation experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
