import UserCard from '@/components/UserCard';
import api from '@/services/api';
import type { Medico } from '@/types/medico';
import { useEffect, useState } from 'react';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
    <div className="h-6 w-3/4 rounded bg-gray-300 mx-auto mb-2"></div>
    <div className="h-4 w-1/2 rounded bg-gray-300 mx-auto"></div>
  </div>
);

function MedicosPage() {
  const [medicoData, setMedicoData] = useState<Medico[] | undefined>(undefined);

  useEffect(() => {
    async function fetchMedicos() {
      try {
        // MUDANÇA: Adicionado prefixo /api/clinica
        const response = await api.get('/api/clinica/medicos');
        setMedicoData(response.data.medicos);
      } catch (error) {
        console.error(error);
        setMedicoData([]);
      }
    }

    setTimeout(() => {
      fetchMedicos();
    }, 500);
  }, []);

  const renderContent = () => {
    if (medicoData === undefined) {
      return Array.from({ length: 8 }).map((_, index) => (
        <SkeletonCard key={index} />
      ));
    }

    if (medicoData.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-600">
            Nenhum médico encontrado no momento.
          </p>
        </div>
      );
    }

    return medicoData.map((medico) => (
      <UserCard key={medico.id} userData={medico} />
    ));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            Médicos
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

export default MedicosPage;
