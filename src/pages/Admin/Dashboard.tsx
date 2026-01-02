import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  CheckCircle, 
  Clock, 
  IndianRupee,
  TrendingUp,
  UserPlus,
  Plus,
  AlertTriangle,
  Activity,
  Shield,
  Zap
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { mockStats, formatCurrency } from '@/lib/mockAdminData';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard space-y-6">
      {/* Critical Metrics - High Priority */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Communities"
          value={mockStats.totalCommunities}
          icon={Building2}
          trend={{ value: 12.5, isPositive: true }}
          subtitle={`${mockStats.newCommunitiesThisMonth} new this month`}
          color="blue"
        />
        
        <StatCard
          title="Pending Approvals"
          value={mockStats.pendingCommunities}
          icon={Clock}
          subtitle="Requires immediate action"
          color="yellow"
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(mockStats.totalRevenue)}
          icon={IndianRupee}
          trend={{ value: 15.3, isPositive: true }}
          subtitle={`${formatCurrency(mockStats.monthlyRevenue)} this month`}
          color="green"
        />
        
        <StatCard
          title="Active Members"
          value={mockStats.totalMembers.toLocaleString('en-IN')}
          icon={Users}
          trend={{ value: 8.2, isPositive: true }}
          subtitle={`${mockStats.newMembersThisMonth} new this month`}
          color="purple"
        />
      </div>

      {/* Operational Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Approval Rate"
          value="87.3%"
          icon={CheckCircle}
          subtitle="Last 30 days"
          color="green"
        />
        
        <StatCard
          title="Growth Rate"
          value="23.4%"
          icon={TrendingUp}
          subtitle="Monthly revenue growth"
          color="blue"
        />
        
        <StatCard
          title="New Signups"
          value={mockStats.newMembersThisMonth}
          icon={UserPlus}
          subtitle="This month"
          color="purple"
        />
      </div>

      {/* Mission Critical Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-[#1C1C1F] border border-gray-700/40 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="admin-section-title flex items-center">
            <Zap className="h-6 w-6 text-amber-400 mr-3" />
            Quick Actions
          </h2>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-amber-400 mr-2 animate-pulse" />
            <span className="text-amber-400 font-medium">ACTION REQUIRED</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-amber-900/20 border border-amber-700/40 rounded-xl hover:border-amber-500/60 hover:bg-amber-900/30 transition-all text-left group"
          >
            <Clock className="h-5 w-5 text-amber-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-white group-hover:text-amber-100">Review Pending</div>
              <div className="admin-secondary-text text-sm mt-1">{mockStats.pendingCommunities} communities waiting</div>
            </div>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-blue-900/20 border border-blue-700/40 rounded-xl hover:border-blue-500/60 hover:bg-blue-900/30 transition-all text-left group"
          >
            <Users className="h-5 w-5 text-blue-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-white group-hover:text-blue-100">Member Control</div>
              <div className="admin-secondary-text text-sm mt-1">Access management</div>
            </div>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-green-900/20 border border-green-700/40 rounded-xl hover:border-green-500/60 hover:bg-green-900/30 transition-all text-left group"
          >
            <IndianRupee className="h-5 w-5 text-green-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-white group-hover:text-green-100">Payment Center</div>
              <div className="admin-secondary-text text-sm mt-1">Transaction monitoring</div>
            </div>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center p-4 bg-purple-900/20 border border-purple-700/40 rounded-xl hover:border-purple-500/60 hover:bg-purple-900/30 transition-all text-left group"
          >
            <Plus className="h-5 w-5 text-purple-400 mr-4 flex-shrink-0 group-hover:scale-110 transition-transform" />
            <div>
              <div className="font-semibold text-white group-hover:text-purple-100">System Config</div>
              <div className="admin-secondary-text text-sm mt-1">Platform settings</div>
            </div>
          </motion.button>
        </div>
      </motion.div>

      {/* Platform Health - Mission Critical */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-[#1C1C1F] border border-gray-700/40 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="admin-section-title flex items-center">
            <Activity className="h-6 w-6 text-green-400 mr-3" />
            Platform Health
          </h2>
          <div className="flex items-center text-sm">
            <div className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse" />
            <span className="text-green-400 font-medium">ALL SYSTEMS OPERATIONAL</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-green-900/10 border border-green-700/30 rounded-xl">
            <div className="admin-metric-number text-green-400 mb-2">98.5%</div>
            <div className="admin-card-label">System Uptime</div>
            <div className="text-xs text-green-400 mt-2 font-medium">EXCELLENT</div>
          </div>
          <div className="text-center p-4 bg-blue-900/10 border border-blue-700/30 rounded-xl">
            <div className="admin-metric-number text-blue-400 mb-2">2.3s</div>
            <div className="admin-card-label">Avg Response Time</div>
            <div className="text-xs text-blue-400 mt-2 font-medium">OPTIMAL</div>
          </div>
          <div className="text-center p-4 bg-purple-900/10 border border-purple-700/30 rounded-xl">
            <div className="admin-metric-number text-purple-400 mb-2">99.2%</div>
            <div className="admin-card-label">Payment Success Rate</div>
            <div className="text-xs text-purple-400 mt-2 font-medium">STABLE</div>
          </div>
        </div>
      </motion.div>

      {/* System Alerts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[#1C1C1F] border border-gray-700/40 rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="admin-section-title flex items-center">
            <Shield className="h-6 w-6 text-gray-400 mr-3" />
            System Status
          </h2>
          <div className="text-xs text-gray-400 font-medium">LAST 24H</div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-green-900/10 border border-green-700/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-3" />
              <span className="text-sm font-medium text-white">All services operational</span>
            </div>
            <span className="text-xs text-green-400">HEALTHY</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-900/10 border border-blue-700/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-400 mr-3" />
              <span className="text-sm font-medium text-white">Database performance optimal</span>
            </div>
            <span className="text-xs text-blue-400">STABLE</span>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-800/50 border border-gray-700/30 rounded-lg">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-gray-400 mr-3" />
              <span className="text-sm font-medium text-white">No critical alerts</span>
            </div>
            <span className="text-xs text-gray-400">CLEAR</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
