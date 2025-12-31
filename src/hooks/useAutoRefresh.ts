import { useEffect, useRef } from 'react';

interface UseAutoRefreshOptions {
  onRefresh: () => void;
  intervalMs?: number;
  enabled?: boolean;
}

export const useAutoRefresh = ({ 
  onRefresh, 
  intervalMs = 5000, 
  enabled = true 
}: UseAutoRefreshOptions) => {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!enabled) return;

    console.log(`🔄 Setting up auto-refresh every ${intervalMs}ms`);
    
    intervalRef.current = setInterval(() => {
      console.log('🔄 Auto-refreshing...');
      onRefresh();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        console.log('🔌 Cleaning up auto-refresh');
        clearInterval(intervalRef.current);
      }
    };
  }, [onRefresh, intervalMs, enabled]);

  const forceRefresh = () => {
    console.log('🔄 Force refreshing...');
    onRefresh();
  };

  return { forceRefresh };
};
