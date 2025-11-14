import type { User } from './user';

export type Medico = {
  id: string;
  specialty: string;
  user: User;
  horarios: [
    {
      start_time: string;
      end_time: string;
    }
  ];
};
