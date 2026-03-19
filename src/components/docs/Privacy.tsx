import React, { useEffect } from 'react';

export function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Privacy Policy - SmileVisionPro AI';
  }, []);

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
      lineHeight: 1.8,
      color: '#333',
      maxWidth: '900px',
      margin: '0 auto',
      padding: '40px 20px',
      background: '#f9fafb',
      minHeight: '100vh'
    }}>
      <div style={{
        background: 'white',
        padding: '60px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ color: '#0EA5E9', marginBottom: '10px' }}>Privacy Policy</h1>
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Effective Date: January 22, 2026</p>
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Last Updated: January 22, 2026</p>

        <Section title="1. Introduction">
          <p>
            Welcome to SmileVisionPro AI ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered smile transformation service.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect the following types of information:</p>
          
          <h3>2.1 Personal Information</h3>
          <ul>
            <li>Name (first and last name)</li>
            <li>Email address</li>
            <li>Phone number</li>
            <li>Service interests and preferences</li>
            <li>Notes and concerns you provide</li>
          </ul>

          <h3>2.2 Images and Videos</h3>
          <ul>
            <li>Smile photographs you upload</li>
            <li>AI-generated transformed images</li>
            <li>AI-generated smile videos</li>
          </ul>

          <h3>2.3 Technical Information</h3>
          <ul>
            <li>IP address</li>
            <li>Browser type and version</li>
            <li>Device information</li>
            <li>Usage data and analytics</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use your information for the following purposes:</p>
          <ul>
            <li><strong>AI Processing:</strong> To generate smile transformations and videos using advanced AI technology</li>
            <li><strong>Lead Management:</strong> To create and manage your contact record in secure practice CRM</li>
            <li><strong>Communication:</strong> To send you your transformation results and follow-up information</li>
            <li><strong>Service Improvement:</strong> To improve our AI models and service quality</li>
            <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing and Disclosure">
          <p>We may share your information with:</p>
          
          <h3>4.1 Service Providers</h3>
          <ul>
            <li><strong>Connected CRM:</strong> For CRM and contact management</li>
            <li><strong>AI Service Providers:</strong> For image processing and enhancement</li>
            <li><strong>Video Services:</strong> For video generation and hosting</li>
          </ul>

          <h3>4.2 Dental Practices</h3>
          <p>
            If you use this service through a dental practice's installation, your information will be shared with that practice for follow-up and consultation purposes.
          </p>

          <h3>4.3 Legal Requirements</h3>
          <p>
            We may disclose your information if required by law, court order, or governmental regulation.
          </p>
        </Section>

        <Section title="5. Data Storage and Security">
          <p>We implement appropriate security measures to protect your data:</p>
          <ul>
            <li>Encrypted data transmission (SSL/TLS)</li>
            <li>Secure cloud storage with industry-standard providers</li>
            <li>Access controls and authentication</li>
            <li>Regular security audits and updates</li>
          </ul>

          <p>
            <strong>Data Retention:</strong> We retain your personal data and images for as long as necessary to provide our services and comply with legal obligations. Videos and images are hosted by third-party services and subject to their retention policies.
          </p>
        </Section>

        <Section title="6. Your Rights">
          <p>You have the following rights regarding your personal data:</p>
          <ul>
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
            <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data</li>
            <li><strong>Objection:</strong> Object to processing of your personal data</li>
            <li><strong>Portability:</strong> Request transfer of your data to another service</li>
            <li><strong>Withdrawal:</strong> Withdraw consent at any time</li>
          </ul>

          <p>To exercise these rights, contact us at: <a href="mailto:privacy@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none' }}>privacy@smilevisionpro.ai</a></p>
        </Section>

        <Section title="7. AI-Generated Content Disclaimer">
          <p>
            The AI-generated images and videos are <strong>simulations for visualization purposes only</strong>. They do not represent guaranteed dental treatment outcomes. Actual results may vary based on individual dental health, treatment chosen, and other factors. Always consult with a licensed dental professional.
          </p>
        </Section>

        <Section title="8. Cookies and Tracking">
          <p>We use cookies and similar technologies to:</p>
          <ul>
            <li>Remember your preferences</li>
            <li>Analyze site usage and performance</li>
            <li>Provide personalized content</li>
          </ul>
          <p>You can control cookies through your browser settings.</p>
        </Section>

        <Section title="9. Children's Privacy">
          <p>
            Our service is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.
          </p>
        </Section>

        <Section title="10. International Data Transfers">
          <p>
            Your information may be transferred to and processed in countries other than your country of residence. These countries may have different data protection laws. By using our service, you consent to such transfers.
          </p>
        </Section>

        <Section title="11. Third-Party Links">
          <p>
            Our service may contain links to third-party websites. We are not responsible for the privacy practices of these websites. We encourage you to read their privacy policies.
          </p>
        </Section>

        <Section title="12. Changes to This Privacy Policy">
          <p>
            We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
          </p>
        </Section>

        <Section title="13. Contact Us">
          <p>If you have questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:privacy@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none' }}>privacy@smilevisionpro.ai</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none' }}>support@smilevisionpro.ai</a></li>
          </ul>
        </Section>

        <Section title="14. Consent">
          <p>
            By using SmileVisionPro AI, you consent to this Privacy Policy and agree to its terms.
          </p>
        </Section>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9em' }}>
          © 2026 SmileVisionPro AI - All Rights Reserved<br />
          <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Back to App</a> | <a href="/terms" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Terms of Service</a>
        </p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <h2 style={{
        color: '#1e293b',
        marginTop: '40px',
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '2px solid #e5e7eb'
      }}>
        {title}
      </h2>
      {children}
    </>
  );
}