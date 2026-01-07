
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RatingDisplay } from '../Staff';

const ArtistProfile: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const artistId = searchParams.get('id');
    const [artist, setArtist] = useState<any | null>(null);

    // Mock de dados estendido para incluir campos do design de referência
    const artistsData = [
        {
            id: 1,
            name: "Alex Rivera",
            role: "Tatuador",
            email: "alex@inkstudio.com",
            phone: "(11) 99999-0001",
            portfolioLink: "https://instagram.com/alexrivera_ink",
            experience: "Mais de 10 anos",
            styles: ["Realismo", "Preto e Cinza", "Retratos"],
            img: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?auto=format&fit=crop&q=80&w=400",
            rating: 4.7,
            ratingCount: 2899,
            bio: "Especialista em realismo preto e cinza com mais de 10 anos de mercado. Busco sempre eternizar momentos e histórias na pele dos meus clientes com a máxima precisão.",
            portfolio: [
                { title: "Olhar Profundo", desc: "Estudo detalhado de olho humano com texturas de pele hiper-realistas.", img: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600" },
                { title: "Guerreiro Nórdico", desc: "Retrato de viking com armadura. Foco em contraste e iluminação dramática.", img: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600" },
                { title: "Moto Custom", desc: "Realismo mecânico, destacando reflexos metálicos e detalhes do motor.", img: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=600" },
                { title: "Leão", desc: "Fechamento de braço completo com tema de savana e leão majestoso.", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600" }
            ]
        },
        {
            id: 2,
            name: "Lucas Vane",
            role: "Tatuadora & Piercer",
            email: "sarah@inkstudio.com",
            phone: "(11) 98888-0002",
            portfolioLink: "https://instagram.com/sarah_arts",
            experience: "5 anos",
            styles: ["Neo Tradicional", "Colorido", "Botânico"],
            img: "https://images.unsplash.com/photo-1596204368623-2895f543666f?auto=format&fit=crop&q=80&w=400",
            rating: 5.0,
            ratingCount: 1450,
            bio: "Sarah traz cores vibrantes e linhas ousadas. Seu estilo Neo Tradicional combina o clássico com o moderno, criando peças únicas e cheias de vida.",
            portfolio: [
                { title: "Lady Rose", desc: "Rosto feminino estilizado com rosas vermelhas vibrantes.", img: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600" },
                { title: "Adaga & Coração", desc: "Clássico Neo Tradicional com paleta de cores outonal.", img: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600" }
            ]
        },
        // Adicione os outros artistas conforme necessário para o mock funcionar
        { id: 3, name: "Mika Chen", role: "Tatuador", img: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&q=80&w=400", rating: 4.8, ratingCount: 920, styles: ["Oriental"], bio: "Mestre em arte oriental.", email: "mika@ink.com", phone: "11 9999-9999", portfolioLink: "instagram.com/mika", experience: "8 anos", portfolio: [] },
        { id: 4, name: "Elena Rosa", role: "Tatuadora", img: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?q=80&w=400", rating: 4.9, ratingCount: 1105, styles: ["Fine Line"], bio: "Traços finos.", email: "elena@ink.com", phone: "11 9999-9999", portfolioLink: "instagram.com/elena", experience: "4 anos", portfolio: [] },
        { id: 5, name: "Lucas Silva", role: "Tatuador", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400", rating: 4.7, ratingCount: 320, styles: ["Blackwork"], bio: "Geometria sagrada.", email: "lucas@ink.com", phone: "11 9999-9999", portfolioLink: "instagram.com/lucas", experience: "3 anos", portfolio: [] },
        { id: 6, name: "Mariana Costa", role: "Tatuadora", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400", rating: 4.8, ratingCount: 580, styles: ["Aquarela"], bio: "Cores fluidas.", email: "mari@ink.com", phone: "11 9999-9999", portfolioLink: "instagram.com/mari", experience: "6 anos", portfolio: [] }
    ];

    useEffect(() => {
        if (artistId) {
            const found = artistsData.find(a => a.id === parseInt(artistId));
            if (found) setArtist(found);
        }
    }, [artistId]);

    if (!artist) return <div className="min-h-screen flex items-center justify-center text-text-muted">Carregando perfil...</div>;

    return (
        <div className="min-h-screen py-12 px-4 md:px-8 bg-background-dark">
            <div className="max-w-4xl mx-auto">
                {/* Header / Breadcrumb */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-text-muted hover:text-white mb-8 transition-colors text-sm font-bold uppercase tracking-wide">
                    <span className="material-symbols-outlined">arrow_back</span>
                    Voltar
                </button>

                {/* Main Content Box */}
                <div className="bg-[#121212] border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* Top Section: Avatar & Name */}
                    <div className="flex flex-col md:flex-row gap-8 items-start mb-12 relative z-10">
                        <div className="relative group">
                            <img
                                src={artist.img}
                                alt={artist.name}
                                className="size-32 md:size-40 rounded-2xl object-cover border-4 border-zinc-800 shadow-lg"
                            />
                        </div>

                        <div className="flex-1 pt-2">
                            <h1 className="font-display font-bold text-4xl text-white mb-2">{artist.name}</h1>

                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <p className="text-primary font-bold text-xs uppercase tracking-[0.2em]">{artist.role}</p>
                                <div className="hidden sm:block h-4 w-px bg-zinc-700"></div>
                                <div className="flex items-center gap-2 bg-surface-light/50 px-3 py-1 rounded-full border border-white/5">
                                    <span className="text-amber-500 font-bold text-sm">{artist.rating}</span>
                                    <span className="material-symbols-outlined text-amber-500 text-sm fill-current">star</span>
                                    <span className="text-zinc-400 text-xs font-medium border-l border-white/10 pl-2 ml-1">
                                        {artist.ratingCount?.toLocaleString('pt-BR') || 0} avaliações
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 block">NOME COMPLETO</label>
                                    <p className="text-white font-medium">{artist.name}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 block">E-MAIL</label>
                                    <p className="text-white font-medium">{artist.email}</p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 block">TELEFONE</label>
                                    <p className="text-white font-medium">{artist.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-zinc-800 w-full mb-10"></div>

                    {/* Section: Perfil Artístico */}
                    <div className="mb-12 relative z-10">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="material-symbols-outlined text-primary text-xl">palette</span>
                            <h2 className="text-lg font-bold text-white uppercase tracking-widest">PERFIL ARTÍSTICO</h2>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 block">LINK DO PORTFÓLIO</label>
                                <a href={artist.portfolioLink} target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                                    {artist.portfolioLink}
                                </a>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 block">TEMPO DE EXPERIÊNCIA</label>
                                <p className="text-white font-bold text-lg">{artist.experience}</p>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">ESPECIALIDADES</label>
                                <div className="flex flex-wrap gap-2">
                                    {artist.styles.map((style: string) => (
                                        <span key={style} className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs font-bold text-zinc-300">
                                            {style}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2 block">BIO / SOBRE</label>
                                <p className="text-zinc-300 text-sm leading-relaxed max-w-2xl">
                                    {artist.bio}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Section: Portfolio */}
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-xl">collections</span>
                                <h2 className="text-lg font-bold text-white uppercase tracking-widest">PORTFÓLIO</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {artist.portfolio.map((art: any, idx: number) => (
                                <div key={idx} className="group relative aspect-[3/4] overflow-hidden rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
                                    <img
                                        src={art.img}
                                        alt={art.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                            <h3 className="text-white font-display font-bold text-xl mb-2 leading-tight">{art.title}</h3>
                                            <div className="w-12 h-1 bg-primary mb-3 rounded-full"></div>
                                            <p className="text-zinc-300 text-xs leading-relaxed line-clamp-3">
                                                {art.desc}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {artist.portfolio.length === 0 && (
                                <div className="col-span-full py-12 text-center border border-dashed border-zinc-800 rounded-xl">
                                    <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">Nenhuma imagem disponível</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 translate-x-1/2"></div>
                </div>

                {/* Bottom CTA */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => navigate(`/book?artistId=${artist.id}`)}
                        className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(212,17,50,0.3)] hover:shadow-[0_0_40px_rgba(212,17,50,0.5)] transition-all transform hover:-translate-y-1 flex items-center gap-3"
                    >
                        Agendar com este Artista
                        <span className="material-symbols-outlined text-lg">calendar_today</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArtistProfile;
