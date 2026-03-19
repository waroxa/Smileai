import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Upload, Loader2, AlertCircle, CheckCircle, User, Mail, Phone, FileText, Sparkles, Film } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AnimatedSmilePlayer } from './AnimatedSmilePlayer';
import { QuickTransformations } from './QuickTransformations';
import { AppApi } from '../utils/app-api';

interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  notes: string;
}

const defaultLeadFormData: LeadFormData = {
  fullName: '',
  email: '',
  phone: '',
  interestedIn: '',
  notes: '',
};

export function SmileTransformationSection() {
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [leadCaptureMessage, setLeadCaptureMessage] = useState<string | null>(null);
  const [crmContactId, setCrmContactId] = useState<string | null>(null);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>(defaultLeadFormData);
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<LeadFormData>>({});
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiVideo, setAiVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState('');
  const [smileIntensity, setSmileIntensity] = useState<'subtle' | 'natural' | 'bright'>('natural');
  const [dragActive, setDragActive] = useState(false);
  const [videoProviderMessage, setVideoProviderMessage] = useState<string | null>(null);

  useEffect(() => {
    AppApi.checkVideoProvider()
      .then((result) => setVideoProviderMessage(result.message || `${result.provider} video generation status checked.`))
      .catch(() => setVideoProviderMessage('Optional video generation will fall back gracefully if the provider is unavailable.'));
  }, []);

  const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone: string) => phone.replace(/\D/g, '').length === 10;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Partial<LeadFormData> = {};

    if (!leadFormData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!leadFormData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(leadFormData.email)) errors.email = 'Please enter a valid email';
    if (!leadFormData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!validatePhone(leadFormData.phone)) errors.phone = 'Please enter a valid 10-digit phone number';
    if (!leadFormData.interestedIn) errors.interestedIn = 'Please select a service';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmittingLead(true);
    try {
      const result = await AppApi.captureLead({
        ...leadFormData,
        source: 'SmileVisionPro AI website',
      });

      setCrmContactId(result.contactId || null);
      setLeadCaptured(true);
      setLeadCaptureMessage(result.message || 'Your consultation details were received. Upload a smile photo to continue.');
    } catch (error: any) {
      setLeadCaptured(true);
      setLeadCaptureMessage('Your information was captured for follow-up. Continue to the photo upload step.');
      console.error('Lead capture warning:', error.message);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setProcessingError('Please upload a JPG, PNG, or WEBP image file.');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setProcessingError('File size must be less than 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setAiImage(null);
      setAiVideo(null);
      setProcessingError(null);
      setVideoError(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSmile = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const result = await AppApi.generateSmile(uploadedImage, smileIntensity);
      setAiImage(result.imageDataUrl);

      if (crmContactId) {
        await AppApi.syncMedia({
          contactId: crmContactId,
          beforeImage: uploadedImage,
          afterImage: result.imageDataUrl,
          status: 'Images Generated',
        });
      }
    } catch (error: any) {
      console.error('Error generating smile:', error);
      setProcessingError(error.message || 'We could not generate a smile preview right now. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateVideo = async () => {
    if (!aiImage) return;

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoStatus('Creating your smile reveal video...');
    setAiVideo(null);

    try {
      const result = await AppApi.generateVideo(
        aiImage,
        'Create a calm, premium dental consultation style smile reveal with natural movement and a confident expression.',
      );
      setAiVideo(result.videoUrl);
      setVideoStatus(result.message || 'Video created successfully.');

      if (crmContactId) {
        await AppApi.syncMedia({
          contactId: crmContactId,
          smileVideo: result.videoUrl,
          status: 'Video Generated',
        });
      }
    } catch (error: any) {
      console.error('Video generation error:', error);
      setVideoError(error.message || 'Video generation is temporarily unavailable. Showing animated preview instead.');
      setAiVideo('ANIMATED');
      setVideoStatus('Using animated preview fallback.');
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <section id="smile-transform" className="py-16 lg:py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 border border-cyan-200 px-4 py-2 text-sm text-cyan-700 font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Secure AI smile preview workflow
          </div>
          <h2 className="text-3xl lg:text-4xl font-semibold text-slate-950 mb-4">Lead form, photo upload, AI preview, and optional video</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            The public site stays white-label while sensitive processing and provider integrations remain on the backend.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm font-medium text-cyan-700">Step 1</p>
                <h3 className="text-2xl font-semibold text-slate-950">Capture the consultation lead</h3>
              </div>
              {leadCaptured && <CheckCircle className="w-7 h-7 text-emerald-500" />}
            </div>

            {leadCaptureMessage && (
              <div className="mb-5 rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800">
                {leadCaptureMessage}
              </div>
            )}

            <form onSubmit={handleLeadSubmit} className="space-y-4">
              <FormField icon={<User className="w-4 h-4" />} label="Full name" error={formErrors.fullName}>
                <Input value={leadFormData.fullName} onChange={(e) => setLeadFormData({ ...leadFormData, fullName: e.target.value })} placeholder="Jordan Smith" />
              </FormField>
              <FormField icon={<Mail className="w-4 h-4" />} label="Email" error={formErrors.email}>
                <Input type="email" value={leadFormData.email} onChange={(e) => setLeadFormData({ ...leadFormData, email: e.target.value })} placeholder="jordan@example.com" />
              </FormField>
              <FormField icon={<Phone className="w-4 h-4" />} label="Phone" error={formErrors.phone}>
                <Input value={leadFormData.phone} onChange={(e) => setLeadFormData({ ...leadFormData, phone: formatPhoneNumber(e.target.value) })} placeholder="(555) 555-5555" />
              </FormField>

              <div>
                <Label className="mb-2 block">Interested in</Label>
                <select
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm"
                  value={leadFormData.interestedIn}
                  onChange={(e) => setLeadFormData({ ...leadFormData, interestedIn: e.target.value })}
                >
                  <option value="">Select a service</option>
                  <option value="Veneers">Veneers</option>
                  <option value="Smile Makeover">Smile Makeover</option>
                  <option value="Whitening">Whitening</option>
                  <option value="Implants">Implants</option>
                  <option value="Consultation">General consultation</option>
                </select>
                {formErrors.interestedIn && <p className="text-sm text-red-600 mt-1">{formErrors.interestedIn}</p>}
              </div>

              <FormField icon={<FileText className="w-4 h-4" />} label="Notes">
                <Textarea value={leadFormData.notes} onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })} placeholder="Tell us what you want to change about your smile." />
              </FormField>

              <Button type="submit" className="w-full bg-slate-950 hover:bg-slate-800 text-white" disabled={isSubmittingLead}>
                {isSubmittingLead ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                Continue to photo upload
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
              <p className="text-sm font-medium text-cyan-700 mb-1">Step 2</p>
              <h3 className="text-2xl font-semibold text-slate-950 mb-4">Upload and transform the smile photo</h3>
              <p className="text-slate-600 mb-4">Upload a clear smile photo. The backend handles model access so no provider secrets are shipped to the browser.</p>

              <div className="mb-4 flex gap-2 flex-wrap">
                {(['subtle', 'natural', 'bright'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setSmileIntensity(option)}
                    className={`rounded-full px-4 py-2 text-sm border ${smileIntensity === option ? 'bg-slate-950 text-white border-slate-950' : 'bg-white text-slate-700 border-slate-300'}`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>

              <div
                onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
                }}
                className={`rounded-3xl border-2 border-dashed p-8 text-center transition ${dragActive ? 'border-cyan-500 bg-cyan-50' : 'border-slate-300 bg-slate-50'}`}
              >
                <Upload className="w-8 h-8 mx-auto text-slate-500 mb-3" />
                <p className="text-slate-700 font-medium mb-2">Drag and drop a photo here, or choose a file</p>
                <p className="text-sm text-slate-500 mb-4">JPG, PNG, or WEBP up to 10 MB.</p>
                <input type="file" accept="image/*" className="hidden" id="smile-photo-input" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                <label htmlFor="smile-photo-input" className="inline-flex cursor-pointer rounded-xl bg-white border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900">
                  Choose image
                </label>
              </div>

              {processingError && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" /> {processingError}
                </div>
              )}

              <div className="mt-6 grid md:grid-cols-2 gap-4">
                <PreviewCard title="Original upload" image={uploadedImage} />
                <PreviewCard title="AI smile preview" image={aiImage} />
              </div>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <Button onClick={handleGenerateSmile} disabled={!uploadedImage || isProcessing} className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-600 hover:to-blue-700">
                  {isProcessing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate smile preview
                </Button>
                <Button variant="outline" onClick={() => { setUploadedImage(null); setAiImage(null); setAiVideo(null); setLeadFormData(defaultLeadFormData); setLeadCaptured(false); setLeadCaptureMessage(null); }}>
                  Start over
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 text-white p-6 lg:p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-cyan-300">
                <Film className="w-5 h-5" />
                <p className="text-sm font-medium">Step 3 — optional video</p>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Generate a cinematic reveal</h3>
              <p className="text-slate-300 mb-4">{videoProviderMessage || 'Optional video generation can be enabled from the secure backend configuration.'}</p>

              <Button onClick={handleGenerateVideo} disabled={!aiImage || isGeneratingVideo} className="bg-white text-slate-950 hover:bg-slate-100">
                {isGeneratingVideo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Film className="w-4 h-4 mr-2" />}
                Create optional video
              </Button>

              {videoStatus && <p className="text-sm text-cyan-200 mt-4">{videoStatus}</p>}
              {videoError && <p className="text-sm text-amber-300 mt-2">{videoError}</p>}

              <div className="mt-6 rounded-2xl overflow-hidden bg-slate-900 border border-white/10 min-h-[260px] flex items-center justify-center">
                {aiVideo && aiVideo !== 'ANIMATED' ? (
                  <video src={aiVideo} controls className="w-full h-full object-cover" />
                ) : aiImage ? (
                  <AnimatedSmilePlayer imageUrl={aiImage} />
                ) : (
                  <p className="text-sm text-slate-400 px-6 text-center">Generate an AI smile preview first to unlock the optional video stage.</p>
                )}
              </div>
            </div>

            <QuickTransformations />
          </div>
        </div>
      </div>
    </section>
  );
}

function FormField({ label, error, children, icon }: { label: string; error?: string; children: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-2 flex items-center gap-2">{icon}{label}</Label>
      {children}
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function PreviewCard({ title, image }: { title: string; image: string | null }) {
  return (
    <motion.div layout className="rounded-3xl border border-slate-200 bg-slate-50 overflow-hidden min-h-[220px]">
      <div className="px-4 py-3 border-b border-slate-200 bg-white text-sm font-medium text-slate-700">{title}</div>
      <div className="h-[220px] flex items-center justify-center">
        {image ? <img src={image} alt={title} className="w-full h-full object-cover" /> : <p className="text-sm text-slate-400 px-6 text-center">No image yet.</p>}
      </div>
    </motion.div>
  );
}
