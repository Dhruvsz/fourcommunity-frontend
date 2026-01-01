
import React, { useState } from "react";
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
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  // Check if admin password is verified in session
  const isPasswordVerified = () => {
    return sessionStorage.getItem("admin_verified") === "true";
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show password prompt if user is authenticated admin but not password verified
  if (isAuthenticated && isAdmin && !isPasswordVerified() && showPasswordPrompt) {
    return (
      <AdminPasswordPrompt
        userEmail={user?.email || ''}
        onPasswordVerified={() => {
          setShowPasswordPrompt(false);
          // AdminRoute will handle the navigation - we just close the prompt
        }}
      />
    );
  }

  // If user is authenticated and admin and password verified, show success
  if (isAuthenticated && isAdmin && isPasswordVerified()) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Crown className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-white">Admin Access Granted</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                You have been successfully authenticated as an administrator.
              </p>
              
              <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">Admin User:</span>
                </div>
                <div className="ml-5">
                  <div>{user?.email}</div>
                  <div className="text-green-500">✓ Email Authorized</div>
                  <div className="text-green-500">✓ Password Verified</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/admin/dashboard'} 
                className="w-full"
              >
                <Crown className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is authenticated and admin but needs password verification
  if (isAuthenticated && isAdmin && !isPasswordVerified()) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-white">Admin Verification Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Your email is authorized. Please verify your admin password.
              </p>
              
              <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">Authorized User:</span>
                </div>
                <div className="ml-5">
                  <div>{user?.email}</div>
                  <div className="text-green-500">✓ Email Verified</div>
                  <div className="text-yellow-500">⏳ Password Required</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => setShowPasswordPrompt(true)} 
                className="w-full"
              >
                <Shield className="mr-2 h-4 w-4" />
                Enter Admin Password
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
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
                  <div className="text-gray-500">Status: Not Authorized</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/'} 
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
              onClick={() => window.location.href = '/login'} 
              className="w-full"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'} 
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
