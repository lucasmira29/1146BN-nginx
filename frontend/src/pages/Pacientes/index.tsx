import UserCard from '@/components/UserCard';
import api from '@/services/api';
import type { Paciente } from '@/types/paciente';
import { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-lg shadow-md animate-pulse">
    <div className="h-24 w-24 rounded-full bg-gray-300 mx-auto mb-4"></div>
    <div className="h-6 w-3/4 rounded bg-gray-300 mx-auto mb-2"></div>
    <div className="h-4 w-1/2 rounded bg-gray-300 mx-auto"></div>
  </div>
);

function PacientesPage() {
  const [pacienteData, setPacienteData] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPacientes() {
      setIsLoading(true);
      try {
        // MUDANÇA: Adicionado prefixo /api/clinica
        const response = await api.get(
          `/api/clinica/pacientes?page=${page}&limit=9`
        );
        setPacienteData(response.data.pacientes);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error(error);
        setPacienteData([]);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPacientes();
  }, [page]);

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageLinks = [];
    const maxPagesToShow = 5;
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    if (startPage > 1) {
      pageLinks.push(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageNumber = i;
      pageLinks.push(
        <PaginationItem key={pageNumber}>
          <PaginationLink
            href="#"
            isActive={page === pageNumber}
            onClick={(e) => {
              e.preventDefault();
              setPage(pageNumber);
            }}
          >
            {pageNumber}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      pageLinks.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return (
      <div className="flex justify-center mt-10">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                className={page === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {pageLinks}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                className={
                  page === totalPages ? 'pointer-events-none opacity-50' : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return Array.from({ length: 9 }).map((_, index) => (
        <SkeletonCard key={index} />
      ));
    }

    if (pacienteData.length === 0) {
      return (
        <div className="col-span-full text-center py-10">
          <p className="text-xl text-gray-600">Nenhum paciente encontrado.</p>
        </div>
      );
    }

    return pacienteData.map((paciente) => (
      <UserCard key={paciente.id} userData={paciente} />
    ));
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto p-2 sm:p-4 lg:p-6">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 tracking-tight">
            Pacientes
          </h1>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {renderContent()}
        </div>

        {renderPagination()}
      </div>
    </div>
  );
}

export default PacientesPage;
