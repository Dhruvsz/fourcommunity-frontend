import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Safe Supabase initialization - don't crash if env vars are missing
let supabase: any = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables missing. Some features may not work.');
  console.warn('Required: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  
  // Create a mock client that won't crash the app
  supabase = {
    auth: {
      signInWithOAuth: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } })
    },
    from: () => ({
      select: () => Promise.resolve({ data: [], error: new Error('Supabase not configured') }),
      insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
      delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
    })
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

export type Database = {
  public: {
    Tables: {
      community_subs: {
        Row: {
          id: string
          community_name: string
          platform: string
          category: string
          short_description: string
          long_description: string
          join_link: string
          join_type?: string
          price_inr?: number | null
          owner_id?: string | null
          founder_name: string
          founder_bio: string | null
          show_founder_info: boolean
          logo_url: string | null
          status: string
          review_notes: string | null
          reviewed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          community_name: string
          platform: string
          category: string
          short_description: string
          long_description: string
          join_link: string
          join_type?: string
          price_inr?: number | null
          owner_id?: string | null
          founder_name: string
          founder_bio?: string | null
          show_founder_info: boolean
          logo_url?: string | null
          status?: string
          review_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          community_name?: string
          platform?: string
          category?: string
          short_description?: string
          long_description?: string
          join_link?: string
          join_type?: string
          price_inr?: number | null
          owner_id?: string | null
          founder_name?: string
          founder_bio?: string | null
          show_founder_info?: boolean
          logo_url?: string | null
          status?: string
          review_notes?: string | null
          reviewed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      communities: {
        Row: {
          id: number
          name: string
          platform: string
          category: string
          description: string
          join_link: string
          member_count: number | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          platform: string
          category: string
          description: string
          join_link: string
          member_count?: number | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          platform?: string
          category?: string
          description?: string
          join_link?: string
          member_count?: number | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      submissions: {
        Row: {
          id: number
          community_name: string
          platform: string
          category: string
          description: string
          join_link: string
          founder_name: string
          founder_bio: string | null
          show_founder_info: boolean
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          community_name: string
          platform: string
          category: string
          description: string
          join_link: string
          founder_name: string
          founder_bio?: string | null
          show_founder_info: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          community_name?: string
          platform?: string
          category?: string
          description?: string
          join_link?: string
          founder_name?: string
          founder_bio?: string | null
          show_founder_info?: boolean
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          provider: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          provider?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}