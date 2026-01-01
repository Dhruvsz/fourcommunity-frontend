import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isAdmin, loading, profileLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for loading to complete
    if (loading || profileLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Redirect if not admin
    if (!isAdmin) {
      navigate(redirectTo);
      return;
    }
  }, [isAuthenticated, isAdmin, loading, profileLoading, navigate, redirectTo]);

  return {
    isAuthenticated,
    isAdmin,
    loading: loading || profileLoading,
    canAccess: isAuthenticated && isAdmin
  };
};

export const useAdminCheck = () => {
  const { isAuthenticated, isAdmin, loading, profileLoading } = useAuth();
  
  return {
    isAuthenticated,
    isAdmin,
    loading: loading || profileLoading,
    canAccess: isAuthenticated && isAdmin
  };
};