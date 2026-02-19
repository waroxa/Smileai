import React, { useEffect } from 'react';

export function SetupGuide() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Setup Guide - SmileVisionPro AI';
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      lineHeight: 1.6,
      color: '#333',
      background: '#f9fafb',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)',
        color: 'white',
        padding: '60px 20px',
        textAlign: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>🦷 SmileVisionPro AI</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '10px' }}>Complete Setup & Documentation</p>
      </header>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Quick Start */}
        <Card>
          <h2>🚀 Quick Start (3 Steps)</h2>
          
          <Step number={1} title="Get Your GHL Credentials">
            <p><strong>API Key:</strong> GoHighLevel → Settings → API → Create API Key</p>
            <p><strong>Location ID:</strong> GoHighLevel → Settings → Business Profile → Location ID</p>
          </Step>

          <Step number={2} title="Enter Credentials in App">
            <p>Go to Staff Login → Settings → Integration Tab</p>
            <p>Paste your API Key and Location ID, then click "Save Settings"</p>
          </Step>

          <Step number={3} title="Create Custom Fields in GHL">
            <p>Navigate to: Settings → Custom Fields → Contact Fields</p>
            <p>Create these 5 fields (see table below)</p>
          </Step>
        </Card>

        {/* Custom Fields */}
        <Card>
          <h2>📋 Required Custom Fields</h2>
          <p>Create these custom fields in GoHighLevel to store all lead data:</p>
          
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            margin: '20px 0'
          }}>
            <thead>
              <tr>
                <Th>Field Name</Th>
                <Th>Field Type</Th>
                <Th>Purpose</Th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <Td><Code>service_interest</Code></Td>
                <Td>Dropdown</Td>
                <Td>Services customer is interested in</Td>
              </tr>
              <tr>
                <Td><Code>transformation_status</Code></Td>
                <Td>Text</Td>
                <Td>Current transformation status</Td>
              </tr>
              <tr>
                <Td><Code>before_image_url</Code></Td>
                <Td>Text or URL</Td>
                <Td>Original smile photo URL</Td>
              </tr>
              <tr>
                <Td><Code>after_image_url</Code></Td>
                <Td>Text or URL</Td>
                <Td>AI-enhanced smile photo URL</Td>
              </tr>
              <tr>
                <Td><Code>smile_video_url</Code></Td>
                <Td>Text or URL</Td>
                <Td><strong>Video transformation URL</strong></Td>
              </tr>
            </tbody>
          </table>

          <Warning>
            <strong>⚠️ Important:</strong> The <Code>smile_video_url</Code> field is crucial for accessing patient videos!
          </Warning>
        </Card>

        {/* Video Integration */}
        <Card>
          <h2>🎥 Video Integration</h2>
          <p>SmileVisionPro AI generates animated smile transformation videos. Here's how they're saved:</p>

          <h3>Where Videos Are Stored:</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <ChecklistItem><strong>Custom Field:</strong> <Code>smile_video_url</Code> contains the direct video link</ChecklistItem>
            <ChecklistItem><strong>Contact Notes:</strong> A note is added with a clickable video link and description</ChecklistItem>
            <ChecklistItem><strong>Status Updated:</strong> Contact status changes to "Complete - Video Generated"</ChecklistItem>
          </ul>

          <h3>Accessing Videos:</h3>
          <p><strong>Option 1:</strong> Open contact → Custom Fields → Click <Code>smile_video_url</Code></p>
          <p><strong>Option 2:</strong> Open contact → Notes tab → Look for "🎥 AI Smile Video Generated!"</p>

          <Success>
            <strong>✅ Pro Tip:</strong> Set up a workflow that triggers when <Code>smile_video_url</Code> is populated to automatically send follow-up emails!
          </Success>
        </Card>

        {/* Data Flow */}
        <Card>
          <h2>📊 How It Works</h2>
          
          <h3>Customer Journey:</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Landing Page:</strong> Customer fills out contact form</li>
            <li style={{ marginBottom: '10px' }}><strong>Contact Created:</strong> Automatically added to GHL with tags</li>
            <li style={{ marginBottom: '10px' }}><strong>Photo Upload:</strong> Customer uploads their smile photo</li>
            <li style={{ marginBottom: '10px' }}><strong>AI Transformation:</strong> System generates enhanced smile</li>
            <li style={{ marginBottom: '10px' }}><strong>Video Generation:</strong> Animated video created (optional)</li>
            <li style={{ marginBottom: '10px' }}><strong>Data Synced:</strong> All images & videos saved to GHL contact</li>
            <li style={{ marginBottom: '10px' }}><strong>Automation:</strong> Your workflows trigger for follow-up</li>
          </ol>

          <h3>Data Saved to Each Contact:</h3>
          <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
            <ChecklistItem>Full Name (split into first/last)</ChecklistItem>
            <ChecklistItem>Email Address</ChecklistItem>
            <ChecklistItem>Phone Number</ChecklistItem>
            <ChecklistItem>Service Interest (Veneers, Invisalign, Whitening, etc.)</ChecklistItem>
            <ChecklistItem>Notes/Concerns</ChecklistItem>
            <ChecklistItem>Before/After Image URLs</ChecklistItem>
            <ChecklistItem>Video URL (if generated)</ChecklistItem>
            <ChecklistItem>Tags: "smile-transformation", "ai-lead"</ChecklistItem>
          </ul>
        </Card>

        {/* Workflows */}
        <Card>
          <h2>🔄 Recommended Workflows</h2>

          <h3>Workflow 1: New Lead Welcome</h3>
          <WorkflowBox>
            <p><strong>Trigger:</strong> Tag added "smile-transformation"</p>
            <p><strong>Actions:</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Wait 2 minutes</li>
              <li>Send welcome email</li>
              <li>Send SMS with booking link</li>
            </ul>
          </WorkflowBox>

          <h3>Workflow 2: Video Generated Follow-Up</h3>
          <WorkflowBox>
            <p><strong>Trigger:</strong> Custom field <Code>smile_video_url</Code> is not empty</p>
            <p><strong>Actions:</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Send email: "Your Smile Video is Ready! 😁"</li>
              <li>Include video link from custom field</li>
              <li>Add to "Hot Leads" pipeline</li>
              <li>Assign to sales team</li>
            </ul>
          </WorkflowBox>

          <h3>Workflow 3: Follow-Up Sequence</h3>
          <WorkflowBox>
            <p><strong>Trigger:</strong> Custom field <Code>transformation_status</Code> = "Complete - Video Generated"</p>
            <p><strong>Actions:</strong></p>
            <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
              <li>Day 1: Email - "See Your Beautiful New Smile"</li>
              <li>Day 3: SMS - "Ready to make it real?"</li>
              <li>Day 7: Call task - "Schedule consultation"</li>
            </ul>
          </WorkflowBox>
        </Card>

        {/* Troubleshooting */}
        <Card>
          <h2>🔧 Troubleshooting</h2>
          
          <h3>Contacts not being created in GHL?</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Verify API Key and Location ID are correct in Settings</li>
            <li>Check API key has "contacts.write" permission</li>
            <li>Make sure Location ID matches your active location</li>
          </ul>

          <h3>Videos not appearing in custom fields?</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Confirm <Code>smile_video_url</Code> field exists in GHL</li>
            <li>Field name must be exact (no spaces, lowercase)</li>
            <li>Check field type is "Text" or "URL"</li>
          </ul>

          <h3>Images not uploading?</h3>
          <ul style={{ paddingLeft: '20px' }}>
            <li>Check file size (max 10MB recommended)</li>
            <li>Supported formats: JPG, PNG, WEBP</li>
            <li>Try a different browser if issues persist</li>
          </ul>
        </Card>

        {/* Quick Links */}
        <div style={{ margin: '30px 0', textAlign: 'center' }}>
          <a href="/getting-started" className="btn" style={btnStyle}>🚀 Getting Started</a>
          <a href="/support" className="btn" style={btnStyle}>💬 Get Support</a>
          <a href="/" className="btn" style={btnStyle}>🏠 Back to App</a>
        </div>

        {/* Footer */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          marginTop: '40px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          <p><strong>SmileVisionPro AI</strong></p>
          <p style={{ marginTop: '10px', fontSize: '0.9em' }}>© 2026 All Rights Reserved</p>
        </div>
      </div>
    </div>
  );
}

