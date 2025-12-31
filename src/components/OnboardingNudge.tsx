import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OnboardingNudge = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user just signed up OR logged in and hasn't seen the nudge this session
    const hasSeenNudgeThisSession = sessionStorage.getItem('hasSeenOnboardingNudgeThisSession');
    const justSignedUp = localStorage.getItem('justSignedUp');
    const justLoggedIn = localStorage.getItem('justLoggedIn');
    
    // Show nudge for new signups OR existing users who logged in (once per session)
    if ((justSignedUp === 'true' || justLoggedIn === 'true') && !hasSeenNudgeThisSession) {
      // Show nudge after 1 second
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('hasSeenOnboardingNudgeThisSession', 'true');
    localStorage.removeItem('justSignedUp');
    localStorage.removeItem('justLoggedIn');
  };

  const handleCTAClick = () => {
    sessionStorage.setItem('hasSeenOnboardingNudgeThisSession', 'true');
    localStorage.removeItem('justSignedUp');
    localStorage.removeItem('justLoggedIn');
    navigate('/submit');
  };

  return (
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
  );
};

export default OnboardingNudge;
