export type Consulta = {
  id: string;
  date_time: string;
  status: string;
  description?: string;
  paciente: {
    id: string; 
    history: string | null;
    allergies: string | null;
    user: {
      name: string;
      phone: string;
      email: string;
    };
  };
  medico: {
    id: string;
    specialty: string;
    user: {
      name: string;
      phone: string;
      email: string;
    };
  };
  historico: any[];
  registros: any[];
};
