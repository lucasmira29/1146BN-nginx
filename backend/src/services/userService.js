// 1146BN-nginx/backend/src/services/userService.js

import prisma from '../config/dbConfig.js';

class userService {

  static async createOrUpdateUserFromEvent(eventData) {
    const { userId, email, name, role } = eventData;

    console.log(`[UserSync] Sincronizando usuário: ${email} (ID: ${userId})`);

    return prisma.$transaction(async (tx) => {
      

      const user = await tx.user.upsert({
        where: { id: userId },
        update: {
          name,
          email,
          role: role.toLowerCase(), 
        },
        create: {
          id: userId,
          name,
          email,
          document: 'PENDENTE',
          birthdate: new Date('1900-01-01'), 
          postal_code: '00000000',
          role: role.toLowerCase(),
        },
      });

      const roleLower = role.toLowerCase();
      
      if (roleLower === 'paciente') {
        await tx.paciente.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId },
        });
      } else if (roleLower === 'medico') {
        await tx.medico.upsert({
          where: { id: userId },
          update: {
          }, 
          create: { 
            id: userId,
            specialty: 'A definir',
          },
        });
      } else if (roleLower === 'recepcionista') {
        await tx.recepcionista.upsert({
          where: { id: userId },
          update: {},
          create: { id: userId },
        });
      }
      
      console.log(`[UserSync] Usuário ${email} sincronizado com perfil de ${roleLower}.`);
      return user;
    });
  }


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
      Medico: undefined,
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
