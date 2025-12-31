import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processing auth callback...');
        console.log('🔗 Current URL:', window.location.href);
        console.log('🔗 Hash:', window.location.hash);
        console.log('🔗 Search:', window.location.search);
        
        // Handle the OAuth callback - Supabase automatically processes the hash/search params
        const { data, error } = await supabase.auth.getSession();
        
        console.log('📊 Session data:', data);
        console.log('❌ Session error:', error);
        
        if (error) {
          console.error('❌ Auth callback error:', error);
          toast.error('Authentication failed', {
            description: error.message
          });
          navigate('/login');
          return;
        }

        if (data.session) {
          console.log('✅ Auth callback success:', data.session.user.email);
          
          // Check if this is a new user (just signed up)
          const isNewUser = data.session.user.created_at && 
            new Date(data.session.user.created_at).getTime() > Date.now() - 60000; // Within last minute
          
          // Store user data
          localStorage.setItem('user_data', JSON.stringify({
            id: data.session.user.id,
            email: data.session.user.email,
            name: data.session.user.user_metadata?.full_name || data.session.user.user_metadata?.name,
            avatar: data.session.user.user_metadata?.avatar_url,
            timestamp: new Date().toISOString()
          }));
          
          // Set flag for new signups to trigger onboarding nudge
          if (isNewUser) {
            localStorage.setItem('justSignedUp', 'true');
          } else {
            localStorage.setItem('justLoggedIn', 'true');
          }
          
          toast.success('Welcome! 🎉', {
            description: `Authentication successful! Welcome, ${data.session.user.email}!`
          });
          
          // Redirect to the intended page or homepage
          const redirectTo = localStorage.getItem('auth_redirect') || '/';
          localStorage.removeItem('auth_redirect');
          
          console.log('🔄 Redirecting to:', redirectTo);
          
          // Small delay to ensure auth state is updated
          setTimeout(() => {
            navigate(redirectTo);
          }, 1000);
        } else {
          console.log('ℹ️ No session found in callback, checking URL params...');
          
          // Try to handle the OAuth response manually
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const searchParams = new URLSearchParams(window.location.search);
          
          console.log('🔍 Hash params:', Object.fromEntries(hashParams));
          console.log('🔍 Search params:', Object.fromEntries(searchParams));
          
          // If we have OAuth params but no session, there might be an issue
          if (hashParams.get('access_token') || searchParams.get('code')) {
            console.log('⚠️ OAuth params found but no session - waiting for Supabase to process...');
            
            // Wait a bit longer for Supabase to process the OAuth response
            setTimeout(async () => {
              const { data: retryData, error: retryError } = await supabase.auth.getSession();
              
              if (retryData.session) {
                console.log('✅ Session found on retry');
                navigate('/');
              } else {
                console.log('❌ Still no session after retry');
                toast.error('Authentication incomplete', {
                  description: 'Please try signing in again'
                });
                navigate('/login');
              }
            }, 2000);
          } else {
            console.log('❌ No OAuth params found');
            navigate('/login');
          }
        }
      } catch (error) {
        console.error('❌ Unexpected auth callback error:', error);
        toast.error('Authentication error', {
          description: 'An unexpected error occurred during authentication'
        });
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white text-lg">Completing authentication...</p>
        <p className="text-gray-300 text-sm mt-2">Please wait while we sign you in...</p>
        <p className="text-gray-400 text-xs mt-4">If this takes too long, please try refreshing the page</p>
      </div>
    </div>
  );
};

export default AuthCallback;
