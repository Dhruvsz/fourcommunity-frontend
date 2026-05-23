import React, { useState, useEffect } from 'react';
import { Search, Filter, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

interface Community {
  id: string;
  community_name: string;
  category: string;
  founder_name: string;
  platform: string;
  status: string;
  price_inr: number | null;
  join_type: string;
  created_at: string;
  short_description: string;
  join_link: string;
  logo_url: string | null;
}

const Communities = () => {
  const { toast } = useToast();
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | null;
    community: Community | null;
  }>({ isOpen: false, action: null, community: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNotes, setRejectNotes] = useState('');

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommunities(data || []);
    } catch (err) {
      console.error('Error fetching communities:', err);
      toast({
        title: 'Error loading communities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (community: Community, action: 'approve' | 'reject'): Promise<void> => {
    setActionLoading(true);
    try {
      const endpoint = action === 'approve'
        ? `${import.meta.env.VITE_API_URL}/admin/approve/${community.id}`
        : `${import.meta.env.VITE_API_URL}/admin/reject/${community.id}`;

      console.log('🚀 Calling backend:', endpoint);
      console.log('🔑 Admin key exists:', !!import.meta.env.VITE_ADMIN_PASSWORD);
      console.log('🌐 API URL:', import.meta.env.VITE_API_URL);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-key': import.meta.env.VITE_ADMIN_PASSWORD || ''
        },
        body: action === 'reject'
          ? JSON.stringify({ review_notes: rejectNotes })
          : JSON.stringify({})
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Backend error response:', errorText);
        let errorMessage: string;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.error || errorJson.message || `HTTP ${response.status}`;
        } catch {
          errorMessage = errorText || `HTTP ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (data.success) {
        toast({
          title: action === 'approve' ? '✅ Community Approved!' : '❌ Community Rejected',
          description: `${community.community_name} has been ${action}d.`
        });
        fetchCommunities();
        setConfirmDialog({ isOpen: false, action: null, community: null });
        setRejectNotes('');
      } else {
        throw new Error(data.error || 'Action failed');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      console.error('Action error:', err);
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCommunities = communities.filter(c => {
    const matchesSearch =
      c.community_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.founder_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default: return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Community Management</h1>
          <p className="text-gray-400 mt-1">
            {communities.filter(c => c.status === 'pending').length} pending &middot;{' '}
            {communities.filter(c => c.status === 'approved').length} approved &middot;{' '}
            {communities.length} total
          </p>
        </div>
        <Button onClick={fetchCommunities} variant="outline">🔄 Refresh</Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left p-4 text-gray-400 text-sm">Community</th>
              <th className="text-left p-4 text-gray-400 text-sm">Founder</th>
              <th className="text-left p-4 text-gray-400 text-sm">Platform</th>
              <th className="text-left p-4 text-gray-400 text-sm">Price</th>
              <th className="text-left p-4 text-gray-400 text-sm">Status</th>
              <th className="text-left p-4 text-gray-400 text-sm">Submitted</th>
              <th className="text-right p-4 text-gray-400 text-sm">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCommunities.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12 text-gray-400">
                  No communities found
                </td>
              </tr>
            ) : (
              filteredCommunities.map(community => (
                <tr key={community.id} className="border-b border-gray-800 hover:bg-gray-800/50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      {community.logo_url && (
                        <img
                          src={community.logo_url}
                          className="w-8 h-8 rounded object-cover"
                          alt=""
                        />
                      )}
                      <div>
                        <div className="font-medium text-white">{community.community_name}</div>
                        <div className="text-xs text-gray-400">{community.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{community.founder_name}</td>
                  <td className="p-4 text-gray-300 capitalize">{community.platform}</td>
                  <td className="p-4 text-gray-300">
                    {community.join_type === 'free' ? 'Free' : `₹${community.price_inr}`}
                  </td>
                  <td className="p-4">{getStatusBadge(community.status)}</td>
                  <td className="p-4 text-gray-400 text-sm">
                    {new Date(community.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2 justify-end">
                      {community.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setConfirmDialog({ isOpen: true, action: 'approve', community })}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setConfirmDialog({ isOpen: true, action: 'reject', community })}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {community.status !== 'pending' && (
                        <span className="text-gray-500 text-sm">{community.status}</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Confirm Dialog */}
      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(open) => !open && setConfirmDialog({ isOpen: false, action: null, community: null })}
      >
        <DialogContent className="bg-gray-900 border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-white">
              {confirmDialog.action === 'approve' ? '✅ Approve Community' : '❌ Reject Community'}
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              {confirmDialog.action === 'approve'
                ? `Are you sure you want to approve "${confirmDialog.community?.community_name}"? It will go live on fourcommunity.com immediately.`
                : `Are you sure you want to reject "${confirmDialog.community?.community_name}"?`}
            </DialogDescription>
          </DialogHeader>

          {confirmDialog.action === 'reject' && (
            <div className="mt-2">
              <label className="text-sm text-gray-400">Reason for rejection (optional)</label>
              <textarea
                className="w-full mt-2 p-3 bg-gray-800 border border-gray-700 rounded text-white text-sm resize-none"
                rows={3}
                placeholder="Tell the founder why it was rejected..."
                value={rejectNotes}
                onChange={(e) => setRejectNotes(e.target.value)}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, action: null, community: null })}
              className="border-gray-700 text-gray-300"
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              disabled={actionLoading}
              onClick={() =>
                confirmDialog.community &&
                confirmDialog.action &&
                handleAction(confirmDialog.community, confirmDialog.action)
              }
            >
              {actionLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
              ) : null}
              {confirmDialog.action === 'approve' ? 'Yes, Approve' : 'Yes, Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communities;
