import { Mail, Phone } from 'lucide-react';
import { ClinicBranding } from '../App';

interface FooterProps {
  clinicBranding?: ClinicBranding;
}

export function Footer({ clinicBranding }: FooterProps) {
  const contactInfo = clinicBranding?.contactInfo || {};

  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <p className="text-2xl font-semibold">SmileVisionPro AI</p>
          <p className="mt-4 text-slate-300 max-w-xl">
            White-label smile preview software for dental practices: lead capture, secure AI image generation, optional video creation, and staff follow-up.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Public pages</h3>
          <ul className="space-y-2 text-slate-300 text-sm">
            <li><a href="/" className="hover:text-cyan-300">Home</a></li>
            <li><a href="/support" className="hover:text-cyan-300">Support</a></li>
            <li><a href="/privacy" className="hover:text-cyan-300">Privacy</a></li>
            <li><a href="/terms" className="hover:text-cyan-300">Terms</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Contact</h3>
          <div className="space-y-3 text-sm text-slate-300">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-cyan-300" /> {contactInfo.email || 'support@smilevisionpro.ai'}</p>
            {contactInfo.phone && <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-cyan-300" /> {contactInfo.phone}</p>}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row gap-3 justify-between text-xs text-slate-400">
          <p>© 2026 SmileVisionPro AI. All rights reserved.</p>
          <p>AI previews are simulations for consultation and education only.</p>
        </div>
      </div>

    </footer>
  );
}
