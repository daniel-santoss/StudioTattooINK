/** Regras de senha forte — fonte única usada pelo servidor (validação) e pelo cliente (checklist UX).
 *  Sem diretiva de ambiente — pode ser importado no servidor E no cliente. */

export interface RegraSenha {
  id: string;
  label: string; // texto no checklist (UX)
  erro: string; // mensagem retornada pelo servidor quando falha
  test: (senha: string) => boolean;
}

export const REGRAS_SENHA: RegraSenha[] = [
  { id: 'minLen', label: 'Pelo menos 8 caracteres', erro: 'A senha deve ter ao menos 8 caracteres.', test: (s) => s.length >= 8 },
  { id: 'upper', label: 'Pelo menos 1 letra maiúscula', erro: 'A senha deve conter ao menos 1 letra maiúscula.', test: (s) => /[A-Z]/.test(s) },
  { id: 'number', label: 'Pelo menos 1 número', erro: 'A senha deve conter ao menos 1 número.', test: (s) => /[0-9]/.test(s) },
  { id: 'special', label: 'Pelo menos 1 caractere especial (!@#$%&*)', erro: 'A senha deve conter ao menos 1 caractere especial (!@#$%&*).', test: (s) => /[!@#$%&*]/.test(s) },
];

/** Valida a força da senha. Retorna a mensagem da 1ª regra que falhou, ou null se válida. */
export function senhaForte(senha: string): string | null {
  const falha = REGRAS_SENHA.find((r) => !r.test(senha));
  return falha ? falha.erro : null;
}
