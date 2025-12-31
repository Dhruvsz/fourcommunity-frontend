
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";
import { Globe, TrendingUp, Users, MousePointer } from "lucide-react";

// Mock data for analytics
const visitorsByCountry = [
  { country: "United States", value: 35 },
  { country: "India", value: 20 },
  { country: "United Kingdom", value: 15 },
  { country: "Germany", value: 8 },
  { country: "Canada", value: 7 },
  { country: "Brazil", value: 5 },
  { country: "Others", value: 10 },
];

const referrers = [
  { name: "Direct", value: 40 },
  { name: "Google", value: 30 },
  { name: "Twitter", value: 10 },
  { name: "Facebook", value: 8 },
  { name: "LinkedIn", value: 7 },
  { name: "Other", value: 5 },
];

const joinClicksByPlatform = [
  { name: "WhatsApp", value: 55 },
  { name: "Telegram", value: 30 },
  { name: "Slack", value: 15 },
];

const dailyActiveUsers = [
  { date: "2023-05-01", users: 1200 },
  { date: "2023-05-02", users: 1300 },
  { date: "2023-05-03", users: 1400 },
  { date: "2023-05-04", users: 1350 },
  { date: "2023-05-05", users: 1500 },
  { date: "2023-05-06", users: 2000 },
  { date: "2023-05-07", users: 2200 },
  { date: "2023-05-08", users: 1800 },
  { date: "2023-05-09", users: 1900 },
  { date: "2023-05-10", users: 2100 },
  { date: "2023-05-11", users: 2300 },
  { date: "2023-05-12", users: 2000 },
  { date: "2023-05-13", users: 2100 },
  { date: "2023-05-14", users: 2400 },
];

const weeklyEngagementData = [
  { day: "Mon", pageViews: 2200, uniqueVisitors: 1400, joins: 380 },
  { day: "Tue", pageViews: 2800, uniqueVisitors: 1600, joins: 420 },
  { day: "Wed", pageViews: 3500, uniqueVisitors: 1900, joins: 520 },
  { day: "Thu", pageViews: 3200, uniqueVisitors: 1800, joins: 490 },
  { day: "Fri", pageViews: 3800, uniqueVisitors: 2100, joins: 580 },
  { day: "Sat", pageViews: 4200, uniqueVisitors: 2400, joins: 650 },
  { day: "Sun", pageViews: 3600, uniqueVisitors: 2000, joins: 550 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A569BD", "#5DADE2", "#45B39D"];

const Analytics = () => {
  return (
    <div>
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-white">User Analytics</h1>
          <p className="text-gray-400 mt-1">Insights about platform visitors and engagement</p>
        </motion.div>
      </header>

      {/* Weekly Engagement Chart */}
      <Card className="shadow-sm border border-gray-800 bg-gray-900/60 mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center text-white">
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" /> Weekly Engagement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyEngagementData}>
                <defs>
                  <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3e90cf" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3e90cf" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorUniqueVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorJoins" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-800 p-4 border border-gray-700 shadow-md rounded-md">
                          <p className="font-medium text-white">{payload[0].payload.day}</p>
                          <p className="text-sm text-[#3e90cf]">
                            Page Views: {payload[0].value.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#82ca9d]">
                            Unique Visitors: {payload[1].value.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#ffc658]">
                            Joins: {payload[2].value.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="pageViews"
                  stroke="#3e90cf"
                  fillOpacity={1}
                  fill="url(#colorPageViews)"
                  name="Page Views"
                />
                <Area
                  type="monotone"
                  dataKey="uniqueVisitors"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#colorUniqueVisitors)"
                  name="Unique Visitors"
                />
                <Area
                  type="monotone"
                  dataKey="joins"
                  stroke="#ffc658"
                  fillOpacity={1}
                  fill="url(#colorJoins)"
                  name="Group Joins"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Daily Active Users */}
        <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-white">
              <Users className="h-5 w-5 mr-2 text-purple-500" /> Daily Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dailyActiveUsers}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9ca3af' }}
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}/${date.getDate()}`;
                    }} 
                  />
                  <YAxis tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                            <p className="text-sm font-medium text-white">
                              {new Date(label).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-300">
                              {`${payload[0].value} users`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="users"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Visitors by Country */}
        <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-white">
              <Globe className="h-5 w-5 mr-2 text-green-500" /> Visitors by Country
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={visitorsByCountry} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis type="number" tick={{ fill: '#9ca3af' }} />
                  <YAxis dataKey="country" type="category" width={100} tick={{ fill: '#9ca3af' }} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                            <p className="text-sm font-medium text-white">{payload[0].payload.country}</p>
                            <p className="text-sm text-gray-400">{`${payload[0].value}% of visitors`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="#8884d8" name="Visitors %" label={{ position: 'right', fill: '#666' }}>
                    {visitorsByCountry.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Traffic Source */}
        <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-white">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" /> Traffic Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referrers}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {referrers.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                            <p className="text-sm font-medium text-white">{payload[0].name}</p>
                            <p className="text-sm text-gray-400">{`${payload[0].value}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Join Clicks by Platform */}
        <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center text-white">
              <MousePointer className="h-5 w-5 mr-2 text-amber-500" /> Join Clicks by Platform
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={joinClicksByPlatform}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#25D366" />  {/* WhatsApp Green */}
                    <Cell fill="#0088CC" />  {/* Telegram Blue */}
                    <Cell fill="#4A154B" />  {/* Slack Purple */}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-gray-800 p-3 border border-gray-700 shadow-lg rounded-md">
                            <p className="text-sm font-medium text-white">{payload[0].name}</p>
                            <p className="text-sm text-gray-400">{`${payload[0].value}%`}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
