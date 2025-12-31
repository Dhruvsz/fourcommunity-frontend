import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  Users, 
  Edit3, 
  Trash2, 
  Eye, 
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { Community } from "@/types/community";
import { communitiesData } from "@/data/communities";
import { getApprovedCommunities } from "@/lib/communityFlow";

const LiveCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [communityToDelete, setCommunityToDelete] = useState<Community | null>(null);
  const { toast } = useToast();

  // Form state for editing
  const [editForm, setEditForm] = useState({
    members: 0,
    location: "",
    verified: true
  });

  useEffect(() => {
    fetchLiveCommunities();
  }, []);

  const fetchLiveCommunities = async () => {
    try {
      setLoading(true);
      
      // Use centralized flow function
      const approvedCommunities = await getApprovedCommunities();
      
      // Map LiveCommunity to Community type for compatibility
      const mappedCommunities: Community[] = approvedCommunities.map(item => ({
        id: item.id,
        name: item.name,
        description: item.description,
        longDescription: item.longDescription,
        category: item.category,
        platform: item.platform as "WhatsApp" | "Telegram" | "Slack" | "Discord",
        members: item.members,
        isVerified: item.isVerified,
        verified: item.verified,
        joinLink: item.joinLink,
        joinType: (item as any).joinType,
        priceInr: (item as any).priceInr,
        logo: item.logo,
        logoUrl: item.logoUrl,
        location: item.location,
        tags: item.tags,
        founderName: item.founderName,
        founderBio: item.founderBio
      }));
      
      // Combine with static communities
      const allCommunities = [...mappedCommunities, ...communitiesData];
      setCommunities(allCommunities);
      
    } catch (error) {
      console.error('Error fetching live communities:', error);
      setCommunities(communitiesData); // Fallback to static
    } finally {
      setLoading(false);
    }
  };

  const handleEditCommunity = (community: Community) => {
    setEditingCommunity(community);
    setEditForm({
      members: community.members || 0,
      location: community.location || "Global",
      verified: community.verified || false
    });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingCommunity) return;

    try {
      // Update in local state
      setCommunities(prev => prev.map(community => 
        community.id === editingCommunity.id 
          ? {
              ...community,
              members: editForm.members,
              location: editForm.location,
              verified: editForm.verified
            }
          : community
      ));

      // If it's an approved community (from database), update there too
      if (editingCommunity.id && !isNaN(Number(editingCommunity.id))) {
        await supabase
          .from('community_subs')
          .update({
            // Add member count tracking if needed
          })
          .eq('id', editingCommunity.id);
      }

      toast({
        title: "Community Updated",
        description: `${editingCommunity.name} has been updated successfully.`,
      });

      setIsEditModalOpen(false);
      setEditingCommunity(null);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update community. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCommunity = (community: Community) => {
    setCommunityToDelete(community);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!communityToDelete) return;

    try {
      // Remove from local state
      setCommunities(prev => prev.filter(c => c.id !== communityToDelete.id));

      // If it's an approved community, update status in database
      if (communityToDelete.id && !isNaN(Number(communityToDelete.id))) {
        await supabase
          .from('community_subs')
          .update({ status: 'removed' })
          .eq('id', communityToDelete.id);
      }

      toast({
        title: "Community Removed",
        description: `${communityToDelete.name} has been removed from the platform.`,
      });

      setIsDeleteModalOpen(false);
      setCommunityToDelete(null);
    } catch (error) {
      toast({
        title: "Removal Failed",
        description: "Failed to remove community. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCapacityInfo = (community: Community) => {
    if (community.platform.toLowerCase() === 'whatsapp') {
      const maxCapacity = 1024;
      const percentage = (community.members / maxCapacity) * 100;
      
      if (percentage >= 100) return { status: 'full', color: 'bg-red-500', text: 'Full' };
      if (percentage > 90) return { status: 'near-full', color: 'bg-amber-500', text: 'Near Full' };
      if (percentage > 50) return { status: 'half', color: 'bg-blue-500', text: 'Active' };
      return { status: 'available', color: 'bg-green-500', text: 'Available' };
    }
    
    return { status: 'unlimited', color: 'bg-purple-500', text: 'Unlimited' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <header className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-semibold text-white">Live Communities</h1>
          <p className="text-gray-400 mt-1">Manage all live communities on your platform</p>
        </motion.div>
      </header>

      {/* Communities Table */}
      <Card className="bg-gray-900/80 border-gray-800">
        <CardHeader>
          <CardTitle className="text-lg font-medium text-gray-200">
            All Live Communities ({communities.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-800">
                  <TableHead className="text-gray-300">Community</TableHead>
                  <TableHead className="text-gray-300">Platform</TableHead>
                  <TableHead className="text-gray-300">Category</TableHead>
                  <TableHead className="text-gray-300">Members</TableHead>
                  <TableHead className="text-gray-300">Capacity</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communities.map((community) => {
                  const capacity = getCapacityInfo(community);
                  
                  return (
                    <TableRow key={community.id} className="border-gray-800 hover:bg-gray-800/50">
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-3">
                          <img 
                            src={community.logo} 
                            alt="" 
                            className="w-10 h-10 rounded-lg object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-logo.png';
                            }}
                          />
                          <div>
                            <div className="font-medium">{community.name}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">
                              {community.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="outline" className="border-gray-700 text-gray-300">
                          {community.platform}
                        </Badge>
                      </TableCell>
                      
                      <TableCell className="text-gray-300">{community.category}</TableCell>
                      
                      <TableCell className="text-gray-300">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {community.members?.toLocaleString() || 0}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${capacity.color}`}></div>
                          <span className="text-sm text-gray-300">{capacity.text}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {community.verified && <CheckCircle className="h-4 w-4 text-green-400" />}
                          <span className="text-sm text-gray-300">
                            {community.verified ? 'Verified' : 'Unverified'}
                          </span>
                        </div>
                      </TableCell>
                      
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              if (community.joinType === 'paid') return;
                              window.open(community.joinLink, '_blank');
                            }}
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditCommunity(community)}
                            className="border-gray-700 text-gray-300 hover:bg-gray-700"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCommunity(community)}
                            className="border-red-700 text-red-400 hover:bg-red-700/20"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Community</DialogTitle>
            <DialogDescription className="text-gray-400">
              Update community details and member count
            </DialogDescription>
          </DialogHeader>
          
          {editingCommunity && (
            <div className="space-y-4">
              <div>
                <Label className="text-gray-300">Community Name</Label>
                <Input 
                  value={editingCommunity.name} 
                  disabled 
                  className="bg-gray-800 border-gray-700 text-gray-400"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Current Members</Label>
                <Input
                  type="number"
                  value={editForm.members}
                  onChange={(e) => setEditForm(prev => ({ ...prev, members: parseInt(e.target.value) || 0 }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Enter current member count"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Location</Label>
                <Input
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="e.g., Global, India, USA"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="verified"
                  checked={editForm.verified}
                  onChange={(e) => setEditForm(prev => ({ ...prev, verified: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="verified" className="text-gray-300">Verified Community</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  className="border-gray-700 text-gray-300"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit} className="bg-blue-600 hover:bg-blue-700">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="bg-gray-900 border-gray-800 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              Remove Community
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to remove this community from the platform?
            </DialogDescription>
          </DialogHeader>
          
          {communityToDelete && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-800 rounded-lg">
                <div className="font-medium text-white">{communityToDelete.name}</div>
                <div className="text-sm text-gray-400">{communityToDelete.platform} • {communityToDelete.category}</div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmDelete}
                  className="bg-red-600 hover:bg-red-700"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Community
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveCommunities;