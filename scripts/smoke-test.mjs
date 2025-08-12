import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@cryptoboost.world';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'CryptoAdmin2024!';

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, {
  auth: { persistSession: false },
});

async function main() {
  const results = [];
  const push = (name, ok, extra) => results.push({ name, ok, extra });

  // 1) Connectivity: plans
  try {
    const { data, error } = await supabase.from('investment_plans').select('*').limit(1);
    push('select investment_plans', !error, error || (data && data.length + ' row(s)'));
  } catch (e) { push('select investment_plans', false, e.message); }

  // 2) Connectivity: wallets
  try {
    const { data, error } = await supabase.from('crypto_wallets').select('*').limit(1);
    push('select crypto_wallets', !error, error || (data && data.length + ' row(s)'));
  } catch (e) { push('select crypto_wallets', false, e.message); }

  // 3) RPC dashboard stats
  try {
    const { data, error } = await supabase.rpc('get_dashboard_stats');
    push('rpc get_dashboard_stats', !error && !!data, error || JSON.stringify(data));
  } catch (e) { push('rpc get_dashboard_stats', false, e.message); }

  // 4) Auth sign-in admin
  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    if (error) throw error;
    push('auth signIn admin', !!data?.user, data?.user?.email);

    // 5) After auth: read transactions pending (should pass for admin)
    const { data: txs, error: txErr } = await supabase.from('transactions').select('*').eq('status', 'pending').limit(5);
    push('select transactions (pending)', !txErr, txErr || (txs && txs.length + ' row(s)'));

    // 6) Read users list (admin access)
    const { data: users, error: uErr } = await supabase.from('users').select('*').limit(5);
    push('select users', !uErr, uErr || (users && users.length + ' row(s)'));
  } catch (e) { push('auth signIn admin', false, e.message); }

  // Output
  let ok = true;
  for (const r of results) {
    const status = r.ok ? 'OK' : 'FAIL';
    console.log(`${status} - ${r.name}${r.extra ? ' - ' + r.extra : ''}`);
    if (!r.ok) ok = false;
  }

  process.exit(ok ? 0 : 2);
}

main();