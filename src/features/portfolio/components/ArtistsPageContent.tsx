'use client';

import React from 'react';
import Link from 'next/link';
import Avatar from '@/shared/components/Avatar';

interface ArtistData {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  styles: string[];
  summary?: string;
}

const ArtistsPageContent: React.FC<{ artists: ArtistData[] }> = ({ artists }) => {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-tattoo text-5xl text-white mb-4">Nossos Artistas</h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Conheça os profissionais que fazem parte do Ink Studio. Cada artista traz um estilo único e anos de experiência.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {artists.map((artist) => (
            <Link
              key={artist.id}
              href={`/artists/${artist.id}`}
              className="group bg-surface-dark border border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
            >
              <div className="aspect-square overflow-hidden relative">
                {artist.avatarUrl ? (
                  <img src={artist.avatarUrl} alt={artist.name} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <Avatar src={null} name={artist.name} className="w-full h-full rounded-none" textClassName="text-7xl" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white mb-1 group-hover:text-primary transition-colors">{artist.name}</h3>
                <p className="text-text-muted text-xs uppercase tracking-wider mb-3">{artist.role}</p>
                <div className="flex flex-wrap gap-1.5">
                  {artist.styles.filter(s => s !== 'Tatuagem' && s !== 'Piercing').slice(0, 3).map((style) => (
                    <span key={style} className="text-[10px] uppercase font-bold text-text-muted bg-background-dark px-2 py-1 rounded border border-border-dark">
                      {style}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArtistsPageContent;
