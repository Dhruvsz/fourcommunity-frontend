
import { Community } from "@/types/community";

// Function to get approved communities from persistent storage (safe for SSR)
export const getPersistedApprovedCommunities = (): Community[] => {
  if (typeof window === 'undefined') return []; // SSR safety
  try {
    const stored = localStorage.getItem('persistentApprovedCommunities');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.log('No persisted approved communities found');
    return [];
  }
};

// Function to save approved communities to persistent storage
export const saveApprovedCommunityPermanently = async (community: Community) => {
  if (typeof window === 'undefined') return; // SSR safety
  try {
    const existing = getPersistedApprovedCommunities();
    const filtered = existing.filter(c => c.id !== community.id);
    const updated = [community, ...filtered].slice(0, 500); // Keep max 500
    localStorage.setItem('persistentApprovedCommunities', JSON.stringify(updated));
    console.log('✅ Saved approved community permanently:', community.name);
  } catch (error) {
    console.error('❌ Error saving approved community:', error);
  }
};

// Static demo communities
const staticCommunities: Community[] = [
  {
    id: "1",
    name: "Startup Founders Network",
    description: "Connect with other startup founders to share ideas, resources, and support.",
    fullDescription: "A vibrant community exclusively for startup founders at all stages. This group provides a safe space to ask questions, share challenges, and get advice from peers who understand the journey. With weekly AMAs from successful entrepreneurs and investors, you'll gain valuable insights to help grow your business.\n\nMembers include founders from YC, TechStars, 500 Startups, and other accelerators, as well as bootstrapped entrepreneurs building profitable businesses.",
    platform: "WhatsApp",
    category: "Startups",
    tags: ["Entrepreneurship", "Venture Capital", "Business Strategy"],
    members: 3500,
    location: "Global",
    verified: true,
    admin: "Sarah Johnson",
    adminTitle: "Serial Entrepreneur",
    adminBio: "Founded 3 startups with 2 exits. Angel investor and startup mentor.",
    adminAvatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=64&h=64&fit=crop&crop=face",
    logo: "https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=64&h=64&fit=crop",
    joinLink: "https://chat.whatsapp.com/invite/startupfounders2024",
    website: "https://startupfounders.network",
    foundedDate: "2021"
  },
  {
    id: "demo-paid-29",
    name: "Startups Dealflow Club",
    description: "Curated startup opportunities, intros, and weekly dealflow discussions.",
    platform: "WhatsApp",
    category: "Startups",
    members: 1200,
    location: "Global",
    verified: true,
    joinType: 'paid',
    priceInr: 29,
    logo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=64&h=64&fit=crop",
  },
  {
    id: "demo-paid-49",
    name: "Startup Operators Circle",
    description: "Practical playbooks for growth, hiring, and ops from builders.",
    platform: "WhatsApp",
    category: "Startups",
    members: 2400,
    location: "India",
    verified: true,
    joinType: 'paid',
    priceInr: 49,
    logo: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=64&h=64&fit=crop",
  },
  {
    id: "demo-paid-99",
    name: "Founders Mastermind (Weekly)",
    description: "Weekly founder-only sessions, accountability, and peer feedback.",
    platform: "WhatsApp",
    category: "Startups",
    members: 800,
    location: "Global",
    verified: true,
    joinType: 'paid',
    priceInr: 99,
    logo: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=64&h=64&fit=crop",
  },
  {
    id: "2",
    name: "Design Systems Slack",
    description: "Community for designers and developers working with design systems.",
    fullDescription: "The Design Systems Slack is the premier community for designers, developers, and product managers who are passionate about creating and maintaining scalable design systems. This community provides a space for sharing best practices, asking questions, and connecting with experts in the field.\n\nWith dedicated channels for specific tools, methodologies, and challenges, you'll find exactly the resources you need to level up your design system skills. Regular events include virtual workshops, critique sessions, and case study presentations.",
    platform: "Slack",
    category: "Creative",
    tags: ["Design", "UX/UI", "Frontend"],
    members: 12000,
    location: "Global",
    verified: true,
    admin: "Michael Chen",
    adminTitle: "Design Lead @ Airbnb",
    adminBio: "10+ years experience building design systems for enterprise products.",
    logo: "https://images.unsplash.com/photo-1513346940221-6f673d962e97?w=64&h=64&fit=crop",
    joinLink: "https://designsystemscommunity.slack.com/join/shared_invite/design-systems-2024",
    website: "https://designsystems.community",
    foundedDate: "2019"
  },
  {
    id: "3",
    name: "AI Engineers Hub",
    description: "Technical discussions on machine learning, deep learning, and AI engineering.",
    fullDescription: "A highly technical community focused on practical AI implementation challenges and solutions. This group connects AI engineers, researchers, and data scientists who are working on real-world applications across industries.\n\nMembers regularly share code snippets, research papers, and implementation strategies. The community maintains a shared repository of useful tools, notebooks, and resources to help everyone stay at the cutting edge of AI development.",
    platform: "Discord",
    category: "Tech",
    tags: ["Machine Learning", "Deep Learning", "Python"],
    members: 8700,
    location: "Global",
    verified: true,
    admin: "Dr. Aisha Patel",
    adminTitle: "AI Researcher",
    adminBio: "PhD in Computer Science, specializing in reinforcement learning.",
    logo: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=64&h=64&fit=crop",
    joinLink: "https://discord.gg/aiengineers2024",
    foundedDate: "2020"
  },
  {
    id: "4",
    name: "Crypto Investors Circle",
    description: "Analysis, insights and discussion for serious cryptocurrency investors.",
    platform: "Telegram",
    category: "Finance",
    tags: ["Cryptocurrency", "Blockchain", "Investing"],
    members: 5200,
    location: "Global",
    verified: true,
    admin: "Alex Rivera",
    adminTitle: "Crypto Analyst",
    logo: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=64&h=64&fit=crop",
    joinLink: "https://t.me/cryptoinvestorscircle",
    foundedDate: "2022"
  },
  {
    id: "5",
    name: "Content Creators Collective",
    description: "Support network for YouTubers, podcasters, and digital content creators.",
    platform: "WhatsApp",
    category: "Creators",
    members: 2800,
    location: "United States",
    verified: false,
    admin: "Jamie Smith",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=64&h=64&fit=crop",
    joinLink: "https://chat.whatsapp.com/invite/contentcreators2024",
    foundedDate: "2022"
  },
  {
    id: "6",
    name: "Product Managers United",
    description: "Community for product managers to share insights and best practices.",
    platform: "Slack",
    category: "Business",
    members: 7300,
    location: "Global",
    verified: true,
    admin: "Raj Patel",
    logo: "https://images.unsplash.com/photo-1512314889357-e157c22f938d?w=64&h=64&fit=crop",
    joinLink: "https://pmunited.slack.com/join/shared_invite/product-managers-2024",
    foundedDate: "2021"
  },
  {
    id: "7",
    name: "Wellness Entrepreneurs",
    description: "For founders and professionals in the health and wellness industry.",
    platform: "Telegram",
    category: "Health",
    members: 1900,
    location: "Europe",
    verified: false,
    admin: "Emma Johnson",
    logo: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=64&h=64&fit=crop",
    joinLink: "https://t.me/wellnessentrepreneurs",
    foundedDate: "2023"
  },
  {
    id: "8",
    name: "SaaS Founders Club",
    description: "Exclusive group for founders of software-as-a-service companies.",
    platform: "Slack",
    category: "Startups",
    members: 4200,
    location: "Global",
    verified: true,
    admin: "David Wong",
    logo: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=64&h=64&fit=crop",
    joinLink: "https://saasfounders.slack.com/join/shared_invite/saas-founders-2024",
    foundedDate: "2020"
  },
  {
    id: "9",
    name: "Frontend Developers Hub",
    description: "Community focused on frontend development technologies and practices.",
    platform: "Discord",
    category: "Tech",
    members: 9800,
    location: "Global",
    verified: true,
    admin: "Sophia Garcia",
    logo: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=64&h=64&fit=crop",
    joinLink: "https://discord.gg/frontenddevs2024",
    foundedDate: "2021"
  }
];

// Export static communities only - approved communities will be loaded dynamically
export const communitiesData: Community[] = staticCommunities;
