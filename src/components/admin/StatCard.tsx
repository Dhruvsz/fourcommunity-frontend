import React from 'react';
import { LucideIcon } from 'lucide-react';

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
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-amber-600',
    red: 'text-red-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600'
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="admin-card-label mb-3">{title}</p>
          <p className="admin-metric-number mb-2">{value}</p>
          {subtitle && (
            <p className="admin-secondary-text text-sm">{subtitle}</p>
          )}
          {trend && (
            <div className="flex items-center mt-3">
              <span
                className={`text-sm font-medium ${
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {trend.isPositive ? '+' : ''}{trend.value}%
              </span>
              <span className="admin-secondary-text text-sm ml-2">vs last month</span>
            </div>
          )}
        </div>
        <div className="ml-4">
          <Icon className={`h-6 w-6 ${iconColorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;