import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import useAuth from '@/hooks/useAuthContext';
import { motion } from 'framer-motion';
import { format, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import api from '@/services/api';
import { AlertaHorarioPendente } from '@/components/AlertaHorarioPendente';

import {
  CalendarDaysIcon,
  CheckBadgeIcon,
  ClockIcon,
  DocumentChartBarIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

interface Consulta {
  id: string;
  date_time: string;
  status: string;
  paciente: {
    user: {
      name: string;
      phone: string;
      email: string;
    };
  };
  medico: {
    specialty: string;
    user: {
      name: string;
      phone: string;
      email: string;
    };
  };
}

// Função auxiliar para estilizar o status da consulta
const getStatusBadgeStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'realizado':
      return 'bg-green-100 text-green-800 ring-1 ring-inset ring-green-200';
    case 'cancelado':
      return 'bg-red-100 text-red-800 ring-1 ring-inset ring-red-200';
    case 'agendado':
    default:
      return 'bg-blue-100 text-blue-800 ring-1 ring-inset ring-blue-200';
  }
};

function DashboardHome() {
  const { user } = useAuth();
  const [consultasHoje, setConsultasHoje] = useState<Consulta[]>([]);
  const [consultasRealizadas, setConsultasRealizadas] = useState<number | null>(
    0
  );
  const [totalConsultas, setTotalConsultas] = useState<number>(0);
  const [totalRealizadas, setTotalRealizadas] = useState<number>(0);
  const [totalCanceladas, setTotalCanceladas] = useState<number>(0);

  const [horarioPendente, setHorarioPendente] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const verificarHorarioMedico = async () => {
      try {
        // MUDANÇA: Adicionado prefixo /api/clinica
        const response = await api.get(
          `/api/clinica/horarios/medico/${user.id}`
        );
        if (response.data.length === 0) {
          setHorarioPendente(true);
          toast.warn(
            'Ação necessária: Por favor, defina seu horário de trabalho.'
          );
        }
      } catch (error) {
        console.error('Erro ao verificar horário do médico:', error);
      }
    };

    const hojeInicio = startOfDay(new Date()).toISOString();

    const fetchConsultas = async () => {
      try {
        let res;
        if (user.role === 'medico') {
          verificarHorarioMedico();
          // MUDANÇA: Adicionado prefixo /api/clinica
          res = await api.get(
            `/api/clinica/consultas/?medicoId=${user.id}&data=${hojeInicio}`
          );
          // MUDANÇA: Adicionado prefixo /api/clinica
          const totalRealizadas = await api.get(
            `/api/clinica/consultas?medicoId=${user.id}&status=realizado`
          );
          setConsultasRealizadas(totalRealizadas.data.total);
        } else if (user.role === 'recepcionista' || user.role === 'admin') {
          // MUDANÇA: Adicionado prefixo /api/clinica
          res = await api.get(`/api/clinica/consultas/?data=${hojeInicio}`);
        }
        if (res) setConsultasHoje(res.data.consultas || []);
      } catch (error) {
        console.error('Erro ao buscar consultas:', error);
      }
    };

    const fetchTotais = async () => {
      try {
        // MUDANÇA: Adicionado prefixo /api/clinica em todos
        const [resTotal, resRealizadas, resCanceladas] = await Promise.all([
          api.get('/api/clinica/consultas/'),
          api.get('/api/clinica/consultas/?status=realizado'),
          api.get('/api/clinica/consultas/?status=cancelado'),
        ]);
        setTotalConsultas(resTotal.data.total);
        setTotalRealizadas(resRealizadas.data.total);
        setTotalCanceladas(resCanceladas.data.total);
      } catch (error) {
        console.error('Erro ao buscar totais:', error);
      }
    };

    fetchConsultas();

    if (user.role === 'recepcionista' || user.role === 'admin') {
      fetchTotais();
    }
  }, [user]);

  if (!user) {
    return (
      <h2 className="text-3xl text-center font-bold mt-10 text-red-600">
        Você não está logado no sistema.
      </h2>
    );
  }

  const getGreetingByRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Bem-vindo(a), Administrador(a)';
      case 'medico':
        return 'Bem-vindo(a), Doutor(a)';
      case 'recepcionista':
        return 'Bem-vindo(a), Recepcionista';
      default:
        return 'Bem-vindo(a)';
    }
  };

  const dataHojeFormatada = format(new Date(), "EEEE, dd 'de' MMMM", {
    locale: ptBR,
  });

  // Variantes para animação da lista
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <section className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      {/* CARD DE BOAS-VINDAS */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: 'spring', bounce: 0.3 }}
        className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 border-t-4 border-t-indigo-500"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
          {getGreetingByRole(user.role)} 👋
        </h2>
        <p className="text-base sm:text-lg text-gray-600 mt-1">
          Que bom ter você aqui,{' '}
          <span className="font-semibold">{user.name}</span>!
        </p>
        <p className="text-sm text-gray-500 mt-2 capitalize">
          Hoje é {dataHojeFormatada}.
        </p>
      </motion.div>

      {horarioPendente && <AlertaHorarioPendente />}

      {/* LAYOUT EM GRID PARA O CONTEÚDO PRINCIPAL */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUNA PRINCIPAL (Consultas do Dia) */}
        <div className="lg:col-span-2">
          {(user.role === 'medico' ||
            user.role === 'recepcionista' ||
            user.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200 h-full"
            >
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-4 border-b">
                <CalendarDaysIcon className="h-6 w-6 mr-3 text-indigo-600" />
                Agenda de Hoje
              </h3>
              {consultasHoje.length > 0 ? (
                <motion.ul
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  {consultasHoje.map((consulta) => (
                    <motion.li
                      key={consulta.id}
                      variants={itemVariants}
                      className="flex items-center justify-between rounded-xl p-3 hover:bg-slate-50 transition-colors duration-200 border"
                    >
                      <div className="flex items-center">
                        <div className="flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold rounded-lg h-11 w-11 mr-4 text-xl">
                          <ClockIcon className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">
                            {format(new Date(consulta.date_time), 'HH:mm')} -{' '}
                            {consulta.paciente.user.name}
                          </p>
                          {user.role !== 'medico' && (
                            <p className="text-sm text-gray-500">
                              {consulta.medico.user.name}
                            </p>
                          )}
                        </div>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${getStatusBadgeStyles(
                          consulta.status
                        )}`}
                      >
                        {consulta.status}
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">
                    Nenhuma consulta agendada para hoje.
                  </p>
                  <p className="text-sm text-gray-400 mt-2">
                    Aproveite para organizar suas tarefas!
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* COLUNA LATERAL (Cards de Estatísticas) */}
        <div className="space-y-8">
          {user.role === 'medico' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-700">
                    Total Realizadas
                  </h3>
                  <p className="text-xs text-gray-500">
                    Seu histórico de atendimentos
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckBadgeIcon className="h-6 w-6 text-green-700" />
                </div>
              </div>
              <motion.p
                key={consultasRealizadas}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-4xl font-bold text-green-600 mt-4"
              >
                {consultasRealizadas}
              </motion.p>
            </motion.div>
          )}

          {(user.role === 'recepcionista' || user.role === 'admin') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-4 pb-4 border-b">
                <DocumentChartBarIcon className="h-6 w-6 mr-3 text-indigo-600" />
                Resumo Geral
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-sm font-medium text-gray-600">
                    <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                    Total de Consultas
                  </p>
                  <p className="text-lg font-bold text-gray-800">
                    {totalConsultas}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-sm font-medium text-green-700">
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Realizadas
                  </p>
                  <p className="text-lg font-bold text-green-700">
                    {totalRealizadas}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <p className="flex items-center text-sm font-medium text-red-600">
                    <NoSymbolIcon className="h-5 w-5 mr-2" />
                    Canceladas
                  </p>
                  <p className="text-lg font-bold text-red-600">
                    {totalCanceladas}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {user.role === 'admin' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="p-6 bg-white rounded-2xl shadow-lg border border-gray-200"
            >
              <h3 className="flex items-center text-xl font-semibold text-gray-800 mb-2">
                <ShieldCheckIcon className="h-6 w-6 mr-3 text-indigo-600" />
                Painel do Admin
              </h3>
              <p className="text-gray-600 text-sm">
                Aqui você poderá em breve validar os cadastros de médicos e
                recepcionistas.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DashboardHome;
