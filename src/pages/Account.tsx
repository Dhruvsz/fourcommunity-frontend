import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Calendar, LogOut, Shield, Settings, Edit3, Wallet } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { formatDateDDMMYYYY, useDynamicRelativeTime } from '@/lib/dateUtils';
import { walletService, WalletBalance } from '@/lib/walletService';

const Account = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, signOut } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [userStats, setUserStats] = useState({
    submissionsCount: 0,
    joinedDate: null as string | null
  });
  const [walletData, setWalletData] = useState<WalletBalance | null>(null);
  const [showWallet, setShowWallet] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { 
        state: { from: { pathname: '/account' } },
        replace: true 
      });
    }
  }, [isAuthenticated, loading, navigate]);

  // Fetch user statistics and wallet data
  useEffect(() => {
    const fetchUserStats = async () => {
      if (!user) return;

      try {
        // Get submissions count
        const { count } = await supabase
          .from('submissions')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        // Get user profile with creation date
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('created_at')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching user profile:', profileError);
        }

        setUserStats({
          submissionsCount: count || 0,
          joinedDate: profileData?.created_at || user.created_at || null
        });

        // Check wallet data for all users (always show wallet for now)
        setShowWallet(true);
        const walletBalance = await walletService.calculateWalletBalance(user.id);
        setWalletData(walletBalance);
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    if (user) {
      fetchUserStats();
    }
  }, [user]);


  // Use dynamic relative time hook
  const relativeTime = useDynamicRelativeTime(userStats.joinedDate);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen font-sf-pro">
        <Navbar />
        <div className="flex-1 bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Loading your account...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect via useEffect
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

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 pt-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-white mb-4">
                My Account
              </h1>
              <p className="text-gray-400 text-lg">
                Manage your profile and account settings
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Profile Card */}
              <div className="lg:col-span-2">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
                  <div className="flex items-start justify-between mb-8">
                    <h2 className="text-2xl font-bold text-white">Profile Information</h2>
                    <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                      <Edit3 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    {user.user_metadata?.avatar_url ? (
                      <img
                        src={user.user_metadata.avatar_url}
                        alt="Profile"
                        className="w-20 h-20 rounded-full border-2 border-white/20"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-10 h-10 text-white" />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {user.user_metadata?.full_name || user.user_metadata?.display_name || 'User'}
                      </h3>
                      <p className="text-gray-400 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </p>
                      {user.email_confirmed_at && (
                        <p className="text-green-400 text-sm mt-1 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Email Verified
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <span className="text-gray-400">Member Since</span>
                      </div>
                      <div className="space-y-1">
                        <p className="text-white font-semibold">
                          {formatDateDDMMYYYY(userStats.joinedDate)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {relativeTime}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                      <div className="flex items-center gap-3 mb-2">
                        <Settings className="w-5 h-5 text-purple-400" />
                        <span className="text-gray-400">Submissions</span>
                      </div>
                      <p className="text-white font-semibold">
                        {userStats.submissionsCount} Groups
                      </p>
                    </div>
                  </div>

                  {/* Wallet Section - Only show if user has approved communities */}
                  {showWallet && walletData && (
                    <div className="mt-8">
                      <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center gap-3">
                            <Wallet className="w-5 h-5 text-green-400" />
                            <span className="text-gray-400">Wallet</span>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                              {walletService.formatAmount(walletData.balance)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Wallet Balance</p>
                            <p className="text-white font-semibold">
                              {walletService.formatAmount(walletData.balance)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Total Earned</p>
                            <p className="text-white font-semibold">
                              {walletService.formatAmount(walletData.total_earned)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm mb-1">Pending Payout</p>
                            <p className="text-white font-semibold">
                              {walletService.formatAmount(walletData.pending_payout)}
                            </p>
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            // Future: Navigate to detailed wallet page
                            toast.info('Coming Soon', {
                              description: 'Detailed wallet view is coming soon!'
                            });
                          }}
                          className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                        >
                          View Wallet →
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Card */}
              <div className="space-y-6">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
                  
                  <div className="space-y-4">
                    <button
                      onClick={() => navigate('/submit')}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-3 px-4 rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      Submit New Group
                    </button>
                    
                    <button
                      onClick={() => navigate('/communities')}
                      className="w-full bg-white/10 text-white font-medium py-3 px-4 rounded-xl hover:bg-white/20 transition-all duration-200 border border-white/20"
                    >
                      Browse Communities
                    </button>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6">Account Settings</h3>
                  
                  <div className="space-y-4">
                    <button className="w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-colors">
                      Change Password
                    </button>
                    
                    <button className="w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-colors">
                      Email Preferences
                    </button>
                    
                    <button className="w-full text-left text-gray-300 hover:text-white py-2 px-3 rounded-lg hover:bg-white/10 transition-colors">
                      Privacy Settings
                    </button>
                    
                    <hr className="border-white/20 my-4" />
                    
                    <button
                      onClick={() => {
                        setIsLoggingOut(true);
                        signOut().finally(() => setIsLoggingOut(false));
                      }}
                      disabled={isLoggingOut}
                      className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-300 py-2 px-3 rounded-lg hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoggingOut ? (
                        <>
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                          <span>Signing Out...</span>
                        </>
                      ) : (
                        <>
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Communities */}
            <div className="mt-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Your Communities</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Free Slot 1 */}
                  <button
                    onClick={() => navigate('/submit')}
                    className="group relative bg-gradient-to-br from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 min-h-[140px]">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="text-white font-medium text-lg">Add a community</span>
                    </div>
                  </button>

                  {/* Free Slot 2 */}
                  <button
                    onClick={() => navigate('/submit')}
                    className="group relative bg-gradient-to-br from-blue-500/10 to-purple-600/10 hover:from-blue-500/20 hover:to-purple-600/20 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02]"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 min-h-[140px]">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                      <span className="text-white font-medium text-lg">Add a community</span>
                    </div>
                  </button>

                  {/* Locked Premium Slot */}
                  <button
                    onClick={() => {
                      toast.info('Premium Feature', {
                        description: 'Premium subscription required to add more communities'
                      });
                    }}
                    className="group relative bg-gradient-to-br from-gray-500/10 to-gray-600/10 hover:from-gray-500/20 hover:to-gray-600/20 border border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-lg hover:shadow-gray-500/20 opacity-60 hover:opacity-80"
                  >
                    <div className="flex flex-col items-center justify-center gap-4 min-h-[140px]">
                      <div className="w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center relative">
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <span className="text-white font-medium text-lg">Add more communities</span>
                      <span className="text-xs text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20 mt-2">
                        Premium subscription required
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-12">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-6">Recent Activity</h3>
                
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <Settings className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-400 text-lg">No recent activity</p>
                  <p className="text-gray-500 text-sm mt-2">
                    Your recent submissions and interactions will appear here
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Account;
