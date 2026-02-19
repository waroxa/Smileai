import React, { useEffect } from 'react';

export function Support() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Support - SmileVisionPro AI';
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      lineHeight: 1.6,
      color: '#333',
      background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '700px',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>🦷 SmileVisionPro AI</h1>
          <p>Customer Support & Help Center</p>
        </header>

        {/* Content */}
        <div style={{ padding: '40px' }}>
          <h2 style={{ color: '#0EA5E9', margin: '30px 0 20px' }}>📞 Contact Support</h2>
          <p>Need help with setup, troubleshooting, or have questions? We're here for you!</p>

          {/* Email Support */}
          <ContactMethod 
            icon="📧"
            title="Email Support"
            link="mailto:support@smilevisionpro.ai"
            linkText="support@smilevisionpro.ai"
            description="Response within 24 hours"
          />

          {/* Documentation */}
          <ContactMethod 
            icon="📚"
            title="Documentation"
            link="/setup-guide"
            linkText="Complete Setup Guide"
            description="Step-by-step instructions"
          />

          {/* Live Chat */}
          <ContactMethod 
            icon="💬"
            title="Live Chat"
            link="https://help.smilevisionpro.ai"
            linkText="help.smilevisionpro.ai"
            description="Available during business hours"
          />

          {/* Support Hours */}
          <div style={{
            background: '#fef3c7',
            borderLeft: '4px solid #f59e0b',
            padding: '15px',
            margin: '20px 0',
            borderRadius: '8px'
          }}>
            <strong>⏰ Support Hours:</strong><br />
            Monday - Friday: 9:00 AM - 6:00 PM EST<br />
            Saturday: 10:00 AM - 2:00 PM EST<br />
            Sunday: Closed
          </div>

          {/* FAQ Section */}
          <h2 style={{ color: '#0EA5E9', margin: '30px 0 20px' }}>❓ Common Questions</h2>
          
          <div style={{ margin: '30px 0' }}>
            <FAQItem 
              question="Q: How do I get my GHL API credentials?"
              answer="Go to GoHighLevel → Settings → API → Create API Key. Copy the key and your Location ID from Settings → Business Profile."
            />
            <FAQItem 
              question="Q: Where are the videos saved in GHL?"
              answer='Videos are saved in two places: (1) Custom field "smile_video_url" and (2) Contact Notes with a clickable link.'
            />
            <FAQItem 
              question="Q: What custom fields do I need?"
              answer="You need 5 custom fields: service_interest, transformation_status, before_image_url, after_image_url, and smile_video_url. See the setup guide for details."
            />
            <FAQItem 
              question="Q: Why aren't contacts being created in GHL?"
              answer="Check that your API Key and Location ID are correctly saved in Settings → Integration. Verify your API key has contacts.write permission."
            />
            <FAQItem 
              question="Q: How long does video generation take?"
              answer="Video generation typically takes 3-5 minutes. The customer will see a progress indicator while the video is being created."
            />
            <FAQItem 
              question="Q: Can I customize the branding?"
              answer="Yes! Go to Staff Login → Settings → Branding to customize your clinic name, colors, logo, and more."
            />
          </div>

          {/* Resources */}
          <h2 style={{ color: '#0EA5E9', margin: '30px 0 20px' }}>📖 Resources</h2>
          <div style={{ margin: '20px 0' }}>
            <a href="/setup-guide" className="btn" style={{
              display: 'inline-block',
              background: '#0EA5E9',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              margin: '10px 10px 10px 0',
              textAlign: 'center'
            }}>📚 Setup Guide</a>
            <a href="/" className="btn" style={{
              display: 'inline-block',
              background: '#0EA5E9',
              color: 'white',
              padding: '12px 24px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              margin: '10px 10px 10px 0',
              textAlign: 'center'
            }}>🏠 Back to App</a>
          </div>

          {/* Priority Support */}
          <div style={{
            background: '#f0f9ff',
            borderLeft: '4px solid #0EA5E9',
            padding: '20px',
            margin: '20px 0',
            borderRadius: '8px'
          }}>
            <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>🚀 Need Priority Support?</h3>
            <p>For urgent issues or enterprise support, please email us at <strong>priority@smilevisionpro.ai</strong> with "URGENT" in the subject line.</p>
          </div>
        </div>

        {/* Footer */}
        <footer style={{
          background: 'white',
          padding: '30px',
          marginTop: '40px',
          borderRadius: '12px',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p><strong>SmileVisionPro AI</strong></p>
          <p style={{ marginTop: '10px' }}>© 2026 All Rights Reserved</p>
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>Powered by Advanced AI Technology</p>
        </footer>
      </div>
    </div>
  );
}

// Helper Components
function ContactMethod({ icon, title, link, linkText, description }: {
  icon: string;
  title: string;
  link: string;
  linkText: string;
  description: string;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      padding: '15px',
      background: 'white',
      borderRadius: '8px',
      margin: '15px 0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ fontSize: '2rem' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', color: '#1e293b', marginBottom: '5px' }}>{title}</strong>
        <a href={link} style={{ color: '#0EA5E9', textDecoration: 'none', fontWeight: 600 }}>{linkText}</a>
        <p style={{ fontSize: '0.9em', color: '#64748b', marginTop: '5px' }}>{description}</p>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div style={{
      background: '#f9fafb',
      padding: '15px',
      margin: '10px 0',
      borderRadius: '8px',
      borderLeft: '3px solid #0EA5E9'
    }}>
      <strong style={{ color: '#1e293b', display: 'block', marginBottom: '8px' }}>{question}</strong>
      <p>{answer}</p>
    </div>
  );
}