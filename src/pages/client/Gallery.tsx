
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface GalleryImage {
    id: number;
    category: string;
    src: string;
    artistName: string;
    artistId: number;
    title?: string;
}

const Gallery: React.FC = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState("Todos");
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

    const categories = ["Todos", "Realismo", "Oriental", "Old School", "Fine Line", "Lettering", "Piercing", "Outros"];

    // Imagens locais atualizadas
    const images: GalleryImage[] = [
        // Realismo
        { id: 1, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista1.jpg", artistName: "Alex Rivera", artistId: 1, title: "Olho e Bússola Realista" },
        { id: 2, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista2.jpg", artistName: "Alex Rivera", artistId: 1, title: "Pantera Negra com Lótus" },
        { id: 3, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista4.jpg", artistName: "Alex Rivera", artistId: 1, title: "Yoshi Bordado" },
        // Oriental
        { id: 4, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental1.jpg", artistName: "Mika Chen", artistId: 3, title: "Irezumi Fechamento de Braços" },
        { id: 5, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental2.jpg", artistName: "Mika Chen", artistId: 3, title: "Geisha com Sakura" },
        { id: 6, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental3.jpg", artistName: "Mika Chen", artistId: 3, title: "Dragão Japonês" },
        // Old School
        { id: 7, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld1.jpg", artistName: "Lucas Vane", artistId: 2, title: "Aku Aku Crash Bandicoot" },
        { id: 8, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld2.jpg", artistName: "Rafael Santos", artistId: 7, title: "The Lovers - Carta de Tarô" },
        { id: 9, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld3.jpg", artistName: "Rafael Santos", artistId: 7, title: "Coração Sagrado com Adaga" },
        // Fine Line
        { id: 10, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine1.jpg", artistName: "Elena Rosa", artistId: 4, title: "Carpas Koi e Flores nas Costas" },
        { id: 11, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine2.jpg", artistName: "Lucas Ferreira", artistId: 5, title: "Cérebro, DNA e Coração" },
        { id: 12, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine3.jpg", artistName: "Elena Rosa", artistId: 4, title: "Rosto Feminino Interstellar" },
        // Oriental Extra
        { id: 13, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental4.jpg", artistName: "Mika Chen", artistId: 3, title: "Dragão Yin Yang" },
        { id: 14, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental5.jpg", artistName: "Mika Chen", artistId: 3, title: "Oriental Tradicional" },
        // Times
        { id: 15, category: "Times", src: "/src/assets/images/tattooPiercing/tattooTime1.jpg", artistName: "Alex Rivera", artistId: 1, title: "Águia e Símbolo Corinthians" },
        { id: 16, category: "Times", src: "/src/assets/images/tattooPiercing/tattooTime2.jpg", artistName: "Lucas Ferreira", artistId: 5, title: "Flamengo Geométrico" },
        { id: 17, category: "Times", src: "/src/assets/images/tattooPiercing/tattooTime3.jpg", artistName: "Rafael Santos", artistId: 7, title: "Galo Atlético Mineiro" },
        // Outros
        { id: 18, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooOutras1.jpg", artistName: "Elena Rosa", artistId: 4, title: "Polvo Fine Line" },
        { id: 19, category: "Pontilhismo", src: "/src/assets/images/tattooPiercing/tattooOutras2.jpg", artistName: "Lucas Ferreira", artistId: 5, title: "Água-viva Pontilhismo" },
        { id: 20, category: "Outros", src: "/src/assets/images/tattooPiercing/tattooOutras3.jpg", artistName: "André Costa", artistId: 6, title: "Medusa Blackwork Braço" },
        { id: 21, category: "Outros", src: "/src/assets/images/tattooPiercing/tattooOutras4.jpg", artistName: "André Costa", artistId: 6, title: "Medusa Blackwork Mão" },
        // Anime
        { id: 22, category: "Anime", src: "/src/assets/images/tattooPiercing/tattooAnime1.jpg", artistName: "André Costa", artistId: 6, title: "Zoro e Luffy One Piece" },
        { id: 23, category: "Anime", src: "/src/assets/images/tattooPiercing/tattooAnime3.jpg", artistName: "André Costa", artistId: 6, title: "Choso JJK Blackwork" },
        // Lettering
        { id: 24, category: "Lettering", src: "/src/assets/images/tattooPiercing/tattooCaligrafia1.jpg", artistName: "Juliana Mendes", artistId: 8, title: "Blessed Lettering" },
        { id: 25, category: "Lettering", src: "/src/assets/images/tattooPiercing/tattooCaligrafia2.jpg", artistName: "Juliana Mendes", artistId: 8, title: "Escrita nas Costas" },
        { id: 26, category: "Lettering", src: "/src/assets/images/tattooPiercing/tattooCaligrafia3.jpg", artistName: "Juliana Mendes", artistId: 8, title: "Frase no Braço" },
        // Piercing
        { id: 27, category: "Piercing", src: "/src/assets/images/tattooPiercing/piercing.jpg", artistName: "Elena Rosa", artistId: 4, title: "Aplicação de Piercing" },
        { id: 28, category: "Piercing", src: "/src/assets/images/tattooPiercing/piecing2.jpg", artistName: "Elena Rosa", artistId: 4, title: "Septo e Nostril" },
        { id: 29, category: "Piercing", src: "/src/assets/images/tattooPiercing/piecing4.jpg", artistName: "Elena Rosa", artistId: 4, title: "Sobrancelha Coração" },
        { id: 30, category: "Piercing", src: "/src/assets/images/tattooPiercing/piecing5.jpg", artistName: "Elena Rosa", artistId: 4, title: "Mix Orelha Prata" }
    ];

    const [searchTerm, setSearchTerm] = useState("");

    const normalizeText = (text: string) => {
        return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const filteredImages = images.filter(img => {
        const normalizedSearch = normalizeText(searchTerm);
        const matchesSearch = normalizeText(img.title || "").includes(normalizedSearch) ||
            normalizeText(img.artistName).includes(normalizedSearch);

        const matchesCategory = filter === "Todos"
            ? true
            : filter === "Outros"
                ? !["Realismo", "Oriental", "Old School", "Fine Line", "Lettering", "Piercing"].includes(img.category)
                : img.category === filter;

        return matchesSearch && matchesCategory;
    });

    const handleOpenDetails = (img: GalleryImage) => {
        setSelectedImage(img);
    };

    const handleCloseDetails = () => {
        setSelectedImage(null);
    };

    const handleNavigateToArtist = () => {
        if (selectedImage) {
            navigate(`/artist-profile?id=${selectedImage.artistId}`);
        }
    };

    return (
        <div className="py-12 px-6 max-w-7xl mx-auto min-h-screen">
            <div className="text-center mb-12 animate-fade-in">
                <h1 className="font-tattoo text-5xl md:text-6xl text-white mb-4">Galeria</h1>
                <p className="text-text-muted mb-8">Inspiração para sua próxima obra de arte.</p>

                {/* Filters */}
                {/* Search and Filters Bar */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-2xl mx-auto bg-surface p-2 rounded-2xl border border-white/5">
                    {/* Search Input */}
                    <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-zinc-500">search</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar tatuagem ou artista..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/20 text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-zinc-800 focus:border-primary focus:outline-none focus:bg-black/40 transition-all placeholder:text-zinc-600 shadow-sm"
                        />
                    </div>

                    {/* Category Dropdown */}
                    <div className="relative w-full md:w-1/2">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-zinc-500">filter_list</span>
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full bg-black/20 text-white text-sm rounded-xl pl-10 pr-10 py-3 border border-zinc-800 focus:border-primary focus:outline-none focus:bg-black/40 transition-all appearance-none cursor-pointer shadow-sm"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat} className="bg-zinc-900 text-white">
                                    {cat}
                                </option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-zinc-500 text-sm">expand_more</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Padronizado (Substituindo Columns/Masonry) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredImages.map((img) => (
                    <div key={img.id} className="group relative aspect-[3/5] rounded-2xl overflow-hidden bg-surface-dark border border-border-dark shadow-md">
                        <img src={img.src} alt={img.title || "Tattoo"} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">Feito por {img.artistName}</span>
                            <button
                                onClick={() => handleOpenDetails(img)}
                                className="px-6 py-2 border-2 border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                            >
                                Ver Detalhes
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal de Detalhes */}
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
                                src={selectedImage.src}
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
                                    Esse trabalho foi feito por <span className="text-primary block mt-1">{selectedImage.artistName}</span>
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

export default Gallery;
