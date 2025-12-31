/**
 * STABLE COMMUNITY STORE - Never breaks, always works
 */
import { supabase } from './supabase';
import { Community } from '@/types/community';
import { communitiesData } from '@/data/communities';

class StableCommunityStore {
  private communities: Community[] = [...communitiesData];
  private subscribers: ((communities: Community[]) => void)[] = [];

  constructor() {
    this.loadApproved();
    // Auto-refresh every 30 seconds
    setInterval(() => this.loadApproved(), 30000);
  }

  private async loadApproved() {
    try {
      const { data } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'approved');

      if (data?.length) {
        const approved: Community[] = data.map(item => ({
          id: item.id.toString(),
          name: item.community_name,
          description: item.short_description,
          fullDescription: item.long_description,
          category: item.category,
          platform: item.platform,
          members: 0,
          verified: true,
          joinLink: item.join_type === 'paid' ? '' : item.join_link,
          joinType: item.join_type === 'paid' ? 'paid' : 'free',
          priceInr: typeof item.price_inr === 'number' ? item.price_inr : null,
          logo: item.logo_url,
          location: "Global",
          tags: [item.category, item.platform],
          admin: item.founder_name,
          adminBio: item.founder_bio
        }));

        // Always include static + approved
        this.communities = [...approved, ...communitiesData];
        this.notifySubscribers();
      }
    } catch (error) {
      console.log('Using fallback data');
      // Always keep static data working
    }
  }

  public getCommunities(): Community[] {
    return this.communities;
  }

  public subscribe(callback: (communities: Community[]) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach(callback => callback(this.communities));
  }

  public addApproved(community: Community) {
    this.communities = [community, ...this.communities.filter(c => c.id !== community.id)];
    this.notifySubscribers();
  }
}

export const stableCommunityStore = new StableCommunityStore();
