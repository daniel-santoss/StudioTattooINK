
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Efeito para rolar automaticamente se vier de outra página com state
  useEffect(() => {
    if (location.state && (location.state as any).scrollTo) {
        const sectionId = (location.state as any).scrollTo;
        const element = document.getElementById(sectionId);
        if (element) {
            setTimeout(() => {
                const headerOffset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset;
                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }, 100); // Pequeno delay para garantir renderização
        }
        // Limpar o state para não rolar novamente ao recarregar
        window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleViewAllArtists = () => {
      const isLoggedIn = !!localStorage.getItem('ink_role');
      
      if (isLoggedIn) {
          navigate('/artists');
      } else {
          // Redireciona para login, e depois volta para artistas
          navigate('/login?redirect=/artists');
      }
  };

  const galleryPreview = [
    "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1560707303-4e980c5c855c?auto=format&fit=crop&q=80&w=800",
    "https://images.unsplash.com/photo-1621112904891-2867e0ce5854?auto=format&fit=crop&q=80&w=800"
  ];

  return (
    <div className="flex flex-col">
       <style>{`
         @keyframes flame-pulse {
           0%, 100% { 
             box-shadow: 0 0 15px rgba(212,17,50,0.6), 0 0 5px rgba(212,17,50,0.4); 
             border-color: #d41132;
           }
           50% { 
             box-shadow: 0 0 30px rgba(212,17,50,0.9), 0 0 15px rgba(212,17,50,0.6); 
             border-color: #ff3355;
           }
         }
         .animate-flame {
           animation: flame-pulse 2s infinite ease-in-out;
         }
       `}</style>

       {/* Hero Section */}
       <section id="home" className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
             <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
             <div className="inline-block border border-primary bg-primary/10 backdrop-blur-md px-6 py-2 rounded-full mb-6 shadow-[0_0_30px_rgba(212,17,50,0.5),0_5px_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(212,17,50,0.7),0_10px_20px_rgba(0,0,0,0.6)] transition-all duration-300">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.2em] drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">Agende sua tatuagem</span>
             </div>
             
             <div className="mb-2">
                <span className="font-tattoo text-3xl md:text-4xl text-white/90">&</span>
             </div>

             <h1 className="font-tattoo text-6xl md:text-8xl text-white mb-6 leading-none shadow-black drop-shadow-lg">
                DeiXe sua marca <span className="text-primary">Registrada</span>
             </h1>
             <p className="text-lg md:text-xl text-gray-300 font-display mb-10 max-w-2xl mx-auto leading-relaxed">
               Conectamos você aos melhores tatuadores e body piercers do mercado em um só lugar. Explore portfólios, descubra designs exclusivos e agende sua sessão com a segurança de uma plataforma que preza pela excelência técnica e artística.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/book')}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-widest rounded shadow-[0_0_30px_rgba(212,17,50,0.4)] hover:shadow-[0_0_40px_rgba(212,17,50,0.6)] transition-all transform"
                >
                   Agendar Horário
                </button>
                <button 
                  onClick={() => navigate('/match')}
                  className="px-8 py-4 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-bold text-sm uppercase tracking-widest rounded transition-all backdrop-blur-sm flex items-center justify-center gap-2"
                >
                   <span className="material-symbols-outlined text-lg">auto_awesome</span>
                   Encontre seu Artista
                </button>
             </div>
          </div>
       </section>

       {/* Featured Artists */}
       <section id="artists" className="py-24 px-6 bg-background-dark relative">
          <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-12">
                <div>
                   <h2 className="font-tattoo text-4xl text-white mb-2">Nossos Artistas</h2>
                   <p className="text-text-muted">Selecione um artista para ver o portfólio e disponibilidade.</p>
                </div>
                <button onClick={handleViewAllArtists} className="hidden md:flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
                   Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                   { name: "Alex Rivera", style: "Realismo Preto e Cinza", img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=800" },
                   { name: "Sarah Vane", style: "Neo Tradicional", img: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=800" },
                   { name: "Mike Chen", style: "Oriental / Irezumi", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=800" }
                ].map((artist, i) => (
                   <div key={i} className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-surface-dark cursor-pointer" onClick={() => navigate('/book')}>
                      {/* Removido grayscale e group-hover:grayscale-0 */}
                      <img src={artist.img} alt={artist.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                         <p className="text-primary text-xs font-bold uppercase tracking-widest mb-1">{artist.style}</p>
                         <h3 className="text-2xl font-display font-bold text-white mb-4">{artist.name}</h3>
                         <div className="h-0 group-hover:h-10 overflow-hidden transition-all duration-300">
                             <span className="inline-flex items-center gap-2 text-white text-sm font-bold">
                                Agendar Agora <span className="material-symbols-outlined text-sm">arrow_forward</span>
                             </span>
                         </div>
                      </div>
                   </div>
                ))}
             </div>
             
             {/* Botão Ver Todos Mobile */}
             <div className="mt-8 text-center md:hidden">
                <button onClick={handleViewAllArtists} className="flex items-center justify-center w-full gap-2 text-primary font-bold uppercase text-xs tracking-widest hover:text-white transition-colors py-4 border border-zinc-800 rounded-xl">
                   Ver Todos <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
             </div>
          </div>
       </section>

       {/* Gallery Preview Section (New) */}
       <section id="gallery" className="py-20 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="font-tattoo text-4xl text-white mb-2">Galeria de Arte</h2>
                        <p className="text-text-muted">Um pouco do que nossos artistas têm produzido recentemente.</p>
                    </div>
                    <button onClick={() => navigate('/gallery')} className="flex items-center gap-2 text-white hover:text-primary font-bold uppercase text-xs tracking-widest transition-colors">
                        Ver Galeria Completa <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>
                
                {/* Imagens com altura aumentada (aspect-[3/5]) mantendo grid de 3 colunas para equilíbrio. Sem overlay e sem clique. */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryPreview.map((src, i) => (
                        <div key={i} className="aspect-[3/5] rounded-2xl overflow-hidden bg-surface-dark border border-white/5 relative shadow-lg">
                            <img src={src} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-all duration-500 hover:scale-105" alt="Tattoo" />
                        </div>
                    ))}
                </div>
            </div>
       </section>

       {/* Features Strip (Mapped to "Agendar" in nav) */}
       <section id="features" className="py-20 border-y border-white/5 bg-surface-dark/30">
          <div className="max-w-7xl mx-auto px-6">
             <div className="text-center mb-16">
                 <h2 className="font-tattoo text-4xl text-white mb-2">Por que Agendar Conosco?</h2>
                 <p className="text-text-muted">Processo simplificado, segurança garantida e arte de alta qualidade.</p>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                <div className="flex flex-col items-center gap-4 group">
                    <div className="size-20 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center text-primary mb-4 animate-flame">
                        <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_5px_rgba(212,17,50,0.5)]">clean_hands</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Biossegurança e Rigor</h3>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs">Selecionamos apenas profissionais que seguem os mais rígidos protocolos de higiene. Garantimos que todos os nossos parceiros utilizem materiais descartáveis e processos de esterilização certificados para sua total segurança.</p>
                </div>
                <div className="flex flex-col items-center gap-4 group">
                    <div className="size-20 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center text-primary mb-4 animate-flame">
                        <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_5px_rgba(212,17,50,0.5)]">brush</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Arte sob Medida</h3>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs">Encontre o artista ideal para dar vida à sua ideia. Através da nossa plataforma, você colabora diretamente com talentos que transformam sua visão em designs autorais e totalmente exclusivos.</p>
                </div>
                <div className="flex flex-col items-center gap-4 group">
                    <div className="size-20 rounded-full bg-background-dark border-2 border-primary flex items-center justify-center text-primary mb-4 animate-flame">
                         <span className="material-symbols-outlined text-4xl drop-shadow-[0_0_5px_rgba(212,17,50,0.5)]">verified</span>
                    </div>
                    <h3 className="text-xl font-bold text-white">Talentos Verificados</h3>
                    <p className="text-text-muted text-sm leading-relaxed max-w-xs">Reunimos uma diversidade de estilos e técnicas em um só lugar. Nossa seleção foca na competência e no portfólio de cada artista, garantindo que você encontre o profissional ideal para o seu projeto.</p>
                </div>
             </div>
          </div>
       </section>
    </div>
  );
};

export default Landing;
