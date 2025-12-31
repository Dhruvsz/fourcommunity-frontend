import { supabase } from './supabase';
import { Community } from '@/types/community';

// Enhanced Supabase service for approved communities with 50MB+ storage capacity
export class EnhancedSupabaseService {
  private static instance: EnhancedSupabaseService;
  private listeners: Set<(communities: Community[]) => void> = new Set();
  private cachedCommunities: Community[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 30000; // 30 seconds cache

  static getInstance(): EnhancedSupabaseService {
    if (!EnhancedSupabaseService.instance) {
      EnhancedSupabaseService.instance = new EnhancedSupabaseService();
    }
    return EnhancedSupabaseService.instance;
  }

  // Add approved community to Supabase with enhanced error handling
  async addApprovedCommunity(submissionData: any): Promise<Community> {
    try {
      console.log('🚀 ENHANCED: Adding community to Supabase:', submissionData.community_name);

      const joinType = submissionData.join_type === 'paid' ? 'paid' : 'free';
      const priceInr = typeof submissionData.price_inr === 'number' ? submissionData.price_inr : null;
      
      // First, update the status in community_subs
      const { error: updateError } = await supabase
        .from('community_subs')
        .update({ status: 'approved' })
        .eq('id', submissionData.id);

      if (updateError) {
        console.error('❌ Error updating submission status:', updateError);
        throw updateError;
      }

      // Create the community object
      const approvedCommunity: Community = {
        id: submissionData.id.toString(),
        name: submissionData.community_name || submissionData.name,
        description: submissionData.short_description || submissionData.description || 'New approved community',
        fullDescription: submissionData.long_description || submissionData.short_description || 'New approved community',
        category: submissionData.category,
        platform: submissionData.platform,
        members: 0,
        verified: true,
        joinLink: joinType === 'paid' ? '' : (submissionData.join_link || submissionData.joinLink),
        joinType,
        priceInr,
        logo: submissionData.logo_url || submissionData.logo || '/placeholder-logo.png',
        location: submissionData.location || "Global",
        tags: [submissionData.category, submissionData.platform],
        admin: submissionData.founder_name || submissionData.founderName,
        adminBio: submissionData.founder_bio || submissionData.founderBio
      };

      // Add to cache immediately for instant UI updates
      this.cachedCommunities = [approvedCommunity, ...this.cachedCommunities.filter(c => c.id !== approvedCommunity.id)];
      
      // Notify all listeners immediately
      this.notifyListeners();

      console.log('✅ ENHANCED: Community approved and cached:', approvedCommunity.name);
      return approvedCommunity;

    } catch (error) {
      console.error('❌ ENHANCED: Error adding approved community:', error);
      throw error;
    }
  }

  // Get all approved communities with smart caching
  async getApprovedCommunities(): Promise<Community[]> {
    try {
      const now = Date.now();
      
      // Return cached data if still fresh
      if (this.cachedCommunities.length > 0 && (now - this.lastFetch) < this.CACHE_DURATION) {
        console.log('📦 ENHANCED: Returning cached communities:', this.cachedCommunities.length);
        return this.cachedCommunities;
      }

      console.log('🔍 ENHANCED: Fetching approved communities from Supabase...');
      
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(1000); // Increased limit for 50MB storage

      if (error) {
        console.error('❌ ENHANCED: Error fetching communities:', error);
        return this.cachedCommunities; // Return cached data on error
      }

      // Map to Community interface
      const communities: Community[] = data.map(item => ({
        id: item.id.toString(),
        name: item.community_name,
        description: item.short_description || 'New approved community',
        fullDescription: item.long_description || item.short_description || 'New approved community',
        category: item.category,
        platform: item.platform,
        members: 0,
        verified: true,
        joinLink: item.join_type === 'paid' ? '' : item.join_link,
        joinType: item.join_type === 'paid' ? 'paid' : 'free',
        priceInr: typeof item.price_inr === 'number' ? item.price_inr : null,
        logo: item.logo_url || '/placeholder-logo.png',
        location: item.location || "Global",
        tags: [item.category, item.platform],
        admin: item.founder_name,
        adminBio: item.founder_bio
      }));

      // Update cache
      this.cachedCommunities = communities;
      this.lastFetch = now;

      console.log('✅ ENHANCED: Fetched and cached', communities.length, 'communities');
      return communities;

    } catch (error) {
      console.error('❌ ENHANCED: Error in getApprovedCommunities:', error);
      return this.cachedCommunities; // Return cached data on error
    }
  }

  // Subscribe to real-time updates
  subscribeToUpdates(callback: (communities: Community[]) => void): () => void {
    this.listeners.add(callback);
    
    // Immediately call with current data
    if (this.cachedCommunities.length > 0) {
      callback([...this.cachedCommunities]);
    }

    // Set up real-time subscription
    const subscription = supabase
      .channel('approved_communities_updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'community_subs', filter: 'status=eq.approved' },
        async (payload) => {
          console.log('🔄 ENHANCED: Real-time update received:', payload);
          
          // Refresh communities on any change
          const updatedCommunities = await this.getApprovedCommunities();
          this.notifyListeners();
        }
      )
      .subscribe();

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      subscription.unsubscribe();
    };
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(callback => {
      try {
        callback([...this.cachedCommunities]);
      } catch (error) {
        console.error('❌ ENHANCED: Error notifying listener:', error);
      }
    });
  }

  // Clear cache (useful for testing)
  clearCache() {
    this.cachedCommunities = [];
    this.lastFetch = 0;
    console.log('🧹 ENHANCED: Cache cleared');
  }

  // Get cached communities count
  getCachedCount(): number {
    return this.cachedCommunities.length;
  }
}

// Export singleton instance
export const enhancedSupabaseService = EnhancedSupabaseService.getInstance();
