import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isAdmin, loading, profileLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth loading to complete (profile loading is less critical now)
    if (loading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }

    // Redirect if not admin (email-based check)
    if (!isAdmin) {
      navigate(redirectTo);
      return;
    }
  }, [isAuthenticated, isAdmin, loading, navigate, redirectTo]);

  return {
    isAuthenticated,
    isAdmin,
    loading: loading, // Profile loading is less critical for admin check now
    canAccess: isAuthenticated && isAdmin
  };
};

export const useAdminCheck = () => {
  const { isAuthenticated, isAdmin, loading, profileLoading } = useAuth();
  
  return {
    isAuthenticated,
    isAdmin,
    loading: loading, // Profile loading is less critical for admin check now
    canAccess: isAuthenticated && isAdmin
  };
};