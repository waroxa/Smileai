import React from 'react';
import { Lightbulb, CheckCircle, AlertTriangle } from 'lucide-react';

export function BrandingTipsCard() {
  const tips = [
    {
      title: 'Logo Best Practices',
      items: [
        'Use a square or horizontal logo format',
        'Transparent PNG works best for versatility',
        'Ensure logo is clear at small sizes (minimum 200px)',
      ],
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Color Guidelines',
      items: [
        'Choose colors that contrast well with white',
        'Test readability with white text on your primary color',
        'Keep accent color visually distinct from primary',
      ],
      icon: Lightbulb,
      color: 'blue',
    },
    {
      title: 'Common Mistakes',
      items: [
        'Avoid very light colors (poor contrast)',
        'Don\'t use low-resolution logos',
        'Test on mobile devices for visibility',
      ],
      icon: AlertTriangle,
      color: 'amber',
    },
  ];

  const colorMap = {
    green: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      text: 'text-green-900',
    },
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      text: 'text-blue-900',
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-600',
      text: 'text-amber-900',
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-gray-700" />
        <h3 className="text-lg font-semibold text-gray-900">Branding Tips</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Follow these guidelines for the best results
      </p>

      <div className="space-y-3">
        {tips.map((tip, index) => {
          const Icon = tip.icon;
          const colors = colorMap[tip.color as keyof typeof colorMap];
          
          return (
            <div 
              key={index}
              className={`rounded-lg border p-4 ${colors.bg} ${colors.border}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colors.icon}`} />
                <div className="flex-1">
                  <h4 className={`text-sm font-semibold mb-2 ${colors.text}`}>
                    {tip.title}
                  </h4>
                  <ul className="space-y-1">
                    {tip.items.map((item, i) => (
                      <li key={i} className="text-xs text-gray-700 flex items-start gap-2">
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Need help? Contact support for branding consultation
        </p>
      </div>
    </div>
  );
}
