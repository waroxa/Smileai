import React from 'react';
import { TrendingUp, Users, Calendar, Sparkles, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { ClinicBranding } from '../../App';
import { MetricCard } from './shared/MetricCard';
import { DataTable } from './shared/DataTable';
import { ChartCard } from './shared/ChartCard';
import { WelcomeBanner } from './WelcomeBanner';
import { useState } from 'react';

interface DashboardViewProps {
  clinicBranding: ClinicBranding;
}

export function DashboardView({ clinicBranding }: DashboardViewProps) {
  const [showWelcome, setShowWelcome] = useState(true);

  // No dummy data - empty by default
  const recentPatients: any[] = [];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      {showWelcome && <WelcomeBanner onClose={() => setShowWelcome(false)} />}

      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Welcome back! Here's your practice overview.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Patients"
          value="0"
          change="+0%"
          trend="up"
          icon={Users}
          primaryColor={clinicBranding.primaryColor}
        />
        <MetricCard
          title="Smile Assessments"
          value="0"
          change="+0%"
          trend="up"
          icon={Sparkles}
          primaryColor={clinicBranding.primaryColor}
        />
        <MetricCard
          title="Scheduled Consults"
          value="0"
          change="+0%"
          trend="up"
          icon={Calendar}
          primaryColor={clinicBranding.primaryColor}
        />
        <MetricCard
          title="Conversion Rate"
          value="0%"
          change="+0%"
          trend="up"
          icon={TrendingUp}
          primaryColor={clinicBranding.primaryColor}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard
          title="Patient Engagement"
          subtitle="Last 30 days"
          primaryColor={clinicBranding.primaryColor}
        />
        <ChartCard
          title="Conversion Funnel"
          subtitle="This month"
          primaryColor={clinicBranding.primaryColor}
        />
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <p className="text-sm text-gray-600 mt-1">Latest patient interactions and assessments</p>
        </div>
        {recentPatients.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No patient activity yet</p>
            <p className="text-sm text-gray-400 mt-1">Patient interactions will appear here</p>
          </div>
        ) : (
          <DataTable
            columns={['Patient', 'Service', 'Date', 'Status']}
            rows={recentPatients.map(patient => [
              patient.name,
              patient.service,
              patient.date,
              <span
                key={patient.name}
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  patient.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : patient.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {patient.status}
              </span>
            ])}
          />
        )}
      </div>
    </div>
  );
}