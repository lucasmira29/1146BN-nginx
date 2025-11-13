/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import api from '@/services/api';

interface Usuario {
  id: number;
  name: string;
}

interface SearchInputProps {
  SearchRole: string;
  placeholder?: string;
  onSelect: (item: Usuario) => void;
}

function SearchInput({
  placeholder = 'Buscar...',
  onSelect,
  SearchRole,
}: SearchInputProps) {
  const [name, setName] = useState<string>('');
  const [results, setResults] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selected, setSelected] = useState<boolean>(false);

  useEffect(() => {
    if (name.length < 2) {
      setResults([]);
      return;
    }

    const controller = new AbortController();

    const fetchResults = async () => {
      try {
        setLoading(true);
        const endpoint = SearchRole === 'admin' ? 'usuarios' : SearchRole;
        const { data } = await api.get(`/${endpoint}?name=${name}`, {
          signal: controller.signal,
        });

        let items: Usuario[] = [];

        if (SearchRole === 'pacientes') {
          items = data.pacientes.map((p: any) => ({
            id: p.id,
            name: p.user.name,
          }));
        } else if (SearchRole === 'medicos') {
          items = data.medicos.map((m: any) => ({
            id: m.id,
            name: m.user.name,
          }));
        } else if (SearchRole === 'admin') {
          items = data.users.map((u: any) => ({
            id: u.id,
            name: u.name,
          }));
        }

        setResults(items);
      } catch (err) {
        if ((err as any).name !== 'CanceledError') {
          console.error('Erro na busca:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchResults, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [name, SearchRole, selected]);

  return (
    <Command className='rounded-md border-input border shadow-xs md:min-w-[450px] bg-white'>
      <CommandInput
        placeholder={placeholder}
        value={name}
        onValueChange={(value) => {
          setName(value);
          setSelected(false);
        }}
      />
      <CommandList>

        {!loading && name.length >= 3 && results.length === 0 && (
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        )}

        {!selected && name !== ''  && (
          <CommandGroup>
            {results.map((user) => (
              <CommandItem
                className='cursor-pointer'
                key={user.id}
                value={user.name}
                onSelect={() => {
                  setName(user.name);
                  onSelect(user);
                  setSelected(true);
                }}
              >
                {user.name}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </Command>
  );
}

export default SearchInput;
