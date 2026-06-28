import React from 'react';

// Avatar reutilizável: mostra a foto quando existe; senão, um círculo colorido
// com a inicial do nome (cor determinística pelo nome). Evita foto-padrão genérica.

const CORES = [
  'bg-rose-600', 'bg-pink-600', 'bg-fuchsia-600', 'bg-purple-600', 'bg-indigo-600',
  'bg-blue-600', 'bg-cyan-600', 'bg-teal-600', 'bg-emerald-600', 'bg-amber-600', 'bg-orange-600',
];

function corDoNome(nome: string): string {
  let h = 0;
  for (let i = 0; i < nome.length; i++) h = (h * 31 + nome.charCodeAt(i)) >>> 0;
  return CORES[h % CORES.length];
}

function inicial(nome: string): string {
  const t = nome.trim();
  return t ? t[0].toUpperCase() : '?';
}

interface AvatarProps {
  src?: string | null;
  name: string;
  /** classes de tamanho/forma (default: size-10 rounded-full) */
  className?: string;
  /** classe do tamanho da letra (default: text-base) */
  textClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, name, className = 'size-10 rounded-full', textClassName = 'text-base' }) => {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${className} object-cover bg-background-dark border border-border-dark`}
      />
    );
  }
  return (
    <div
      className={`${className} ${corDoNome(name)} flex items-center justify-center border border-white/10 select-none`}
      aria-label={name}
      title={name}
    >
      <span className={`${textClassName} font-bold text-white leading-none`}>{inicial(name)}</span>
    </div>
  );
};

export default Avatar;
