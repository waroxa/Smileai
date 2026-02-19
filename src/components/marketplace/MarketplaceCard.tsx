import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface MarketplaceCardProps {
  children: ReactNode;
  title?: string;
  description?: string;
  action?: ReactNode;
  spacing?: 'compact' | 'normal';
  hover?: boolean;
  className?: string;
}

/**
 * MarketplaceCard - Reusable card component with consistent spacing
 * 
 * Uses 8px grid system:
 * - Padding: 16px (compact) or 24px (normal)
 * - Gap: 16px between elements
 * - Border radius: 12px (standard)
 */
export function MarketplaceCard({ 
  children, 
  title,
  description,
  action,
  spacing = 'normal',
  hover = false,
  className = ''
}: MarketplaceCardProps) {
  const paddingMap = {
    compact: 'p-4',  // 16px
    normal: 'p-4 sm:p-6', // 16px mobile, 24px desktop
  };

  const CardWrapper = hover ? motion.div : 'div';
  const hoverProps = hover ? {
    whileHover: { scale: 1.02 },
    transition: { duration: 0.2 }
  } : {};

  return (
    <CardWrapper
      className={`
        bg-white
        border border-gray-200
        rounded-xl
        shadow-sm
        ${paddingMap[spacing]}
        ${hover ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
        ${className}
      `}
      {...hoverProps}
    >
      {/* Header */}
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-gray-600">
                {description}
              </p>
            )}
          </div>
          {action && (
            <div className="flex-shrink-0">
              {action}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {children}
      </div>
    </CardWrapper>
  );
}
