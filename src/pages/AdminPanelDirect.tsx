import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface CommunitySubmission {
  id: number;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  join_link: string;
  founder_name: string;
  founder_bio: string;
  logo_url: string | null;
  status: string;
  created_at: string;
}

const AdminPanelDirect = () => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<string>('checking');

  useEffect(() => {
    testConnectionAndFetch();
  }, []);

  const testConnectionAndFetch = async () => {
    try {
      setLoading(true);
      setConnectionStatus('checking');
      console.log('🔍 Testing direct database connection...');

      // Test 1: Basic connection test
      const { data: testData, error: testError } = await supabase
        .from('community_subs')
        .select('count')
        .limit(1);

      if (testError) {
        console.error('❌ Connection test failed:', testError);
        setError(`Connection failed: ${testError.message}`);
        setConnectionStatus('failed');
        toast.error('Database connection failed', { description: testError.message });
        return;
      }

      console.log('✅ Basic connection successful');
      setConnectionStatus('connected');

      // Test 2: Try to fetch all records without RLS
      console.log('🔍 Attempting to fetch all submissions...');
      const { data: allData, error: allError } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        console.error('❌ Fetch failed:', allError);
        setError(`Fetch failed: ${allError.message}`);
        toast.error('Failed to fetch submissions', { description: allError.message });
        
        // Try alternative approach - bypass RLS by using service role if available
        console.log('🔄 Trying alternative fetch method...');
        try {
          const { data: altData, error: altError } = await supabase
            .from('community_subs')
            .select('*');

          if (altError) {
            console.error('❌ Alternative fetch also failed:', altError);
          } else {
            console.log('✅ Alternative fetch successful:', altData?.length || 0);
            setSubmissions(altData || []);
            setError(null);
          }
        } catch (altErr) {
          console.error('❌ Alternative fetch error:', altErr);
        }
      } else {
        console.log('✅ Fetch successful:', allData?.length || 0);
        setSubmissions(allData || []);
        setError(null);
        toast.success(`Found ${allData?.length || 0} submissions`);
      }

    } catch (err) {
      console.error('❌ Connection error:', err);
      setError(`Connection error: ${err.message}`);
      setConnectionStatus('error');
      toast.error('Connection error', { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  const insertTestSubmission = async () => {
    try {
      console.log('📝 Inserting test submission...');
      toast.loading('Creating test submission...', { id: 'test-insert' });

      const testData = {
        community_name: `Direct Test ${Date.now()}`,
        platform: 'telegram',
        category: 'Tech',
        short_description: 'Direct admin panel test submission',
        long_description: 'This is a test submission created directly from admin panel',
        join_link: 'https://t.me/directtest',
        founder_name: 'Direct Tester',
        founder_bio: 'Testing direct admin access',
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('community_subs')
        .insert([testData])
        .select()
        .single();

      if (error) {
        console.error('❌ Insert failed:', error);
        toast.dismiss('test-insert');
        toast.error('Insert failed', { description: error.message });
      } else {
        console.log('✅ Test submission created:', data.id);
        toast.dismiss('test-insert');
        toast.success('Test submission created successfully!');
        
        // Refresh the list
        testConnectionAndFetch();
      }
    } catch (err) {
      console.error('❌ Insert error:', err);
      toast.dismiss('test-insert');
      toast.error('Insert error', { description: err.message });
    }
  };

  const approveSubmission = async (id: number) => {
    try {
      console.log(`🔄 Approving submission ${id}...`);
      toast.loading('Approving submission...', { id: 'approve' });

      const { data, error } = await supabase
        .from('community_subs')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('❌ Approval failed:', error);
        toast.dismiss('approve');
        toast.error('Approval failed', { description: error.message });
      } else {
        console.log('✅ Submission approved:', data.id);
        toast.dismiss('approve');
        toast.success('Community approved successfully!');
        
        // Dispatch events for communities page
        const approvedCommunity = {
          id: data.id.toString(),
          name: data.community_name,
          description: data.short_description,
          longDescription: data.long_description,
          category: data.category,
          platform: data.platform,
          memberCount: "New",
          members: 0,
          isVerified: true,
          verified: true,
          joinLink: data.join_type === 'paid' ? '' : data.join_link,
          joinType: data.join_type === 'paid' ? 'paid' : 'free',
          priceInr: typeof data.price_inr === 'number' ? data.price_inr : null,
          logo: data.logo_url,
          logoUrl: data.logo_url,
          location: "Global",
          tags: [data.category, data.platform],
          founderName: data.founder_name,
          founderBio: data.founder_bio
        };

        // Dispatch all approval events (including BULLETPROOF events)
        window.dispatchEvent(new CustomEvent('communityApproved', { detail: { id: data.id } }));
        window.dispatchEvent(new CustomEvent('communityApprovedWithData', { detail: { approvedCommunity } }));
        window.dispatchEvent(new CustomEvent('addApprovedCommunity', { detail: approvedCommunity }));
        window.dispatchEvent(new CustomEvent('refreshCommunities', { detail: { timestamp: Date.now() } }));
        window.dispatchEvent(new CustomEvent('bulletproofApproval', { detail: approvedCommunity }));
        window.dispatchEvent(new CustomEvent('FORCE_COMMUNITIES_REFRESH', { detail: { source: 'admin_panel_direct', community: approvedCommunity } }));

        console.log('✅ All approval events dispatched (including BULLETPROOF)');
        
        // Refresh the list
        testConnectionAndFetch();
      }
    } catch (err) {
      console.error('❌ Approval error:', err);
      toast.dismiss('approve');
      toast.error('Approval error', { description: err.message });
    }
  };

  const deleteSubmission = async (id: number) => {
    try {
      console.log(`🗑️ Deleting submission ${id}...`);
      toast.loading('Deleting submission...', { id: 'delete' });

      const { error } = await supabase
        .from('community_subs')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ Delete failed:', error);
        toast.dismiss('delete');
        toast.error('Delete failed', { description: error.message });
      } else {
        console.log('✅ Submission deleted');
        toast.dismiss('delete');
        toast.success('Submission deleted successfully!');
        
        // Refresh the list
        testConnectionAndFetch();
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
      toast.dismiss('delete');
      toast.error('Delete error', { description: err.message });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Direct Admin Panel
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Direct database access for community submissions
          </p>
          
          {/* Connection Status */}
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'failed' ? 'bg-red-100 text-red-800' :
            connectionStatus === 'error' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              connectionStatus === 'connected' ? 'bg-green-500' :
              connectionStatus === 'failed' ? 'bg-red-500' :
              connectionStatus === 'error' ? 'bg-red-500' :
              'bg-yellow-500 animate-pulse'
            }`}></div>
            {connectionStatus === 'connected' ? 'Connected' :
             connectionStatus === 'failed' ? 'Connection Failed' :
             connectionStatus === 'error' ? 'Error' :
             'Checking Connection...'}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <button 
            onClick={testConnectionAndFetch}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Refresh Data'}
          </button>
          
          <button 
            onClick={insertTestSubmission}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Create Test Submission
          </button>

          <a 
            href="/communities"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            View Communities Page
          </a>

          <a 
            href="/test-flow"
            className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
          >
            Run Flow Test
          </a>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</h3>
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Submissions Count */}
        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Total submissions found: <span className="font-semibold">{submissions.length}</span>
          </p>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading submissions...</p>
          </div>
        ) : submissions.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border">
            <p className="text-gray-500 dark:text-gray-400 mb-4">No submissions found in database</p>
            <p className="text-sm text-gray-400 mb-4">This could mean:</p>
            <ul className="text-sm text-gray-400 text-left max-w-md mx-auto space-y-1">
              <li>• No communities have been submitted yet</li>
              <li>• RLS policies are blocking access</li>
              <li>• Database connection issues</li>
              <li>• Wrong table name or structure</li>
            </ul>
            <button 
              onClick={insertTestSubmission}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Create Test Submission
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {submissions.map((submission) => (
              <div key={submission.id} className="bg-white dark:bg-gray-800 rounded-lg border p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {submission.community_name}
                    </h3>
                    <div className="flex gap-2 mt-1">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {submission.platform}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        {submission.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded ${
                        submission.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        submission.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {submission.status}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    ID: {submission.id}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  {submission.short_description}
                </p>

                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <span className="font-medium">Founder:</span> {submission.founder_name}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {new Date(submission.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex gap-2">
                  {submission.status === 'pending' && (
                    <button
                      onClick={() => approveSubmission(submission.id)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded"
                    >
                      ✅ Approve
                    </button>
                  )}
                  <button
                    onClick={() => deleteSubmission(submission.id)}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded"
                  >
                    🗑️ Delete
                  </button>
                  {submission.join_type === 'paid' ? (
                    <span className="px-3 py-1 bg-gray-700 text-white text-sm rounded">
                      Paid{submission.price_inr ? ` (₹${submission.price_inr})` : ''}
                    </span>
                  ) : (
                    <a
                      href={submission.join_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
                    >
                      🔗 Visit
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanelDirect;
