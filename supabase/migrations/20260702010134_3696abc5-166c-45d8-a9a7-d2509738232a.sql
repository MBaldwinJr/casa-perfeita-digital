
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL, email TEXT, telefone TEXT, cpf_cnpj TEXT,
  endereco TEXT, cidade TEXT, estado TEXT, cep TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own clientes" ON public.clientes FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_clientes_updated BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL, tipo TEXT NOT NULL,
  endereco TEXT NOT NULL, cidade TEXT NOT NULL, estado TEXT NOT NULL, cep TEXT,
  area NUMERIC, quartos INT, banheiros INT, vagas INT,
  valor NUMERIC NOT NULL DEFAULT 0, status TEXT NOT NULL DEFAULT 'disponivel', descricao TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.imoveis TO authenticated;
GRANT ALL ON public.imoveis TO service_role;
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own imoveis" ON public.imoveis FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_imoveis_updated BEFORE UPDATE ON public.imoveis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.propostas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  valor_proposta NUMERIC NOT NULL DEFAULT 0,
  forma_pagamento TEXT NOT NULL DEFAULT 'a_vista',
  entrada NUMERIC, financiamento NUMERIC,
  data_vencimento DATE, data_assinatura DATE,
  status TEXT NOT NULL DEFAULT 'pendente', observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.propostas TO authenticated;
GRANT ALL ON public.propostas TO service_role;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own propostas" ON public.propostas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_propostas_updated BEFORE UPDATE ON public.propostas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.financiamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  banco TEXT NOT NULL,
  valor_financiado NUMERIC NOT NULL DEFAULT 0,
  entrada NUMERIC, prazo_meses INT, taxa_juros NUMERIC, valor_parcela NUMERIC,
  status TEXT NOT NULL DEFAULT 'em_analise',
  data_aprovacao DATE, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.financiamentos TO authenticated;
GRANT ALL ON public.financiamentos TO service_role;
ALTER TABLE public.financiamentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own financiamentos" ON public.financiamentos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_financiamentos_updated BEFORE UPDATE ON public.financiamentos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.analises_juridicas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL, prioridade TEXT NOT NULL DEFAULT 'media',
  status TEXT NOT NULL DEFAULT 'pendente',
  responsavel TEXT NOT NULL,
  prazo_conclusao DATE, observacoes TEXT, resultado TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.analises_juridicas TO authenticated;
GRANT ALL ON public.analises_juridicas TO service_role;
ALTER TABLE public.analises_juridicas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own analises" ON public.analises_juridicas FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_analises_updated BEFORE UPDATE ON public.analises_juridicas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.processos_juridicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  numero_processo TEXT, tipo TEXT NOT NULL, instancia TEXT NOT NULL, vara TEXT,
  status TEXT NOT NULL DEFAULT 'ativo',
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE, data_conclusao DATE,
  valor_causa NUMERIC,
  advogado_responsavel TEXT NOT NULL,
  descricao TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.processos_juridicos TO authenticated;
GRANT ALL ON public.processos_juridicos TO service_role;
ALTER TABLE public.processos_juridicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own processos" ON public.processos_juridicos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_processos_updated BEFORE UPDATE ON public.processos_juridicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.documentos_juridicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  analise_id UUID REFERENCES public.analises_juridicas(id) ON DELETE SET NULL,
  processo_id UUID REFERENCES public.processos_juridicos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL, tipo TEXT NOT NULL, categoria TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  data_emissao DATE, data_vencimento DATE,
  orgao_emissor TEXT, numero_documento TEXT,
  observacoes TEXT, arquivo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documentos_juridicos TO authenticated;
GRANT ALL ON public.documentos_juridicos TO service_role;
ALTER TABLE public.documentos_juridicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own documentos" ON public.documentos_juridicos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_documentos_updated BEFORE UPDATE ON public.documentos_juridicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.alertas_juridicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL, titulo TEXT NOT NULL, mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativo',
  data_vencimento DATE, entidade_tipo TEXT, entidade_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.alertas_juridicos TO authenticated;
GRANT ALL ON public.alertas_juridicos TO service_role;
ALTER TABLE public.alertas_juridicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own alertas jur" ON public.alertas_juridicos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_alertas_jur_updated BEFORE UPDATE ON public.alertas_juridicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.responsaveis_juridicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT, telefone TEXT, oab TEXT, especializacao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.responsaveis_juridicos TO authenticated;
GRANT ALL ON public.responsaveis_juridicos TO service_role;
ALTER TABLE public.responsaveis_juridicos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resp jur" ON public.responsaveis_juridicos FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_resp_jur_updated BEFORE UPDATE ON public.responsaveis_juridicos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL, endereco TEXT NOT NULL, descricao TEXT,
  data_inicio DATE NOT NULL DEFAULT CURRENT_DATE,
  data_previsao_fim DATE, data_conclusao DATE,
  valor_orcamento NUMERIC, valor_gasto NUMERIC NOT NULL DEFAULT 0,
  progresso_percentual NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'planejamento',
  responsavel_tecnico TEXT, cnpj_responsavel TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obras TO authenticated;
