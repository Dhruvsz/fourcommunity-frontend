import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle, Download, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const ProductionMonitor = () => {
  const [stats, setStats] = useState({
    totalSubmissions: 0,
    todaySubmissions: 0,
    pendingSubmissions: 0,
    approvedSubmissions: 0,
    errorRate: 0,
    lastSubmission: null as string | null
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Get total submissions
      const { count: totalCount } = await supabase
        .from('community_subs')
        .select('*', { count: 'exact', head: true });
      
      // Get today's submissions
      const today = new Date().toISOString().split('T')[0];
      const { count: todayCount } = await supabase
        .from('community_subs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today);
      
      // Get pending submissions
      const { count: pendingCount } = await supabase
        .from('community_subs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      // Get approved submissions
      const { count: approvedCount } = await supabase
        .from('community_subs')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      // Get last submission
      const { data: lastSubmissionData } = await supabase
        .from('community_subs')
        .select('created_at, community_name')
        .order('created_at', { ascending: false })
        .limit(1);
      
      setStats({
        totalSubmissions: totalCount || 0,
        todaySubmissions: todayCount || 0,
        pendingSubmissions: pendingCount || 0,
        approvedSubmissions: approvedCount || 0,
        errorRate: 0, // Calculate based on logs if needed
        lastSubmission: lastSubmissionData?.[0]?.created_at || null
      });
      
    } catch (error) {
      console.error('Error fetching production stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const exportData = async () => {
    try {
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Convert to CSV
      const csv = [
        Object.keys(data[0]).join(','),
        ...data.map(row => Object.values(row).map(val => 
          typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
        ).join(','))
      ].join('\n');
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `community_submissions_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const getHealthStatus = () => {
    if (stats.errorRate > 10) return { status: 'error', color: 'bg-red-500', text: 'Issues Detected' };
    if (stats.pendingSubmissions > 20) return { status: 'warning', color: 'bg-yellow-500', text: 'High Load' };
    return { status: 'healthy', color: 'bg-green-500', text: 'All Systems Operational' };
  };

  const health = getHealthStatus();

  return (
    <Card className="bg-gray-900/80 border-gray-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-200">Production Monitor</CardTitle>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${health.color} animate-pulse`}></div>
            <span className="text-sm text-gray-400">{health.text}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
              className="ml-2"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{stats.totalSubmissions}</div>
            <div className="text-xs text-gray-400">Total Submissions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{stats.todaySubmissions}</div>
            <div className="text-xs text-gray-400">Today</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{stats.pendingSubmissions}</div>
            <div className="text-xs text-gray-400">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{stats.approvedSubmissions}</div>
            <div className="text-xs text-gray-400">Approved</div>
          </div>
        </div>
        
        {stats.lastSubmission && (
          <div className="text-sm text-gray-400">
            Last submission: {new Date(stats.lastSubmission).toLocaleString()}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-800">
          <Badge variant="outline" className="text-xs">
            {health.status === 'healthy' ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
            System {health.text}
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="text-xs"
          >
            <Download className="h-3 w-3 mr-1" />
            Export Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};