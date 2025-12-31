import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Shield, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  LogOut,
  AlertTriangle
} from 'lucide-react';

const GoogleAuthTest = () => {
  const { 
    user, 
    session, 
    loading, 
    isAuthenticated, 
    signInWithGoogle, 
    signOut, 
    error, 
    clearError 
  } = useAuth();
  
  const [testResults, setTestResults] = useState<{
    googleClientId: boolean;
    supabaseConfig: boolean;
    authFlow: boolean;
    userDataStorage: boolean;
  }>({
    googleClientId: false,
    supabaseConfig: false,
    authFlow: false,
    userDataStorage: false
  });

  // Test environment configuration
  useEffect(() => {
    const runConfigTests = () => {
      const results = {
        googleClientId: !!import.meta.env.VITE_GOOGLE_CLIENT_ID,
        supabaseConfig: !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY),
        authFlow: false,
        userDataStorage: false
      };

      // Test auth flow
      if (isAuthenticated && user) {
        results.authFlow = true;
        
        // Test user data storage
        const storedData = localStorage.getItem('user_data');
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData);
            results.userDataStorage = !!(parsed.id && parsed.email);
          } catch (e) {
            results.userDataStorage = false;
          }
        }
      }

      setTestResults(results);
    };

    runConfigTests();
  }, [isAuthenticated, user]);

  const handleGoogleSignIn = async () => {
    try {
      console.log('🧪 Testing Google Sign-In...');
      localStorage.setItem('auth_redirect', '/google-auth-test');
      await signInWithGoogle();
    } catch (error) {
      console.error('❌ Google Sign-In test failed:', error);
      toast.error('Google Sign-In failed', {
        description: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🧪 Testing Sign Out...');
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('❌ Sign out test failed:', error);
      toast.error('Sign out failed');
    }
  };

  const TestResult = ({ 
    label, 
    passed, 
    description 
  }: { 
    label: string; 
    passed: boolean; 
    description: string; 
  }) => (
    <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
      <div className="flex items-center gap-3">
        {passed ? (
          <CheckCircle className="h-5 w-5 text-green-500" />
        ) : (
          <XCircle className="h-5 w-5 text-red-500" />
        )}
        <div>
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-gray-400">{description}</p>
        </div>
      </div>
      <Badge variant={passed ? "default" : "destructive"}>
        {passed ? "PASS" : "FAIL"}
      </Badge>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🧪 Google OAuth Test Suite
          </h1>
          <p className="text-gray-300 text-lg">
            Comprehensive testing for Google Authentication integration
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Configuration Tests */}
          <Card className="bg-black/20 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Configuration Tests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <TestResult
                label="Google Client ID"
                passed={testResults.googleClientId}
                description="VITE_GOOGLE_CLIENT_ID environment variable"
              />
              <TestResult
                label="Supabase Configuration"
                passed={testResults.supabaseConfig}
                description="Supabase URL and anonymous key"
              />
              <TestResult
                label="Authentication Flow"
                passed={testResults.authFlow}
                description="User successfully authenticated"
              />
              <TestResult
                label="User Data Storage"
                passed={testResults.userDataStorage}
                description="User data stored in localStorage"
              />
            </CardContent>
          </Card>

          {/* Authentication Status */}
          <Card className="bg-black/20 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="h-5 w-5" />
                Authentication Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                  <span className="ml-3 text-gray-300">Loading...</span>
                </div>
              ) : isAuthenticated && user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-500" />
                    <div>
                      <p className="font-medium text-white">Authenticated</p>
                      <p className="text-sm text-green-300">Google OAuth successful</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail className="h-4 w-4" />
                      <span className="font-medium">Email:</span>
                      <span>{user.email}</span>
                    </div>
                    
                    {user.user_metadata?.full_name && (
                      <div className="flex items-center gap-2 text-gray-300">
                        <User className="h-4 w-4" />
                        <span className="font-medium">Name:</span>
                        <span>{user.user_metadata.full_name}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-300">
                      <Shield className="h-4 w-4" />
                      <span className="font-medium">Provider:</span>
                      <span>{user.app_metadata?.provider || 'google'}</span>
                    </div>
                    
                    {user.user_metadata?.avatar_url && (
                      <div className="flex items-center gap-2">
                        <img 
                          src={user.user_metadata.avatar_url} 
                          alt="Profile" 
                          className="w-12 h-12 rounded-full border-2 border-gray-600"
                        />
                        <span className="text-gray-300">Profile Image</span>
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSignOut}
                    variant="outline"
                    className="w-full mt-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                    <AlertTriangle className="h-6 w-6 text-yellow-500" />
                    <div>
                      <p className="font-medium text-white">Not Authenticated</p>
                      <p className="text-sm text-yellow-300">Click below to test Google Sign-In</p>
                    </div>
                  </div>
                  
                  {error && (
                    <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
                      <p className="text-red-300 font-medium">Error:</p>
                      <p className="text-red-200 text-sm">{error}</p>
                      <Button 
                        onClick={clearError}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Clear Error
                      </Button>
                    </div>
                  )}
                  
                  <Button 
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full bg-white text-gray-800 hover:bg-gray-100"
                  >
                    {loading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    Test Google Sign-In
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Environment Information */}
        <Card className="bg-black/20 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Environment Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Google Client ID:</p>
                <p className="text-white font-mono">
                  {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 
                    `${import.meta.env.VITE_GOOGLE_CLIENT_ID.substring(0, 20)}...` : 
                    'Not configured'
                  }
                </p>
              </div>
              <div>
                <p className="text-gray-400">Site URL:</p>
                <p className="text-white font-mono">
                  {import.meta.env.VITE_SITE_URL || window.location.origin}
                </p>
              </div>
              <div>
                <p className="text-gray-400">Supabase URL:</p>
                <p className="text-white font-mono">
                  {import.meta.env.VITE_SUPABASE_URL ? 
                    `${import.meta.env.VITE_SUPABASE_URL.substring(0, 30)}...` : 
                    'Not configured'
                  }
                </p>
              </div>
              <div>
                <p className="text-gray-400">Redirect URL:</p>
                <p className="text-white font-mono">
                  {`${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="bg-black/20 border-gray-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">1. Google Cloud Console Setup:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Project ID: <code className="bg-gray-800 px-2 py-1 rounded">logical-honor-470009-i7</code></li>
                <li>Enable Google+ API and Google Identity API</li>
                <li>Create OAuth 2.0 credentials</li>
                <li>Add authorized redirect URIs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">2. Supabase Configuration:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Enable Google provider in Authentication settings</li>
                <li>Add Google Client ID and Client Secret</li>
                <li>Configure redirect URLs</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">3. Environment Variables:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Set <code className="bg-gray-800 px-2 py-1 rounded">VITE_GOOGLE_CLIENT_ID</code></li>
                <li>Set <code className="bg-gray-800 px-2 py-1 rounded">VITE_SITE_URL</code></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GoogleAuthTest;