import prisma from '../config/dbConfig.js';

class consultaService {
  static async agendarConsulta(data) {
    return await prisma.consulta.create({ data });
  }

  static async listarConsultas(filtros = {}) {
    const where = {};

    // filtro por data exata
    if (filtros.data) {
      const data = new Date(filtros.data);
      const diaSeguinte = new Date(data);
      diaSeguinte.setDate(data.getDate() + 1);

      where.date_time = {
        gte: data,
        lt: diaSeguinte,
      };
    }

    // filtro por intervalo de datas
    if (filtros.dataInicio || filtros.dataFim) {
      where.date_time = {
        ...(filtros.dataInicio && { gte: new Date(filtros.dataInicio) }),
        ...(filtros.dataFim && { lte: new Date(filtros.dataFim) }),
      };
    }

    // filtro por ID do paciente
    if (filtros.pacienteId) {
      where.paciente_id = Number(filtros.pacienteId);
    }

    // filtro por ID do médico
    if (filtros.medicoId) {
      where.medico_id = Number(filtros.medicoId);
    }
    
    if (filtros.paciente) {
      where.paciente = {
        user: {
          name: {
            contains: filtros.paciente,
          },
        },
      };
    }

    // filtro por status
    if (filtros.status) {
      where.status = filtros.status;
    }

    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 10;
    const skip = (page - 1) * limit;

    const consultas = await prisma.consulta.findMany({
      where,
      select: {
        id: true,
        date_time: true,
        status: true,
        paciente: {
          select: {
            id: true,
            history: true,
            allergies: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        medico: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        registros: true,
      },
      skip,
      take: limit,
      orderBy: {
        date_time: 'desc',
      },
    });

    const total = await prisma.consulta.count({ where });

    return {
      consultas,
      total,
      page,
      totalPage: Math.ceil(total / limit),
    };
  }

  static async listarConsultaPorId(id) {
    return await prisma.consulta.findUnique({
      where: { id },
      select: {
        id: true,
        date_time: true,
        status: true,
        description: true,
        paciente: {
          select: {
            id: true,
            history: true,
            allergies: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        medico: {
          select: {
            id: true,
            specialty: true,
            user: {
              select: {
                name: true,
                phone: true,
                email: true,
              },
            },
          },
        },
        registros: true,
      },
    });
  }

  static async atualizarConsulta(id, data) {
    return await prisma.consulta.update({
      where: { id },
      data,
    });
  }

  static async deletarConsulta(id) {
    return await prisma.consulta.delete({
      where: { id },
    });
  }

  static async existeConflitoHorario(medico_id, date_time) {
    return await prisma.consulta.findFirst({
      where: {
        medico_id,
        date_time: date_time,
        status: {
          in: ['agendado', 'realizado'],
        },
      },
    });
  }
}

export default consultaService;