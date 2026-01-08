
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

    const categories = ["Todos", "Realismo", "Oriental", "Old School", "Fine Line"];

    // Imagens locais atualizadas
    const images: GalleryImage[] = [
        // Realismo
        { id: 1, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista1.jpg", artistName: "Alex Rivera", artistId: 1, title: "Retrato Realista" },
        { id: 2, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista2.jpg", artistName: "Alex Rivera", artistId: 1, title: "Realismo Preto e Cinza" },
        { id: 3, category: "Realismo", src: "/src/assets/images/tattooPiercing/tattooRealista3.jpg", artistName: "Alex Rivera", artistId: 1, title: "Realismo Detalhado" },
        // Oriental
        { id: 4, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental1.jpg", artistName: "Mika Chen", artistId: 3, title: "Dragão Japonês" },
        { id: 5, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental2.jpg", artistName: "Mika Chen", artistId: 3, title: "Carpa Koi" },
        { id: 6, category: "Oriental", src: "/src/assets/images/tattooPiercing/tattooOriental3.jpg", artistName: "Mika Chen", artistId: 3, title: "Hannya Mask" },
        // Old School
        { id: 7, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld1.jpg", artistName: "Rafael Santos", artistId: 7, title: "Tradicional Americano" },
        { id: 8, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld2.jpg", artistName: "Rafael Santos", artistId: 7, title: "Old School Clássico" },
        { id: 9, category: "Old School", src: "/src/assets/images/tattooPiercing/tattooOld3.jpg", artistName: "Rafael Santos", artistId: 7, title: "Flash Tradicional" },
        // Fine Line
        { id: 10, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine1.jpg", artistName: "Elena Rosa", artistId: 4, title: "Traço Fino Delicado" },
        { id: 11, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine2.jpg", artistName: "Elena Rosa", artistId: 4, title: "Minimalismo" },
        { id: 12, category: "Fine Line", src: "/src/assets/images/tattooPiercing/tattooFine3.jpg", artistName: "Elena Rosa", artistId: 4, title: "Fine Line Floral" }
    ];

    const filteredImages = filter === "Todos"
        ? images
        : images.filter(img => img.category === filter);

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
                <div className="flex flex-wrap justify-center gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${filter === cat
                                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                                : 'bg-surface-light text-text-muted hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Padronizado (Substituindo Columns/Masonry) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredImages.map((img) => (
                    <div key={img.id} className="group relative aspect-[3/5] rounded-2xl overflow-hidden bg-surface-dark border border-border-dark shadow-md">
                        <img src={img.src} alt={img.title || "Tattoo"} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                            <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{img.category}</span>
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
