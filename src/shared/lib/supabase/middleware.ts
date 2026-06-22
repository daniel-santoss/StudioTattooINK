import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Refresca a sessão a cada request e protege as rotas autenticadas.
 * IMPORTANTE: o middleware é roteamento otimista, NÃO a fronteira de
 * segurança — a autorização real (por papel) é feita server-side nas
 * páginas/Server Actions via getCurrentUser().
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // NÃO colocar lógica entre createServerClient e getUser() (recomendação Supabase).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    // Sem sessão → manda para o login guardando o destino.
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
