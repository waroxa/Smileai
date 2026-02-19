import { useState } from 'react';
import { Star, Plus, Trash2, Upload, X, Save, Check, Code } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { ClinicBranding, Testimonial } from '../../App';

interface TestimonialsSettingsPanelProps {
  branding: ClinicBranding;
  onBrandingChange: (branding: ClinicBranding) => void;
}

export function TestimonialsSettingsPanel({ branding, onBrandingChange }: TestimonialsSettingsPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [saved, setSaved] = useState(false);

  const testimonials = branding.testimonials || [];
  const googleReviewsScript = branding.googleReviewsScript || '';

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: `testimonial-${Date.now()}`,
      text: '',
      rating: 5,
      image: null,
      name: '',
      city: '',
      service: '',
    };
    
    onBrandingChange({
      ...branding,
      testimonials: [...testimonials, newTestimonial],
    });
    setEditingId(newTestimonial.id);
  };

  const updateTestimonial = (id: string, updates: Partial<Testimonial>) => {
    onBrandingChange({
      ...branding,
      testimonials: testimonials.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    });
  };

  const deleteTestimonial = (id: string) => {
    onBrandingChange({
      ...branding,
      testimonials: testimonials.filter(t => t.id !== id),
    });
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleImageUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      updateTestimonial(id, { image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setEditingId(null);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Manual Testimonials Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Testimonials</h3>
            <p className="text-sm text-gray-600">
              Add and manage patient testimonials. At least 5 recommended for the slider.
            </p>
          </div>
          <Button
            onClick={addTestimonial}
            className="text-white"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {testimonials.length === 0 ? (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Star className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Testimonials Yet</h4>
            <p className="text-sm text-gray-600 mb-4">
              Start adding patient reviews to showcase your excellent work
            </p>
            <Button
              onClick={addTestimonial}
              variant="outline"
              className="border-gray-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Testimonial
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">
                        {testimonial.name || 'Unnamed Testimonial'}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < testimonial.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setEditingId(editingId === testimonial.id ? null : testimonial.id)}
                      variant="outline"
                      size="sm"
                      className="border-gray-300"
                    >
                      {editingId === testimonial.id ? 'Close' : 'Edit'}
                    </Button>
                    <Button
                      onClick={() => deleteTestimonial(testimonial.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {editingId === testimonial.id ? (
                  <div className="space-y-4 border-t pt-4">
                    {/* Image Upload */}
                    <div>
                      <Label className="mb-2 block">Patient Photo (Optional)</Label>
                      <div className="flex items-center gap-4">
                        {testimonial.image && (
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <div className="flex gap-2">
                          <input
                            type="file"
                            id={`image-${testimonial.id}`}
                            className="hidden"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(testimonial.id, e)}
                          />
                          <Button
                            type="button"
                            onClick={() => document.getElementById(`image-${testimonial.id}`)?.click()}
                            variant="outline"
                            size="sm"
                            className="border-gray-300"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            {testimonial.image ? 'Change Photo' : 'Upload Photo'}
                          </Button>
                          {testimonial.image && (
                            <Button
                              onClick={() => updateTestimonial(testimonial.id, { image: null })}
                              variant="outline"
                              size="sm"
                              className="border-red-300 text-red-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`name-${testimonial.id}`}>Patient Name</Label>
                        <Input
                          id={`name-${testimonial.id}`}
                          value={testimonial.name}
                          onChange={(e) => updateTestimonial(testimonial.id, { name: e.target.value })}
                          placeholder="John D."
                        />
                      </div>
                      <div>
                        <Label htmlFor={`city-${testimonial.id}`}>City</Label>
                        <Input
                          id={`city-${testimonial.id}`}
                          value={testimonial.city}
                          onChange={(e) => updateTestimonial(testimonial.id, { city: e.target.value })}
                          placeholder="Miami, FL"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`service-${testimonial.id}`}>Service/Treatment</Label>
                      <Input
                        id={`service-${testimonial.id}`}
                        value={testimonial.service}
                        onChange={(e) => updateTestimonial(testimonial.id, { service: e.target.value })}
                        placeholder="Veneers, Dental Implants, etc."
                      />
                    </div>

                    <div>
                      <Label htmlFor={`rating-${testimonial.id}`}>Rating</Label>
                      <div className="flex gap-2 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => updateTestimonial(testimonial.id, { rating })}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 transition-colors ${
                                rating <= testimonial.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300 hover:text-yellow-200'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
                      <Textarea
                        id={`text-${testimonial.id}`}
                        value={testimonial.text}
                        onChange={(e) => updateTestimonial(testimonial.id, { text: e.target.value })}
                        placeholder="Share what this patient loved about their experience..."
                        rows={4}
                        className="resize-none"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600 line-clamp-2">
                    {testimonial.text || <span className="text-gray-400 italic">No testimonial text yet</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200"></div>

      {/* Google Reviews Integration */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1 flex items-center gap-2">
              <Code className="w-5 h-5" />
              Google Reviews Integration
            </h3>
            <p className="text-sm text-gray-600">
              Add your Trustindex or Google Reviews widget script
            </p>
          </div>
          <Button
            onClick={() => setShowScriptModal(!showScriptModal)}
            variant="outline"
            className="border-gray-300"
          >
            {googleReviewsScript ? 'Edit Script' : 'Add Script'}
          </Button>
        </div>

        {showScriptModal && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <Label htmlFor="google-script" className="mb-2 block">
              Paste your Google Reviews embed code
            </Label>
            <Textarea
              id="google-script"
              value={googleReviewsScript}
              onChange={(e) => onBrandingChange({
                ...branding,
                googleReviewsScript: e.target.value,
              })}
              placeholder="<script src='...'></script> or <iframe...>"
              rows={6}
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-600 mt-2">
              Get your embed code from{' '}
              <a href="https://www.trustindex.io/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                Trustindex
              </a>
              {' '}or your Google Reviews widget provider
            </p>
          </div>
        )}

        {googleReviewsScript && !showScriptModal && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">
                  Google Reviews script configured
                </p>
                <p className="text-xs text-green-700">
                  Your reviews will display on the landing page
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          <strong>Tip:</strong> Click "Save Changes" at the top of the page to save your testimonials and Google Reviews script to the database.
        </p>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
        <Button
          onClick={handleSave}
          className="text-white"
          style={{ backgroundColor: branding.primaryColor }}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Testimonials
            </>
          )}
        </Button>
        {saved && (
          <span className="text-sm text-green-600">
            Your testimonials have been updated
          </span>
        )}
      </div>
    </div>
  );
}