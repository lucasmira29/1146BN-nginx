import type { User } from './user';

export type Paciente = {
  id: string;
  user: User;
  history: string | null;
  allergies: string | null;
}
