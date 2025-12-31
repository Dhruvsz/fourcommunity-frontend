
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; 
import { communitiesData } from "@/data/communities";
import { ArrowLeft, Check, ExternalLink, Users, MapPin, Calendar, Link } from "lucide-react";
import { scrollToTop } from "@/lib/animation-utils";
import { Community } from "@/types/community";
import { useGlobalMouseGradient } from "@/hooks/use-mouse-gradient";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import CommunityPayment from "@/components/CommunityPayment";

const CommunityDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [community, setCommunity] = useState<Community | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Back to communities with scroll reset - use browser history to preserve filters
  const handleBackClick = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      navigate(-1); // Go back to previous page (preserves URL parameters)
    } else {
      navigate("/communities"); // Fallback if no history
    }
    scrollToTop();
  };

  // Load community data
  useEffect(() => {
    const loadCommunity = async () => {
      console.log('🔍 Loading community with ID:', id);
      
      // 1. Check static communities first
      let foundCommunity = communitiesData.find(c => c.id === id) as Community | undefined;
      console.log('📋 Static community found:', foundCommunity?.name);
      
      // 2. If not found, check approved communities from database
      if (!foundCommunity) {
        try {
          console.log('🔍 Checking database for approved community...');
          const { data, error } = await supabase
            .from('community_subs')
            .select('*')
            .eq('id', id)
            .eq('status', 'approved')
            .single();

          if (data && !error) {
            console.log('✅ Found approved community in database:', data.community_name);
            foundCommunity = {
              id: data.id.toString(),
              name: data.community_name,
              description: data.short_description || 'New approved community',
              longDescription: data.long_description || data.short_description || 'New approved community',
              category: data.category,
              platform: data.platform,
              memberCount: "New",
              members: 0,
              verified: true,
              joinLink: data.join_type === 'paid' ? '' : data.join_link,
              joinType: data.join_type === 'paid' ? 'paid' : 'free',
              priceInr: typeof data.price_inr === 'number' ? data.price_inr : null,
              logo: data.logo_url || '/placeholder-logo.png',
              logoUrl: data.logo_url || '/placeholder-logo.png',
              location: "Global",
              tags: [data.category, data.platform],
              founderName: data.founder_name,
              founderBio: data.founder_bio
            };
          } else {
            console.log('❌ Database query error or no data:', error);
          }
        } catch (dbError) {
          console.error('❌ Database error:', dbError);
        }
      }
      
      // 3. Check localStorage as backup
      if (!foundCommunity) {
        try {
          console.log('🔍 Checking localStorage backup...');
          const legacyId = /^\d+$/.test(id) ? String(parseInt(id, 10)) : null;
          const localApproved = JSON.parse(localStorage.getItem('bulletproofApproved') || '[]');
          foundCommunity = localApproved.find((c: Community) => c.id === id || (legacyId ? c.id === legacyId : false));
          console.log('📦 LocalStorage community found:', foundCommunity?.name);
        } catch (storageError) {
          console.error('❌ LocalStorage error:', storageError);
        }
      }
      
      // 4. Check sessionStorage as final backup
      if (!foundCommunity) {
        try {
          console.log('🔍 Checking sessionStorage backup...');
          const legacyId = /^\d+$/.test(id) ? String(parseInt(id, 10)) : null;
          const sessionApproved = JSON.parse(sessionStorage.getItem('bulletproofApproved') || '[]');
          foundCommunity = sessionApproved.find((c: Community) => c.id === id || (legacyId ? c.id === legacyId : false));
          console.log('📦 SessionStorage community found:', foundCommunity?.name);
        } catch (storageError) {
          console.error('❌ SessionStorage error:', storageError);
        }
      }
      
      console.log('🎯 Final community result:', foundCommunity?.name || 'Not found');
      setCommunity(foundCommunity);
      setLoading(false);
    };

    if (id) {
      loadCommunity();
    }
  }, [id]);

  // Apply mouse gradient effect
  useGlobalMouseGradient();

  // Scroll to top when component mounts
  useEffect(() => {
    scrollToTop();
  }, [id]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <h1 className="text-xl font-medium">Loading community...</h1>
      </div>
    );
  }

  if (!community) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Community not found</h1>
        <p className="text-gray-400 mb-6">The community you're looking for doesn't exist or has been removed.</p>
        <Button onClick={handleBackClick}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Communities
        </Button>
      </div>
    );
  }

  // Founder data - use actual data from approved community or fallback to mock data
  const founderData = {
    name: community.founderName || community.admin || "Community Founder",
    title: community.adminTitle || "Serial Entrepreneur",
    bio: community.founderBio || community.adminBio || `Founder and organizer of the ${community.name} community. Passionate about bringing people together and creating valuable connections in the ${community.category.toLowerCase()} space.`,
    avatar: community.adminAvatar || `https://i.pravatar.cc/150?u=${community.name}`,
    linkedIn: community.linkedIn || "https://linkedin.com/in/founder",
    twitter: community.twitter || null,
    website: community.website || null
  };

  // Calculate how long ago the community was founded
  const foundedDate = community.foundedDate || "2023-01-01";
  const foundedYear = new Date(foundedDate).getFullYear();
  const currentYear = new Date().getFullYear();
  const yearsActive = currentYear - foundedYear;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className={`container py-8 max-w-4xl px-4 sm:px-6 lg:px-8 ${isMobile ? 'pt-24' : 'pt-28'}`}>
          <Button 
            variant="outline" 
            className="mb-8"
            onClick={handleBackClick}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Communities
          </Button>
          
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 sm:space-y-8"
          >
            {/* Community Header */}
            <div className="apple-glass-card rounded-xl p-6 sm:p-8 border-gray-800">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  <img 
                    src={community.logo} 
                    alt={`${community.name} community logo`} 
                    className="rounded-xl shadow-lg w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover border-2 border-gray-800" 
                  />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-4">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">{community.name}</h1>
                    {community.joinType === 'paid' && typeof community.priceInr === 'number' ? (
                      <Badge variant="secondary" className="bg-emerald-950/50 text-emerald-300 border-emerald-800">
                        Paid Community • ₹{community.priceInr}
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-950/40 text-gray-200 border-gray-800">
                        Free Community
                      </Badge>
                    )}
                    {community.verified && (
                      <Badge variant="secondary" className="bg-blue-950/50 text-blue-400 border-blue-800">
                        <Check className="mr-1 h-4 w-4" />
                        Verified
                      </Badge>
                    )}
                    {community.memberCount === "New" && (
                      <Badge className="bg-green-950/50 text-green-400 border-green-800">
                        Recently Approved
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                    <div className="flex items-center">
                      <Users className="mr-2 h-4 w-4" />
                      <span className="font-medium">
                        {community.members > 0 ? community.members.toLocaleString() : community.memberCount || "New"}
                      </span> 
                      <span className="ml-1">{community.members > 0 ? " members" : " community"}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      <span>{community.location || "Global"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>
                        {community.memberCount === "New" ? "Recently approved" : `Founded ${foundedYear} · ${yearsActive} ${yearsActive === 1 ? 'year' : 'years'} active`}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-base text-gray-300 leading-relaxed">{community.description}</p>
                </div>
              </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Left Column - Community Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Section */}
                <Card className="apple-glass-card border-gray-800 overflow-hidden">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">About this Community</h2>
                    <p className="text-base text-gray-300 leading-relaxed mb-6">
                      {community.longDescription || community.fullDescription || `${community.description} This is an inclusive space for people interested in ${community.category.toLowerCase()}. Our community members are from diverse backgrounds but share a common interest in learning, networking, and growing together. We host regular meetups, share resources, and provide support to each other.`}
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-400 uppercase tracking-wide">Category</h3>
                        <Badge variant="outline" className="bg-gray-800/60">
                          {community.category}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2 text-gray-400 uppercase tracking-wide">Platform</h3>
                        <Badge className="bg-gray-800/60 text-gray-200">
                          {community.platform}
                        </Badge>
                      </div>
                      
                      {community.tags && community.tags.length > 0 && (
                        <div className="sm:col-span-2">
                          <h3 className="text-sm font-medium mb-2 text-gray-400 uppercase tracking-wide">Tags</h3>
                          <div className="flex flex-wrap gap-2">
                            {community.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="bg-gray-800/40">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Capacity Section */}
                <Card className="apple-glass-card border-gray-800">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">Capacity</h2>
                    {community.platform.toLowerCase() === 'whatsapp' && (
                      <div className="w-full">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">
                            {community.members > 0 ? community.members.toLocaleString() : "New community"}
                          </span>
                          <span>1,024</span>
                        </div>
                        <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${
                              community.members >= 1024 ? 'bg-red-500' : 
                              community.members > 950 ? 'bg-amber-500' : 
                              community.members > 0 ? 'bg-primary' : 'bg-green-500'
                            }`}
                            style={{ width: `${community.members > 0 ? Math.min((community.members / 1024) * 100, 100) : 5}%` }}
                          />
                        </div>
                        <div className="mt-2 text-sm text-gray-400">
                          {community.members >= 1024 ? (
                            <span className="text-red-400">This group is full</span>
                          ) : community.members > 950 ? (
                            <span className="text-amber-400">Almost full ({1024 - community.members} spots left)</span>
                          ) : community.members > 0 ? (
                            <span>{Math.round((1 - community.members / 1024) * 100)}% available capacity</span>
                          ) : (
                            <span className="text-green-400">New community - plenty of space available!</span>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {community.platform.toLowerCase() !== 'whatsapp' && (
                      <p className="text-base text-gray-300 leading-relaxed">
                        This {community.platform} community 
                        {community.members > 0 ? ` has ${community.members.toLocaleString()} active members` : " is newly approved"} 
                        {" "}and is growing steadily. {community.platform} communities can accommodate many more members 
                        than WhatsApp groups.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Column - Admin Info and Join */}
              <div className="space-y-6">
                {/* Join Card */}
                <Card className="apple-glass-card border-gray-800">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">Join Community</h2>
                    {(() => {
                      console.log('🔧 About to render CommunityPayment', { community: community?.name, id });
                      return null;
                    })()}
                    {community && id ? (
                      <CommunityPayment community={community} communityId={id} />
                    ) : (
                      <div className="space-y-4">
                        <p className="text-red-400">Missing community data or ID</p>
                        <Button disabled className="w-full py-6 text-lg font-medium">
                          Loading Error
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Admin/Founder Info */}
                <Card className="apple-glass-card border-gray-800">
                  <CardContent className="p-6 sm:p-8">
                    <h2 className="text-xl font-semibold mb-4 text-white">About the founder</h2>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-gray-800">
                        <AvatarImage src={founderData.avatar} alt={`${founderData.name} profile picture`} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {founderData.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <h3 className="text-base font-medium text-white">{founderData.name}</h3>
                        <p className="text-sm text-gray-400">{founderData.title}</p>
                      </div>
                    </div>
                    
                    <p className="text-base text-gray-300 leading-relaxed mb-4">
                      {founderData.bio}
                    </p>
                    
                    <div className="flex gap-2 pt-2">
                      {founderData.linkedIn && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={founderData.linkedIn} target="_blank" rel="noopener noreferrer" className="flex gap-2">
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            LinkedIn
                          </a>
                        </Button>
                      )}
                      
                      {founderData.website && (
                        <Button variant="outline" size="sm" asChild>
                          <a href={founderData.website} target="_blank" rel="noopener noreferrer" className="flex gap-2">
                            <Link className="h-4 w-4" />
                            Website
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CommunityDetail;
