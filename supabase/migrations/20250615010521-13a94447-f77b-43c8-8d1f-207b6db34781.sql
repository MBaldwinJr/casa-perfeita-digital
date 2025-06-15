-- Criar tabela para responsáveis jurídicos
CREATE TABLE public.responsaveis_juridicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  oab TEXT,
  especializacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.responsaveis_juridicos ENABLE ROW LEVEL SECURITY;

-- Criar políticas RLS
CREATE POLICY "Users can view their own responsaveis" 
ON public.responsaveis_juridicos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own responsaveis" 
ON public.responsaveis_juridicos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own responsaveis" 
ON public.responsaveis_juridicos 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own responsaveis" 
ON public.responsaveis_juridicos 
FOR DELETE 
USING (auth.uid() = user_id);

-- Trigger para updated_at
CREATE TRIGGER update_responsaveis_juridicos_updated_at
BEFORE UPDATE ON public.responsaveis_juridicos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Índices
CREATE INDEX idx_responsaveis_juridicos_user_id ON public.responsaveis_juridicos(user_id);
CREATE INDEX idx_responsaveis_juridicos_ativo ON public.responsaveis_juridicos(ativo);