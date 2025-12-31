import React from 'react';

/**
 * Utility functions for date formatting and relative time calculations
 */

/**
 * Format date to DD/MM/YYYY format
 */
export const formatDateDDMMYYYY = (date: Date | string | null): string => {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const day = dateObj.getDate().toString().padStart(2, '0');
  const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const year = dateObj.getFullYear();
  
  return `${day}/${month}/${year}`;
};

/**
 * Get relative time string (e.g., "3 days ago", "2 hours ago")
 */
export const getRelativeTime = (date: Date | string | null): string => {
  if (!date) return 'Unknown';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return 'Invalid Date';
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // Handle future dates
  if (diffInSeconds < 0) {
    return 'Just now';
  }
  
  // Less than 1 minute
  if (diffInSeconds < 60) {
    return diffInSeconds <= 1 ? 'Just now' : `${diffInSeconds} seconds ago`;
  }
  
  // Less than 1 hour
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
  }
  
  // Less than 1 day
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
  }
  
  // Less than 1 month
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
  }
  
  // Less than 1 year
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
  }
  
  // 1 year or more
  const diffInYears = Math.floor(diffInMonths / 12);
  return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
};

/**
 * Hook for dynamic relative time that updates every second
 */
export const useDynamicRelativeTime = (date: Date | string | null) => {
  const [relativeTime, setRelativeTime] = React.useState(() => getRelativeTime(date));
  
  React.useEffect(() => {
    if (!date) return;
    
    // Update immediately
    setRelativeTime(getRelativeTime(date));
    
    // Set up interval to update every second for recent times
    const interval = setInterval(() => {
      setRelativeTime(getRelativeTime(date));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [date]);
  
  return relativeTime;
};