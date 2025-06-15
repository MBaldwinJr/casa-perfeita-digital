-- Create template_etapas_obras table for predefined stages
CREATE TABLE public.template_etapas_obras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  duracao_estimada_dias INTEGER NOT NULL DEFAULT 7,
  ordem_execucao INTEGER NOT NULL,
  categoria TEXT NOT NULL, -- 'estrutural', 'instalacoes', 'acabamento', etc.
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create obra_etapas_selecionadas table to track which templates are active for each obra
CREATE TABLE public.obra_etapas_selecionadas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  template_etapa_id UUID NOT NULL REFERENCES public.template_etapas_obras(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem_personalizada INTEGER,
  duracao_personalizada_dias INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(obra_id, template_etapa_id)
);

-- Enable RLS
ALTER TABLE public.template_etapas_obras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.obra_etapas_selecionadas ENABLE ROW LEVEL SECURITY;

-- RLS policies for template_etapas_obras (read-only for all authenticated users)
CREATE POLICY "Templates are viewable by all authenticated users" 
ON public.template_etapas_obras 
FOR SELECT 
USING (auth.role() = 'authenticated');

-- RLS policies for obra_etapas_selecionadas
CREATE POLICY "Users can view etapas of their obras" 
ON public.obra_etapas_selecionadas 
FOR SELECT 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

CREATE POLICY "Users can manage etapas for their obras" 
ON public.obra_etapas_selecionadas 
FOR ALL 
USING (auth.uid() IN (SELECT user_id FROM public.obras WHERE id = obra_id));

-- Add triggers for timestamps
CREATE TRIGGER update_template_etapas_obras_updated_at
BEFORE UPDATE ON public.template_etapas_obras
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_obra_etapas_selecionadas_updated_at
BEFORE UPDATE ON public.obra_etapas_selecionadas
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert predefined construction stages
INSERT INTO public.template_etapas_obras (nome, descricao, duracao_estimada_dias, ordem_execucao, categoria) VALUES
('Planejamento e Licenciamento', 'Aprovação de projetos, obtenção de licenças e documentação necessária', 30, 1, 'planejamento'),
('Preparação do Terreno', 'Limpeza, demarcação, movimento de terra e terraplanagem', 7, 2, 'preparacao'),
('Fundação', 'Escavação, armação, concretagem e cura da fundação', 14, 3, 'estrutural'),
('Estrutura de Concreto', 'Pilares, vigas, lajes e estrutura principal em concreto armado', 21, 4, 'estrutural'),
('Alvenaria Estrutural', 'Execução das paredes de vedação e estruturais', 14, 5, 'estrutural'),
('Cobertura', 'Estrutura do telhado, telhas e impermeabilização', 10, 6, 'cobertura'),
('Instalações Elétricas', 'Eletrodutos, fiação, quadros elétricos e pontos de luz', 12, 7, 'instalacoes'),
('Instalações Hidráulicas', 'Tubulações de água, esgoto, caixas d''água e registros', 10, 8, 'instalacoes'),
('Instalações de Gás', 'Tubulação de gás, medidores e registros de segurança', 5, 9, 'instalacoes'),
('Revestimento Interno', 'Chapisco, reboco, massa corrida e preparação das paredes', 14, 10, 'acabamento'),
('Pisos e Azulejos', 'Contrapiso, cerâmica, porcelanato e azulejos', 12, 11, 'acabamento'),
('Pintura Interna', 'Primer, massa corrida, lixamento e pintura das paredes internas', 8, 12, 'acabamento'),
('Esquadrias', 'Instalação de portas, janelas, batentes e ferragens', 7, 13, 'acabamento'),
('Instalações de Bancadas', 'Bancadas de cozinha, banheiro e área de serviço', 5, 14, 'acabamento'),
('Louças e Metais', 'Instalação de vasos sanitários, pias, chuveiros e torneiras', 3, 15, 'acabamento'),
('Revestimento Externo', 'Chapisco, reboco e textura das fachadas', 10, 16, 'acabamento'),
('Pintura Externa', 'Preparação e pintura das fachadas externas', 7, 17, 'acabamento'),
('Calçadas e Muros', 'Execução de calçadas, muros de divisa e portões', 8, 18, 'acabamento'),
('Paisagismo', 'Plantio de grama, árvores e acabamento das áreas verdes', 5, 19, 'acabamento'),
('Limpeza Final', 'Limpeza geral da obra e preparação para entrega', 3, 20, 'finalizacao'),
('Vistoria e Entrega', 'Vistoria final, correções e entrega das chaves', 5, 21, 'finalizacao');

-- Create indexes for better performance
CREATE INDEX idx_template_etapas_ordem ON public.template_etapas_obras(ordem_execucao);
CREATE INDEX idx_template_etapas_categoria ON public.template_etapas_obras(categoria);
CREATE INDEX idx_obra_etapas_obra_id ON public.obra_etapas_selecionadas(obra_id);
CREATE INDEX idx_obra_etapas_template_id ON public.obra_etapas_selecionadas(template_etapa_id);