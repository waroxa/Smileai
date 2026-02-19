import { ReactNode } from 'react';

interface MarketplaceContainerProps {
  children: ReactNode;
  spacing?: 'compact' | 'normal' | 'spacious';
  noPadding?: boolean;
}

/**
 * MarketplaceContainer - Consistent spacing wrapper using 8px grid
 * 
 * Spacing scale (8px grid):
 * - compact: 16px (2 units)
 * - normal: 24px (3 units)
 * - spacious: 32px (4 units)
 */
export function MarketplaceContainer({ 
  children, 
  spacing = 'normal',
  noPadding = false 
}: MarketplaceContainerProps) {
  const spacingMap = {
    compact: 'p-4',      // 16px
    normal: 'p-4 sm:p-6',   // 16px mobile, 24px desktop
    spacious: 'p-6 sm:p-8', // 24px mobile, 32px desktop
  };

  return (
    <div className={`
      w-full
      ${noPadding ? '' : spacingMap[spacing]}
    `}>
      {children}
    </div>
  );
}
