import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestDatabase() {
  const [allCommunities, setAllCommunities] = useState<any[]>([]);
  const [approvedCommunities, setApprovedCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      console.log('🔍 Fetching all communities...');
      
      // Fetch ALL communities
      const { data: allData, error: allError } = await supabase
        .from('community_subs')
        .select('id, community_name, status, platform, category, created_at')
        .order('created_at', { ascending: false });

      if (allError) {
        setError(`Error fetching all: ${allError.message}`);
        console.error('❌ Error:', allError);
      } else {
        setAllCommunities(allData || []);
        console.log('✅ All communities:', allData?.length);
      }

      // Fetch APPROVED communities
      const { data: approvedData, error: approvedError } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (approvedError) {
        setError(`Error fetching approved: ${approvedError.message}`);
        console.error('❌ Error:', approvedError);
      } else {
        setApprovedCommunities(approvedData || []);
        console.log('✅ Approved communities:', approvedData?.length);
      }
      
    } catch (err: any) {
      setError(`Unexpected error: ${err.message}`);
      console.error('❌ Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const approveAll = async () => {
    if (confirm('Approve ALL pending communities? This will make them visible on the communities page.')) {
      try {
        const pendingCommunities = allCommunities.filter(c => c.status === 'pending');
        
        for (const community of pendingCommunities) {
          await supabase
            .from('community_subs')
            .update({ status: 'approved', approved_at: new Date().toISOString() })
            .eq('id', community.id);
          
          console.log('✅ Approved:', community.community_name);
        }
        
        alert(`Approved ${pendingCommunities.length} communities!`);
        fetchData();
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">🔍 Database Test & Debug</h1>
          <Button onClick={fetchData} disabled={loading}>
            {loading ? 'Loading...' : 'Refresh'}
          </Button>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">❌ {error}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* All Communities */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                📊 All Communities in Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-blue-400">
                  {allCommunities.length} Total
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {allCommunities.length === 0 ? (
                    <p className="text-gray-400">No communities found in database</p>
                  ) : (
                    allCommunities.map((c, i) => (
                      <div key={c.id} className="bg-gray-700/50 p-3 rounded">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{i + 1}. {c.community_name}</div>
                            <div className="text-sm text-gray-400">
                              {c.platform} • {c.category}
                            </div>
                          </div>
                          <div className={`px-2 py-1 rounded text-xs ${
                            c.status === 'approved' ? 'bg-green-600' :
                            c.status === 'pending' ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}>
                            {c.status}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Approved Communities */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                ✅ Approved Communities (What Shows on Site)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-green-400">
                  {approvedCommunities.length} Approved
                </div>
                
                {approvedCommunities.length === 0 ? (
                  <div className="bg-yellow-900/20 border border-yellow-600 rounded p-4">
                    <p className="text-yellow-400 font-medium mb-2">
                      ⚠️ No Approved Communities!
                    </p>
                    <p className="text-sm text-gray-300 mb-4">
                      This is why you're only seeing static communities. You need to approve some communities first.
                    </p>
                    {allCommunities.some(c => c.status === 'pending') && (
                      <Button onClick={approveAll} className="bg-green-600 hover:bg-green-700">
                        🚀 Approve All Pending
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {approvedCommunities.map((c, i) => (
                      <div key={c.id} className="bg-green-900/20 border border-green-700 p-3 rounded">
                        <div className="font-medium">{i + 1}. {c.community_name}</div>
                        <div className="text-sm text-gray-400">
                          {c.platform} • {c.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          ID: {c.id}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Summary */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">📈 Status Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-400">
                  {allCommunities.length}
                </div>
                <div className="text-sm text-gray-400">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400">
                  {allCommunities.filter(c => c.status === 'approved').length}
                </div>
                <div className="text-sm text-gray-400">Approved</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-400">
                  {allCommunities.filter(c => c.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-400">Pending</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-red-400">
                  {allCommunities.filter(c => c.status === 'rejected').length}
                </div>
                <div className="text-sm text-gray-400">Rejected</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-blue-900/20 border border-blue-600 rounded-lg p-4">
          <p className="text-blue-400 font-medium mb-2">💡 How This Works:</p>
          <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
            <li>Communities page shows: <strong>9 static + approved communities from database</strong></li>
            <li>If "Approved" count is 0, you'll only see the 9 static communities</li>
            <li>Approve communities using the button above or in the admin panel</li>
            <li>After approval, refresh the communities page to see them</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
