import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface GoogleAuthProps {
  onAuthSuccess: () => void;
  title?: string;
  subtitle?: string;
}

const GoogleAuth: React.FC<GoogleAuthProps> = ({ 
  onAuthSuccess, 
  title = "Sign in to Continue",
  subtitle = "Please authenticate to submit your community"
}) => {
  const { user, loading, isAuthenticated, signInWithGoogle, error, clearError } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);

  // Handle authentication success
  useEffect(() => {
    if (isAuthenticated && user) {
      console.log('✅ User authenticated in GoogleAuth:', user.email);
      setShowSuccess(true);
      
      // Small delay to ensure auth state is fully settled
      setTimeout(() => {
        onAuthSuccess();
      }, 100);
    }
  }, [isAuthenticated, user, onAuthSuccess]);

  // Clear error when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  const handleGoogleSignIn = async () => {
    console.log('🔐 Google sign in clicked');
    try {
      await signInWithGoogle();
      console.log('✅ Google sign in completed');
    } catch (error) {
      console.error('❌ Google sign in error:', error);
    }
  };

  // Fallback authentication method (for testing)
  const signInWithEmail = async () => {
    toast.info('Fallback authentication not implemented in this version');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <AnimatePresence mode="wait">
        {showSuccess ? (
          // Success Animation
          <motion.div
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              duration: 0.6 
            }}
            className="flex flex-col items-center justify-center text-center"
          >
            {/* Success Checkmark */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
              className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold text-white mb-3"
            >
              Welcome! 🎉
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-300 text-lg"
            >
              Authentication successful. Proceeding to form...
            </motion.p>
          </motion.div>
        ) : (
          // Login Form
          <motion.div
            key="login"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md p-10 bg-black/20 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl text-center"
          >
            {/* Logo */}
            <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <span className="text-2xl font-bold text-white">C</span>
            </div>
            
            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-2">
              {title}
            </h2>
            
            {/* Subtitle */}
            <p className="text-gray-300 mb-8 leading-relaxed">
              {subtitle}
            </p>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            
            {/* Google Sign-In Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                handleGoogleSignIn();
              }}
              disabled={loading}
              className="w-full bg-white text-gray-800 font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mb-4"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span>
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
            </button>

            {/* Fallback Button (for testing) */}
            <button
              onClick={(e) => {
                e.preventDefault();
                signInWithEmail();
              }}
              disabled={loading}
              className="w-full bg-gray-600 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:bg-gray-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <span>Test with Magic Link (Fallback)</span>
            </button>
            
            {/* Security Note */}
            <p className="text-xs text-gray-400 mt-6 leading-relaxed">
              We use Google authentication to verify your identity and prevent spam submissions.
            </p>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GoogleAuth;
