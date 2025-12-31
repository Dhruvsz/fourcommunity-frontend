import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  getPendingSubmissions, 
  approveCommunity,
  rejectCommunity, 
  deleteCommunitySubmission,
  CommunitySubmission 
} from '@/lib/communityFlow';

const AdminPanelComplete = () => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
    
    // Listen for new submissions
    const handleNewSubmission = (event: CustomEvent) => {
      console.log('🔔 New submission received:', event.detail);
      fetchSubmissions(); // Refresh the list
    };

    window.addEventListener('newSubmission', handleNewSubmission as EventListener);
    
    return () => {
      window.removeEventListener('newSubmission', handleNewSubmission as EventListener);
    };
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Fetching pending submissions...');
      
      const data = await getPendingSubmissions();
      setSubmissions(data);
      
      if (data.length === 0) {
        toast.info('No pending submissions found');
      } else {
        toast.success(`Found ${data.length} pending submissions`);
      }
    } catch (err) {
      console.error('❌ Error fetching submissions:', err);
      setError(err.message);
      toast.error('Failed to fetch submissions', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId: number) => {
    try {
      console.log(`✅ Approving submission ${submissionId}...`);
      toast.loading('Approving community...', { id: 'approve' });
      
      const approvedCommunity = await approveCommunity(submissionId);
      
      toast.dismiss('approve');
      toast.success('Community approved successfully!', {
        description: `${approvedCommunity.name} is now live for users to discover`
      });
      
      // Remove from pending list
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
      
      console.log('✅ Community approved and moved to live communities');
    } catch (err) {
      console.error('❌ Approval failed:', err);
      toast.dismiss('approve');
      toast.error('Failed to approve community', { description: err.message });
    }
  };

  const handleReject = async (submissionId: number) => {
    try {
      console.log(`❌ Rejecting submission ${submissionId}...`);
      toast.loading('Rejecting community...', { id: 'reject' });
      
      await rejectCommunity(submissionId);
      
      toast.dismiss('reject');
      toast.success('Community rejected');
      
      // Remove from pending list
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    } catch (err) {
      console.error('❌ Rejection failed:', err);
      toast.dismiss('reject');
      toast.error('Failed to reject community', { description: err.message });
    }
  };

  const handleDelete = async (submissionId: number) => {
    try {
      console.log(`🗑️ Deleting submission ${submissionId}...`);
      toast.loading('Deleting community...', { id: 'delete' });
      
      await deleteCommunitySubmission(submissionId);
      
      toast.dismiss('delete');
      toast.success('Community deleted');
      
      // Remove from pending list
      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
    } catch (err) {
      console.error('❌ Delete failed:', err);
      toast.dismiss('delete');
      toast.error('Failed to delete community', { description: err.message });
    }
  };

  const createTestSubmission = async () => {
    try {
      console.log('📝 Creating test submission...');
      toast.loading('Creating test submission...', { id: 'create-test' });

      const { supabase } = await import('@/lib/supabase');
      
      const testData = {
        community_name: `Test Community ${Date.now()}`,
        platform: 'telegram',
        category: 'Tech',
        short_description: 'Test submission for admin panel verification',
        long_description: 'This is a test submission created to verify the complete submission-to-approval flow works correctly',
        join_link: 'https://t.me/testcommunity',
        founder_name: 'Test Admin',
        founder_bio: 'Testing the complete flow',
        status: 'pending',
        show_founder_info: true
      };

      const { data, error } = await supabase
        .from('community_subs')
        .insert([testData])
        .select()
        .single();

      if (error) throw error;

      toast.dismiss('create-test');
      toast.success('Test submission created!');
      
      // Refresh the list
      fetchSubmissions();
    } catch (err) {
      console.error('❌ Test submission failed:', err);
      toast.dismiss('create-test');
      toast.error('Test submission failed', { description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Admin Panel - Community Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Review and approve community submissions. Approved communities will appear live for all users.
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center gap-4 mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
              error ? 'bg-red-100 text-red-800' :
              loading ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                error ? 'bg-red-500' :
                loading ? 'bg-yellow-500 animate-pulse' :
                'bg-green-500'
              }`}></div>
              {error ? 'Error' : loading ? 'Loading...' : 'Connected'}
            </div>
            
            <span className="text-sm text-gray-500">
              {submissions.length} pending submissions
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button 
            onClick={fetchSubmissions}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : '🔄 Refresh'}
          </button>
          
          <button 
            onClick={createTestSubmission}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            📝 Create Test Submission
          </button>

          <a 
            href="/communities"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            👀 View Live Communities
          </a>

          <a 
            href="/submit/complete"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            ➕ Submit New Community
          </a>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error:</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Pending Submissions</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              All submissions have been processed or no new submissions yet.
            </p>
            <button 
              onClick={createTestSubmission}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Create Test Submission
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-lg border p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {submission.community_name}
                    </h3>
                    <div className="flex gap-2 mb-3">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {submission.platform}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {submission.category}
                      </span>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-500">ID: {submission.id}</span>
                    <br />
                    <span className="text-sm text-gray-500">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {submission.short_description}
                </p>

                {submission.long_description && (
                  <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {submission.long_description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Founder:</span>
                    <p className="text-gray-600 dark:text-gray-300">{submission.founder_name}</p>
                    {submission.founder_bio && (
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{submission.founder_bio}</p>
                    )}
                  </div>
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">Join Link:</span>
                    {submission.join_type === 'paid' ? (
                      <span className="text-gray-600 dark:text-gray-300 block">
                        Paid
                        {typeof submission.price_inr === 'number' ? ` (₹${submission.price_inr})` : ''}
                        . Link stored privately.
                      </span>
                    ) : (
                      <a 
                        href={submission.join_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline block truncate"
                      >
                        {submission.join_link}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(submission.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                  >
                    ✅ Approve & Make Live
                  </button>
                  <button
                    onClick={() => handleReject(submission.id)}
                    className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleDelete(submission.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelComplete;
