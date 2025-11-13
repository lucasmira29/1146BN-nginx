import { DatePicker } from "@/components/DatePicker";
import Modal from "@/components/Modal";
import SelectInput from "@/components/SelectInput";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAuth from "@/hooks/useAuthContext";
import api from "@/services/api";
import type { Consulta } from "@/types/consulta";
import { formatPhone } from "@/utils/formatters";
import { format } from "date-fns";
import { ArrowLeft, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

function ConsultaDetails() {
  const { id } = useParams();
  const [consulta, setConsulta] = useState<Consulta>();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenCancelar, setIsOpenCancelar] = useState<boolean>(false);
  const [isOpenRemarcar, setIsOpenRemarcar] = useState<boolean>(false);
  const [observacoes, setObservacoes] = useState("");
  const [diagnostico, setDiagnostico] = useState("");
  const [tratamento, setTratamento] = useState("");
  const [novaData, setNovaData] = useState<Date | undefined>();
  const [novoHorario, setNovoHorario] = useState<string>("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);

  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    fetchConsulta();
  }, []);

  useEffect(() => {
    async function fetchHorariosDisponiveis() {
      if (!consulta?.medico.id || !novaData) return;

      try {
        const dataFormatada = format(novaData, "yyyy-MM-dd");
        const response = await api.get(
          `/horarios/disponivel/${consulta.medico.id}?data=${dataFormatada}`
        );
        setHorariosDisponiveis(response.data.horarios || []);
      } catch (error) {
        console.error(error);
        setHorariosDisponiveis([]);
      }
    }

    setNovoHorario("");
    setHorariosDisponiveis([]);
    fetchHorariosDisponiveis();
  }, [novaData, consulta?.medico.id]);

  async function fetchConsulta() {
    try {
      const response = await api.get(`/consultas/${id}`);
      setConsulta(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  async function confirmConsulta(id: string | undefined) {
    try {
      if (!id || !observacoes || !diagnostico || !tratamento) {
        return toast.warn("Campos obrigatórios faltando!");
      }

      await api.put(`/consultas/${id}`, {
        status: "realizado",
      });

      await api.post(`/registros-medicos`, {
        consulta_id: id,
        medico_id: consulta?.medico.id,
        paciente_id: consulta?.paciente.id,
        observacoes,
        diagnostico,
        tratamento,
      });

      fetchConsulta();
      toast.success("Consulta Confirmada!");
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function cancelarConsulta(id: string | undefined) {
    try {
      if (!id) return;

      await api.put(`/consultas/${id}`, {
        status: "cancelado",
      });

      fetchConsulta();
      toast.success("Consulta Cancelada!");
      setIsOpenCancelar(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function remarcarConsulta() {
    if (!id || !novaData || !novoHorario) {
      return toast.warn("Selecione uma nova data e horário.");
    }

    try {
      const novaDataFormatada = format(novaData, "yyyy-MM-dd");

      await api.put(`/consultas/${id}`, {
        date_time: new Date(
          `${novaDataFormatada}T${novoHorario}:00`
        ).toISOString(),
        status: "agendado",
      });

      toast.success("Consulta remarcada com sucesso!");
      setIsOpenRemarcar(false);
      fetchConsulta();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao remarcar a consulta.");
    }
  }

  const renderStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      agendado: "bg-blue-100 text-blue-800",
      realizado: "bg-green-100 text-green-800",
      cancelado: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`text-xs px-2 py-1 rounded-full font-medium ${
          statusColors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    consulta && (
      <>
        <div className="max-w-3xl mx-auto mt-10 p-8 border rounded-2xl shadow-md bg-white space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-800 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>

          <h1 className="text-3xl font-bold text-zinc-900">
            Detalhes da Consulta
          </h1>

          <div className="grid w-full gap-3">
            <h2 className="text-lg font-semibold text-zinc-800">
              Informações Gerais
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600">
              <div>
                <p>
                  <span className="font-medium text-zinc-700">Data:</span>{" "}
                  {consulta?.date_time}
                </p>
                <p className={consulta.description ? "" : "hidden"}>
                  <span className="font-medium text-zinc-700">Descrição:</span>{" "}
                  {consulta?.description}
                </p>
              </div>
              <p>
                <span className="font-medium text-zinc-700">Status:</span>{" "}
                {renderStatusBadge(consulta.status)}
              </p>
            </div>
          </div>

          <div className="grid w-full gap-3">
            <h2 className="text-lg font-semibold text-zinc-800">Paciente</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-700">Nome:</span>{" "}
                {consulta?.paciente.user.name}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Telefone:</span>{" "}
                {formatPhone(consulta?.paciente.user.phone)}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Email:</span>{" "}
                {consulta?.paciente.user.email}
              </p>
              {consulta?.paciente.history && (
                <p className="sm:col-span-2">
                  <span className="font-medium text-zinc-700">Histórico:</span>{" "}
                  {consulta.paciente.history}
                </p>
              )}
              {consulta?.paciente.allergies && (
                <p className="sm:col-span-2">
                  <span className="font-medium text-zinc-700">Alergias:</span>{" "}
                  {consulta.paciente.allergies}
                </p>
              )}
            </div>
          </div>

          <div className="grid w-full gap-3">
            <h2 className="text-lg font-semibold text-zinc-800">Médico</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600">
              <p>
                <span className="font-medium text-zinc-700">Nome:</span>{" "}
                {consulta?.medico.user.name}
              </p>
              <p>
                <span className="font-medium text-zinc-700">
                  Especialidade:
                </span>{" "}
                {consulta?.medico.specialty}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Telefone:</span>{" "}
                {formatPhone(consulta?.medico.user.phone)}
              </p>
              <p>
                <span className="font-medium text-zinc-700">Email:</span>{" "}
                {consulta?.medico.user.email}
              </p>
            </div>
          </div>

          {consulta.status === "realizado" &&
            consulta.registros?.length > 0 && (
              <div className="grid w-full gap-3">
                <h2 className="text-lg font-semibold text-zinc-800">
                  Registro Médico
                </h2>
                {consulta.registros.map((registro) => (
                  <div
                    key={registro.id}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-600 border p-4 rounded-lg"
                  >
                    <p className="sm:col-span-2">
                      <span className="font-medium text-zinc-700">
                        Data de Registro:
                      </span>{" "}
                      {new Date(registro.created_at).toLocaleString("pt-BR")}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium text-zinc-700">
                        Observações:
                      </span>{" "}
                      {registro.observacoes}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium text-zinc-700">
                        Diagnóstico:
                      </span>{" "}
                      {registro.diagnostico}
                    </p>
                    <p className="sm:col-span-2">
                      <span className="font-medium text-zinc-700">
                        Tratamento:
                      </span>{" "}
                      {registro.tratamento}
                    </p>
                  </div>
                ))}
              </div>
            )}

          {consulta.status === "agendado" && (
            <div className="flex flex-wrap justify-end gap-3 mt-12">
              {user?.role !== "medico" && (
                <>
                  <Button
                    variant="outline"
                    className="cursor-pointer min-w-[120px]"
                    onClick={() => setIsOpenRemarcar(true)}
                  >
                    Remarcar
                  </Button>

                  <Button
                    variant="destructive"
                    className="cursor-pointer min-w-[120px]"
                    onClick={() => setIsOpenCancelar(true)}
                  >
                    Cancelar
                  </Button>
                </>
              )}

  
              {user?.role === "medico" && (
                <Button
                  className="flex items-center gap-2 cursor-pointer bg-green-500 hover:bg-green-700 text-white min-w-[120px]"
                  onClick={() => setIsOpen(true)}
                >
                  <Check className="w-4 h-4" />
                  Confirmar Realização
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Modais */}

        <Modal
          open={isOpen}
          onOpenChange={setIsOpen}
          title="Confirmação da Consulta"
          customClassName="max-w-[320px] overflow-hidden p-6"
          description="Insira observações, diagnóstico e tratamento antes de confirmar a consulta."
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-700 text-white cursor-pointer"
                onClick={() => confirmConsulta(id)}
              >
                Confirmar
              </Button>
            </div>
          }
        >
          <div className="space-y-6 py-4">
            <div className="grid w-full gap-3">
              <Label className="text-base font-medium">Observações</Label>
              <Textarea
                placeholder="Digite observações relevantes..."
                className="resize-none h-24 break-words whitespace-pre-wrap"
                onChange={(e) => setObservacoes(e.target.value)}
              />
            </div>
            <div className="grid w-full gap-3">
              <Label className="text-base font-medium">Diagnóstico</Label>
              <Textarea
                placeholder="Descreva o diagnóstico..."
                className="resize-none h-24 break-words whitespace-pre-wrap w-full"
                onChange={(e) => setDiagnostico(e.target.value)}
              />
            </div>
            <div className="grid w-full gap-3">
              <Label className="text-base font-medium">Tratamento</Label>
              <Textarea
                placeholder="Informe o tratamento indicado..."
                className="resize-none h-24 break-words whitespace-pre-wrap"
                onChange={(e) => setTratamento(e.target.value)}
              />
            </div>
          </div>
        </Modal>

        <Modal
          open={isOpenCancelar}
          onOpenChange={setIsOpenCancelar}
          title="Tem certeza que deseja cancelar?"
          description="Essa ação é irreversível"
          customClassName="max-w-sm"
          footer={
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsOpenCancelar(false)}
                className="cursor-pointer"
              >
                Voltar
              </Button>
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={() => cancelarConsulta(id)}
              >
                Cancelar Consulta
              </Button>
            </div>
          }
        />

        <Modal
          open={isOpenRemarcar}
          onOpenChange={setIsOpenRemarcar}
          title="Remarcar Consulta"
          customClassName="max-w-md h-auto"
          footer={
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpenRemarcar(false);
                  setNovaData(undefined);
                  setNovoHorario("");
                  setHorariosDisponiveis([]);
                }}
                className="cursor-pointer"
              >
                Cancelar
              </Button>
              <Button
                className="cursor-pointer"
                disabled={!novaData || !novoHorario}
                onClick={() => remarcarConsulta()}
              >
                Remarcar
              </Button>
            </div>
          }
        >
          <div className="flex flex-col gap-6 py-3">
            <div>
              <Label className="pb-2">Nova data</Label>
              <DatePicker date={novaData} setDate={setNovaData} />
            </div>

            <div>
              <Label className="pb-2">Novo Horário</Label>
              <SelectInput
                items={horariosDisponiveis}
                placeholder={
                  horariosDisponiveis.length > 0
                    ? "Selecione um horário"
                    : "Selecione uma data primeiro"
                }
                onChange={setNovoHorario}
              />
            </div>
          </div>
        </Modal>
      </>
    )
  );
}

export default ConsultaDetails;
