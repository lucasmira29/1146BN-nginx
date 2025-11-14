import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import api from "@/services/api";
import { toast } from "react-toastify";
import SelectInput from "@/components/SelectInput";
import { DatePicker } from "@/components/DatePicker";
import {
  UserIcon,
  BriefcaseIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

function ScheduleForm() {
  // MUDANÇA: IDs agora são string
  const [pacienteId, setPacienteId] = useState<string | null>(null);
  const [medicoId, setMedicoId] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>();
  const [horario, setHorario] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  useEffect(() => {
    setHorario("");
    setHorariosDisponiveis([]);
    async function fetchHorariosDisponiveis() {
      if (!medicoId || !date) return;
      try {
        const dataFormatada = format(date, "yyyy-MM-dd");
        const response = await api.get(
          `/api/clinica/horarios/disponivel/${medicoId}?data=${dataFormatada}`
        );
        setHorariosDisponiveis(response.data.horarios || []);
      } catch (error) {
        console.error(error);
        setHorariosDisponiveis([]);
      }
    }
    fetchHorariosDisponiveis();
  }, [date, medicoId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!pacienteId || !medicoId || !date || !horario) {
      toast.warn("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    const dataFormatada = format(date, "yyyy-MM-dd");
    const consultaData = {
      paciente_id: pacienteId, // ID é string
      medico_id: medicoId,   // ID é string
      date_time: new Date(`${dataFormatada}T${horario}:00`).toISOString(),
      status: "agendado",
      description: descricao,
    };
    try {
      const response = await api.post("/api/clinica/consultas", consultaData);
      setDate(undefined);
      setHorario("");
      setDescricao("");
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao agendar a consulta.");
    }
  }

  return (
    <div className="bg-slate-50 flex justify-center items-start min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200 w-full max-w-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Agendar Nova Consulta</h2>
          <p className="text-gray-500 mt-1">Preencha os dados abaixo para marcar um novo horário.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center text-sm font-medium">
                <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                Paciente*
              </Label>
              <SearchInput
                SearchRole="pacientes"
                placeholder="Digite para buscar um paciente..."
                onSelect={(item) => setPacienteId(item.id)} // item.id agora é string
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label className="flex items-center text-sm font-medium">
                <BriefcaseIcon className="h-4 w-4 mr-2 text-gray-500" />
                Médico*
              </Label>
              <SearchInput
                SearchRole="medicos"
                placeholder="Digite para buscar um médico..."
                onSelect={(item) => setMedicoId(item.id)} // item.id agora é string
              />
            </div>
          </div>
          
          <hr/>

          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="data" className="flex items-center text-sm font-medium">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Data da Consulta*
                </Label>
                <DatePicker date={date} setDate={setDate} />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="horario" className="flex items-center text-sm font-medium">
                  <ClockIcon className="h-4 w-4 mr-2 text-gray-500" />
                  Horário*
                </Label>
                <SelectInput
                  items={horariosDisponiveis}
                  value={horario}
                  onChange={setHorario}
                  disabled={horariosDisponiveis.length === 0}
                  placeholder={
                    !medicoId || !date
                      ? "Selecione médico e data"
                      : "Selecione um horário"
                  }
                />
              </div>
            </div>
          </div>
          
          <hr/>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="descricao" className="flex items-center text-sm font-medium">
              <PencilIcon className="h-4 w-4 mr-2 text-gray-500" />
              Descrição (Opcional)
            </Label>
            <Textarea
              id="descricao"
              name="descricao"
              value={descricao}
              placeholder="Motivo da consulta, sintomas, etc."
              onChange={(e) => setDescricao(e.target.value)}
              className="bg-white min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="mt-4 w-full cursor-pointer"
            disabled={!pacienteId || !medicoId || !date || !horario}
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Agendar Consulta
          </Button>
        </form>
      </div>
    </div>
  );
}

export default ScheduleForm;
