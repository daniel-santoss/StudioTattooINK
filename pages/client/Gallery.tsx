import React, { useState } from 'react';

const Gallery: React.FC = () => {
  const [filter, setFilter] = useState("Todos");

  const categories = ["Todos", "Realismo", "Oriental", "Old School", "Fine Line"];
  
  // Imagens placeholder simuladas
  const images = [
    { id: 1, category: "Realismo", src: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&q=80&w=600" },
    { id: 2, category: "Oriental", src: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&q=80&w=600" },
    { id: 3, category: "Old School", src: "https://images.unsplash.com/photo-1590246255075-e9b9c072b9a0?auto=format&fit=crop&q=80&w=600" },
    { id: 4, category: "Realismo", src: "https://images.unsplash.com/photo-1562962230-16bc46364924?auto=format&fit=crop&q=80&w=600" },
    { id: 5, category: "Fine Line", src: "https://images.unsplash.com/photo-1560707303-4e980c5c855c?auto=format&fit=crop&q=80&w=600" },
    { id: 6, category: "Oriental", src: "https://images.unsplash.com/photo-1621112904891-2867e0ce5854?auto=format&fit=crop&q=80&w=600" },
    { id: 7, category: "Fine Line", src: "https://images.unsplash.com/photo-1597850225642-42790b8f44d9?auto=format&fit=crop&q=80&w=600" },
    { id: 8, category: "Old School", src: "https://images.unsplash.com/photo-1590246067035-7c08252254d7?auto=format&fit=crop&q=80&w=600" },
  ];

  const filteredImages = filter === "Todos" 
    ? images 
    : images.filter(img => img.category === filter);

  return (
    <div className="py-12 px-6 max-w-7xl mx-auto">
       <div className="text-center mb-12">
        <h1 className="font-tattoo text-5xl md:text-6xl text-white mb-4">Galeria</h1>
        <p className="text-text-muted mb-8">Inspiração para sua próxima obra de arte.</p>
        
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                        filter === cat 
                        ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                        : 'bg-surface-light text-text-muted hover:bg-white/10 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredImages.map((img) => (
            <div key={img.id} className="break-inside-avoid relative group rounded-xl overflow-hidden bg-surface-dark border border-border-dark">
                <img src={img.src} alt="Tattoo" className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="px-6 py-2 border border-white text-white font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                        Ver Detalhes
                    </button>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default Gallery;