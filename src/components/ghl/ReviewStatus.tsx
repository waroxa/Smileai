import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Search, 
  UserCheck, 
  Phone,
  Check
} from 'lucide-react';

export type ReviewStatusType = 
  | 'New Smile Submission'
  | 'Media Received'
  | 'Under Review'
  | 'Dentist Reviewed'
  | 'Patient Contacted';

interface ReviewStatusProps {
  status: ReviewStatusType;
  variant?: 'badge' | 'pipeline';
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<ReviewStatusType, {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}> = {
  'New Smile Submission': {
    color: '#3B82F6', // Blue
    bgColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    icon: FileText,
    label: 'New Submission',
    description: 'Awaiting initial review'
  },
  'Media Received': {
    color: '#8B5CF6', // Purple
    bgColor: '#F5F3FF',
    borderColor: '#DDD6FE',
    icon: ImageIcon,
    label: 'Media Received',
    description: 'Files uploaded successfully'
  },
  'Under Review': {
    color: '#F59E0B', // Amber
    bgColor: '#FFFBEB',
    borderColor: '#FDE68A',
    icon: Search,
    label: 'Under Review',
    description: 'Staff reviewing submission'
  },
  'Dentist Reviewed': {
    color: '#10B981', // Green
    bgColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    icon: UserCheck,
    label: 'Dentist Reviewed',
    description: 'Professional review complete'
  },
  'Patient Contacted': {
    color: '#6B7280', // Gray
    bgColor: '#F9FAFB',
    borderColor: '#D1D5DB',
    icon: Phone,
    label: 'Patient Contacted',
    description: 'Follow-up completed'
  }
};

const statusOrder: ReviewStatusType[] = [
  'New Smile Submission',
  'Media Received',
  'Under Review',
  'Dentist Reviewed',
  'Patient Contacted'
];

export function ReviewStatus({ 
  status, 
  variant = 'badge',
  showLabel = true,
  size = 'md'
}: ReviewStatusProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  if (variant === 'badge') {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base'
    };

    const iconSizes = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5'
    };

    return (
      <div
        className={`inline-flex items-center gap-2 rounded-full font-medium border ${sizeClasses[size]}`}
        style={{
          backgroundColor: config.bgColor,
          color: config.color,
          borderColor: config.borderColor
        }}
      >
        <Icon className={iconSizes[size]} />
        {showLabel && <span>{config.label}</span>}
      </div>
    );
  }

  // Pipeline variant - horizontal progress bar
  return (
    <div className="w-full">
      <div className="relative">
        {/* Progress Bar */}
        <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full" />
        <div 
          className="absolute top-6 left-0 h-1 rounded-full transition-all duration-500"
          style={{
            backgroundColor: config.color,
            width: `${(statusOrder.indexOf(status) / (statusOrder.length - 1)) * 100}%`
          }}
        />

        {/* Stages */}
        <div className="relative flex justify-between">
          {statusOrder.map((stageName, index) => {
            const stageConfig = statusConfig[stageName];
            const StageIcon = stageConfig.icon;
            const isActive = stageName === status;
            const isPast = statusOrder.indexOf(stageName) < statusOrder.indexOf(status);
            const isFuture = statusOrder.indexOf(stageName) > statusOrder.indexOf(status);

            return (
              <div key={stageName} className="flex flex-col items-center" style={{ flex: 1 }}>
                {/* Icon Circle */}
                <div
                  className={`w-12 h-12 rounded-full border-2 flex items-center justify-center mb-2 transition-all duration-300 ${
                    isActive ? 'shadow-lg' : ''
                  }`}
                  style={{
                    backgroundColor: isPast || isActive ? stageConfig.color : 'white',
                    borderColor: isPast || isActive ? stageConfig.color : '#E5E7EB',
                    color: isPast || isActive ? 'white' : '#9CA3AF'
                  }}
                >
                  {isPast ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <StageIcon className="w-5 h-5" />
                  )}
                </div>

                {/* Label */}
                <div className="text-center max-w-[100px]">
                  <p
                    className={`text-xs font-medium mb-0.5 ${
                      isActive ? 'font-semibold' : ''
                    }`}
                    style={{
                      color: isPast || isActive ? stageConfig.color : '#6B7280'
                    }}
                  >
                    {stageConfig.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-gray-500">{stageConfig.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Compact status dropdown for changing status
interface StatusDropdownProps {
  currentStatus: ReviewStatusType;
  onStatusChange: (status: ReviewStatusType) => void;
  disabled?: boolean;
}

export function StatusDropdown({ 
  currentStatus, 
  onStatusChange,
  disabled = false 
}: StatusDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const config = statusConfig[currentStatus];

  return (
    <div className="relative">
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: config.color }}
        />
        <span className="text-sm font-medium text-gray-900">{config.label}</span>
        <svg 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
            {statusOrder.map((status) => {
              const statusConf = statusConfig[status];
              const StatusIcon = statusConf.icon;
              const isSelected = status === currentStatus;

              return (
                <button
                  key={status}
                  onClick={() => {
                    onStatusChange(status);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-l-4 ${
                    isSelected ? 'bg-gray-50' : ''
                  }`}
                  style={{
                    borderLeftColor: isSelected ? statusConf.color : 'transparent'
                  }}
                >
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: statusConf.bgColor }}
                  >
                    <StatusIcon className="w-4 h-4" style={{ color: statusConf.color }} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{statusConf.label}</p>
                    <p className="text-xs text-gray-500">{statusConf.description}</p>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
