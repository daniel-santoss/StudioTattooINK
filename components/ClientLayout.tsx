
import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';

const ClientLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  // Função para rolar até a seção com offset do header
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== '/') {
        // Se não estiver na home, navega para home passando o ID alvo no state
        navigate('/', { state: { scrollTo: sectionId } });
    } else {
        // Se já estiver na home, apenas rola
        const element = document.getElementById(sectionId);
        if (element) {
            const headerOffset = 80; // Altura do header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    }
    setIsMobileMenuOpen(false);
  };

  const NavItem = ({ label, targetId }: { label: string, targetId: string }) => (
      <button 
        onClick={() => scrollToSection(targetId)}
        className="text-sm font-bold tracking-widest uppercase text-text-muted hover:text-primary transition-colors"
      >
          {label}
      </button>
  );

  const MobileNavItem = ({ label, targetId }: { label: string, targetId: string }) => (
      <button 
        onClick={() => scrollToSection(targetId)}
        className="text-xl font-bold tracking-widest uppercase text-white hover:text-primary transition-colors"
      >
          {label}
      </button>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background-dark text-white font-body selection:bg-primary selection:text-white">
      {/* Public Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
             <div className="size-8 text-white bg-primary rounded flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">ink_pen</span>
             </div>
             <h1 className="font-tattoo text-2xl tracking-wide text-white">Ink Studio</h1>
          </div>

          {/* Desktop Nav - Scroll Links - Ordem atualizada conforme Home: Início -> Artistas -> Galeria -> Agendar */}
          <nav className="hidden md:flex items-center gap-8">
            <NavItem label="Início" targetId="home" />
            <NavItem label="Artistas" targetId="artists" />
            <NavItem label="Galeria" targetId="gallery" />
            <NavItem label="Agendar" targetId="features" />
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
             
             {/* O botão de ação principal continua levando para a rota dedicada de agendamento */}
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
                    <MobileNavItem label="Início" targetId="home" />
                    <MobileNavItem label="Artistas" targetId="artists" />
                    <MobileNavItem label="Galeria" targetId="gallery" />
                    <MobileNavItem label="Agendar" targetId="features" />
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
      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8 px-6 relative overflow-hidden">
        {/* Decorative background blur */}
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
            
            {/* Coluna 1: Brand */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                 <div className="size-8 text-white bg-primary rounded flex items-center justify-center shadow-[0_0_15px_rgba(212,17,50,0.4)]">
                    <span className="material-symbols-outlined text-xl">ink_pen</span>
                 </div>
                 <h2 className="font-tattoo text-2xl text-white tracking-wide">Ink Studio</h2>
              </div>
              <p className="text-text-muted text-sm leading-relaxed">
                Sua plataforma definitiva para agendar tatuagens e piercings com segurança. Conectamos você aos melhores artistas independentes do mercado.
              </p>
              <div className="flex gap-4">
                 <a href="#" className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 group">
                    <span className="material-symbols-outlined text-lg">public</span> {/* Simulating social icon */}
                 </a>
                 <a href="#" className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300">
                    <span className="material-symbols-outlined text-lg">alternate_email</span>
                 </a>
              </div>
            </div>

            {/* Coluna 2: Links Úteis */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Explorar</h3>
              <ul className="space-y-4">
                <li><button onClick={() => scrollToSection('features')} className="text-text-muted hover:text-white text-sm transition-colors inline-block">Como funciona</button></li>
                <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Dúvidas Frequentes</a></li>
                <li><button onClick={() => scrollToSection('gallery')} className="text-text-muted hover:text-white text-sm transition-colors inline-block">Galeria de Inspiração</button></li>
                <li>
                  <button 
                    onClick={() => navigate('/signup?type=artist')} 
                    className="text-primary font-bold text-sm transition-colors inline-flex items-center gap-2"
                  >
                    Seja um Parceiro <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </li>
              </ul>
            </div>

            {/* Coluna 3: Legal */}
            <div>
              <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Termos de Uso</a></li>
                <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Política de Privacidade</a></li>
                <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Diretrizes da Comunidade</a></li>
                <li><a href="#" className="text-text-muted hover:text-white text-sm transition-colors inline-block">Segurança</a></li>
              </ul>
            </div>

            {/* Coluna 4: Suporte */}
            <div>
               <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Suporte</h3>
               <div className="bg-surface-light/30 border border-white/5 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-3 text-emerald-500">
                     <span className="material-symbols-outlined">headset_mic</span>
                     <span className="text-xs font-bold uppercase tracking-wider">100% Digital</span>
                  </div>
                  <p className="text-zinc-400 text-sm mb-4">
                    Precisa de ajuda com seu agendamento? Nossa equipe está online.
                  </p>
                  <a href="mailto:suporte@inkstudio.com" className="text-white font-bold hover:text-primary transition-colors text-sm break-all">
                    suporte@inkstudio.com
                  </a>
               </div>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600 font-medium uppercase tracking-wider">
             <p>&copy; {new Date().getFullYear()} Ink Studio. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
