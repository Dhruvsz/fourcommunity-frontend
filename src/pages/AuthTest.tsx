import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testGoogleAuth = async () => {
    setTesting(true);
    setResults([]);

    try {
      addResult('🧪 Testing Google OAuth configuration...');

      // Test 1: Check environment variables
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      addResult(`✅ Supabase URL: ${supabaseUrl ? 'Present' : 'MISSING'}`);
      addResult(`✅ Supabase Key: ${supabaseKey ? 'Present' : 'MISSING'}`);

      if (!supabaseUrl || !supabaseKey) {
        addResult('❌ Missing environment variables - this will cause auth to fail');
        return;
      }

      // Test 2: Check current URL
      addResult(`🌐 Current origin: ${window.location.origin}`);
      addResult(`🔗 Redirect URL: ${window.location.origin}/account`);

      // Test 3: Try to generate OAuth URL
      addResult('🔄 Attempting to generate Google OAuth URL...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (error) {
        addResult(`❌ OAuth Error: ${error.message}`);
        addResult('🔍 Common causes:');
        addResult('   - Google provider not enabled in Supabase');
        addResult('   - Wrong redirect URLs configured');
        addResult('   - Missing Google OAuth credentials');
        
        toast.error('Google Auth Test Failed', {
          description: error.message
        });
      } else if (data?.url) {
        addResult(`✅ OAuth URL generated successfully!`);
        addResult(`🔗 OAuth URL: ${data.url.substring(0, 100)}...`);
        addResult('🎉 Google OAuth is properly configured!');
        
        toast.success('Google Auth Test Passed!', {
          description: 'OAuth URL generated successfully'
        });

        // Don't actually redirect in test mode
        addResult('ℹ️ Test mode - not redirecting to Google');
      } else {
        addResult('❌ No OAuth URL generated (unknown error)');
        toast.error('OAuth Test Failed', {
          description: 'No authentication URL was generated'
        });
      }

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      toast.error('Test Error', {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  const testActualLogin = async () => {
    try {
      addResult('🚀 Starting actual Google login...');
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/account`
        }
      });

      if (error) {
        addResult(`❌ Login failed: ${error.message}`);
        toast.error('Login Failed', { description: error.message });
      } else if (data?.url) {
        addResult('✅ Redirecting to Google...');
        toast.success('Redirecting to Google...', {
          description: 'Complete authentication in the popup'
        });
        window.location.href = data.url;
      }
    } catch (error: any) {
      addResult(`❌ Login error: ${error.message}`);
      toast.error('Login Error', { description: error.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-white border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">🔐 Google Authentication Test</h1>
          <p className="text-gray-600 mb-6">
            Test Google OAuth configuration to diagnose login issues
          </p>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={testGoogleAuth}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testing ? 'Testing...' : '🧪 Test OAuth Config'}
            </Button>
            
            <Button 
              onClick={testActualLogin}
              disabled={testing}
              className="bg-green-600 hover:bg-green-700"
            >
              🚀 Try Actual Login
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-6">
            <h3 className="text-gray-900 font-semibold mb-3">Test Results:</h3>
            {results.length === 0 ? (
              <p className="text-gray-500">Click "Test OAuth Config" to start testing</p>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result.includes('❌') ? (
                      <span className="text-red-600">{result}</span>
                    ) : result.includes('✅') || result.includes('🎉') ? (
                      <span className="text-green-600">{result}</span>
                    ) : result.includes('⚠️') || result.includes('🔍') ? (
                      <span className="text-yellow-600">{result}</span>
                    ) : (
                      <span className="text-gray-700">{result}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-blue-900 font-semibold mb-2">🔧 Common Fixes:</h3>
            <ul className="text-blue-800 text-sm space-y-1 list-disc list-inside">
              <li>Enable Google provider in Supabase dashboard</li>
              <li>Add correct redirect URLs in Supabase</li>
              <li>Configure Google OAuth credentials</li>
              <li>Set correct Site URL in Supabase</li>
              <li>Check environment variables are deployed</li>
            </ul>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              🔧 Supabase Dashboard
            </a>
            <a 
              href="https://console.cloud.google.com" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-center"
            >
              🔑 Google Console
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AuthTest;