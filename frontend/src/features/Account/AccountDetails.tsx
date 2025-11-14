import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pen, Save } from 'lucide-react';
import type { User } from '@/types/user';
import api from '@/services/api';
import useAuth from '@/hooks/useAuthContext';
import { setToken } from '@/utils/handleToken';
import { toast } from 'react-toastify';

import { formatDateBR } from '@/utils/formatters';

function AccountDetails() {
  const [isEditing, setIsEditing] = useState(false);
  const [originalUserData, setOriginalUserData] = useState<User | null>(null);
  const [user, setUser] = useState<User>();

  const [name, setName] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [phone, setPhone] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [specialty, setSpecialty] = useState<string | null>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [horarioId, setHorarioId] = useState<string | null>(null);

  const userContext = useAuth();

  useEffect(() => {
    async function fetchData() {
      if (!userContext.user?.id) return;

      const { role, id } = userContext.user;

      let userEndpoint = '';

      if (role === 'medico') {
        userEndpoint = `/api/clinica/medicos/${id}`;
      } else if (role === 'recepcionista') {
        userEndpoint = `/api/clinica/recepcionistas/${id}`;
      } else if (role === 'admin') {
        userEndpoint = `/api/clinica/usuarios/${id}`;
      } else if (role === 'paciente') {
        userEndpoint = `/api/clinica/pacientes/${id}`;
      } else {
        toast.error('Role de usuário desconhecido.');
        return;
      }

      try {
        const userResponse = await api.get(userEndpoint);

        const userData = userResponse.data.user
          ? userResponse.data.user
          : userResponse.data;

        if (role === 'medico' && userResponse.data.specialty) {
          userData.specialty = userResponse.data.specialty;
        }

        setUser(userData);
        setName(userData.name);
        // O input type="date" requer o formato YYYY-MM-DD
        setBirthdate(userData.birthdate?.slice(0, 10) || '');
        setPhone(userData.phone || '');
        setPostalCode(userData.postal_code || '');

        const fullOriginalData = { ...userData };

        if (userData.role === 'medico') {
          setSpecialty(userData.specialty || '');

          const horarioResponse = await api.get(
            `/api/clinica/horarios/medico/${userContext.user.id}`
          );

          if (horarioResponse.data && horarioResponse.data.length > 0) {
            const horarioData = horarioResponse.data[0];
            setStartTime(horarioData.start_time);
            setEndTime(horarioData.end_time);
            setHorarioId(horarioData.id);

            (fullOriginalData as any).start_time = horarioData.start_time;
            (fullOriginalData as any).end_time = horarioData.end_time;
          }
        }

        setOriginalUserData(fullOriginalData);
      } catch (error) {
        console.error('Erro ao buscar dados da conta:', error);
        toast.error('Não foi possível carregar os dados da conta.');
      }
    }

    fetchData();
  }, [userContext.user?.id]);

  // ... (código existente handleUpdate e handleCancel)
  async function handleUpdate() {
    if (!userContext.user) return;

    const role = userContext.user.role;

    const userPayload: any = {
      name,
      birthdate: new Date(birthdate),
      phone,
      postal_code: postalCode,
    };
    if (role === 'medico') {
      userPayload.specialty = specialty;
    }

    try {
      const userEndpoint =
        role === 'medico'
          ? `/api/clinica/medicos/${userContext.user.id}`
          : role === 'recepcionista'
          ? `/api/clinica/recepcionistas/${userContext.user.id}`
          : `/api/clinica/usuarios/admin/${userContext.user.id}`;

      const userResponse = await api.put(userEndpoint, userPayload);

      userContext.setUser({
        id: userResponse.data.user.id,
        name: userResponse.data.user.name,
        document: userResponse.data.user.document,
        email: userResponse.data.user.email,
        role: userResponse.data.user.role,
      });
      setToken(userResponse.data.token);

      if (role === 'medico' && startTime && endTime) {
        const horarioPayload = {
          medico_id: userContext.user.id,
          start_time: startTime,
          end_time: endTime,
        };

        if (horarioId) {
          await api.put(`/api/clinica/horarios/${horarioId}`, horarioPayload);
        } else {
          await api.post('/api/clinica/horarios', horarioPayload);
        }
      }

      toast.success('Dados atualizados com sucesso!');
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao atualizar os dados:', error);
      toast.error('Ocorreu um erro ao salvar as alterações.');
    }
  }

  const handleCancel = () => {
    if (originalUserData) {
      setName(originalUserData.name);
      setBirthdate(originalUserData.birthdate?.slice(0, 10) || '');
      setPhone(originalUserData.phone || '');
      setPostalCode(originalUserData.postal_code || '');

      if (originalUserData.role === 'medico') {
        setSpecialty(originalUserData.specialty || '');

        setStartTime((originalUserData as any).start_time || '');
        setEndTime((originalUserData as any).end_time || '');
      }
    }
    setIsEditing(false);
  };

  return (
    user && (
      <Card className="max-w-2xl mx-auto mt-8 mb-8">
        <CardHeader>
          <CardTitle>Detalhes da Conta</CardTitle>
          <CardDescription>
            Visualize e edite suas informações pessoais e de trabalho.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ... Campos de usuário ... */}
          <div>
            <Label htmlFor="nome">Nome completo</Label>
            <Input
              id="nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" value={user.email} disabled />
          </div>
          <div>
            <Label htmlFor="documento">CPF</Label>
            <Input id="documento" value={user.document} disabled />
          </div>

          {/* --- CORREÇÃO: Lógica condicional para Data de Nascimento --- */}
          <div>
            <Label htmlFor="birthdate">Data de nascimento</Label>
            {isEditing ? (
              <Input
                id="birthdate"
                type="date"
                value={birthdate} // Mantém o formato YYYY-MM-DD para o input
                onChange={(e) => setBirthdate(e.target.value)}
              />
            ) : (
              <Input
                id="birthdate"
                type="text"
                value={formatDateBR(birthdate)} // Mostra dd/MM/yyyy quando desabilitado
                disabled
              />
            )}
          </div>

          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="postal_code">CEP</Label>
            <Input
              id="postal_code"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {userContext.user?.role === 'medico' && (
            <>
              {/* ... (código existente da especialidade e horário) ... */}
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Input
                  id="especialidade"
                  value={specialty || ''}
                  onChange={(e) => setSpecialty(e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium">Horário de Trabalho</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Defina seu horário padrão de atendimento de Segunda a Sexta.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start_time">Início do Expediente</Label>
                    <Input
                      id="start_time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end_time">Fim do Expediente</Label>
                    <Input
                      id="end_time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ... (código existente dos botões) ... */}
          <div className="flex justify-end gap-4 pt-4">
            {isEditing && (
              <Button
                variant="destructive"
                className="cursor-pointer"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            )}
            <Button
              className={
                isEditing
                  ? 'cursor-pointer bg-green-500 hover:bg-green-400'
                  : 'cursor-pointer'
              }
              onClick={isEditing ? handleUpdate : () => setIsEditing(true)}
            >
              {isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" /> Salvar
                </>
              ) : (
                <>
                  <Pen className="w-4 h-4 mr-2" /> Editar
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  );
}

export default AccountDetails;
