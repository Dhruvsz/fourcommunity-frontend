import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// Admin email allowlist - must match frontend
const ADMIN_EMAIL_ALLOWLIST = [
  'dhruv@fourcommunity.com',
  'dhruvchoudhary751@gmail.com'
];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Missing submission ID' });
  }

  // Get the user's JWT from Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Missing authorization token' });
  }
  const token = authHeader.replace('Bearer ', '');

  // Verify the user's session using anon client
  const supabaseAnon = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  );

  const { data: { user }, error: authError } = await supabaseAnon.auth.getUser(token);

  if (authError || !user) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session' });
  }

  // Check admin email allowlist
  if (!ADMIN_EMAIL_ALLOWLIST.includes(user.email ?? '')) {
    return res.status(403).json({ success: false, error: 'Not authorized' });
  }

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
