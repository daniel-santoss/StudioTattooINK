
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Artwork } from '../../types';
import { RatingDisplay } from '../Staff';

interface ArtistWithPortfolio {
  id: number;
  name: string;
  role: string;
  bio: string;
  styles: string[];
  img: string;
  rating: number;
  ratingCount: number;
  portfolio: Artwork[];
}

const Artists: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedArtist, setSelectedArtist] = useState<ArtistWithPortfolio | null>(null);

  const artists: ArtistWithPortfolio[] = [
    {
      id: 1,
      name: "Alex Rivera",
      role: "Especialista em Realismo",
      bio: "Com mais de 10 anos de experiência, Alex domina a arte do realismo preto e cinza, criando retratos que parecem ganhar vida na pele.",
      styles: ["Realismo", "Preto e Cinza", "Retratos"],
      img: "/src/assets/images/tatuadores/tatuador1.jpg",
      rating: 4.7,
      ratingCount: 2899,
      portfolio: [
        {
          id: 101,
          title: "Olhar Profundo",
          description: "Estudo detalhado de olho humano com texturas de pele hiper-realistas em preto e cinza.",
          imageUrl: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 102,
          title: "Guerreiro Nórdico",
          description: "Retrato de viking com armadura detalhada. Foco em contraste e iluminação dramática.",
          imageUrl: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 103,
          title: "Leão Majestoso",
          description: "Realismo animal capturando a ferocidade e a textura da juba do leão. Fechamento de antebraço.",
          imageUrl: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 104,
          title: "Caveira Sombria",
          description: "Composição Dark Realism misturando anatomia óssea com elementos de fumaça.",
          imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 2,
      name: "Lucas Vane",
      role: "Neo Tradicional",
      bio: "Lucas traz cores vibrantes e linhas ousadas. Seu estilo Neo Tradicional combina o clássico com o moderno.",
      styles: ["Neo Tradicional", "Colorido", "Botânico"],
      img: "/src/assets/images/tatuadores/tatuador2.jpg",
      rating: 5.0,
      ratingCount: 1450,
      portfolio: [
        {
          id: 201,
          title: "Lady Rose",
          description: "Rosto feminino estilizado com rosas vermelhas vibrantes. Linhas grossas e cores sólidas.",
          imageUrl: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 202,
          title: "Adaga & Coração",
          description: "Clássico Neo Tradicional. Adaga perfurando um coração sagrado com paleta de cores outonal.",
          imageUrl: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 203,
          title: "Coruja Mística",
          description: "Coruja com adornos de joias e fundo ornamental. Cores saturadas e degrâdes suaves.",
          imageUrl: "https://images.unsplash.com/photo-1578301978693-85ea9ec2a20c?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 3,
      name: "Mika Chen",
      role: "Oriental / Irezumi",
      bio: "Especialista em grandes projetos e fechamentos corporais no estilo tradicional japonês.",
      styles: ["Oriental", "Irezumi", "Dragões"],
      img: "/src/assets/images/tatuadores/tatuador3.jpg",
      rating: 4.2,
      ratingCount: 920,
      portfolio: [
        {
          id: 301,
          title: "Dragão Ryu",
          description: "Fechamento de costas completo com Dragão japonês tradicional e ondas (Great Wave).",
          imageUrl: "https://images.unsplash.com/photo-1565507724810-75460290137d?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 302,
          title: "Máscara Hannya",
          description: "Máscara Hannya em meio a flores de cerejeira (Sakura). Simbolizando sabedoria e proteção.",
          imageUrl: "https://images.unsplash.com/photo-1621112904891-2867e0ce5854?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 303,
          title: "Carpa Koi",
          description: "Fechamento de perna com Carpa Koi subindo a cachoeira, representando perseverança.",
          imageUrl: "https://images.unsplash.com/photo-1614948592934-7772740a8570?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 4,
      name: "Elena Rosa",
      role: "Fine Line",
      bio: "Elena é especialista em tatuagens delicadas e minimalistas. Traços finos e precisos que capturam a essência da sutileza.",
      styles: ["Fine Line", "Minimalismo", "Aquarela"],
      img: "/src/assets/images/tatuadores/tatuador4.jpg",
      rating: 4.8,
      ratingCount: 1105,
      portfolio: [
        {
          id: 401,
          title: "Borboleta Delicada",
          description: "Borboleta minimalista com traços finos e pontos delicados. Pulso feminino.",
          imageUrl: "https://images.unsplash.com/photo-1550537687-c91357422f5c?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 402,
          title: "Floral Geométrico",
          description: "Composição floral com elementos geométricos sutis. Fine line em preto.",
          imageUrl: "https://images.unsplash.com/photo-1578301978018-3af8e5e85c61?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 5,
      name: "Lucas Ferreira",
      role: "Blackwork & Pontilhismo",
      bio: "Mestre em trabalhos de blackwork sólido e pontilhismo detalhado. Cria padrões hipnóticos e mandalas complexas.",
      styles: ["Blackwork", "Pontilhismo", "Mandalas"],
      img: "/src/assets/images/tatuadores/tatuador5.jpg",
      rating: 4.5,
      ratingCount: 780,
      portfolio: [
        {
          id: 501,
          title: "Mandala Solar",
          description: "Mandala detalhada no antebraço usando técnica mista de blackwork e pontilhismo.",
          imageUrl: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 502,
          title: "Geometria Sagrada",
          description: "Padrões geométricos interconectados formando um design de braço completo.",
          imageUrl: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 6,
      name: "André Costa",
      role: "Aquarela & Colorido",
      bio: "Especializado em tatuagens coloridas que parecem pinturas. Seu estilo aquarela é único e vibrante.",
      styles: ["Aquarela", "Colorido", "Abstrato"],
      img: "/src/assets/images/tatuadores/tatuador6.jpg",
      rating: 4.9,
      ratingCount: 1230,
      portfolio: [
        {
          id: 601,
          title: "Beija-Flor Aquarela",
          description: "Beija-flor em estilo aquarela com respingos de cor vibrantes.",
          imageUrl: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 602,
          title: "Explosão de Cores",
          description: "Composição abstrata celebrando o poder das cores em movimento.",
          imageUrl: "https://images.unsplash.com/photo-1578301978693-85ea9ec2a20c?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 7,
      name: "Rafael Santos",
      role: "Old School",
      bio: "Apaixonado pelo estilo clássico americano. Cores sólidas, linhas grossas e designs atemporais.",
      styles: ["Old School", "Tradicional", "Flash"],
      img: "/src/assets/images/tatuadores/tatuador7.jpg",
      rating: 4.4,
      ratingCount: 650,
      portfolio: [
        {
          id: 701,
          title: "Âncora Clássica",
          description: "Âncora tradicional com banner e rosas. Cores primárias sólidas.",
          imageUrl: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 702,
          title: "Sailor Jerry",
          description: "Homenagem ao estilo de Norman Collins com pin-up clássica.",
          imageUrl: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600"
        }
      ]
    },
    {
      id: 8,
      name: "Juliana Mendes",
      role: "Lettering & Script",
      bio: "Artista especializada em tipografia e caligrafia. Cada letra é uma obra de arte personalizada.",
      styles: ["Lettering", "Script", "Chicano"],
      img: "/src/assets/images/tatuadores/tatuador8.jpg",
      rating: 4.6,
      ratingCount: 890,
      portfolio: [
        {
          id: 801,
          title: "Script Cursivo",
          description: "Frase em caligrafia elegante com ornamentos florais delicados.",
          imageUrl: "https://images.unsplash.com/photo-1565507724810-75460290137d?auto=format&fit=crop&q=80&w=600"
        },
        {
          id: 802,
          title: "Chicano Letters",
          description: "Lettering no estilo Chicano com sombreamento detalhado e moldura ornamental.",
          imageUrl: "https://images.unsplash.com/photo-1621112904891-2867e0ce5854?auto=format&fit=crop&q=80&w=600"
        }
      ]
    }
  ];

  useEffect(() => {
    const artistId = searchParams.get('id');
    if (artistId) {
      const element = document.getElementById(`artist-card-${artistId}`);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          // Add highlight visual cue
          element.style.transition = 'all 0.5s ease';
          element.style.borderColor = '#d41132'; // primary color
          element.style.boxShadow = '0 0 30px rgba(212,17,50,0.2)';

          setTimeout(() => {
            element.style.borderColor = ''; // reset to class based
            element.style.boxShadow = '';
          }, 2000);
        }, 300); // slight delay for render
      }
    }
  }, [searchParams]);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="font-tattoo text-5xl md:text-6xl text-white mb-4">Nossos Artistas</h1>
        <p className="text-text-muted max-w-2xl mx-auto text-lg font-medium">Conheça a equipe que transformará sua ideia em arte eterna.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {artists.map((artist) => (
          <div
            id={`artist-card-${artist.id}`}
            key={artist.id}
            className="bg-[#121212] border border-zinc-800 rounded-3xl overflow-hidden flex flex-col md:flex-row group hover:border-primary/50 transition-all duration-500"
          >
            <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
              <img src={artist.img} alt={artist.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            </div>

            <div className="p-8 flex-1 flex flex-col justify-center">
              <div className="mb-4">
                <h2 className="font-display font-black text-2xl text-white mb-1">{artist.name}</h2>
                <p className="text-primary font-black text-[10px] uppercase tracking-[0.2em] mb-3">{artist.role}</p>
                <RatingDisplay rating={artist.rating} count={artist.ratingCount} size="15px" activeColor="text-amber-500" />
              </div>

              <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">{artist.bio}</p>

              <div className="flex flex-wrap gap-2 mb-8">
                {artist.styles.map(style => (
                  <span key={style} className="px-3 py-1 bg-zinc-800/50 rounded-full text-[10px] font-black text-zinc-400 border border-white/5 uppercase tracking-wider">
                    {style}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-white/5 flex gap-4">
                <button onClick={() => navigate(`/book?artistId=${artist.id}`)} className="flex-1 bg-primary hover:bg-primary-hover text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-xl shadow-primary/20">
                  Agendar
                </button>
                <button onClick={() => setSelectedArtist(artist)} className="size-12 flex items-center justify-center border border-zinc-800 hover:bg-zinc-800 rounded-xl text-white transition-all group-hover:border-zinc-600">
                  <span className="material-symbols-outlined">visibility</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Portfolio - Estilo atualizado conforme print */}
      {selectedArtist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-[#121212] border border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl relative animate-fade-in my-8 flex flex-col max-h-[90vh]">

            {/* Header conforme imagem de referência */}
            <div className="p-8 border-b border-zinc-800 flex items-center justify-between sticky top-0 bg-[#121212] z-10">
              <div className="flex items-center gap-5">
                <div className="relative">
                  <img src={selectedArtist.img} alt={selectedArtist.name} className="size-[64px] rounded-full object-cover border-[3px] border-primary" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-white leading-tight mb-1">{selectedArtist.name}</h2>
                  <RatingDisplay rating={selectedArtist.rating} count={selectedArtist.ratingCount} size="16px" activeColor="text-amber-500" />
                </div>
              </div>
              <button
                onClick={() => setSelectedArtist(null)}
                className="size-12 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white flex items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>

            <div className="p-8 overflow-y-auto">
              {/* Galeria */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedArtist.portfolio.length > 0 ? (
                  selectedArtist.portfolio.map(art => (
                    <div key={art.id} className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 group relative shadow-lg">
                      <img src={art.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={art.title} />

                      {/* Overlay com Título e Descrição */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                        <h3 className="text-white font-black text-lg mb-2 leading-tight">{art.title}</h3>
                        <div className="w-10 h-0.5 bg-primary mb-3"></div>
                        <p className="text-zinc-300 text-xs font-medium leading-relaxed line-clamp-4">
                          {art.description}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center">
                    <span className="material-symbols-outlined text-4xl text-zinc-700 mb-3">image_not_supported</span>
                    <p className="text-zinc-500 font-black text-sm uppercase tracking-widest">Galeria indisponível no momento.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 border-t border-zinc-800 bg-[#0d0d0d] flex flex-col md:flex-row justify-between items-center gap-4">
              <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest hidden md:block">INK STUDIO • ARTIST PORTFOLIO</span>
              <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
                <button
                  onClick={() => {
                    const id = selectedArtist.id;
                    setSelectedArtist(null);
                    navigate(`/artist-profile?id=${id}`);
                  }}
                  className="px-6 py-4 border border-zinc-700 hover:bg-zinc-800 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  VER PERFIL COMPLETO
                </button>
                <button
                  onClick={() => {
                    const id = selectedArtist.id;
                    setSelectedArtist(null);
                    navigate(`/book?artistId=${id}`);
                  }}
                  className="px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-primary/10 hover:shadow-primary/30"
                >
                  AGENDAR COM ESTE ARTISTA
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Artists;
