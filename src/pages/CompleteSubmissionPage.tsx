import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompleteSubmission from "@/components/submit/CompleteSubmission";
import GoogleAuth from "@/components/auth/GoogleAuth";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const CompleteSubmissionPage = () => {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAuthSuccess = () => {
    console.log('🎉 Auth success in CompleteSubmissionPage');
    // Don't reload, just let the component re-render naturally
    // The auth state change will trigger a re-render automatically
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sf-pro">
        <Navbar />
        <div className="flex-1 bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Redirect to submit page if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col min-h-screen font-sf-pro">
        <Navbar />
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden pt-20">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]"></div>
          </div>
          
          <GoogleAuth 
            onAuthSuccess={handleAuthSuccess}
            title="Authentication Required"
            subtitle="Please sign in to access the submission form"
          />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sf-pro">
      <Navbar />
      <CompleteSubmission />
      <Footer />
    </div>
  );
};

export default CompleteSubmissionPage; 