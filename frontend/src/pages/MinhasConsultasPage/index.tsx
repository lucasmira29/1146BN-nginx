import { useEffect, useState } from "react";
import api from "@/services/api";
import type { Consulta } from "@/types/consulta";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ConsultaCard from "@/components/ConsultaCard";
import useAuth from "@/hooks/useAuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";
import { X } from "lucide-react";

export default function MinhasConsultasPage() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [pacienteFilter, setPacienteFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const { user } = useAuth();

  const debouncedPacienteFilter = useDebounce(pacienteFilter, 500);
  
  const isFiltered = statusFilter !== '' || pacienteFilter !== '';

  useEffect(() => {
    if (user?.role !== "medico") return;

    async function fetchConsultas() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          medicoId: user!.id.toString(),
          page: page.toString(),
        });

        if (statusFilter) {
          params.append('status', statusFilter);
        }
        if (debouncedPacienteFilter) {
          params.append('paciente', debouncedPacienteFilter);
        }
        
        const response = await api.get(`consultas?${params.toString()}&limit=9`);
        
        setConsultas(response.data.consultas);
        setTotalPages(response.data.totalPage || 1);
      } catch (error) {
        console.error("Erro ao buscar consultas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchConsultas();
  }, [page, user?.id, user?.role, statusFilter, debouncedPacienteFilter]);

  // Efeito para resetar a página quando qualquer filtro mudar
  useEffect(() => {
    setPage(1);
  }, [statusFilter, debouncedPacienteFilter]);

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  const handleClearFilters = () => {
    setStatusFilter('');
    setPacienteFilter('');
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Minhas Consultas
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas consultas agendadas e acesse o histórico dos pacientes.
        </p>
      </div>

      <div className="w-full flex flex-col md:flex-row items-center gap-2">
        <Input
          placeholder="Filtrar por nome do paciente..."
          value={pacienteFilter}
          onChange={(e) => setPacienteFilter(e.target.value)}
          className="flex-grow max-w-lg bg-white"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-white cursor-pointer">
            <SelectValue placeholder="Status"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="agendado" className="cursor-pointer">Agendado</SelectItem>
            <SelectItem value="realizado" className="cursor-pointer">Realizado</SelectItem>
            <SelectItem value="cancelado" className="cursor-pointer">Cancelado</SelectItem>
          </SelectContent>
        </Select>
        {isFiltered && (
          <Button variant="ghost" onClick={handleClearFilters} className="w-full md:w-auto cursor-pointer">
            <X className="h-4 w-4 mr-2" />
            Limpar Filtros
          </Button>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[215px] w-full rounded-xl" />
          ))}
        </div>
      ) : consultas.length > 0 ? (
        <>
          <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            {consultas.map((consulta) => (
              <ConsultaCard key={consulta.id} consulta={consulta} />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handlePreviousPage();
                    }}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem className="font-medium text-muted-foreground">
                  Página {page} de {totalPages}
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNextPage();
                    }}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 border-2 border-dashed rounded-lg">
          <h2 className="text-xl font-semibold">
            Nenhuma consulta encontrada.
          </h2>
          <p className="text-muted-foreground mt-2">
            Tente ajustar os filtros ou limpar a busca.
          </p>
        </div>
      )}
    </div>
  );
}