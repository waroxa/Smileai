import React, { useState, useRef } from 'react';
import { Upload, Check, X, Loader2, Phone, Mail, User, FileText, Camera, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  interestedIn: string;
  notes: string;
  uploadedFile: File | null;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  interestedIn?: string;
  uploadedFile?: string;
}

export function PatientIntakeFormSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    interestedIn: '',
    notes: '',
    uploadedFile: null,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const interestedOptions = [
    'Veneers',
    'Invisalign',
    'Whitening',
    'Smile Makeover',
    'Other',
  ];

  const formatPhoneNumber = (value: string) => {
    const phone = value.replace(/\D/g, '');
    if (phone.length <= 3) return phone;
    if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`;
    return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData({ ...formData, phone: formatted });
    if (errors.phone) {
      setErrors({ ...errors, phone: undefined });
    }
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
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
    // Validate file type
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'video/mp4',
      'video/quicktime',
    ];

    if (!validTypes.includes(file.type)) {
      setErrors({
        ...errors,
        uploadedFile: 'Please upload a JPG, PNG, HEIC image or MP4/MOV video',
      });
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setErrors({
        ...errors,
        uploadedFile: `File size must be less than ${file.type.startsWith('video/') ? '50MB' : '10MB'}`,
      });
      return;
    }

    setFormData({ ...formData, uploadedFile: file });
    setErrors({ ...errors, uploadedFile: undefined });

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setUploadPreview(null);
    }
  };

  const removeFile = () => {
    setFormData({ ...formData, uploadedFile: null });
    setUploadPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }

    if (!formData.interestedIn) {
      newErrors.interestedIn = 'Please select what you\'re interested in';
    }

    if (!formData.uploadedFile) {
      newErrors.uploadedFile = 'Please upload a photo or video of your smile';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = document.querySelector('.border-red-500');
      firstErrorField?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Here you would send data to platform
    console.log('Form submitted:', formData);

    setIsSubmitting(false);

    // Show success message
    alert('Thank you! Your smile preview request has been submitted. We\'ll be in touch soon!');
    
    // Reset form
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      interestedIn: '',
      notes: '',
      uploadedFile: null,
    });
    setUploadPreview(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Get Your Smile Preview</h3>
        <p className="text-base text-gray-600">
          Fill out the form below and upload a photo to receive your personalized smile transformation preview.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        <div>
          <Label htmlFor="fullName" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
            <User className="w-4 h-4 text-gray-600" />
            Full Name *
          </Label>
          <Input
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={(e) => {
              setFormData({ ...formData, fullName: e.target.value });
              if (errors.fullName) setErrors({ ...errors, fullName: undefined });
            }}
            placeholder="John Smith"
            className={`h-11 text-base ${errors.fullName ? 'border-red-500' : ''}`}
          />
          {errors.fullName && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.fullName}
            </p>
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
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="john@example.com"
            className={`h-11 text-base ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          <Label htmlFor="phone" className="flex items-center gap-2 text-base font-medium text-gray-900 mb-2">
            <Phone className="w-4 h-4 text-gray-600" />
            Phone Number *
          </Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={handlePhoneChange}
            placeholder="(555) 123-4567"
            maxLength={14}
            className={`h-11 text-base ${errors.phone ? 'border-red-500' : ''}`}
          />
          {errors.phone && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.phone}
            </p>
          )}
        </div>

        {/* Interested In */}
        <div>
          <Label htmlFor="interestedIn" className="text-base font-medium text-gray-900 mb-2 block">
            Interested In *
          </Label>
          <select
            id="interestedIn"
            value={formData.interestedIn}
            onChange={(e) => {
              setFormData({ ...formData, interestedIn: e.target.value });
              if (errors.interestedIn) setErrors({ ...errors, interestedIn: undefined });
            }}
            className={`w-full h-11 text-base px-4 rounded-lg border bg-white ${
              errors.interestedIn ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
          >
            <option value="">Select a service...</option>
            {interestedOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.interestedIn && (
            <p className="text-sm text-red-600 mt-1.5 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.interestedIn}
            </p>
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
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Tell us about your smile goals or any specific concerns..."
            rows={3}
            className="text-base resize-none"
          />
          <p className="text-xs text-gray-500 mt-1.5">Share any additional information (optional)</p>
        </div>

        {/* Photo / Video Upload */}
        <div>
          <Label className="text-base font-medium text-gray-900 mb-2 block">
            Photo / Video Upload *
          </Label>
          <p className="text-sm text-gray-600 mb-3">
            Upload a clear photo or video of your smile
          </p>

          {!formData.uploadedFile ? (
            <div
              className={`relative border-2 border-dashed rounded-xl transition-all ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : errors.uploadedFile
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <label className="flex flex-col items-center justify-center py-10 cursor-pointer">
                <Upload className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-gray-700 font-medium mb-1 text-sm">Drop your file here or click to upload</p>
                <p className="text-xs text-gray-500 mb-2">Photos: JPG, PNG, HEIC (max 10MB)</p>
                <p className="text-xs text-gray-500">Videos: MP4, MOV (max 50MB)</p>
                <div className="mt-3 px-5 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Choose File
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/jpg,image/png,image/heic,video/mp4,video/quicktime"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          ) : (
            <div className="border-2 border-green-500 rounded-xl bg-green-50 p-4">
              <div className="flex items-start gap-3">
                {uploadPreview ? (
                  <img
                    src={uploadPreview}
                    alt="Upload preview"
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Camera className="w-6 h-6 text-gray-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="font-medium text-gray-900 truncate text-sm">
                      {formData.uploadedFile.name}
                    </p>
                  </div>
                  <p className="text-xs text-gray-600">
                    {(formData.uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={removeFile}
                  variant="outline"
                  size="sm"
                  className="border-gray-300 text-red-600 hover:bg-red-50 flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {errors.uploadedFile && (
            <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
              <X className="w-4 h-4" />
              {errors.uploadedFile}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Camera className="w-5 h-5 mr-2" />
              Get My Smile Preview
            </>
          )}
        </Button>

        {/* Compliance Disclaimer */}
        <div className="flex items-start gap-2 px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-lg">
          <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-600 leading-relaxed">
            AI-generated previews are for visual reference only and do not constitute a dental diagnosis. A licensed dental professional will review all submissions.
          </p>
        </div>

        {/* Privacy Note */}
        <p className="text-xs text-center text-gray-500 pt-2">
          By submitting this form, you agree to be contacted about your smile transformation.
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
    </div>
  );
}