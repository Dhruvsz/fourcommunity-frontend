import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface TestResult {
  step: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: any;
  timestamp: string;
}

const SubmissionDebugTest = () => {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (step: string, status: 'pending' | 'success' | 'error', data?: any, error?: any) => {
    const result: TestResult = {
      step,
      status,
      data,
      error,
      timestamp: new Date().toISOString()
    };
    setResults(prev => [...prev, result]);
    console.log(`[${result.timestamp}] ${step}:`, { status, data, error });
  };

  const runFullDebugTest = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      // STEP 1: Check Supabase Configuration
      addResult('STEP 1: Checking Supabase Configuration', 'pending');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        addResult('STEP 1: Supabase Configuration', 'error', null, 'Missing environment variables');
        return;
      }
      addResult('STEP 1: Supabase Configuration', 'success', { 
        urlExists: !!supabaseUrl, 
        keyExists: !!supabaseKey,
        urlPrefix: supabaseUrl.substring(0, 30) + '...'
      });

      // STEP 2: Test Supabase Connection
      addResult('STEP 2: Testing Supabase Connection', 'pending');
      try {
        const { data: testData, error: testError } = await supabase
          .from('community_subs')
          .select('id')
          .limit(1);
        
        if (testError) {
          addResult('STEP 2: Supabase Connection', 'error', null, testError);
        } else {
          addResult('STEP 2: Supabase Connection', 'success', { message: 'Connection successful', rowCount: testData?.length });
        }
      } catch (connError) {
        addResult('STEP 2: Supabase Connection', 'error', null, connError);
      }

      // STEP 3: Prepare Test Payload
      addResult('STEP 3: Preparing Test Payload', 'pending');
      const testPayload = {
        community_name: 'Test Debug Community',
        platform: 'whatsapp',
        category: 'Technology',
        short_description: 'Debug test submission',
        long_description: 'This community was created to debug the submission pipeline',
        join_link: 'https://example.com',
        join_type: 'free',
        price_inr: null,
        founder_name: 'Test Founder',
        founder_bio: 'Testing the submission system',
        show_founder_profile: true,
        logo_url: null,
        verified_request: false,
        status: 'pending'
      };
      addResult('STEP 3: Test Payload Prepared', 'success', testPayload);

      // STEP 4: Attempt Insert
      addResult('STEP 4: Attempting Supabase Insert', 'pending');
      console.log('🚀 EXECUTING INSERT NOW...');
      console.log('📦 Payload:', JSON.stringify(testPayload, null, 2));
      
      const insertStartTime = Date.now();
      const { data: insertData, error: insertError } = await supabase
        .from('community_subs')
        .insert([testPayload])
        .select()
        .single();
      const insertEndTime = Date.now();
      
      console.log('📡 INSERT RESPONSE RECEIVED');
      console.log('⏱️ Time taken:', insertEndTime - insertStartTime, 'ms');
      console.log('📊 Response Data:', insertData);
      console.log('❌ Response Error:', insertError);

      if (insertError) {
        addResult('STEP 4: Supabase Insert', 'error', null, {
          message: insertError.message,
          details: insertError.details,
          hint: insertError.hint,
          code: insertError.code,
          fullError: insertError
        });
        
        // STEP 5: Analyze Error
        addResult('STEP 5: Error Analysis', 'pending');
        let errorAnalysis = '';
        
        if (insertError.message?.includes('column')) {
          errorAnalysis = 'Column name mismatch or missing column in database schema';
        } else if (insertError.message?.includes('permission') || insertError.message?.includes('policy')) {
          errorAnalysis = 'RLS (Row Level Security) policy blocking insert';
        } else if (insertError.message?.includes('duplicate')) {
          errorAnalysis = 'Duplicate key violation';
        } else if (insertError.message?.includes('null')) {
          errorAnalysis = 'NULL constraint violation - missing required field';
        } else if (insertError.code === 'PGRST204') {
          errorAnalysis = 'Column not found in table schema';
        } else {
          errorAnalysis = 'Unknown error type';
        }
        
        addResult('STEP 5: Error Analysis', 'error', { analysis: errorAnalysis, errorCode: insertError.code });
        
      } else {
        addResult('STEP 4: Supabase Insert', 'success', {
          insertedId: insertData?.id,
          insertedName: insertData?.community_name,
          fullRecord: insertData
        });
        
        // STEP 5: Verify Insert
        addResult('STEP 5: Verifying Insert', 'pending');
        const { data: verifyData, error: verifyError } = await supabase
          .from('community_subs')
          .select('*')
          .eq('id', insertData.id)
          .single();
        
        if (verifyError) {
          addResult('STEP 5: Verification', 'error', null, verifyError);
        } else {
          addResult('STEP 5: Verification', 'success', {
            message: 'Row successfully inserted and verified',
            record: verifyData
          });
        }
      }

      // STEP 6: Check Database Schema
      addResult('STEP 6: Checking Database Schema', 'pending');
      try {
        const { data: schemaData, error: schemaError } = await supabase
          .from('community_subs')
          .select('*')
          .limit(0);
        
        if (schemaError) {
          addResult('STEP 6: Schema Check', 'error', null, schemaError);
        } else {
          addResult('STEP 6: Schema Check', 'success', { 
            message: 'Schema accessible',
            note: 'Check Supabase dashboard for actual column names'
          });
        }
      } catch (schemaErr) {
        addResult('STEP 6: Schema Check', 'error', null, schemaErr);
      }

    } catch (globalError) {
      addResult('GLOBAL ERROR', 'error', null, globalError);
    } finally {
      setIsRunning(false);
      addResult('TEST COMPLETE', 'success', { 
        totalSteps: results.length,
        timestamp: new Date().toISOString()
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-3xl text-white">
              🔬 Community Submission Debug Test
            </CardTitle>
            <p className="text-gray-400 mt-2">
              This page will test the complete submission flow and capture all errors
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={runFullDebugTest}
              disabled={isRunning}
              className="w-full h-14 text-lg"
            >
              {isRunning ? '🔄 Running Test...' : '▶️ Run Full Debug Test'}
            </Button>

            <div className="space-y-3 mt-6">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    result.status === 'success'
                      ? 'bg-green-950/30 border-green-800'
                      : result.status === 'error'
                      ? 'bg-red-950/30 border-red-800'
                      : 'bg-blue-950/30 border-blue-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">
                          {result.status === 'success' ? '✅' : result.status === 'error' ? '❌' : '⏳'}
                        </span>
                        <span className="font-semibold text-white">{result.step}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{result.timestamp}</div>
                      
                      {result.data && (
                        <div className="mt-2 p-3 bg-gray-950 rounded border border-gray-800">
                          <div className="text-xs text-gray-400 mb-1">Data:</div>
                          <pre className="text-xs text-green-400 overflow-x-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="mt-2 p-3 bg-red-950/50 rounded border border-red-800">
                          <div className="text-xs text-red-400 mb-1">Error:</div>
                          <pre className="text-xs text-red-300 overflow-x-auto">
                            {JSON.stringify(result.error, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {results.length > 0 && (
              <div className="mt-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">📋 Test Summary</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-400">
                      {results.filter(r => r.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-400">Pending</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400">
                      {results.filter(r => r.status === 'success').length}
                    </div>
                    <div className="text-sm text-gray-400">Success</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-red-400">
                      {results.filter(r => r.status === 'error').length}
                    </div>
                    <div className="text-sm text-gray-400">Errors</div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-950/30 border border-yellow-800 rounded-lg">
              <div className="text-yellow-400 font-semibold mb-2">📝 Instructions:</div>
              <ol className="text-sm text-yellow-200 space-y-1 list-decimal list-inside">
                <li>Click "Run Full Debug Test" button above</li>
                <li>Open browser DevTools (F12) and go to Console tab</li>
                <li>Open Network tab and filter by "community_subs"</li>
                <li>Watch the test results appear below</li>
                <li>Check console for detailed logs</li>
                <li>If insert fails, error details will show in red boxes</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubmissionDebugTest;
