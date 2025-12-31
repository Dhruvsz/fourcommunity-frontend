
import { CommunitySubmission } from "@/types/submission";

// Mock submission data for demonstration
export const submissionsData: CommunitySubmission[] = [
  {
    id: "sub-1",
    name: "Delhi Startup Network",
    description: "A vibrant community of entrepreneurs and startup founders in Delhi NCR sharing insights, opportunities, and supporting each other's journey.",
    category: "Business",
    contact_email: "admin@delhistartupers.com",
    social_links: ["https://linkedin.com/company/delhi-startup"],
    website: "https://delhistartupers.com",
    logo_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=400&fit=crop",
    status: "pending",
    submitted_at: "2024-06-15T10:30:00Z",
  },
  {
    id: "sub-2",
    name: "Mumbai Tech Meetup",
    description: "Weekly tech meetups in Mumbai covering AI, blockchain, web development and emerging technologies. Open to all skill levels.",
    category: "Technology",
    contact_email: "organizer@mumbaitech.dev",
    social_links: ["https://twitter.com/mumbaitech", "https://discord.gg/mumbaitech"],
    website: "https://mumbaitech.dev",
    logo_url: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=400&fit=crop",
    status: "approved",
    submitted_at: "2024-06-14T15:45:00Z",
    reviewed_at: "2024-06-15T09:20:00Z",
    review_notes: "Excellent community with regular activities",
  },
  {
    id: "sub-3",
    name: "Bangalore Design Circle",
    description: "UX/UI designers, product designers and design enthusiasts in Bangalore. We organize workshops, portfolio reviews and design challenges.",
    category: "Design",
    contact_email: "hello@blrdesign.community",
    social_links: ["https://instagram.com/blrdesign"],
    logo_url: "https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?w=400&h=400&fit=crop",
    status: "rejected",
    submitted_at: "2024-06-13T12:00:00Z",
    reviewed_at: "2024-06-14T11:30:00Z",
    review_notes: "Insufficient community activity documentation",
  },
];

// Helper functions
export const getPendingSubmissions = () => 
  submissionsData.filter(sub => sub.status === 'pending');

export const getApprovedSubmissions = () => 
  submissionsData.filter(sub => sub.status === 'approved');

export const getRejectedSubmissions = () => 
  submissionsData.filter(sub => sub.status === 'rejected');

export const getSubmissionById = (id: string) => 
  submissionsData.find(sub => sub.id === id);
