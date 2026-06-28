'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/features/auth/actions/auth';
import Avatar from '@/shared/components/Avatar';
import type { NavItem, UserRole } from '@/shared/types';

const PrimeiroAcessoModal = dynamic(() => import('@/features/auth/components/PrimeiroAcessoModal'));

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
  primeiroAcesso?: boolean;
}

const AuthenticatedLayoutShell: React.FC<AuthenticatedLayoutShellProps> = ({ children, role, name, avatarUrl, primeiroAcesso }) => {
  const router = useRouter();
  const pathname = usePathname();

  // Menu recolhível (estilo YouTube). Preferência persistida no navegador.
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => {
    setCollapsed(localStorage.getItem('ink_sidebar_collapsed') === '1');
  }, []);
  const toggleCollapsed = () => {
    setCollapsed((v) => {
      const next = !v;
      localStorage.setItem('ink_sidebar_collapsed', next ? '1' : '0');
      return next;
    });
  };

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
      {/* Modal obrigatório de primeiro acesso — bloqueia toda a UI */}
      {primeiroAcesso && <PrimeiroAcessoModal nomeUsuario={name} />}
      {/* Sidebar (recolhível) */}
      <aside className={`hidden md:flex ${collapsed ? 'w-20' : 'w-72'} flex-col border-r border-border-dark bg-surface-dark flex-shrink-0 transition-[width] duration-200`} role="navigation" aria-label="Menu lateral">
        <div className={`flex flex-col h-full ${collapsed ? 'p-3' : 'p-6'} justify-between`}>
          <div className="flex flex-col gap-8">
            {/* Topo: marca + botão recolher */}
            <div className={`flex items-center ${collapsed ? 'flex-col gap-3' : 'justify-between'}`}>
              {!collapsed && (
                <Link href="/" className="flex items-center gap-3 overflow-hidden">
                  <div className="size-10 shrink-0 text-white bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                    <span className="material-symbols-outlined text-2xl">ink_pen</span>
                  </div>
                  <div className="flex flex-col">
                    <h1 className="font-tattoo text-2xl tracking-wide text-white leading-none">Ink Studio</h1>
                    <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-1">
                      {role === 'client' ? 'Área do Cliente' : 'Gerenciamento'}
                    </span>
                  </div>
                </Link>
              )}
              {collapsed && (
                <Link href="/" title="Ink Studio" className="size-10 text-white bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                  <span className="material-symbols-outlined text-2xl">ink_pen</span>
                </Link>
              )}
              <button
                onClick={toggleCollapsed}
                title={collapsed ? 'Expandir menu' : 'Recolher menu'}
                aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
                className="text-text-muted hover:text-white hover:bg-white/5 rounded-lg p-2 transition-colors"
              >
                <span className="material-symbols-outlined">{collapsed ? 'menu' : 'menu_open'}</span>
              </button>
            </div>

            <nav className="flex flex-col gap-2">
              {currentNavItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center rounded-lg transition-all duration-200 group ${
                      collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
                    } ${
                      isActive
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    {!collapsed && <span className="text-sm font-medium tracking-wide">{item.label}</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* User Profile / Logout */}
          <div className="pt-6 border-t border-border-dark">
            {collapsed ? (
              <div className="flex flex-col items-center gap-3">
                <button onClick={() => router.push('/admin/profile')} title={name} className="cursor-pointer">
                  <Avatar src={avatarUrl || undefined} name={name} className="size-10 rounded-full" />
                </button>
                <form action={logout}>
                  <button type="submit" className="text-text-muted hover:text-red-500 transition-colors p-1" title="Sair">
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-3 w-full p-3 rounded-xl bg-background-dark border border-border-dark hover:border-primary/50 transition-colors group text-left">
                <button
                  onClick={() => router.push('/admin/profile')}
                  className="flex items-center gap-3 flex-1 overflow-hidden cursor-pointer"
                >
                  <Avatar src={avatarUrl || undefined} name={name} className="size-10 rounded-full" />
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
            )}
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
