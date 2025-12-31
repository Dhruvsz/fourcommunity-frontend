import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AdminGuardProps {
  children: React.ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = () => {
      try {
        const authData = localStorage.getItem("adminAuth");
        const legacyAuth = localStorage.getItem("adminAuthenticated");
        
        if (authData) {
          const parsed = JSON.parse(authData);
          const now = Date.now();
          
          // Check if session is still valid
          if (parsed.authenticated && parsed.expires > now) {
            console.log('✅ Admin authorized, session valid');
            setIsAuthorized(true);
            setIsLoading(false);
            return;
          } else {
            // Session expired
            console.log('⏰ Admin session expired, redirecting to login');
            localStorage.removeItem("adminAuth");
            localStorage.removeItem("adminAuthenticated");
            toast({
              title: "Session Expired",
              description: "Your admin session has expired. Please log in again.",
              variant: "destructive",
            });
            navigate("/admin");
            return;
          }
        } else if (legacyAuth === "true") {
          // Handle legacy auth - allow but warn
          console.log('⚠️ Using legacy admin auth');
          setIsAuthorized(true);
          setIsLoading(false);
          return;
        } else {
          // No authentication found
          console.log('❌ No admin authentication found, redirecting to login');
          // Don't show toast on initial load, just redirect silently
          navigate("/admin", { replace: true });
          return;
        }
      } catch (error) {
        console.error('❌ Error checking admin authorization:', error);
        // Clear corrupted auth data
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminAuthenticated");
        navigate("/admin");
      }
      
      setIsLoading(false);
    };

    checkAuthorization();

    // Check authorization every 5 minutes
    const interval = setInterval(checkAuthorization, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
};