-- Create alertas_obras table
CREATE TABLE public.alertas_obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL CHECK (tipo IN ('licenca_vencendo', 'etapa_atrasada', 'orcamento_excedido')),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  data_alerta DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo', 'lido', 'resolvido')),
  prioridade TEXT NOT NULL DEFAULT 'media' CHECK (prioridade IN ('baixa', 'media', 'alta', 'critica')),
  entidade_relacionada_id UUID, -- ID da licença, cronograma, etc.
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.alertas_obras ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own obra alerts" 
ON public.alertas_obras 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own obra alerts" 
ON public.alertas_obras 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own obra alerts" 
ON public.alertas_obras 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own obra alerts" 
ON public.alertas_obras 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_alertas_obras_updated_at
BEFORE UPDATE ON public.alertas_obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_alertas_obras_user_id ON public.alertas_obras(user_id);
CREATE INDEX idx_alertas_obras_obra_id ON public.alertas_obras(obra_id);
CREATE INDEX idx_alertas_obras_tipo ON public.alertas_obras(tipo);
CREATE INDEX idx_alertas_obras_status ON public.alertas_obras(status);
CREATE INDEX idx_alertas_obras_data_alerta ON public.alertas_obras(data_alerta);

-- Create function to generate automatic alerts
CREATE OR REPLACE FUNCTION public.gerar_alertas_automaticos()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Alerts for licenses expiring in 30 days
  INSERT INTO public.alertas_obras (user_id, obra_id, tipo, titulo, descricao, prioridade, entidade_relacionada_id)
  SELECT DISTINCT 
    o.user_id,
    l.obra_id,
    'licenca_vencendo'::text,
    'Licença vencendo em breve'::text,
    'A licença "' || l.nome || '" vence em ' || (l.data_vencimento - CURRENT_DATE) || ' dias.'::text,
    CASE 
      WHEN l.data_vencimento - CURRENT_DATE <= 7 THEN 'critica'::text
      WHEN l.data_vencimento - CURRENT_DATE <= 15 THEN 'alta'::text
      ELSE 'media'::text
    END,
    l.id
  FROM public.licencas_obras l
  JOIN public.obras o ON l.obra_id = o.id
  WHERE l.data_vencimento IS NOT NULL
    AND l.data_vencimento <= CURRENT_DATE + INTERVAL '30 days'
    AND l.data_vencimento > CURRENT_DATE
    AND l.status NOT IN ('vencida', 'renovacao')
    AND NOT EXISTS (
      SELECT 1 FROM public.alertas_obras a 
      WHERE a.obra_id = l.obra_id 
        AND a.tipo = 'licenca_vencendo' 
        AND a.entidade_relacionada_id = l.id 
        AND a.status = 'ativo'
        AND a.data_alerta = CURRENT_DATE
    );

  -- Alerts for overdue stages
  INSERT INTO public.alertas_obras (user_id, obra_id, tipo, titulo, descricao, prioridade, entidade_relacionada_id)
  SELECT DISTINCT 
    o.user_id,
    c.obra_id,
    'etapa_atrasada'::text,
    'Etapa em atraso'::text,
    'A etapa "' || c.etapa || '" deveria ter sido concluída em ' || c.data_fim_prevista::text || '.'::text,
    CASE 
      WHEN CURRENT_DATE - c.data_fim_prevista > 14 THEN 'critica'::text
      WHEN CURRENT_DATE - c.data_fim_prevista > 7 THEN 'alta'::text
      ELSE 'media'::text
    END,
    c.id
  FROM public.cronograma_obras c
  JOIN public.obras o ON c.obra_id = o.id
  WHERE c.data_fim_prevista < CURRENT_DATE
    AND c.status NOT IN ('concluida')
    AND NOT EXISTS (
      SELECT 1 FROM public.alertas_obras a 
      WHERE a.obra_id = c.obra_id 
        AND a.tipo = 'etapa_atrasada' 
        AND a.entidade_relacionada_id = c.id 
        AND a.status = 'ativo'
        AND a.data_alerta = CURRENT_DATE
    );

  -- Alerts for budget exceeded or nearing limit
  INSERT INTO public.alertas_obras (user_id, obra_id, tipo, titulo, descricao, prioridade)
  SELECT DISTINCT 
    o.user_id,
    o.id,
    'orcamento_excedido'::text,
    CASE 
      WHEN o.valor_gasto > o.valor_orcamento THEN 'Orçamento excedido'::text
      ELSE 'Orçamento próximo do limite'::text
    END,
    CASE 
      WHEN o.valor_gasto > o.valor_orcamento THEN 
        'O valor gasto (R$ ' || ROUND(o.valor_gasto, 2)::text || ') excedeu o orçamento previsto (R$ ' || ROUND(o.valor_orcamento, 2)::text || ').'::text
      ELSE 
        'O valor gasto (R$ ' || ROUND(o.valor_gasto, 2)::text || ') está próximo do orçamento previsto (R$ ' || ROUND(o.valor_orcamento, 2)::text || ').'::text
    END,
    CASE 
      WHEN o.valor_gasto > o.valor_orcamento THEN 'critica'::text
      WHEN o.valor_gasto > o.valor_orcamento * 0.9 THEN 'alta'::text
      ELSE 'media'::text
    END
  FROM public.obras o
  WHERE o.valor_orcamento IS NOT NULL 
    AND o.valor_orcamento > 0
    AND o.valor_gasto >= o.valor_orcamento * 0.8 -- Alert when 80% or more of budget is used
    AND o.status NOT IN ('concluida', 'pausada')
    AND NOT EXISTS (
      SELECT 1 FROM public.alertas_obras a 
      WHERE a.obra_id = o.id 
        AND a.tipo = 'orcamento_excedido' 
        AND a.status = 'ativo'
        AND a.data_alerta = CURRENT_DATE
    );
END;
$$;