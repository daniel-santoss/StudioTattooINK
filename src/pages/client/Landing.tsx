
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface GalleryPreviewItem {
   id: number;
   name: string;
   category: string;
   img: string;
}

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

   const [selectedImage, setSelectedImage] = useState<GalleryPreviewItem | null>(null);

   const handleOpenDetails = (item: GalleryPreviewItem) => {
      setSelectedImage(item);
   };

   const handleCloseDetails = () => {
      setSelectedImage(null);
   };

   const handleNavigateToArtist = () => {
      if (selectedImage) {
         if (localStorage.getItem('ink_role')) {
            navigate(`/artist-profile?id=${selectedImage.id}`);
         } else {
            navigate(`/login?redirect=${encodeURIComponent(`/artist-profile?id=${selectedImage.id}`)}`);
         }
      }
   };

   const galleryPreview = [
      { id: 1, name: "Alex Rivera", category: "Realismo", img: "/src/assets/images/tattooPiercing/tattooRealista1.jpg" },
      { id: 3, name: "Mika Chen", category: "Oriental", img: "/src/assets/images/tattooPiercing/tattooOriental1.jpg" },
      { id: 4, name: "Elena Rosa", category: "Fine Line", img: "/src/assets/images/tattooPiercing/tattooFine1.jpg" },
      { id: 13, name: "Mika Chen", category: "Oriental", img: "/src/assets/images/tattooPiercing/tattooOriental4.jpg" },
      { id: 22, name: "André Costa", category: "Anime", img: "/src/assets/images/tattooPiercing/tattooAnime1.jpg" },
      { id: 30, name: "Elena Rosa", category: "Piercing", img: "/src/assets/images/tattooPiercing/piecing5.jpg" }
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
         <section id="home" className="relative min-h-[80vh] pt-24 pb-16 flex items-center justify-center overflow-hidden">
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
                     { name: "Alex Rivera", style: "Realismo Preto e Cinza", img: "/src/assets/images/tatuadores/tatuador1.jpg" },
                     { name: "Lucas Vane", style: "Neo Tradicional", img: "/src/assets/images/tatuadores/tatuador2.jpg" },
                     { name: "Mika Chen", style: "Oriental / Irezumi", img: "/src/assets/images/tatuadores/tatuador3.jpg" }
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
                  {galleryPreview.map((item, i) => (
                     <div key={i} className="aspect-[3/5] rounded-2xl overflow-hidden bg-surface-dark border border-white/5 relative shadow-lg group">
                        <img src={item.img} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={`Tatuagem por ${item.name}`} />

                        {/* Overlay com Categoria e Botão - Mesmo estilo da Gallery.tsx */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                           <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Feito por {item.name}</span>
                           <button
                              onClick={() => handleOpenDetails(item)}
                              className="px-6 py-2 border-2 border-white bg-white text-black font-bold uppercase tracking-widest hover:bg-transparent hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                           >
                              Ver Detalhes
                           </button>
                        </div>
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

         {/* Modal de Detalhes (Reutilizado da Gallery.tsx) */}
         {selectedImage && (
            <div
               className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in"
               onClick={handleCloseDetails}
            >
               <div
                  className="bg-[#121212] border border-zinc-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative"
                  onClick={(e) => e.stopPropagation()}
               >
                  {/* Botão Fechar */}
                  <button
                     onClick={handleCloseDetails}
                     className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center backdrop-blur-sm border border-white/10"
                  >
                     <span className="material-symbols-outlined">close</span>
                  </button>

                  {/* Imagem (Esquerda/Topo) */}
                  <div className="w-full md:w-1/2 bg-black flex items-center justify-center relative">
                     <img
                        src={selectedImage.img}
                        alt="Detalhe"
                        className="w-full h-full object-cover max-h-[60vh] md:max-h-[80vh]"
                     />
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                        <span className="inline-block px-3 py-1 rounded-full border border-white/20 bg-black/40 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-md">
                           {selectedImage.category}
                        </span>
                     </div>
                  </div>

                  {/* Informações (Direita/Baixo) */}
                  <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#121212]">
                     <div className="mb-auto">
                        <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">Autoria da Obra</h3>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6 leading-tight">
                           Esse trabalho foi feito por <span className="text-primary block mt-1">{selectedImage.name}</span>
                        </h2>
                        <div className="w-16 h-1 bg-zinc-800 rounded-full mb-6"></div>
                        <p className="text-zinc-400 text-sm leading-relaxed">
                           Gostou do estilo? Visualize mais trabalhos como este, conheça a trajetória do artista e agende sua sessão diretamente pelo perfil.
                        </p>
                     </div>

                     <div className="mt-8 md:mt-12 space-y-3">
                        <button
                           onClick={handleNavigateToArtist}
                           className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_0_20px_rgba(212,17,50,0.3)] hover:shadow-[0_0_30px_rgba(212,17,50,0.5)] flex items-center justify-center gap-3 group"
                        >
                           Conferir Portfólio Completo
                           <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                        </button>

                        <button
                           onClick={handleCloseDetails}
                           className="w-full py-3 text-zinc-500 hover:text-white font-bold text-xs uppercase tracking-widest transition-colors"
                        >
                           Voltar para Galeria
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         )}
      </div>
   );
};

export default Landing;
