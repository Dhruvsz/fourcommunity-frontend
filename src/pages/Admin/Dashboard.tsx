import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  LayoutGrid, 
  TrendingUp,
  Calendar,
  Download
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useToast } from "@/hooks/use-toast";
import CapacityFilter from "@/components/admin/CapacityFilter";
import { VisitorCounter } from "@/components/VisitorCounter";
import { ProductionMonitor } from "@/components/admin/ProductionMonitor";

const Dashboard = () => {
  const { toast } = useToast();
  const [capacityFilter, setCapacityFilter] = useState([50]);
  
  // Mock data
  const platformData = [
    { name: "WhatsApp", value: 65 },
    { name: "Telegram", value: 25 },
    { name: "Slack", value: 10 },
  ];

  const recentSubmissions = [
    {
      id: "1",
      name: "Tech Discussions",
      platform: "WhatsApp",
      category: "Technology",
      members: 945,
      status: "Pending",
      submittedAt: "2 hours ago",
    },
    {
      id: "2",
      name: "Web Developers",
      platform: "Slack",
      category: "Development",
      members: 560,
      status: "Approved",
      submittedAt: "5 hours ago",
    },
    {
      id: "3",
      name: "AI Community",
      platform: "Telegram",
      category: "AI",
      members: 12500,
      status: "Pending",
      submittedAt: "8 hours ago",
    },
    {
      id: "4",
      name: "Startup Founders",
      platform: "WhatsApp",
      category: "Entrepreneurship",
      members: 1020,
      status: "Pending",
      submittedAt: "12 hours ago",
    },
    {
      id: "5",
      name: "UX Design Group",
      platform: "Slack",
      category: "Design",
      members: 325,
      status: "Approved",
      submittedAt: "1 day ago",
    },
  ];

  const COLORS = ["#25D366", "#0088CC", "#4A154B"];

  const categoryData = [
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Education", value: 20 },
    { name: "Entertainment", value: 10 },
    { name: "Health", value: 10 },
  ];

  const visitorData = [
    { name: "Jan", visitors: 400 },
    { name: "Feb", visitors: 300 },
    { name: "Mar", visitors: 600 },
    { name: "Apr", visitors: 800 },
    { name: "May", visitors: 700 },
    { name: "Jun", visitors: 900 },
    { name: "Jul", visitors: 1100 },
  ];
  
  // Country data for visualization
  const countryData = [
    { name: "United States", value: 35 },
    { name: "India", value: 28 },
    { name: "United Kingdom", value: 15 },
    { name: "Germany", value: 12 },
    { name: "Canada", value: 10 },
  ];
  
  // Filter submissions based on capacity
  const filteredSubmissions = recentSubmissions.filter(submission => {
    // Calculate capacity percentage based on platform
    const maxCapacity = submission.platform === "WhatsApp" ? 1024 : 
                        submission.platform === "Telegram" ? 200000 : 100000;
    const capacityPercentage = (submission.members / maxCapacity) * 100;
    return capacityPercentage >= capacityFilter[0];
  });
  
  const handleExportData = (format) => {
    // Simulate export process
    const fileName = `community_data_${new Date().toISOString().slice(0, 10)}.${format}`;
    
    toast({
      title: `Export successful`,
      description: `Data exported as ${fileName}`,
    });
  };

  return (
    <div>
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-gray-200">Welcome back, Dhruv 👋</h1>
          <p className="text-gray-400 mt-1">Here's what's happening with your communities today.</p>
        </motion.div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard 
          title="Total Communities" 
          value="648" 
          icon={<LayoutGrid className="h-6 w-6 text-blue-500" />} 
          trend={{ value: 12, isPositive: true }}
          color="bg-gray-900"
          delay={0}
        />
        <StatsCard 
          title="New Communities Today" 
          value="24" 
          icon={<Calendar className="h-6 w-6 text-green-500" />}
          trend={{ value: 8, isPositive: true }}
          color="bg-gray-900"
          delay={1}
        />
        <StatsCard 
          title="Total Users" 
          value="12.4k" 
          icon={<Users className="h-6 w-6 text-purple-400" />}
          trend={{ value: 20, isPositive: true }}
          color="bg-gray-900"
          delay={2}
        />
        <StatsCard 
          title="Active Communities" 
          value="85%" 
          icon={<TrendingUp className="h-6 w-6 text-orange-400" />}
          trend={{ value: 5, isPositive: true }}
          color="bg-gray-900"
          delay={3}
        />
      </div>

      {/* Filters and Export */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="bg-gray-900/80 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                <CardTitle className="text-lg font-medium text-gray-200">Geographic Distribution</CardTitle>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-8 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => handleExportData('csv')}
                  >
                    <Download className="w-3 h-3 mr-1" /> CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-xs h-8 bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                    onClick={() => handleExportData('json')}
                  >
                    <Download className="w-3 h-3 mr-1" /> JSON
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                    <YAxis tick={{ fill: '#9ca3af' }} />
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                              <p className="text-sm font-medium text-gray-200">{payload[0].payload.name}</p>
                              <p className="text-sm text-gray-400">{`${payload[0].value}% of communities`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#3e90cf" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <CapacityFilter value={capacityFilter} onChange={setCapacityFilter} />
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gray-900/80 border-gray-800 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-gray-200">Visitors Overview</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ChartContainer className="h-full" config={{
                visitors: { theme: { light: '#3e90cf', dark: '#3e90cf' }},
              }}>
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3e90cf" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3e90cf" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" tick={{ fill: '#9ca3af' }} />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                            <p className="text-sm font-medium text-gray-200">{payload[0].payload.name}</p>
                            <p className="text-sm text-gray-400">{`${payload[0].value} visitors`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="visitors" stroke="#3e90cf" fillOpacity={1} fill="url(#colorUv)" />
                </AreaChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 gap-6">
          <Card className="bg-gray-900/80 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200">Platforms Distribution</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-64 flex items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={platformData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {platformData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                              <p className="text-sm font-medium text-gray-200">{payload[0].name}</p>
                              <p className="text-sm text-gray-400">{`${payload[0].value}% of communities`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/80 border-gray-800 shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-200">Top Categories</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                    <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fill: '#9ca3af' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                              <p className="text-sm font-medium text-gray-200">{payload[0].payload.name}</p>
                              <p className="text-sm text-gray-400">{`${payload[0].value}% of communities`}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Production Monitor */}
      <div className="mb-8">
        <ProductionMonitor />
      </div>

      {/* Visitor Counter */}
      <div className="mb-8">
        <VisitorCounter />
      </div>

      {/* Recent Submissions */}
      <Card className="bg-gray-900/80 border-gray-800 shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium text-gray-200">Recent Submissions</CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-400">Name</TableHead>
                  <TableHead className="text-gray-400">Platform</TableHead>
                  <TableHead className="text-gray-400">Category</TableHead>
                  <TableHead className="text-gray-400">Members</TableHead>
                  <TableHead className="text-gray-400">Status</TableHead>
                  <TableHead className="text-gray-400">Submitted</TableHead>
                  <TableHead className="text-right text-gray-400">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubmissions.map((submission) => {
                  // Check if the group is near capacity based on platform
                  const maxCapacity = submission.platform === "WhatsApp" ? 1024 : 
                                     submission.platform === "Telegram" ? 200000 : 100000;
                  const capacityPercentage = (submission.members / maxCapacity) * 100;
                  const isNearCapacity = capacityPercentage > 90 && capacityPercentage < 100;
                  const isFull = capacityPercentage >= 100;
                  
                  // Style for the status badge
                  const statusStyle = {
                    "Pending": "bg-yellow-900/30 text-yellow-400 border-yellow-600/50 hover:bg-yellow-900/50",
                    "Approved": "bg-green-900/30 text-green-400 border-green-600/50 hover:bg-green-900/50",
                    "Rejected": "bg-red-900/30 text-red-400 border-red-600/50 hover:bg-red-900/50",
                  }[submission.status];

                  return (
                    <TableRow key={submission.id} className="border-gray-800">
                      <TableCell className="font-medium text-gray-200">
                        <div className="flex items-center gap-2">
                          {submission.name}
                          {isNearCapacity && (
                            <span className="px-2 py-1 text-xs rounded-full bg-amber-900/30 text-amber-400 border border-amber-600/50">
                              Near Capacity
                            </span>
                          )}
                          {isFull && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-900/30 text-red-400 border border-red-600/50">
                              Full
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-normal border-gray-700 bg-gray-800/50 text-gray-300">
                          {submission.platform}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-300">{submission.category}</TableCell>
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          {submission.members.toLocaleString()}
                          <div className="w-16 h-1 bg-gray-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${
                                isFull ? "bg-red-500" : 
                                isNearCapacity ? "bg-amber-500" : 
                                "bg-green-500"
                              }`}
                              style={{ width: `${Math.min(100, capacityPercentage)}%` }}
                            ></div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`font-normal border ${statusStyle}`}>
                          {submission.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {submission.submittedAt}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white"
                        >
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {filteredSubmissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                      No communities match the selected capacity filter.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
