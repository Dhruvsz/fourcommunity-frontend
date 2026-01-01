// Mock data for admin panel - will be replaced with real API calls later

export interface MockCommunity {
  id: string;
  name: string;
  creator: string;
  creatorEmail: string;
  price: number;
  status: 'draft' | 'approved' | 'rejected' | 'pending';
  createdAt: string;
  memberCount: number;
  description: string;
  category: string;
  platform: string;
  joinLink: string;
  revenue: number;
}

export interface MockPayment {
  id: string;
  userId: string;
  userEmail: string;
  communityId: string;
  communityName: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
  razorpayOrderId: string;
}

export interface MockMember {
  id: string;
  email: string;
  name: string;
  communityId: string;
  joinDate: string;
  status: 'active' | 'revoked';
  paymentAmount: number;
}

export interface MockStats {
  totalCommunities: number;
  approvedCommunities: number;
  pendingCommunities: number;
  totalMembers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  newCommunitiesThisMonth: number;
  newMembersThisMonth: number;
}

// Mock Communities Data
export const mockCommunities: MockCommunity[] = [
  {
    id: 'comm-1',
    name: 'AI Entrepreneurs Hub',
    creator: 'Rahul Sharma',
    creatorEmail: 'rahul@example.com',
    price: 2999,
    status: 'approved',
    createdAt: '2024-01-15T10:30:00Z',
    memberCount: 156,
    description: 'A premium community for AI entrepreneurs and founders',
    category: 'Technology',
    platform: 'Discord',
    joinLink: 'https://discord.gg/ai-entrepreneurs',
    revenue: 467844
  },
  {
    id: 'comm-2',
    name: 'Startup Founders Circle',
    creator: 'Priya Patel',
    creatorEmail: 'priya@example.com',
    price: 1999,
    status: 'pending',
    createdAt: '2024-01-20T14:15:00Z',
    memberCount: 0,
    description: 'Exclusive network for early-stage startup founders',
    category: 'Business',
    platform: 'Slack',
    joinLink: 'https://startup-founders.slack.com',
    revenue: 0
  },
  {
    id: 'comm-3',
    name: 'Crypto Trading Masterclass',
    creator: 'Amit Kumar',
    creatorEmail: 'amit@example.com',
    price: 4999,
    status: 'approved',
    createdAt: '2024-01-10T09:00:00Z',
    memberCount: 89,
    description: 'Advanced cryptocurrency trading strategies and analysis',
    category: 'Finance',
    platform: 'Telegram',
    joinLink: 'https://t.me/crypto-masterclass',
    revenue: 444911
  },
  {
    id: 'comm-4',
    name: 'Design System Experts',
    creator: 'Sneha Gupta',
    creatorEmail: 'sneha@example.com',
    price: 1499,
    status: 'rejected',
    createdAt: '2024-01-25T16:45:00Z',
    memberCount: 0,
    description: 'Community for design system architects and UX designers',
    category: 'Design',
    platform: 'Discord',
    joinLink: 'https://discord.gg/design-systems',
    revenue: 0
  },
  {
    id: 'comm-5',
    name: 'SaaS Growth Hackers',
    creator: 'Vikram Singh',
    creatorEmail: 'vikram@example.com',
    price: 3499,
    status: 'approved',
    createdAt: '2024-01-05T11:20:00Z',
    memberCount: 234,
    description: 'Growth strategies and tactics for SaaS companies',
    category: 'Marketing',
    platform: 'Circle',
    joinLink: 'https://saas-growth.circle.so',
    revenue: 818766
  },
  {
    id: 'comm-6',
    name: 'Remote Work Leaders',
    creator: 'Anita Desai',
    creatorEmail: 'anita@example.com',
    price: 999,
    status: 'pending',
    createdAt: '2024-01-28T13:30:00Z',
    memberCount: 0,
    description: 'Leadership strategies for remote and hybrid teams',
    category: 'Management',
    platform: 'Slack',
    joinLink: 'https://remote-leaders.slack.com',
    revenue: 0
  }
];

