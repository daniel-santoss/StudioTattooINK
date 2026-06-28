// Regras do @username de profissional (puras — usadas no front e no servidor).
// Aceita apenas letras minúsculas, números, "_" e "."; 3–30 chars; sem espaço/acento.

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 30;
export const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;

/**
 * Normaliza o que o usuário digita: minúsculo e sem caracteres inválidos.
 * `normalize('NFD')` decompõe acentos; o filtro [^a-z0-9._] remove as marcas resultantes.
 */
export function normalizeUsername(raw: string): string {
  return raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9._]/g, '')
    .slice(0, USERNAME_MAX);
}

export function usernameValido(u: string): boolean {
  return USERNAME_REGEX.test(u);
}

/** Mensagem de erro de formato (ou null se válido). */
export function erroFormatoUsername(u: string): string | null {
  if (u.length < USERNAME_MIN) return `Mínimo de ${USERNAME_MIN} caracteres.`;
  if (u.length > USERNAME_MAX) return `Máximo de ${USERNAME_MAX} caracteres.`;
  if (!USERNAME_REGEX.test(u)) return 'Use apenas letras, números, "_" e ".".';
  return null;
}
