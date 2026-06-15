import { createClient } from '@supabase/supabase-js';

const supabasePayments = createClient(
  import.meta.env.VITE_SUPABASE_PAYMENTS_URL!,
  import.meta.env.VITE_SUPABASE_PAYMENTS_ANON_KEY!
);

const supabaseMain = createClient(
  import.meta.env.VITE_SUPABASE_URL!,
  import.meta.env.VITE_SUPABASE_ANON_KEY!
);

export interface WalletLedgerEntry {
  id: string;
  user_id: string;
  community_id?: string;
  transaction_type: 'credit' | 'debit';
  amount: number;
  currency: 'INR';
  description: string;
  reference_id?: string;
  metadata?: Record<string, any>;
  created_at: string;
  processed_at?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface WalletBalance {
  user_id: string;
  balance: number;
  total_earned: number;
  pending_payout: number;
  last_updated: string;
}

export interface UserCommunity {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

class WalletService {
  // Check if user has approved communities
  async hasApprovedCommunities(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabaseMain
        .from('community_subs')
        .select('id')
        .eq('status', 'approved')
        .limit(1);
      return !error && data && data.length > 0;
    } catch (error) {
      console.error('Error checking approved communities:', error);
      return false;
    }
  }

  // Get user's communities
  async getUserCommunities(userId: string): Promise<UserCommunity[]> {
    try {
      const { data, error } = await supabaseMain
        .from('community_subs')
        .select('id, community_name, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(c => ({
        id: c.id,
        name: c.community_name,
        status: c.status,
        created_at: c.created_at
      }));
    } catch (error) {
      console.error('Error fetching user communities:', error);
      return [];
    }
  }

  // Get real wallet balance from Supabase Project B
  async calculateWalletBalance(userId: string): Promise<WalletBalance> {
    try {
      // Get all communities owned by this user from Project A
      const { data: communities } = await supabaseMain
        .from('community_subs')
        .select('id');

      if (!communities || communities.length === 0) {
        return {
          user_id: userId,
          balance: 0,
          total_earned: 0,
          pending_payout: 0,
          last_updated: new Date().toISOString()
        };
      }

      const communityIds = communities.map(c => c.id);

      // Get wallet data from Project B
      const { data: wallets, error } = await supabasePayments
        .from('admin_wallets')
        .select('balance, total_earned')
        .in('community_id', communityIds);

      if (error) throw error;

      // Sum up all wallet balances
      const totalBalance = (wallets || []).reduce((sum, w) => sum + (w.balance || 0), 0);
      const totalEarned = (wallets || []).reduce((sum, w) => sum + (w.total_earned || 0), 0);

      // Convert rupees to paisa for display
      return {
        user_id: userId,
        balance: totalBalance * 100,
        total_earned: totalEarned * 100,
        pending_payout: totalBalance * 100,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating wallet balance:', error);
      return {
        user_id: userId,
        balance: 0,
        total_earned: 0,
        pending_payout: 0,
        last_updated: new Date().toISOString()
      };
    }
  }

  // Get real payment history from Project B
  async getLedgerHistory(userId: string, limit: number = 50): Promise<WalletLedgerEntry[]> {
    try {
      const { data, error } = await supabasePayments
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return (data || []).map(p => ({
        id: p.id,
        user_id: p.user_id,
        community_id: p.community_id,
        transaction_type: 'credit' as const,
        amount: p.amount,
        currency: 'INR' as const,
        description: `Payment for community`,
        reference_id: p.razorpay_payment_id,
        created_at: p.created_at,
        status: p.status === 'captured' ? 'completed' as const : 'pending' as const
      }));
    } catch (error) {
      console.error('Error fetching ledger history:', error);
      return [];
    }
  }

  // Format amount from paisa to rupees
  formatAmount(amountInPaisa: number): string {
    const rupees = amountInPaisa / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rupees);
  }

  rupeesToPaisa(rupees: number): number {
    return Math.round(rupees * 100);
  }

  paisaToRupees(paisa: number): number {
    return paisa / 100;
  }
}

export const walletService = new WalletService();
