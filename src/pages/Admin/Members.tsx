import React, { useState } from 'react';
import { Search, Filter, UserCheck, UserX, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable';
import { 
  mockMembers, 
  mockCommunities, 
  formatCurrency, 
  formatDate, 
  updateMockMemberStatus,
  type MockMember 
} from '@/lib/mockAdminData';
import { useToast } from '@/hooks/use-toast';

const Members = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [communityFilter, setCommunityFilter] = useState('all');
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'revoke' | 'grant' | null;
    member: MockMember | null;
  }>({ isOpen: false, action: null, member: null });
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  // Filter members based on search, status, and community
  const filteredMembers = mockMembers.filter(member => {
    const matchesSearch = member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    const matchesCommunity = communityFilter === 'all' || member.communityId === communityFilter;
    return matchesSearch && matchesStatus && matchesCommunity;
  });

  const handleAction = async (member: MockMember, action: 'revoke' | 'grant') => {
    setLoadingStates(prev => ({ ...prev, [member.id]: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    updateMockMemberStatus(member.id, action === 'grant' ? 'active' : 'revoked');
    
    setLoadingStates(prev => ({ ...prev, [member.id]: false }));
    setConfirmDialog({ isOpen: false, action: null, member: null });
    
    toast({
      title: `Access ${action === 'grant' ? 'Granted' : 'Revoked'}`,
      description: `${member.name}'s access has been ${action === 'grant' ? 'granted' : 'revoked'}.`,
      variant: action === 'grant' ? 'default' : 'destructive'
    });
  };

  const openConfirmDialog = (member: MockMember, action: 'revoke' | 'grant') => {
    setConfirmDialog({ isOpen: true, action, member });
  };

  const getCommunityName = (communityId: string) => {
    const community = mockCommunities.find(c => c.id === communityId);
    return community?.name || 'Unknown Community';
  };

  const columns = [
    {
      key: 'name',
      label: 'Member',
      width: '25%',
      render: (value: string, row: MockMember) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'communityId',
      label: 'Community',
      width: '25%',
      render: (value: string) => (
        <span className="text-gray-900">{getCommunityName(value)}</span>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      width: '15%',
      render: (value: string) => (
        <span className="text-sm text-gray-500">{formatDate(value)}</span>
      )
    },
    {
      key: 'paymentAmount',
      label: 'Payment',
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
    }
  ];

  const actions = [
    {
      label: 'Grant Access',
      onClick: (member: MockMember) => openConfirmDialog(member, 'grant'),
      variant: 'default' as const,
      disabled: (member: MockMember) => member.status === 'active',
      loading: (member: MockMember) => loadingStates[member.id] || false
    },
    {
      label: 'Revoke Access',
      onClick: (member: MockMember) => openConfirmDialog(member, 'revoke'),
      variant: 'destructive' as const,
      disabled: (member: MockMember) => member.status === 'revoked',
      loading: (member: MockMember) => loadingStates[member.id] || false
    }
  ];

  // Calculate stats
  const stats = {
    total: filteredMembers.length,
    active: filteredMembers.filter(m => m.status === 'active').length,
    revoked: filteredMembers.filter(m => m.status === 'revoked').length,
    totalRevenue: filteredMembers
      .filter(m => m.status === 'active')
      .reduce((sum, m) => sum + m.paymentAmount, 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Member Management</h1>
          <p className="text-gray-600 mt-1">Manage community member access and permissions</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {filteredMembers.length} members
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Members</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Revoked Access</p>
              <p className="text-2xl font-bold text-red-600">{stats.revoked}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <UserX className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Revenue</p>
              <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search members by name or email..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="sm:w-48">
            <Select value={communityFilter} onValueChange={setCommunityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by community" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Communities</SelectItem>
                {mockCommunities.map(community => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Members Table */}
      <AdminTable
        data={filteredMembers}
        columns={columns}
        actions={actions}
        emptyMessage="No members found matching your criteria"
      />

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        !open && setConfirmDialog({ isOpen: false, action: null, member: null })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to {confirmDialog.action} access for "{confirmDialog.member?.name}"?
              {confirmDialog.action === 'grant' && (
                <span className="block mt-2 text-green-600">
                  This member will regain access to their community.
                </span>
              )}
              {confirmDialog.action === 'revoke' && (
                <span className="block mt-2 text-red-600">
                  This member will lose access to their community immediately.
                </span>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, action: null, member: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'grant' ? 'default' : 'destructive'}
              onClick={() => confirmDialog.member && confirmDialog.action && 
                handleAction(confirmDialog.member, confirmDialog.action)
              }
              disabled={confirmDialog.member ? loadingStates[confirmDialog.member.id] : false}
            >
              {confirmDialog.member && loadingStates[confirmDialog.member.id] ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : confirmDialog.action === 'grant' ? (
                <UserCheck className="h-4 w-4 mr-2" />
              ) : (
                <UserX className="h-4 w-4 mr-2" />
              )}
              {confirmDialog.action === 'grant' ? 'Grant Access' : 'Revoke Access'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Members;