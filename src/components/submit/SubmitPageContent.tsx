
import React, { useEffect, useCallback, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import SubmitHero from "@/components/submit/SubmitHero";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";

const SubmitPageContent = () => {
  const navigate = useNavigate();
  const { user, loading, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Debug logging
  console.log('SubmitPageContent - Auth State:', {
    user: user?.email,
    loading,
    isAuthenticated,
    timestamp: new Date().toISOString()
  });

  useEffect(() => {
    document.title = "Submit Your Community - Get Featured and Grow";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Submit your community to our platform and connect with like-minded members. Get verified and grow your group with quality members.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Submit your community to our platform and connect with like-minded members. Get verified and grow your group with quality members.";
      document.head.appendChild(meta);
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
      },
    },
  };

  // Show auth modal when not authenticated, navigate when authenticated
  const handleStartSubmission = useCallback(() => {
    console.log('🚀 Start submission clicked, isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ User authenticated, navigating to /submit/complete');
      navigate("/submit/complete");
    } else {
      console.log('❌ User not authenticated, showing auth modal');
      // Set redirect to submit/complete so user returns here after auth
      localStorage.setItem('auth_redirect', '/submit/complete');
      setShowAuthModal(true);
    }
  }, [navigate, isAuthenticated]);

  const handleAuthSuccess = useCallback(() => {
    console.log('✅ Auth success, closing modal');
    setShowAuthModal(false);
    // Navigation will be handled by AuthCallback based on auth_redirect
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.main 
      className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        paddingTop: 'calc(5rem + env(safe-area-inset-top, 0px))',
      }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]"></div>
      </div>

      {/* Content Section */}
      <motion.div variants={containerVariants} className="px-4 sm:px-6 lg:px-8">
        <SubmitHero 
          title="Submit Your Community"
          description="Join thousands of communities that grow with our platform"
          onStartSubmission={handleStartSubmission}
        />
      </motion.div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
    </motion.main>
  );
};

export default SubmitPageContent;
