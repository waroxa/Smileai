import { projectId, publicAnonKey } from '../utils/supabase/info';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Loader2, AlertCircle, Check, CheckCircle, User, Mail, Phone, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { AnimatedSmilePlayer } from './AnimatedSmilePlayer';
import { QuickTransformations } from './QuickTransformations';
import { createGHLContact, uploadGHLMedia, updateContactStatus } from '../utils/ghl-api';
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = 'AIzaSyB9CxvzC2rmz63iz-7tv4EQowkN1Vb4b6Y';

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

interface LeadFormData {
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  notes: string;
}

export function SmileTransformationSection() {
  // Step 1: Lead Capture
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [ghlContactId, setGhlContactId] = useState<string | null>(null);
  const [leadFormData, setLeadFormData] = useState<LeadFormData>({
    fullName: '',
    email: '',
    phone: '',
    interestedIn: '',
    notes: '',
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [formErrors, setFormErrors] = useState<Partial<LeadFormData>>({});

  // Step 2: Image Upload & Processing
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [aiVideo, setAiVideo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoStatus, setVideoStatus] = useState<string>('');
  const [smileIntensity, setSmileIntensity] = useState<'subtle' | 'natural' | 'bright'>('natural');
  const [dragActive, setDragActive] = useState(false);
  const [motivationalMessageIndex, setMotivationalMessageIndex] = useState(0);

  const motivationalMessages = [
    "✨ Imagine waking up every day loving your smile...",
    "💫 A confident smile can transform your entire life",
    "🌟 Your dream smile is closer than you think",
    "💎 Invest in yourself - you deserve to feel amazing",
    "🎯 Confidence starts with a smile you're proud of",
    "🚀 Picture yourself smiling without hesitation",
    "💪 A beautiful smile opens doors you never knew existed",
    "🌈 Transform your smile, transform your confidence",
    "⭐ This could be the decision that changes everything",
    "🎨 Your smile is your signature - make it unforgettable"
  ];

  // Rotate motivational messages during video generation
  useEffect(() => {
    if (isGeneratingVideo) {
      const interval = setInterval(() => {
        setMotivationalMessageIndex((prev) => (prev + 1) % motivationalMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isGeneratingVideo]);

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
  };

  // Step 1: Handle Lead Form Submission
  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const errors: Partial<LeadFormData> = {};
    if (!leadFormData.fullName.trim()) errors.fullName = 'Full name is required';
    if (!leadFormData.email.trim()) errors.email = 'Email is required';
    else if (!validateEmail(leadFormData.email)) errors.email = 'Please enter a valid email';
    if (!leadFormData.phone.trim()) errors.phone = 'Phone number is required';
    else if (!validatePhone(leadFormData.phone)) errors.phone = 'Please enter a valid 10-digit phone number';
    if (!leadFormData.interestedIn) errors.interestedIn = 'Please select a service';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmittingLead(true);

    try {
      // Create contact in GoHighLevel (optional - gracefully skips if not configured)
      const result = await createGHLContact({
        fullName: leadFormData.fullName,
        email: leadFormData.email,
        phone: leadFormData.phone,
        interestedIn: leadFormData.interestedIn,
        notes: leadFormData.notes,
        source: 'SmileVision AI Landing Page',
      });

      if (result.success) {
        if (result.contactId) {
          setGhlContactId(result.contactId);
          console.log('✅ Lead captured successfully! Contact ID:', result.contactId);
        } else {
          console.log('✅ Lead captured successfully! (GHL integration not configured)');
        }
        setLeadCaptured(true);
      } else {
        // Only log as warning if there's an actual error (not just missing credentials)
        if (result.error && !result.error.includes('not configured')) {
          console.warn('⚠️ Lead form submitted but GHL integration failed:', result.error);
        }
        // Still allow them to continue even if GHL fails
        setLeadCaptured(true);
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Still allow them to continue
      setLeadCaptured(true);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setUploadedImage(reader.result as string);
      setAiImage(null);
      setAiVideo(null);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSmile = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);
    
    try {
      // Update contact status if we have a GHL contact
      if (ghlContactId) {
        await updateContactStatus(ghlContactId, 'Processing');
      }

      const base64Parts = uploadedImage.match(/^data:(image\/\w+);base64,(.+)$/);
      if (!base64Parts) {
        throw new Error('Invalid image format');
      }
      
      const mimeType = base64Parts[1];
      const base64Image = base64Parts[2];
      
      const intensityInstructions = {
        subtle: 'Transform only the teeth into a beautiful, natural smile. Remove any braces, retainers, or dental hardware. Fix crooked teeth to be perfectly straight and evenly aligned. Rebuild any missing or damaged teeth. Whiten teeth to a clean, natural shade with subtle highlights. Fix any gaps, chips, or discoloration. Maintain realistic texture and natural gum line. Do NOT change skin, hair, eyes, face shape, background or lighting. Focus exclusively on creating amazingly beautiful, straight, white teeth.',
        natural: 'Transform only the teeth into a gorgeous, natural smile. Remove any braces, retainers, or dental hardware. Straighten all crooked teeth into perfect alignment with even spacing. Rebuild any missing or damaged teeth completely. Whiten teeth to a bright, natural pearly white with proper highlights and depth. Fix all gaps, chips, stains, or discoloration. Create a beautiful, symmetrical smile with realistic texture and healthy-looking gums. Do NOT change skin, hair, eyes, face shape, background or lighting. Focus exclusively on creating stunningly beautiful, perfectly straight, naturally white teeth.',
        bright: 'Transform only the teeth into an absolutely flawless, professional Hollywood smile - like the final result after complete dental treatment by an expert cosmetic dentist. COMPLETELY remove all braces, retainers, wires, brackets, and any dental hardware - leave zero trace of orthodontics. Straighten EVERY tooth into PERFECT, FLAWLESS alignment with ideal spacing and absolute symmetry - ensure there is not even the slightest hint of crookedness. Each tooth must be perfectly positioned, perfectly straight, and perfectly even. Rebuild any missing or damaged teeth to absolute perfection with no imperfections whatsoever. Whiten teeth to a bright, luminous professional white with realistic depth, natural highlights, and subtle translucency - like celebrity teeth that are professionally whitened but still look achievable and real. Create perfectly even tooth sizes and shapes with beautiful natural texture, subtle shine, and healthy pink gums. The smile must look like a completed professional dental transformation - perfectly straight, perfectly aligned, perfectly white - yet still realistic and not fake or overly artificial. Zero crookedness allowed. Do NOT change skin, hair, eyes, face shape, background or lighting. Focus exclusively on creating a PERFECTLY STRAIGHT, PERFECTLY ALIGNED, professionally whitened Hollywood smile with zero imperfections.'
      };

      console.log('Processing with Gemini 2.5 Flash Image...');
      
      // Use Gemini 2.5 Flash Image model via SDK
      const contents = [
        {
          text: intensityInstructions[smileIntensity]
        },
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Image,
          },
        },
      ];

      const res = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents,
      });

      console.log('Gemini response received');

      // Extract the generated image
      const imgPart = res.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
      
      if (!imgPart || !imgPart.inlineData?.data) {
        console.error('No image data in response:', res);
        throw new Error('No image data returned from AI');
      }

      const generatedImageBase64 = imgPart.inlineData.data;
      const generatedImageUrl = `data:${imgPart.inlineData.mimeType};base64,${generatedImageBase64}`;
      
      setAiImage(generatedImageUrl);
      console.log('✅ Smile transformation complete!');

      // Upload images to GHL contact
      if (ghlContactId) {
        await uploadGHLMedia(ghlContactId, {
          beforeImage: uploadedImage,
          afterImage: generatedImageUrl,
        });
        await updateContactStatus(ghlContactId, 'Images Generated');
      }
      
    } catch (error) {
      console.error('Error processing image:', error);
      setProcessingError('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUploadDifferent = () => {
    setUploadedImage(null);
    setAiImage(null);
    setAiVideo(null);
  };

  const handleGenerateVideo = async () => {
    if (!aiImage || !uploadedImage) return;

    setIsGeneratingVideo(true);
    setVideoError(null);
    setVideoStatus('Creating your smile video...');
    setAiVideo(null);
    
    try {
      console.log('🎥 ===============================================');
      console.log('🎥 VIDEO GENERATION FLOW STARTED');
      console.log('🎥 ===============================================');
      console.log('📸 Image data length:', aiImage.length, 'characters');
      
      // Send base64 image directly to FAL API (no upload step needed!)
      setVideoStatus('Creating your smile video...');
      console.log('🎬 Starting video generation with base64 image...');
      
      const backendUrl = `https://${projectId}.supabase.co/functions/v1/make-server-c5a5d193/api/fal-video`;
      console.log('📤 Video generation endpoint:', backendUrl);
      
      const requestBody = { 
        imageUrl: aiImage,  // Send base64 data URI directly
        prompt: "Professional dental testimonial style: The person smoothly and naturally showcases their beautiful white teeth with confidence. Starts with a gentle, warm smile that gradually widens to reveal the perfect teeth. Natural facial expressions flow smoothly - subtle head movements, soft eye expressions, and genuine joy. Like someone proudly showing their smile transformation in a high-end dental commercial. Movements are slow, graceful, and professional. Natural breathing, soft blinking, gentle smile variations. No sudden jerks or awkward expressions - everything flows beautifully and naturally. The person looks comfortable, confident, and genuinely happy with their smile."
      };
      
      console.log('📤 Request payload:', {
        imageUrlLength: aiImage.length,
        promptLength: requestBody.prompt.length
      });
      
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify(requestBody),
      }).catch(fetchError => {
        console.error('❌ Video generation fetch failed:', fetchError);
        throw new Error(`Network error: ${fetchError.message}. The backend server may be unavailable.`);
      });

      console.log('📥 Video generation response status:', response.status);
      
      if (!response.ok) {
        const responseText = await response.text();
        let errorMessage = `Server error (${response.status})`;
        let fullErrorDetails = responseText;
        
        try {
          const errorData = JSON.parse(responseText);
          console.error('❌ Backend error data:', errorData);
          
          if (errorData.error) {
            errorMessage = errorData.error;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
          
          // Include hint if available
          if (errorData.hint) {
            errorMessage += ` (${errorData.hint})`;
          }
          
          fullErrorDetails = JSON.stringify(errorData, null, 2);
        } catch (e) {
          // If parsing fails, use the raw text
          if (responseText) {
            errorMessage = responseText.substring(0, 200);
          }
        }
        
        console.error('❌ Full backend error response:', fullErrorDetails);
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('❌ Failed to parse response');
        throw new Error('Unable to create video: Server returned invalid response.');
      }
      
      console.log('📥 Response:', data);

      if (data.success && data.videoUrl) {
        setAiVideo(data.videoUrl);
        setVideoStatus('✨ Your smile video is ready! Watch your transformation.');
        console.log('🎉 Video ready:', data.videoUrl);

        // Upload video to GHL contact
        if (ghlContactId) {
          await uploadGHLMedia(ghlContactId, {
            smileVideo: data.videoUrl,
          });
          await updateContactStatus(ghlContactId, 'Complete - Video Generated');
        }
      } else {
        throw new Error(data.error || 'No video URL in response');
      }
      
    } catch (error: any) {
      console.error('❌ Error creating video:', error);
      console.error('❌ Error details:', error.message);
      console.error('❌ Error stack:', error.stack);
      
      // Show actual error to user for debugging
      setVideoError(`Video generation failed: ${error.message}. Using animated preview instead.`);
      
      // Auto-fallback to animated player
      console.log('⚠️ Video generation failed, using animated fallback...');
      setAiVideo('ANIMATED');
      setVideoStatus('✨ Your smile preview is ready! (Using animated preview)');

      // Update status even with fallback
      if (ghlContactId) {
        await updateContactStatus(ghlContactId, 'Complete - Animated Preview');
      }
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  return (
    <section id="smile-transform" className="bg-gradient-to-b from-gray-50 to-white py-12 sm:py-16 lg:py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl text-gray-900 mb-3 sm:mb-4">
            {!leadCaptured ? 'Get Your Free Smile Preview' : 'Try Your New Smile in Seconds'}
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            {!leadCaptured 
              ? 'Enter your info and see what\'s possible with an AI-enhanced smile preview. No commitment required.'
              : 'Upload a photo and see a natural-looking, AI-enhanced smile. See what\'s possible before you commit.'}
          </p>
        </div>

        {/* Quick Transformations Section - Show before lead capture */}
        {!leadCaptured && <QuickTransformations />}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Left Column - Dynamic based on step */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-gray-100">
            {!leadCaptured ? (
              // STEP 1: Lead Capture Form
              <motion.div
                key="lead-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-6">
                  <h3 className="text-xl sm:text-2xl text-gray-900 mb-2">Step 1: Enter Your Information</h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    We'll create your personalized smile preview in the next step
                  </p>
                </div>

                <form onSubmit={handleLeadSubmit} className="space-y-5">
                  {/* Full Name */}
                  <div>
                    <Label htmlFor="fullName" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
                      <User className="w-4 h-4 text-gray-600" />
                      Full Name *
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={leadFormData.fullName}
                      onChange={(e) => {
                        setLeadFormData({ ...leadFormData, fullName: e.target.value });
                        if (formErrors.fullName) setFormErrors({ ...formErrors, fullName: undefined });
                      }}
                      placeholder="John Smith"
                      className={`h-11 text-base ${formErrors.fullName ? 'border-red-500' : ''}`}
                    />
                    {formErrors.fullName && (
                      <p className="text-sm text-red-600 mt-1.5">{formErrors.fullName}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
                      <Mail className="w-4 h-4 text-gray-600" />
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={leadFormData.email}
                      onChange={(e) => {
                        setLeadFormData({ ...leadFormData, email: e.target.value });
                        if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                      }}
                      placeholder="john@example.com"
                      className={`h-11 text-base ${formErrors.email ? 'border-red-500' : ''}`}
                    />
                    {formErrors.email && (
                      <p className="text-sm text-red-600 mt-1.5">{formErrors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
                      <Phone className="w-4 h-4 text-gray-600" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={leadFormData.phone}
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        setLeadFormData({ ...leadFormData, phone: formatted });
                        if (formErrors.phone) setFormErrors({ ...formErrors, phone: undefined });
                      }}
                      placeholder="(555) 123-4567"
                      maxLength={14}
                      className={`h-11 text-base ${formErrors.phone ? 'border-red-500' : ''}`}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-600 mt-1.5">{formErrors.phone}</p>
                    )}
                  </div>

                  {/* Interested In */}
                  <div>
                    <Label htmlFor="interestedIn" className="text-base font-medium text-gray-900 mb-2 block">
                      Interested In *
                    </Label>
                    <select
                      id="interestedIn"
                      value={leadFormData.interestedIn}
                      onChange={(e) => {
                        setLeadFormData({ ...leadFormData, interestedIn: e.target.value });
                        if (formErrors.interestedIn) setFormErrors({ ...formErrors, interestedIn: undefined });
                      }}
                      className={`w-full h-11 text-base px-4 rounded-lg border bg-white ${
                        formErrors.interestedIn ? 'border-red-500' : 'border-gray-300'
                      } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    >
                      <option value="">Select a service...</option>
                      <option value="Veneers">Veneers</option>
                      <option value="Invisalign">Invisalign</option>
                      <option value="Whitening">Whitening</option>
                      <option value="Smile Makeover">Smile Makeover</option>
                      <option value="Other">Other</option>
                    </select>
                    {formErrors.interestedIn && (
                      <p className="text-sm text-red-600 mt-1.5">{formErrors.interestedIn}</p>
                    )}
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <Label htmlFor="notes" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
                      <FileText className="w-4 h-4 text-gray-600" />
                      Optional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={leadFormData.notes}
                      onChange={(e) => setLeadFormData({ ...leadFormData, notes: e.target.value })}
                      placeholder="Tell us about your smile goals or any specific concerns..."
                      rows={3}
                      className="text-base resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmittingLead}
                    className="w-full h-12 text-base font-semibold bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmittingLead ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Get Started Free ✨
                      </>
                    )}
                  </Button>

                  {/* Privacy Note */}
                  <p className="text-xs text-center text-gray-500 pt-2">
                    By continuing, you agree to be contacted about your smile transformation.
                    <br />
                    Your information is secure and will never be shared.
                  </p>

                  {/* Trust Indicators */}
                  <div className="pt-3 space-y-1.5">
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Secure & Confidential</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                      <Check className="w-3.5 h-3.5 text-green-600" />
                      <span>Get Results in 24 Hours</span>
                    </div>
                  </div>
                </form>
              </motion.div>
            ) : (
              // STEP 2: Upload & Transform
              <motion.div
                key="upload-transform"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <h3 className="text-lg sm:text-xl text-gray-900">Step 2: Upload Your Photo</h3>
                  </div>
                  <p className="text-sm sm:text-base text-gray-600">Get an instant AI-enhanced smile preview</p>
                </div>

                {/* Upload Area or Before/After Preview */}
                <AnimatePresence mode="wait">
                  {!uploadedImage ? (
                    <motion.div
                      key="upload"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div
                        className={`relative border-2 border-dashed rounded-xl transition-all ${
                          dragActive
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-300 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/30'
                        }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <label className="flex flex-col items-center justify-center py-16 cursor-pointer">
                          <Upload className="w-12 h-12 text-teal-600 mb-4" />
                          <p className="text-gray-700 mb-1">Drag & drop a photo here</p>
                          <p className="text-gray-500 text-sm mb-4">or click to upload from your device</p>
                          <p className="text-gray-400 text-xs">JPG, PNG – up to 10MB</p>
                          <input
                            type="file"
                            className="hidden"
                            accept="image/jpeg,image/png,image/jpg"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      {/* Before/After Preview */}
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                          <div className="bg-white border border-gray-200 px-4 py-3 rounded-t-xl text-center">
                            <p className="text-gray-900">Before</p>
                          </div>
                          <div className="border-2 border-gray-200 border-t-0 rounded-b-xl overflow-hidden shadow-md">
                            <img
                              src={uploadedImage}
                              alt="Before"
                              className="w-full h-56 object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <div className="bg-blue-600 px-4 py-3 rounded-t-xl text-center">
                            <p className="text-white">After - AI Enhanced</p>
                          </div>
                          <div className="border-2 border-blue-600 border-t-0 rounded-b-xl overflow-hidden shadow-lg relative">
                            {aiImage ? (
                              <img
                                src={aiImage}
                                alt="After"
                                className="w-full h-56 object-cover"
                              />
                            ) : (
                              <div className="w-full h-56 flex items-center justify-center bg-gray-50">
                                <p className="text-gray-400 text-sm">Generate to see preview</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Smile Intensity Controls */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <Label className="text-gray-900 mb-3 block">Smile Intensity</Label>
                        <div className="flex gap-4">
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="intensity"
                              value="subtle"
                              checked={smileIntensity === 'subtle'}
                              onChange={(e) => setSmileIntensity(e.target.value as 'subtle' | 'natural' | 'bright')}
                              className="peer sr-only"
                            />
                            <div className="border-2 border-gray-300 peer-checked:border-teal-600 peer-checked:bg-teal-50 rounded-lg p-3 text-center transition-all">
                              <p className="text-sm text-gray-700">Very subtle</p>
                            </div>
                          </label>
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="intensity"
                              value="natural"
                              checked={smileIntensity === 'natural'}
                              onChange={(e) => setSmileIntensity(e.target.value as 'subtle' | 'natural' | 'bright')}
                              className="peer sr-only"
                            />
                            <div className="border-2 border-gray-300 peer-checked:border-teal-600 peer-checked:bg-teal-50 rounded-lg p-3 text-center transition-all">
                              <p className="text-sm text-gray-700">Natural</p>
                            </div>
                          </label>
                          <label className="flex-1 cursor-pointer">
                            <input
                              type="radio"
                              name="intensity"
                              value="bright"
                              checked={smileIntensity === 'bright'}
                              onChange={(e) => setSmileIntensity(e.target.value as 'subtle' | 'natural' | 'bright')}
                              className="peer sr-only"
                            />
                            <div className="border-2 border-gray-300 peer-checked:border-teal-600 peer-checked:bg-teal-50 rounded-lg p-3 text-center transition-all">
                              <p className="text-sm text-gray-700">Hollywood smile</p>
                            </div>
                          </label>
                        </div>
                        <p className="text-xs text-gray-500 mt-3">We only adjust teeth and smile – we don't change your face.</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-3">
                        <Button
                          onClick={handleGenerateSmile}
                          disabled={isProcessing}
                          className="w-full h-12 bg-teal-600 hover:bg-teal-700"
                        >
                          {isProcessing ? (
                            <>
                              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                              Creating your enhanced smile...
                            </>
                          ) : (
                            'See My New Smile'
                          )}
                        </Button>
                        
                        {processingError && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg"
                          >
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <p className="text-sm text-red-700">{processingError}</p>
                          </motion.div>
                        )}
                        
                        <button
                          type="button"
                          onClick={handleUploadDifferent}
                          className="w-full text-center text-teal-600 hover:text-teal-700 text-sm underline"
                        >
                          Upload a different photo
                        </button>
                      </div>

                      {/* Preview Disclaimer */}
                      {aiImage && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
                        >
                          <p className="text-xs text-blue-800">
                            Preview only. Final results depend on your personalized treatment plan.
                          </p>
                        </motion.div>
                      )}
                      
                      {/* Video Generation Section */}
                      {aiImage && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-6"
                        >
                          <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 rounded-t-xl">
                            <p className="text-white"> Your Smile Video</p>
                          </div>
                          <div className="border-4 border-purple-600 border-t-0 rounded-b-xl overflow-hidden shadow-2xl bg-white">
                            {aiVideo ? (
                              aiVideo === 'ANIMATED' ? (
                                <AnimatedSmilePlayer 
                                  beforeImage={uploadedImage}
                                  afterImage={aiImage}
                                  isPlaying={true}
                                />
                              ) : aiVideo.startsWith('data:image') ? (
                                <img
                                  src={aiVideo}
                                  alt="AI Enhanced Smile"
                                  className="w-full rounded-lg"
                                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                                />
                              ) : (
                                <video
                                  src={aiVideo}
                                  controls
                                  autoPlay
                                  loop
                                  muted
                                  className="w-full rounded-lg"
                                  style={{ maxHeight: '400px' }}
                                >
                                  Your browser does not support the video tag.
                                </video>
                              )
                            ) : (
                              <div className="w-full h-64 flex flex-col items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 p-6">
                                {isGeneratingVideo ? (
                                  <AnimatePresence mode="wait">
                                    <motion.div
                                      key={motivationalMessageIndex}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.5 }}
                                      className="text-center"
                                    >
                                      <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                                      <p className="text-lg sm:text-xl text-gray-800 mb-2">
                                        {motivationalMessages[motivationalMessageIndex]}
                                      </p>
                                      <p className="text-sm text-gray-500">Creating your video...</p>
                                    </motion.div>
                                  </AnimatePresence>
                                ) : (
                                  <>
                                    <p className="text-gray-400 text-sm mb-2">Generate a video to see yourself smiling</p>
                                    <p className="text-gray-400 text-xs text-center">Watch your new smile come to life with movement!</p>
                                  </>
                                )}
                              </div>
                            )}
                            
                            <div className="p-4">
                              <Button
                                onClick={handleGenerateVideo}
                                disabled={isGeneratingVideo}
                                className="w-full h-12 bg-purple-600 hover:bg-purple-700"
                              >
                                {isGeneratingVideo ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Creating your smile video...
                                  </>
                                ) : (
                                  '🎬 Generate Smile Video'
                                )}
                              </Button>
                              
                              {videoStatus && (
                                <p className="text-sm text-center mt-3 text-gray-600">
                                  {videoStatus}
                                </p>
                              )}
                              
                              {videoError && (
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg mt-3"
                                >
                                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                                  <p className="text-xs text-red-700">{videoError}</p>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

          {/* Right Column - Information/Benefits */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-xl p-6 md:p-8 border border-blue-100">
            <div className="mb-6">
              <h3 className="text-xl sm:text-2xl text-gray-900 mb-3">
                {!leadCaptured ? 'Why Get Your Free Preview?' : 'What Happens Next?'}
              </h3>
            </div>

            {!leadCaptured ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">See Your Potential</p>
                    <p className="text-sm text-gray-600">
                      Visualize your smile transformation before committing to treatment
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">100% Free & No Obligation</p>
                    <p className="text-sm text-gray-600">
                      Get your AI smile preview instantly - no payment required
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Personalized Consultation</p>
                    <p className="text-sm text-gray-600">
                      Our team will review your preview and provide expert recommendations
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Fast Results</p>
                    <p className="text-sm text-gray-600">
                      Get your AI-generated smile transformation in under 30 seconds
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>Over 10,000+ smiles transformed!</strong>
                    <br />
                    Join thousands who've discovered their dream smile.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Upload Your Photo</p>
                    <p className="text-sm text-gray-600">
                      Upload a clear photo showing your smile
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-600 font-bold">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">AI Creates Your Preview</p>
                    <p className="text-sm text-gray-600">
                      Our advanced AI generates your enhanced smile in seconds
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 mb-1">Get Expert Consultation</p>
                    <p className="text-sm text-gray-600">
                      Our dental team will contact you within 24 hours to discuss your options
                    </p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
                  <p className="text-sm text-gray-700 text-center">
                    <strong>✅ Your info has been saved!</strong>
                    <br />
                    We'll automatically send your results to your email.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 max-w-4xl mx-auto">
            Your photos are processed securely and privately. We only adjust your smile, not your identity.
          </p>
        </div>
      </div>
    </section>
  );
}