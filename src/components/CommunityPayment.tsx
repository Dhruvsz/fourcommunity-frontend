import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Community } from '@/types/community';

// BUG 3: Separate Supabase client for payments project (Project B)
const supabasePayments = createClient(
  import.meta.env.VITE_SUPABASE_PAYMENTS_URL,
  import.meta.env.VITE_SUPABASE_PAYMENTS_ANON_KEY
);

interface CommunityPaymentProps {
  community: Community;
  communityId: string;
}

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const CommunityPayment: React.FC<CommunityPaymentProps> = ({ community, communityId }) => {
  console.log('🔧 CommunityPayment rendered', { community: community.name, communityId, joinType: community.joinType });
  
  const { user, isAuthenticated } = useAuth();
  const [membershipStatus, setMembershipStatus] = useState<'loading' | 'active' | 'inactive'>('loading');
  const [payLoading, setPayLoading] = useState(false);

  // Check membership status when user or community changes
  useEffect(() => {
    const checkMembershipStatus = async () => {
      console.log('🔍 Checking membership status...', { isAuthenticated, userId: user?.id, communityId });
      
      if (!isAuthenticated || !user) {
        console.log('❌ User not authenticated, setting inactive');
        setMembershipStatus('inactive');
        return;
      }

      try {
        console.log('🔍 Checking membership status for user:', user.id, 'community:', communityId);
        
        const { data, error } = await supabasePayments
          .from('community_memberships')
          .select('status')
          .eq('user_id', user.id)
          .eq('community_id', communityId)
          .eq('status', 'active')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('❌ Error checking membership:', error);
          setMembershipStatus('inactive');
          return;
        }

        if (data) {
          console.log('✅ Active membership found');
          setMembershipStatus('active');
        } else {
          console.log('ℹ️ No active membership found');
          setMembershipStatus('inactive');
        }
      } catch (err) {
        console.error('❌ Membership check exception:', err);
        setMembershipStatus('inactive');
      }
    };

    checkMembershipStatus();
  }, [user, isAuthenticated, communityId]);

  const loadRazorpay = async () => {
    if (window.Razorpay) return true;

    return await new Promise<boolean>((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayAndJoin = async () => {
    console.log('💳 Pay & Join clicked!', { user: user?.id, isAuthenticated, community: community.name, joinType: community.joinType });
    
    if (!community || !user || !isAuthenticated) {
      console.log('❌ Early return - missing requirements:', { community: !!community, user: !!user, isAuthenticated });
      return;
    }
    
    // Only proceed if it's a paid community
    if (community.joinType !== 'paid' || typeof community.priceInr !== 'number') {
      console.log('❌ Early return - not a paid community:', { joinType: community.joinType, priceInr: community.priceInr });
      return;
    }

    try {
      setPayLoading(true);
      console.log('🚀 Starting payment flow...');

      // Load Razorpay script
      const ok = await loadRazorpay();
      if (!ok || !window.Razorpay) {
        toast.error('Unable to start checkout', { 
          description: 'Razorpay failed to load. Please try again.' 
        });
        setPayLoading(false);
        return;
      }

      console.log('💳 Creating payment order for user:', user.id, 'community:', communityId);

      // BUG 4: Always use VITE_API_URL, never fall back to localhost
      const apiUrl = import.meta.env.VITE_API_URL;
      if (!apiUrl) {
        toast.error('API URL not configured', {
          description: 'VITE_API_URL environment variable is missing.'
        });
        setPayLoading(false);
        return;
      }
      const requestUrl = `${apiUrl}/create-payment`;

      const orderRes = await fetch(requestUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          community_id: communityId,
          amount: community.priceInr * 100 // Convert to paisa
        }),
      });

      console.log('📦 Backend response status:', orderRes.status);

      // Handle case where backend endpoint doesn't exist yet
      if (orderRes.status === 404) {
        toast.error('Backend not ready', { 
          description: 'The /create-payment endpoint is not implemented yet. Please start the backend with this endpoint.' 
        });
        setPayLoading(false);
        return;
      }

      const orderData = await orderRes.json();
      console.log('📦 Backend response:', orderData);

      if (!orderRes.ok || !orderData?.order?.id) {
        const message = orderData?.error || 'Unable to create payment order.';
        toast.error('Checkout failed', { description: message });
        setPayLoading(false);
        return;
      }

      // BUG 2: Use env var instead of hardcoded Razorpay test key
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: community.priceInr * 100, // Amount in paisa
        currency: 'INR',
        name: 'FourCommunity',
        description: `Join ${community.name}`,
        order_id: orderData.order.id,
        handler: (response: any) => {
          console.log('✅ Payment successful:', response);
          toast.success('Payment successful!', {
            description: 'Access will be granted shortly.'
          });
          
          // Refresh membership status after successful payment
          setTimeout(() => {
            setMembershipStatus('loading');
            // The membership check will run again due to useEffect
          }, 2000);
        },
        modal: {
          ondismiss: () => {
            console.log('❌ Payment cancelled by user');
            toast.message('Payment cancelled');
          },
        },
        prefill: {
          name: user.user_metadata?.full_name || user.email,
          email: user.email,
        },
        notes: {
          community_id: communityId,
          user_id: user.id,
        },
        theme: {
          color: '#2563eb',
        },
      };

      // Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
      setPayLoading(false);

    } catch (error: any) {
      console.error('❌ Payment error:', error);
      toast.error('Checkout failed', { 
        description: error?.message || 'Something went wrong' 
      });
      setPayLoading(false);
    }
  };

  // Show loading state while checking membership
  if (membershipStatus === 'loading') {
    return (
      <div className="space-y-4">
        <p className="text-base text-gray-300 leading-relaxed">
          Checking access status...
        </p>
        <Button disabled className="w-full py-6 text-lg font-medium">
          Loading...
        </Button>
      </div>
    );
  }

  // User not logged in
  if (!isAuthenticated) {
    return (
      <div className="space-y-4">
        <p className="text-base text-gray-300 leading-relaxed">
          Please login to join this community.
        </p>
        <Button disabled className="w-full py-6 text-lg font-medium opacity-50">
          Please login to continue
        </Button>
      </div>
    );
  }

  // User has active membership
  if (membershipStatus === 'active') {
    return (
      <div className="space-y-4">
        <p className="text-base text-green-300 leading-relaxed">
          ✅ You have access to this community!
        </p>
        {community.joinType === 'free' && community.joinLink ? (
          <Button asChild className="w-full py-6 text-lg font-medium shadow-lg hover:shadow-primary/20">
            <a 
              href={community.joinLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center justify-center"
            >
              Join Community
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        ) : (
          <Button className="w-full py-6 text-lg font-medium shadow-lg hover:shadow-primary/20">
            Access Granted
          </Button>
        )}
      </div>
    );
  }

  // User needs to pay or join
  console.log('🎯 Rendering final state:', { 
    isAuthenticated, 
    membershipStatus, 
    joinType: community.joinType, 
    priceInr: community.priceInr,
    userId: user?.id 
  });
  
  return (
    <div className="space-y-4">
      <p className="text-base text-gray-300 leading-relaxed">
        Get instant access to this community and connect with like-minded people.
      </p>

      {community.joinType === 'paid' && typeof community.priceInr === 'number' ? (
        <Button
          onClick={handlePayAndJoin}
          disabled={payLoading}
          className="w-full py-6 text-lg font-medium shadow-lg hover:shadow-primary/20"
        >
          {payLoading ? 'Starting payment…' : `Pay & Join for ₹${community.priceInr}`}
        </Button>
      ) : (
        <Button asChild className="w-full py-6 text-lg font-medium shadow-lg hover:shadow-primary/20">
          <a 
            href={community.joinLink || "#"} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center justify-center"
          >
            Join Community
            <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
};

export default CommunityPayment;