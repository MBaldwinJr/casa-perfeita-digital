import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

// Types
export interface Cliente {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  cpf_cnpj?: string;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  observacoes?: string;
  created_at: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  tipo: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep?: string;
  area?: number;
  quartos?: number;
  banheiros?: number;
  vagas?: number;
  valor: number;
  status: string;
  descricao?: string;
  created_at: string;
}

export interface Proposta {
  id: string;
  cliente_id: string;
  imovel_id: string;
  valor_proposta: number;
  forma_pagamento: string;
  entrada?: number;
  financiamento?: number;
  data_vencimento?: string;
  data_assinatura?: string;
  status: string;
  observacoes?: string;
  created_at: string;
  clientes?: Cliente;
  imoveis?: Imovel;
}

export interface Financiamento {
  id: string;
  cliente_id: string;
  imovel_id: string;
  banco: string;
  valor_financiado: number;
  entrada?: number;
  prazo_meses?: number;
  taxa_juros?: number;
  valor_parcela?: number;
  status: string;
  data_aprovacao?: string;
  observacoes?: string;
  created_at: string;
  clientes?: Cliente;
  imoveis?: Imovel;
}

// Hooks for fetching data
export const useClientes = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['clientes', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Cliente[];
    },
    enabled: !!user,
  });
};

export const useImoveis = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['imoveis', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('imoveis')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Imovel[];
    },
    enabled: !!user,
  });
};

export const usePropostas = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['propostas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('propostas')
        .select(`
          *,
          clientes:cliente_id(*),
          imoveis:imovel_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Proposta[];
    },
    enabled: !!user,
  });
};

export const useFinanciamentos = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['financiamentos', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('financiamentos')
        .select(`
          *,
          clientes:cliente_id(*),
          imoveis:imovel_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Financiamento[];
    },
    enabled: !!user,
  });
};

// Hooks for mutations
export const useCreateCliente = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (cliente: Omit<Cliente, 'id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('clientes')
        .insert([{ ...cliente, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast({
        title: "Cliente criado!",
        description: "Cliente foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar cliente",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateImovel = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (imovel: Omit<Imovel, 'id' | 'created_at'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('imoveis')
        .insert([{ ...imovel, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['imoveis'] });
      toast({
        title: "Imóvel criado!",
        description: "Imóvel foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar imóvel",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateProposta = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (proposta: Omit<Proposta, 'id' | 'created_at' | 'clientes' | 'imoveis'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('propostas')
        .insert([{ ...proposta, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['propostas'] });
      toast({
        title: "Proposta criada!",
        description: "Proposta foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar proposta",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateFinanciamento = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (financiamento: Omit<Financiamento, 'id' | 'created_at' | 'clientes' | 'imoveis'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('financiamentos')
        .insert([{ ...financiamento, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financiamentos'] });
      toast({
        title: "Financiamento criado!",
        description: "Financiamento foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar financiamento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};