
import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: string;
  delay?: number;
}

const StatsCard = ({ title, value, icon, trend, color = "bg-gray-900/70", delay = 0 }: StatsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="w-full"
    >
      <Card className={`border-gray-800 shadow-md backdrop-blur-sm ${color} overflow-hidden hover:shadow-lg transition-all duration-300`}>
        <CardContent className="p-6 relative">
          <div className="absolute top-0 right-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent to-primary/5 rounded-r-lg" />
          
          {/* Icon with glowing effect */}
          <div className="relative mb-4 inline-flex">
            <div className="p-2 rounded-lg bg-gray-800/50 backdrop-blur-sm border border-gray-700/50">
              {icon}
            </div>
            <motion.div
              animate={{
                opacity: [0.2, 0.4, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-1 rounded-lg bg-primary/20 blur-md -z-10"
            />
          </div>
          
          {/* Title and value */}
          <div className="space-y-1">
            <h3 className="text-sm font-medium text-gray-400">{title}</h3>
            <div className="flex justify-between items-end">
              <p className="text-2xl font-semibold text-white">{value}</p>
              {trend && (
                <div
                  className={`flex items-center text-sm ${
                    trend.isPositive ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trend.isPositive ? (
                    <ArrowUpIcon className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownIcon className="h-3 w-3 mr-1" />
                  )}
                  <span>{trend.value}%</span>
                </div>
              )}
            </div>
            
            {/* Progress indicator */}
            <div className="h-1 w-full bg-gray-800 mt-3 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "60%" }}
                transition={{ duration: 1, delay: delay * 0.1 + 0.3 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
