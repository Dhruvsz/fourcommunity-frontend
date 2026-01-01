import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, LogIn, User } from 'lucide-react';

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { user, userProfile, loading, profileLoading, isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication and profile
  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Show access denied if user is authenticated but not admin
  if (!isAdmin) {
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
                You don't have administrator privileges to access this area.
              </p>
              
              <div className="bg-gray-800 p-3 rounded-lg text-xs text-gray-300">
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-3 w-3" />
                  <span className="font-medium">Current User:</span>
                </div>
                <div className="ml-5">
                  <div>{userProfile?.email || user.email}</div>
                  <div className="text-gray-500">
                    Role: {isAdmin ? 'Administrator' : 'User'}
                  </div>
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
                If you believe this is an error, please contact the administrator.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // User is authenticated and is admin - render the protected content
  return <>{children}</>;
};

export default AdminRoute;