// Helper Components
function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white',
      padding: '30px',
      marginBottom: '30px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      {children}
    </div>
  );
}

function Step({ number, title, children }: { number: number; title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: '#f0f9ff',
      borderLeft: '4px solid #0EA5E9',
      padding: '20px',
      margin: '20px 0'
    }}>
      <h3>
        <span style={{
          display: 'inline-block',
          background: '#0EA5E9',
          color: 'white',
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          textAlign: 'center',
          lineHeight: '30px',
          fontWeight: 'bold',
          marginRight: '10px'
        }}>
          {number}
        </span>
        {title}
      </h3>
      <div style={{ marginTop: '10px' }}>
        {children}
      </div>
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: '#1e293b',
      color: '#10b981',
      padding: '2px 8px',
      borderRadius: '4px',
      fontSize: '0.9em'
    }}>
      {children}
    </code>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #e5e7eb',
      background: '#f3f4f6',
      fontWeight: 600
    }}>
      {children}
    </th>
  );
}

function Td({ children }: { children: React.ReactNode }) {
  return (
    <td style={{
      padding: '12px',
      textAlign: 'left',
      borderBottom: '1px solid #e5e7eb'
    }}>
      {children}
    </td>
  );
}

function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#fef3c7',
      borderLeft: '4px solid #f59e0b',
      padding: '15px',
      margin: '20px 0'
    }}>
      {children}
    </div>
  );
}

function Success({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#d1fae5',
      borderLeft: '4px solid #10b981',
      padding: '15px',
      margin: '20px 0'
    }}>
      {children}
    </div>
  );
}

function ChecklistItem({ children }: { children: React.ReactNode }) {
  return (
    <li style={{
      padding: '10px 0',
      paddingLeft: '30px',
      position: 'relative'
    }}>
      <span style={{
        position: 'absolute',
        left: 0,
        content: '✅'
      }}>✅</span>
      {children}
    </li>
  );
}

function WorkflowBox({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      background: '#f9fafb',
      padding: '15px',
      borderRadius: '8px',
      margin: '10px 0'
    }}>
      {children}
    </div>
  );
}

const btnStyle = {
  display: 'inline-block',
  background: '#0EA5E9',
  color: 'white',
  padding: '12px 24px',
  textDecoration: 'none',
  borderRadius: '8px',
  fontWeight: 600,
  margin: '10px'
};