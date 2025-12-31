import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Community } from "@/types/community";
import { MessageSquare, Slack, Send, Globe, Users } from "lucide-react";

// Platform Icon Component
const PlatformIcon = ({ platform }: { platform: string }) => {
  const iconProps = { className: "h-4 w-4 text-gray-400" };
  switch (platform.toLowerCase()) {
    case 'whatsapp': return <MessageSquare {...iconProps} />;
    case 'slack': return <Slack {...iconProps} />;
    case 'telegram': return <Send {...iconProps} />;
    case 'discord': return <MessageSquare {...iconProps} />; // Using MessageSquare for Discord as in image
    default: return <MessageSquare {...iconProps} />;
  }
};

interface CommunityCardProps {
  community: Community;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({ community }) => {
  const capacityProgress = community.capacity ? (community.members / community.capacity) * 100 : 0;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="flex flex-col h-full bg-[#1C1C1F] border border-gray-700/40 rounded-xl shadow-lg hover:border-blue-500/60 transition-colors duration-300 overflow-hidden text-white">
        <CardContent className="p-5 flex flex-col flex-grow">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12 rounded-lg border-2 border-gray-700">
                <AvatarImage 
                  src={community.logo} 
                  alt={`${community.name} community logo`}
                  loading="lazy"
                  decoding="async"
                />
                <AvatarFallback className="bg-gray-800 text-gray-300">
                  {community.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-bold tracking-tight">{community.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                  <PlatformIcon platform={community.platform} />
                  <span>{community.platform}</span>
                  <span className="text-gray-600">•</span>
                  <span>{community.category}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {community.verified && (
                <Badge variant="outline" className="bg-blue-900/50 text-blue-300 border-blue-700 text-xs">
                  Verified
                </Badge>
              )}
              {community.joinType === 'paid' && typeof community.priceInr === 'number' ? (
                <Badge variant="outline" className="bg-emerald-900/40 text-emerald-300 border-emerald-700 text-xs">
                  Paid – ₹{community.priceInr}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-800/50 text-gray-300 border-gray-700 text-xs">
                  Free to Join
                </Badge>
              )}
              {community.isFull && (
                <Badge className="bg-red-900/50 text-red-400 border-red-700 text-xs">
                  Full
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-400 text-sm leading-relaxed flex-grow mb-4">
            {community.description}
          </p>

          {/* Footer with Progress Bar */}
          <div>
            <div className="flex justify-between items-center text-xs text-gray-400 mb-1">
              <div className="flex items-center gap-1">
                <Users size={12} />
                <span>
                  {community.members.toLocaleString()} / {community.capacity ? community.capacity.toLocaleString() : 'Unlimited'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Globe size={12} />
                <span>{community.location}</span>
              </div>
            </div>
            {community.capacity && (
              <Progress 
                value={capacityProgress} 
                className="h-1 bg-gray-700 [&>div]:bg-red-500" 
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
