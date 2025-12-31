import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Submission {
  id: string;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  status: string;
  created_at: string;
  founder_name: string;
  join_link: string;
  join_type?: string;
  price_inr?: number | null;
}

const SimpleSubmissions: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    console.log('🚀 SIMPLE COMPONENT: Starting fresh data load...');
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });

      console.log('🚀 SIMPLE COMPONENT: Raw data:', data);
      console.log('🚀 SIMPLE COMPONENT: Error:', error);

      if (error) {
        throw error;
      }

      setSubmissions(data || []);
      console.log('🚀 SIMPLE COMPONENT: Set submissions:', data?.length || 0);
    } catch (err: any) {
      console.error('🚀 SIMPLE COMPONENT: Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_subs')
        .update({ status: 'approved' })
        .eq('id', id);

      if (error) throw error;
      
      // Reload data
      loadData();
      alert('Community approved!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleReject = async (id: string) => {
    try {
      const { error } = await supabase
        .from('community_subs')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;
      
      // Reload data
      loadData();
      alert('Community rejected!');
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#1a1a1a', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Simple Admin Panel</h1>
      
      <button 
        onClick={loadData}
        style={{
          padding: '10px 20px',
          backgroundColor: '#22c55e',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        🔄 Reload Data
      </button>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div>Loading... Please wait</div>
        </div>
      )}

      {error && (
        <div style={{ 
          backgroundColor: '#dc2626', 
          padding: '15px', 
          borderRadius: '5px', 
          marginBottom: '20px' 
        }}>
          Error: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2>Total Submissions: {submissions.length}</h2>
          
          {submissions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              No submissions found
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '15px', marginTop: '20px' }}>
              {submissions.map((submission) => (
                <div 
                  key={submission.id}
                  style={{
                    backgroundColor: '#2a2a2a',
                    padding: '20px',
                    borderRadius: '8px',
                    border: '1px solid #444'
                  }}
                >
                  <h3 style={{ margin: '0 0 10px 0', color: '#60a5fa' }}>
                    {submission.community_name}
                  </h3>
                  <p><strong>Platform:</strong> {submission.platform}</p>
                  <p><strong>Category:</strong> {submission.category}</p>
                  <p><strong>Description:</strong> {submission.short_description}</p>
                  <p><strong>Founder:</strong> {submission.founder_name}</p>
                  <p><strong>Status:</strong> 
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      marginLeft: '8px',
                      backgroundColor: 
                        submission.status === 'approved' ? '#22c55e' :
                        submission.status === 'rejected' ? '#dc2626' : '#f59e0b'
                    }}>
                      {submission.status}
                    </span>
                  </p>
                  <p><strong>Join Link:</strong> 
                    {submission.join_type === 'paid' ? (
                      <span style={{ marginLeft: '8px' }}>
                        Paid{typeof submission.price_inr === 'number' ? ` (₹${submission.price_inr})` : ''}. Link stored privately.
                      </span>
                    ) : (
                      <a href={submission.join_link} target="_blank" rel="noopener noreferrer" 
                         style={{ color: '#60a5fa', marginLeft: '8px' }}>
                        {submission.join_link}
                      </a>
                    )}
                  </p>
                  <p><strong>Created:</strong> {new Date(submission.created_at).toLocaleString()}</p>
                  
                  <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
                    {submission.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleApprove(submission.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#22c55e',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          onClick={() => handleReject(submission.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#dc2626',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          ❌ Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SimpleSubmissions;
