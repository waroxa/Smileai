import React, { useEffect } from 'react';

export function GettingStarted() {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <div style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      lineHeight: 1.6,
      color: '#333',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
      padding: '20px',
      minHeight: '100vh'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
          color: 'white',
          padding: '30px',
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '30px',
          boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>🦷 Welcome to SmileVisionPro AI!</h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>Let's get you up and running in just 5 minutes</p>
        </div>

        {/* Step 1 */}
        <StepCard number={1} title="Get Your GHL Credentials">
          <p>First, you'll need two pieces of information from GoHighLevel:</p>
          
          <h4 style={{ color: '#1e293b', marginTop: '15px', marginBottom: '8px' }}>📌 API Key:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            <ChecklistItem>Go to GoHighLevel → Settings (⚙️)</ChecklistItem>
            <ChecklistItem>Click "API" in the left sidebar</ChecklistItem>
            <ChecklistItem>Click "Create API Key"</ChecklistItem>
            <ChecklistItem>Name it: "SmileVisionPro AI"</ChecklistItem>
            <ChecklistItem>Copy the API key (save it somewhere safe!)</ChecklistItem>
          </ul>

          <h4 style={{ color: '#1e293b', marginTop: '15px', marginBottom: '8px' }}>📍 Location ID:</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            <ChecklistItem>Go to Settings → Business Profile</ChecklistItem>
            <ChecklistItem>Find "Location ID" at the top</ChecklistItem>
            <ChecklistItem>Copy the Location ID</ChecklistItem>
          </ul>

          <InfoBox>
            <strong>💡 Tip:</strong> Keep these credentials handy - you'll need them in the next step!
          </InfoBox>
        </StepCard>

        {/* Step 2 */}
        <StepCard number={2} title="Configure SmileVisionPro AI">
          <p>Now let's connect your app to GoHighLevel:</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            <ChecklistItem>Open SmileVisionPro AI in a new tab</ChecklistItem>
            <ChecklistItem>Scroll to the footer and click "Staff Login"</ChecklistItem>
            <ChecklistItem>Click on "Settings" in the top navigation</ChecklistItem>
            <ChecklistItem>Go to the "Integration" tab</ChecklistItem>
            <ChecklistItem>Paste your API Key and Location ID</ChecklistItem>
            <ChecklistItem>Click "Save Settings"</ChecklistItem>
          </ul>

          <SuccessBox>
            <strong>✅ Success!</strong> You should see "Settings saved successfully!" message.
          </SuccessBox>
        </StepCard>

        {/* Step 3 */}
        <StepCard number={3} title="Create Custom Fields in GHL">
          <p>To store all the smile transformation data, create these 5 custom fields:</p>
          
          <p><strong>Navigate to:</strong> Settings → Custom Fields → Contact Fields → Add Field</p>

          <div style={{ background: '#f8fafc', padding: '15px', borderRadius: '8px', margin: '15px 0' }}>
            <h4 style={{ marginBottom: '10px' }}>Create these fields:</h4>
            
            <FieldItem name="service_interest (Dropdown)" description="Options: Veneers, Invisalign, Whitening, Implants, General Checkup" />
            <FieldItem name="transformation_status (Text)" description="Tracks: Pending, Processing, Complete" />
            <FieldItem name="before_image_url (Text or URL)" description="Stores the original smile photo" />
            <FieldItem name="after_image_url (Text or URL)" description="Stores the AI-enhanced smile photo" />
            <FieldItem name="smile_video_url (Text or URL) ⭐" description="IMPORTANT: Stores the animated video link" />
          </div>

          <InfoBox>
            <strong>⚠️ Important:</strong> Field names must match exactly (including underscores). Copy-paste them to avoid typos!
          </InfoBox>
        </StepCard>

        {/* Step 4 */}
        <StepCard number={4} title="Test Your Setup">
          <p>Let's make sure everything is working correctly:</p>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0' }}>
            <ChecklistItem>Go to your SmileVisionPro AI landing page</ChecklistItem>
            <ChecklistItem>Fill out the form with test information</ChecklistItem>
            <ChecklistItem>Submit the form</ChecklistItem>
            <ChecklistItem>Check GoHighLevel → Contacts</ChecklistItem>
            <ChecklistItem>Verify a new contact was created</ChecklistItem>
            <ChecklistItem>Upload a test photo and generate transformation</ChecklistItem>
            <ChecklistItem>Generate a test video (optional)</ChecklistItem>
            <ChecklistItem>Check that custom fields are populated</ChecklistItem>
          </ul>

          <SuccessBox>
            <strong>✅ Testing Complete!</strong> If you see the contact in GHL with all the data, you're all set!
          </SuccessBox>
        </StepCard>

        {/* Step 5 */}
        <StepCard number={5} title="Set Up Workflows (Optional)">
          <p>Automate your follow-up with these recommended workflows:</p>
          
          <WorkflowBox title="🔔 New Lead Welcome" trigger="Tag added 'smile-transformation'" actions="Send welcome email + SMS with booking link" />
          <WorkflowBox title="🎥 Video Generated Follow-Up" trigger='Custom field "smile_video_url" is not empty' actions='Send email with video link + Add to "Hot Leads" pipeline' />

          <InfoBox>
            <strong>💡 Pro Tip:</strong> Contacts with videos convert 3x better! Set up automation to follow up within 10 minutes of video generation.
          </InfoBox>
        </StepCard>

        {/* What's Next */}
        <div style={{ 
          background: 'white', 
          padding: '25px', 
          borderRadius: '12px', 
          marginBottom: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderLeft: '5px solid #10b981'
        }}>
          <h2 style={{ color: '#10b981', marginBottom: '15px' }}>🎉 You're All Set!</h2>
          <p style={{ marginBottom: '20px' }}>Here's what you can do now:</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', margin: '15px 0' }}>
            <FeatureCard icon="🎨" title="Customize Branding" description="Update colors, logo, clinic name" />
            <FeatureCard icon="👥" title="Manage Leads" description="View all submissions in dashboard" />
            <FeatureCard icon="📊" title="Track Performance" description="Monitor conversions in GHL" />
            <FeatureCard icon="🚀" title="Share Your Page" description="Start generating leads!" />
          </div>

          <div style={{ marginTop: '25px', textAlign: 'center' }}>
            <a href="/setup-guide" style={{ display: 'inline-block', background: '#0EA5E9', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, margin: '10px' }}>📚 Full Documentation</a>
            <a href="/support" style={{ display: 'inline-block', background: '#64748b', color: 'white', padding: '12px 24px', textDecoration: 'none', borderRadius: '8px', fontWeight: 600, margin: '10px' }}>💬 Get Support</a>
          </div>
        </div>

        {/* Quick Links */}
        <div style={{ background: 'white', padding: '20px', borderRadius: '12px', marginTop: '20px', textAlign: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>📚 Helpful Resources</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
            <a href="/setup-guide" style={{ color: '#0EA5E9', textDecoration: 'none', padding: '8px 16px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.9rem' }}>Complete Setup Guide</a>
            <a href="/support" style={{ color: '#0EA5E9', textDecoration: 'none', padding: '8px 16px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.9rem' }}>Support Center</a>
            <a href="mailto:support@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none', padding: '8px 16px', background: '#f0f9ff', borderRadius: '6px', fontSize: '0.9rem' }}>Email Support</a>
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '30px 20px', color: '#64748b' }}>
          <p style={{ fontSize: '0.9rem' }}>Need help? We're here for you! 💙</p>
          <p style={{ fontSize: '0.85rem', marginTop: '10px' }}>© 2026 SmileVisionPro AI - All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function StepCard({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '20px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      borderLeft: '5px solid #0EA5E9'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
        <div style={{
          background: '#0EA5E9',
          color: 'white',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.3rem',
          fontWeight: 'bold'
        }}>
          {number}
        </div>
        <div style={{ fontSize: '1.3rem', fontWeight: 600, color: '#1e293b' }}>{title}</div>
      </div>
      <div style={{ paddingLeft: '55px' }}>
        {children}
      </div>
    </div>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ padding: '8px 0', paddingLeft: '30px', position: 'relative', color: '#475569' }}>
      <span style={{ position: 'absolute', left: 0, color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
      {children}
    </li>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#fef3c7', borderLeft: '4px solid #f59e0b', padding: '15px', margin: '15px 0', borderRadius: '6px' }}>
      {children}
    </div>
  );
}

function SuccessBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#d1fae5', borderLeft: '4px solid #10b981', padding: '15px', margin: '15px 0', borderRadius: '6px' }}>
      {children}
    </div>
  );
}

function FieldItem({ name, description }: { name: string; description: string }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ background: '#f1f5f9', color: '#1e293b', padding: '12px 16px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.9rem' }}>
        {name}
      </div>
      <small style={{ color: '#64748b' }}>{description}</small>
    </div>
  );
}

function WorkflowBox({ title, trigger, actions }: { title: string; trigger: string; actions: string }) {
  return (
    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '15px' }}>
      <h4 style={{ color: '#1e293b', marginBottom: '10px' }}>{title}</h4>
      <strong>Trigger:</strong> {trigger}<br />
      <strong>Actions:</strong> {actions}
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div style={{ background: '#f0f9ff', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{icon}</div>
      <div style={{ fontSize: '0.9rem', color: '#475569' }}>
        <strong>{title}</strong><br />
        {description}
      </div>
    </div>
  );
}