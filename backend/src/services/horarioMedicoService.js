import { toZonedTime } from 'date-fns-tz';
import prisma from '../config/dbConfig.js';
import { addMinutes, endOfDay, format, startOfDay } from 'date-fns';

class horarioMedicoService {
  
  static async getAll() {
    const horarios = await prisma.horarioMedico.findMany({
      select: {
        id: true,
        medico_id: true,
        start_time: true,
        end_time: true,
      },
    });

    return horarios;
  }

  static async getById(id) {
    const horarios = await prisma.horarioMedico.findMany({
      where: { medico_id: id },
      select: {
        id: true,
        medico_id: true,
        start_time: true,
        end_time: true,
      },
    });

    if (!horarios || horarios.length === 0) return null;

    return horarios;
  }

  static async create(data) {
    return await prisma.horarioMedico.create({ data });
  }

  static async update(id, data) {
    const horarioExistente = await prisma.horarioMedico.update({
      where: { id },
      data,
    });

    return horarioExistente;
  }

  static async delete(id) {
    const horarioExistente = await prisma.horarioMedico.findUnique({
      where: { id },
    });

    if (!horarioExistente) return null;

    return await prisma.horarioMedico.delete({
      where: { id },
    });
  }

  static async getHorariosDisponiveis(medico_id, dataString) {
    const timeZone = 'America/Sao_Paulo';

    const horariosTrabalho = await prisma.horarioMedico.findMany({
      where: { medico_id },
    });

    if (!horariosTrabalho.length) {
      return [];
    }

    const dataAlvo = toZonedTime(`${dataString}T00:00:00`, timeZone);
    const inicioDoDia = startOfDay(dataAlvo);
    const fimDoDia = endOfDay(dataAlvo);

    const consultasDoDia = await prisma.consulta.findMany({
      where: {
        medico_id,
        date_time: {
          gte: inicioDoDia,
          lte: fimDoDia,
        },
      },
    });

    const consultasMarcadas = new Set(
      consultasDoDia.map(c => {
        const zoned = toZonedTime(c.date_time, timeZone);
        return format(zoned, 'HH:mm');
      }),
    );

    const horariosDisponiveis = [];

    for (const h of horariosTrabalho) {
      const startISOString = `${dataString}T${h.start_time}:00`;
      const endISOString = `${dataString}T${h.end_time}:00`;

      let slotAtual = toZonedTime(startISOString, timeZone);
      const fimDoExpediente = toZonedTime(endISOString, timeZone);

      while (slotAtual < fimDoExpediente) {
        const horaFormatada = format(slotAtual, 'HH:mm');

        if (!consultasMarcadas.has(horaFormatada)) {
          horariosDisponiveis.push(horaFormatada);
        }

        slotAtual = addMinutes(slotAtual, 60);
      }
    }

    return horariosDisponiveis;
  }
}

export default horarioMedicoService;
