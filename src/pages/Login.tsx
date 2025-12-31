import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !loading) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, location]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Missing Information', {
        description: 'Please fill in all required fields.'
      });
      return;
    }

    setIsLoading(true);

    try {
      console.log('🚀 Starting login process...');
      console.log('📧 Email:', formData.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password
      });

      console.log('📊 Supabase signIn response:', { data, error });

      if (error) {
        console.error('❌ Login error details:', error);
        
        let errorMessage = 'Invalid email or password.';
        
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Please check your email and click the confirmation link before signing in.';
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message.includes('Too many requests')) {
          errorMessage = 'Too many login attempts. Please wait a moment and try again.';
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        toast.error('Login Failed', { 
          description: errorMessage
        });
      } else if (data.session && data.user) {
        console.log('✅ Login successful:', data.user.email);
        console.log('📋 Session:', data.session);
        
        toast.success('Welcome back! 🎉', {
          description: 'You have been successfully logged in.'
        });
        
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        console.error('❌ No session or user data returned');
        toast.error('Login Failed', {
          description: 'Login failed. Please try again.'
        });
      }
    } catch (error: any) {
      console.error('Unexpected login error:', error);
      toast.error('Login Error', {
        description: 'Something went wrong. Please try again.'
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
                    console.log('🔐 Starting Google OAuth sign in...');
                    
                    // Check if Google Client ID is configured
                    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
                    if (!googleClientId || googleClientId === 'your_google_client_id_here') {
                      toast.error('Google Sign-In Not Configured', {
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
                      toast.error('Google Sign-In Failed', {
                        description: error.message
                      });
                    } else {
                      console.log('✅ Google OAuth initiated successfully');
                    }
                  } catch (err: any) {
                    console.error('❌ Google sign-in exception:', err);
                    toast.error('Google Sign-In Failed', {
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
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
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
                  <span className="px-2 bg-white/5 text-gray-400">Or continue with email</span>
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
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

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </>
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Sign Up Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-blue-400 font-medium hover:text-blue-300 hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>

              {/* Security Note */}
              <p className="text-xs text-gray-500 text-center mt-4 leading-relaxed">
                By continuing, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
