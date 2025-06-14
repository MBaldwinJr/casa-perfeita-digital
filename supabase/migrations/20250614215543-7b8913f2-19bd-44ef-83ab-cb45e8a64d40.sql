-- Create users profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create clientes table
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  cpf_cnpj TEXT,
  endereco TEXT,
  cidade TEXT,
  estado TEXT,
  cep TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create imoveis table
CREATE TABLE public.imoveis (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  tipo TEXT NOT NULL,
  endereco TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cep TEXT,
  area DECIMAL,
  quartos INTEGER,
  banheiros INTEGER,
  vagas INTEGER,
  valor DECIMAL NOT NULL,
  status TEXT DEFAULT 'disponivel',
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create propostas table
CREATE TABLE public.propostas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  valor_proposta DECIMAL NOT NULL,
  forma_pagamento TEXT NOT NULL,
  entrada DECIMAL,
  financiamento DECIMAL,
  data_vencimento DATE,
  data_assinatura DATE,
  status TEXT DEFAULT 'em_analise',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contratos table
CREATE TABLE public.contratos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  proposta_id UUID NOT NULL REFERENCES public.propostas(id) ON DELETE CASCADE,
  numero_contrato TEXT NOT NULL,
  data_assinatura DATE NOT NULL,
  data_vencimento DATE,
  valor_total DECIMAL NOT NULL,
  status TEXT DEFAULT 'ativo',
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financiamentos table
CREATE TABLE public.financiamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  imovel_id UUID NOT NULL REFERENCES public.imoveis(id) ON DELETE CASCADE,
  banco TEXT NOT NULL,
  valor_financiado DECIMAL NOT NULL,
  entrada DECIMAL,
  prazo_meses INTEGER,
  taxa_juros DECIMAL,
  valor_parcela DECIMAL,
  status TEXT DEFAULT 'analise',
  data_aprovacao DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.imoveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contratos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financiamentos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for clientes
CREATE POLICY "Users can view their own clientes" ON public.clientes
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own clientes" ON public.clientes
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own clientes" ON public.clientes
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own clientes" ON public.clientes
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for imoveis
CREATE POLICY "Users can view their own imoveis" ON public.imoveis
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own imoveis" ON public.imoveis
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own imoveis" ON public.imoveis
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own imoveis" ON public.imoveis
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for propostas
CREATE POLICY "Users can view their own propostas" ON public.propostas
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own propostas" ON public.propostas
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own propostas" ON public.propostas
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own propostas" ON public.propostas
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for contratos
CREATE POLICY "Users can view their own contratos" ON public.contratos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own contratos" ON public.contratos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own contratos" ON public.contratos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own contratos" ON public.contratos
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for financiamentos
CREATE POLICY "Users can view their own financiamentos" ON public.financiamentos
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own financiamentos" ON public.financiamentos
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own financiamentos" ON public.financiamentos
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own financiamentos" ON public.financiamentos
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_clientes_updated_at
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_imoveis_updated_at
  BEFORE UPDATE ON public.imoveis
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_propostas_updated_at
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contratos_updated_at
  BEFORE UPDATE ON public.contratos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_financiamentos_updated_at
  BEFORE UPDATE ON public.financiamentos
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nome, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome', NEW.raw_user_meta_data->>'full_name', 'Usuário'),
    NEW.email
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();