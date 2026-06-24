'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/features/auth/actions/auth';
import type { NavItem, UserRole } from '@/shared/types';

const commonAdminItems: NavItem[] = [
  { label: 'Início', path: '/admin/dashboard', icon: 'dashboard' },
];

const managerItems: NavItem[] = [
  { label: 'Solicitações', path: '/admin/requests', icon: 'person_add' },
  { label: 'Clientes', path: '/admin/clients', icon: 'groups' },
  { label: 'Tatuadores', path: '/admin/staff', icon: 'badge' },
  { label: 'Ocorrências', path: '/admin/reports', icon: 'report_problem' },
];

const artistItems: NavItem[] = [
  { label: 'Solicitações', path: '/admin/booking-requests', icon: 'notifications_active' },
  { label: 'Agenda', path: '/admin/schedule', icon: 'calendar_month' },
  { label: 'Histórico', path: '/admin/history', icon: 'history' },
];

const clientNavItems: NavItem[] = [
  { label: 'Meus Agendamentos', path: '/my-appointments', icon: 'event_note' },
  { label: 'Novo Agendamento', path: '/book', icon: 'add_circle' },
  { label: 'Galeria', path: '/gallery', icon: 'photo_library' },
  { label: 'Artistas', path: '/artists', icon: 'brush' },
];

interface AuthenticatedLayoutShellProps {
  children: React.ReactNode;
  role: UserRole;
  name: string;
  avatarUrl?: string;
}

const AuthenticatedLayoutShell: React.FC<AuthenticatedLayoutShellProps> = ({ children, role, name, avatarUrl }) => {
  const router = useRouter();
  const pathname = usePathname();

  let currentNavItems: NavItem[] = [];
  if (role === 'client') {
    currentNavItems = clientNavItems;
  } else if (role === 'artist') {
    currentNavItems = [...commonAdminItems, ...artistItems];
  } else {
    currentNavItems = [...commonAdminItems, ...managerItems];
  }

  const roleLabel = role === 'client' ? 'Cliente' : role === 'admin' ? 'Gerente Geral' : 'Tatuador';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-body">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border-dark bg-surface-dark flex-shrink-0" role="navigation" aria-label="Menu lateral">
        <div className="flex flex-col h-full p-6 justify-between">
          <div className="flex flex-col gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="size-10 text-white bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-2xl">ink_pen</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-tattoo text-2xl tracking-wide text-white leading-none">Ink Studio</h1>
                <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-1">
                  {role === 'client' ? 'Área do Cliente' : 'Gerenciamento'}
                </span>
              </div>
            </Link>

            <nav className="flex flex-col gap-2">
              {currentNavItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="text-sm font-medium tracking-wide">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile / Logout */}
          <div className="pt-6 border-t border-border-dark">
            <div className="flex items-center gap-3 w-full p-3 rounded-xl bg-background-dark border border-border-dark hover:border-primary/50 transition-colors group text-left">
              <button
                onClick={() => router.push('/admin/profile')}
                className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer"
              >
                <div className="size-10 rounded-full bg-cover bg-center border border-border-dark bg-surface-light" style={{ backgroundImage: `url(${avatarUrl || '/images/tatuadores/tatuador1.jpg'})` }}></div>
                <div className="flex flex-col overflow-hidden flex-1 text-left">
                  <span className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{name}</span>
                  <span className="text-xs text-text-muted truncate capitalize">{roleLabel}</span>
                </div>
              </button>
              <form action={logout}>
                <button type="submit" className="text-text-muted hover:text-red-500 transition-colors" title="Sair">
                  <span className="material-symbols-outlined">logout</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border-dark bg-surface-dark/95 backdrop-blur-sm z-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">ink_pen</span>
            <h1 className="font-tattoo text-xl text-white">Ink Studio</h1>
          </div>
          <button className="text-white p-2" onClick={() => router.push(role === 'client' ? '/my-appointments' : '/admin/dashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-light">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AuthenticatedLayoutShell;
