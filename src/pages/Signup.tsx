import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Signup = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword) {
      toast.error('Missing Information', {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Password Mismatch', {
        description: 'Passwords do not match. Please try again.'
      });
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Weak Password', {
        description: 'Password must be at least 6 characters long.'
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Starting signup process...');
      console.log('📧 Email:', formData.email);
      console.log('👤 Full Name:', formData.fullName);
      
      const { data, error } = await supabase.auth.signUp({
        email: formData.email.trim(),
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName.trim(),
            display_name: formData.fullName.trim()
          }
        }
      });

      console.log('📊 Supabase signUp response:', { data, error });

      if (error) {
        console.error('❌ Supabase signUp error details:', error);
        console.error('❌ Error code:', error.status);
        console.error('❌ Error message:', error.message);
        
        let errorMessage = 'Failed to create account.';
        
        if (error.message.includes('already registered')) {
          errorMessage = 'This email is already registered. Please try logging in instead.';
        } else if (error.message.includes('Password')) {
          errorMessage = 'Password does not meet security requirements.';
        } else if (error.message.includes('Email')) {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.message.includes('rate limit')) {
          errorMessage = 'Too many signup attempts. Please wait a moment and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error('Signup Failed', { 
          description: errorMessage
        });
        return;
      }

      if (!data || !data.user) {
        console.error('❌ No user data returned from signup');
        toast.error('Signup Failed', {
          description: 'No user data received. Please try again.'
        });
        return;
      }

      console.log('✅ User created successfully:', data.user.email);
      console.log('📋 User ID:', data.user.id);
      console.log('📋 User metadata:', data.user.user_metadata);
      
      // Create user profile in the database
      console.log('🔄 Creating user profile...');
      try {
        const profileData = {
          id: data.user.id,
          email: data.user.email || '',
          full_name: formData.fullName.trim(),
          avatar_url: null,
          provider: 'email',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        console.log('📝 Profile data to insert:', profileData);
        
        const { data: profileResult, error: profileError } = await supabase
          .from('user_profiles')
          .insert([profileData])
          .select()
          .single();

        if (profileError) {
          console.error('❌ Profile creation error details:', profileError);
          console.error('❌ Profile error code:', profileError.code);
          console.error('❌ Profile error message:', profileError.message);
          
          let profileErrorMessage = 'Account created but profile setup failed.';
          
          if (profileError.message.includes('row-level security policy')) {
            profileErrorMessage = 'Profile creation blocked by security policy. Please contact support.';
          } else if (profileError.message.includes('duplicate key')) {
            profileErrorMessage = 'Profile already exists for this user.';
          } else if (profileError.message) {
            profileErrorMessage = `Profile error: ${profileError.message}`;
          }
          
          toast.error('Profile Creation Failed', {
            description: profileErrorMessage
          });
        } else {
          console.log('✅ User profile created successfully:', profileResult);
        }
      } catch (profileErr) {
        console.error('❌ Profile creation exception:', profileErr);
        toast.error('Profile Creation Error', {
          description: 'Unexpected error during profile creation.'
        });
      }
      
      // Set flag for new signups to trigger onboarding nudge
      localStorage.setItem('justSignedUp', 'true');
      
      toast.success('Account Created! 🎉', {
        description: 'You can now sign in with your credentials.'
      });
      
      // Redirect to login page with success message
      navigate('/login', { 
        state: { 
          message: 'Account created successfully! You can now sign in with your credentials.' 
        }
      });
      
    } catch (error: any) {
      console.error('❌ Unexpected signup error:', error);
      console.error('❌ Error stack:', error.stack);
      
      let unexpectedErrorMessage = 'Something went wrong. Please try again.';
      if (error.message) {
        unexpectedErrorMessage = `Unexpected error: ${error.message}`;
      }
      
      toast.error('Signup Error', {
        description: unexpectedErrorMessage
      });
    } finally {
      setIsLoading(false);
    }
  };



  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sf-pro">
        <Navbar />
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen font-sf-pro">
      <Navbar />
      <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,rgba(147,51,234,0.1),transparent_50%)]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-full px-4 py-12 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <img 
                  src="/logo-of-com.png" 
                  alt="FourCommunity Logo" 
                  className="w-16 h-16 mx-auto mb-4 object-contain"
                />
                
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome, human.
                </h1>
                
                <p className="text-gray-400">
                  Discover communities worth joining.
                </p>
              </div>



              {/* Google Sign-In Button */}
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  try {
                    setIsLoading(true);
                    console.log('🔐 Starting Google OAuth sign up...');
                    
                    // Check if Google Client ID is configured
                    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                    if (!googleClientId || googleClientId === 'your_google_client_id_here') {
                      toast.error('Google Sign-Up Not Configured', {
                        description: 'Google OAuth is not set up yet. Please configure Google Client ID in environment variables.'
                      });
                      return;
                    }
                    
                    const redirectUrl = `${import.meta.env.VITE_SITE_URL || window.location.origin}/auth/callback`;
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
                      toast.error('Google Sign-Up Failed', {
                        description: error.message
                      });
                    } else {
                      console.log('✅ Google OAuth initiated successfully');
                    }
                  } catch (err: any) {
                    console.error('❌ Google sign-up exception:', err);
                    toast.error('Google Sign-Up Failed', {
                      description: err.message || 'Unknown error'
                    });
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
                className="w-full bg-white text-gray-800 font-medium py-3 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                <span>
                  {isLoading ? 'Signing up...' : 'Continue with Google'}
                </span>
              </button>

              {/* Trust Note */}
              <p className="text-xs text-gray-400 text-center mt-3 mb-6">
                85% of our users prefer Google sign-up for fast, 1-click access.
              </p>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white/5 text-gray-400">Or create account with email</span>
                </div>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-white placeholder-gray-400"
                    required
                    minLength={6}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Login Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="text-blue-400 font-medium hover:text-blue-300 hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Signup;
