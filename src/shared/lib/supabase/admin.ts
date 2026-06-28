import 'server-only';
import { createClient } from '@supabase/supabase-js';

/**
 * Cliente Supabase com a chave service_role (Admin API).
 * Uso EXCLUSIVO no servidor (Server Actions). NUNCA expor ao browser.
 * A service_role vem de API_KEY no .env.local (gitignored).
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.API_KEY;
  if (!url || !serviceRole) {
    throw new Error('Supabase admin não configurado (NEXT_PUBLIC_SUPABASE_URL / API_KEY).');
  }
  return createClient(url, serviceRole, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
