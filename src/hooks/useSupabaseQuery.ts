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

export interface AnaliseJuridica {
  id: string;
  user_id: string;
  cliente_id?: string;
  imovel_id?: string;
  tipo: 'documentos' | 'viabilidade' | 'riscos' | 'due_diligence';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  responsavel: string;
  prazo_conclusao?: string;
  observacoes?: string;
  resultado?: string;
  created_at: string;
  updated_at: string;
  clientes?: Cliente;
  imoveis?: Imovel;
}

export interface ProcessoJuridico {
  id: string;
  user_id: string;
  cliente_id?: string;
  imovel_id?: string;
  numero_processo?: string;
  tipo: string;
  instancia: string;
  vara?: string;
  status: 'ativo' | 'arquivado' | 'suspenso' | 'finalizado';
  data_inicio: string;
  data_conclusao?: string;
  valor_causa?: number;
  advogado_responsavel: string;
  descricao?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
  clientes?: Cliente;
  imoveis?: Imovel;
}

export interface DocumentoJuridico {
  id: string;
  user_id: string;
  cliente_id?: string;
  imovel_id?: string;
  analise_id?: string;
  processo_id?: string;
  nome: string;
  tipo: string;
  categoria: string;
  status: 'pendente' | 'valido' | 'vencido' | 'invalido';
  data_emissao?: string;
  data_vencimento?: string;
  orgao_emissor?: string;
  numero_documento?: string;
  observacoes?: string;
  arquivo_url?: string;
  created_at: string;
  updated_at: string;
  clientes?: Cliente;
  imoveis?: Imovel;
}

