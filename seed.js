const API_URL = 'http://localhost:80/api';

console.log(`🔌 Conectando na API em: ${API_URL}`);

async function request(endpoint, method, body, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!response.ok) {
      if (
        data.message &&
        (data.message.includes('exists') || data.message.includes('existe'))
      ) {
        return { status: 'exists', ...data };
      }
      console.warn(
        `⚠️  Aviso em ${endpoint}:`,
        data.message || JSON.stringify(data)
      );
      return data;
    }
    return data;
  } catch (error) {
    console.error(`❌ Erro de conexão: ${error.message}`);
    return null;
  }
}

function getUserIdFromToken(token) {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString();
    const payload = JSON.parse(payloadJson);
    return payload.sub;
  } catch (e) {
    console.error('Erro ao decodificar token:', e);
    return null;
  }
}

async function setupUsuario(usuario, role) {
  const password = '12345678';

  const registerData = {
    name: usuario.name,
    email: usuario.email,
    password: password,
    role: role.toUpperCase(),
    document: usuario.document,
    birthdate: usuario.birthdate || '1990-01-01',
    phone: usuario.phone || '11999999999',
    postal_code: usuario.postal_code || '01001000',
  };


  await request('/auth/users/register', 'POST', registerData);

  const loginRes = await request('/auth/login/password', 'POST', {
    email: usuario.email,
    password,
  });

  if (loginRes && loginRes.accessToken) {
    const userId = getUserIdFromToken(loginRes.accessToken);

    console.log(`✅ Usuário ${usuario.name} logado. ID: ${userId}`);

    return {
      id: userId,
      token: loginRes.accessToken,
    };
  } else {
    console.error(`❌ Falha crítica ao logar como ${usuario.name}`);
    return null;
  }
}

async function main() {
  console.log('🌱 Iniciando Carga de Dados Manual...');
  console.log('------------------------------------------------');

  // --- 1. ADMIN ---
  const adminCreds = await setupUsuario(
    {
      name: 'Admin Geral',
      document: '11122233301',
      email: 'admin@clinica.com',
      birthdate: '1980-04-15',
    },
    'admin'
  );

  if (!adminCreds || !adminCreds.id) {
    console.error('❌ Impossível continuar sem Admin.');
    process.exit(1);
  }

  // --- 2. MÉDICOS ---
  const medicosData = [
    {
      name: 'Dra. Isadora Lima',
      document: '22233344402',
      email: 'isadora.lima@clinica.com',
      specialty: 'Dermatologia Clínica e Cirúrgica',
    },
    {
      name: 'Dr. Roberto Fernandes',
      document: '33344455503',
      email: 'roberto.fernandes@clinica.com',
      specialty: 'Dermatologia Estética e Tricologia',
    },
  ];

  const medicosCadastrados = [];

  for (const m of medicosData) {
    const creds = await setupUsuario(m, 'medico');
    if (creds && creds.id) {
      medicosCadastrados.push({ ...creds, name: m.name });
      console.log(`   🩺 Atualizando especialidade: ${m.specialty}`);
      await request(
        `/clinica/medicos/${creds.id}`,
        'PUT',
        {
          specialty: m.specialty,
        },
        adminCreds.token
      );
    }
  }

  // --- 3. RECEPCIONISTAS ---
  const recepcionistasData = [
    {
      name: 'Ana Cláudia Ribeiro',
      document: '44455566604',
      email: 'ana.ribeiro@clinica.com',
    },
    {
      name: 'Carlos Eduardo',
      document: '55566677705',
      email: 'carlos.eduardo@clinica.com',
    },
  ];

  for (const r of recepcionistasData) await setupUsuario(r, 'recepcionista');

  const pacientesData = [
    {
      name: 'João Carlos Almeida',
      document: '12345678901',
      email: 'joao.almeida@example.com',
      history: 'Histórico de acne cística na adolescência',
      allergies: 'Penicilina',
    },
    {
      name: 'Mariana Oliveira',
      document: '23456789012',
      email: 'mariana.oliveira@example.com',
      history: 'Psoríase em placas, controlada',
      allergies: 'Fragrâncias em cosméticos',
    },
    {
      name: 'Felipe Souza',
      document: '34567890123',
      email: 'felipe.souza@example.com',
      history: 'Dermatite atópica desde a infância',
      allergies: 'Ácaros',
    },
    {
      name: 'Leticia Barros',
      document: '45678901234',
      email: 'leticia.barros@example.com',
      history: 'Cicatrizes de acne, buscando tratamento a laser',
      allergies: 'Ibuprofeno',
    },
    {
      name: 'Bruno Gomes',
      document: '56789012345',
      email: 'bruno.gomes@example.com',
      history: 'Dermatite de contato a metais',
      allergies: 'Níquel',
    },
    {
      name: 'Clara Azevedo',
      document: '67890123456',
      email: 'clara.azevedo@example.com',
      history: 'Acompanhamento de vitiligo',
      allergies: 'Nenhuma conhecida',
    },
    {
      name: 'Ricardo Dias',
      document: '78901234567',
      email: 'ricardo.dias@example.com',
      history: 'Excesso de sudorese (hiperidrose)',
      allergies: 'Pólen',
    },
    {
      name: 'Vanessa Nunes',
      document: '89012345678',
      email: 'vanessa.nunes@example.com',
      history: 'Manchas solares (melanoses) nas mãos',
      allergies: 'Gatos',
    },
    {
      name: 'Thiago Moreira',
      document: '90123456789',
      email: 'thiago.moreira@example.com',
      history: 'Foliculite na região da barba',
      allergies: 'Nenhuma conhecida',
    },
    {
      name: 'Juliana Castro',
      document: '01234567890',
      email: 'juliana.castro@example.com',
      history: 'Unhas frágeis e quebradiças',
      allergies: 'Esmaltes com formaldeído',
    },
    {
      name: 'Eduardo Santos',
      document: '11223344556',
      email: 'eduardo.santos@example.com',
      history: 'Revisão de pinta suspeita no ombro',
      allergies: 'Amendoim',
    },
  ];

  for (const p of pacientesData) {
    const pFull = {
      ...p,
      birthdate: '1992-05-18',
      phone: `1198${p.document.substring(0, 7)}`,
      postal_code: '04004040',
    };

    const creds = await setupUsuario(pFull, 'paciente');
    if (creds && creds.id) {
      await request(
        `/clinica/pacientes/${creds.id}`,
        'PUT',
        {
          history: p.history,
          allergies: p.allergies,
        },
        adminCreds.token
      );
    }
  }

  // --- 5. HORÁRIOS ---
  console.log('\n🕒 Configurando Horários...');

  if (medicosCadastrados.length > 0) {
    const m1 = medicosCadastrados[0];
    console.log(`   -> Horários para ${m1.name}`);
    await request(
      '/clinica/horarios',
      'POST',
      { medico_id: m1.id, start_time: '08:00', end_time: '18:00' },
      m1.token
    );
  }

  if (medicosCadastrados.length > 1) {
    const m2 = medicosCadastrados[1];
    console.log(`   -> Horários para ${m2.name}`);
    await request(
      '/clinica/horarios',
      'POST',
      { medico_id: m2.id, start_time: '10:00', end_time: '19:00' },
      m2.token
    );
  }

  console.log('------------------------------------------------');
  console.log('✅ Carga de Dados Concluída!');
}

main();
