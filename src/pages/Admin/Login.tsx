
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, LogIn, User, Crown } from "lucide-react";
import AdminPasswordPrompt from "@/components/admin/AdminPasswordPrompt";

// Admin email allowlist - must match AuthContext
const ADMIN_EMAIL_ALLOWLIST = [
  "dhruv@fourcommunity.com",
  "dhruvchoudhary751@gmail.com"
];

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading, profileLoading, isAuthenticated, isAdmin } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // Check if admin password is verified in session
  const isPasswordVerified = () => {
    return sessionStorage.getItem("admin_verified") === "true";
  };

  useEffect(() => {
    // If user is already authenticated and is admin, check password verification
    if (isAuthenticated && isAdmin && !loading) {
      if (isPasswordVerified()) {
        console.log('✅ Admin user already authenticated and verified, redirecting to dashboard');
        navigate("/admin/dashboard", { replace: true });
      } else {
        console.log('🔐 Admin user authenticated but needs password verification');
        setShowPasswordPrompt(true);
      }
    }
  }, [isAuthenticated, isAdmin, loading, navigate]);

  // Show loading while checking authentication (profile loading less critical now)
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking admin access...</p>
        </div>
      </div>
    );
  }

  // Show password prompt if user is authenticated admin but not password verified
  if (isAuthenticated && isAdmin && showPasswordPrompt) {
    return (
      <AdminPasswordPrompt
        userEmail={user?.email || ''}
        onPasswordVerified={() => {
          setShowPasswordPrompt(false);
          navigate("/admin/dashboard", { replace: true });
        }}
      />
    );
  }

  // If user is authenticated but not admin, show access denied
  if (isAuthenticated && !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-white">Admin Access Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Your email is not authorized for admin access.
              </p>
              
              <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">Current User:</span>
                </div>
                <div className="ml-5">
                  <div>{user?.email}</div>
                  <div className="text-gray-500">
                    Status: {ADMIN_EMAIL_ALLOWLIST.includes(user?.email ?? "") ? 'Admin' : 'Not Authorized'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/')} 
                className="w-full"
                variant="outline"
              >
                Return to Home
              </Button>
              
              <p className="text-xs text-gray-500 text-center">
                Only specific email addresses have admin privileges.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If not authenticated, show login prompt
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-800">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Crown className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-semibold text-white">Admin Portal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Please sign in to access the admin dashboard.
            </p>
            <p className="text-xs text-gray-500">
              Requires authorized email and admin password.
            </p>
          </div>
          
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/login', { state: { from: '/admin' } })} 
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            
            <Button 
              onClick={() => navigate('/')} 
              className="w-full"
              variant="outline"
            >
              Return to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
