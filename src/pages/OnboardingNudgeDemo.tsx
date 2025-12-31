import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const OnboardingNudgeDemo = () => {
  const [isVisible, setIsVisible] = useState(true);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCTAClick = () => {
    navigate('/submit');
  };

  const handleReset = () => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 100);
  };

  return (
    <div className="flex flex-col min-h-screen font-sf-pro">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                Onboarding Nudge Demo
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                This is how the post-signup nudge appears to new users on the homepage
              </p>
              
              <button
                onClick={handleReset}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Reset Demo
              </button>
            </div>

            {/* Demo Content */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Demo Instructions</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Trigger:</strong> This nudge appears automatically 1 second after a new user signs up and lands on the homepage.
                </p>
                <p>
                  <strong className="text-white">Position:</strong> Bottom-right corner of the screen (look there now!)
                </p>
                <p>
                  <strong className="text-white">Behavior:</strong>
                </p>
                <ul className="list-disc list-inside ml-4 space-y-2">
                  <li>Smooth fade-in + slide-up animation</li>
                  <li>Click the X button to dismiss</li>
                  <li>Click "Add your community →" to go to submit page</li>
                  <li>Shows only once per user (tracked in localStorage)</li>
                  <li>Never appears again after interaction</li>
                </ul>
                <p>
                  <strong className="text-white">Design:</strong> Dark navy background with blue-purple glow, matching the existing design system.
                </p>
              </div>
            </div>

            {/* Visual Reference */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              <h2 className="text-2xl font-bold text-white mb-4">Component Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-semibold">Icon</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Sparkles icon in gradient square (blue to purple)
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <X className="w-5 h-5 text-purple-400" />
                    <span className="text-white font-semibold">Close Button</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Dismissible with X button in top-right corner
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-purple-600 rounded"></div>
                    <span className="text-white font-semibold">Gradient Glow</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Subtle blue-purple border and glow effect
                  </p>
                </div>

                <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-5 h-5 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-white font-semibold">Animation</span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    Smooth 300ms fade-in with slide-up transition
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />

      {/* The Actual Onboarding Nudge */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-8 right-8 z-50 max-w-sm"
          >
            <div className="relative bg-gradient-to-br from-[#1a2332] to-[#0f1419] border border-blue-500/30 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-600/10 blur-xl -z-10"></div>
              
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Icon */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white">Own a community?</h3>
              </div>

              {/* Body text */}
              <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                You can now list your community on FourCommunity and earn when people join.
              </p>

              {/* CTA button */}
              <button
                onClick={handleCTAClick}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Add your community</span>
                <svg 
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingNudgeDemo;
