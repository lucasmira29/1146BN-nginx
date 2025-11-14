/* eslint-disable @typescript-eslint/no-explicit-any */
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cpf } from 'cpf-cnpj-validator';
import { Link, useNavigate, useSearchParams } from 'react-router';
import api from '@/services/api';
import type { Role } from '@/types/user';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowBigLeft } from 'lucide-react';
import useAuth from '@/hooks/useAuthContext';

// Schema continua o mesmo (correto)
const formSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
  document: z
    .string()
    .min(11, 'CPF é obrigatório')
    .transform((val) => val.replace(/[.-]/g, ''))
    .refine((val) => cpf.isValid(val), {
      message: 'CPF inválido',
    }),
  birthdate: z.string().min(1, 'Data é obrigatória'),
  phone: z.string().optional(),
  postal_code: z.string().min(8, 'CEP é obrigatório'),
});

type FormData = z.infer<typeof formSchema>;

function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  // MUDANÇA: Padrão agora é MEDICO, e o tipo não inclui 'PACIENTE'
  const [role, setRole] = useState<Role>('MEDICO');
  const [searchParams] = useSearchParams();
  const [tipoCadastro, setTipoCadastro] = useState<string | null>(null);
  const { user } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    const tipo = searchParams.get('type');

    if (tipo === 'paciente') {
      setTipoCadastro(tipo);

      if (!user) {
        toast.warn('Você precisa estar logado para cadastrar um paciente.');
        navigate('/login');
      } else if (user?.role !== 'admin' && user?.role !== 'recepcionista') {
        toast.warn('Você não tem permissão para cadastrar pacientes.');
        navigate('/dashboard/home');
      }
    } else {
      setTipoCadastro(null);
    }
  }, [searchParams, navigate, user]);

  const onSubmit = async (data: FormData) => {
    let roleParaEnviar: string;

    if (tipoCadastro === 'paciente') {
      roleParaEnviar = 'PACIENTE';
    } else {
      // Usa a role do <Select> (Medico ou Recepcionista)
      roleParaEnviar = role;
    }

    const userData = {
      ...data,
      birthdate: new Date(data.birthdate),
      role: roleParaEnviar,
    };

    const endpoint = '/api/auth/users/register'; // Correto

    try {
      const response = await api.post(endpoint, userData);
      toast.success(response.data.message || 'Cadastro realizado com sucesso!');
      reset();

      if (tipoCadastro === 'paciente') {
        navigate('/dashboard/pacientes');
      } else {
        navigate('/login');
      }
    } catch (error: any) {
      if (error.response) {
        toast.error(error.response.data.message || 'Erro desconhecido');
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Cadastro</CardTitle>
          <CardDescription>
            {tipoCadastro === 'paciente'
              ? 'Preencha os dados para criar a conta do paciente'
              : 'Preencha os dados abaixo para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* ... (Todos os campos Input de nome, email, senha, etc. continuam iguais) ... */}
            <div className="grid gap-3">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Digite o nome do paciente'
                    : 'Digite seu nome'
                }
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Digite o email do paciente'
                    : 'Digite seu email'
                }
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Crie uma senha temporária (mín. 8 caracteres)'
                    : 'Digite sua senha (mín. 8 caracteres)'
                }
                {...register('password')}
              />
              {errors.password && (
                <p className="text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="document">CPF</Label>
              <Input
                id="document"
                type="text"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Digite o CPF do paciente'
                    : 'Digite seu CPF'
                }
                {...register('document')}
              />
              {errors.document && (
                <p className="text-sm text-red-500">
                  {errors.document.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="birthdate">Data de nascimento</Label>
              <Input id="birthdate" type="date" {...register('birthdate')} />
              {errors.birthdate && (
                <p className="text-sm text-red-500">
                  {errors.birthdate.message}
                </p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Digite o telefone do paciente'
                    : 'Digite seu telefone'
                }
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="grid gap-3">
              <Label htmlFor="postal_code">CEP</Label>
              <Input
                id="postal_code"
                type="text"
                placeholder={
                  tipoCadastro === 'paciente'
                    ? 'Digite o CEP do paciente'
                    : 'Digite seu CEP'
                }
                {...register('postal_code')}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-500">
                  {errors.postal_code.message}
                </p>
              )}
            </div>

            {/* Este seletor SÓ aparece no auto-cadastro público */}
            {tipoCadastro !== 'paciente' && (
              <div className="grid gap-3">
                <Label>Função</Label>
                <Select
                  onValueChange={(value) => setRole(value as Role)}
                  required
                  defaultValue="MEDICO" // MUDANÇA: Padrão é MEDICO
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione sua função" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="MEDICO">Médico</SelectItem>
                      <SelectItem value="RECEPCIONISTA">
                        Recepcionista
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}

            <Button type="submit" className="w-full cursor-pointer">
              Cadastrar
            </Button>

            {tipoCadastro !== 'paciente' ? (
              <div className="mt-4 text-center text-sm">
                Já possui uma conta?
                <Link to="/login" className="underline underline-offset-4">
                  Faça login
                </Link>
              </div>
            ) : (
              <div className="mt-1 text-center text-sm">
                <Button
                  variant="outline"
                  className="cursor-pointer w-30"
                  onClick={() => navigate(-1)}
                  type="button"
                >
                  <ArrowBigLeft />
                  Voltar
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignUpForm;
