import React, { useState } from 'react';
import { X, Sparkles, Palette, Users, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';

interface WelcomeBannerProps {
  onClose: () => void;
}

export function WelcomeBanner({ onClose }: WelcomeBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 mb-6 rounded-lg shadow-lg relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      {/* Content */}
      <div className="relative">
        <button
          onClick={onClose}
          className="absolute top-0 right-0 p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to SmileVisionPro! 🎉</h2>
            <p className="text-blue-100 mb-4">
              Your clinic-neutral dental transformation suite for GoHighLevel Marketplace
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Palette className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">Multi-Brand Ready</h3>
            <p className="text-sm text-blue-100">
              Customize colors and branding for any dental clinic
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Users className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">Patient Management</h3>
            <p className="text-sm text-blue-100">
              Track assessments, consultations, and conversions
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <Sparkles className="w-6 h-6 mb-2" />
            <h3 className="font-semibold mb-1">AI Smile Tool</h3>
            <p className="text-sm text-blue-100">
              Generate smile transformations for patient previews
            </p>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <Button
            onClick={onClose}
            className="bg-white text-blue-600 hover:bg-blue-50"
          >
            Get Started
          </Button>
          <p className="text-sm text-blue-100">
            💡 Try the <strong>Quick Theme Demo</strong> panel on the right →
          </p>
        </div>
      </div>
    </motion.div>
  );
}
