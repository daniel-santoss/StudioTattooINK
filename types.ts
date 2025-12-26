
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
