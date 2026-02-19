import { useState } from 'react';
import { Upload, Sparkles, Video, CheckCircle, Shield, Zap } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { motion } from 'motion/react';
import { BeforeAfterShowcase } from './BeforeAfterShowcase';
import type { Submission } from '../App';

interface LandingPageProps {
  onSubmit: (submission: Submission) => void;
}

export function LandingPage({ onSubmit }: LandingPageProps) {
  const [step, setStep] = useState<'form' | 'upload' | 'result'>('form');
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: ''
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('upload');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      setAiImage(uploadedImage);
      setIsGenerating(false);
      setStep('result');
      
      // Save submission
      const submission: Submission = {
        id: Date.now().toString(),
        customerName: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        originalImage: uploadedImage!,
        aiGeneratedImage: uploadedImage!,
        hasVideo: false,
        timestamp: new Date()
      };
      onSubmit(submission);
    }, 2500);
  };

  const handleCreateVideo = () => {
    setShowVideo(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
              ✨ AI-Powered Smile Transformation
            </div>
            <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
              See Your Perfect Smile in Seconds
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Upload your photo and instantly visualize what your smile could look like with perfectly aligned, bright white teeth.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-8 mb-12">
            <div className="flex items-center gap-2 text-gray-700">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>100% Private & Secure</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Zap className="w-5 h-5 text-blue-600" />
              <span>Instant Results</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Sparkles className="w-5 h-5 text-blue-600" />
              <span>AI Technology</span>
            </div>
          </div>
        </div>

        {/* Before/After Showcase - Moved Here */}
        <BeforeAfterShowcase />
      </div>

      {/* CTA Section before form */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl mb-4 text-gray-900">
            See The <span className="text-blue-600">Transformation</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Get your own AI-enhanced smile in seconds
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Form Step */}
        {step === 'form' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-3 text-gray-900">Get Your Free Smile Preview</h2>
              <p className="text-gray-600">Fill out the form below to get started</p>
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-gray-900">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter your full name"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-900">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  className="mt-2 h-12"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-gray-900">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                  className="mt-2 h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 mt-6">
                Continue to Upload Photo →
              </Button>
            </form>
            <p className="text-center text-sm text-gray-500 mt-6">
              Your information is 100% secure and will never be shared
            </p>
          </motion.div>
        )}

        {/* Upload Step */}
        {step === 'upload' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl mb-3 text-gray-900">Upload Your Smile Photo</h2>
              <p className="text-gray-600">Take a clear photo showing your teeth for best results</p>
            </div>
            
            {!uploadedImage ? (
              <label className="flex flex-col items-center justify-center w-full h-80 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all bg-gray-50">
                <Upload className="w-16 h-16 text-gray-400 mb-4" />
                <p className="text-gray-700 mb-2">Click to upload or drag and drop</p>
                <p className="text-gray-500 text-sm">PNG, JPG, JPEG (Max 10MB)</p>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </label>
            ) : (
              <div className="space-y-6">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={uploadedImage}
                    alt="Uploaded smile"
                    className="w-full h-80 object-contain"
                  />
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="absolute top-4 right-4 bg-white text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 shadow-lg border border-gray-200"
                  >
                    Change Photo
                  </button>
                </div>
                <Button
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="w-full h-12 bg-blue-600 hover:bg-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="w-5 h-5 mr-2 animate-spin" />
                      AI is transforming your smile...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate My Perfect Smile
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}

        {/* Result Step */}
        {step === 'result' && aiImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-3xl mb-3 text-gray-900">Your Smile Transformation</h2>
              <p className="text-gray-600">Here's what your perfect smile could look like</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <div className="bg-gray-100 p-3 rounded-t-lg">
                  <p className="text-sm text-gray-700">Before</p>
                </div>
                <img
                  src={uploadedImage!}
                  alt="Original"
                  className="w-full h-64 object-cover border border-t-0 border-gray-200"
                />
              </div>
              <div>
                <div className="bg-blue-600 p-3 rounded-t-lg">
                  <p className="text-sm text-white">After - AI Enhanced</p>
                </div>
                <div className="relative border border-t-0 border-gray-200">
                  <img
                    src={aiImage}
                    alt="AI Enhanced"
                    className="w-full h-64 object-cover brightness-110 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-500/10 to-transparent pointer-events-none" />
                </div>
              </div>
            </div>

            {!showVideo ? (
              <div className="space-y-4">
                <Button onClick={handleCreateVideo} className="w-full h-12 bg-blue-600 hover:bg-blue-700">
                  <Video className="w-5 h-5 mr-2" />
                  Create Video Animation
                </Button>
                <p className="text-center text-sm text-gray-500">
                  Transform your result into an animated video
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="relative bg-black rounded-lg overflow-hidden h-80">
                  <motion.img
                    src={aiImage}
                    alt="Video"
                    className="w-full h-full object-cover"
                    animate={{
                      scale: [1, 1.05, 1],
                      filter: [
                        'brightness(1) contrast(1)',
                        'brightness(1.15) contrast(1.08)',
                        'brightness(1) contrast(1)'
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="bg-black/30 backdrop-blur-sm rounded-full p-6"
                    >
                      <Video className="w-12 h-12 text-white" />
                    </motion.div>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span>Video animation created successfully!</span>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 h-12 bg-blue-600 hover:bg-blue-700">
                    Download Video
                  </Button>
                  <Button
                    onClick={() => {
                      setStep('form');
                      setFormData({ customerName: '', email: '', phone: '' });
                      setUploadedImage(null);
                      setAiImage(null);
                      setShowVideo(false);
                    }}
                    variant="outline"
                    className="flex-1 h-12"
                  >
                    Start New
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Footer Trust Section */}
        <div className="text-center mt-16 pb-12">
          <p className="text-gray-500 text-sm mb-4">Trusted by thousands of happy customers</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}