GRANT ALL ON public.obras TO service_role;
ALTER TABLE public.obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own obras" ON public.obras FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_obras_updated BEFORE UPDATE ON public.obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.cronograma_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  etapa TEXT NOT NULL, descricao TEXT,
  data_inicio_prevista DATE NOT NULL, data_fim_prevista DATE NOT NULL,
  data_inicio_real DATE, data_fim_real DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  ordem_execucao INT NOT NULL DEFAULT 0, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cronograma_obras TO authenticated;
GRANT ALL ON public.cronograma_obras TO service_role;
ALTER TABLE public.cronograma_obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own cronograma via obra" ON public.cronograma_obras FOR ALL
  USING (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()));
CREATE TRIGGER trg_cron_updated BEFORE UPDATE ON public.cronograma_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.licencas_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome TEXT NOT NULL, tipo TEXT NOT NULL,
  numero_licenca TEXT, orgao_emissor TEXT,
  data_emissao DATE, data_vencimento DATE,
  status TEXT NOT NULL DEFAULT 'pendente',
  arquivo_url TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.licencas_obras TO authenticated;
GRANT ALL ON public.licencas_obras TO service_role;
ALTER TABLE public.licencas_obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own licencas via obra" ON public.licencas_obras FOR ALL
  USING (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()));
CREATE TRIGGER trg_lic_updated BEFORE UPDATE ON public.licencas_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.fotos_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  cronograma_id UUID REFERENCES public.cronograma_obras(id) ON DELETE SET NULL,
  titulo TEXT, descricao TEXT,
  arquivo_url TEXT NOT NULL,
  data_foto DATE NOT NULL DEFAULT CURRENT_DATE,
  etapa TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.fotos_obras TO authenticated;
GRANT ALL ON public.fotos_obras TO service_role;
ALTER TABLE public.fotos_obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own fotos via obra" ON public.fotos_obras FOR ALL
  USING (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()));
CREATE TRIGGER trg_fotos_updated BEFORE UPDATE ON public.fotos_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.template_etapas_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL, descricao TEXT,
  duracao_estimada_dias INT NOT NULL DEFAULT 30,
  ordem_execucao INT NOT NULL DEFAULT 0,
  categoria TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.template_etapas_obras TO authenticated, anon;
GRANT ALL ON public.template_etapas_obras TO service_role;
ALTER TABLE public.template_etapas_obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "read templates" ON public.template_etapas_obras FOR SELECT USING (true);
CREATE TRIGGER trg_tpl_updated BEFORE UPDATE ON public.template_etapas_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.template_etapas_obras (nome, descricao, duracao_estimada_dias, ordem_execucao, categoria) VALUES
 ('Terraplanagem','Preparação e nivelamento do terreno',15,1,'preparacao'),
 ('Fundação','Escavação e concretagem da fundação',30,2,'estrutura'),
 ('Estrutura','Pilares, vigas e lajes',45,3,'estrutura'),
 ('Alvenaria','Levantamento de paredes',30,4,'vedacao'),
 ('Cobertura','Telhado e impermeabilização',20,5,'cobertura'),
 ('Instalações Elétricas','Fiação e quadros',20,6,'instalacoes'),
 ('Instalações Hidráulicas','Tubulações de água e esgoto',20,7,'instalacoes'),
 ('Revestimentos','Reboco, azulejos e pisos',30,8,'acabamento'),
 ('Pintura','Pintura interna e externa',15,9,'acabamento'),
 ('Acabamentos Finais','Louças, metais e limpeza',15,10,'acabamento');

CREATE TABLE public.obra_etapas_selecionadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  template_etapa_id UUID NOT NULL REFERENCES public.template_etapas_obras(id) ON DELETE CASCADE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  ordem_personalizada INT,
  duracao_personalizada_dias INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (obra_id, template_etapa_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.obra_etapas_selecionadas TO authenticated;
GRANT ALL ON public.obra_etapas_selecionadas TO service_role;
ALTER TABLE public.obra_etapas_selecionadas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own etapas via obra" ON public.obra_etapas_selecionadas FOR ALL
  USING (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.obras o WHERE o.id = obra_id AND o.user_id = auth.uid()));
