import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtitle?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray';
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  color = 'blue'
}) => {
  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400'
  };

  const accentColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    yellow: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    gray: 'text-gray-400'
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <div className="bg-[#1C1C1F] border border-gray-700/40 rounded-xl shadow-lg hover:border-blue-500/60 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 p-6 h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="admin-card-label mb-3">{title}</p>
            <p className={`admin-metric-number mb-2 ${accentColorClasses[color]}`}>{value}</p>
            {subtitle && (
              <p className="admin-secondary-text text-sm">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-3">
                <span
                  className={`text-sm font-semibold ${
                    trend.isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {trend.isPositive ? '↗' : '↘'} {trend.isPositive ? '+' : ''}{trend.value}%
                </span>
                <span className="admin-secondary-text text-sm ml-2">vs last month</span>
              </div>
            )}
          </div>
          <div className="ml-4 p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
            <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;