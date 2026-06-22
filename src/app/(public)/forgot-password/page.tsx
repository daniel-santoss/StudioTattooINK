import type { Metadata } from 'next';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Recuperar Senha',
  description: 'Recupere o acesso à sua conta Ink Studio.',
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
