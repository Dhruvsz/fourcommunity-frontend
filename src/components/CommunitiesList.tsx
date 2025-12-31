
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CommunityCard } from "@/components/CommunityCard";
import { communitiesData } from "@/data/communities";
import { scrollToTop } from "@/lib/animation-utils";

interface CommunitiesListProps {
  searchQuery: string;
  selectedCategory: string | null;
  selectedPlatform?: string | null;
}

export const CommunitiesList = ({ 
  searchQuery, 
  selectedCategory,
  selectedPlatform = null
}: CommunitiesListProps) => {
  const navigate = useNavigate();
  
  const filteredCommunities = communitiesData.filter(community => {
    // Filter by search query
    const matchesSearch = community.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         community.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || selectedCategory === "All" || community.category === selectedCategory;
    
    // Filter by platform
    const matchesPlatform = !selectedPlatform || selectedPlatform === "All" || community.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4
      }
    }
  };
  
  const handleCardClick = (id: string) => {
    navigate(`/community/${id}`);
    scrollToTop(); // Ensure we scroll to top when opening community detail
  };
  
  return (
    <>
      {filteredCommunities.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-xl text-muted-foreground">
            No communities found matching your criteria.
          </p>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredCommunities.map(community => (
            <motion.div 
              key={community.id} 
              variants={itemVariants}
              onClick={() => handleCardClick(community.id)}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
              className="cursor-pointer apple-glass-card hover-glow"
            >
              <CommunityCard community={community} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </>
  );
};
