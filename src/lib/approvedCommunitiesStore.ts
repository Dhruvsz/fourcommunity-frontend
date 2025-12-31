// In-memory storage for approved communities to avoid localStorage quota issues
import { Community } from '@/types/community';

class ApprovedCommunitiesStore {
  private approvedCommunities: Community[] = [];
  private listeners: Set<() => void> = new Set();

  // Add a new approved community
  addCommunity(community: Community) {
    // Remove duplicate if exists
    this.approvedCommunities = this.approvedCommunities.filter(c => c.id !== community.id);
    // Add to beginning of array
    this.approvedCommunities.unshift(community);
    // Limit to 100 communities to prevent memory issues
    this.approvedCommunities = this.approvedCommunities.slice(0, 100);
    
    console.log('✅ Added approved community to in-memory store:', community.name);
    console.log('📊 Total approved communities in memory:', this.approvedCommunities.length);
    
    // Notify all listeners
    this.notifyListeners();
  }

  // Get all approved communities
  getCommunities(): Community[] {
    return [...this.approvedCommunities];
  }

  // Subscribe to changes
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners of changes
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Clear all approved communities
  clear() {
    this.approvedCommunities = [];
    this.notifyListeners();
    console.log('🧹 Cleared all approved communities from memory');
  }

  // Get community by ID
  getCommunityById(id: string): Community | undefined {
    return this.approvedCommunities.find(c => c.id === id);
  }
}

// Export singleton instance
export const approvedCommunitiesStore = new ApprovedCommunitiesStore();
