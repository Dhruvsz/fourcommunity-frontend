import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface CommunitySubmission {
  id: number;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  join_link: string;
  join_type?: string;
  price_inr?: number | null;
  founder_name: string;
  founder_bio: string;
  logo_url: string | null;
  status: string;
  created_at: string;
}

const AdminView = () => {
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateSubmissionStatus = async (id: number, newStatus: string) => {
    try {
      console.log(`🔄 Updating submission ${id} to ${newStatus}...`);
      
      const { data, error } = await supabase
        .from('community_subs')
        .update({ status: newStatus })
        .eq('id', id)
        .select();

      if (error) {
        console.error('❌ Update failed:', error.message);
        setError(`Failed to update status: ${error.message}`);
      } else {
        console.log('✅ Status updated successfully');
        // Refresh the submissions list
        fetchSubmissions();
      }
    } catch (err) {
      console.error('❌ Update error:', err);
      setError('Failed to update submission status');
    }
  };

  const fetchSubmissions = async () => {
    try {
      console.log('🔍 Fetching submissions from community_subs table...');
      
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Fetch failed:', error.message);
        setError(error.message);
      } else {
        console.log('✅ Found submissions:', data?.length || 0);
        setSubmissions(data || []);
      }
    } catch (err) {
      console.error('❌ Fetch error:', err);
      setError('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300">Loading submissions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p className="text-red-800 dark:text-red-200">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Submissions Admin
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Total submissions: {submissions.length}
          </p>
        </div>

        <div className="grid gap-6">
          {submissions.map((submission) => (
            <div
              key={submission.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                  {submission.logo_url ? (
                    <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                      <img
                        src={submission.logo_url}
                        alt={`${submission.community_name} logo`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik00NCA0NEg4NFY4NEg0NFY0NFoiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-400 dark:text-gray-500 text-sm">No Logo</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                        {submission.community_name}
                      </h2>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                          {submission.platform}
                        </span>
                        <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 text-xs rounded-full">
                          {submission.category}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          submission.status === 'pending' 
                            ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
                            : submission.status === 'approved'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
                        }`}>
                          {submission.status}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(submission.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {submission.short_description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white">Founder:</span>
                      <p className="text-gray-600 dark:text-gray-300">{submission.founder_name}</p>
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

                  {submission.long_description && (
                    <div className="mt-4">
                      <span className="font-medium text-gray-900 dark:text-white">Description:</span>
                      <p className="text-gray-600 dark:text-gray-300 mt-1">
                        {submission.long_description}
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-4 flex gap-2">
                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateSubmissionStatus(submission.id, 'rejected')}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {submission.status === 'approved' && (
                      <button
                        onClick={() => updateSubmissionStatus(submission.id, 'pending')}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Mark Pending
                      </button>
                    )}
                    {submission.status === 'rejected' && (
                      <button
                        onClick={() => updateSubmissionStatus(submission.id, 'approved')}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {submissions.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">No submissions found.</p>
            <div className="mt-4 space-y-2">
              <button 
                onClick={fetchSubmissions}
                className="block mx-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Refresh
              </button>
              <a 
                href="/admin-debug-test"
                className="block mx-auto px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-center"
              >
                Debug Database Connection
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminView;
