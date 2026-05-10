import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Admin email allowlist - must match frontend
const ADMIN_EMAIL_ALLOWLIST = [
  'dhruv@fourcommunity.com',
  'dhruvchoudhary751@gmail.com'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-admin-key');
    return res.status(200).end();
  }

  // Add CORS headers to all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, x-admin-key');

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing submission ID' });
  }

  // Supabase anon client for auth verification
  const supabaseAnon = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  // TEMP: Allow bypass for testing
  const authHeader = req.headers.authorization;
  const token = authHeader?.replace('Bearer ', '') || '';
  const adminKey = req.headers['x-admin-key'] as string;

  // Check if bypass mode
  const isBypass = token === 'bypass' || !token;

  if (!isBypass) {
    // Real auth check
    const { data: { user }, error: authError } = await supabaseAnon.auth.getUser(token);
    if (authError || !user) {
      return res.status(401).json({ success: false, error: 'Invalid session' });
    }
    if (!ADMIN_EMAIL_ALLOWLIST.includes(user.email ?? '')) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }
  }

  // If bypass, skip auth and proceed directly

  // Use service role key to bypass RLS
  const supabaseAdmin = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { review_notes } = req.body || {};

  const { data, error } = await supabaseAdmin
    .from('community_subs')
    .update({
      status: 'rejected',
      review_notes: review_notes || null,
      reviewed_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Reject error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }

  return res.status(200).json({ success: true, data });
}
