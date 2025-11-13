
export type User = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  document: string;
  birthdate: Date;
  role: Role;
  phone?: string;
  postal_code: string;
  specialty?: string | null;
}

export type Role = 'admin' | 'medico' | 'recepcionista' | 'paciente';
