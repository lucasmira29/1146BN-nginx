import prisma from '../config/dbConfig.js';

class pacienteService {
  static async createPaciente(userData, pacienteData) {
    return prisma.$transaction(async (tx) => {

      const user = await tx.user.create({
        data: {
          ...userData,
        },
      });

      const paciente = await tx.paciente.create({
        data: {
          id: user.id,
          ...pacienteData,
        },
      });

      return { user, paciente };
    });
  }

  static async getAllPacientes(filtros) {
    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 10;
    const skip = (page - 1) * limit;

    const userWhere = {
      deleted_at: null,
    };

    if (filtros.name) {
      userWhere.name = { contains: filtros.name };
    }

    if (filtros.email) {
      userWhere.email = { contains: filtros.email };
    }

    if (filtros.role) {
      userWhere.role = filtros.role;
    }

    if (filtros.document) {
      userWhere.document = { contains: filtros.document };
    }

    const pacientes = await prisma.paciente.findMany({
      where: {
        user: userWhere,
      },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            document: true,
            birthdate: true,
            phone: true,
            postal_code: true,
            email: true,
            role: true,
          },
        },
        history: true,
        allergies: true,
      },
      skip,
      take: limit,
      orderBy: {
        id: 'desc',
      },
    });

    const total = await prisma.paciente.count({
      where: {
        user: userWhere,
      },
    });

    return {
      pacientes,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }


  static async getPacienteById(id) {
    return await prisma.paciente.findUnique({
      where: { id },
      select: {
        id: true,
        user: {
          select: {
            name: true,
            document: true,
            birthdate: true,
            phone: true,
            postal_code: true,
            email: true,
            role: true,
          },
        },
        history: true,
        allergies: true,
      },
    });
  }

  static async updatePaciente(id, newData) {
    return await prisma.user.update({
      where: { id },
      data: newData,
    });
  }

  static async deletePaciente(id) {
    return await prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
      },
    });
  }
}

export default pacienteService;
