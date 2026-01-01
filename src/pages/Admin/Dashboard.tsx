import React from 'react';
import { 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  IndianRupee,
  TrendingUp,
  UserPlus,
  Plus
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { mockStats, formatCurrency } from '@/lib/mockAdminData';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Platform overview and key metrics</p>
        </div>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString('en-IN')}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Communities"
          value={mockStats.totalCommunities}
          icon={Building2}
          trend={{ value: 12.5, isPositive: true }}
          subtitle={`${mockStats.newCommunitiesThisMonth} new this month`}
          color="blue"
        />
        
        <StatCard
          title="Approved Communities"
          value={mockStats.approvedCommunities}
          icon={CheckCircle}
          subtitle={`${mockStats.pendingCommunities} pending approval`}
          color="green"
        />
        
        <StatCard
          title="Total Members"
          value={mockStats.totalMembers.toLocaleString('en-IN')}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          subtitle={`${mockStats.newMembersThisMonth} new this month`}
          color="purple"
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(mockStats.totalRevenue)}
          icon={IndianRupee}
          trend={{ value: 15.3, isPositive: true }}
          subtitle={`${formatCurrency(mockStats.monthlyRevenue)} this month`}
          color="green"
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Pending Approvals"
          value={mockStats.pendingCommunities}
          icon={Clock}
          subtitle="Requires admin action"
          color="yellow"
        />
        
        <StatCard
          title="Monthly Growth"
          value="23.4%"
          icon={TrendingUp}
          subtitle="Revenue growth rate"
          color="green"
        />
        
        <StatCard
          title="New Signups"
          value={mockStats.newMembersThisMonth}
          icon={UserPlus}
          subtitle="This month"
          color="blue"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Clock className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Review Pending</div>
              <div className="text-sm text-gray-500">{mockStats.pendingCommunities} communities</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">Manage Members</div>
              <div className="text-sm text-gray-500">Access control</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <IndianRupee className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">View Payments</div>
              <div className="text-sm text-gray-500">Transaction history</div>
            </div>
          </button>
          
          <button className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <Plus className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <div className="font-medium text-gray-900">System Settings</div>
              <div className="text-sm text-gray-500">Configure platform</div>
            </div>
          </button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Platform Health</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">98.5%</div>
            <div className="text-sm text-gray-600">System Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2.3s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">99.2%</div>
            <div className="text-sm text-gray-600">Payment Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
