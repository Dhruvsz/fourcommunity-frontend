import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

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