
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
            img: "/src/assets/images/tatuadores/tatuador1.jpg",
            rating: 4.7,
            ratingCount: 2899,
            bio: "Especialista em realismo preto e cinza com mais de 10 anos de mercado. Busco sempre eternizar momentos e histórias na pele dos meus clientes com a máxima precisão.",
            portfolio: [
                { title: "Olho e Bússola Realista", desc: "Composição com olho realista, bússola e fases da lua.", img: "/src/assets/images/tattooPiercing/tattooRealista1.jpg" },
                { title: "Pantera Negra com Lótus", desc: "Pantera negra em preto e cinza com flor de lótus.", img: "/src/assets/images/tattooPiercing/tattooRealista2.jpg" },
                { title: "Águia Realista Corinthians", desc: "Realismo preto e cinza com escudo do Corinthians.", img: "/src/assets/images/tattooPiercing/tattooTime1.jpg" },
                { title: "Yoshi Bordado", desc: "Tatuagem realista do Yoshi com efeito de bordado.", img: "/src/assets/images/tattooPiercing/tattooRealista4.jpg" }
            ]
        },
        {
            id: 2,
            name: "Lucas Vane",
            role: "Tatuador & Piercer",
            email: "lucas@inkstudio.com",
            phone: "(11) 98888-0002",
            portfolioLink: "https://instagram.com/lucasvane_ink",
            experience: "5 anos",
            styles: ["Neo Tradicional", "Colorido", "Botânico"],
            img: "/src/assets/images/tatuadores/tatuador2.jpg",
            rating: 5.0,
            ratingCount: 1450,
            bio: "Lucas traz cores vibrantes e linhas ousadas. Seu estilo Neo Tradicional combina o clássico com o moderno, criando peças únicas e cheias de vida.",
            portfolio: [
                { title: "Aku Aku Crash Bandicoot", desc: "Máscara Aku Aku do Crash Bandicoot em cores vibrantes estilo Neo Tradicional.", img: "/src/assets/images/tattooPiercing/tattooOld1.jpg" }
            ]
        },
        {
            id: 3,
            name: "Mika Chen",
            role: "Tatuadora",
            img: "/src/assets/images/tatuadores/tatuador3.jpg",
            rating: 4.8,
            ratingCount: 920,
            styles: ["Oriental", "Irezumi", "Dragões"],
            bio: "Mestre em arte oriental com foco em Irezumi tradicional japonês.",
            email: "mika@inkstudio.com",
            phone: "(11) 99999-0003",
            portfolioLink: "instagram.com/mikachen_ink",
            experience: "8 anos",
            portfolio: [
                { title: "Irezumi Fechamento de Braços", desc: "Fechamento completo de braços e ombros estilo Irezumi com ondas e flores de sakura.", img: "/src/assets/images/tattooPiercing/tattooOriental1.jpg" },
                { title: "Geisha com Sakura", desc: "Geisha com guarda-sol vermelho e flores de cerejeira.", img: "/src/assets/images/tattooPiercing/tattooOriental2.jpg" },
                { title: "Dragão Japonês", desc: "Dragão japonês nas costas com flores.", img: "/src/assets/images/tattooPiercing/tattooOriental3.jpg" },
                { title: "Dragão Yin Yang", desc: "Dragão estilo oriental em preto e cinza envolvendo símbolo Yin Yang.", img: "/src/assets/images/tattooPiercing/tattooOriental4.jpg" }
            ]
        },
        {
            id: 4,
            name: "Elena Rosa",
            role: "Tatuadora & Piercer",
            img: "/src/assets/images/tatuadores/tatuador4.jpg",
            rating: 4.9,
            ratingCount: 1105,
            styles: ["Fine Line", "Minimalismo", "Escrita"],
            bio: "Especialista em traços finos e delicados.",
            email: "elena@inkstudio.com",
            phone: "(11) 99999-0004",
            portfolioLink: "instagram.com/elenarosa_ink",
            experience: "4 anos",
            portfolio: [
                { title: "Carpas Koi e Flores nas Costas", desc: "Fechamento de costas com carpas koi, peônias e fases da lua.", img: "/src/assets/images/tattooPiercing/tattooFine1.jpg" },
                { title: "Rosto Feminino Interstellar", desc: "Rosto feminino abstrato com tema espacial.", img: "/src/assets/images/tattooPiercing/tattooFine3.jpg" },
                { title: "Piercing", desc: "Aplicação de joia em titânio com pedras swarovski.", img: "/src/assets/images/tattooPiercing/piercing.jpg" },
                { title: "Polvo Fine Line", desc: "Polvo detalhado em traços finos e delicados.", img: "/src/assets/images/tattooPiercing/tattooOutras1.jpg" },
                { title: "Septo e Nostril", desc: "Combinação delicada de piercing no septo e nostril com joias douradas.", img: "/src/assets/images/tattooPiercing/piecing2.jpg" },
                { title: "Sobrancelha Coração", desc: "Joia em formato de coração aplicada na sobrancelha.", img: "/src/assets/images/tattooPiercing/piecing4.jpg" },
                { title: "Mix Orelha Prata", desc: "Composição completa na orelha com joias prateadas e correntes.", img: "/src/assets/images/tattooPiercing/piecing5.jpg" }
            ]
        },
        {
            id: 5,
            name: "Lucas Ferreira",
            role: "Tatuador",
            img: "/src/assets/images/tatuadores/tatuador5.jpg",
            rating: 4.5,
            ratingCount: 780,
            styles: ["Blackwork", "Geométrico", "Pontilhismo"],
            bio: "Geometria sagrada e padrões complexos.",
            email: "lucasf@inkstudio.com",
            phone: "(11) 99999-0005",
            portfolioLink: "instagram.com/lucasferreira_ink",
            experience: "3 anos",
            portfolio: [
                { title: "Cérebro, DNA e Coração", desc: "Composição fine line com cérebro, hélice de DNA e coração anatômico.", img: "/src/assets/images/tattooPiercing/tattooFine2.jpg" },
                { title: "Flamengo Geométrico", desc: "Homenagem ao Flamengo com elementos geométricos e coração anatômico.", img: "/src/assets/images/tattooPiercing/tattooTime2.jpg" },
                { title: "Água-viva Pontilhismo", desc: "Água-viva detalhada feita em pontilhismo.", img: "/src/assets/images/tattooPiercing/tattooOutras2.jpg" }
            ]
        },
        {
            id: 6,
            name: "André Costa",
            role: "Tatuador",
            img: "/src/assets/images/tatuadores/tatuador6.jpg",
            rating: 4.9,
            ratingCount: 1230,
            styles: ["Aquarela", "Colorido", "Sketch"],
            bio: "Cores fluidas e efeitos de pintura na pele.",
            email: "andre@inkstudio.com",
            phone: "(11) 99999-0006",
            portfolioLink: "instagram.com/andrecosta_ink",
            experience: "6 anos",
            portfolio: [
                { title: "Medusa Blackwork Braço", desc: "Medusa mitológica em blackwork com pontilhismo e serpentes detalhadas.", img: "/src/assets/images/tattooPiercing/tattooOutras3.jpg" },
                { title: "Zoro e Luffy One Piece", desc: "Roronoa Zoro e Monkey D. Luffy do anime One Piece em estilo sketch preto e cinza.", img: "/src/assets/images/tattooPiercing/tattooAnime1.jpg" },
                { title: "Medusa Blackwork Mão", desc: "Medusa em blackwork cobrindo dorso da mão com serpentes que se estendem pelos dedos.", img: "/src/assets/images/tattooPiercing/tattooOutras4.jpg" },
                { title: "Choso JJK Blackwork", desc: "Choso de JJK em estilo blackwork detalhado.", img: "/src/assets/images/tattooPiercing/tattooAnime3.jpg" }
            ]
        },
        {
            id: 7,
            name: "Rafael Santos",
            role: "Tatuador",
            img: "/src/assets/images/tatuadores/tatuador7.jpg",
            rating: 4.4,
            ratingCount: 650,
            styles: ["Old School", "Tradicional", "Flash"],
            bio: "Estilo clássico americano com cores sólidas.",
            email: "rafael@inkstudio.com",
            phone: "(11) 99999-0007",
            portfolioLink: "instagram.com/rafaelsantos_ink",
            experience: "7 anos",
            portfolio: [
                { title: "The Lovers - Carta de Tarô", desc: "Carta de tarô com mulher, caveira e dados.", img: "/src/assets/images/tattooPiercing/tattooOld2.jpg" },
                { title: "Coração Sagrado com Adaga", desc: "Coração sagrado atravessado por adaga com chamas.", img: "/src/assets/images/tattooPiercing/tattooOld3.jpg" },
                { title: "Galo Atlético Mineiro", desc: "Escudo e mascote do Atlético Mineiro em estilo Old School/Realismo.", img: "/src/assets/images/tattooPiercing/tattooTime3.jpg" }
            ]
        },
        {
            id: 8,
            name: "Juliana Mendes",
            role: "Tatuadora",
            img: "/src/assets/images/tatuadores/tatuador8.jpg",
            rating: 4.6,
            ratingCount: 890,
            styles: ["Lettering", "Script", "Chicano"],
            bio: "Especialista em tipografia e caligrafia artística.",
            email: "juliana@inkstudio.com",
            phone: "(11) 99999-0008",
            portfolioLink: "instagram.com/julianamendes_ink",
            experience: "5 anos",
            portfolio: [
                { title: "Blessed Lettering", desc: "Caligrafia 'Blessed' no pescoço.", img: "/src/assets/images/tattooPiercing/tattooCaligrafia1.jpg" },
                { title: "Escrita nas Costas", desc: "Texto longo em caligrafia fina nas costas.", img: "/src/assets/images/tattooPiercing/tattooCaligrafia2.jpg" },
                { title: "Frase no Braço", desc: "Frase motivacional com fonte cursiva no braço.", img: "/src/assets/images/tattooPiercing/tattooCaligrafia3.jpg" }
            ]
        }
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
