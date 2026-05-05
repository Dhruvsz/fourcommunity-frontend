import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MoreHorizontal,
  ExternalLink,
  Home
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CommunitySubmission } from "@/types/submission";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { CommunitySubmission as FlowSubmission } from "@/lib/communityFlow";

const statusStylesConfig = {
  "pending": { 
    badge: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    icon: <Clock className="h-4 w-4 mr-1" />
  },
  "approved": { 
    badge: "bg-green-100 text-green-800 hover:bg-green-200",
    icon: <CheckCircle className="h-4 w-4 mr-1" />
  },
  "rejected": { 
    badge: "bg-red-100 text-red-800 hover:bg-red-200",
    icon: <XCircle className="h-4 w-4 mr-1" />
  },
};

const Submissions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all-categories");
  const [statusFilter, setStatusFilter] = useState<string>("all-status");
  const [selectedSubmission, setSelectedSubmission] = useState<FlowSubmission | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");
  const [submissions, setSubmissions] = useState<FlowSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch submissions using centralized flow
  useEffect(() => {
    console.log('🚀 COMPONENT MOUNTED - Starting fetch');
    fetchSubmissions();
    
    // Listen for new submissions
    const handleNewSubmission = (event: CustomEvent) => {
      console.log('🔔 New submission received:', event.detail);
      fetchSubmissions(); // Refresh the list
    };

    window.addEventListener('newSubmission', handleNewSubmission as EventListener);
    
    return () => {
      window.removeEventListener('newSubmission', handleNewSubmission as EventListener);
    };
  }, []);

  // Force re-render when submissions change
  useEffect(() => {
    console.log('🔄 SUBMISSIONS STATE CHANGED:', submissions.length, 'items');
    console.log('🔄 Current submissions:', submissions);
  }, [submissions]);

  const fetchSubmissions = async () => {
    console.log('🔍 EMERGENCY FETCH - Starting database query...');
    
    // Force loading state
    setLoading(true);
    setSubmissions([]); // Clear existing data
    
    try {
      console.log('📡 Making Supabase query...');
      
      const response = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      console.log('📊 EMERGENCY Raw response:', response);
      console.log('📊 EMERGENCY Data:', response.data);
      console.log('📊 EMERGENCY Error:', response.error);

      if (response.error) {
        console.error('❌ EMERGENCY Database error:', response.error);
        throw response.error;
      }
      
      const submissions = response.data || [];
      console.log('📊 EMERGENCY Processing', submissions.length, 'submissions');
      
      // Force React to update by using functional state update
      setSubmissions(prev => {
        console.log('📊 EMERGENCY State update - prev:', prev.length, 'new:', submissions.length);
        return submissions;
      });
      
      // Force loading off
      setLoading(false);
      
      console.log('✅ EMERGENCY Fetch complete - submissions:', submissions.length);
      
      // Show result toast
      toast({
        title: submissions.length > 0 ? "✅ Data Loaded" : "⚠️ No Data",
        description: submissions.length > 0 
          ? `Loaded ${submissions.length} submissions` 
          : "No submissions found in database",
        variant: submissions.length > 0 ? "default" : "destructive"
      });
      
    } catch (error) {
      console.error('❌ EMERGENCY Fetch failed:', error);
      setSubmissions([]);
      setLoading(false);
      
      toast({
        title: "❌ Database Error",
        description: `Query failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // Filter submissions based on search and filters
  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.community_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      submission.short_description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = categoryFilter === "all-categories" ? true : submission.category === categoryFilter;
    const matchesStatus = statusFilter === "all-status" ? true : submission.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  console.log('🔍 Debug info:');
  console.log('Total submissions:', submissions.length);
  console.log('Filtered submissions:', filteredSubmissions.length);
  console.log('Status filter:', statusFilter);
  console.log('Category filter:', categoryFilter);

  const handleReviewClick = (submission: FlowSubmission) => {
    setSelectedSubmission(submission);
    setReviewNotes("");
    setIsReviewModalOpen(true);
  };

  // Helper: get current session token
  const getToken = async (): Promise<string | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const handleApprove = async (id?: string) => {
    const targetId = id ?? selectedSubmission?.id;
    const targetName = selectedSubmission?.community_name ?? 'Community';
    if (!targetId) return;

    try {
      const token = await getToken();
      if (!token) {
        toast({ title: "Not authenticated", variant: "destructive" });
        return;
      }

      const response = await fetch(`/api/admin/approve/${targetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        setIsReviewModalOpen(false);
        setReviewNotes("");
        toast({
          title: "Community Approved ✅",
          description: `${targetName} is now live on the Communities page!`,
        });
        fetchSubmissions();
      } else {
        throw new Error(data.error || 'Approval failed');
      }
    } catch (error) {
      console.error('❌ Approval failed:', error);
      toast({ title: "Error", description: "Failed to approve community.", variant: "destructive" });
    }
  };

  const handleReject = async (id?: string) => {
    const targetId = id ?? selectedSubmission?.id;
    const targetName = selectedSubmission?.community_name ?? 'Community';
    if (!targetId) return;

    try {
      const token = await getToken();
      if (!token) {
        toast({ title: "Not authenticated", variant: "destructive" });
        return;
      }

      const response = await fetch(`/api/admin/reject/${targetId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ review_notes: reviewNotes || null })
      });

      const data = await response.json();

      if (data.success) {
        setIsReviewModalOpen(false);
        setReviewNotes("");
        toast({
          title: "Community Rejected ❌",
          description: `${targetName} has been rejected.`,
        });
        fetchSubmissions();
      } else {
        throw new Error(data.error || 'Rejection failed');
      }
    } catch (error) {
      console.error('❌ Rejection failed:', error);
      toast({ title: "Error", description: "Failed to reject community.", variant: "destructive" });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingCount = submissions.filter(sub => sub.status === 'pending').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Submissions</h1>
          <p className="text-gray-400 mt-1">Review and manage community submissions</p>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={fetchSubmissions}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            🔄 Refresh Data
          </Button>
          <div className="px-3 py-1 bg-yellow-600 text-white text-sm rounded-full">
            {submissions.length} Total
          </div>
        </div>
      </div>
      
      <Card className="p-6 mb-6 shadow-sm border border-gray-800 bg-gray-900/60">
        <div className="mb-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
          <p className="text-sm text-blue-300">
            ℹ️ <strong>Note:</strong> Approved communities are automatically moved to the <a href="/communities" className="underline hover:text-blue-200">Communities page</a> and removed from this list.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative md:col-span-2">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search communities..."
              className="pl-10 bg-gray-800/70 border-gray-700 text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="bg-gray-800/70 border-gray-700 text-white">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-categories">All Categories</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Design">Design</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-gray-800/70 border-gray-700 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-status">All Status</SelectItem>
              <SelectItem value="pending">Pending Review</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Submissions Table */}
      <Card className="shadow-sm border border-gray-800 bg-gray-900/60">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-800">
              <TableHead className="text-gray-300">Community Name</TableHead>
              <TableHead className="text-gray-300">Category</TableHead>
              <TableHead className="text-gray-300">Contact</TableHead>
              <TableHead className="text-gray-300">Submitted</TableHead>
              <TableHead className="text-gray-300">Status</TableHead>
              <TableHead className="text-right text-gray-300">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <div>🔄 EMERGENCY LOADING... Check console for details</div>
                    <div className="text-sm text-gray-400">Current count: {submissions.length}</div>
                    <button 
                      onClick={() => {
                        console.log('🚨 MANUAL RELOAD CLICKED');
                        fetchSubmissions();
                      }}
                      className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                    >
                      🚨 EMERGENCY RELOAD
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  <div className="flex flex-col items-center gap-4">
                    <p className="text-xl">❌ NO DATA LOADED</p>
                    <p>Database connection may have failed</p>
                    <button 
                      onClick={() => {
                        console.log('🚨 EMERGENCY LOAD CLICKED');
                        fetchSubmissions();
                      }}
                      className="px-6 py-3 bg-red-600 text-white rounded hover:bg-red-700 font-bold"
                    >
                      🚨 EMERGENCY LOAD
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredSubmissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-400">
                  <div>
                    <p>No submissions found matching your criteria.</p>
                    <p className="text-sm mt-2">Total submissions: {submissions.length}</p>
                    <p className="text-sm">Filtered submissions: {filteredSubmissions.length}</p>
                    <p className="text-sm">Status filter: {statusFilter}</p>
                    <p className="text-sm">Category filter: {categoryFilter}</p>
                    <button 
                      onClick={fetchSubmissions}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Retry Loading
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredSubmissions.map((submission) => {
                const statusStyle = statusStylesConfig[submission.status];

                return (
                  <TableRow key={submission.id} className="border-gray-800 hover:bg-gray-800/50">
                    <TableCell className="font-medium text-white">
                      <div>
                        <div className="flex items-center gap-2">
                          {submission.logo_url && (
                            <img 
                              src={submission.logo_url} 
                              alt="" 
                              className="w-8 h-8 rounded object-cover"
                            />
                          )}
                          {submission.community_name}
                          {submission.status === 'pending' && (
                            <AlertTriangle size={14} className="text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {submission.short_description}
                        </div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <Badge variant="outline" className="font-normal border-gray-700 text-gray-300">
                        {submission.category}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-gray-300">{submission.founder_name}</TableCell>
                    <TableCell className="text-gray-400 text-sm">
                      {formatDate(submission.created_at)}
                    </TableCell>
                    
                    <TableCell>
                      <Badge className={`gap-1 font-normal ${statusStyle.badge}`}>
                        {statusStyle.icon} {submission.status}
                      </Badge>
                    </TableCell>
                    
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedSubmission(submission)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      
                      {submission.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleApprove(submission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Quick Approve
                        </Button>
                      )}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleApprove(submission.id)}>
                            Quick Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleReject(submission.id)}>
                            Quick Reject
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      </div>
                    </TableCell>
                </TableRow>
              );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-4xl bg-gray-900 border-gray-800">
          {selectedSubmission && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">Review Community Submission</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Review details and take action on this community submission
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Info */}
                  <div>
                    <div className="flex items-start gap-4">
                      {selectedSubmission.logo_url && (
                        <img 
                          src={selectedSubmission.logo_url} 
                          alt="" 
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-white">{selectedSubmission.community_name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="border-gray-700 text-gray-300">
                            {selectedSubmission.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Description</h4>
                    <p className="text-gray-300">{selectedSubmission.short_description}</p>
                  </div>
                  
                  {/* Contact & Links */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-2">Founder</h4>
                      <p className="text-gray-300">{selectedSubmission.founder_name}</p>
                    </div>
                    
                    {selectedSubmission.join_link && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-400 mb-2">Join Link</h4>
                        {selectedSubmission.join_type === 'paid' ? (
                          <div className="text-gray-300">
                            Paid
                            {typeof selectedSubmission.price_inr === 'number' ? ` (₹${selectedSubmission.price_inr})` : ''}
                            . Link stored privately.
                          </div>
                        ) : (
                          <a 
                            href={selectedSubmission.join_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:underline flex items-center gap-1"
                          >
                            {selectedSubmission.join_link}
                            <ExternalLink size={14} />
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Long Description</h4>
                    <p className="text-gray-300 text-sm">{selectedSubmission.long_description}</p>
                  </div>
                  
                  {/* Review Notes */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-400 mb-2">Review Notes</h4>
                    <Textarea
                      placeholder="Add your review notes or reason for rejection..."
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      className="bg-gray-800/70 border-gray-700 text-white"
                      rows={3}
                    />
                  </div>
                </div>
                
                {/* Action Panel */}
                <div className="space-y-4">
                  <Card className="p-4 border-gray-700 bg-gray-800/50">
                    <h4 className="text-sm font-medium text-white mb-3">Review Actions</h4>
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove()}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve Community
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full border-red-600 text-red-400 hover:bg-red-600/10"
                        onClick={() => handleReject()}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject Submission
                      </Button>
                    </div>
                  </Card>
                  
                  <Card className="p-4 border-gray-700 bg-gray-800/50">
                    <h4 className="text-sm font-medium text-white mb-3">Submission Info</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <Badge className={statusStylesConfig[selectedSubmission.status].badge}>
                          {selectedSubmission.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Submitted</span>
                        <span className="text-gray-300">
                          {formatDate(selectedSubmission.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Platform</span>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          {selectedSubmission.platform}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Submissions;
