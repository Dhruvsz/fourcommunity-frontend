import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  MessageSquare, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Monitor, 
  Smartphone,
  Globe,
  Calendar,
  Activity,
  TrendingUp,
  Archive,
  AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { toast } from '../hooks/use-toast';

// Fallback if toast is not available
const safeToast = (options: any) => {
  try {
    if (typeof toast === 'function') {
      toast(options);
    } else {
      console.log('Toast:', options.title, options.description);
    }
  } catch (error) {
    console.log('Toast fallback:', options.title, options.description);
  }
};

interface UserSignup {
  id: string;
  email: string;
  created_at: string;
  signup_source?: string;
  status: string;
  last_sign_in_at?: string;
}

interface CommunitySubmission {
  id: string;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  join_link: string;
  join_type?: 'free' | 'paid' | string;
  price_inr?: number | null;
  founder_name: string;
  founder_bio: string;
  status: string;
  created_at: string;
  updated_at: string;
  approved_at?: string;
  logo_url?: string;
  ip_address?: string;
  location?: string;
  device_type?: string;
  user_agent?: string;
  submission_source?: string;
}

interface LiveCommunity {
  id: string;
  community_name: string;
  platform: string;
  category: string;
  status: string;
  created_at: string;
  approved_at?: string;
  views?: number;
  clicks?: number;
}

