import React, { useState } from 'react';
import { Upload, Sparkles, Loader2, AlertCircle, Info } from 'lucide-react';
import { ClinicBranding } from '../../App';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface SmileToolViewProps {
  clinicBranding: ClinicBranding;
}

export function SmileToolView({ clinicBranding }: SmileToolViewProps) {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateSmile = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      setAiImage(uploadedImage); // In real app, this would be the AI result
      setIsProcessing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Smile Transformation Tool</h2>
        <p className="text-gray-600 mt-1">Create AI-enhanced smile previews for your patients</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-medium text-blue-900 mb-1">How it works</h4>
          <p className="text-sm text-blue-800">
            Upload a patient's photo, and our transformation engine will generate a preview of their enhanced smile. 
            This helps visualize potential treatment outcomes during consultations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Patient Photo</h3>
          
          {!uploadedImage ? (
            <div
              className={`relative border-2 border-dashed rounded-xl transition-all ${
                dragActive
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-300 bg-gray-50/50 hover:border-gray-400 hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center py-20 cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-gray-700 font-medium mb-1">Drop photo here or click to upload</p>
                <p className="text-gray-500 text-sm mb-4">Supports JPG, PNG – up to 10MB</p>
                <div 
                  className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                  style={{ backgroundColor: clinicBranding.primaryColor }}
                >
                  Browse Files
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full h-80 object-cover"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerateSmile}
                  disabled={isProcessing}
                  className="flex-1 text-white"
                  style={{ backgroundColor: clinicBranding.primaryColor }}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Smile Preview
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadedImage(null);
                    setAiImage(null);
                  }}
                  className="border-gray-300"
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Result Section */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enhanced Smile Preview</h3>
          
          <div 
            className="border-2 rounded-lg overflow-hidden mb-4"
            style={{ borderColor: aiImage ? clinicBranding.primaryColor : '#e5e7eb' }}
          >
            {aiImage ? (
              <img
                src={aiImage}
                alt="Enhanced Smile"
                className="w-full h-80 object-cover"
              />
            ) : (
              <div className="w-full h-80 flex flex-col items-center justify-center bg-gray-50">
                <Sparkles className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-gray-400 text-sm">Preview will appear here</p>
              </div>
            )}
          </div>

          {aiImage && (
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button 
                  className="flex-1 text-white"
                  style={{ backgroundColor: clinicBranding.primaryColor }}
                >
                  Save to Patient Record
                </Button>
                <Button variant="outline" className="border-gray-300">
                  Download
                </Button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-600">
                    This is a visual preview only. Actual results may vary based on individual treatment plans.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Usage Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">89</p>
            <p className="text-sm text-gray-600 mt-1">Assessments Created</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">68%</p>
            <p className="text-sm text-gray-600 mt-1">Conversion Rate</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-3xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-600 mt-1">This Week</p>
          </div>
        </div>
      </div>
    </div>
  );
}
