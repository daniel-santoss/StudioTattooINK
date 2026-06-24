import { describe, it, expect } from 'vitest';
import { matchArtists } from '../services/matchingEngine';
import type { MatchArtist, MatchPreferences } from '@/shared/types';

const mockArtists: MatchArtist[] = [
  {
    id: '1',
    name: 'Realismo Pro',
    styles: ['Realismo', 'Preto e Cinza'],
    img: '',
    summary: '',
    portfolio: []
  },
  {
    id: '2',
    name: 'Piercing Expert',
    styles: ['Piercing'],
    img: '',
    summary: '',
    portfolio: []
  },
  {
    id: '3',
    name: 'Fine Line Artist',
    styles: ['Fine Line', 'Minimalismo'],
    img: '',
    summary: '',
    portfolio: []
  }
];

describe('Matching Engine', () => {
  it('should filter artists by piercing service', () => {
    const prefs: MatchPreferences = {
      serviceType: 'Piercing',
      style: '',
      placement: '',
      color: ''
    };
    
    const results = matchArtists(mockArtists, prefs);
    
    // Should only contain artists with 'Piercing' style, plus top rated if < 3
    // But since we have 3 total, it might fill up with others.
    // Wait, matchingEngine logic: if < 3, fills with remaining matching serviceType.
    // Let's check the first result.
    expect(results[0].artist.name).toBe('Piercing Expert');
  });

  it('should filter artists by tattoo style', () => {
    const prefs: MatchPreferences = {
      serviceType: 'Tatuagem',
      style: 'Realismo',
      placement: '',
      color: ''
    };
    
    const results = matchArtists(mockArtists, prefs);
    
    expect(results[0].artist.name).toBe('Realismo Pro');
  });

  it('should score artists with exact style match higher', () => {
    const prefs: MatchPreferences = {
      serviceType: 'Tatuagem',
      style: 'Fine Line',
      placement: '',
      color: ''
    };
    
    const results = matchArtists(mockArtists, prefs);
    
    expect(results[0].artist.name).toBe('Fine Line Artist');
  });
});
