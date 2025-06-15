-- Criar bucket de storage para documentos jurídicos
INSERT INTO storage.buckets (id, name, public) VALUES ('juridico-docs', 'juridico-docs', false);

-- Políticas para o bucket de documentos jurídicos
CREATE POLICY "Users can view their own documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'juridico-docs' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Adicionar colunas para melhorar funcionalidades
ALTER TABLE public.analises_juridicas 
ADD COLUMN tags TEXT[],
ADD COLUMN arquivos_anexos TEXT[];

ALTER TABLE public.processos_juridicos 
ADD COLUMN tags TEXT[],
ADD COLUMN arquivos_anexos TEXT[];

-- Tabela para histórico de atividades
CREATE TABLE public.historico_atividades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  entidade_tipo TEXT NOT NULL, -- 'analise', 'processo', 'documento', 'alerta'
  entidade_id UUID NOT NULL,
  acao TEXT NOT NULL, -- 'criou', 'atualizou', 'removeu', 'concluiu'
  descricao TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.historico_atividades ENABLE ROW LEVEL SECURITY;

-- Política para histórico
CREATE POLICY "Users can view their own history" 
ON public.historico_atividades 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own history" 
ON public.historico_atividades 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_historico_atividades_user_id ON public.historico_atividades(user_id);
CREATE INDEX idx_historico_atividades_entidade ON public.historico_atividades(entidade_tipo, entidade_id);
CREATE INDEX idx_historico_atividades_data ON public.historico_atividades(created_at);

-- Adicionar índices para busca por tags
CREATE INDEX idx_analises_juridicas_tags ON public.analises_juridicas USING GIN(tags);
CREATE INDEX idx_processos_juridicos_tags ON public.processos_juridicos USING GIN(tags);