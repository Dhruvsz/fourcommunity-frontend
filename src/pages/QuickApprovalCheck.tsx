import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const QuickApprovalCheck = () => {
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [approvedSubmissions, setApprovedSubmissions] = useState<any[]>([]);
  const [testResult, setTestResult] = useState<string>('Loading...');

  const checkData = async () => {
    try {
      // Check all submissions
      const { data: all, error: allError } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });

      if (allError) {
        setTestResult(`❌ Error fetching all: ${allError.message}`);
        return;
      }

      // Check only approved submissions
      const { data: approved, error: approvedError } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (approvedError) {
        setTestResult(`❌ Error fetching approved: ${approvedError.message}`);
        return;
      }

      setAllSubmissions(all || []);
      setApprovedSubmissions(approved || []);
      
      const pendingCount = (all || []).filter(s => s.status === 'pending').length;
      const approvedCount = (approved || []).length;
      const rejectedCount = (all || []).filter(s => s.status === 'rejected').length;

      setTestResult(`Total: ${all?.length || 0} | Pending: ${pendingCount} | Approved: ${approvedCount} | Rejected: ${rejectedCount}`);
      
      console.log('📊 All submissions:', all);
      console.log('✅ Approved submissions:', approved);
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  const testApproval = async () => {
    const pendingSubmission = allSubmissions.find(s => s.status === 'pending');
    if (!pendingSubmission) {
      setTestResult('❌ No pending submissions to test');
      return;
    }

    setTestResult('🔄 Testing approval...');
    
    try {
      console.log('🔄 Approving:', pendingSubmission.community_name, 'ID:', pendingSubmission.id);
      
      const { error } = await supabase
        .from('community_subs')
        .update({ status: 'approved' })
        .eq('id', pendingSubmission.id);

      if (error) {
        setTestResult(`❌ Approval failed: ${error.message}`);
        console.error('❌ Approval error:', error);
      } else {
        setTestResult(`✅ Approved: ${pendingSubmission.community_name}`);
        console.log('✅ Approval successful');
        
        // Refresh data after 1 second
        setTimeout(checkData, 1000);
      }
    } catch (error) {
      setTestResult(`❌ Error: ${error}`);
    }
  };

  useEffect(() => {
    checkData();
    
    // Auto-refresh every 5 seconds
    const interval = setInterval(checkData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#000',
      color: '#fff',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#4ade80' }}>🔍 Quick Approval Check</h1>
      
      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h2>📊 Status</h2>
        <p><strong>{testResult}</strong></p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={checkData}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#333', 
            color: '#fff', 
            border: '1px solid #555',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          🔄 Refresh
        </button>
        
        <button 
          onClick={testApproval}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4ade80', 
            color: '#000', 
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          ✅ Test Approval
        </button>
      </div>

      <div style={{ 
        backgroundColor: '#1a1a1a', 
        padding: '20px', 
        borderRadius: '10px',
        marginBottom: '20px'
      }}>
        <h3>📋 Recent Submissions</h3>
        {allSubmissions.slice(0, 5).map((sub) => (
          <div key={sub.id} style={{ 
            padding: '10px', 
            margin: '5px 0',
            backgroundColor: '#2a2a2a',
            borderRadius: '5px',
            border: `1px solid ${sub.status === 'approved' ? '#4ade80' : sub.status === 'rejected' ? '#ef4444' : '#fbbf24'}`
          }}>
            <p><strong>{sub.community_name}</strong></p>
            <p>Status: <span style={{ 
              color: sub.status === 'approved' ? '#4ade80' : sub.status === 'rejected' ? '#ef4444' : '#fbbf24'
            }}>{sub.status || 'pending'}</span></p>
            <p>Platform: {sub.platform} | Category: {sub.category}</p>
          </div>
        ))}
      </div>

      {approvedSubmissions.length > 0 && (
        <div style={{ 
          backgroundColor: '#1a1a1a', 
          padding: '20px', 
          borderRadius: '10px'
        }}>
          <h3 style={{ color: '#4ade80' }}>✅ Approved Communities (What Should Show on Discovery Page)</h3>
          {approvedSubmissions.map((community) => (
            <div key={community.id} style={{ 
              padding: '10px', 
              margin: '5px 0',
              backgroundColor: '#2a2a2a',
              borderRadius: '5px',
              border: '1px solid #4ade80'
            }}>
              <p><strong>{community.community_name}</strong></p>
              <p>Platform: {community.platform} | Category: {community.category}</p>
              <p>Description: {community.short_description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuickApprovalCheck;
