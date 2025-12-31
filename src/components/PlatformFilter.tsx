
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { MessageSquare, Slack, Send, Video } from "lucide-react";

interface PlatformFilterProps {
  platforms: string[];
  selectedPlatform: string;
  onSelectPlatform: (platform: string) => void;
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'whatsapp':
      return <MessageSquare className="h-4 w-4 text-green-600" />;
    case 'slack':
      return <Slack className="h-4 w-4 text-purple-600" />;
    case 'telegram':
      return <Send className="h-4 w-4 text-blue-600" />;
    case 'discord':
      return <Video className="h-4 w-4 text-indigo-600" />;
    default:
      return <MessageSquare className="h-4 w-4" />;
  }
};

export const PlatformFilter = ({ 
  platforms, 
  selectedPlatform, 
  onSelectPlatform 
}: PlatformFilterProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="flex flex-wrap justify-center gap-2 mb-6 overflow-x-auto py-2"
    >
      {platforms.map((platform) => (
        <Button
          key={platform}
          variant={selectedPlatform === platform ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full px-4 py-2 transition-all duration-300 flex items-center gap-2",
            selectedPlatform === platform 
              ? "shadow-sm transform scale-105" 
              : "hover:bg-secondary/80"
          )}
          onClick={() => onSelectPlatform(platform)}
        >
          {getPlatformIcon(platform)}
          {platform}
        </Button>
      ))}
    </motion.div>
  );
};

export default PlatformFilter;
