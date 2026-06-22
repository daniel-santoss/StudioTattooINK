import type { MatchArtist, MatchPreferences, MatchResult } from '@/shared/types';

/**
 * Matching Engine — Lógica pura de recomendação de artistas.
 *
 * Função pura sem dependência de React. Recebe preferências e lista de artistas,
 * retorna artistas ordenados por relevância.
 *
 * Design: Preparada para futura integração com IA real — a interface aceita
 * qualquer implementação que respeite MatchPreferences → MatchResult[].
 */

/**
 * Interface para futuras implementações de matching (e.g., ML-based).
 */
export interface IMatchingEngine {
  match(artists: MatchArtist[], preferences: MatchPreferences): MatchResult[];
}

/**
 * Implementação atual: filtragem baseada em regras.
 */
export function matchArtists(
  artists: MatchArtist[],
  preferences: MatchPreferences
): MatchResult[] {
  // Filtragem base
  let results = artists.filter((artist) => {
    // Filtro por tipo de serviço
    if (
      preferences.serviceType === 'Piercing' &&
      !artist.styles.includes('Piercing')
    ) {
      return false;
    }

    // Se for tatuagem, filtra por estilo
    if (preferences.serviceType === 'Tatuagem') {
      return (
        artist.styles.some((s) =>
          s.toLowerCase().includes(preferences.style.toLowerCase())
        ) || preferences.style === 'Outros'
      );
    }

    return true;
  });

  // Se sobrar poucos, preenche com os melhores avaliados (respeitando o tipo de serviço)
  if (results.length < 3) {
    const remaining = artists
      .filter(
        (a) =>
          !results.includes(a) &&
          (preferences.serviceType === 'Tatuagem'
            ? true
            : a.styles.includes('Piercing'))
      )
      .sort((a, b) => b.rating - a.rating);
    results = [...results, ...remaining].slice(0, 3);
  }

  // Calcular score de relevância
  return results.map((artist) => ({
    artist,
    score: calculateScore(artist, preferences),
  })).sort((a, b) => b.score - a.score);
}

/**
 * Calcula um score de relevância (0-100) para um artista dado as preferências.
 */
function calculateScore(
  artist: MatchArtist,
  preferences: MatchPreferences
): number {
  let score = 50; // base

  // Bonus por match de estilo direto
  if (
    artist.styles.some((s) =>
      s.toLowerCase().includes(preferences.style.toLowerCase())
    )
  ) {
    score += 30;
  }

  // Bonus por rating
  score += artist.rating * 4; // max +20

  // Bonus por volume de avaliações (popularidade)
  if (artist.ratingCount > 1000) score += 5;

  return Math.min(100, score);
}

/**
 * Retorna as opções de estilos disponíveis para o wizard.
 */
export function getTattooStyles() {
  return [
    { label: 'Realismo', icon: 'face' },
    { label: 'Fine Line', icon: 'edit' },
    { label: 'Oriental', icon: 'dragon' },
    { label: 'Old School', icon: 'anchor' },
    { label: 'Neo Tradicional', icon: 'local_florist' },
    { label: 'Outros', icon: 'more_horiz' },
  ];
}

export function getPiercingTypes() {
  return [
    { label: 'Orelha (Lóbulo/Helix)', icon: 'hearing' },
    { label: 'Facial (Nariz/Sobranc.)', icon: 'face_3' },
    { label: 'Oral (Labret/Língua)', icon: 'sentiment_satisfied' },
    { label: 'Corporal (Umbigo/Mamilo)', icon: 'accessibility_new' },
    { label: 'Genital', icon: 'wc' },
    { label: 'Microdermal', icon: 'diamond' },
  ];
}

export function getPlacementOptions() {
  return [
    'Braço / Antebraço',
    'Perna / Coxa',
    'Costas',
    'Peito',
    'Mãos / Pés',
    'Pescoço / Rosto',
  ];
}
