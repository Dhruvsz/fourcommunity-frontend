// Bulletproof approval system that works regardless of database issues
import { Community } from '@/types/community';

export class BulletproofApproval {
  private static instance: BulletproofApproval;
  private approvedCommunities: Community[] = [];
  private listeners: Set<(communities: Community[]) => void> = new Set();

  static getInstance(): BulletproofApproval {
    if (!BulletproofApproval.instance) {
      BulletproofApproval.instance = new BulletproofApproval();
    }
    return BulletproofApproval.instance;
  }

  // Load approved communities from all sources
  loadApprovedCommunities(): Community[] {
    try {
      // 1. Load from localStorage
      const localApproved = JSON.parse(localStorage.getItem('bulletproofApproved') || '[]');
      
      // 2. Load from sessionStorage (for current session)
      const sessionApproved = JSON.parse(sessionStorage.getItem('bulletproofApproved') || '[]');
      
      // 3. Combine and deduplicate
      const allApproved = [...localApproved, ...sessionApproved];
      const uniqueApproved = allApproved.filter((community, index, self) => 
        index === self.findIndex(c => c.id === community.id)
      );
      
      this.approvedCommunities = uniqueApproved;
      console.log('📦 Loaded approved communities from storage:', uniqueApproved.length);
      
      return uniqueApproved;
    } catch (error) {
      console.error('❌ Error loading approved communities:', error);
      return [];
    }
  }

  // Add approved community with multiple storage methods
  addApprovedCommunity(submissionData: any): Community {
    const joinType = submissionData.join_type === 'paid' ? 'paid' : 'free';
    const priceInr = typeof submissionData.price_inr === 'number' ? submissionData.price_inr : null;

    const approvedCommunity: Community = {
      id: submissionData.id.toString(),
      name: submissionData.community_name || submissionData.name,
      description: submissionData.short_description || submissionData.description || 'New approved community',
      fullDescription: submissionData.long_description || submissionData.fullDescription || submissionData.short_description || 'New approved community',
      category: submissionData.category,
      platform: submissionData.platform,
      members: 0,
      verified: true,
      joinLink: joinType === 'paid' ? '' : (submissionData.join_link || submissionData.joinLink),
      joinType,
      priceInr,
      logo: submissionData.logo_url || submissionData.logo || '/placeholder-logo.png',
      location: "Global",
      tags: [submissionData.category, submissionData.platform],
      admin: submissionData.founder_name || submissionData.admin,
      adminBio: submissionData.founder_bio || submissionData.adminBio
    };

    // Remove duplicates and add to beginning
    this.approvedCommunities = this.approvedCommunities.filter(c => c.id !== approvedCommunity.id);
    this.approvedCommunities.unshift(approvedCommunity);

    // Store in multiple places for maximum reliability
    this.saveToStorage();

    // Notify all listeners
    this.notifyListeners();

    console.log('✅ BULLETPROOF: Added approved community:', approvedCommunity.name);
    return approvedCommunity;
  }

  // Save to multiple storage locations
  private saveToStorage() {
    try {
      const dataToStore = JSON.stringify(this.approvedCommunities.slice(0, 100)); // Limit to 100
      
      // Save to localStorage
      try {
        localStorage.setItem('bulletproofApproved', dataToStore);
        console.log('✅ Saved to localStorage');
      } catch (error) {
        console.log('⚠️ localStorage full, clearing old data');
        localStorage.removeItem('bulletproofApproved');
        localStorage.setItem('bulletproofApproved', JSON.stringify(this.approvedCommunities.slice(0, 20)));
      }
      
      // Save to sessionStorage
      try {
        sessionStorage.setItem('bulletproofApproved', dataToStore);
        console.log('✅ Saved to sessionStorage');
      } catch (error) {
        console.log('⚠️ sessionStorage full');
      }
      
    } catch (error) {
      console.error('❌ Error saving to storage:', error);
    }
  }

  // Subscribe to changes
  subscribe(listener: (communities: Community[]) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener([...this.approvedCommunities]);
      } catch (error) {
        console.error('❌ Error notifying listener:', error);
      }
    });
  }

  // Get all approved communities
  getApprovedCommunities(): Community[] {
    return [...this.approvedCommunities];
  }

  // Clear all approved communities
  clear() {
    this.approvedCommunities = [];
    localStorage.removeItem('bulletproofApproved');
    sessionStorage.removeItem('bulletproofApproved');
    this.notifyListeners();
    console.log('🧹 Cleared all approved communities');
  }
}

// Export singleton instance
export const bulletproofApproval = BulletproofApproval.getInstance();

// Helper function for easy approval
export const approveCommunitySafely = (submissionData: any): Community => {
  const approvedCommunity = bulletproofApproval.addApprovedCommunity(submissionData);
  
  // Dispatch events for immediate UI updates
  window.dispatchEvent(new CustomEvent('bulletproofApproval', { 
    detail: approvedCommunity
  }));
  
  window.dispatchEvent(new CustomEvent('addApprovedCommunityNow', { 
    detail: approvedCommunity
  }));
  
  return approvedCommunity;
};