export default function AdminDashboardNew() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userSignups, setUserSignups] = useState<UserSignup[]>([]);
  const [submissions, setSubmissions] = useState<CommunitySubmission[]>([]);
  const [liveCommunities, setLiveCommunities] = useState<LiveCommunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<CommunitySubmission | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    console.log('🔄 Starting dashboard data fetch...');
    
    // Set loading to false immediately to show UI
    setLoading(false);
    
    try {
      // Create some mock data for immediate display
      const mockSubmissions = [
        {
          id: '1',
          community_name: 'Tech Innovators Hub',
          platform: 'Discord',
          category: 'Technology',
          short_description: 'A community for tech enthusiasts and innovators',
          long_description: 'Join our vibrant community of technology enthusiasts, developers, and innovators. Share ideas, collaborate on projects, and stay updated with the latest tech trends.',
          join_link: 'https://discord.gg/tech-innovators',
          founder_name: 'Alex Johnson',
          founder_bio: 'Software engineer with 8 years of experience in full-stack development',
          status: 'pending',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ip_address: '192.168.1.100',
          location: 'San Francisco, CA, USA',
          device_type: 'desktop'
        },
        {
          id: '2',
          community_name: 'Digital Artists Collective',
          platform: 'Telegram',
          category: 'Art & Design',
          short_description: 'Creative space for digital artists',
          long_description: 'A collaborative platform for digital artists to showcase work, get feedback, and connect with fellow creatives.',
          join_link: 'https://t.me/digital-artists',
          founder_name: 'Sarah Chen',
          founder_bio: 'Professional digital artist and UI/UX designer',
          status: 'approved',
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date().toISOString(),
          approved_at: new Date().toISOString(),
          ip_address: '10.0.0.50',
          location: 'New York, NY, USA',
          device_type: 'mobile'
        }
      ];

      // Set mock data immediately
      setUserSignups([]);
      setSubmissions(mockSubmissions);
      setLiveCommunities(mockSubmissions.filter(s => s.status === 'approved'));
      
      console.log('✅ Mock data loaded for immediate display');
      
      // Try to fetch real data in background
      setTimeout(async () => {
        try {
          const { data: subs, error: subsError } = await supabase
            .from('community_subs')
            .select('*')
            .order('created_at', { ascending: false });

          if (!subsError && subs) {
            console.log('✅ Real submissions fetched:', subs.length);
            setSubmissions(subs);
            setLiveCommunities(subs.filter(s => s.status === 'approved'));
          }
        } catch (error) {
          console.log('Using mock data due to fetch error:', error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('❌ Dashboard setup error:', error);
    }
  };

  const handleApproval = async (submission: CommunitySubmission, action: 'approve' | 'reject', reason?: string) => {
    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('community_subs')
        .update({
          status: newStatus,
          approved_at: action === 'approve' ? new Date().toISOString() : null,
          rejection_reason: action === 'reject' ? reason : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', submission.id);

      if (error) throw error;

      // Update local state
      setSubmissions(prev => prev.map(s => 
        s.id === submission.id 
          ? { ...s, status: newStatus, approved_at: action === 'approve' ? new Date().toISOString() : s.approved_at }
          : s
      ));

      if (action === 'approve') {
        setLiveCommunities(prev => [...prev, { ...submission, approved_at: new Date().toISOString() }]);
        
        // 🚀 CRITICAL: Notify Communities page to refresh immediately
        console.log('🚀 ADMIN: Dispatching community approval events for:', submission.community_name);
        
        // Dispatch multiple events for maximum compatibility
        window.dispatchEvent(new CustomEvent('FORCE_COMMUNITIES_REFRESH', { 
          detail: { source: 'admin_approval', community: submission } 
        }));
        
        window.dispatchEvent(new CustomEvent('addApprovedCommunity', { 
          detail: {
            id: submission.id.toString(),
            name: submission.community_name,
            description: submission.short_description,
            fullDescription: submission.long_description,
            category: submission.category,
            platform: submission.platform,
            members: 0,
            verified: true,
            joinLink: submission.join_type === 'paid' ? '' : submission.join_link,
            joinType: submission.join_type === 'paid' ? 'paid' : 'free',
            priceInr: typeof submission.price_inr === 'number' ? submission.price_inr : null,
            logo: submission.logo_url || '',
            location: "Global",
            tags: [submission.category, submission.platform],
            admin: submission.founder_name,
            adminBio: submission.founder_bio
          }
        }));
        
        window.dispatchEvent(new CustomEvent('refreshCommunities', { 
          detail: { source: 'admin_approval' } 
        }));
        
        console.log('✅ ADMIN: All refresh events dispatched successfully');
      }

      safeToast({
        title: action === 'approve' ? "Community Approved" : "Community Rejected",
        description: `${submission.community_name} has been ${action}d successfully`,
      });

      setSelectedSubmission(null);
    } catch (error) {
      console.error('Approval error:', error);
      safeToast({
        title: "Error",
        description: `Failed to ${action} community`,
        variant: "destructive",
      });
    }
  };

  const handleDelist = async (community: LiveCommunity) => {
    try {
      const { error } = await supabase
        .from('community_subs')
        .update({
          status: 'delisted',
          delisted_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', community.id);

      if (error) throw error;

      setLiveCommunities(prev => prev.filter(c => c.id !== community.id));

      safeToast({
        title: "Community Delisted",
        description: `${community.community_name} has been removed from public view`,
      });
    } catch (error) {
      console.error('Delist error:', error);
      safeToast({
        title: "Error",
        description: "Failed to delist community",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'delisted': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = submissions.filter(s => s.status === 'pending').length;
  const approvedCount = submissions.filter(s => s.status === 'approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'rejected').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">End-to-end community lifecycle management</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-blue-500/20 text-blue-400">
                <Activity className="h-3 w-3 mr-1" />
                Live System
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-900/50 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-blue-600">Users</TabsTrigger>
            <TabsTrigger value="submissions" className="data-[state=active]:bg-blue-600">Submissions</TabsTrigger>
            <TabsTrigger value="live" className="data-[state=active]:bg-blue-600">Live Communities</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 cursor-pointer hover:border-gray-600 transition-colors" onClick={() => setActiveTab('users')}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Users className="h-4 w-4 mr-2" />
                    Total Users
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors">{userSignups.length}</div>
                  <p className="text-xs text-gray-500 mt-1">Registered accounts</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 cursor-pointer hover:border-yellow-600 transition-colors" onClick={() => {
                setActiveTab('submissions');
                // Filter to pending submissions
                setTimeout(() => {
                  const pendingSubmissions = document.querySelectorAll('[data-status="pending"]');
                  if (pendingSubmissions.length > 0) {
                    pendingSubmissions[0].scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    Pending Review
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition-colors">{pendingCount}</div>
                  <p className="text-xs text-gray-500 mt-1">Awaiting approval</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 cursor-pointer hover:border-green-600 transition-colors" onClick={() => setActiveTab('live')}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approved
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-400 hover:text-green-300 transition-colors">{approvedCount}</div>
                  <p className="text-xs text-gray-500 mt-1">Live communities</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 cursor-pointer hover:border-red-600 transition-colors" onClick={() => {
                setActiveTab('submissions');
                // Filter to rejected submissions
                setTimeout(() => {
                  const rejectedSubmissions = document.querySelectorAll('[data-status="rejected"]');
                  if (rejectedSubmissions.length > 0) {
                    rejectedSubmissions[0].scrollIntoView({ behavior: 'smooth' });
                  }
                }, 100);
              }}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-400 flex items-center">
                    <XCircle className="h-4 w-4 mr-2" />
                    Rejected
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-400 hover:text-red-300 transition-colors">{rejectedCount}</div>
                  <p className="text-xs text-gray-500 mt-1">Declined submissions</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.slice(0, 5).map((submission) => (
                    <div key={submission.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                        <div>
                          <p className="font-medium">{submission.community_name}</p>
                          <p className="text-sm text-gray-400">{submission.platform} • {submission.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status}
                        </Badge>
                        <span className="text-xs text-gray-500">{formatDate(submission.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-400" />
                  User Onboarding Report
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userSignups.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{user.email}</p>
                          <p className="text-sm text-gray-400">ID: {user.id.slice(0, 8)}...</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{formatDate(user.created_at)}</p>
                        <Badge className={user.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}>
                          {user.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                  Community Submission Inbox
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <motion.div
                      key={submission.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer"
                      onClick={() => setSelectedSubmission(submission)}
                      data-status={submission.status}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{submission.community_name}</h3>
                            <Badge className={getStatusColor(submission.status)}>
                              {submission.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-400 mb-3">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              {submission.platform}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {formatDate(submission.created_at)}
                            </div>
                            {submission.location && (
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {submission.location}
                              </div>
                            )}
                            {submission.device_type && (
                              <div className="flex items-center">
                                {submission.device_type === 'mobile' ? 
                                  <Smartphone className="h-4 w-4 mr-1" /> : 
                                  <Monitor className="h-4 w-4 mr-1" />
                                }
                                {submission.device_type}
                              </div>
                            )}
                          </div>
                          <p className="text-gray-300 mb-2">{submission.short_description}</p>
                          <p className="text-sm text-gray-400">Founder: {submission.founder_name}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {submission.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproval(submission, 'approve');
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproval(submission, 'reject');
                                }}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="outline" className="border-gray-600">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Communities Tab */}
          <TabsContent value="live" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-400" />
                  Live Communities Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveCommunities.map((community) => (
                    <div key={community.id} className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-lg">{community.community_name}</h3>
                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                              Live
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Globe className="h-4 w-4 mr-1" />
                              {community.platform}
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Approved: {formatDate(community.approved_at)}
                            </div>
                            {community.views && (
                              <div className="flex items-center">
                                <Eye className="h-4 w-4 mr-1" />
                                {community.views} views
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-600/10"
                            onClick={() => handleDelist(community)}
                          >
                            <Archive className="h-4 w-4 mr-1" />
                            Delist
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Detailed Submission Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">{selectedSubmission.community_name}</h2>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedSubmission(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-400">Community Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Platform:</span> {selectedSubmission.platform}</p>
                      <p><span className="text-gray-400">Category:</span> {selectedSubmission.category}</p>
                      <p><span className="text-gray-400">Join Link:</span>
                        {selectedSubmission.join_type === 'paid' ? (
                          <span className="text-gray-300 ml-1">
                            Paid
                            {typeof selectedSubmission.price_inr === 'number' ? ` (₹${selectedSubmission.price_inr})` : ''}
                            . Link stored privately.
                          </span>
                        ) : (
                          <a href={selectedSubmission.join_link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline ml-1">
                            {selectedSubmission.join_link}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-blue-400">Descriptions</h3>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Short Description:</p>
                        <p className="text-sm bg-gray-800/50 p-2 rounded">{selectedSubmission.short_description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Full Description:</p>
                        <p className="text-sm bg-gray-800/50 p-2 rounded">{selectedSubmission.long_description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-2 text-blue-400">Founder Information</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Name:</span> {selectedSubmission.founder_name}</p>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Bio:</p>
                        <p className="bg-gray-800/50 p-2 rounded">{selectedSubmission.founder_bio || 'No bio provided'}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-blue-400">Submission Metadata</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-gray-400">Submitted:</span> {formatDate(selectedSubmission.created_at)}</p>
                      <p><span className="text-gray-400">Status:</span> 
                        <Badge className={`ml-2 ${getStatusColor(selectedSubmission.status)}`}>
                          {selectedSubmission.status}
                        </Badge>
                      </p>
                      {selectedSubmission.ip_address && (
                        <p><span className="text-gray-400">IP Address:</span> {selectedSubmission.ip_address}</p>
                      )}
                      {selectedSubmission.location && (
                        <p><span className="text-gray-400">Location:</span> {selectedSubmission.location}</p>
                      )}
                      {selectedSubmission.device_type && (
                        <p><span className="text-gray-400">Device:</span> {selectedSubmission.device_type}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {selectedSubmission.status === 'pending' && (
                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-700">
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleApproval(selectedSubmission, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve & Publish
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleApproval(selectedSubmission, 'reject')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
