
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminAuth from "@/components/admin/AdminAuth";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if already authenticated and session is valid
    const checkAuth = () => {
      try {
        const authData = localStorage.getItem("adminAuth");
        const legacyAuth = localStorage.getItem("adminAuthenticated");
        
        if (authData) {
          const parsed = JSON.parse(authData);
          const now = Date.now();
          
          // Check if session is still valid
          if (parsed.authenticated && parsed.expires > now) {
            console.log('✅ Valid admin session found, redirecting to dashboard');
            navigate("/admin/dashboard");
            return;
          } else {
            // Session expired
            console.log('⏰ Admin session expired, clearing auth');
            localStorage.removeItem("adminAuth");
            localStorage.removeItem("adminAuthenticated");
            toast({
              title: "Session Expired",
              description: "Please log in again to access the admin panel.",
              variant: "destructive",
            });
          }
        } else if (legacyAuth === "true") {
          // Handle legacy auth (no expiry) - redirect but show warning
          console.log('⚠️ Legacy admin session found, redirecting but should re-authenticate');
          navigate("/admin/dashboard");
        }
      } catch (error) {
        console.error('❌ Error checking admin auth:', error);
        // Clear corrupted auth data
        localStorage.removeItem("adminAuth");
        localStorage.removeItem("adminAuthenticated");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    navigate("/admin/dashboard");
  };

  return <AdminAuth onAuthenticate={handleAuthenticate} />;
};

export default Login;
