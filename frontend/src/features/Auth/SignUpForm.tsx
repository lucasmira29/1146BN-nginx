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

import * as cpfCnpj from 'cpf-cnpj-validator';
import { Link, useNavigate, useSearchParams } from 'react-router';
import api from '../../services/api';
import type { Role } from '@/types/user';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ArrowBigLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuthContext';


const baseSchema = z.object({
  name: z.string().min(3, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
  document: z
    .string()
    .min(11, 'CPF é obrigatório')
    .transform((val) => val.replace(/[.-]/g, ''))
    .refine((val) => cpfCnpj.cpf.isValid(val), {
      message: 'CPF inválido',
    }),
  birthdate: z.string().min(1, 'Data é obrigatória'),
  phone: z.string().optional(),
  postal_code: z.string().min(8, 'CEP é obrigatório'),
});

const standardSchema = baseSchema.extend({
  password: z.string().min(8, 'Mínimo de 8 caracteres'),
});

const pacienteSchema = baseSchema.extend({
  password: z.string().optional(),
});

type FormData = z.infer<typeof standardSchema>;

function SignUpForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [searchParams] = useSearchParams();
  const isPaciente = searchParams.get('type') === 'paciente';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(isPaciente ? pacienteSchema : standardSchema),
  });

  const [role, setRole] = useState<Role>('MEDICO');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isPaciente) {
      if (!user) {
        toast.warn('Você precisa estar logado para cadastrar um paciente.');
        navigate('/login');
      } else if (user?.role !== 'admin' && user?.role !== 'recepcionista') {
        toast.warn('Você não tem permissão para cadastrar pacientes.');
        navigate('/dashboard/home');
      }
    }
  }, [isPaciente, navigate, user]);

  const onSubmit = async (data: FormData) => {
    let roleParaEnviar: string;
    let passwordParaEnviar = data.password;

    if (isPaciente) {
      roleParaEnviar = 'PACIENTE';
      passwordParaEnviar = Math.random().toString(36).slice(-8) + 'P@ciente123';
    } else {
      roleParaEnviar = role;
    }

    const userData = {
      ...data,
      password: passwordParaEnviar,
      birthdate: new Date(data.birthdate),
      role: roleParaEnviar,
    };

    const endpoint = '/api/auth/users/register';

    try {
      const response = await api.post(endpoint, userData);
      toast.success(response.data.message || 'Cadastro realizado com sucesso!');
      reset();

      if (isPaciente) {
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
            {isPaciente
              ? 'Preencha os dados para criar a conta do paciente'
              : 'Preencha os dados abaixo para criar sua conta'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <div className="grid gap-3">
              <Label htmlFor="name">Nome completo</Label>
              <Input
                id="name"
                type="text"
                placeholder={
                  isPaciente ? 'Digite o nome do paciente' : 'Digite seu nome'
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
                  isPaciente ? 'Digite o email do paciente' : 'Digite seu email'
                }
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {!isPaciente && (
              <div className="grid gap-3">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha (mín. 8 caracteres)"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            )}

            <div className="grid gap-3">
              <Label htmlFor="document">CPF</Label>
              <Input
                id="document"
                type="text"
                placeholder={
                  isPaciente ? 'Digite o CPF do paciente' : 'Digite seu CPF'
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
                  isPaciente
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
                  isPaciente ? 'Digite o CEP do paciente' : 'Digite seu CEP'
                }
                {...register('postal_code')}
              />
              {errors.postal_code && (
                <p className="text-sm text-red-500">
                  {errors.postal_code.message}
                </p>
              )}
            </div>

            {!isPaciente && (
              <div className="grid gap-3">
                <Label>Função</Label>
                <Select
                  onValueChange={(value) => setRole(value as Role)}
                  required
                  defaultValue="MEDICO"
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

            {!isPaciente ? (
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
