import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Cliente Supabase para o servidor (Server Components, Server Actions, Route Handlers).
 * Lê/grava a sessão em cookies httpOnly — invisível a XSS e visível ao servidor.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Chamado de um Server Component (cookies read-only).
            // O middleware cuida do refresh dos cookies — pode ignorar.
          }
        },
      },
    }
  );
}
