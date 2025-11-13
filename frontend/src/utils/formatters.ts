
export function formatPhone(numero : string) {

  const numeroLimpo = numero.replace(/\D/g, '');

  if (numeroLimpo.length === 11) {
    return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }

  return numero;
}
