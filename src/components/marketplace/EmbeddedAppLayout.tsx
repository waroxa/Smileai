import { ReactNode, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface EmbeddedAppLayoutProps {
  children: ReactNode;
  maxWidth?: 'full' | 'container';
  showHeader?: boolean;
}

/**
 * EmbeddedAppLayout - Optimized container for GoHighLevel Marketplace embedding
 * 
 * Features:
 * - Detects iframe context
 * - Handles viewport constraints
 * - Prevents scroll issues
 * - Responsive padding using 8px grid
 * - Maintains visual hierarchy
 */
export function EmbeddedAppLayout({ 
  children, 
  maxWidth = 'full',
  showHeader = false 
}: EmbeddedAppLayoutProps) {
  const [isEmbedded, setIsEmbedded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  useEffect(() => {
    // Detect if running in iframe
    const embedded = window.self !== window.top;
    setIsEmbedded(embedded);

    // Handle dynamic viewport height for mobile
    const updateHeight = () => {
      setViewportHeight(`${window.innerHeight}px`);
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);

    // Post message to parent if embedded
    if (embedded) {
      window.parent.postMessage({ 
        type: 'APP_READY',
        source: 'smilevision-pro' 
      }, '*');
    }

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <div 
      className="embedded-app-root"
      style={{
        minHeight: viewportHeight,
        maxHeight: isEmbedded ? viewportHeight : undefined,
      }}
    >
      {/* Embedded Mode Indicator (dev only) */}
      {isEmbedded && process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 right-2 z-50 bg-blue-600 text-white text-xs px-2 py-1 rounded">
          Embedded Mode
        </div>
      )}

      {/* Optional Header - Hidden in embedded mode by default */}
      {showHeader && !isEmbedded && (
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div className={maxWidth === 'container' ? 'max-w-7xl mx-auto' : ''}>
            <h1 className="text-lg font-semibold text-gray-900">SmileVision Pro</h1>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main 
        className={`
          embedded-app-content
          ${maxWidth === 'container' ? 'max-w-7xl mx-auto' : 'w-full'}
          ${isEmbedded ? 'overflow-y-auto' : ''}
        `}
        style={{
          maxHeight: isEmbedded ? `calc(${viewportHeight} - ${showHeader ? '64px' : '0px'})` : undefined,
        }}
      >
        {children}
      </main>

      {/* Embedded Styles */}
      <style>{`
        .embedded-app-root {
          width: 100%;
          overflow-x: hidden;
          background: #f9fafb;
        }

        .embedded-app-content {
          -webkit-overflow-scrolling: touch;
        }

        /* Prevent horizontal scroll */
        .embedded-app-root * {
          max-width: 100%;
        }

        /* Fix for modals in iframe */
        [role="dialog"] {
          position: fixed !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          max-height: 90vh;
          overflow-y: auto;
        }

        /* Dropdown positioning fix */
        [role="menu"],
        [role="listbox"] {
          position: absolute !important;
          max-height: 300px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
}
