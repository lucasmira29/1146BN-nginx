import prisma from '../config/dbConfig.js';

class userService {
  static async updateAdmin(id, newData) {
    return await prisma.user.update({
      where: { id, role: 'admin' },
      data: newData,
    });
  }

  static async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        document: true,
        birthdate: true,
        phone: true,
        postal_code: true,
        email: true,
        role: true,
        Medico: {
          select: {
            specialty: true,
          },
        },
      },
    });

    if (!user) return null;

    return {
      ...user,
      specialty: user.Medico?.specialty || null,
      Medico: undefined, // remove o campo Medico
    };
  }

  static async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  static async filtrarUsuarios(filtros) {
    const where = {};

    if (filtros.name) {
      where.name = { contains: filtros.name };
    }

    if (filtros.email) {
      where.email = { contains: filtros.email };
    }

    if (filtros.role) {
      where.role = filtros.role;
    }

    if (filtros.document) {
      where.document = { contains: filtros.document };
    }

    if (filtros.status) {
      where.status = filtros.status;
    }

    const page = parseInt(filtros.page) || 1;
    const limit = parseInt(filtros.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await prisma.user.findMany({
      where,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        document: true,
        birthdate: true,
        phone: true,
        postal_code: true,
        email: true,
        role: true,
      },
      orderBy: { created_at: 'desc' },
    });

    const total = await prisma.user.count({ where });

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default userService;
