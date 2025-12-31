import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, TrendingUp, Eye, Globe } from "lucide-react";

interface VisitorStats {
  totalVisitors: number;
  todayVisitors: number;
  thisWeekVisitors: number;
  thisMonthVisitors: number;
  uniqueVisitors: number;
}

export const VisitorCounter: React.FC = () => {
  const [stats, setStats] = useState<VisitorStats>({
    totalVisitors: 0,
    todayVisitors: 0,
    thisWeekVisitors: 0,
    thisMonthVisitors: 0,
    uniqueVisitors: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading visitor data
    const loadStats = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in a real app, this would come from your analytics API
      const mockStats: VisitorStats = {
        totalVisitors: 15420,
        todayVisitors: 342,
        thisWeekVisitors: 2847,
        thisMonthVisitors: 12456,
        uniqueVisitors: 8923
      };
      
      setStats(mockStats);
      setIsLoading(false);
    };

    loadStats();
  }, []);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const getPercentageChange = (current: number, previous: number): number => {
    if (previous === 0) return 100;
    return Math.round(((current - previous) / previous) * 100);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-[#1C1C1F] border-gray-700/40">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-[#1C1C1F] border-gray-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Visitors</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.totalVisitors)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+12%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1F] border-gray-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Today</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.todayVisitors)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+8%</span>
              <span className="text-gray-400 ml-1">from yesterday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1F] border-gray-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">This Week</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.thisWeekVisitors)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+15%</span>
              <span className="text-gray-400 ml-1">from last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#1C1C1F] border-gray-700/40">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Unique Visitors</p>
                <p className="text-2xl font-bold text-white">{formatNumber(stats.uniqueVisitors)}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
                <Globe className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-400 mr-1" />
              <span className="text-green-400">+22%</span>
              <span className="text-gray-400 ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <Card className="bg-[#1C1C1F] border-gray-700/40">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Visitor Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Average Session Duration</p>
              <p className="text-2xl font-bold text-white">4m 32s</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Bounce Rate</p>
              <p className="text-2xl font-bold text-white">23.4%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-400 mb-2">Pages per Session</p>
              <p className="text-2xl font-bold text-white">3.2</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 