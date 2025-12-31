import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type Community = Database['public']['Tables']['communities']['Row']
type CommunityInsert = Database['public']['Tables']['communities']['Insert']
type CommunityUpdate = Database['public']['Tables']['communities']['Update']

type Submission = Database['public']['Tables']['submissions']['Row']
type SubmissionInsert = Database['public']['Tables']['submissions']['Insert']
type SubmissionUpdate = Database['public']['Tables']['submissions']['Update']

export const useSupabase = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Communities functions
  const getCommunities = async (filters?: {
    platform?: string
    category?: string
    isVerified?: boolean
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('communities')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.platform) {
        query = query.eq('platform', filters.platform)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.isVerified !== undefined) {
        query = query.eq('is_verified', filters.isVerified)
      }

      const { data, error } = await query
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const getCommunityById = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createCommunity = async (community: CommunityInsert) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert(community)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCommunity = async (id: string, updates: CommunityUpdate) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('communities')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCommunity = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('communities')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Submissions functions
  const getSubmissions = async (status?: 'pending' | 'approved' | 'rejected') => {
    setLoading(true)
    setError(null)
    
    try {
      let query = supabase
        .from('submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error } = await query
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const createSubmission = async (submission: SubmissionInsert) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .insert(submission)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateSubmissionStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('submissions')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteSubmission = async (id: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('submissions')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    // Communities
    getCommunities,
    getCommunityById,
    createCommunity,
    updateCommunity,
    deleteCommunity,
    // Submissions
    getSubmissions,
    createSubmission,
    updateSubmissionStatus,
    deleteSubmission,
  }
} 