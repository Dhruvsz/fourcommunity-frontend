export interface Community {
  id: string;
  name: string;
  logo: string;
  verified: boolean;
  isFull?: boolean;
  platform: 'WhatsApp' | 'Telegram' | 'Slack' | 'Discord';
  category: string;
  description: string;
  fullDescription?: string;
  longDescription?: string;
  tags?: string[];
  members: number;
  memberCount?: string;
  capacity?: number | null; // null for unlimited
  location: string;
  joinLink?: string;
  joinType?: 'free' | 'paid';
  priceInr?: number | null;
  logoUrl?: string | null;
  website?: string;
  foundedDate?: string;
  admin?: string;
  adminTitle?: string;
  adminBio?: string;
  adminAvatar?: string;
  founderName?: string;
  founderBio?: string;
  linkedIn?: string;
  twitter?: string | null;
}
