/**
 * SIMPLE APPROVAL SYSTEM - Never breaks
 */
import { supabase } from './supabase';
import { Community } from '@/types/community';

export async function approveAndAdd(submissionId: number): Promise<void> {
  try {
    // 1. Update status in database
    const { data, error } = await supabase
      .from('community_subs')
      .update({ status: 'approved' })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;

    // 2. Create community object
    const community: Community = {
      id: data.id.toString(),
      name: data.community_name,
      description: data.short_description,
      fullDescription: data.long_description,
      category: data.category,
      platform: data.platform,
      members: 0,
      verified: true,
      joinLink: data.join_type === 'paid' ? '' : data.join_link,
      joinType: data.join_type === 'paid' ? 'paid' : 'free',
      priceInr: typeof data.price_inr === 'number' ? data.price_inr : null,
      logo: data.logo_url,
      location: "Global",
      tags: [data.category, data.platform],
      admin: data.founder_name,
      adminBio: data.founder_bio
    };

    // 3. Notify all listeners
    window.dispatchEvent(new CustomEvent('addApprovedCommunity', { 
      detail: community 
    }));

    console.log('✅ SIMPLE: Community approved and added:', community.name);
    
  } catch (error) {
    console.error('❌ SIMPLE: Approval failed:', error);
    throw error;
  }
}
