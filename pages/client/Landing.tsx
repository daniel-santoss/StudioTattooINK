import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
       {/* Hero Section */}
       <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
             <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/80 to-transparent"></div>
             <div className="absolute inset-0 bg-black/40"></div>
          </div>
          
          <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
             <div className="inline-block border border-primary/50 bg-primary/10 backdrop-blur-md px-4 py-1.5 rounded-full mb-6">
                <span className="text-primary font-bold text-xs uppercase tracking-[0.2em]">Estúdio Premium de Tatuagem</span>
             </div>
             <h1 className="font-tattoo text-6xl md:text-8xl text-white mb-6 leading-none shadow-black drop-shadow-lg">
                Crie Seu <span className="text-primary">Legado</span>
             </h1>
             <p className="text-lg md:text-xl text-gray-300 font-display mb-10 max-w-2xl mx-auto leading-relaxed">
                Artistas de classe mundial. Ambiente estéril. Designs exclusivos que contam a sua história. Experimente a arte da tatuagem no seu melhor.
             </p>
             <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/book')}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover text-white font-bold text-sm uppercase tracking-widest rounded shadow-[0_0_30px_rgba(212,17,50,0.4)] hover:shadow-[0_0_40px_rgba(212,17,50,0.6)] transition-all transform hover:-translate-y-1"
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
       <section className="py-24 px-6 bg-background-dark relative">
          <div className="max-w-7xl mx-auto">
             <div className="flex justify-between items-end mb-12">
                <div>
                   <h2 className="font-tattoo text-4xl text-white mb-2">Nossos Artistas</h2>
                   <p className="text-text-muted">Selecione um artista para ver o portfólio e disponibilidade.</p>
                </div>
                <button onClick={() => navigate('/artists')} className="hidden md:flex items-center gap-2 text-primary font-bold uppercase text-xs tracking-widest hover:text-white transition-colors">
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
                      <img src={artist.img} alt={artist.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0" />
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
          </div>
       </section>

       {/* Features Strip */}
       <section className="py-20 border-y border-white/5 bg-surface-dark/30">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                   <span className="material-symbols-outlined text-3xl">clean_hands</span>
                </div>
                <h3 className="text-xl font-bold text-white">Esterilização Hospitalar</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs">Seguimos os mais rigorosos padrões de higiene, utilizando equipamentos descartáveis e esterilização de grau hospitalar.</p>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                   <span className="material-symbols-outlined text-3xl">brush</span>
                </div>
                <h3 className="text-xl font-bold text-white">Designs Exclusivos</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs">Cada peça é única. Trabalhamos com você para criar uma arte personalizada que corresponda perfeitamente à sua visão.</p>
             </div>
             <div className="flex flex-col items-center gap-4">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                   <span className="material-symbols-outlined text-3xl">verified</span>
                </div>
                <h3 className="text-xl font-bold text-white">Premiados</h3>
                <p className="text-text-muted text-sm leading-relaxed max-w-xs">Nosso estúdio abriga vários artistas premiados e reconhecidos internacionalmente por sua arte.</p>
             </div>
          </div>
       </section>
    </div>
  );
};

export default Landing;