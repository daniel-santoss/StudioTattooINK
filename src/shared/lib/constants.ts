// ========================================
// Application Constants
// ========================================

export const APP_NAME = 'Ink Studio';
export const APP_DESCRIPTION =
  'Conectamos você aos melhores tatuadores e body piercers do mercado.';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://inkstudio.vercel.app';

export const COLORS = {
  primary: '#d41132',
  primaryHover: '#b00e29',
  backgroundDark: '#0a0a0a',
  surfaceDark: '#161616',
  surfaceLight: '#262626',
  borderDark: '#2e2e2e',
  textMuted: '#a3a3a3',
} as const;
