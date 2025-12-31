import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useSubmissions } from '@/contexts/SubmissionContext';

const BulletproofTest = () => {
  const [status, setStatus] = useState('Ready to test bulletproof loading...');
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const { updateSubmissionStatus } = useSubmissions();

  const runBulletproofTest = async () => {
    try {
      setStatus('🚀 BULLETPROOF TEST: Creating and approving community...');
      
      // Create test community
      const testCommunity = {
        community_name: `Bulletproof Test ${Date.now()}`,
        platform: 'telegram',
        category: 'Technology',
        short_description: 'Testing bulletproof auto-loading system',
        long_description: 'This community tests the bulletproof auto-loading system that should make communities appear immediately',
        join_link: 'https://t.me/bulletprooftest',
        founder_name: 'Bulletproof Tester',
        founder_bio: 'Testing bulletproof loading',
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
      setStatus(`✅ Test community created (ID: ${submission.id})`);

      // Immediately approve it
      setTimeout(async () => {
        setStatus('👨‍💼 BULLETPROOF: Approving community with FORCE REFRESH...');
        
        try {
          await updateSubmissionStatus(submission.id.toString(), 'approved', 'Bulletproof test approval');
          
          setStatus('✅ BULLETPROOF TEST COMPLETE!\n\n' +
                   '🔍 What should happen:\n' +
                   '1. Community stored in localStorage\n' +
                   '2. FORCE_COMMUNITIES_REFRESH event dispatched\n' +
                   '3. Communities page refreshes within 10 seconds\n' +
                   '4. New community appears at the top\n\n' +
                   '📋 Check Communities page now - it should show the new community!');
          
        } catch (approvalError) {
          setStatus(`❌ Approval failed: ${approvalError.message}`);
        }
      }, 1000);

    } catch (error) {
      setStatus(`❌ Test failed: ${error.message}`);
    }
  };

  const checkLocalStorage = () => {
    try {
      const approved = JSON.parse(localStorage.getItem('approvedCommunities') || '[]');
      setStatus(`📦 LocalStorage contains ${approved.length} approved communities:\n\n` +
               approved.map(c => `- ${c.name} (ID: ${c.id})`).join('\n'));
    } catch (error) {
      setStatus(`❌ LocalStorage error: ${error.message}`);
    }
  };

  const clearLocalStorage = () => {
    localStorage.removeItem('approvedCommunities');
    setStatus('🧹 LocalStorage cleared');
  };

  const forceRefresh = () => {
    window.dispatchEvent(new CustomEvent('FORCE_COMMUNITIES_REFRESH', {
      detail: { 
        timestamp: Date.now(),
        action: 'manual_test'
      }
    }));
    setStatus('🔄 FORCE_COMMUNITIES_REFRESH event dispatched');
  };

  const cleanup = async () => {
    if (!submissionId) return;
    
    try {
      await supabase
        .from('community_subs')
        .delete()
        .eq('id', submissionId);
      
      setStatus('🧹 Test data cleaned up from database');
      setSubmissionId(null);
    } catch (error) {
      setStatus(`❌ Cleanup failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-gray-800 border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-4">🛡️ Bulletproof Loading Test</h1>
          <p className="text-gray-300 mb-6">
            This test uses the bulletproof loading system with localStorage + force refresh events.
          </p>

          <div className="mb-6">
            <div className="text-lg text-white mb-2">Test Status:</div>
            <div className="p-3 bg-gray-900 rounded border border-gray-600 font-mono text-sm whitespace-pre-wrap">
              {status}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Button 
              onClick={runBulletproofTest}
              className="bg-blue-600 hover:bg-blue-700"
            >
              🧪 Run Test
            </Button>

            <Button 
              onClick={checkLocalStorage}
              variant="outline"
            >
              📦 Check Storage
            </Button>

            <Button 
              onClick={forceRefresh}
              variant="outline"
            >
              🔄 Force Refresh
            </Button>

            <Button 
              onClick={clearLocalStorage}
              variant="outline"
            >
              🧹 Clear Storage
            </Button>
          </div>

          {submissionId && (
            <div className="mb-4">
              <Button 
                onClick={cleanup}
                variant="outline"
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                🗑️ Cleanup Test Data
              </Button>
            </div>
          )}

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

          <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
            <h3 className="text-yellow-300 font-semibold mb-2">🛡️ Bulletproof System Features:</h3>
            <ul className="text-yellow-200 text-sm space-y-1 list-disc list-inside">
              <li>Stores approved communities in localStorage for instant access</li>
              <li>Dispatches FORCE_COMMUNITIES_REFRESH events</li>
              <li>Auto-refreshes every 10 seconds</li>
              <li>Multiple fallback systems (localStorage + database + events)</li>
              <li>Immediate UI updates without waiting for database</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BulletproofTest;