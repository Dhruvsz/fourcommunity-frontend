import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, LogIn, User } from 'lucide-react';

// Admin email allowlist - must match AuthContext
const ADMIN_EMAIL_ALLOWLIST = [
  "dhruv@fourcommunity.com",
  "dhruvchoudhary751@gmail.com"
];

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, userProfile, loading, profileLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  const [forceResolved, setForceResolved] = useState(false);

  // Safety timeout to prevent infinite loading (reduced since we don't need DB profile for admin check)
  useEffect(() => {
    const timeout = setTimeout(() => {
      console.log('⏰ AdminRoute: Force resolving after 5 seconds');
      setForceResolved(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  // Show loading while checking authentication (profile loading is less critical now)
  if (loading && !forceResolved) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
          <p className="text-xs text-gray-600 mt-2">Checking email allowlist</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if user email is not in allowlist
  if (!isAdmin || (forceResolved && !isAdmin)) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl font-semibold text-white">Access Denied</CardTitle>
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
                  <div>{user.email}</div>
                  <div className="text-gray-500">
                    Status: {ADMIN_EMAIL_ALLOWLIST.includes(user.email ?? "") ? 'Admin' : 'Not Authorized'}
                  </div>
                  {forceResolved && (
                    <div className="text-yellow-500 text-xs mt-1">
                      Auth check timed out
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.href = '/'} 
                className="w-full"
                variant="outline"
              >
                <Shield className="mr-2 h-4 w-4" />
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

  // User is authenticated and email is in allowlist - render the protected content
  return <>{children}</>;
};

export default AdminRoute;