// Mock Payments Data
export const mockPayments: MockPayment[] = [
  {
    id: 'pay-1',
    userId: 'user-101',
    userEmail: 'john@example.com',
    communityId: 'comm-1',
    communityName: 'AI Entrepreneurs Hub',
    amount: 2999,
    status: 'completed',
    date: '2024-01-16T10:30:00Z',
    razorpayOrderId: 'order_123456789'
  },
  {
    id: 'pay-2',
    userId: 'user-102',
    userEmail: 'sarah@example.com',
    communityId: 'comm-3',
    communityName: 'Crypto Trading Masterclass',
    amount: 4999,
    status: 'completed',
    date: '2024-01-18T14:15:00Z',
    razorpayOrderId: 'order_987654321'
  },
  {
    id: 'pay-3',
    userId: 'user-103',
    userEmail: 'mike@example.com',
    communityId: 'comm-5',
    communityName: 'SaaS Growth Hackers',
    amount: 3499,
    status: 'pending',
    date: '2024-01-20T09:45:00Z',
    razorpayOrderId: 'order_456789123'
  },
  {
    id: 'pay-4',
    userId: 'user-104',
    userEmail: 'lisa@example.com',
    communityId: 'comm-1',
    communityName: 'AI Entrepreneurs Hub',
    amount: 2999,
    status: 'failed',
    date: '2024-01-22T16:20:00Z',
    razorpayOrderId: 'order_789123456'
  },
  {
    id: 'pay-5',
    userId: 'user-105',
    userEmail: 'david@example.com',
    communityId: 'comm-3',
    communityName: 'Crypto Trading Masterclass',
    amount: 4999,
    status: 'completed',
    date: '2024-01-25T11:10:00Z',
    razorpayOrderId: 'order_321654987'
  }
];

// Mock Members Data
export const mockMembers: MockMember[] = [
  {
    id: 'member-1',
    email: 'john@example.com',
    name: 'John Doe',
    communityId: 'comm-1',
    joinDate: '2024-01-16T10:30:00Z',
    status: 'active',
    paymentAmount: 2999
  },
  {
    id: 'member-2',
    email: 'sarah@example.com',
    name: 'Sarah Wilson',
    communityId: 'comm-3',
    joinDate: '2024-01-18T14:15:00Z',
    status: 'active',
    paymentAmount: 4999
  },
  {
    id: 'member-3',
    email: 'mike@example.com',
    name: 'Mike Johnson',
    communityId: 'comm-5',
    joinDate: '2024-01-20T09:45:00Z',
    status: 'revoked',
    paymentAmount: 3499
  },
  {
    id: 'member-4',
    email: 'lisa@example.com',
    name: 'Lisa Chen',
    communityId: 'comm-1',
    joinDate: '2024-01-22T16:20:00Z',
    status: 'active',
    paymentAmount: 2999
  }
];

// Mock Stats
export const mockStats: MockStats = {
  totalCommunities: 6,
  approvedCommunities: 3,
  pendingCommunities: 2,
  totalMembers: 479,
  totalRevenue: 1731521,
  monthlyRevenue: 245680,
  newCommunitiesThisMonth: 4,
  newMembersThisMonth: 127
};

// Helper functions for mock data manipulation
export const getMockCommunityById = (id: string): MockCommunity | undefined => {
  return mockCommunities.find(community => community.id === id);
};

export const getMockMembersByCommunity = (communityId: string): MockMember[] => {
  return mockMembers.filter(member => member.communityId === communityId);
};

export const getMockPaymentsByCommunity = (communityId: string): MockPayment[] => {
  return mockPayments.filter(payment => payment.communityId === communityId);
};

export const updateMockCommunityStatus = (id: string, status: MockCommunity['status']): void => {
  const community = mockCommunities.find(c => c.id === id);
  if (community) {
    community.status = status;
  }
};

export const updateMockMemberStatus = (id: string, status: MockMember['status']): void => {
  const member = mockMembers.find(m => m.id === id);
  if (member) {
    member.status = status;
  }
};

// Format currency helper
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date helper
export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Status badge colors
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
    case 'completed':
    case 'active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected':
    case 'failed':
    case 'revoked':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'draft':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    case 'refunded':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};