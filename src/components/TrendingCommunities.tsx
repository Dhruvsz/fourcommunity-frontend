
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CommunityCard } from "@/components/CommunityCard";
import { communitiesData } from "@/data/communities";

export const TrendingCommunities = () => {
  const navigate = useNavigate();
  
  // Get top 3 communities with most members
  const trendingCommunities = [...communitiesData]
    .sort((a, b) => b.members - a.members)
    .slice(0, 3);
  
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
  };
  
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-8 text-center md:text-left">TRENDING COMMUNITIES</h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {trendingCommunities.map(community => (
            <motion.div 
              key={community.id} 
              variants={itemVariants}
              onClick={() => handleCardClick(community.id)}
              whileHover={{ 
                y: -5, 
                transition: { duration: 0.2 } 
              }}
              className="cursor-pointer"
            >
              <CommunityCard community={community} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TrendingCommunities;
