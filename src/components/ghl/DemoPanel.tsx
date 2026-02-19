import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Sparkles, Palette, RefreshCw, X } from 'lucide-react';
import { ClinicBranding } from '../../App';

interface DemoPanelProps {
  onBrandingChange: (branding: ClinicBranding) => void;
}

export function DemoPanel({ onBrandingChange }: DemoPanelProps) {
  const [isOpen, setIsOpen] = useState(true);

  const demoThemes = [
    {
      name: 'Ocean Blue',
      clinicName: 'Ocean Dental Spa',
      primaryColor: '#0ea5e9',
      accentColor: '#06b6d4',
    },
    {
      name: 'Forest Green',
      clinicName: 'Green Valley Dental',
      primaryColor: '#10b981',
      accentColor: '#059669',
    },
    {
      name: 'Sunset Orange',
      clinicName: 'Sunrise Smile Center',
      primaryColor: '#f97316',
      accentColor: '#ea580c',
    },
    {
      name: 'Royal Purple',
      clinicName: 'Royal Dental Group',
      primaryColor: '#8b5cf6',
      accentColor: '#7c3aed',
    },
    {
      name: 'Rose Pink',
      clinicName: 'Rose Dental Studio',
      primaryColor: '#ec4899',
      accentColor: '#db2777',
    },
    {
      name: 'Neutral Default',
      clinicName: 'Your Dental Practice',
      primaryColor: '#0ea5e9',
      accentColor: '#8b5cf6',
    },
  ];

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-40 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-gray-700" />
          <h3 className="font-semibold text-gray-900">Quick Theme Demo</h3>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <p className="text-xs text-gray-600 mb-4">
        Try different clinic branding styles instantly
      </p>

      <div className="space-y-2 max-h-80 overflow-y-auto">
        {demoThemes.map((theme, index) => (
          <button
            key={index}
            onClick={() =>
              onBrandingChange({
                clinicName: theme.clinicName,
                logo: null,
                primaryColor: theme.primaryColor,
                accentColor: theme.accentColor,
              })
            }
            className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.primaryColor }}
                />
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: theme.accentColor }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 group-hover:text-gray-700">
                  {theme.name}
                </p>
                <p className="text-xs text-gray-500">{theme.clinicName}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Changes apply instantly across all views
        </p>
      </div>
    </div>
  );
}