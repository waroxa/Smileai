import React, { useEffect } from 'react';

export function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Terms of Service - SmileVisionPro AI';
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
        <h1 style={{ color: '#0EA5E9', marginBottom: '10px' }}>Terms of Service</h1>
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Effective Date: January 22, 2026</p>
        <p style={{ color: '#64748b', fontStyle: 'italic' }}>Last Updated: January 22, 2026</p>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using SmileVisionPro AI ("Service," "we," "our," or "us"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use our Service.
          </p>
        </Section>

        <Section title="2. Description of Service">
          <p>
            SmileVisionPro AI is an AI-powered smile transformation tool that:
          </p>
          <ul>
            <li>Generates enhanced smile visualizations using artificial intelligence</li>
            <li>Creates animated smile transformation videos</li>
            <li>Captures and manages lead information for dental practices</li>
            <li>Integrates with secure practice CRM for contact management</li>
          </ul>

          <ImportantBox>
            <strong>⚠️ IMPORTANT DISCLAIMER:</strong> The AI-generated images and videos are <strong>simulations for visualization purposes only</strong>. They do NOT represent guaranteed dental treatment outcomes. Actual results depend on individual dental health, treatment type, and professional expertise. Always consult a licensed dental professional before making treatment decisions.
          </ImportantBox>
        </Section>

        <Section title="3. User Eligibility">
          <p>
            You must be at least 18 years old to use this Service. By using our Service, you represent and warrant that you meet this age requirement.
          </p>
        </Section>

        <Section title="4. User Responsibilities">
          <p>When using our Service, you agree to:</p>
          <ul>
            <li>Provide accurate and complete information</li>
            <li>Upload only photos that you own or have permission to use</li>
            <li>Not upload inappropriate, offensive, or illegal content</li>
            <li>Not attempt to circumvent security features</li>
            <li>Not use the Service for any unlawful purpose</li>
            <li>Not misrepresent AI-generated content as professional medical advice</li>
          </ul>
        </Section>

        <Section title="5. Intellectual Property Rights">
          <h3>5.1 Service Content</h3>
          <p>
            All content, features, and functionality of the Service (including but not limited to text, graphics, logos, and software) are owned by SmileVisionPro AI or its licensors and are protected by copyright, trademark, and other intellectual property laws.
          </p>

          <h3>5.2 User-Uploaded Content</h3>
          <p>
            You retain ownership of photos you upload. However, by uploading content, you grant us a worldwide, non-exclusive, royalty-free license to use, store, display, reproduce, and process your content solely for the purpose of providing our Service.
          </p>

          <h3>5.3 AI-Generated Content</h3>
          <p>
            AI-generated images and videos are provided for your personal use only. You may share them for consultation purposes but may not use them for commercial purposes without written permission.
          </p>
        </Section>

        <Section title="6. Privacy and Data Protection">
          <p>
            Your use of the Service is also governed by our <a href="/privacy" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Privacy Policy</a>. By using the Service, you consent to our collection and use of your information as described in the Privacy Policy.
          </p>
        </Section>

        <Section title="7. Medical Disclaimer">
          <ImportantBox>
            <p><strong>NOT MEDICAL ADVICE:</strong></p>
            <ul>
              <li>This Service is NOT a substitute for professional dental advice, diagnosis, or treatment</li>
              <li>AI-generated transformations are simulations and do not guarantee actual treatment results</li>
              <li>Always seek the advice of a qualified dentist or dental professional</li>
              <li>Never disregard professional medical advice based on AI-generated content</li>
              <li>Dental procedures carry risks - discuss with your dentist before proceeding</li>
            </ul>
          </ImportantBox>
        </Section>

        <Section title="8. Third-Party Services">
          <p>Our Service uses third-party providers:</p>
          <ul>
            <li><strong>AI Technology:</strong> Advanced AI for image processing</li>
            <li><strong>Video Services:</strong> For video generation and hosting</li>
            <li><strong>Connected CRM:</strong> CRM and contact management</li>
          </ul>
          <p>
            These services have their own terms and privacy policies. We are not responsible for their practices or content.
          </p>
        </Section>

        <Section title="9. Service Availability">
          <p>
            We strive to provide reliable service, but we do not guarantee that:
          </p>
          <ul>
            <li>The Service will be uninterrupted or error-free</li>
            <li>Results will meet your expectations</li>
            <li>All features will always be available</li>
            <li>AI-generated content will be accurate or realistic</li>
          </ul>
          <p>
            We reserve the right to modify, suspend, or discontinue the Service at any time without notice.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY LAW:
          </p>
          <ul>
            <li>We are not liable for any indirect, incidental, special, or consequential damages</li>
            <li>We are not liable for decisions made based on AI-generated content</li>
            <li>Our total liability shall not exceed the amount you paid for the Service (if any)</li>
            <li>We are not responsible for dental treatment outcomes or complications</li>
          </ul>
        </Section>

        <Section title="11. Indemnification">
          <p>
            You agree to indemnify and hold harmless SmileVisionPro AI and its affiliates from any claims, damages, or expenses arising from:
          </p>
          <ul>
            <li>Your use of the Service</li>
            <li>Your violation of these Terms</li>
            <li>Your violation of any third-party rights</li>
            <li>Content you upload to the Service</li>
          </ul>
        </Section>

        <Section title="12. Pricing and Payment">
          <p>
            The Service may be offered for free or with paid features. Pricing is subject to change. If you purchase paid features:
          </p>
          <ul>
            <li>All fees are non-refundable unless otherwise stated</li>
            <li>You authorize us to charge your payment method</li>
            <li>You are responsible for all taxes</li>
          </ul>
        </Section>

        <Section title="13. Termination">
          <p>
            We reserve the right to terminate or suspend your access to the Service:
          </p>
          <ul>
            <li>For violation of these Terms</li>
            <li>For fraudulent or illegal activity</li>
            <li>At our discretion for any reason</li>
          </ul>
          <p>
            Upon termination, your right to use the Service ceases immediately.
          </p>
        </Section>

        <Section title="14. Connected Practice Integration">
          <p>
            If you use this Service through a connected CRM installation:
          </p>
          <ul>
            <li>Your data will be shared with the dental practice that installed the app</li>
            <li>The practice's privacy policy also applies to your data</li>
            <li>any connected practice CRM provider's terms of service also apply</li>
            <li>Contact the practice directly for data deletion requests</li>
          </ul>
        </Section>

        <Section title="15. Changes to Terms">
          <p>
            We may revise these Terms at any time. Material changes will be posted on this page with an updated "Last Updated" date. Continued use of the Service after changes constitutes acceptance of the new Terms.
          </p>
        </Section>

        <Section title="16. Governing Law">
          <p>
            These Terms are governed by the laws of the United States, without regard to conflict of law principles. Any disputes shall be resolved in the courts of [Your Jurisdiction].
          </p>
        </Section>

        <Section title="17. Dispute Resolution">
          <p>
            Any disputes arising from these Terms or your use of the Service shall be resolved through:
          </p>
          <ul>
            <li>Good faith negotiation</li>
            <li>Mediation (if negotiation fails)</li>
            <li>Binding arbitration (if mediation fails)</li>
          </ul>
        </Section>

        <Section title="18. Severability">
          <p>
            If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force and effect.
          </p>
        </Section>

        <Section title="19. Entire Agreement">
          <p>
            These Terms, together with our Privacy Policy, constitute the entire agreement between you and SmileVisionPro AI regarding the Service.
          </p>
        </Section>

        <Section title="20. Contact Information">
          <p>For questions about these Terms, contact us:</p>
          <ul>
            <li><strong>Email:</strong> <a href="mailto:legal@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none' }}>legal@smilevisionpro.ai</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@smilevisionpro.ai" style={{ color: '#0EA5E9', textDecoration: 'none' }}>support@smilevisionpro.ai</a></li>
          </ul>
        </Section>

        <Section title="21. Acknowledgment">
          <p>
            BY USING SMILEVISIONPRO AI, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE.
          </p>
        </Section>

        <hr style={{ margin: '40px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
        
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9em' }}>
          © 2026 SmileVisionPro AI - All Rights Reserved<br />
          <a href="/" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Back to App</a> | <a href="/privacy" style={{ color: '#0EA5E9', textDecoration: 'none' }}>Privacy Policy</a>
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

function ImportantBox({ children }: { children: React.ReactNode }) {
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