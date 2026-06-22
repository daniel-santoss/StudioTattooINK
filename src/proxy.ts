import { type NextRequest } from 'next/server';
import { updateSession } from '@/shared/lib/supabase/middleware';

// Next 16: convenção "proxy" (substitui "middleware").
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

// Só roda nas rotas autenticadas (o matcher é a única coisa que define
// "rota protegida"; as públicas nem passam por aqui).
export const config = {
  matcher: ['/admin/:path*', '/book', '/my-appointments/:path*', '/profile'],
};
