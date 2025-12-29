
import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { NavItem } from '../types';
import { useAuth } from '../src/contexts/AuthContext';

// Common items for both Admin (Manager) and Artist
const commonAdminItems: NavItem[] = [
  { label: 'Início', path: '/admin/dashboard', icon: 'dashboard' },
];

// Items specific to Manager
const managerItems: NavItem[] = [
  { label: 'Solicitações', path: '/admin/requests', icon: 'person_add' },
  { label: 'Clientes', path: '/admin/clients', icon: 'groups' },
  { label: 'Tatuadores', path: '/admin/staff', icon: 'badge' },
  { label: 'Ocorrências', path: '/admin/reports', icon: 'report_problem' }, // New Reports item
];

// Items specific to Artist
const artistItems: NavItem[] = [
  { label: 'Solicitações', path: '/admin/booking-requests', icon: 'notifications_active' }, // New Booking Requests item
  { label: 'Agenda', path: '/admin/schedule', icon: 'calendar_month' },
  { label: 'Histórico', path: '/admin/history', icon: 'history' },
];

const clientNavItems: NavItem[] = [
  { label: 'Meus Agendamentos', path: '/my-appointments', icon: 'event_note' },
  { label: 'Novo Agendamento', path: '/book', icon: 'add_circle' },
  { label: 'Galeria', path: '/gallery', icon: 'photo_library' },
  { label: 'Artistas', path: '/artists', icon: 'brush' },
];

// ... (keep item arrays)

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const { role: userRole, signOut } = useAuth(); // rename role to userRole to match existing code

  const handleLogout = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await signOut();
    navigate('/login');
  };

  // Determine which items to show based on role
  let currentNavItems: NavItem[] = [];

  if (userRole === 'client') {
    currentNavItems = clientNavItems;
  } else if (userRole === 'artist') {
    // Artist gets Common + Requests + Agenda + History
    currentNavItems = [...commonAdminItems, ...artistItems];
  } else {
    // Admin/Manager gets Common + Management items + Reports (No History)
    currentNavItems = [...commonAdminItems, ...managerItems];
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark text-white font-body">
      {/* Sidebar */}
      <aside className="hidden md:flex w-72 flex-col border-r border-border-dark bg-surface-dark flex-shrink-0">
        <div className="flex flex-col h-full p-6 justify-between">
          <div className="flex flex-col gap-8">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
              <div className="size-10 text-white bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-2xl">ink_pen</span>
              </div>
              <div className="flex flex-col">
                <h1 className="font-tattoo text-2xl tracking-wide text-white leading-none">Ink Studio</h1>
                <span className="text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold mt-1">
                  {userRole === 'client' ? 'Área do Cliente' : 'Gerenciamento'}
                </span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-2">
              {currentNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-text-muted hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-medium tracking-wide">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>

          {/* User Profile / Logout */}
          <div className="pt-6 border-t border-border-dark">
            <div
              onClick={() => navigate('/admin/profile')}
              className="flex items-center gap-3 w-full p-3 rounded-xl bg-background-dark border border-border-dark hover:border-primary/50 transition-colors group text-left cursor-pointer"
            >
              <div className="size-10 rounded-full bg-cover bg-center border border-border-dark" style={{ backgroundImage: 'url(https://i.pravatar.cc/150?u=a042581f4e29026024d)' }}></div>
              <div className="flex flex-col overflow-hidden flex-1">
                <span className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">
                  {userRole === 'client' ? 'Minha Conta' : 'Alex Rivera'}
                </span>
                <span className="text-xs text-text-muted truncate capitalize">
                  {userRole === 'client' ? 'Cliente' : (userRole === 'admin' ? 'Gerente Geral' : 'Tatuador')}
                </span>
              </div>
              <button onClick={handleLogout} className="text-text-muted hover:text-red-500 transition-colors" title="Sair">
                <span className="material-symbols-outlined">logout</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-background-dark relative">
        {/* Mobile Header (Hidden on Desktop) */}
        <header className="md:hidden flex items-center justify-between p-4 border-b border-border-dark bg-surface-dark/95 backdrop-blur-sm z-50">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-2xl">ink_pen</span>
            <h1 className="font-tattoo text-xl text-white">Ink Studio</h1>
          </div>
          <button className="text-white p-2" onClick={() => navigate(userRole === 'client' ? '/my-appointments' : '/admin/dashboard')}>
            <span className="material-symbols-outlined">dashboard</span>
          </button>
        </header>

        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-surface-light">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
