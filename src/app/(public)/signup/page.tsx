import type { Metadata } from 'next';
import SignupForm from '@/features/auth/components/SignupForm';

export const metadata: Metadata = {
  title: 'Criar Conta',
  description: 'Crie sua conta no Ink Studio — clientes, artistas e estúdios.',
  robots: { index: false, follow: false },
};

import { Suspense } from 'react';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <SignupForm />
    </Suspense>
  );
}
