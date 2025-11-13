import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Medico } from '@/types/medico';
import type { Paciente } from '@/types/paciente';
import { formatPhone } from '@/utils/formatters';
import { getInitials } from '@/utils/getInitials';

type UserDataProps = {
  userData: Medico | Paciente;
};

function UserCard({ userData }: UserDataProps) {
  const isMedico = 'specialty' in userData;

  return (
    <Card className="w-full max-w-sm text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer">
      <CardHeader className="p-6">
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center h-24 w-24 rounded-full bg-primary/10 text-primary text-3xl font-bold">
            {getInitials(userData.user.name)}
          </div>
        </div>
        <CardTitle className="text-xl font-semibold tracking-tight">
          {userData.user.name}
        </CardTitle>
        {isMedico && (
          <p className="text-sm font-medium text-primary mt-1">
            {userData.specialty}
          </p>
        )}
      </CardHeader>
      <CardContent className="px-6 pb-6 -mt-2">
        <div className="text-sm text-muted-foreground space-y-1 border-t pt-4">
          <p>{userData.user.email}</p>
          <p>{formatPhone(userData.user.phone || '')}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
