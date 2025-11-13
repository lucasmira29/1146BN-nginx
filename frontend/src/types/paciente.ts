import type { User } from './user';

export type Paciente = {
  id: number;
  user: User;
  history: string | null;
  allergies: string | null;
}
