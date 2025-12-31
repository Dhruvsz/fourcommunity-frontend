import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthDebug = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addResult('🔄 Testing Supabase connection...');
      const { data, error } = await supabase.from('user_profiles').select('count').limit(1);
      
      if (error) {
        addResult(`❌ Supabase connection failed: ${error.message}`);
        return false;
      }
      
      addResult('✅ Supabase connection successful');
      return true;
    } catch (err: any) {
      addResult(`❌ Supabase connection exception: ${err.message}`);
      return false;
    }
  };

  const testEmailSignup = async () => {
    try {
      const testEmail = `debugtest${Date.now()}@example.com`;
      const testPassword = 'DebugTest123!';
      const testName = 'Debug Test User';
      
      addResult(`🔄 Testing email signup with: ${testEmail}`);
      
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            full_name: testName,
            display_name: testName
          }
        }
      });
      
      if (error) {
        addResult(`❌ Email signup failed: ${error.message}`);
        return false;
      }
      
      if (!data.user) {
        addResult('❌ No user data returned from signup');
        return false;
      }
      
      addResult(`✅ Email signup successful - User ID: ${data.user.id}`);
      
      // Test profile creation
      addResult('🔄 Testing profile creation...');
      
      const profileData = {
        id: data.user.id,
        email: data.user.email,
        full_name: testName,
        avatar_url: null,
        provider: 'email',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const { data: profileResult, error: profileError } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();
      
      if (profileError) {
        addResult(`❌ Profile creation failed: ${profileError.message}`);
        return false;
      }
      
      addResult('✅ Profile created successfully');
      return true;
      
    } catch (err: any) {
      addResult(`❌ Email signup exception: ${err.message}`);
      return false;
    }
  };

  const testGoogleOAuth = async () => {
    try {
      addResult('🔄 Testing Google OAuth configuration...');
      
      const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      addResult(`📋 Google Client ID: ${googleClientId ? 'Configured' : 'Missing'}`);
      
      if (!googleClientId || googleClientId === 'your_google_client_id_here') {
        addResult('❌ Google Client ID not properly configured');
        return false;
      }
      
      // Ensure redirect URL is always correct
      const baseUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
      const redirectUrl = `${baseUrl}/auth/callback`;
      addResult(`📋 Base URL: ${baseUrl}`);
      addResult(`📋 Redirect URL: ${redirectUrl}`);
      addResult(`📋 Window Origin: ${window.location.origin}`);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account',
          },
        }
      });
      
      if (error) {
        addResult(`❌ Google OAuth config failed: ${error.message}`);
        return false;
      }
      
      addResult('✅ Google OAuth configuration valid');
      return true;
      
    } catch (err: any) {
      addResult(`❌ Google OAuth exception: ${err.message}`);
      return false;
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setTestResults([]);
    
    addResult('🚀 Starting authentication debug tests...');
    
    const supabaseTest = await testSupabaseConnection();
    const emailTest = await testEmailSignup();
    const googleTest = await testGoogleOAuth();
    
    addResult('');
    addResult('📊 Test Results Summary:');
    addResult(`Supabase Connection: ${supabaseTest ? '✅ PASS' : '❌ FAIL'}`);
    addResult(`Email Signup: ${emailTest ? '✅ PASS' : '❌ FAIL'}`);
    addResult(`Google OAuth Config: ${googleTest ? '✅ PASS' : '❌ FAIL'}`);
    
    if (supabaseTest && emailTest && googleTest) {
      addResult('');
      addResult('🎉 All tests passed! Authentication should work.');
      toast.success('All authentication tests passed!');
    } else {
      addResult('');
      addResult('⚠️ Some tests failed. Check results above.');
      toast.error('Some authentication tests failed');
    }
    
    setIsLoading(false);
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Authentication Debug Tool</h1>
          
          <div className="space-y-4 mb-6">
            <button
              onClick={runAllTests}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-3 px-6 rounded-xl transition-colors"
            >
              {isLoading ? 'Running Tests...' : 'Run All Tests'}
            </button>
            
            <button
              onClick={clearResults}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors ml-4"
            >
              Clear Results
            </button>
          </div>
          
          <div className="bg-black/20 rounded-xl p-4 max-h-96 overflow-y-auto">
            <h2 className="text-lg font-semibold text-white mb-4">Test Results:</h2>
            {testResults.length === 0 ? (
              <p className="text-gray-400">No tests run yet. Click "Run All Tests" to start.</p>
            ) : (
              <div className="space-y-1">
                {testResults.map((result, index) => (
                  <div key={index} className="text-sm font-mono text-gray-300">
                    {result}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 text-sm text-gray-400">
            <p><strong>Environment Info:</strong></p>
            <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL}</p>
            <p>Site URL: {import.meta.env.VITE_SITE_URL || window.location.origin}</p>
            <p>Google Client ID: {import.meta.env.VITE_GOOGLE_CLIENT_ID ? 'Configured' : 'Missing'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthDebug;