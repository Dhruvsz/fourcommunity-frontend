import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const useAdminGuard = (redirectTo: string = '/') => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth loading to complete
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
    loading,
    canAccess: isAuthenticated && isAdmin
  };
};

export const useAdminCheck = () => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  
  return {
    isAuthenticated,
    isAdmin,
    loading,
    canAccess: isAuthenticated && isAdmin
  };
};