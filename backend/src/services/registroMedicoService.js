import prisma from '../config/dbConfig.js';

class registroMedicoService {
  static async criarRegistro(data) {
    return await prisma.registroMedico.create({ data });
  }

  static async atualizarRegistro(id, data) {
    return await prisma.registroMedico.update({
      where: { id },
      data,
    });
  }

  static async buscarPorConsulta(consultaId) {
    return await prisma.registroMedico.findFirst({
      where: { consulta_id: consultaId },
      include: {
        medico: {
          select: {
            id: true,
            specialty: true,
            user: { select: { name: true } },
          },
        },
        paciente: {
          select: {
            id: true,
            history: true,
            allergies: true,
            user: { select: { name: true } },
          },
        },
      },
    });
  }

  static async listarPorPaciente(pacienteId) {
    return await prisma.registroMedico.findMany({
      where: { paciente_id: pacienteId },
      orderBy: { created_at: 'desc' },
      include: {
        consulta: {
          select: {
            date_time: true,
            status: true,
            description: true,
          },
        },
        medico: {
          select: {
            specialty: true,
            user: { select: { name: true } },
          },
        },
      },
    });
  }
}

export default registroMedicoService;
