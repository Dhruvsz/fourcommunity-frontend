import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Users, 
  IndianRupee, 
  Calendar,
  ExternalLink,
  Shield,
  Eye,
  EyeOff,
  Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StatusBadge } from '@/components/admin/AdminTable';
import { 
  getMockCommunityById, 
  getMockMembersByCommunity, 
  getMockPaymentsByCommunity,
  updateMockCommunityStatus,
  formatCurrency, 
  formatDate 
} from '@/lib/mockAdminData';
import { useToast } from '@/hooks/use-toast';

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: 'approve' | 'reject' | 'disable' | 'hide' | null;
  }>({ isOpen: false, action: null });
  const [loading, setLoading] = useState(false);

  const community = id ? getMockCommunityById(id) : null;
  const members = id ? getMockMembersByCommunity(id) : [];
  const payments = id ? getMockPaymentsByCommunity(id) : [];

  if (!community) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/communities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Button>
        </div>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Community Not Found</h2>
          <p className="text-gray-600 mt-2">The requested community could not be found.</p>
        </div>
      </div>
    );
  }

  const handleAction = async (action: 'approve' | 'reject' | 'disable' | 'hide') => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (action === 'approve' || action === 'reject') {
      updateMockCommunityStatus(community.id, action === 'approve' ? 'approved' : 'rejected');
    }
    
    setLoading(false);
    setConfirmDialog({ isOpen: false, action: null });
    
    toast({
      title: `Community ${action.charAt(0).toUpperCase() + action.slice(1)}d`,
      description: `${community.name} has been ${action}d successfully.`,
      variant: action === 'approve' ? 'default' : 'destructive'
    });
  };

  const openConfirmDialog = (action: 'approve' | 'reject' | 'disable' | 'hide') => {
    setConfirmDialog({ isOpen: true, action });
  };

  const getActionText = (action: string) => {
    switch (action) {
      case 'approve': return 'approve';
      case 'reject': return 'reject';
      case 'disable': return 'disable payments for';
      case 'hide': return 'hide';
      default: return action;
    }
  };

  const getActionDescription = (action: string) => {
    switch (action) {
      case 'approve': return 'This community will be published and visible to users.';
      case 'reject': return 'This community will be rejected and the creator will be notified.';
      case 'disable': return 'Payment processing will be disabled for this community.';
      case 'hide': return 'This community will be hidden from public view.';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/admin/communities')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Communities
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{community.name}</h1>
            <p className="text-gray-600">Community Control Panel</p>
          </div>
        </div>
        <StatusBadge status={community.status} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => openConfirmDialog('approve')}
          disabled={community.status === 'approved' || loading}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Approve Community
        </Button>
        <Button
          onClick={() => openConfirmDialog('reject')}
          disabled={community.status === 'rejected' || loading}
          variant="destructive"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Reject Community
        </Button>
        <Button
          onClick={() => openConfirmDialog('disable')}
          disabled={loading}
          variant="outline"
        >
          <Ban className="h-4 w-4 mr-2" />
          Disable Payments
        </Button>
        <Button
          onClick={() => openConfirmDialog('hide')}
          disabled={loading}
          variant="outline"
        >
          <EyeOff className="h-4 w-4 mr-2" />
          Hide Community
        </Button>
      </div>

      {/* Community Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Community Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{community.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Category</h4>
                  <Badge variant="outline">{community.category}</Badge>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Platform</h4>
                  <Badge variant="outline">{community.platform}</Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-1">Join Link</h4>
                <a 
                  href={community.joinLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                >
                  {community.joinLink}
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Creator Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Name</h4>
                <p className="text-gray-700">{community.creator}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Email</h4>
                <p className="text-gray-700">{community.creatorEmail}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-gray-600">Members</span>
                </div>
                <span className="font-semibold">{community.memberCount.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-gray-600">Price</span>
                </div>
                <span className="font-semibold">{formatCurrency(community.price)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-purple-600" />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <span className="font-semibold">{formatCurrency(community.revenue)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-600" />
                  <span className="text-sm text-gray-600">Created</span>
                </div>
                <span className="text-sm text-gray-600">{formatDate(community.createdAt)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Eye className="h-4 w-4 mr-2" />
                View Public Page
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Members
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Members & Payments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Members ({members.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {members.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No members yet</p>
            ) : (
              <div className="space-y-3">
                {members.slice(0, 5).map((member) => (
                  <div key={member.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500">{member.email}</div>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={member.status} />
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(member.joinDate)}
                      </div>
                    </div>
                  </div>
                ))}
                {members.length > 5 && (
                  <Button variant="outline" className="w-full mt-3">
                    View All Members
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments ({payments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No payments yet</p>
            ) : (
              <div className="space-y-3">
                {payments.slice(0, 5).map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{payment.userEmail}</div>
                      <div className="text-sm text-gray-500">{payment.razorpayOrderId}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">{formatCurrency(payment.amount)}</div>
                      <StatusBadge status={payment.status} />
                    </div>
                  </div>
                ))}
                {payments.length > 5 && (
                  <Button variant="outline" className="w-full mt-3">
                    View All Payments
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog.isOpen} onOpenChange={(open) => 
        !open && setConfirmDialog({ isOpen: false, action: null })
      }>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmDialog.action && `${confirmDialog.action.charAt(0).toUpperCase() + confirmDialog.action.slice(1)} Community`}
            </DialogTitle>
            <DialogDescription>
              {confirmDialog.action && (
                <>
                  Are you sure you want to {getActionText(confirmDialog.action)} "{community.name}"?
                  <span className="block mt-2 text-gray-600">
                    {getActionDescription(confirmDialog.action)}
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog({ isOpen: false, action: null })}
            >
              Cancel
            </Button>
            <Button
              variant={confirmDialog.action === 'approve' ? 'default' : 'destructive'}
              onClick={() => confirmDialog.action && handleAction(confirmDialog.action)}
              disabled={loading}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              ) : confirmDialog.action === 'approve' ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 mr-2" />
              )}
              {confirmDialog.action && confirmDialog.action.charAt(0).toUpperCase() + confirmDialog.action.slice(1)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommunityDetail;