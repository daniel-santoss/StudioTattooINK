// ========================================
// Domain Types — Studio Tattoo INK
// ========================================

export interface Appointment {
  id: string;
  clientName: string;
  artistName: string;
  service: string;
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: 'completed' | 'in-progress' | 'available' | 'upcoming' | 'blocked';
  description?: string;
  avatarUrl?: string;
  date?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  totalSessions: number;
  status: 'active' | 'inactive' | 'vip' | 'prospect';
  avatarUrl?: string;
}

export interface Artwork {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  date?: string;
}

export interface Artist {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  styles: string[];
  instagram: string;
  portfolio?: Artwork[];
  rating?: number;
  ratingCount?: number;
  summary?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}

export interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  trend?: string;
}

// ========================================
// Matchmaker Types
// ========================================

export interface MatchPreferences {
  serviceType: string;
  style: string;
  placement: string;
  color: string;
}

export interface MatchArtist {
  id: number;
  name: string;
  styles: string[];
  img: string;
  rating: number;
  ratingCount: number;
  summary: string;
  portfolio: MatchPortfolioItem[];
}

export interface MatchPortfolioItem {
  title: string;
  desc: string;
  img: string;
}

export interface MatchResult {
  artist: MatchArtist;
  score: number;
}

// ========================================
// API Response Types
// ========================================

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

// ========================================
// Auth Types
// ========================================

export type UserRole = 'client' | 'artist' | 'admin';

export interface AuthUser {
  role: UserRole;
  name: string;
}

// ========================================
// Gallery Types
// ========================================

export interface GalleryItem {
  id: number;
  title: string;
  artist: string;
  artistId: number;
  category: string;
  imageUrl: string;
  description?: string;
}

// ========================================
// Review Types
// ========================================

export interface Review {
  id: number;
  rating: number;
  comment: string;
  date: string;
  service: string;
}
