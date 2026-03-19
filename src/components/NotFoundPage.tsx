import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from './ui/button';

export function NotFoundPage({
  title = 'Page not found',
  description = 'The page you requested is not available on the public SmileVisionPro AI site.',
}: {
  title?: string;
  description?: string;
}) {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 mb-6">
          <ShieldAlert className="h-4 w-4 text-cyan-300" />
          SmileVisionPro AI
        </div>
        <h1 className="text-4xl font-semibold mb-4">{title}</h1>
        <p className="text-slate-300 mb-8">{description}</p>
        <Button asChild className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold">
          <a href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return home
          </a>
        </Button>
      </div>
    </main>
  );
}
