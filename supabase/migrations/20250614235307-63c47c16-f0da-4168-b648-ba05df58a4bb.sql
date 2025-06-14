-- Criar tabelas para o módulo jurídico

-- Tabela para análises jurídicas
CREATE TABLE public.analises_juridicas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  imovel_id UUID REFERENCES public.imoveis(id),
  tipo TEXT NOT NULL CHECK (tipo IN ('documentos', 'viabilidade', 'riscos', 'due_diligence')),
  prioridade TEXT NOT NULL CHECK (prioridade IN ('baixa', 'media', 'alta', 'urgente')),
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'cancelada')),
  responsavel TEXT NOT NULL,
  prazo_conclusao DATE,
  observacoes TEXT,
  resultado TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para processos jurídicos
CREATE TABLE public.processos_juridicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  imovel_id UUID REFERENCES public.imoveis(id),
  numero_processo TEXT UNIQUE,
  tipo TEXT NOT NULL,
  instancia TEXT NOT NULL,
  vara TEXT,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'arquivado', 'suspenso', 'finalizado')),
  data_inicio DATE NOT NULL,
  data_conclusao DATE,
  valor_causa NUMERIC,
  advogado_responsavel TEXT NOT NULL,
  descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para documentos jurídicos
CREATE TABLE public.documentos_juridicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id),
  imovel_id UUID REFERENCES public.imoveis(id),
  analise_id UUID REFERENCES public.analises_juridicas(id),
  processo_id UUID REFERENCES public.processos_juridicos(id),
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'valido', 'vencido', 'invalido')),
  data_emissao DATE,
  data_vencimento DATE,
  orgao_emissor TEXT,
  numero_documento TEXT,
  observacoes TEXT,
  arquivo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para alertas jurídicos
CREATE TABLE public.alertas_juridicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('urgente', 'atencao', 'info')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'visto', 'resolvido')),
  data_vencimento DATE,
  entidade_tipo TEXT, -- 'cliente', 'imovel', 'documento', etc
  entidade_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.analises_juridicas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processos_juridicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos_juridicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas_juridicos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para análises jurídicas
CREATE POLICY "Users can view their own analises" 
ON public.analises_juridicas 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analises" 
ON public.analises_juridicas 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analises" 
ON public.analises_juridicas 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analises" 
ON public.analises_juridicas 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para processos jurídicos
CREATE POLICY "Users can view their own processos" 
ON public.processos_juridicos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own processos" 
ON public.processos_juridicos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own processos" 
ON public.processos_juridicos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own processos" 
ON public.processos_juridicos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para documentos jurídicos
CREATE POLICY "Users can view their own documentos" 
ON public.documentos_juridicos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own documentos" 
ON public.documentos_juridicos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documentos" 
ON public.documentos_juridicos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own documentos" 
ON public.documentos_juridicos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Políticas RLS para alertas jurídicos
CREATE POLICY "Users can view their own alertas" 
ON public.alertas_juridicos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own alertas" 
ON public.alertas_juridicos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own alertas" 
ON public.alertas_juridicos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own alertas" 
ON public.alertas_juridicos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Triggers para atualizar updated_at
CREATE TRIGGER update_analises_juridicas_updated_at
BEFORE UPDATE ON public.analises_juridicas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_processos_juridicos_updated_at
BEFORE UPDATE ON public.processos_juridicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_documentos_juridicos_updated_at
BEFORE UPDATE ON public.documentos_juridicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_alertas_juridicos_updated_at
BEFORE UPDATE ON public.alertas_juridicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_analises_juridicas_user_id ON public.analises_juridicas(user_id);
CREATE INDEX idx_analises_juridicas_cliente_id ON public.analises_juridicas(cliente_id);
CREATE INDEX idx_analises_juridicas_status ON public.analises_juridicas(status);

CREATE INDEX idx_processos_juridicos_user_id ON public.processos_juridicos(user_id);
CREATE INDEX idx_processos_juridicos_cliente_id ON public.processos_juridicos(cliente_id);
CREATE INDEX idx_processos_juridicos_status ON public.processos_juridicos(status);

CREATE INDEX idx_documentos_juridicos_user_id ON public.documentos_juridicos(user_id);
CREATE INDEX idx_documentos_juridicos_status ON public.documentos_juridicos(status);
CREATE INDEX idx_documentos_juridicos_vencimento ON public.documentos_juridicos(data_vencimento);

CREATE INDEX idx_alertas_juridicos_user_id ON public.alertas_juridicos(user_id);
CREATE INDEX idx_alertas_juridicos_status ON public.alertas_juridicos(status);
CREATE INDEX idx_alertas_juridicos_tipo ON public.alertas_juridicos(tipo);