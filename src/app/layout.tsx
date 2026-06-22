import type { Metadata } from 'next';
import { Space_Grotesk, Noto_Sans, Inter } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const notoSans = Noto_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ink Studio — Tatuagem & Piercing',
    template: '%s | Ink Studio',
  },
  description:
    'Conectamos você aos melhores tatuadores e body piercers do mercado. Explore portfólios, descubra designs exclusivos e agende sua sessão.',
  keywords: ['tatuagem', 'tattoo', 'piercing', 'estúdio', 'agendamento', 'ink studio'],
  openGraph: {
    title: 'Ink Studio — Tatuagem & Piercing',
    description:
      'Conectamos você aos melhores tatuadores e body piercers do mercado.',
    type: 'website',
    locale: 'pt_BR',
    siteName: 'Ink Studio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ink Studio — Tatuagem & Piercing',
    description:
      'Conectamos você aos melhores tatuadores e body piercers do mercado.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`dark ${spaceGrotesk.variable} ${notoSans.variable} ${inter.variable}`}
    >
      <head>
        {/* UnifrakturMaguntia — loaded externally since next/font may not support all decorative fonts reliably */}
        <link
          href="https://fonts.googleapis.com/css2?family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols Outlined */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
