import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

// Admin email allowlist - only these emails have admin access
const ADMIN_EMAIL_ALLOWLIST = [
  "dhruv@fourcommunity.com",
  "dhruvchoudhary751@gmail.com"
];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userProfile: UserProfile | null;
  loading: boolean;
  profileLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Fetch user profile data (simplified - no longer needed for admin check)
  const fetchUserProfile = async (userId: string) => {
    try {
      setProfileLoading(true);
      console.log('🔍 Fetching user profile for:', userId);
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Profile fetch timeout')), 5000)
      );
      
      const fetchPromise = supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const { data, error } = await Promise.race([fetchPromise, timeoutPromise]);

      if (error) {
        console.error('❌ Error fetching user profile:', error);
        // Set a basic profile - admin status is now email-based, not DB-based
        setUserProfile({
          id: userId,
          email: '',
          full_name: null,
          avatar_url: null,
          provider: null,
          is_admin: false, // This field is now ignored
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        return null;
      }

      console.log('✅ User profile fetched:', data);
      setUserProfile(data);
      return data;
    } catch (err) {
      console.error('❌ Exception fetching user profile:', err);
      // Set a basic profile - admin status is now email-based, not DB-based
      setUserProfile({
        id: userId,
        email: '',
        full_name: null,
        avatar_url: null,
        provider: null,
        is_admin: false, // This field is now ignored
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔐 Starting Google OAuth sign in...');
      
      // Use /auth/callback route for OAuth redirect
      const redirectUrl = `${window.location.origin}/auth/callback`;
      console.log('🔗 Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error('❌ Google OAuth error:', error);
        setError(`Google sign-in failed: ${error.message}`);
        throw error;
      }

      console.log('✅ Google OAuth initiated successfully');
      // Note: The actual sign-in completion happens in the callback
      
    } catch (err: any) {
      console.error('❌ Google sign-in exception:', err);
      setError(`Google sign-in failed: ${err.message || 'Unknown error'}`);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshSession = async () => {
    try {
      console.log('🔄 Refreshing session...');
      const { data: { session: newSession }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('❌ Session refresh error:', error);
        setError(`Session refresh failed: ${error.message}`);
      } else if (newSession) {
        console.log('✅ Session refreshed successfully:', newSession.user.email);
        setSession(newSession);
        setUser(newSession.user);
        
        // Store user data in localStorage
        localStorage.setItem('user_data', JSON.stringify({
          id: newSession.user.id,
          email: newSession.user.email,
          name: newSession.user.user_metadata?.full_name,
          avatar: newSession.user.user_metadata?.avatar_url,
          timestamp: new Date().toISOString()
        }));
      }
    } catch (err) {
      console.error('❌ Session refresh exception:', err);
      setError(`Session refresh exception: ${err}`);
    }
  };



  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚪 Starting sign out...');
      
      // Add timeout for sign out operation - max 3 seconds
      const timeoutPromise = new Promise<{ error: any }>((_, reject) => 
        setTimeout(() => reject(new Error('Sign out timeout')), 3000)
      );
      
      const result = await Promise.race([supabase.auth.signOut(), timeoutPromise]);
      const error = result.error;
      
      if (error) {
        console.error('❌ Sign out error:', error);
        setError(`Sign out failed: ${error.message}`);
        toast.error('Sign out failed', { description: error.message });
      } else {
        console.log('✅ User signed out successfully');
      }
      
      // Always clear state regardless of API response
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setError(null);
      
      // Clear stored data
      localStorage.removeItem('user_data');
      localStorage.removeItem('oauth_state');
      
      toast.success('Signed out successfully');
      
      // Immediate redirect without delay
      window.location.href = '/';
      
    } catch (err) {
      console.error('❌ Sign out exception:', err);
      
      // Force sign out even if API fails
      setUser(null);
      setSession(null);
      setUserProfile(null);
      setError(null);
      localStorage.removeItem('user_data');
      localStorage.removeItem('oauth_state');
      
      toast.success('Signed out (forced)');
      window.location.href = '/';
    } finally {
      setLoading(false);
    }
  };

  // Initialize auth state and handle session changes
  useEffect(() => {
    let mounted = true;
    
    // Add timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 3000);

    // Add timeout to prevent infinite profile loading
    const profileTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⏰ Profile loading timeout - forcing profileLoading to false');
        setProfileLoading(false);
      }
    }, 8000);

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (error) {
          console.error('❌ Initial session error:', error);
          setError(error.message);
        } else if (session) {
          console.log('✅ Initial session found:', session.user.email);
          setSession(session);
          setUser(session.user);
          // Fetch user profile for initial session
          await fetchUserProfile(session.user.id);
        } else {
          console.log('ℹ️ No initial session found');
        }
      } catch (err) {
        console.error('❌ Session initialization error:', err);
      } finally {
        if (mounted) {
          console.log('🔄 Setting loading to false');
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth state change:', event, session?.user?.email || 'None');
        setLoading(false); // Ensure loading is false on any auth state change
        
        if (event === 'SIGNED_IN' && session) {
          console.log('✅ User signed in:', session.user.email);
          setSession(session);
          setUser(session.user);
          setError(null);
          
          // Fetch user profile data
          await fetchUserProfile(session.user.id);
          
          // Check if this is a new user (just signed up) or existing user (logging in)
          const isNewUser = session.user.created_at && 
            new Date(session.user.created_at).getTime() > Date.now() - 60000; // Within last minute
          
          if (isNewUser) {
            // Set flag for new signups to trigger onboarding nudge
            localStorage.setItem('justSignedUp', 'true');
          } else {
            // Set flag for existing users logging in to trigger onboarding nudge
            localStorage.setItem('justLoggedIn', 'true');
          }
          
          // Store user data
          localStorage.setItem('user_data', JSON.stringify({
            id: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name,
            avatar: session.user.user_metadata?.avatar_url,
            timestamp: new Date().toISOString()
          }));
          
          // Create or update user profile (simplified - admin status is email-based now)
          try {
            const provider = session.user.app_metadata?.provider || 'email';
            
            // First, check if profile already exists
            const { data: existingProfile, error: checkError } = await supabase
              .from('user_profiles')
              .select('id, created_at')
              .eq('id', session.user.id)
              .single();

            if (checkError && checkError.code !== 'PGRST116') {
              console.error('Error checking existing profile:', checkError);
            }

            if (existingProfile) {
              // Profile exists, update only (preserve created_at)
              const { error: updateError } = await supabase
                .from('user_profiles')
                .update({
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                  avatar_url: session.user.user_metadata?.avatar_url || null,
                  provider: provider,
                  updated_at: new Date().toISOString()
                  // Note: is_admin field is ignored - admin status is email-based
                })
                .eq('id', session.user.id);

              if (updateError) {
                console.error('Profile update error:', updateError);
              } else {
                console.log(`User profile updated for ${provider} user`);
                // Refetch profile after update
                await fetchUserProfile(session.user.id);
              }
            } else {
              // Profile doesn't exist, create new one
              const { error: insertError } = await supabase
                .from('user_profiles')
                .insert([
                  {
                    id: session.user.id,
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || '',
                    avatar_url: session.user.user_metadata?.avatar_url || null,
                    provider: provider,
                    is_admin: false, // This field is now ignored - admin status is email-based
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                  }
                ]);

              if (insertError) {
                console.error('Profile insert error:', insertError);
              } else {
                console.log(`User profile created for ${provider} user`);
                // Fetch the newly created profile
                await fetchUserProfile(session.user.id);
              }
            }
          } catch (err) {
            console.error('Profile management exception:', err);
          }
          
          toast.success('Authentication successful!', {
            description: `Welcome, ${session.user.email}!`
          });
        }
        
        if (event === 'SIGNED_OUT') {
          console.log('🚪 User signed out');
          setSession(null);
          setUser(null);
          setUserProfile(null);
          setError(null);
          
          // Clear stored data
          localStorage.removeItem('user_data');
          localStorage.removeItem('oauth_state');
          
          toast.success('Signed out successfully');
        }

        if (event === 'TOKEN_REFRESHED' && session) {
          console.log('🔄 Token refreshed');
          setSession(session);
          setUser(session.user);
        }

        if (event === 'USER_UPDATED' && session) {
          console.log('👤 User updated');
          setSession(session);
          setUser(session.user);
        }

        if (event === 'INITIAL_SESSION') {
          console.log('🔍 Initial session check completed');
          if (session) {
            setSession(session);
            setUser(session.user);
          }
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(loadingTimeout);
      clearTimeout(profileTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    session,
    userProfile,
    loading,
    profileLoading,
    isAuthenticated: !!user,
    isAdmin: ADMIN_EMAIL_ALLOWLIST.includes(user?.email ?? ""),
    signInWithGoogle,
    signOut,
    refreshSession,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
