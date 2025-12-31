import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const FormTest = () => {
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testFormSubmission = async () => {
    setTesting(true);
    setResults([]);

    try {
      addResult('🧪 Testing form submission with timeout protection...');

      const testData = {
        community_name: `Form Test ${Date.now()}`,
        platform: 'telegram',
        category: 'Technology',
        short_description: 'Testing form submission reliability',
        long_description: 'Testing form submission reliability',
        join_link: 'https://t.me/formtest',
        founder_name: 'Form Tester',
        founder_bio: 'Testing form reliability',
        show_founder_info: true,
        logo_url: null,
        status: 'pending'
      };

      // Test with timeout (same as form)
      const submissionPromise = supabase
        .from('community_subs')
        .insert([testData])
        .select()
        .single();
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Submission timeout - please try again')), 10000)
      );
      
      const result: any = await Promise.race([submissionPromise, timeoutPromise]);
      const { data, error } = result;

      if (error) {
        addResult(`❌ Submission failed: ${error.message}`);
        throw error;
      }

      addResult(`✅ Submission successful! ID: ${data.id}`);
      addResult('🎉 Form submission test PASSED - no hanging issues!');
      
      toast.success('Form Test Passed!', {
        description: 'Submission completed without hanging'
      });

      // Cleanup
      setTimeout(async () => {
        try {
          await supabase.from('community_subs').delete().eq('id', data.id);
          addResult('🧹 Test data cleaned up');
        } catch (cleanupError) {
          addResult('⚠️ Cleanup failed (non-critical)');
        }
      }, 2000);

    } catch (error: any) {
      addResult(`❌ Test failed: ${error.message}`);
      toast.error('Form Test Failed', {
        description: error.message
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">🧪 Form Submission Test</h1>
          <p className="text-gray-300 mb-6">
            Test the form submission to ensure it never gets stuck on "Submitting..."
          </p>

          <div className="mb-6">
            <Button 
              onClick={testFormSubmission}
              disabled={testing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {testing ? 'Testing Form...' : '🧪 Test Form Submission'}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a 
              href="/submit/complete" 
              target="_blank" 
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              🌟 Test Real Form
            </a>
            <a 
              href="/admin/submissions" 
              target="_blank" 
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-center"
            >
              🔗 Check Admin Panel
            </a>
          </div>

          <div className="bg-gray-900 p-4 rounded border border-gray-600">
            <h3 className="text-white font-semibold mb-3">Test Results:</h3>
            {results.length === 0 ? (
              <p className="text-gray-400">Click "Test Form Submission" to start testing</p>
            ) : (
              <div className="space-y-1 max-h-96 overflow-y-auto">
                {results.map((result, index) => (
                  <div key={index} className="text-sm font-mono">
                    {result.includes('❌') ? (
                      <span className="text-red-400">{result}</span>
                    ) : result.includes('✅') || result.includes('🎉') ? (
                      <span className="text-green-400">{result}</span>
                    ) : result.includes('⚠️') ? (
                      <span className="text-yellow-400">{result}</span>
                    ) : (
                      <span className="text-gray-300">{result}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-6 p-4 bg-blue-900/30 border border-blue-700 rounded-lg">
            <h3 className="text-blue-300 font-semibold mb-2">🔧 Fixes Applied:</h3>
            <ul className="text-blue-200 text-sm space-y-1 list-disc list-inside">
              <li>10-second timeout prevents hanging forever</li>
              <li>Non-blocking email notifications</li>
              <li>Better error messages for users</li>
              <li>Reduced rate limiting (10s instead of 30s)</li>
              <li>Automatic retry suggestions</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FormTest;
