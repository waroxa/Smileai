import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Shield, CheckCircle, TrendingUp, Upload, 
  FileImage, Brain, Activity, AlertCircle, ExternalLink 
} from 'lucide-react';
import { Button } from '../ui/button';
import { EmbeddedAppLayout } from './EmbeddedAppLayout';

/**
 * SmileVisionMarketplaceApp - Premium SaaS interface for GHL Marketplace
 * Mobile-first (390×844), designed for iframe embedding
 */
export function SmileVisionMarketplaceApp() {
  const [isInstalled, setIsInstalled] = useState(false);

  return (
    <EmbeddedAppLayout maxWidth="full">
      <div className="min-h-screen bg-gray-50" style={{ maxWidth: '100vw', overflow: 'hidden' }}>
        {/* Header Bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="px-4 py-4">
            <div className="flex items-center gap-3">
              {/* Logo Placeholder */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0E7C86] to-[#0A9AA6] flex items-center justify-center shadow-sm">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-semibold text-gray-900 truncate">
                  SmileVisionPro AI
                </h1>
                <p className="text-xs text-gray-500 truncate">
                  AI-Powered Dental Imaging & Case Insights
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="px-4 py-6">
          <AnimatePresence mode="wait">
            {!isInstalled ? (
              <NotInstalledState onInstall={() => setIsInstalled(true)} />
            ) : (
              <InstalledState />
            )}
          </AnimatePresence>
        </main>
      </div>
    </EmbeddedAppLayout>
  );
}

/**
 * STATE 1: Not Installed - Connection prompt
 */
function NotInstalledState({ onInstall }: { onInstall: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto"
    >
      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Visual Header */}
        <div className="bg-gradient-to-br from-[#0E7C86] to-[#0A9AA6] px-6 py-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Connect SmileVisionPro AI
          </h2>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed">
            Enable AI-powered dental imaging analysis, diagnostics assistance, and visual case insights directly inside your GoHighLevel workspace.
          </p>

          {/* Features */}
          <div className="space-y-3">
            <FeatureItem 
              icon={<FileImage className="w-4 h-4" />}
              text="Advanced dental image analysis"
            />
            <FeatureItem 
              icon={<Brain className="w-4 h-4" />}
              text="AI-powered diagnostic insights"
            />
            <FeatureItem 
              icon={<Activity className="w-4 h-4" />}
              text="Real-time case confidence scoring"
            />
            <FeatureItem 
              icon={<Shield className="w-4 h-4" />}
              text="HIPAA-compliant data handling"
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={onInstall}
              className="w-full h-12 bg-[#0E7C86] hover:bg-[#0A6B75] text-white font-medium rounded-xl shadow-sm"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Connect / Install App
            </Button>

            <button className="w-full text-sm text-[#0E7C86] hover:text-[#0A6B75] font-medium py-2 flex items-center justify-center gap-2">
              Learn More
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-start gap-2 pt-2">
            <Shield className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 leading-relaxed">
              Secure OAuth connection • No patient data stored without consent
            </p>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <InfoCard
          icon={<TrendingUp className="w-5 h-5 text-[#0E7C86]" />}
          title="98.5%"
          subtitle="AI Accuracy"
        />
        <InfoCard
          icon={<Activity className="w-5 h-5 text-[#0E7C86]" />}
          title="< 2 sec"
          subtitle="Analysis Time"
        />
      </div>
    </motion.div>
  );
}

/**
 * STATE 2: Installed - Dashboard view
 */
