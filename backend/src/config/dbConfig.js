import { PrismaClient } from '../generated/prisma/index.js';

const prisma = new PrismaClient();

prisma.$connect()
  .then(() => {
    console.log('Conexão com o banco feita com sucesso!');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco:', err);
  });


export default prisma;
