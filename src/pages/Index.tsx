import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TrustedCompanies from "@/components/TrustedCompanies";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { communitiesData } from "@/data/communities";
import { CommunityCard } from "@/components/CommunityCard";
import { ArrowRight } from "lucide-react";
import Hero from "@/components/Hero";
import HomeFAQ from "@/components/HomeFAQ";
import { useGlobalMouseGradient } from "@/hooks/use-mouse-gradient";
import { useAdminShortcut } from "@/hooks/useAdminShortcut";
import CommunitiesFilter from "@/components/CommunitiesFilter";
import DiscoverySection from "@/components/DiscoverySection";
import { BackToTop } from "@/components/BackToTop";
import OnboardingNudge from "@/components/OnboardingNudge";

// Top communities this week component
const TopCommunitiesThisWeek = () => {
  // Filter just a few communities for this section
  const topCommunities = communitiesData
    .filter(c => c.verified)
    .sort((a, b) => b.members - a.members)
    .slice(0, 3);
  
  const navigate = useNavigate();
  
  return (
    <section className="py-12 md:py-16 bg-gray-900/30 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Top Communities</h2>
            <p className="text-gray-400 max-w-2xl">
              The fastest growing and most active communities on our platform
            </p>
          </div>
          <Button 
            onClick={() => navigate("/communities")}
            variant="outline"
            className="mt-4 md:mt-0 border-gray-700 hover:bg-gray-800"
          >
            View All <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {topCommunities.map(community => (
            <div 
              key={community.id}
              onClick={() => navigate(`/community/${community.id}`)} 
              className="cursor-pointer hover:-translate-y-1 transition-transform duration-200"
            >
              <CommunityCard community={community} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Join waitlist CTA component
const JoinWaitlistCTA = () => {
  const [email, setEmail] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Email submitted:", email);
    setEmail("");
    // Here you would typically send this to your backend
  };
  
  return (
    <section className="py-16 md:py-20 bg-gray-900/30 relative overflow-hidden">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Waitlist</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Be the first to know when we launch new features and communities
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto px-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="flex-grow px-4 py-3 rounded-lg bg-gray-800/60 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 text-base"
          />
          <Button type="submit" className="px-6 py-3">
            Join Waitlist
          </Button>
        </form>
      </div>
    </section>
  );
};

const Index = () => {
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const navigate = useNavigate();
  
  // Enable secret admin shortcut globally
  useAdminShortcut();
  const isMobile = useIsMobile();
  
  // Show floating button after scrolling down
  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingButton(window.scrollY > 800);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Add titles and meta descriptions for SEO
  useEffect(() => {
    document.title = "Find Your Community";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Find and join high-quality verified communities across various categories. Connect with like-minded individuals and grow your network.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Find and join high-quality verified communities across various categories. Connect with like-minded individuals and grow your network.";
      document.head.appendChild(meta);
    }
    // Add favicon
    const favicon = document.querySelector('link[rel="icon"]');
    if (!favicon) {
      const link = document.createElement('link');
      link.rel = 'icon';
      link.href = '/favicon.ico'; // Using default favicon path
      document.head.appendChild(link);
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 bg-[#141E31] pt-12">
        {/* Hero Section with Background */}
        <div className="relative">
          {/* Solid background using #141E31 */}
          <div 
            className="absolute inset-0 min-h-screen bg-[#141E31]"
          ></div>
          
          {/* Hero content container */}
          <div className="relative overflow-hidden flex items-center justify-center min-h-[calc(100vh-3rem)]" style={{ paddingTop: 'calc(0.5rem - 50px)', paddingBottom: 'calc(1rem - 50px)' }}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <Hero />
            </div>
          </div>
        </div>
        
        {/* Insert Discovery Section here */}
        <DiscoverySection />
        
        {/* Rest of your content - unchanged */}
        <CommunitiesFilter />
        <TopCommunitiesThisWeek />
        <TrustedCompanies />
        <HomeFAQ />
        <JoinWaitlistCTA />
      </main>
      <Footer />
      <BackToTop />
      
      {/* Onboarding Nudge - appears for new signups */}
      <OnboardingNudge />
    </div>
  );
};

export default Index;