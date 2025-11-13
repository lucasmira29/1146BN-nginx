import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Clock, 
  HeartPulse, 
  TriangleAlert, 
  ArrowRight 
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useNavigate } from "react-router";
import type { Consulta } from "@/types/consulta";

type Props = {
  consulta: Consulta;
};

const getStatusVariant = (status: string): "agendado" | "realizado" | "cancelado" | "default" => {
  switch (status) {
    case "agendado":
      return "agendado";
    case "realizado":
      return "realizado";
    case "cancelado":
      return "cancelado";
    default:
      return "default";
  }
}

export default function ConsultaCard({ consulta }: Props) {
  const navigate = useNavigate();
  const dataConsulta = new Date(consulta.date_time);

  return (
    <Card className="flex flex-col h-full rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <User className="h-5 w-5 text-primary" />
          {consulta.paciente?.user.name || "Paciente não informado"}
        </CardTitle>
        <Badge variant={getStatusVariant(consulta.status)} className="capitalize">
          {consulta.status}
        </Badge>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col justify-between gap-4 pt-2">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(dataConsulta, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{format(dataConsulta, "HH:mm")}</span>
          </div>
          {consulta.paciente?.history && (
            <div className="flex items-start gap-2">
              <HeartPulse className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">
                <strong>Histórico:</strong> {consulta.paciente.history}
              </p>
            </div>
          )}
          {consulta.paciente?.allergies && (
             <div className="flex items-start gap-2">
              <TriangleAlert className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <p className="line-clamp-2">
                <strong>Alergias:</strong> {consulta.paciente.allergies}
              </p>
            </div>
          )}
        </div>
        
        <Button
          variant="outline"
          className="w-full mt-2 cursor-pointer"
          onClick={() => navigate(`/dashboard/consulta/${consulta.id}`)}
        >
          Ver Detalhes
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}