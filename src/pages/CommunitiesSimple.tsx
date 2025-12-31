import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { communitiesData } from "@/data/communities";
import { Community } from "@/types/community";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommunityCard } from "@/components/CommunityCard";
import { BackToTop } from "@/components/BackToTop";

const CommunitiesSimple = () => {
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchApprovedCommunities = async () => {
    setIsRefreshing(true);
    try {
      console.log('🔍 Fetching approved communities from Supabase...');
      const { data, error } = await supabase
        .from('community_subs')
        .select('*')
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching communities:', error);
        return;
      }

      console.log('📊 Supabase response:', data);
      console.log('✅ Found approved communities:', data?.length || 0);

      if (data && data.length > 0) {
        // Map database fields to Community interface
        const mappedCommunities: Community[] = data.map((item: any) => ({
          id: item.id,
          name: item.community_name,
          logo: item.logo_url || '/placeholder-logo.png',
          verified: true, // Approved communities are verified
          platform: item.platform as 'WhatsApp' | 'Telegram' | 'Slack' | 'Discord',
          category: item.category,
          description: item.short_description,
          fullDescription: item.long_description,
          members: Math.floor(Math.random() * 10000) + 100, // Random for now
          location: 'Online', // Default location
          joinLink: item.join_type === 'paid' ? '' : item.join_link,
          joinType: item.join_type === 'paid' ? 'paid' : 'free',
          priceInr: typeof item.price_inr === 'number' ? item.price_inr : null,
          admin: item.founder_name,
          adminBio: item.founder_bio
        }));

        console.log('🗺️ Mapped communities:', mappedCommunities);
        
        // Combine with static data
        const combinedCommunities = [...mappedCommunities, ...communitiesData];
        console.log('📋 Total communities (approved + static):', combinedCommunities.length);
        setAllCommunities(combinedCommunities);
      } else {
        // Only static data if no approved communities
        setAllCommunities(communitiesData);
      }
    } catch (error) {
      console.error('❌ Error fetching communities:', error);
      setAllCommunities(communitiesData);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Auto-refresh every 5 seconds
  useEffect(() => {
    fetchApprovedCommunities();

    console.log('🔄 Setting up auto-refresh every 5 seconds...');
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing communities...');
      fetchApprovedCommunities();
    }, 5000);

    return () => {
      console.log('🔌 Cleaning up auto-refresh');
      clearInterval(interval);
    };
  }, []);

  // Filter communities based on search
  const filteredCommunities = allCommunities.filter(community =>
    community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover Quality Communities
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Find the perfect groups to join across WhatsApp, Slack, and Telegram
          </p>
        </div>

        {/* Search and Refresh */}
        <div className="flex items-center gap-4 mb-8 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search communities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={fetchApprovedCommunities}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        {/* Auto-refresh indicator */}
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500">
            🔄 Auto-refreshing every 5 seconds • {allCommunities.length} communities found
          </p>
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCommunities.map((community) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>

        {/* No results */}
        {filteredCommunities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No communities found matching your search.</p>
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
              className="mt-4 bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            >
              Clear Search
            </Button>
          </div>
        )}

        <BackToTop />
      </div>
    </div>
  );
};

export default CommunitiesSimple;
