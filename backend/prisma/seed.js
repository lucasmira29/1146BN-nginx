// 1146BN-nginx/backend/prisma/seed.js

import { PrismaClient } from '../src/generated/prisma/index.js';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o processo de seed...');

  // --- 1. Limpeza do Banco de Dados ---
  console.log('Limpando o banco de dados existente...');
  await prisma.horarioMedico.deleteMany({});
  await prisma.registroMedico.deleteMany({});
  await prisma.consulta.deleteMany({});
  await prisma.paciente.deleteMany({});
  await prisma.medico.deleteMany({});
  await prisma.recepcionista.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Banco de dados limpo.');

  // --- 2. Criação de Usuários ---
  // REMOVIDO: A criação de usuários agora é responsabilidade do AUTH-SERVICE.
  // Os usuários serão sincronizados via RabbitMQ.

  // --- 3. Criação de Horários ---
  // MANTIDO: Podemos manter a criação de horários, mas ela falhará
  // se os médicos não existirem. Por enquanto, vamos comentar
  // para garantir que o 'seed' não falhe.
  
  /*
  console.log('Criando Horários de trabalho dos médicos...');
  // Esta parte precisará ser adaptada para usar os UUIDs dos médicos
  // que serão criados pelo auth-service.
  const medico1Id = "UUID_DO_MEDICO_1_VIRA_DO_AUTH_SERVICE";
  const medico2Id = "UUID_DO_MEDICO_2_VIRA_DO_AUTH_SERVICE";

  const horariosParaCriar = [
    {
      medico_id: medico1Id,
      start_time: "08:00",
      end_time: "18:00",
    },
    {
      medico_id: medico2Id,
      start_time:  "10:00",
      end_time: "19:00",
    },
  ];

  await prisma.horarioMedico.createMany({
    data: horariosParaCriar,
  });
  console.log(`${horariosParaCriar.length} horários de trabalho criados.`);
  */

  console.log('Seed concluído (sem criação de usuários). Aguardando sincronização do auth-service...');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
  