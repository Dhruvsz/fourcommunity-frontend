import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !isAdmin) {
      console.log('Admin check failed:', { isAuthenticated, isAdmin, loading });
      return; // TEMP: removed redirect for testing
    }
  }, [isAuthenticated, isAdmin, loading, navigate, redirectTo]);

  return {
    isAuthenticated,
    isAdmin,
    loading,
    canAccess: true // TEMP: always allow access for testing
  };
};

export const useAdminCheck = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  return {
    isAuthenticated,
    isAdmin,
    loading,
    canAccess: true // TEMP: always allow access for testing
  };
};
