import { format, parse, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function formatDate(data, fmt = "dd 'de' MMMM 'de' yyyy") {
  return format(data, fmt, { locale: ptBR });
}

export function formatDateTime(data) {
  return format(data, "dd/MM/yyyy HH:mm", { locale: ptBR });
}

export function formatISO(dataISO) {
  const data = parseISO(dataISO);
  return format(data, "dd/MM/yyyy", { locale: ptBR });
}

export function parseDateTimeToDate(dateStr) {
  return parse(dateStr, "dd/MM/yyyy HH:mm", new Date());
}
