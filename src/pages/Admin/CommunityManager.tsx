import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, Filter, Plus, Edit3, Trash2, Eye, CheckCircle, XCircle, Clock, Users, TrendingUp, Calendar, ExternalLink, RefreshCw } from 'lucide-react';

interface Community {
  id: string;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  founder_name: string;
  founder_bio: string;
  join_link: string;
  join_type?: string;
  price_inr?: number | null;
  logo_url?: string;
  review_notes?: string;
  reviewed_at?: string;
}

const CommunityManager: React.FC = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  const loadCommunities = async () => {
    setLoading(true);
    console.log('🔍 COMMUNITY MANAGER: Starting to load communities...');
    
    try {
      console.log('🔍 COMMUNITY MANAGER: Making Supabase query...');
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .neq('status', 'approved') // Exclude approved communities
        .order('created_at', { ascending: false });

      console.log('🔍 COMMUNITY MANAGER: Query result:', { data, error });

      if (error) {
        console.error('❌ COMMUNITY MANAGER: Database error:', error);
        throw error;
      }
      
      console.log('✅ COMMUNITY MANAGER: Successfully loaded', data?.length || 0, 'communities');
      setCommunities(data || []);
    } catch (error) {
      console.error('❌ COMMUNITY MANAGER: Error loading communities:', error);
      // Set empty array on error to stop loading state
      setCommunities([]);
    } finally {
      setLoading(false);
      console.log('🏁 COMMUNITY MANAGER: Loading completed');
    }
  };

  useEffect(() => {
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log('⏰ COMMUNITY MANAGER: Loading timeout - forcing stop');
        setLoading(false);
        setCommunities([]);
      }
    }, 10000); // 10 second timeout

    loadCommunities();

    return () => clearTimeout(timeoutId);
  }, []);

  const filteredCommunities = communities.filter(community => {
    const matchesSearch = 
      community.community_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.founder_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || community.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('community_subs')
        .update({ 
          status: newStatus,
          review_notes: notes,
          reviewed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;
      
      // If approved, remove from submissions list immediately
      if (newStatus === 'approved') {
        setCommunities(prev => prev.filter(community => community.id !== id));
      } else {
        // For rejected, just update the status in the current list
        setCommunities(prev => prev.map(community => 
          community.id === id 
            ? { ...community, status: newStatus, review_notes: notes, reviewed_at: new Date().toISOString() }
            : community
        ));
      }
      
      setShowModal(false);
      setSelectedCommunity(null);
      setReviewNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating community status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this community?')) return;
    
    try {
      const { error } = await supabase
        .from('community_subs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await loadCommunities();
    } catch (error) {
      console.error('Error deleting community:', error);
      alert('Error deleting community');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const stats = {
    total: communities.length,
    pending: communities.filter(c => c.status === 'pending').length,
    approved: communities.filter(c => c.status === 'approved').length,
    rejected: communities.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Community Manager
              </h1>
              <p className="text-gray-400 mt-1">Manage and moderate community submissions</p>
            </div>
            <button
              onClick={loadCommunities}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition-all duration-200 font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Communities</p>
                <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Pending Review</p>
                <p className="text-2xl font-bold text-yellow-400 mt-1">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Approved</p>
                <p className="text-2xl font-bold text-green-400 mt-1">{stats.approved}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Rejected</p>
                <p className="text-2xl font-bold text-red-400 mt-1">{stats.rejected}</p>
              </div>
              <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search communities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="Technology">Technology</option>
              <option value="Gaming">Gaming</option>
              <option value="Education">Education</option>
              <option value="Business">Business</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Entertainment">Entertainment</option>
            </select>
          </div>
        </div>

        {/* Communities Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <span className="text-gray-400 mb-4">Loading communities...</span>
            <button
              onClick={loadCommunities}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              🚨 Force Reload
            </button>
            <p className="text-xs text-gray-500 mt-2">Check browser console for debug info</p>
          </div>
        ) : filteredCommunities.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">No communities found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCommunities.map((community) => (
              <div
                key={community.id}
                className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:bg-gray-800/70 transition-all duration-200"
              >
                {/* Community Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {community.logo_url ? (
                      <img
                        src={community.logo_url}
                        alt={community.community_name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {community.community_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-lg">{community.community_name}</h3>
                      <p className="text-gray-400 text-sm">{community.platform}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full border text-xs font-medium flex items-center gap-1 ${getStatusColor(community.status)}`}>
                    {getStatusIcon(community.status)}
                    {community.status.charAt(0).toUpperCase() + community.status.slice(1)}
                  </div>
                </div>

                {/* Community Info */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-gray-300 text-sm leading-relaxed">{community.short_description}</p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(community.created_at).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-gray-700/50 rounded-md">{community.category}</span>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Founder: <span className="text-gray-300">{community.founder_name}</span></p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedCommunity(community);
                      setShowModal(true);
                    }}
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review
                  </button>
                  
                  {community.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(community.id, 'approved')}
                        className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Approve</span>
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(community.id, 'rejected')}
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                      >
                        <XCircle className="w-4 h-4" />
                        <span className="hidden sm:inline">Reject</span>
                      </button>
                    </>
                  )}
                  
                  <button
                    onClick={() => handleDelete(community.id)}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && selectedCommunity && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Review Community</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4">
                {selectedCommunity.logo_url ? (
                  <img
                    src={selectedCommunity.logo_url}
                    alt={selectedCommunity.community_name}
                    className="w-16 h-16 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {selectedCommunity.community_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedCommunity.community_name}</h3>
                  <p className="text-gray-400">{selectedCommunity.platform} • {selectedCommunity.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-white mb-2">Short Description</h4>
                  <p className="text-gray-300 text-sm">{selectedCommunity.short_description}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-white mb-2">Founder</h4>
                  <p className="text-gray-300 text-sm">{selectedCommunity.founder_name}</p>
                  <p className="text-gray-400 text-xs mt-1">{selectedCommunity.founder_bio}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Long Description</h4>
                <p className="text-gray-300 text-sm leading-relaxed">{selectedCommunity.long_description}</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Join Link</h4>
                {selectedCommunity.join_type === 'paid' ? (
                  <div className="text-gray-300 text-sm">
                    Paid
                    {typeof selectedCommunity.price_inr === 'number' ? ` (₹${selectedCommunity.price_inr})` : ''}
                    . Link stored privately.
                  </div>
                ) : (
                  <a
                    href={selectedCommunity.join_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-2"
                  >
                    {selectedCommunity.join_link}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Review Notes</h4>
                <textarea
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add review notes (optional)..."
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => handleStatusUpdate(selectedCommunity.id, 'approved', reviewNotes)}
                  className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  Approve Community
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedCommunity.id, 'rejected', reviewNotes)}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  Reject Community
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityManager;