CREATE TRIGGER trg_oes_updated BEFORE UPDATE ON public.obra_etapas_selecionadas FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.arquivos_obras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  obra_id UUID NOT NULL REFERENCES public.obras(id) ON DELETE CASCADE,
  nome_arquivo TEXT NOT NULL, nome_original TEXT NOT NULL,
  categoria TEXT NOT NULL, tipo_arquivo TEXT,
  tamanho_bytes BIGINT, url_storage TEXT NOT NULL,
  descricao TEXT, tags TEXT[], publico BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'ativo',
  data_upload TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.arquivos_obras TO authenticated;
GRANT ALL ON public.arquivos_obras TO service_role;
ALTER TABLE public.arquivos_obras ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own arquivos" ON public.arquivos_obras FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_arq_updated BEFORE UPDATE ON public.arquivos_obras FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.atendimentos_pos_venda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  protocolo TEXT UNIQUE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL, assunto TEXT NOT NULL, descricao TEXT,
  status TEXT NOT NULL DEFAULT 'aberto',
  prioridade TEXT NOT NULL DEFAULT 'media',
  responsavel TEXT, prazo_resposta DATE,
  data_abertura TIMESTAMPTZ NOT NULL DEFAULT now(),
  data_resposta TIMESTAMPTZ, data_resolucao TIMESTAMPTZ,
  observacoes TEXT, cliente_email TEXT, cliente_telefone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.atendimentos_pos_venda TO authenticated;
GRANT ALL ON public.atendimentos_pos_venda TO service_role;
ALTER TABLE public.atendimentos_pos_venda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own atendimentos" ON public.atendimentos_pos_venda FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_at_updated BEFORE UPDATE ON public.atendimentos_pos_venda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.generate_protocolo()
RETURNS TRIGGER AS $$
DECLARE novo_protocolo TEXT; contador INT;
BEGIN
  IF NEW.protocolo IS NULL OR NEW.protocolo = '' THEN
    SELECT COUNT(*) + 1 INTO contador
    FROM public.atendimentos_pos_venda
    WHERE DATE(atendimentos_pos_venda.created_at) = CURRENT_DATE;
    novo_protocolo := 'PV-' || TO_CHAR(CURRENT_DATE,'YYYYMMDD') || '-' || LPAD(contador::TEXT,4,'0');
    NEW.protocolo := novo_protocolo;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_protocolo BEFORE INSERT ON public.atendimentos_pos_venda
  FOR EACH ROW EXECUTE FUNCTION public.generate_protocolo();

CREATE TABLE public.agendamentos_pos_venda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atendimento_id UUID REFERENCES public.atendimentos_pos_venda(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  tipo TEXT NOT NULL,
  data_agendamento DATE NOT NULL, horario TIME NOT NULL,
  responsavel TEXT, status TEXT NOT NULL DEFAULT 'agendado',
  endereco TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.agendamentos_pos_venda TO authenticated;
GRANT ALL ON public.agendamentos_pos_venda TO service_role;
ALTER TABLE public.agendamentos_pos_venda ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own agendamentos" ON public.agendamentos_pos_venda FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_ag_updated BEFORE UPDATE ON public.agendamentos_pos_venda FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.garantias_imoveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  tipo_garantia TEXT NOT NULL, item TEXT NOT NULL,
  data_inicio DATE NOT NULL, data_fim DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'ativa',
  cobertura TEXT, valor_cobertura NUMERIC,
  termos_condicoes TEXT, observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.garantias_imoveis TO authenticated;
GRANT ALL ON public.garantias_imoveis TO service_role;
ALTER TABLE public.garantias_imoveis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own garantias" ON public.garantias_imoveis FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_gar_updated BEFORE UPDATE ON public.garantias_imoveis FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.pesquisas_satisfacao (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  atendimento_id UUID REFERENCES public.atendimentos_pos_venda(id) ON DELETE SET NULL,
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  imovel_id UUID REFERENCES public.imoveis(id) ON DELETE SET NULL,
  categoria TEXT NOT NULL,
  nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT, sugestoes TEXT,
  aspectos_avaliados JSONB,
  data_pesquisa TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.pesquisas_satisfacao TO authenticated;
GRANT ALL ON public.pesquisas_satisfacao TO service_role;
ALTER TABLE public.pesquisas_satisfacao ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own pesquisas" ON public.pesquisas_satisfacao FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_pes_updated BEFORE UPDATE ON public.pesquisas_satisfacao FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
