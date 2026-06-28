// Máscaras e validações de formato (puras — usadas no front e no servidor).

export function soDigitos(v: string): string {
  return v.replace(/\D/g, '');
}

/** Máscara progressiva de CPF: 000.000.000-00 */
export function maskCPF(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length > 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  if (d.length > 6) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  if (d.length > 3) return `${d.slice(0, 3)}.${d.slice(3)}`;
  return d;
}

/** Máscara de telefone: (00) 0000-0000 ou (00) 00000-0000 */
export function maskTelefone(v: string): string {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

/** Validação matemática de CPF (11 dígitos + dígitos verificadores). */
export function cpfValido(v: string): boolean {
  const c = soDigitos(v);
  if (c.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(c)) return false; // rejeita sequências iguais (000..., 111...)

  const dv = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) soma += parseInt(base[i], 10) * (pesoInicial - i);
    const resto = 11 - (soma % 11);
    return resto >= 10 ? 0 : resto;
  };

  return dv(c.slice(0, 9), 10) === parseInt(c[9], 10) && dv(c.slice(0, 10), 11) === parseInt(c[10], 10);
}

export function telefoneValido(v: string): boolean {
  const n = soDigitos(v).length;
  return n === 10 || n === 11;
}
