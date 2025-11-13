import { PrismaClient } from '../src/generated/prisma/index.js';
import { hashPassword } from '../src/utils/hash.js';

const prisma = new PrismaClient();


async function main() {
  console.log('Iniciando o processo de seed...');

  // --- 1. Limpeza do Banco de Dados ---
  console.log('Limpando o banco de dados existente...');
  await prisma.horarioMedico.deleteMany({});
  await prisma.paciente.deleteMany({});
  await prisma.medico.deleteMany({});
  await prisma.recepcionista.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('Banco de dados limpo.');

  // --- 2. Criação de Senha Padrão ---
  const senhaPadrao = '123456';
  const hashedPasswordPadrao = await hashPassword(senhaPadrao);

  // --- 3. Criação de Usuários (Staff) ---
  console.log('Criando usuário Administrador...');
  await prisma.user.create({
    data: {
      name: 'Admin Geral',
      document: '11122233301',
      birthdate: new Date('1980-04-15'),
      phone: '11999990001',
      postal_code: '01001000',
      email: 'admin@clinica.com',
      password: hashedPasswordPadrao,
      role: 'admin',
    },
  });

  console.log('Criando usuários Médicos...');
  const medicosData = [
    { name: 'Dra. Isadora Lima', document: '22233344402', email: 'isadora.lima@clinica.com', specialty: 'Dermatologia Clínica e Cirúrgica' },
    { name: 'Dr. Roberto Fernandes', document: '33344455503', email: 'roberto.fernandes@clinica.com', specialty: 'Dermatologia Estética e Tricologia' },
  ];

  const medicosCriados = await Promise.all(
    medicosData.map(medico =>
      prisma.user.create({
        data: {
          name: medico.name,
          document: medico.document,
          birthdate: new Date('1985-09-20'),
          phone: '11999990002',
          postal_code: '02002020',
          email: medico.email,
          password: hashedPasswordPadrao,
          role: 'medico',
          Medico: { create: { specialty: medico.specialty } },
        },
      }),
    ),
  );

  console.log('Criando usuários Recepcionistas...');
  const recepcionistasData = [
    { name: 'Ana Cláudia Ribeiro', document: '44455566604', email: 'ana.ribeiro@clinica.com' },
    { name: 'Carlos Eduardo', document: '55566677705', email: 'carlos.eduardo@clinica.com' },
  ];

  await Promise.all(
    recepcionistasData.map(recep =>
      prisma.user.create({
        data: {
          name: recep.name,
          document: recep.document,
          birthdate: new Date('1995-01-01'),
          phone: '11999990004',
          postal_code: '03003030',
          email: recep.email,
          password: hashedPasswordPadrao,
          role: 'recepcionista',
          Recepcionista: { create: {} },
        },
      }),
    ),
  );

  // --- 4. Criação de Pacientes ---
  console.log('Criando usuários Pacientes...');
  const pacientesData = [
    { name: 'João Carlos Almeida', document: '12345678901', email: 'joao.almeida@example.com', history: 'Histórico de acne cística na adolescência', allergies: 'Penicilina' },
    { name: 'Mariana Oliveira', document: '23456789012', email: 'mariana.oliveira@example.com', history: 'Psoríase em placas, controlada', allergies: 'Fragrâncias em cosméticos' },
    { name: 'Felipe Souza', document: '34567890123', email: 'felipe.souza@example.com', history: 'Dermatite atópica desde a infância', allergies: 'Ácaros' },
    { name: 'Leticia Barros', document: '45678901234', email: 'leticia.barros@example.com', history: 'Cicatrizes de acne', allergies: 'Ibuprofeno' },
    { name: 'Bruno Gomes', document: '56789012345', email: 'bruno.gomes@example.com', history: 'Dermatite de contato a metais', allergies: 'Níquel' },
    { name: 'Clara Azevedo', document: '67890123456', email: 'clara.azevedo@example.com', history: 'Acompanhamento de vitiligo', allergies: 'Nenhuma conhecida' },
    { name: 'Ricardo Dias', document: '78901234567', email: 'ricardo.dias@example.com', history: 'Excesso de sudorese (hiperidrose)', allergies: 'Pólen' },
    { name: 'Vanessa Nunes', document: '89012345678', email: 'vanessa.nunes@example.com', history: 'Manchas solares (melanoses) nas mãos', allergies: 'Gatos' },
    { name: 'Thiago Moreira', document: '90123456789', email: 'thiago.moreira@example.com', history: 'Foliculite na região da barba', allergies: 'Nenhuma conhecida' },
    { name: 'Juliana Castro', document: '01234567890', email: 'juliana.castro@example.com', history: 'Unhas frágeis e quebradiças', allergies: 'Esmaltes com formaldeído' },
    { name: 'Eduardo Santos', document: '11223344556', email: 'eduardo.santos@example.com', history: 'Revisão de pinta suspeita no ombro', allergies: 'Amendoim' },
  ];

  await Promise.all(
    pacientesData.map(paciente =>
      prisma.user.create({
        data: {
          name: paciente.name,
          document: paciente.document,
          birthdate: new Date('1992-05-18'),
          phone: `1198${paciente.document.substring(0, 7)}`,
          postal_code: '04004040',
          email: paciente.email,
          password: hashedPasswordPadrao,
          role: 'paciente',
          Paciente: { create: { history: paciente.history, allergies: paciente.allergies } },
        },
      }),
    ),
  );

  // --- 5. Criação de Horários dos Médicos ---
  console.log('Criando Horários de trabalho dos médicos...');
  const medico1Id = medicosCriados[0].id;
  const medico2Id = medicosCriados[1].id;

  const horariosParaCriar = [
    // Horário para Dra. Isadora Lima (Ex: 08:00 às 18:00)
    {
      medico_id: medico1Id,
      start_time: "08:00",
      end_time: "18:00",
    },
    // Horário para Dr. Roberto Fernandes (Ex: 10:00 às 19:00)
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
  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Ocorreu um erro durante o processo de seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
