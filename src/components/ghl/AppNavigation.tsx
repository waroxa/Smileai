import React from 'react';
import { LayoutDashboard, Users, Sparkles, Settings } from 'lucide-react';
import { ViewType } from '../../App';

interface AppNavigationProps {
  activeView: ViewType;
  onNavigate: (view: ViewType) => void;
  primaryColor: string;
}

export function AppNavigation({ activeView, onNavigate, primaryColor }: AppNavigationProps) {
  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients' as ViewType, label: 'Patients', icon: Users },
    { id: 'smile-tool' as ViewType, label: 'Smile Tool', icon: Sparkles },
    { id: 'settings' as ViewType, label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto p-4">
      <div className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              style={isActive ? { backgroundColor: primaryColor } : {}}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Quick Stats in Sidebar */}
      <div className="mt-8 pt-8 border-t border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">Total Patients</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-xs text-gray-600">This Month</p>
          </div>
        </div>
      </div>
    </nav>
  );
}