import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatPhone(numero : string) {
  if (!numero) return '';
  const numeroLimpo = numero.replace(/\D/g, '');

  if (numeroLimpo.length === 11) {
    return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  
  if (numeroLimpo.length === 10) {
    return numeroLimpo.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }

  return numero;
}

export function formatDateBR(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Data não informada";
  try {
    const date = new Date(dateInput);
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data:", dateInput, error);
    return "Data inválida";
  }
}

export function formatTimeBR(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Hora não informada";
  try {
    const date = new Date(dateInput);
    const hour = date.getHours();
    const time = format(date, "HH:mm", { locale: ptBR });

    if (hour >= 0 && hour < 12) {
      return `${time} da manhã`;
    }
    if (hour >= 12 && hour < 18) {
      return `${time} da tarde`;
    }
    return `${time} da noite`;
  } catch (error) {
    console.error("Erro ao formatar hora:", dateInput, error);
    return "Hora inválida";
  }
}

export function formatDateTimeBR(dateInput: string | Date | undefined): string {
  if (!dateInput) return "Data não informada";
  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) {
      throw new Error("Data inválida recebida");
    }
    return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
  } catch (error) {
    console.error("Erro ao formatar data/hora:", dateInput, error);
    return "Data inválida";
  }
}