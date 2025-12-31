import { supabase } from './supabase';

export interface CommunitySubmission {
  id: number;
  community_name: string;
  platform: string;
  category: string;
  short_description: string;
  long_description: string;
  join_link: string;
  join_type?: 'free' | 'paid' | string;
  price_inr?: number | null;
  owner_id?: string | null;
  founder_name: string;
  founder_bio: string;
  logo_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  show_founder_info: boolean;
}

export interface LiveCommunity {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  category: string;
  platform: string;
  memberCount: string;
  members: number;
  isVerified: boolean;
  verified: boolean;
  joinLink: string;
  joinType?: 'free' | 'paid';
  priceInr?: number | null;
  logo: string | null;
  logoUrl: string | null;
  location: string;
  tags: string[];
  founderName: string;
  founderBio: string;
  createdAt: string;
}

import { logger } from './logger';

// Get all pending submissions for admin panel
export async function getPendingSubmissions(): Promise<CommunitySubmission[]> {
  logger.log('🔍 Fetching pending submissions...');
  
  const { data, error } = await supabase
    .from('community_subs')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('❌ Error fetching submissions:', error);
    throw error;
  }

  logger.log(`✅ Found ${data?.length || 0} pending submissions`);
  return data || [];
}

// Get all approved communities for live display
export async function getApprovedCommunities(): Promise<LiveCommunity[]> {
  console.log('🔍 Fetching approved communities...');
  
  const { data, error } = await supabase
    .from('community_subs')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('❌ Error fetching approved communities:', error);
    throw error;
  }

  console.log(`✅ Found ${data?.length || 0} approved communities`);
  
  // Transform to LiveCommunity format
  return (data || []).map(transformToLiveCommunity);
}

// Transform submission to live community format
export function transformToLiveCommunity(submission: CommunitySubmission): LiveCommunity {
  const joinType = (submission.join_type === 'paid' ? 'paid' : 'free') as 'free' | 'paid';
  const priceInr = typeof submission.price_inr === 'number' ? submission.price_inr : null;

  return {
    id: submission.id.toString(),
    name: submission.community_name,
    description: submission.short_description,
    longDescription: submission.long_description,
    category: submission.category,
    platform: submission.platform,
    memberCount: "New",
    members: 0,
    isVerified: true,
    verified: true,
    joinLink: joinType === 'paid' ? '' : submission.join_link,
    joinType,
    priceInr,
    logo: submission.logo_url,
    logoUrl: submission.logo_url,
    location: "Global",
    tags: [submission.category, submission.platform],
    founderName: submission.founder_name,
    founderBio: submission.founder_bio,
    createdAt: submission.created_at
  };
}

// Approve a community submission
export async function approveCommunity(submissionId: number): Promise<LiveCommunity> {
  console.log(`🔄 Approving community ${submissionId}...`);
  
  const { data, error } = await supabase
    .from('community_subs')
    .update({ status: 'approved' })
    .eq('id', submissionId)
    .select()
    .single();

  if (error) {
    console.error('❌ Error approving community:', error);
    throw error;
  }

  console.log('✅ Community approved successfully');
  
  const approvedCommunity = transformToLiveCommunity(data);
  
  // Dispatch events to update UI
  window.dispatchEvent(new CustomEvent('communityApproved', { 
    detail: { id: submissionId } 
  }));
  
  window.dispatchEvent(new CustomEvent('addApprovedCommunity', { 
    detail: approvedCommunity 
  }));
  
  window.dispatchEvent(new CustomEvent('refreshCommunities', { 
    detail: { timestamp: Date.now() } 
  }));

  return approvedCommunity;
}

// Reject a community submission
export async function rejectCommunity(submissionId: number): Promise<void> {
  console.log(`🔄 Rejecting community ${submissionId}...`);
  
  const { error } = await supabase
    .from('community_subs')
    .update({ status: 'rejected' })
    .eq('id', submissionId);

  if (error) {
    console.error('❌ Error rejecting community:', error);
    throw error;
  }

  console.log('✅ Community rejected successfully');
  
  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('communityRejected', { 
    detail: { id: submissionId } 
  }));
}

// Delete a community submission
export async function deleteCommunitySubmission(submissionId: number): Promise<void> {
  console.log(`🗑️ Deleting community ${submissionId}...`);
  
  const { error } = await supabase
    .from('community_subs')
    .delete()
    .eq('id', submissionId);

  if (error) {
    console.error('❌ Error deleting community:', error);
    throw error;
  }

  console.log('✅ Community deleted successfully');
  
  // Dispatch event to update UI
  window.dispatchEvent(new CustomEvent('communityDeleted', { 
    detail: { id: submissionId } 
  }));
}

// Submit a new community
export async function submitCommunity(communityData: any): Promise<CommunitySubmission> {
  console.log('📝 Submitting new community...');
  
  const submissionData = {
    community_name: communityData.name?.trim() || 'Unnamed Community',
    platform: communityData.platform || 'whatsapp',
    category: communityData.category || 'Other',
    short_description: communityData.shortDescription?.trim() || 'No description provided',
    long_description: communityData.longDescription?.trim() || communityData.shortDescription?.trim() || 'No description provided',
    join_link: communityData.joinLink?.trim() || 'https://example.com',
    founder_name: communityData.founderName?.trim() || 'Anonymous',
    founder_bio: communityData.founderBio?.trim() || '',
    show_founder_info: communityData.showFounder ?? true,
    logo_url: communityData.logoUrl || null,
    status: "pending"
  };

  const { data, error } = await supabase
    .from('community_subs')
    .insert([submissionData])
    .select()
    .single();

  if (error) {
    console.error('❌ Error submitting community:', error);
    throw error;
  }

  console.log('✅ Community submitted successfully');
  
  // Dispatch event to update admin panel
  window.dispatchEvent(new CustomEvent('newSubmission', { 
    detail: data 
  }));

  return data;
}
