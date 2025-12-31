import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { CheckCircle, XCircle, ExternalLink, Calendar, User, Globe, Tag, MessageSquare, Clock, ArrowLeft } from 'lucide-react';
import { toast } from '../hooks/use-toast';

interface Community {
  id: string;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  join_link: string;
  join_type?: string;
  price_inr?: number | null;
  founder_name: string;
  founder_bio: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function AdminApproval() {
  const [searchParams] = useSearchParams();
  const [community, setCommunity] = useState<Community | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [showAll, setShowAll] = useState(false);

  const communityId = searchParams.get('id');
  const action = searchParams.get('action');
  const token = searchParams.get('token');

  useEffect(() => {
    if (communityId) {
      fetchCommunity();
    } else {
      fetchAllPendingCommunities();
    }
  }, [communityId]);

  const fetchCommunity = async () => {
    try {
      console.log('Fetching community with ID:', communityId);
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .eq('id', communityId)
        .single();

      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No community data returned');
        throw new Error('Community not found');
      }
      
      setCommunity(data);
      console.log('Community data set:', data);
    } catch (error) {
      console.error('Error fetching community:', error);
      toast({
        title: "Error",
        description: `Failed to load community details: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllPendingCommunities = async () => {
    try {
      console.log('Fetching all pending communities...');
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      console.log('Pending communities response:', { data, error });
      
      if (error) {
        console.error('Supabase error fetching pending:', error);
        throw error;
      }
      
      console.log('Found pending communities:', data?.length || 0);
      setAllCommunities(data || []);
      setShowAll(true);
    } catch (error) {
      console.error('Error fetching communities:', error);
      toast({
        title: "Error",
        description: `Failed to load pending communities: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (communityToProcess: Community, approvalAction: 'approve' | 'reject') => {
    setProcessing(true);
    
    try {
      const newStatus = approvalAction === 'approve' ? 'approved' : 'rejected';
      
      const { error } = await supabase
        .from('community_subs')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', communityToProcess.id);

      if (error) throw error;

      toast({
        title: approvalAction === 'approve' ? "Community Approved ✅" : "Community Rejected ❌",
        description: `${communityToProcess.community_name} has been ${approvalAction === 'approve' ? 'approved and is now live' : 'rejected'}!`,
      });

      // Update local state
      if (community && community.id === communityToProcess.id) {
        setCommunity({ ...community, status: newStatus });
      }
      
      // Remove from pending list if showing all
      if (showAll) {
        setAllCommunities(prev => prev.filter(c => c.id !== communityToProcess.id));
      }

    } catch (error) {
      console.error('Error updating community:', error);
      toast({
        title: "Error",
        description: `Failed to ${approvalAction} community. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp': return '💬';
      case 'telegram': return '✈️';
      case 'discord': return '🎮';
      case 'slack': return '💼';
      default: return '🌐';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading community details...</p>
        </div>
      </div>
    );
  }

  if (showAll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Approval Dashboard</h1>
            <p className="text-gray-600">Review and approve pending community submissions</p>
          </div>

          {allCommunities.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">All caught up!</h3>
                <p className="text-gray-600">No pending communities to review at the moment.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {allCommunities.map((comm) => (
                <Card key={comm.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {getPlatformIcon(comm.platform)} {comm.community_name}
                      </CardTitle>
                      <Badge className={getStatusColor(comm.status)}>
                        {comm.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Tag className="h-4 w-4 mr-2" />
                        {comm.category}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        {comm.founder_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDate(comm.created_at)}
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {comm.short_description}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <Button
                        size="sm"
                        onClick={() => handleApproval(comm, 'approve')}
                        disabled={processing}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleApproval(comm, 'reject')}
                        disabled={processing}
                        className="flex-1"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.location.href = `/admin-approval?id=${comm.id}`}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="py-12">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Community Not Found</h3>
            <p className="text-gray-600 mb-4">The requested community could not be found.</p>
            <Button onClick={() => window.location.href = '/admin-approval'}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/admin-approval'}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Community Review</h1>
          <p className="text-gray-600">Inspect and approve community submission</p>
        </div>

        {/* Main Community Card */}
        <Card className="mb-6 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-lg">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl font-bold mb-2">
                  {getPlatformIcon(community.platform)} {community.community_name}
                </CardTitle>
                <div className="flex items-center gap-4 text-indigo-100">
                  <span className="flex items-center">
                    <Globe className="h-4 w-4 mr-1" />
                    {community.platform}
                  </span>
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {community.category}
                  </span>
                </div>
              </div>
              <Badge className={`${getStatusColor(community.status)} text-sm`}>
                {community.status.toUpperCase()}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            
            {/* Description Section */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <MessageSquare className="h-5 w-5 mr-2 text-indigo-600" />
                Description
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Short Description</h4>
                  <p className="text-gray-600">{community.short_description}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Full Description</h4>
                  <p className="text-gray-600 leading-relaxed">{community.long_description}</p>
                </div>
              </div>
            </div>

            {/* Founder Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <User className="h-5 w-5 mr-2 text-indigo-600" />
                Founder Information
              </h3>
              <div className="bg-blue-50 rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Name</h4>
                  <p className="text-gray-600">{community.founder_name}</p>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Bio</h4>
                  <p className="text-gray-600 leading-relaxed">
                    {community.founder_bio || 'No bio provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Community Link */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <ExternalLink className="h-5 w-5 mr-2 text-indigo-600" />
                Community Link
              </h3>
              <div className="bg-green-50 rounded-lg p-4">
                {community.join_type === 'paid' ? (
                  <div className="text-gray-700">
                    Paid community
                    {typeof community.price_inr === 'number' ? ` (₹${community.price_inr})` : ''}
                    . Join link is stored privately.
                  </div>
                ) : (
                  <>
                    <a 
                      href={community.join_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline break-all"
                    >
                      {community.join_link}
                    </a>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="ml-3"
                      onClick={() => window.open(community.join_link, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Metadata */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
                Submission Details
              </h3>
              <div className="bg-gray-50 rounded-lg p-4 grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Submitted</h4>
                  <p className="text-gray-600">{formatDate(community.created_at)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Community ID</h4>
                  <p className="text-gray-600 font-mono text-sm">{community.id}</p>
                </div>
              </div>
            </div>

          </CardContent>
        </Card>

        {/* Action Buttons */}
        {community.status === 'pending' && (
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => handleApproval(community, 'approve')}
              disabled={processing}
              className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
            >
              <CheckCircle className="h-5 w-5 mr-2" />
              {processing ? 'Processing...' : 'Approve Community'}
            </Button>
            <Button
              size="lg"
              variant="destructive"
              onClick={() => handleApproval(community, 'reject')}
              disabled={processing}
              className="px-8 py-3 text-lg"
            >
              <XCircle className="h-5 w-5 mr-2" />
              {processing ? 'Processing...' : 'Reject Community'}
            </Button>
          </div>
        )}

        {community.status !== 'pending' && (
          <div className="text-center">
            <Badge className={`${getStatusColor(community.status)} text-lg px-4 py-2`}>
              This community has been {community.status}
            </Badge>
          </div>
        )}

      </div>
    </div>
  );
}
