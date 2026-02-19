import { useEffect, useState } from 'react';
import { toast, Toaster } from 'sonner@2.0.3';
import { Sparkles, Users, X } from 'lucide-react';

export function SocialProofNotifications() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const dentistNames = [
      'Dr. Sarah Martinez',
      'Dr. James Chen',
      'Dr. Emily Rodriguez',
      'Dr. Michael Thompson',
      'Dr. Jennifer Kim',
      'Dr. David Patel',
      'Dr. Lisa Anderson',
      'Dr. Robert Williams',
      'Dr. Amanda Johnson',
      'Dr. Christopher Lee',
      'Dr. Jessica Brown',
      'Dr. Daniel Garcia',
      'Dr. Rachel Davis',
      'Dr. Kevin Nguyen',
      'Dr. Michelle Wilson',
      'Dr. Steven Moore',
      'Dr. Ashley Taylor',
      'Dr. Brian Jackson',
      'Dr. Nicole White',
      'Dr. Jason Harris',
    ];

    const locations = [
      { city: 'Miami', state: 'FL' },
      { city: 'Fort Lauderdale', state: 'FL' },
      { city: 'Orlando', state: 'FL' },
      { city: 'Tampa', state: 'FL' },
      { city: 'Jacksonville', state: 'FL' },
      { city: 'West Palm Beach', state: 'FL' },
      { city: 'Coral Gables', state: 'FL' },
      { city: 'Boca Raton', state: 'FL' },
      { city: 'New York', state: 'NY' },
      { city: 'Los Angeles', state: 'CA' },
      { city: 'Chicago', state: 'IL' },
      { city: 'Houston', state: 'TX' },
      { city: 'Phoenix', state: 'AZ' },
      { city: 'Philadelphia', state: 'PA' },
      { city: 'San Antonio', state: 'TX' },
      { city: 'San Diego', state: 'CA' },
      { city: 'Dallas', state: 'TX' },
      { city: 'Austin', state: 'TX' },
      { city: 'San Francisco', state: 'CA' },
      { city: 'Seattle', state: 'WA' },
      { city: 'Boston', state: 'MA' },
      { city: 'Atlanta', state: 'GA' },
      { city: 'Denver', state: 'CO' },
      { city: 'Las Vegas', state: 'NV' },
      { city: 'Portland', state: 'OR' },
    ];

    const actions = [
      'just got their free smile assessment',
      'just requested a consultation',
      'just uploaded their smile photo',
      'just viewed their AI transformation',
      'just booked a free consultation',
      'just started their smile journey',
    ];

    const timeAgo = [
      'Just now',
      '1 minute ago',
      '2 minutes ago',
      '3 minutes ago',
      '5 minutes ago',
    ];

    let activeToastId: string | number | null = null;

    const showNotification = () => {
      // Dismiss previous toast before showing new one
      if (activeToastId !== null) {
        toast.dismiss(activeToastId);
      }

      const dentist = dentistNames[Math.floor(Math.random() * dentistNames.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const action = actions[Math.floor(Math.random() * actions.length)];
      const time = timeAgo[Math.floor(Math.random() * timeAgo.length)];

      activeToastId = toast.custom(
        (t) => (
          <div className="bg-white rounded-lg shadow-2xl p-3 flex items-center gap-3 max-w-xs border border-gray-200">
            <div className="text-3xl flex-shrink-0">
              🦷
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-900 mb-0.5">
                <strong>{dentist}</strong> in {location.city}, {location.state}
              </p>
              <p className="text-xs text-gray-600">{action}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600">
                ProveSource
              </div>
              <button
                onClick={() => toast.dismiss(t)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ),
        {
          duration: 5000,
          position: 'bottom-left',
        }
      );
    };

    // Show first notification after 3 seconds
    const initialTimeout = setTimeout(() => {
      showNotification();
    }, 3000);

    // Then show every 25 seconds
    const interval = setInterval(() => {
      showNotification();
    }, 25000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
      if (activeToastId !== null) {
        toast.dismiss(activeToastId);
      }
    };
  }, [isClient]);

  if (!isClient) return null;

  return (
    <Toaster 
      position="bottom-left"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: 'toast-custom',
        },
      }}
    />
  );
}