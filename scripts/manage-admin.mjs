#!/usr/bin/env node
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE environment variables');
  process.exit(1);
}

const args = process.argv.slice(2);
const argMap = new Map();
for (let i = 0; i < args.length; i++) {
  const token = args[i];
  if (!token.startsWith('--')) continue;
  const next = args[i + 1];
  if (!next || next.startsWith('--')) {
    argMap.set(token, true);
  } else {
    argMap.set(token, next);
    i += 1;
  }
}

const email = argMap.get('--email');
const password = argMap.get('--password');
const fullName = (argMap.get('--full-name') && argMap.get('--full-name') !== true) ? argMap.get('--full-name') : 'Admin';
const recreate = !!argMap.get('--recreate');
const deleteOnly = !!argMap.get('--delete');
const createOnly = !!argMap.get('--create');

if (!email) {
  console.error('Usage: node scripts/manage-admin.mjs --recreate --email <email> --password <pwd> [--full-name <name>]');
  console.error('Or:    node scripts/manage-admin.mjs --delete --email <email>');
  console.error('Or:    node scripts/manage-admin.mjs --create --email <email> --password <pwd> [--full-name <name>]');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE, { auth: { persistSession: false } });

async function findUserByEmail(targetEmail) {
  let page = 1;
  const perPage = 200;
  while (true) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage });
    if (error) throw error;
    const found = data.users.find(u => u.email?.toLowerCase() === targetEmail.toLowerCase());
    if (found) return found;
    if (data.users.length < perPage) return null;
    page += 1;
  }
}

async function deleteUserByEmail(targetEmail) {
  const u = await findUserByEmail(targetEmail);
  if (!u) {
    console.log(`No user found for ${targetEmail}, nothing to delete`);
    return null;
  }
  const { error } = await admin.auth.admin.deleteUser(u.id);
  if (error) throw error;
  console.log(`Deleted user ${targetEmail} (${u.id})`);
  return u.id;
}

async function createAdminUser(targetEmail, targetPassword, targetFullName) {
  const { data, error } = await admin.auth.admin.createUser({
    email: targetEmail,
    password: targetPassword,
    email_confirm: true,
    user_metadata: { full_name: targetFullName },
  });
  if (error) throw error;
  const user = data.user;
  console.log(`Created user ${targetEmail} (${user.id})`);

  const { error: upsertErr } = await admin
    .from('users')
    .upsert({
      id: user.id,
      email: user.email,
      full_name: targetFullName,
      role: 'admin',
      status: 'active',
      total_invested: 0,
      total_profit: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'id' });
  if (upsertErr) throw upsertErr;
  console.log(`Upserted public.users row for ${targetEmail} with role=admin`);
  return user.id;
}

(async () => {
  try {
    if (recreate || deleteOnly) {
      await deleteUserByEmail(email);
    }
    if (recreate || createOnly) {
      if (!password) throw new Error('Password required for create');
      await createAdminUser(email, password, fullName);
    }
    console.log('Done.');
  } catch (e) {
    console.error('Error:', e.message || e);
    process.exit(1);
  }
})();