import type { Metadata } from 'next';
import LoginForm from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Faça login na sua conta Ink Studio para agendar tatuagens e gerenciar seus agendamentos.',
  robots: { index: false, follow: false },
};

import { Suspense } from 'react';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
