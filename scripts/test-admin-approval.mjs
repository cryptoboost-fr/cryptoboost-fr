#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!SUPABASE_URL || !SUPABASE_ANON) {
  console.error('Missing Supabase env. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
  process.exit(1);
}
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('Missing ADMIN_EMAIL / ADMIN_PASSWORD');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { persistSession: false } });

function logResult(label, ok, extra = '') {
  const status = ok ? 'PASS' : 'FAIL';
  console.log(`${status} - ${label}${extra ? ' - ' + extra : ''}`);
}

async function main() {
  console.log('== Admin Approval End-to-End Test ==');

  // Sign in as admin
  const { data: authRes, error: authErr } = await supabase.auth.signInWithPassword({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (authErr || !authRes?.user) {
    logResult('auth admin signIn', false, authErr?.message);
    process.exit(1);
  }
  logResult('auth admin signIn', true, authRes.user.id);

  const adminUserId = authRes.user.id;

  // Confirm admin role in public.users
  const { data: profile, error: profileErr } = await supabase
    .from('users')
    .select('id, role, total_invested')
    .eq('id', adminUserId)
    .single();
  if (profileErr || !profile) {
    logResult('fetch admin profile', false, profileErr?.message);
    process.exit(1);
  }
  const isAdmin = profile.role === 'admin';
  logResult('admin role check', isAdmin, `role=${profile.role}`);
  if (!isAdmin) {
    console.error('The provided credentials are not an admin. Aborting.');
    process.exit(1);
  }

  const baselineInvested = Number(profile.total_invested || 0);

  // Create a pending deposit transaction for the admin (safe due to typical RLS requiring user_id = auth.uid())
  const testTag = `TEST_APPROVAL_${Date.now()}`;
  const usdValue = 25;
  const insertPayload = {
    user_id: adminUserId,
    type: 'deposit',
    crypto_type: 'BTC',
    amount: 0.001,
    usd_value: usdValue,
    fee_amount: 0,
    wallet_address: null,
    transaction_hash: testTag,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const { data: createdRows, error: insertErr } = await supabase
    .from('transactions')
    .insert([insertPayload])
    .select('*');
  if (insertErr || !createdRows?.length) {
    logResult('insert pending transaction', false, insertErr?.message);
    process.exit(1);
  }
  const tx = createdRows[0];
  logResult('insert pending transaction', true, tx.id);

  // Approve the transaction
  const { data: updatedRows, error: updErr } = await supabase
    .from('transactions')
    .update({ status: 'approved', updated_at: new Date().toISOString() })
    .eq('id', tx.id)
    .select('*');
  if (updErr || !updatedRows?.length) {
    logResult('approve transaction', false, updErr?.message);
    process.exit(1);
  }
  logResult('approve transaction', true);

  // Apply business effects (same as frontend path)
  // 1) Adjust totals
  const { error: updUserErr } = await supabase
    .from('users')
    .update({ total_invested: baselineInvested + usdValue })
    .eq('id', adminUserId);
  if (updUserErr) {
    logResult('update users.total_invested', false, updUserErr?.message);
    process.exit(1);
  }
  logResult('update users.total_invested', true, `+${usdValue}`);

  // 2) Insert notification
  const { error: notifErr } = await supabase
    .from('notifications')
    .insert([
      {
        user_id: adminUserId,
        title: 'Dépôt approuvé',
        message: `${testTag} Dépôt ${insertPayload.amount} ${insertPayload.crypto_type} approuvé.`,
        type: 'success',
        is_read: false,
        created_at: new Date().toISOString(),
      }
    ]);
  if (notifErr) {
    logResult('insert notification', false, notifErr?.message);
    process.exit(1);
  }
  logResult('insert notification', true);

  // 3) Insert system log
  const { error: logErr } = await supabase
    .from('system_logs')
    .insert([
      {
        user_id: adminUserId,
        action: 'TRANSACTION_APPROVED',
        details: {
          test_tag: testTag,
          transaction_id: tx.id,
          tx_type: tx.type,
          crypto_type: tx.crypto_type,
          amount: tx.amount,
          status: 'approved',
        },
        created_at: new Date().toISOString(),
      }
    ]);
  if (logErr) {
    logResult('insert system log', false, logErr?.message);
    process.exit(1);
  }
  logResult('insert system log', true);

  // Verify totals increased
  const { data: afterProfile, error: afterErr } = await supabase
    .from('users')
    .select('total_invested')
    .eq('id', adminUserId)
    .single();
  if (afterErr) {
    logResult('fetch updated user', false, afterErr?.message);
    process.exit(1);
  }
  const expected = baselineInvested + usdValue;
  const actual = Number(afterProfile.total_invested || 0);
  logResult('verify total_invested increased', actual === expected, `expected=${expected} actual=${actual}`);

  // Verify notification exists
  const { data: notifRows, error: notifSelErr } = await supabase
    .from('notifications')
    .select('id, title, message')
    .eq('user_id', adminUserId)
    .ilike('message', `%${testTag}%`)
    .limit(1);
  logResult('verify notification inserted', !notifSelErr && notifRows && notifRows.length > 0, notifSelErr?.message || '');

  // Verify system log exists
  const { data: logRows, error: logSelErr } = await supabase
    .from('system_logs')
    .select('id, action, details')
    .eq('action', 'TRANSACTION_APPROVED')
    .limit(10);
  const foundLog = (logRows || []).some(r => (r.details?.test_tag) === testTag);
  logResult('verify system log inserted', !logSelErr && foundLog, logSelErr?.message || '');

  console.log('== Done ==');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});