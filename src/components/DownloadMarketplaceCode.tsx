import { useState } from 'react';
import { Download, FileArchive, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';

/**
 * DownloadMarketplaceCode - Component to download all marketplace code as ZIP
 */
export function DownloadMarketplaceCode() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState('');

  const downloadZip = async () => {
    setIsDownloading(true);
    setProgress('Preparing files...');

    try {
      // Import JSZip from CDN dynamically
      const JSZip = (await import('https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm')).default;
      const zip = new JSZip();

      setProgress('Fetching marketplace components...');

      // List of files to download
      const files = [
        '/components/marketplace/EmbeddedAppLayout.tsx',
        '/components/marketplace/MarketplaceContainer.tsx',
        '/components/marketplace/MarketplaceCard.tsx',
        '/components/marketplace/GHLMarketplaceConnect.tsx',
        '/App.marketplace.tsx',
        '/MARKETPLACE_REFACTOR_GUIDE.md',
        '/BEFORE_AFTER_MARKETPLACE.md',
        '/MARKETPLACE_IMPLEMENTATION.md',
      ];

      // Fetch all files
      let completed = 0;
      for (const file of files) {
        try {
          setProgress(`Downloading ${file}... (${completed + 1}/${files.length})`);
          
          const response = await fetch(file);
          if (response.ok) {
            const content = await response.text();
            // Remove leading slash for zip path
            const zipPath = file.startsWith('/') ? file.substring(1) : file;
            zip.file(zipPath, content);
          }
          completed++;
        } catch (err) {
          console.error(`Failed to fetch ${file}:`, err);
        }
      }

      setProgress('Creating README...');

      // Add README
      const readme = `# SmileVision Pro - Marketplace Code Package

## 📦 What's Included

This package contains all the marketplace-optimized components for GoHighLevel embedding.

### Components:
- EmbeddedAppLayout.tsx - Main iframe container
- MarketplaceContainer.tsx - Spacing wrapper (8px grid)
- MarketplaceCard.tsx - Reusable card component
- GHLMarketplaceConnect.tsx - OAuth connection UI

### App Entry Point:
- App.marketplace.tsx - Replace your App.tsx with this

### Documentation:
- MARKETPLACE_REFACTOR_GUIDE.md - Complete technical guide
- BEFORE_AFTER_MARKETPLACE.md - Before/after comparison
- MARKETPLACE_IMPLEMENTATION.md - Deployment checklist

## 🚀 Quick Start

1. Extract this ZIP file
2. Copy marketplace components to your project:
   - Copy /components/marketplace/ folder
3. Replace App.tsx:
   - Backup your current App.tsx
   - Use App.marketplace.tsx as your new App.tsx
4. Test locally:
   \`\`\`
   npm run dev
   \`\`\`
5. Visit: http://localhost:5173/marketplace/connect

## 📚 Read the Docs

Start with MARKETPLACE_IMPLEMENTATION.md for step-by-step deployment instructions.

## ✨ Key Features

✅ Embedded-ready (works in iframe)
✅ Mobile-first responsive
✅ 8px grid spacing system
✅ No horizontal scroll
✅ Modal/dropdown fixes for iframe
✅ Auto-detects embedded mode

## 🎯 Next Steps

1. Read MARKETPLACE_IMPLEMENTATION.md
2. Test in iframe locally
3. Deploy to production
4. Submit to GHL Marketplace

Downloaded: ${new Date().toLocaleString()}
From: https://www.smilevisionpro.ai/
`;

      zip.file('README.txt', readme);

      setProgress('Generating ZIP file...');

      // Generate ZIP
      const blob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 9 }
      });

      setProgress('Starting download...');

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SmileVisionPro-Marketplace-${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setProgress('Download complete! ✅');
      
      setTimeout(() => {
        setIsDownloading(false);
        setProgress('');
      }, 3000);

    } catch (error) {
      console.error('Download error:', error);
      setProgress('Download failed. Please try again.');
      setTimeout(() => {
        setIsDownloading(false);
        setProgress('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <FileArchive className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Download Marketplace Code
          </h1>
          <p className="text-gray-600">
            Get all marketplace-optimized components in one ZIP file
          </p>
        </div>

        {/* What's Included */}
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            📦 What's Included
          </h2>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>4 Marketplace Components</strong> - Embedded layout, containers, cards, OAuth UI</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>Updated App.tsx</strong> - Marketplace-ready entry point</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>3 Documentation Files</strong> - Complete guides, before/after, deployment checklist</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span><strong>README</strong> - Quick start instructions</span>
            </li>
          </ul>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600 mb-1">8px</div>
            <div className="text-xs text-gray-600">Grid System</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600 mb-1">100%</div>
            <div className="text-xs text-gray-600">Responsive</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600 mb-1">~860</div>
            <div className="text-xs text-gray-600">Lines of Code</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600 mb-1">GHL</div>
            <div className="text-xs text-gray-600">Marketplace Ready</div>
          </div>
        </div>

        {/* Download Button */}
        <Button
          onClick={downloadZip}
          disabled={isDownloading}
          className="w-full h-14 text-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {progress}
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download ZIP File
            </>
          )}
        </Button>

        {/* Info */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>File size: ~50KB • Format: ZIP • Ready to deploy</p>
        </div>
      </div>
    </div>
  );
}