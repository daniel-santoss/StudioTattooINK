'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { GalleryItem } from '@/shared/types';

interface GalleryData {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  category: string;
  imageUrl: string;
}

const GalleryPageContent: React.FC<{ gallery: GalleryData[] }> = ({ gallery }) => {
  const router = useRouter();
  const [selectedItem, setSelectedItem] = useState<GalleryData | null>(null);
  const [filter, setFilter] = useState('Todos');

  const categories = ['Todos', ...Array.from(new Set(gallery.map(g => g.category)))];
  const filteredGallery = filter === 'Todos' ? gallery : gallery.filter(g => g.category === filter);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="font-tattoo text-5xl text-white mb-4">Galeria</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Explore os trabalhos dos nossos artistas. Cada peça é única e feita com excelência.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all ${
                filter === cat
                  ? 'bg-primary text-white border-primary'
                  : 'bg-surface-dark text-text-muted border-border-dark hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGallery.map((item) => (
            <div
              key={item.id}
              className="aspect-[3/4] rounded-2xl overflow-hidden bg-surface-dark border border-white/5 relative shadow-lg group cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <img src={item.imageUrl} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" alt={item.title} />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4 backdrop-blur-sm">
                <span className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">{item.title}</span>
                <span className="text-text-muted text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">por {item.artist}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-fade-in" onClick={() => setSelectedItem(null)}>
          <div className="bg-[#121212] border border-zinc-800 w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-10 size-10 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors flex items-center justify-center">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="w-full md:w-1/2 bg-black">
              <img src={selectedItem.imageUrl} alt={selectedItem.title} className="w-full h-full object-cover max-h-[60vh] md:max-h-[80vh]" />
            </div>
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <h3 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-2">{selectedItem.category}</h3>
              <h2 className="text-3xl font-display font-bold text-white mb-2">{selectedItem.title}</h2>
              <p className="text-text-muted text-sm mb-8">por <span className="text-primary font-bold">{selectedItem.artist}</span></p>
              <button onClick={() => router.push(`/artists/${selectedItem.artistId}`)} className="w-full py-4 bg-primary hover:bg-primary-hover text-white rounded-xl font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                Ver Artista <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPageContent;
