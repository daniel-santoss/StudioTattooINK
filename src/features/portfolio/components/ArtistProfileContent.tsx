'use client';

import React from 'react';
import Link from 'next/link';

interface PortfolioItem {
  title: string;
  desc: string;
  img: string;
}

interface ArtistData {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  styles: string[];
  instagram: string;
  summary?: string;
  portfolio?: PortfolioItem[];
}

const ArtistProfileContent: React.FC<{ artist: ArtistData }> = ({ artist }) => {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <div className="w-40 h-40 rounded-2xl overflow-hidden border-2 border-primary flex-shrink-0">
            <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover object-top" />
          </div>
          <div className="flex-1">
            <h1 className="font-tattoo text-5xl text-white mb-2">{artist.name}</h1>
            <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">{artist.role}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {artist.styles.map(s => (
                <span key={s} className="text-xs uppercase font-bold text-text-muted bg-surface-dark px-3 py-1.5 rounded-lg border border-border-dark">
                  {s}
                </span>
              ))}
            </div>
            {artist.summary && (
              <div className="bg-surface-dark border border-border-dark rounded-xl p-4 relative mt-4">
                <div className="absolute -top-3 left-3 bg-background-dark px-2 py-0.5 rounded border border-primary/30 flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-[12px]">auto_awesome</span>
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Resumo IA</span>
                </div>
                <p className="text-sm text-zinc-300 italic leading-relaxed pt-2">&quot;{artist.summary}&quot;</p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <Link href={`/book?artistId=${artist.id}`} className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-primary/20 inline-flex items-center gap-2">
                Agendar Sessão <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Portfolio Grid */}
        {artist.portfolio && artist.portfolio.length > 0 && (
          <section>
            <h2 className="text-2xl font-display font-bold text-white mb-8">Portfólio</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.portfolio.map((item, idx) => (
                <div key={idx} className="aspect-[3/4] rounded-2xl overflow-hidden bg-black border border-border-dark group relative shadow-lg">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                    <h3 className="text-white font-black text-lg mb-2 leading-tight">{item.title}</h3>
                    <div className="w-10 h-0.5 bg-primary mb-3"></div>
                    <p className="text-zinc-300 text-xs font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ArtistProfileContent;
