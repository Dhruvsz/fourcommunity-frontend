import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CommunityCard } from "@/components/CommunityCard";
import { communitiesData } from "@/data/communities";
import { Community } from "@/types/community";
import { supabase } from "@/lib/supabase";
import { Search, MessageSquare, Send, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { BackToTop } from "@/components/BackToTop";

const platformFilters = ["All", "WhatsApp", "Telegram", "Slack", "Discord"];
const categoryFilters = ["All", "Startups", "Tech", "Creators", "Finance", "Health", "Education", "Lifestyle", "Business"];

const PlatformIcon = ({ platform, className }: { platform: string, className?: string }) => {
  const iconProps = { className: `h-4 w-4 ${className}` };
  switch (platform.toLowerCase()) {
    case 'whatsapp': return <MessageSquare {...iconProps} />;
    case 'telegram': return <Send {...iconProps} />;
    case 'slack': return <MessageSquare {...iconProps} />;
    case 'discord': return <MessageSquare {...iconProps} />;
    default: return null;
  }
};

const Communities = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Initialize state with default values (will be updated from URL in useEffect)
  const [searchTerm, setSearchTerm] = useState("");
  const [activePlatform, setActivePlatform] = useState("All");
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeJoinType, setActiveJoinType] = useState<'all' | 'free' | 'paid'>('all');
  const [paidPriceMin, setPaidPriceMin] = useState<string>('');
  const [paidPriceMax, setPaidPriceMax] = useState<string>('');
  
  const [allCommunities, setAllCommunities] = useState<Community[]>(communitiesData); // CRITICAL: Start with static data immediately!
  const [filteredCommunities, setFilteredCommunities] = useState<Community[]>(communitiesData); // CRITICAL: Show static communities immediately!
  const [, setLoading] = useState(false); // CRITICAL: Don't block UI with loading
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const isMobile = useIsMobile();

  // Function to update URL parameters
  const updateURLParams = (updates: Record<string, string | null>, replaceHistory: boolean = true) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'All' && value !== 'all') {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams, { replace: replaceHistory });
  };

  // Scroll to top on mount and when location changes (desktop only)
  useLayoutEffect(() => {
    if (!isMobile) {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname, isMobile]);

  // Set page title
  useEffect(() => {
    document.title = "Browse All Communities - GroupFinder";
  }, []);



  // 🚀 CLEAN AUTO-LOADING SYSTEM - FIXED!
  useEffect(() => {
    console.log('🚀 LOADING: Starting clean communities load...');
    console.log('📊 INITIAL: Static communities =', communitiesData.length);
    
    // CLEAR OLD localStorage (might have corrupt data)
    try {
      localStorage.removeItem('approvedCommunities');
      console.log('🧹 CLEARED: Old localStorage data removed');
    } catch (e) {
      console.log('⚠️ localStorage clear failed:', e);
    }
    
    // Function to load all communities (static + approved)
    const loadAllCommunities = async () => {
      try {
        console.log('\n🔍 DATABASE: Querying for approved communities...');
        
        const { data, error } = await supabase
          .from('community_subs')
          .select('*')
          .eq('status', 'approved')
          .order('created_at', { ascending: false });

        console.log('\n🗄️ QUERY RESULT:');
        console.log('   Error:', error ? error.message : 'None');
        console.log('   Data:', data);
        console.log('   Count:', data?.length || 0);
        
        if (error) {
          console.error('\n❌ DATABASE ERROR:', error);
          console.log('   Using static communities only');
          setAllCommunities(communitiesData);
          setLoading(false);
          return;
        }
        
        if (!data || data.length === 0) {
          console.warn('\n⚠️ NO APPROVED COMMUNITIES IN DATABASE!');
          console.warn('   Status field must be exactly: "approved" (lowercase)');
          console.warn('   Using static communities only');
          setAllCommunities(communitiesData);
          setLoading(false);
          return;
        }
        
        // SUCCESS! We have approved communities
        console.log('\n✅ SUCCESS: Found', data.length, 'approved communities!');
        console.log('   Sample:', data[0]?.community_name || 'N/A');
        
        // Map database communities to our Community type
        const dbApprovedCommunities: Community[] = data.map(item => ({
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
          logo: item.logo_url || '',
          location: "Global",
          tags: [item.category, item.platform],
          admin: item.founder_name,
          adminBio: item.founder_bio || ''
        }));

        console.log('\n🔄 MAPPED:', dbApprovedCommunities.length, 'communities');
        
        // SIMPLE: Database communities FIRST, then static
        // No complex deduplication - just combine them
        const finalCommunities = [...dbApprovedCommunities, ...communitiesData];
        
        console.log('\n📋 FINAL RESULT:');
        console.log('   Database communities:', dbApprovedCommunities.length);
        console.log('   Static communities:', communitiesData.length);
        console.log('   TOTAL:', finalCommunities.length);
        console.log('\n🔍 DETAILED BREAKDOWN:');
        console.log('   Database communities list:', dbApprovedCommunities.map(c => c.name));
        console.log('   Final array length:', finalCommunities.length);
        console.log('   Setting state with:', finalCommunities);
        
        // Update state
        setAllCommunities(finalCommunities);
        setLastUpdated(new Date());
        setLoading(false);
        
        console.log('\n✅ LOAD COMPLETE:', finalCommunities.length, 'communities available');
        console.log('✅ State updated with allCommunities:', finalCommunities.length, 'items\n');
        
      } catch (error) {
        console.error('\n❌ CRITICAL ERROR:', error);
        console.log('   Falling back to static communities');
        setAllCommunities(communitiesData);
        setLoading(false);
      }
    };

    // Initial load
    loadAllCommunities();

    // Set up aggressive auto-refresh every 10 seconds
    const autoRefreshInterval = setInterval(() => {
      console.log('🔄 BULLETPROOF: Auto-refreshing communities...');
      loadAllCommunities();
    }, 10000); // Refresh every 10 seconds

    // Listen for FORCE REFRESH events
    const handleForceRefresh = (event: CustomEvent) => {
      console.log('🚀 BULLETPROOF: FORCE REFRESH triggered:', event.detail);
      loadAllCommunities();
    };

    // Listen for approval events
    const handleApproval = (event: CustomEvent) => {
      console.log('🚀 BULLETPROOF: Approval event received:', event.detail);
      const newCommunity = event.detail;
      
      if (newCommunity && newCommunity.id) {
        setAllCommunities(prev => {
          const filtered = prev.filter(c => c.id !== newCommunity.id);
          const updated = [newCommunity, ...filtered];
          console.log('✅ BULLETPROOF: Added community immediately:', newCommunity.name);
          return updated;
        });
        setLastUpdated(new Date());
      }
    };

    // Listen for all possible events
    window.addEventListener('FORCE_COMMUNITIES_REFRESH', handleForceRefresh as EventListener);
    window.addEventListener('addApprovedCommunity', handleApproval as EventListener);
    window.addEventListener('refreshCommunities', handleForceRefresh as EventListener);

    // Cleanup
    return () => {
      clearInterval(autoRefreshInterval);
      window.removeEventListener('FORCE_COMMUNITIES_REFRESH', handleForceRefresh as EventListener);
      window.removeEventListener('addApprovedCommunity', handleApproval as EventListener);
      window.removeEventListener('refreshCommunities', handleForceRefresh as EventListener);
      console.log('🧹 BULLETPROOF: Cleanup completed');
    };
  }, []);

  // Sync state with URL parameters on mount and URL changes
  useEffect(() => {
    const search = searchParams.get('search') || "";
    const platform = searchParams.get('platform') || "All";
    const category = searchParams.get('category') || "All";
    const joinType = (searchParams.get('joinType') as 'all' | 'free' | 'paid') || 'all';
    const priceMin = searchParams.get('priceMin') || '';
    const priceMax = searchParams.get('priceMax') || '';

    setSearchTerm(search);
    setActivePlatform(platform);
    setActiveCategory(category);
    setActiveJoinType(joinType);
    setPaidPriceMin(priceMin);
    setPaidPriceMax(priceMax);
  }, [searchParams]);

  // Auto-refresh is now handled in the main useEffect above

  useEffect(() => {
    console.log('🔍 FILTER: Starting filter with', allCommunities.length, 'total communities');
    console.log('🔍 FILTER: Active platform:', activePlatform, '| Active category:', activeCategory);
    let results = allCommunities;

    const toJoinType = (c: Community): 'free' | 'paid' => {
      return c.joinType === 'paid' ? 'paid' : 'free';
    };

    const parsedPaidMin = paidPriceMin.trim() ? Number(paidPriceMin) : null;
    const parsedPaidMax = paidPriceMax.trim() ? Number(paidPriceMax) : null;

    // Filter by platform (CASE-INSENSITIVE!)
    if (activePlatform !== "All") {
      results = results.filter(c => 
        c.platform.toLowerCase() === activePlatform.toLowerCase()
      );
      console.log('📱 FILTER: After platform filter (' + activePlatform + '):', results.length, 'communities');
    }

    // Filter by category (CASE-INSENSITIVE!)
    if (activeCategory !== "All") {
      results = results.filter(c => 
        c.category.toLowerCase() === activeCategory.toLowerCase()
      );
      console.log('📂 FILTER: After category filter (' + activeCategory + '):', results.length, 'communities');
    }

    // Filter by search term
    if (searchTerm) {
      results = results.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      console.log('🔎 FILTER: After search filter:', results.length, 'communities');
    }

    if (activeJoinType !== 'all') {
      results = results.filter(c => toJoinType(c) === activeJoinType);
    }

    if (activeJoinType === 'paid' && (parsedPaidMin !== null || parsedPaidMax !== null)) {
      results = results.filter(c => {
        if (toJoinType(c) !== 'paid') return false;
        const price = typeof c.priceInr === 'number' ? c.priceInr : null;
        if (price === null) return false;
        if (parsedPaidMin !== null && price < parsedPaidMin) return false;
        if (parsedPaidMax !== null && price > parsedPaidMax) return false;
        return true;
      });
    }

    console.log('✅ FILTER: Final filtered communities:', results.length);
    console.log('✅ FILTER: Community names:', results.map(c => c.name).slice(0, 5));
    setFilteredCommunities(results);
  }, [searchTerm, activePlatform, activeCategory, activeJoinType, paidPriceMin, paidPriceMax, allCommunities]);

  return (
    <div className="flex flex-col min-h-screen bg-[#131316] text-white">
      <Navbar />
      <main className="flex-1">
        <div className={`container mx-auto px-4 py-12 ${isMobile ? 'pt-32' : 'pt-56'}`}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-3">Discover Quality Communities</h1>
            <p className="text-lg text-gray-400">
              Find the perfect groups to join across WhatsApp, Slack, and Telegram
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="mb-10 space-y-5">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search communities..."
                  value={searchTerm}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchTerm(value);
                    updateURLParams({ search: value });
                  }}
                  className="pl-10 bg-background/50 border-border/50"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  console.log('🔄 MANUAL REFRESH: Button clicked');
                  setLoading(true);
                  
                  try {
                    console.log('🗄️ MANUAL REFRESH: Querying database...');
                    const { data, error } = await supabase
                      .from('community_subs')
                      .select('*')
                      .eq('status', 'approved')
                      .order('created_at', { ascending: false });

                    console.log('🗄️ MANUAL REFRESH: Query result:', { 
                      hasError: !!error, 
                      error: error?.message,
                      dataLength: data?.length || 0 
                    });

                    if (error) {
                      console.error('❌ MANUAL REFRESH: Database error:', error);
                    } else if (!data || data.length === 0) {
                      console.warn('⚠️ MANUAL REFRESH: No approved communities in database!');
                      console.warn('💡 HINT: Go to admin panel and approve some communities first');
                    } else {
                      console.log('✅ MANUAL REFRESH: Found', data.length, 'approved communities');
                      
                      const approvedCommunities: Community[] = data.map(item => ({
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

                      const combined = [...approvedCommunities, ...communitiesData];
                      setAllCommunities(combined);
                      setLastUpdated(new Date());
                      console.log('✅ MANUAL REFRESH: Total communities now:', combined.length);
                      console.log('📊 MANUAL REFRESH: Breakdown - Approved:', approvedCommunities.length, '+ Static:', communitiesData.length);
                    }
                  } catch (error) {
                    console.error('❌ MANUAL REFRESH: Unexpected error:', error);
                  } finally {
                    setLoading(false);
                  }
                }}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
              {/* Real-time update indicator */}
              <div className="text-xs text-gray-400 flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                BULLETPROOF Auto-updating every 10s • Last: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>

            {/* Platform Filters */}
            <div className="flex justify-center flex-wrap gap-3">
              {platformFilters.map(platform => (
                <Button
                  key={platform}
                  onClick={() => {
                    setActivePlatform(platform);
                    updateURLParams({ platform: platform });
                  }}
                  variant="ghost"
                  className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                    activePlatform === platform
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#2A2A2D] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {platform !== 'All' && <PlatformIcon platform={platform} className="mr-2" />}
                  {platform}
                </Button>
              ))}
            </div>

            {/* Free/Paid Filters */}
            <div className="flex justify-center flex-wrap gap-3">
              <Button
                onClick={() => {
                  setActiveJoinType('all');
                  updateURLParams({ joinType: 'all' });
                }}
                variant="ghost"
                className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                  activeJoinType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A2A2D] text-gray-300 hover:bg-gray-700'
                }`}
              >
                All
              </Button>
              <Button
                onClick={() => {
                  setActiveJoinType('free');
                  updateURLParams({ joinType: 'free' });
                }}
                variant="ghost"
                className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                  activeJoinType === 'free'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A2A2D] text-gray-300 hover:bg-gray-700'
                }`}
              >
                Free Communities
              </Button>
              <Button
                onClick={() => {
                  setActiveJoinType('paid');
                  updateURLParams({ joinType: 'paid' });
                }}
                variant="ghost"
                className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                  activeJoinType === 'paid'
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#2A2A2D] text-gray-300 hover:bg-gray-700'
                }`}
              >
                Paid Communities
              </Button>
            </div>

            {/* Paid Price Range (only when Paid selected) */}
            {activeJoinType === 'paid' && (
              <div className="flex justify-center">
                <div className="w-full max-w-xl bg-[#1C1C1F] border border-gray-700/40 rounded-xl p-4">
                  <div className="text-sm text-gray-300 font-medium mb-3">Price Range</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Input
                      inputMode="numeric"
                      placeholder="Min ₹"
                      value={paidPriceMin}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPaidPriceMin(value);
                        updateURLParams({ priceMin: value });
                      }}
                      className="bg-background/50 border-border/50"
                    />
                    <Input
                      inputMode="numeric"
                      placeholder="Max ₹"
                      value={paidPriceMax}
                      onChange={(e) => {
                        const value = e.target.value;
                        setPaidPriceMax(value);
                        updateURLParams({ priceMax: value });
                      }}
                      className="bg-background/50 border-border/50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category Filters */}
            <div className="flex justify-center flex-wrap gap-3">
              {categoryFilters.map(cat => (
                <Button
                  key={cat}
                  onClick={() => {
                    setActiveCategory(cat);
                    updateURLParams({ category: cat });
                  }}
                  variant="ghost"
                  className={`rounded-lg px-4 py-2 transition-colors duration-200 ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white'
                      : 'bg-[#1C1C1F] text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>

          {/* Communities Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCommunities.map((community, index) => (
              <motion.div
                key={community.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="cursor-pointer"
                onClick={() => navigate(`/community/${community.id}`)}
              >
                <CommunityCard community={community} />
              </motion.div>
            ))}
          </motion.div>

          {filteredCommunities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 text-gray-500"
            >
              <p className="text-lg">No communities found.</p>
              <p>Try adjusting your search or filters.</p>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
};

export default Communities;

