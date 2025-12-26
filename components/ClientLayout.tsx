import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Simples verificação de login baseada em localStorage
  const userRole = localStorage.getItem('ink_role');
  const isLoggedIn = !!userRole;

  const handleLogout = () => {
    localStorage.removeItem('ink_role');
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-body selection:bg-primary selection:text-white">
      {/* Public Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
             <div className="size-8 text-white bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">ink_pen</span>
             </div>
             <h1 className="font-tattoo text-2xl tracking-wide text-white">Ink Studio</h1>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={({isActive}) => `text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>Início</NavLink>
            <NavLink to="/book" className={({isActive}) => `text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>Agendar</NavLink>
            <NavLink to="/artists" className={({isActive}) => `text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>Artistas</NavLink>
            <NavLink to="/gallery" className={({isActive}) => `text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}>Galeria</NavLink>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
             {isLoggedIn ? (
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(userRole === 'client' ? '/profile' : '/admin/dashboard')}
                        className="text-xs font-bold text-white hover:text-primary transition-colors uppercase tracking-wider"
                    >
                        Olá, {userRole === 'client' ? 'Cliente' : 'Artista'}
                    </button>
                    <button onClick={handleLogout} className="text-text-muted hover:text-white transition-colors">
                        <span className="material-symbols-outlined">logout</span>
                    </button>
                </div>
             ) : (
                 <button onClick={() => navigate('/login')} className="text-xs font-bold text-text-muted hover:text-white uppercase tracking-widest transition-colors">
                    Entrar
                 </button>
             )}
             
             <button onClick={() => navigate('/book')} className="bg-white text-black hover:bg-gray-200 px-5 py-2.5 rounded font-bold text-sm transition-all uppercase tracking-wide shadow-lg shadow-white/10">
                Agendar Agora
             </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={toggleMenu} className="md:hidden text-white p-2">
            <span className="material-symbols-outlined text-2xl">{isMobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </div>

        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
            <div className="md:hidden absolute top-20 left-0 right-0 bg-background-dark border-b border-white/5 p-6 flex flex-col gap-6 shadow-2xl animate-fade-in h-[calc(100vh-5rem)] overflow-y-auto">
                <nav className="flex flex-col gap-6 text-center">
                    <NavLink to="/" onClick={closeMenu} className={({isActive}) => `text-xl font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-white'}`}>Início</NavLink>
                    <NavLink to="/book" onClick={closeMenu} className={({isActive}) => `text-xl font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-white'}`}>Agendar</NavLink>
                    <NavLink to="/artists" onClick={closeMenu} className={({isActive}) => `text-xl font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-white'}`}>Artistas</NavLink>
                    <NavLink to="/gallery" onClick={closeMenu} className={({isActive}) => `text-xl font-bold tracking-widest uppercase hover:text-primary transition-colors ${isActive ? 'text-primary' : 'text-white'}`}>Galeria</NavLink>
                </nav>
                
                <div className="h-px bg-white/10 w-full"></div>
                
                <div className="flex flex-col gap-4">
                    {isLoggedIn ? (
                        <>
                            <button 
                                onClick={() => { navigate(userRole === 'client' ? '/profile' : '/admin/dashboard'); closeMenu(); }}
                                className="w-full py-3 rounded bg-surface-light text-white font-bold uppercase tracking-wider"
                            >
                                Minha Conta
                            </button>
                            <button 
                                onClick={handleLogout} 
                                className="w-full py-3 rounded border border-border-dark text-text-muted hover:text-white font-bold uppercase tracking-wider"
                            >
                                Sair
                            </button>
                        </>
                    ) : (
                        <button 
                            onClick={() => { navigate('/login'); closeMenu(); }}
                            className="w-full py-3 rounded border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/5"
                        >
                            Entrar na Conta
                        </button>
                    )}
                     <button 
                        onClick={() => { navigate('/book'); closeMenu(); }}
                        className="w-full py-3 bg-primary hover:bg-primary-hover text-white rounded font-bold uppercase tracking-wide shadow-lg shadow-primary/20"
                     >
                        Agendar Agora
                     </button>
                </div>
            </div>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      {/* Public Footer */}
      <footer className="border-t border-white/10 bg-black py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div>
             <h2 className="font-tattoo text-2xl text-white mb-2">Ink Studio</h2>
             <p className="text-text-muted text-sm">Arte em cada gota de tinta.</p>
          </div>
          <div className="text-text-muted text-sm flex flex-col gap-1">
             <p>Rua da Arte, 123, Centro</p>
             <p>contato@inkstudio.com • (11) 99999-9999</p>
          </div>
          <div className="flex gap-4">
             <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">photo_camera</span>
             </div>
             <div className="size-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-primary hover:scale-110 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-lg">mail</span>
             </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;