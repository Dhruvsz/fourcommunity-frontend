import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, XCircle, Filter, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable';
import { mockCommunities, formatCurrency, formatDate, updateMockCommunityStatus, type MockCommunity } from '@/lib/mockAdminData';
import { useToast } from '@/hooks/use-toast';

const Communities = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | null;
    community: MockCommunity | null;
  }>({ isOpen: false, action: null, community: null });
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Filter communities based on search and status
  const filteredCommunities = mockCommunities.filter(community => {
    const matchesSearch = community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         community.creator.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || community.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleAction = async (community: MockCommunity, action: 'approve' | 'reject') => {
    setLoadingStates(prev => ({ ...prev, [community.id]: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateMockCommunityStatus(community.id, action === 'approve' ? 'approved' : 'rejected');
    
    setLoadingStates(prev => ({ ...prev, [community.id]: false }));
    setConfirmDialog({ isOpen: false, action: null, community: null });
    
    toast({
      title: `Community ${action === 'approve' ? 'Approved' : 'Rejected'}`,
      description: `${community.name} has been ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      variant: action === 'approve' ? 'default' : 'destructive'
    });
  };

  const openConfirmDialog = (community: MockCommunity, action: 'approve' | 'reject') => {
    setConfirmDialog({ isOpen: true, action, community });
  };

  const columns = [
    {
      key: 'name',
      label: 'Community Name',
      width: '25%',
      render: (value: string, row: MockCommunity) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.category}</div>
        </div>
      )
    },
    {
      key: 'creator',
      label: 'Creator',
      width: '20%',
      render: (value: string, row: MockCommunity) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.creatorEmail}</div>
        </div>
      )
    },
    {
      key: 'price',
      label: 'Price',
      width: '12%',
      render: (value: number) => (
        <span className="font-medium text-gray-900">{formatCurrency(value)}</span>
      )
    },
    {
      key: 'status',
      label: 'Status',
      width: '12%',
      render: (value: string) => <StatusBadge status={value} />
    },
    {
      key: 'memberCount',
      label: 'Members',
      width: '10%',
      render: (value: number) => (
        <span className="text-gray-900">{value.toLocaleString()}</span>
      )
    },
    {
      key: 'createdAt',
      label: 'Created',
      width: '15%',
      render: (value: string) => (
        <span className="text-sm text-gray-500">{formatDate(value)}</span>
      )
    }
  ];

  const actions = [
    {
      label: 'View',
      onClick: (community: MockCommunity) => navigate(`/admin/communities/${community.id}`),
      variant: 'outline' as const
    },
    {
      label: 'Approve',
      onClick: (community: MockCommunity) => openConfirmDialog(community, 'approve'),
      variant: 'default' as const,
      disabled: (community: MockCommunity) => community.status === 'approved',
      loading: (community: MockCommunity) => loadingStates[community.id] || false
    },
    {
      label: 'Reject',
      onClick: (community: MockCommunity) => openConfirmDialog(community, 'reject'),
      variant: 'destructive' as const,
      disabled: (community: MockCommunity) => community.status === 'rejected',
      loading: (community: MockCommunity) => loadingStates[community.id] || false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Community Management</h1>
          <p className="text-gray-600 mt-1">Review and manage community submissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredCommunities.length} of {mockCommunities.length} communities
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search communities or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Communities Table */}
      <AdminTable
        data={filteredCommunities}
        columns={columns}
        actions={actions}
        emptyMessage="No communities found matching your criteria"
      />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        !open && setConfirmDialog({ isOpen: false, action: null, community: null })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'approve' ? 'Approve Community' : 'Reject Community'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} "{confirmDialog.community?.name}"?
              {confirmDialog.action === 'approve' && (
                <span className="block mt-2 text-green-600">
                  This community will be published and visible to users.
                </span>
              )}
              {confirmDialog.action === 'reject' && (
                <span className="block mt-2 text-red-600">
                  This community will be rejected and the creator will be notified.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, action: null, community: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() => confirmDialog.community && confirmDialog.action && 
                handleAction(confirmDialog.community, confirmDialog.action)
              }
              disabled={confirmDialog.community ? loadingStates[confirmDialog.community.id] : false}
            >
              {confirmDialog.community && loadingStates[confirmDialog.community.id] ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : confirmDialog.action === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {confirmDialog.action === 'approve' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Communities;