export interface AlertaJuridico {
  id: string;
  user_id: string;
  tipo: 'urgente' | 'atencao' | 'info';
  titulo: string;
  mensagem: string;
  status: 'ativo' | 'visto' | 'resolvido';
  data_vencimento?: string;
  entidade_tipo?: string;
  entidade_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ResponsavelJuridico {
  id: string;
  user_id: string;
  nome: string;
  email?: string;
  telefone?: string;
  oab?: string;
  especializacao?: string;
  ativo: boolean;
  created_at: string;
  updated_at: string;
}

export interface Obra {
  id: string;
  user_id: string;
  nome: string;
  endereco: string;
  descricao?: string;
  data_inicio: string;
  data_previsao_fim?: string;
  data_conclusao?: string;
  valor_orcamento?: number;
  valor_gasto: number;
  progresso_percentual: number;
  status: 'planejamento' | 'fundacao' | 'estrutura' | 'alvenaria' | 'cobertura' | 'instalacoes' | 'acabamento' | 'concluida' | 'pausada';
  responsavel_tecnico?: string;
  cnpj_responsavel?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface CronogramaObra {
  id: string;
  obra_id: string;
  etapa: string;
  descricao?: string;
  data_inicio_prevista: string;
  data_fim_prevista: string;
  data_inicio_real?: string;
  data_fim_real?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'atrasada';
  ordem_execucao: number;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface LicencaObra {
  id: string;
  obra_id: string;
  nome: string;
  tipo: string;
  numero_licenca?: string;
  orgao_emissor?: string;
  data_emissao?: string;
  data_vencimento?: string;
  status: 'pendente' | 'aprovada' | 'vencida' | 'renovacao' | 'negada';
  arquivo_url?: string;
  observacoes?: string;
  created_at: string;
  updated_at: string;
}

export interface FotoObra {
  id: string;
  obra_id: string;
  cronograma_id?: string;
  titulo?: string;
  descricao?: string;
  arquivo_url: string;
  data_foto: string;
  etapa?: string;
  created_at: string;
  updated_at: string;
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

// Hooks jurídicos
export const useAnalises = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['analises', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('analises_juridicas')
        .select(`
          *,
          clientes:cliente_id(*),
          imoveis:imovel_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AnaliseJuridica[];
    },
    enabled: !!user,
  });
};

export const useProcessos = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['processos', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('processos_juridicos')
        .select(`
          *,
          clientes:cliente_id(*),
          imoveis:imovel_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ProcessoJuridico[];
    },
    enabled: !!user,
  });
};

export const useDocumentosJuridicos = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['documentos', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('documentos_juridicos')
        .select(`
          *,
          clientes:cliente_id(*),
          imoveis:imovel_id(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as DocumentoJuridico[];
    },
    enabled: !!user,
  });
};

export const useAlertasJuridicos = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['alertas', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('alertas_juridicos')
        .select('*')
        .eq('status', 'ativo')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as AlertaJuridico[];
    },
    enabled: !!user,
  });
};

export const useCreateAnalise = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (analise: Omit<AnaliseJuridica, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'clientes' | 'imoveis'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('analises_juridicas')
        .insert([{ ...analise, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['analises'] });
      toast({
        title: "Análise criada!",
        description: "Análise jurídica foi criada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar análise",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateProcesso = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (processo: Omit<ProcessoJuridico, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'clientes' | 'imoveis'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('processos_juridicos')
        .insert([{ ...processo, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      toast({
        title: "Processo criado!",
        description: "Processo jurídico foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar processo",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateDocumento = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (documento: Omit<DocumentoJuridico, 'id' | 'created_at' | 'updated_at' | 'user_id' | 'clientes' | 'imoveis'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('documentos_juridicos')
        .insert([{ ...documento, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documentos'] });
      toast({
        title: "Documento criado!",
        description: "Documento foi criado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar documento",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateAlertaStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'ativo' | 'visto' | 'resolvido' }) => {
      const { data, error } = await supabase
        .from('alertas_juridicos')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertas'] });
    },
  });
};

export const useResponsaveis = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['responsaveis', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('responsaveis_juridicos')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ResponsavelJuridico[];
    },
    enabled: !!user,
  });
};

export const useCreateResponsavel = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (responsavel: Omit<ResponsavelJuridico, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('responsaveis_juridicos')
        .insert([{ ...responsavel, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsaveis'] });
      toast({
        title: "Responsável criado!",
        description: "Responsável foi adicionado com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar responsável",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateResponsavel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<ResponsavelJuridico> & { id: string }) => {
      const { data, error } = await supabase
        .from('responsaveis_juridicos')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['responsaveis'] });
      toast({
        title: "Responsável atualizado!",
        description: "Dados foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar responsável",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

// Hooks para Obras
export const useObras = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['obras', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('obras')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Obra[];
    },
    enabled: !!user,
  });
};

export const useCronogramasObra = (obraId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['cronogramas', obraId],
    queryFn: async () => {
      if (!user || !obraId) return [];
      
      const { data, error } = await supabase
        .from('cronograma_obras')
        .select('*')
        .eq('obra_id', obraId)
        .order('ordem_execucao', { ascending: true });
      
      if (error) throw error;
      return data as CronogramaObra[];
    },
    enabled: !!user && !!obraId,
  });
};

export const useLicencasObra = (obraId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['licencas', obraId],
    queryFn: async () => {
      if (!user || !obraId) return [];
      
      const { data, error } = await supabase
        .from('licencas_obras')
        .select('*')
        .eq('obra_id', obraId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as LicencaObra[];
    },
    enabled: !!user && !!obraId,
  });
};

export const useFotosObra = (obraId: string) => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['fotos', obraId],
    queryFn: async () => {
      if (!user || !obraId) return [];
      
      const { data, error } = await supabase
        .from('fotos_obras')
        .select('*')
        .eq('obra_id', obraId)
        .order('data_foto', { ascending: false });
      
      if (error) throw error;
      return data as FotoObra[];
    },
    enabled: !!user && !!obraId,
  });
};

export const useCreateObra = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (obra: Omit<Obra, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('obras')
        .insert([{ ...obra, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast({
        title: "Obra criada!",
        description: "Obra foi adicionada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar obra",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Obra> & { id: string }) => {
      const { data, error } = await supabase
        .from('obras')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['obras'] });
      toast({
        title: "Obra atualizada!",
        description: "Dados foram atualizados com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar obra",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateCronogramaObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cronograma: Omit<CronogramaObra, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('cronograma_obras')
        .insert([cronograma])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['cronogramas', data.obra_id] });
      toast({
        title: "Cronograma criado!",
        description: "Etapa foi adicionada ao cronograma.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar cronograma",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateLicencaObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (licenca: Omit<LicencaObra, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('licencas_obras')
        .insert([licenca])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['licencas', data.obra_id] });
      toast({
        title: "Licença criada!",
        description: "Licença foi adicionada com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar licença",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useCreateFotoObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (foto: Omit<FotoObra, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('fotos_obras')
        .insert([foto])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['fotos', data.obra_id] });
      toast({
        title: "Foto adicionada!",
        description: "Foto foi adicionada à obra.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao adicionar foto",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};


// Hooks para templates de etapas
export const useTemplateEtapas = () => {
  return useQuery({
    queryKey: ['template-etapas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('template_etapas_obras')
        .select('*')
        .eq('ativo', true)
        .order('ordem_execucao', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useObraEtapasSelecionadas = (obraId: string) => {
  return useQuery({
    queryKey: ['obra-etapas-selecionadas', obraId],
    queryFn: async () => {
      if (!obraId) return [];
      
      const { data, error } = await supabase
        .from('obra_etapas_selecionadas')
        .select(`
          *,
          template_etapas_obras!inner(*)
        `)
        .eq('obra_id', obraId)
        .order('ordem_personalizada', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!obraId,
  });
};

export const useToggleEtapaObra = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      obraId, 
      templateEtapaId, 
      ativo, 
      ordemPersonalizada,
      duracaoPersonalizada 
    }: {
      obraId: string;
      templateEtapaId: string;
      ativo: boolean;
      ordemPersonalizada?: number;
      duracaoPersonalizada?: number;
    }) => {
      if (ativo) {
        // Adicionar etapa
        const { data, error } = await supabase
          .from('obra_etapas_selecionadas')
          .upsert({
            obra_id: obraId,
            template_etapa_id: templateEtapaId,
            ativo: true,
            ordem_personalizada: ordemPersonalizada,
            duracao_personalizada_dias: duracaoPersonalizada
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Remover etapa
        const { error } = await supabase
          .from('obra_etapas_selecionadas')
          .delete()
          .eq('obra_id', obraId)
          .eq('template_etapa_id', templateEtapaId);

        if (error) throw error;
        return null;
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['obra-etapas-selecionadas', variables.obraId] });
      toast({
        title: "Etapa atualizada!",
        description: "Configuração da etapa foi salva com sucesso.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar etapa",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useGerarCronogramaAutomatico = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ obraId, dataInicio }: { obraId: string; dataInicio: string }) => {
      // Buscar etapas selecionadas para a obra
      const { data: etapasSelecionadas, error: selectError } = await supabase
        .from('obra_etapas_selecionadas')
        .select(`
          *,
          template_etapas_obras!inner(*)
        `)
        .eq('obra_id', obraId)
        .eq('ativo', true)
        .order('ordem_personalizada', { ascending: true });

      if (selectError) throw selectError;

      // Gerar cronograma baseado nas etapas selecionadas
      let dataAtual = new Date(dataInicio);
      const cronogramaItems = [];

      for (const etapaSelecionada of etapasSelecionadas) {
        const template = etapaSelecionada.template_etapas_obras;
        const duracao = etapaSelecionada.duracao_personalizada_dias || template.duracao_estimada_dias;
        
        const dataFim = new Date(dataAtual);
        dataFim.setDate(dataFim.getDate() + duracao);

        cronogramaItems.push({
          obra_id: obraId,
          etapa: template.nome,
          descricao: template.descricao,
          data_inicio_prevista: dataAtual.toISOString().split('T')[0],
          data_fim_prevista: dataFim.toISOString().split('T')[0],
          ordem_execucao: etapaSelecionada.ordem_personalizada || template.ordem_execucao,
          status: 'pendente'
        });

        // Próxima etapa começa no dia seguinte ao fim da anterior
        dataAtual = new Date(dataFim);
        dataAtual.setDate(dataAtual.getDate() + 1);
      }

      // Inserir no cronograma
      if (cronogramaItems.length > 0) {
        const { data, error } = await supabase
          .from('cronograma_obras')
          .insert(cronogramaItems)
          .select();

        if (error) throw error;
        return data;
      }

      return [];
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['cronogramas', variables.obraId] });
      toast({
        title: "Cronograma gerado!",
        description: "Cronograma automático foi criado com base nas etapas selecionadas.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao gerar cronograma",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};