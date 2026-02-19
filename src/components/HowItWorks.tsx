import { Upload, Sparkles, Video, Calendar } from 'lucide-react';

export function HowItWorks() {
  const steps = [
    {
      icon: Upload,
      title: 'Upload Your Photo',
      description: 'Take a quick selfie or upload an existing photo showing your current smile.',
      color: 'from-teal-500 to-teal-600',
    },
    {
      icon: Sparkles,
      title: 'AI Analysis',
      description: 'Our advanced AI instantly analyzes and enhances your smile in seconds.',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Video,
      title: 'Watch AI Preview',
      description: 'See your AI-enhanced smile come to life with an animated video preview.',
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Calendar,
      title: 'Book Free Consult',
      description: 'Love your AI preview? Schedule a free consultation with our expert team.',
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <section id="how-it-works" className="py-12 sm:py-16 lg:py-20 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 border border-teal-200 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span className="text-sm font-medium text-teal-700">AI-Powered Process</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Get your AI-enhanced dream smile preview in 4 simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 px-4 sm:px-6 lg:px-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 -z-10"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-white border-2 border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:border-teal-200 transition-all duration-300">
                {/* Step Number */}
                <div className="absolute -top-3 -left-3 w-9 h-9 bg-gradient-to-br from-teal-600 to-blue-600 rounded-full flex items-center justify-center text-white text-base font-bold shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mb-4 mx-auto shadow-md`}>
                  <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 sm:mt-16 text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 font-medium">Ready to see your AI-enhanced smile?</p>
          <button
            onClick={() => {
              const section = document.getElementById('smile-transform');
              section?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>Try AI Smile Preview Free</span>
            <Sparkles className="w-5 h-5" />
          </button>
          <p className="text-xs sm:text-sm text-gray-500 mt-3">No credit card required • Results in 30 seconds</p>
        </div>
      </div>
    </section>
  );
}