import React, { useState, useEffect } from 'react';
import { Users, Building2, CheckCircle, Clock, IndianRupee, TrendingUp } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseMain = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

const supabasePayments = createClient(
  import.meta.env.VITE_SUPABASE_PAYMENTS_URL!,
  import.meta.env.VITE_SUPABASE_PAYMENTS_ANON_KEY!
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCommunities: 0,
    pendingCommunities: 0,
    approvedCommunities: 0,
    totalMembers: 0,
    totalRevenue: 0,
    platformRevenue: 0,
    adminRevenue: 0,
    totalPayments: 0,
  });
  const [recentPayments, setRecentPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Get community stats from Project A
      const { data: communities } = await supabaseMain
        .from('community_subs')
        .select('id, status, created_at');

      const total = communities?.length || 0;
      const pending = communities?.filter(c => c.status === 'pending').length || 0;
      const approved = communities?.filter(c => c.status === 'approved').length || 0;

      // Get payment stats from Project B
      const { data: payments } = await supabasePayments
        .from('payments')
        .select('amount, created_at, status')
        .eq('status', 'captured')
        .order('created_at', { ascending: false });

      const totalRevenue = (payments || []).reduce((sum, p) => sum + (p.amount / 100), 0);
      const platformRevenue = Math.round(totalRevenue * 0.10);
      const adminRevenue = Math.round(totalRevenue * 0.90);

      // Get platform revenue from Project B
      const { data: platformRevenueData } = await supabasePayments
        .from('platform_revenue')
        .select('amount');

      const actualPlatformRevenue = (platformRevenueData || []).reduce(
        (sum, p) => sum + (p.amount || 0), 0
      );

      // Get members count from Project B
      const { count: membersCount } = await supabasePayments
        .from('community_memberships')
        .select('*', { count: 'exact', head: true });

      // Get recent payments
      const { data: recent } = await supabasePayments
        .from('payments')
        .select('*')
        .eq('status', 'captured')
        .order('created_at', { ascending: false })
        .limit(10);

      setStats({
        totalCommunities: total,
        pendingCommunities: pending,
        approvedCommunities: approved,
        totalMembers: membersCount || 0,
        totalRevenue: Math.round(totalRevenue),
        platformRevenue: actualPlatformRevenue,
        adminRevenue,
        totalPayments: payments?.length || 0,
      });

      setRecentPayments(recent || []);
    } catch (error) {
      console.error('Dashboard error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Mission Control</h1>
          <p className="text-gray-400 text-sm mt-1">Live dashboard • Real data</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="bg-gray-800 text-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
        >
          🔄 Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Communities',
            value: stats.totalCommunities,
            sub: `${stats.pendingCommunities} pending · ${stats.approvedCommunities} approved`,
            icon: '🏘️',
            color: 'blue'
          },
          {
            label: 'Active Members',
            value: stats.totalMembers,
            sub: 'paid memberships',
            icon: '👥',
            color: 'purple'
          },
          {
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
            sub: `${stats.totalPayments} payments`,
            icon: '💰',
            color: 'green'
          },
          {
            label: 'Your Revenue (10%)',
            value: `₹${stats.platformRevenue.toLocaleString('en-IN')}`,
            sub: `Admin gets ₹${stats.adminRevenue.toLocaleString('en-IN')}`,
            icon: '📈',
            color: 'yellow'
          },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-gray-500">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent Payments */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-bold mb-4">Recent Payments</h2>
        {recentPayments.length === 0 ? (
          <p className="text-gray-500 text-sm">No payments yet</p>
        ) : (
          <>
            <div className="space-y-3">
              {recentPayments.map(payment => (
                <div key={payment.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="text-white text-sm font-medium">{payment.razorpay_payment_id}</div>
                      <div className="text-gray-500 text-xs mt-1">
                        {new Date(payment.created_at).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                          hour12: true,
                          timeZone: 'Asia/Kolkata'
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">
                        ₹{(payment.amount / 100).toLocaleString('en-IN')}
                      </div>
                      <div className="text-xs mt-1">
                        <span className="text-purple-400">You: ₹{Math.round(payment.amount / 100 * 0.10)}</span>
                        <span className="text-gray-600 mx-1">·</span>
                        <span className="text-blue-400">Admin: ₹{Math.round(payment.amount / 100 * 0.90)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="bg-gray-900 rounded p-2">
                      <div className="text-gray-500 text-xs">User ID</div>
                      <div className="text-gray-300 text-xs font-mono truncate mt-1">{payment.user_id}</div>
                    </div>
                    <div className="bg-gray-900 rounded p-2">
                      <div className="text-gray-500 text-xs">Community ID</div>
                      <div className="text-gray-300 text-xs font-mono truncate mt-1">{payment.community_id}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <button
                onClick={() => window.location.href = '/admin/dashboard/payments'}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View All Payments →
              </button>
            </div>
          </>
        )}
      </div>

      {/* Platform Health */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-white font-bold mb-4">Platform Health</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-green-400">
              {stats.approvedCommunities > 0
                ? Math.round((stats.approvedCommunities / stats.totalCommunities) * 100)
                : 0}%
            </div>
            <div className="text-gray-500 text-xs mt-1">Approval Rate</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">{stats.totalPayments}</div>
            <div className="text-gray-500 text-xs mt-1">Total Transactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">
              ₹{stats.totalPayments > 0
                ? Math.round(stats.totalRevenue / stats.totalPayments)
                : 0}
            </div>
            <div className="text-gray-500 text-xs mt-1">Avg Transaction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
