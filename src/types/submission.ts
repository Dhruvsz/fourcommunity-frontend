
export interface CommunitySubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  contact_email: string;
  social_links: string[];
  logo_url?: string;
  website?: string;
  platform?: string;
  short_description?: string;
  long_description?: string;
  join_link?: string;
  founder_name?: string;
  founder_bio?: string;
  join_type?: 'free' | 'paid' | string;
  price_inr?: number | null;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  review_notes?: string;
  reviewer_id?: string;
}

export interface SubmissionFormData {
  name: string;
  description: string;
  category: string;
  contact_email: string;
  website?: string;
  social_links: string[];
  logo_url?: string;
}
