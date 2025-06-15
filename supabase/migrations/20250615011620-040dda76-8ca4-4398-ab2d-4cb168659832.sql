-- Create obras table
CREATE TABLE public.obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  nome TEXT NOT NULL,
  endereco TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_previsao_fim DATE,
  data_conclusao DATE,
  valor_orcamento NUMERIC,
  valor_gasto NUMERIC DEFAULT 0,
  progresso_percentual INTEGER DEFAULT 0 CHECK (progresso_percentual >= 0 AND progresso_percentual <= 100),
  status TEXT NOT NULL DEFAULT 'planejamento' CHECK (status IN ('planejamento', 'fundacao', 'estrutura', 'alvenaria', 'cobertura', 'instalacoes', 'acabamento', 'concluida', 'pausada')),
  responsavel_tecnico TEXT,
  cnpj_responsavel TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cronograma_obras table
CREATE TABLE public.cronograma_obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL,
  descricao TEXT,
  data_inicio_prevista DATE NOT NULL,
  data_fim_prevista DATE NOT NULL,
  data_inicio_real DATE,
  data_fim_real DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'em_andamento', 'concluida', 'atrasada')),
  ordem_execucao INTEGER NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create licencas_obras table  
CREATE TABLE public.licencas_obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL,
  numero_licenca TEXT,
  orgao_emissor TEXT,
  data_emissao DATE,
  data_vencimento DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aprovada', 'vencida', 'renovacao', 'negada')),
  arquivo_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fotos_obras table
CREATE TABLE public.fotos_obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  cronograma_id UUID REFERENCES public.cronograma_obras(id) ON DELETE SET NULL,
  titulo TEXT,
  descricao TEXT,
  arquivo_url TEXT NOT NULL,
  data_foto DATE NOT NULL DEFAULT CURRENT_DATE,
  etapa TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cronograma_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licencas_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fotos_obras ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for obras
CREATE POLICY "Users can view their own obras" 
ON public.obras 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own obras" 
ON public.obras 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own obras" 
ON public.obras 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own obras" 
ON public.obras 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for cronograma_obras
CREATE POLICY "Users can view cronograma of their obras" 
ON public.cronograma_obras 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can create cronograma for their obras" 
ON public.cronograma_obras 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can update cronograma of their obras" 
ON public.cronograma_obras 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can delete cronograma of their obras" 
ON public.cronograma_obras 
FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

-- Create RLS policies for licencas_obras
CREATE POLICY "Users can view licencas of their obras" 
ON public.licencas_obras 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can create licencas for their obras" 
ON public.licencas_obras 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can update licencas of their obras" 
ON public.licencas_obras 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can delete licencas of their obras" 
ON public.licencas_obras 
FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

-- Create RLS policies for fotos_obras
CREATE POLICY "Users can view fotos of their obras" 
ON public.fotos_obras 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can create fotos for their obras" 
ON public.fotos_obras 
FOR INSERT 
WITH CHECK (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can update fotos of their obras" 
ON public.fotos_obras 
FOR UPDATE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can delete fotos of their obras" 
ON public.fotos_obras 
FOR DELETE 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

-- Create storage bucket for obras photos
INSERT INTO storage.buckets (id, name, public) VALUES ('obras-fotos', 'obras-fotos', true);

-- Create storage policies for obras photos
CREATE POLICY "Obras photos are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'obras-fotos');

CREATE POLICY "Users can upload photos to their obras" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'obras-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update photos of their obras" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'obras-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete photos of their obras" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'obras-fotos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_obras_updated_at
BEFORE UPDATE ON public.obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_cronograma_obras_updated_at
BEFORE UPDATE ON public.cronograma_obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_licencas_obras_updated_at
BEFORE UPDATE ON public.licencas_obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fotos_obras_updated_at
BEFORE UPDATE ON public.fotos_obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_obras_user_id ON public.obras(user_id);
CREATE INDEX idx_obras_status ON public.obras(status);
CREATE INDEX idx_cronograma_obras_obra_id ON public.cronograma_obras(obra_id);
CREATE INDEX idx_cronograma_obras_status ON public.cronograma_obras(status);
CREATE INDEX idx_licencas_obras_obra_id ON public.licencas_obras(obra_id);
CREATE INDEX idx_licencas_obras_status ON public.licencas_obras(status);
CREATE INDEX idx_fotos_obras_obra_id ON public.fotos_obras(obra_id);