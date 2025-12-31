// Wallet Service - Ledger-based accounting system
// Designed for Razorpay webhook integration and auditable transactions

export interface WalletLedgerEntry {
  id: string;
  user_id: string;
  community_id?: string;
  transaction_type: 'credit' | 'debit';
  amount: number; // Amount in paisa (₹1 = 100 paisa)
  currency: 'INR';
  description: string;
  reference_id?: string; // Razorpay payment ID, payout ID, etc.
  metadata?: Record<string, any>;
  created_at: string;
  processed_at?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface WalletBalance {
  user_id: string;
  balance: number; // Current balance in paisa
  total_earned: number; // Total earnings in paisa
  pending_payout: number; // Pending payout amount in paisa
  last_updated: string;
}

export interface UserCommunity {
  id: string;
  name: string;
  status: 'approved' | 'pending' | 'rejected';
  created_at: string;
}

class WalletService {
  // Check if user has approved communities (determines wallet visibility)
  async hasApprovedCommunities(userId: string): Promise<boolean> {
    try {
      // This would check the communities table for approved communities by this user
      // For now, return true for testing - replace with actual Supabase query
      
      // Mock logic: For demo purposes, show wallet for all users
      // In production, this should query the actual communities table
      return true; // Change to false to test hiding wallet
      
      // Real implementation would be:
      // const { data, error } = await supabase
      //   .from('communities')
      //   .select('id')
      //   .eq('founder_id', userId)
      //   .eq('status', 'approved')
      //   .limit(1);
      // 
      // return !error && data && data.length > 0;
    } catch (error) {
      console.error('Error checking approved communities:', error);
      return false;
    }
  }

  // Get user's approved communities
  async getUserCommunities(userId: string): Promise<UserCommunity[]> {
    try {
      // Mock data - replace with actual Supabase query
      return [
        {
          id: '1',
          name: 'Tech Enthusiasts',
          status: 'approved',
          created_at: new Date().toISOString()
        }
      ];
    } catch (error) {
      console.error('Error fetching user communities:', error);
      return [];
    }
  }

  // Calculate wallet balance from ledger entries (append-only, auditable)
  async calculateWalletBalance(userId: string): Promise<WalletBalance> {
    try {
      // This would query the ledger entries table and calculate balances
      // For now, return mock data - replace with actual Supabase aggregation
      
      const mockBalance: WalletBalance = {
        user_id: userId,
        balance: 345000, // ₹3,450 in paisa
        total_earned: 520000, // ₹5,200 in paisa  
        pending_payout: 175000, // ₹1,750 in paisa
        last_updated: new Date().toISOString()
      };

      return mockBalance;
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

  // Add ledger entry (for Razorpay webhooks, manual credits, etc.)
  async addLedgerEntry(entry: Omit<WalletLedgerEntry, 'id' | 'created_at'>): Promise<WalletLedgerEntry> {
    try {
      const ledgerEntry: WalletLedgerEntry = {
        ...entry,
        id: `ledger_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString()
      };

      // This would insert into the ledger_entries table
      // For now, just return the entry - replace with actual Supabase insert
      console.log('Adding ledger entry:', ledgerEntry);
      
      return ledgerEntry;
    } catch (error) {
      console.error('Error adding ledger entry:', error);
      throw error;
    }
  }

  // Get ledger history for a user
  async getLedgerHistory(userId: string, limit: number = 50): Promise<WalletLedgerEntry[]> {
    try {
      // This would query the ledger_entries table
      // For now, return mock data - replace with actual Supabase query
      return [];
    } catch (error) {
      console.error('Error fetching ledger history:', error);
      return [];
    }
  }

  // Format amount from paisa to rupees for display
  formatAmount(amountInPaisa: number): string {
    const rupees = amountInPaisa / 100;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(rupees);
  }

  // Convert rupees to paisa for storage
  rupeesToPaisa(rupees: number): number {
    return Math.round(rupees * 100);
  }

  // Convert paisa to rupees for calculations
  paisaToRupees(paisa: number): number {
    return paisa / 100;
  }
}

export const walletService = new WalletService();