function InstalledState() {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'recent'>('upload');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto space-y-4"
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          value="12"
          label="Analyses Today"
          trend="+3"
          color="text-[#0E7C86]"
        />
        <MetricCard
          value="847"
          label="Cases Processed"
          trend="+24"
          color="text-[#0E7C86]"
        />
        <MetricCard
          value="96.2%"
          label="AI Confidence"
          trend="+1.2%"
          color="text-green-600"
        />
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 px-1 pt-1">
          <div className="flex gap-1">
            <TabButton
              active={selectedTab === 'upload'}
              onClick={() => setSelectedTab('upload')}
              icon={<Upload className="w-4 h-4" />}
              label="Upload"
            />
            <TabButton
              active={selectedTab === 'recent'}
              onClick={() => setSelectedTab('recent')}
              icon={<FileImage className="w-4 h-4" />}
              label="Recent"
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="px-4 py-6">
          <AnimatePresence mode="wait">
            {selectedTab === 'upload' ? (
              <UploadTab key="upload" />
            ) : (
              <RecentTab key="recent" />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <Brain className="w-5 h-5 text-[#0E7C86]" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              AI Insights Summary
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Last 7 days: 94% of cases showed high confidence. Top detected conditions: Caries (32%), Calculus (28%), Gum Disease (18%).
            </p>
            <button className="text-xs font-medium text-[#0E7C86] hover:text-[#0A6B75]">
              View Full Report →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Upload Tab Content
 */
function UploadTab() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4"
    >
      {/* Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#0E7C86] transition-colors cursor-pointer">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-3">
          <Upload className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-1">
          Upload Dental Image
        </h3>
        <p className="text-xs text-gray-500 mb-4">
          Drop file here or click to browse
        </p>
        <Button
          size="sm"
          className="bg-[#0E7C86] hover:bg-[#0A6B75] text-white rounded-lg"
        >
          Select File
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 gap-2">
          <QuickActionButton
            icon={<FileImage className="w-4 h-4" />}
            label="X-Ray Analysis"
          />
          <QuickActionButton
            icon={<Activity className="w-4 h-4" />}
            label="Smile Assessment"
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Recent Tab Content
 */
function RecentTab() {
  const analyses = [
    { id: 1, patient: 'Patient #A8472', date: '2 hours ago', confidence: 98, status: 'Complete' },
    { id: 2, patient: 'Patient #B2193', date: '5 hours ago', confidence: 94, status: 'Complete' },
    { id: 3, patient: 'Patient #C7841', date: 'Yesterday', confidence: 96, status: 'Complete' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-3"
    >
      {analyses.map((analysis) => (
        <AnalysisCard key={analysis.id} {...analysis} />
      ))}
    </motion.div>
  );
}

/* ============================================
   COMPONENT LIBRARY
   ============================================ */

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-[#0E7C86] mt-0.5">
        {icon}
      </div>
      <span className="text-sm text-gray-700">{text}</span>
    </div>
  );
}

function InfoCard({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
      <div className="inline-flex items-center justify-center mb-2">
        {icon}
      </div>
      <div className="text-lg font-semibold text-gray-900">{title}</div>
      <div className="text-xs text-gray-500">{subtitle}</div>
    </div>
  );
}

function MetricCard({ value, label, trend, color }: { value: string; label: string; trend: string; color: string }) {
  return (
    <div className="bg-white rounded-xl p-3 border border-gray-200">
      <div className={`text-lg font-bold ${color} mb-0.5`}>{value}</div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xs font-medium text-green-600">{trend}</div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors
        ${active 
          ? 'bg-white text-[#0E7C86] border-b-2 border-[#0E7C86]' 
          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
        }
      `}
    >
      {icon}
      {label}
    </button>
  );
}

function QuickActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex flex-col items-center gap-2 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
      <div className="text-[#0E7C86]">
        {icon}
      </div>
      <span className="text-xs font-medium text-gray-700">{label}</span>
    </button>
  );
}

function AnalysisCard({ patient, date, confidence, status }: { patient: string; date: string; confidence: number; status: string }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0E7C86] to-[#0A9AA6] rounded-lg flex items-center justify-center">
        <FileImage className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900">{patient}</div>
        <div className="text-xs text-gray-500">{date}</div>
      </div>
      <div className="flex-shrink-0 text-right">
        <div className="text-sm font-semibold text-[#0E7C86]">{confidence}%</div>
        <div className="text-xs text-gray-500">{status}</div>
      </div>
    </div>
  );
}
