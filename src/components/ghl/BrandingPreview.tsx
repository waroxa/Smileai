import React from 'react';
import { Sparkles, Users, TrendingUp } from 'lucide-react';
import { ClinicBranding } from '../../App';

interface BrandingPreviewProps {
  branding: ClinicBranding;
}

export function BrandingPreview({ branding }: BrandingPreviewProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
      <p className="text-sm text-gray-600 mb-6">See how your branding looks in the app</p>

      {/* Mini App Preview */}
      <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
        {/* Mini Header */}
        <div className="bg-white border-b border-gray-200 p-3 flex items-center gap-3">
          <div
            className="w-8 h-8 rounded flex items-center justify-center"
            style={{ backgroundColor: `${branding.primaryColor}15` }}
          >
            <Sparkles className="w-4 h-4" style={{ color: branding.primaryColor }} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">SmileVisionPro</p>
            <p className="text-xs text-gray-500">{branding.clinicName}</p>
          </div>
        </div>

        {/* Mini Content */}
        <div className="bg-gray-50 p-4 space-y-3">
          {/* Mini Metric Cards */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${branding.primaryColor}15` }}
                >
                  <Users className="w-3 h-3" style={{ color: branding.primaryColor }} />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">142</p>
              <p className="text-xs text-gray-600">Patients</p>
            </div>

            <div className="bg-white rounded border border-gray-200 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{ backgroundColor: `${branding.accentColor}15` }}
                >
                  <TrendingUp className="w-3 h-3" style={{ color: branding.accentColor }} />
                </div>
              </div>
              <p className="text-lg font-bold text-gray-900">68%</p>
              <p className="text-xs text-gray-600">Conversion</p>
            </div>
          </div>

          {/* Mini Button */}
          <button
            className="w-full py-2 rounded text-white text-sm font-medium"
            style={{ backgroundColor: branding.primaryColor }}
          >
            Primary Button
          </button>

          {/* Mini Nav Item */}
          <div
            className="rounded p-2 text-white text-sm font-medium flex items-center gap-2"
            style={{ backgroundColor: branding.primaryColor }}
          >
            <Sparkles className="w-4 h-4" />
            <span>Active Navigation</span>
          </div>
        </div>
      </div>

      {/* Color Swatches */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Color Palette</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <div
              className="h-12 rounded border border-gray-200 mb-1"
              style={{ backgroundColor: branding.primaryColor }}
            />
            <p className="text-xs text-gray-600 text-center">Primary</p>
            <p className="text-xs text-gray-500 text-center font-mono">{branding.primaryColor}</p>
          </div>
          <div className="flex-1">
            <div
              className="h-12 rounded border border-gray-200 mb-1"
              style={{ backgroundColor: branding.accentColor }}
            />
            <p className="text-xs text-gray-600 text-center">Accent</p>
            <p className="text-xs text-gray-500 text-center font-mono">{branding.accentColor}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
