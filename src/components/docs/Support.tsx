import React, { useEffect } from 'react';

const supportTopics = [
  {
    title: 'Lead capture issues',
    detail: 'Confirm that required form fields are completed and that your deployment can reach the secure backend endpoints.',
  },
  {
    title: 'Image generation issues',
    detail: 'Verify the backend image-generation secret is configured server-side and that uploaded files are JPG, PNG, or WEBP under 10 MB.',
  },
  {
    title: 'Video generation issues',
    detail: 'Check the configured video provider secret on the server and confirm outbound network access from your backend runtime.',
  },
  {
    title: 'Admin connection issues',
    detail: 'Keep private CRM/OAuth setup on a protected admin route only and confirm your callback URL matches the deployed admin URL.',
  },
];

export function Support() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Support - SmileVisionPro AI';
  }, []);

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-8 mb-8 shadow-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-cyan-50/80 mb-3">Support</p>
          <h1 className="text-4xl font-semibold mb-4">SmileVisionPro AI help center</h1>
          <p className="text-lg text-cyan-50/90 max-w-2xl">
            Use this page for public support information only. Keep private implementation details, credentials, and admin tools off the marketing site.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <SupportCard title="Email support" description="General product and deployment help." href="mailto:support@smilevisionpro.ai" linkText="support@smilevisionpro.ai" />
          <SupportCard title="Priority support" description="Escalations for production incidents." href="mailto:priority@smilevisionpro.ai" linkText="priority@smilevisionpro.ai" />
        </div>

        <section className="rounded-3xl bg-white text-slate-900 p-8 shadow-xl mb-8">
          <h2 className="text-2xl font-semibold mb-6">Common support topics</h2>
          <div className="grid gap-4">
            {supportTopics.map((topic) => (
              <div key={topic.title} className="rounded-2xl border border-slate-200 p-5">
                <h3 className="font-semibold mb-2">{topic.title}</h3>
                <p className="text-slate-600">{topic.detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-semibold mb-4">Public route reminder</h2>
          <p className="text-slate-300 mb-4">
            Recommended public routes: <code>/</code>, <code>/privacy</code>, <code>/terms</code>, and <code>/support</code>. Admin integrations and callbacks should stay protected.
          </p>
          <a href="/" className="inline-flex items-center rounded-xl bg-white text-slate-950 px-5 py-3 font-semibold hover:bg-slate-100">
            Return to the marketing site
          </a>
        </section>
      </div>
    </main>
  );
}

function SupportCard({ title, description, href, linkText }: { title: string; description: string; href: string; linkText: string }) {
  return (
    <a href={href} className="rounded-3xl bg-white text-slate-900 p-6 shadow-lg hover:-translate-y-0.5 transition-transform">
      <p className="text-sm font-medium text-cyan-700 mb-2">Contact channel</p>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-slate-600 mb-4">{description}</p>
      <span className="font-medium text-blue-700">{linkText}</span>
    </a>
  );
}
