import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { notifyNewSubmission } from '@/lib/emailNotification';
import { useSubmissions } from '@/contexts/SubmissionContext';

const AutoLoadTest = () => {
  const [status, setStatus] = useState('Ready to test auto-loading...');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { updateSubmissionStatus } = useSubmissions();

  const testAutoLoading = async () => {
    try {
      setStatus('🚀 Step 1: Creating test community...');
      
      // Create test community
      const testCommunity = {
        community_name: `Auto-Load Test ${Date.now()}`,
        platform: 'telegram',
        category: 'Technology',
        short_description: 'Testing automatic loading of new communities',
        long_description: 'This community tests whether new approved communities automatically appear on the Communities page',
        join_link: 'https://t.me/autoloadtest',
        founder_name: 'Auto Load Tester',
        founder_bio: 'Testing automatic community loading',
        show_founder_info: true,
        logo_url: null,
        status: 'pending'
      };

      const { data: submission, error: submitError } = await supabase
        .from('community_subs')
        .insert([testCommunity])
        .select()
        .single();

      if (submitError) {
        setStatus(`❌ Failed to create test: ${submitError.message}`);
        return;
      }

      setSubmissionId(submission.id.toString());
      setStatus(`✅ Step 1 Complete: Test community created (ID: ${submission.id})`);

      // Wait 2 seconds
      setTimeout(async () => {
        setStatus('👨‍💼 Step 2: Approving community (this should auto-load on Communities page)...');
        
        try {
          // Approve the community using the context (this triggers all events)
          await updateSubmissionStatus(submission.id.toString(), 'approved', 'Auto-load test approval');
          
          setStatus('✅ Step 2 Complete: Community approved! Check Communities page - it should appear automatically within 15 seconds.');
          
          // Send email notification
          try {
            await notifyNewSubmission({
              community_name: testCommunity.community_name,
              founder_name: testCommunity.founder_name,
              founder_email: 'autoload@test.com',
              category: testCommunity.category,
              platform: testCommunity.platform,
              short_description: testCommunity.short_description,
              join_link: testCommunity.join_link,
              submitted_at: new Date().toISOString(),
              submission_id: submission.id.toString()
            });
            
            setStatus(prev => prev + '\n📧 Email notification sent to dhruvchoudhary751@gmail.com');
          } catch (emailError) {
            setStatus(prev => prev + '\n⚠️ Email notification failed (non-critical)');
          }
          
        } catch (approvalError) {
          setStatus(`❌ Approval failed: ${approvalError.message}`);
        }
      }, 2000);

    } catch (error) {
      setStatus(`❌ Test failed: ${error.message}`);
    }
  };

  const cleanup = async () => {
    if (!submissionId) return;
    
    try {
      await supabase
        .from('community_subs')
        .delete()
        .eq('id', submissionId);
      
      setStatus('🧹 Test data cleaned up');
      setSubmissionId(null);
    } catch (error) {
      setStatus(`❌ Cleanup failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">🔄 Auto-Loading Test</h1>
          <p className="text-gray-300 mb-6">
            This test creates and approves a community to verify it automatically appears on the Communities page.
          </p>

          <div className="mb-6">
            <div className="text-lg text-white mb-2">Test Status:</div>
            <div className="p-3 bg-gray-900 rounded border border-gray-600 font-mono text-sm whitespace-pre-wrap">
              {status}
            </div>
          </div>

          <div className="flex gap-4 mb-6">
            <Button 
              onClick={testAutoLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🧪 Test Auto-Loading
            </Button>

            {submissionId && (
              <Button 
                onClick={cleanup}
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                🧹 Cleanup Test Data
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <a 
              href="/communities" 
              target="_blank" 
              className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded text-center"
            >
              🌟 Open Communities Page
            </a>
            <a 
              href="/admin/submissions" 
              target="_blank" 
              className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded text-center"
            >
              🔗 Open Admin Panel
            </a>
          </div>

          <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
            <h3 className="text-blue-300 font-semibold mb-2">How This Test Works:</h3>
            <ol className="text-blue-200 text-sm space-y-1 list-decimal list-inside">
              <li>Creates a test community submission</li>
              <li>Approves it (triggers all approval events)</li>
              <li>Communities page should auto-update within 15 seconds</li>
              <li>You should see the new community appear without refreshing</li>
              <li>Email notification sent to dhruvchoudhary751@gmail.com</li>
            </ol>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AutoLoadTest;