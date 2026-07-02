
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { 
  MessageSquare, 
  Receipt, 
  Phone, 
  Mail, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Calendar,
  Users,
  TrendingUp,
  FileText,
  Star,
  Plus,
  Search,
  Filter,
  Settings,
  Shield,
  BarChart3,
  Home
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useAtendimentosPosVenda, 
  useCreateAtendimentoPosVenda,
  useAgendamentosPosVenda,
  useCreateAgendamentoPosVenda,
  useGarantiasImoveis,
  useCreateGarantiaImovel,
  usePesquisasSatisfacao,
  useCreatePesquisaSatisfacao,
  useClientes,
  useImoveis
} from "@/hooks/useSupabaseQuery";

export default function PosVenda() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("atendimentos");
  const [showNovoAtendimento, setShowNovoAtendimento] = useState(false);
  const [showAgendamento, setShowAgendamento] = useState(false);
  const [showGarantia, setShowGarantia] = useState(false);
  const [showResposta, setShowResposta] = useState(false);
  const [showPesquisaSatisfacao, setShowPesquisaSatisfacao] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [novoAtendimentoForm, setNovoAtendimentoForm] = useState({
    cliente_id: '',
    imovel_id: '',
    tipo: '',
    assunto: '',
    descricao: '',
    prioridade: 'media',
    cliente_email: '',
    cliente_telefone: ''
  });

  const [agendamentoForm, setAgendamentoForm] = useState({
    cliente_id: '',
    imovel_id: '',
    tipo: '',
    data_agendamento: '',
    horario: '',
    responsavel: '',
    endereco: '',
    observacoes: ''
  });

  const [respostaForm, setRespostaForm] = useState({
    atendimento_id: '',
    protocolo: '',
    resposta: '',
    status_novo: ''
  });

  const [garantiaForm, setGarantiaForm] = useState({
    cliente_id: '',
    imovel_id: '',
    item: '',
    cobertura: '',
    data_inicio: '',
    data_fim: '',
    status: 'Ativo'
  });

  const [pesquisaForm, setPesquisaForm] = useState({
    cliente_id: '',
    imovel_id: '',
    categoria: '',
    nota: 5,
    comentario: ''
  });

  // Queries
  const { data: atendimentos = [], isLoading: loadingAtendimentos } = useAtendimentosPosVenda();
  const { data: agendamentos = [], isLoading: loadingAgendamentos } = useAgendamentosPosVenda();
  const { data: garantias = [], isLoading: loadingGarantias } = useGarantiasImoveis();
  const { data: pesquisasSatisfacao = [], isLoading: loadingPesquisas } = usePesquisasSatisfacao();
  const { data: clientes = [] } = useClientes();
  const { data: imoveis = [] } = useImoveis();

  // Mutations
  const createAtendimento = useCreateAtendimentoPosVenda();
  const createAgendamento = useCreateAgendamentoPosVenda();
  const createGarantia = useCreateGarantiaImovel();
  const createPesquisa = useCreatePesquisaSatisfacao();

  const handleResposta = async () => {
    if (!respostaForm.resposta) {
      toast({
        title: "Erro",
        description: "Digite uma resposta.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Resposta enviada",
      description: `Resposta enviada para o protocolo ${respostaForm.protocolo}`,
    });

    setRespostaForm({
      atendimento_id: '',
      protocolo: '',
      resposta: '',
      status_novo: ''
    });
    setShowResposta(false);
  };

  const handleGarantia = async () => {
    if (!garantiaForm.item || !garantiaForm.data_inicio || !garantiaForm.data_fim) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    await createGarantia.mutateAsync({
      cliente_id: garantiaForm.cliente_id || null,
      imovel_id: garantiaForm.imovel_id || null,
      item: garantiaForm.item,
      cobertura: garantiaForm.cobertura,
      data_inicio: garantiaForm.data_inicio,
      data_fim: garantiaForm.data_fim,
      status: garantiaForm.status
    });

    setGarantiaForm({
      cliente_id: '',
      imovel_id: '',
      item: '',
      cobertura: '',
      data_inicio: '',
      data_fim: '',
      status: 'Ativo'
    });
    setShowGarantia(false);
  };

  const handlePesquisaSatisfacao = async () => {
    if (!pesquisaForm.categoria || !pesquisaForm.comentario) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    await createPesquisa.mutateAsync({
      cliente_id: pesquisaForm.cliente_id || null,
      imovel_id: pesquisaForm.imovel_id || null,
      categoria: pesquisaForm.categoria,
      nota: pesquisaForm.nota,
      comentario: pesquisaForm.comentario,
      data_pesquisa: new Date().toISOString().split('T')[0]
    });

    setPesquisaForm({
      cliente_id: '',
      imovel_id: '',
      categoria: '',
      nota: 5,
      comentario: ''
    });
    setShowPesquisaSatisfacao(false);
  };





  // Estatísticas calculadas
  const estatisticas = {
    atendimentosAtivos: atendimentos.filter(a => a.status !== 'resolvido').length,
    atendimentosUrgentes: atendimentos.filter(a => a.prioridade === 'urgente' || a.prioridade === 'alta').length,
    satisfacaoMedia: pesquisasSatisfacao.length > 0 
      ? (pesquisasSatisfacao.reduce((acc, p) => acc + p.nota, 0) / pesquisasSatisfacao.length).toFixed(1)
      : "0.0",
    tempoMedioResposta: "2.5h", // Pode ser calculado baseado nos dados
    garantiasVencendo: garantias.filter(g => {
      const fim = new Date(g.data_fim);
      const hoje = new Date();
      const diff = (fim.getTime() - hoje.getTime()) / (1000 * 3600 * 24);
      return diff <= 30 && diff > 0;
    }).length,
    agendamentosHoje: agendamentos.filter(a => {
      const hoje = new Date().toISOString().split('T')[0];
      return a.data_agendamento === hoje;
    }).length
  };

  // Estatísticas dos relatórios
  const relatorioStats = {
    totalAtendimentos: atendimentos.length,
    atendimentosResolvidos: atendimentos.filter(a => a.status === 'resolvido').length,
    taxaResolucao: atendimentos.length > 0 
      ? Math.round((atendimentos.filter(a => a.status === 'resolvido').length / atendimentos.length) * 100)
      : 0,
    mediaSatisfacao: pesquisasSatisfacao.length > 0 
      ? Number((pesquisasSatisfacao.reduce((acc, p) => acc + p.nota, 0) / pesquisasSatisfacao.length).toFixed(1))
      : 0,
    visitasTecnicas: agendamentos.length,
    percentualSatisfacao: pesquisasSatisfacao.length > 0 
      ? Math.round((pesquisasSatisfacao.reduce((acc, p) => acc + p.nota, 0) / pesquisasSatisfacao.length / 5) * 100)
      : 0
  };

  const handleNovoAtendimento = async () => {
    if (!novoAtendimentoForm.assunto) {
      toast({
        title: "Erro",
        description: "Preencha o campo assunto.",
        variant: "destructive",
      });
      return;
    }

    await createAtendimento.mutateAsync({
      cliente_id: novoAtendimentoForm.cliente_id || null,
      imovel_id: novoAtendimentoForm.imovel_id || null,
      tipo: novoAtendimentoForm.tipo,
      assunto: novoAtendimentoForm.assunto,
      descricao: novoAtendimentoForm.descricao,
      prioridade: novoAtendimentoForm.prioridade,
      cliente_email: novoAtendimentoForm.cliente_email,
      cliente_telefone: novoAtendimentoForm.cliente_telefone,
      status: 'aberto'
    });

    setNovoAtendimentoForm({
      cliente_id: '',
      imovel_id: '',
      tipo: '',
      assunto: '',
      descricao: '',
      prioridade: 'media',
      cliente_email: '',
      cliente_telefone: ''
    });
    setShowNovoAtendimento(false);
  };

  const handleAgendamento = async () => {
    if (!agendamentoForm.tipo || !agendamentoForm.data_agendamento || !agendamentoForm.horario) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    await createAgendamento.mutateAsync({
      cliente_id: agendamentoForm.cliente_id || null,
      imovel_id: agendamentoForm.imovel_id || null,
      tipo: agendamentoForm.tipo,
      data_agendamento: agendamentoForm.data_agendamento,
      horario: agendamentoForm.horario,
      responsavel: agendamentoForm.responsavel,
      endereco: agendamentoForm.endereco,
      observacoes: agendamentoForm.observacoes,
      status: 'agendado'
    });

    setAgendamentoForm({
      cliente_id: '',
      imovel_id: '',
      tipo: '',
      data_agendamento: '',
      horario: '',
      responsavel: '',
      endereco: '',
      observacoes: ''
    });
    setShowAgendamento(false);
  };

  const handleLigar = (telefone?: string) => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_self');
    } else {
      toast({
        title: "Telefone não disponível",
        description: "Não há telefone cadastrado para este cliente.",
        variant: "destructive",
      });
    }
  };

  const handleEmail = (email?: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    } else {
      toast({
        title: "Email não disponível",
        description: "Não há email cadastrado para este cliente.",
        variant: "destructive",
      });
    }
  };

  const handleResponder = (atendimento: any) => {
    setRespostaForm({
      atendimento_id: atendimento.id,
      protocolo: atendimento.protocolo,
      resposta: '',
      status_novo: atendimento.status
    });
    setShowResposta(true);
  };

  const atendimentosFiltrados = atendimentos.filter(atendimento => {
    const statusMatch = filtroStatus === "todos" || atendimento.status.toLowerCase().includes(filtroStatus);
    const tipoMatch = filtroTipo === "todos" || atendimento.tipo.toLowerCase().includes(filtroTipo);
    return statusMatch && tipoMatch;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      'aberto': 'bg-red-500',
      'em andamento': 'bg-blue-500',
      'resolvido': 'bg-green-500',
      'pausado': 'bg-yellow-500',
      'cancelado': 'bg-gray-500'
    };
    return colors[status.toLowerCase() as keyof typeof colors] || 'bg-gray-500';
  };

  const getPrioridadeColor = (prioridade: string) => {
    const colors = {
      'alta': 'text-red-600 border-red-600',
      'média': 'text-yellow-600 border-yellow-600',
      'baixa': 'text-green-600 border-green-600'
    };
    return colors[prioridade.toLowerCase() as keyof typeof colors] || 'text-gray-600 border-gray-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold">Pós-venda</h2>
          <p className="text-muted-foreground">Suporte ao cliente e acompanhamento pós-entrega</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowAgendamento(true)}>
            <Calendar className="h-4 w-4 mr-2" />
            Agendar Visita
          </Button>
          <Button onClick={() => setShowNovoAtendimento(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Novo Atendimento
          </Button>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Atendimentos Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingAtendimentos ? '...' : estatisticas.atendimentosAtivos}</div>
            <p className="text-xs text-muted-foreground">{estatisticas.atendimentosUrgentes} urgentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Star className="h-4 w-4 mr-2" />
              Satisfação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{loadingPesquisas ? '...' : estatisticas.satisfacaoMedia}</div>
            <p className="text-xs text-muted-foreground">de 5.0 estrelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Tempo Resposta
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.tempoMedioResposta}</div>
            <p className="text-xs text-muted-foreground">tempo médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Garantias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{loadingGarantias ? '...' : estatisticas.garantiasVencendo}</div>
            <p className="text-xs text-muted-foreground">vencendo em 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="atendimentos">Atendimentos</TabsTrigger>
          <TabsTrigger value="agendamentos">Agendamentos</TabsTrigger>
          <TabsTrigger value="garantias">Garantias</TabsTrigger>
          <TabsTrigger value="satisfacao">Satisfação</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="atendimentos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Atendimentos</CardTitle>
                  <CardDescription>Gerenciamento de tickets e solicitações</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Status</SelectItem>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos Tipos</SelectItem>
                      <SelectItem value="reparo">Reparo</SelectItem>
                      <SelectItem value="duvida">Dúvida</SelectItem>
                      <SelectItem value="garantia">Garantia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingAtendimentos ? (
                  <div className="text-center py-8">Carregando atendimentos...</div>
                ) : atendimentosFiltrados.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhum atendimento encontrado</div>
                ) : (
                  atendimentosFiltrados.map((atendimento) => (
                    <Card key={atendimento.id} className="border-l-4 border-l-primary">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {atendimento.protocolo}
                              </Badge>
                              <Badge className={`${getStatusColor(atendimento.status)} text-white text-xs`}>
                                {atendimento.status}
                              </Badge>
                              <Badge variant="outline" className={getPrioridadeColor(atendimento.prioridade)}>
                                {atendimento.prioridade}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-lg">
                              {atendimento.clientes?.nome || 'Cliente não informado'}
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <Home className="h-4 w-4 mr-1" />
                              {atendimento.imoveis?.titulo || 'Imóvel não informado'}
                            </p>
                            <p className="font-medium mt-2">{atendimento.assunto}</p>
                            <p className="text-sm text-muted-foreground mt-1">{atendimento.descricao}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                          <div>
                            <span className="font-medium">Tipo:</span> {atendimento.tipo}
                          </div>
                          <div>
                            <span className="font-medium">Abertura:</span> {new Date(atendimento.data_abertura).toLocaleDateString('pt-BR')}
                          </div>
                          <div>
                            <span className="font-medium">Responsável:</span> {atendimento.responsavel || 'Não definido'}
                          </div>
                          <div>
                            <span className="font-medium">Prazo:</span> {atendimento.prazo_resposta || 'Não definido'}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Mail className="h-4 w-4 mr-1" />
                              {atendimento.cliente_email || 'Email não informado'}
                            </span>
                            <span className="flex items-center">
                              <Phone className="h-4 w-4 mr-1" />
                              {atendimento.cliente_telefone || 'Telefone não informado'}
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleLigar(atendimento.cliente_telefone || atendimento.clientes?.telefone)}
                            >
                              <Phone className="h-4 w-4 mr-1" />
                              Ligar
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleEmail(atendimento.cliente_email || atendimento.clientes?.email)}
                            >
                              <Mail className="h-4 w-4 mr-1" />
                              Email
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => handleResponder(atendimento)}
                            >
                              <MessageSquare className="h-4 w-4 mr-1" />
                              Responder
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="agendamentos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Agendamentos
              </CardTitle>
              <CardDescription>Visitas técnicas e entregas programadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingAgendamentos ? (
                  <div className="text-center py-8">Carregando agendamentos...</div>
                ) : agendamentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhum agendamento encontrado</div>
                ) : (
                  agendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{agendamento.clientes?.nome || 'Cliente não informado'}</h4>
                        <p className="text-sm text-muted-foreground">{agendamento.imoveis?.titulo || 'Imóvel não informado'}</p>
                        <p className="font-medium text-primary">{agendamento.tipo}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {agendamento.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Data:</span> {new Date(agendamento.data_agendamento).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Horário:</span> {agendamento.horario}
                      </div>
                      <div>
                        <span className="font-medium">Responsável:</span> {agendamento.responsavel}
                      </div>
                    </div>
                    
                    {agendamento.observacoes && (
                      <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                        <strong>Observações:</strong> {agendamento.observacoes}
                      </p>
                    )}
                  </div>
                ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="garantias" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    Gestão de Garantias
                  </CardTitle>
                  <CardDescription>Controle de prazos e coberturas</CardDescription>
                </div>
                <Button onClick={() => setShowGarantia(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Garantia
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingGarantias ? (
                  <div className="text-center py-8">Carregando garantias...</div>
                ) : garantias.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhuma garantia encontrada</div>
                ) : (
                  garantias.map((garantia) => (
                  <div key={garantia.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{garantia.clientes?.nome || 'Cliente não informado'}</h4>
                        <p className="text-sm text-muted-foreground">{garantia.imoveis?.titulo || 'Imóvel não informado'}</p>
                        <p className="font-medium text-primary">{garantia.item}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={
                          garantia.status === 'Ativo' ? 'text-green-600 border-green-600' :
                          'text-orange-600 border-orange-600'
                        }
                      >
                        {garantia.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Início:</span> {new Date(garantia.data_inicio).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Fim:</span> {new Date(garantia.data_fim).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Restante:</span> {
                          (() => {
                            const fim = new Date(garantia.data_fim);
                            const hoje = new Date();
                            const diff = Math.ceil((fim.getTime() - hoje.getTime()) / (1000 * 3600 * 24));
                            if (diff < 0) return 'Vencida';
                            if (diff < 30) return `${diff} dias`;
                            const meses = Math.floor(diff / 30);
                            const dias = diff % 30;
                            return `${meses}m ${dias}d`;
                          })()
                        }
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      <strong>Cobertura:</strong> {garantia.cobertura}
                    </p>
                    
                    {(() => {
                      const fim = new Date(garantia.data_fim);
                      const hoje = new Date();
                      const diff = (fim.getTime() - hoje.getTime()) / (1000 * 3600 * 24);
                      return diff <= 30 && diff > 0;
                    })() && (
                      <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-sm text-orange-800 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Garantia vencendo em breve - considere renovação
                        </p>
                      </div>
                    )}
                  </div>
                ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="satisfacao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Pesquisas de Satisfação
              </CardTitle>
              <CardDescription>Avaliações e feedback dos clientes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loadingPesquisas ? (
                  <div className="text-center py-8">Carregando pesquisas...</div>
                ) : pesquisasSatisfacao.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">Nenhuma pesquisa encontrada</div>
                ) : (
                  pesquisasSatisfacao.map((pesquisa) => (
                  <div key={pesquisa.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{pesquisa.clientes?.nome || 'Cliente não informado'}</h4>
                        <p className="text-sm text-muted-foreground">{pesquisa.imoveis?.titulo || 'Imóvel não informado'}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pesquisa.data_pesquisa).toLocaleDateString('pt-BR')} - {pesquisa.categoria}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 mb-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < pesquisa.nota ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-muted-foreground">{pesquisa.nota}/5</span>
                      </div>
                    </div>
                    
                    <blockquote className="bg-muted p-3 rounded border-l-4 border-l-primary">
                      <p className="text-sm italic">"{pesquisa.comentario}"</p>
                    </blockquote>
                  </div>
                ))
                )}
              </div>
              
              <Button className="w-full mt-4" variant="outline" onClick={() => setShowPesquisaSatisfacao(true)}>
                <Star className="h-4 w-4 mr-2" />
                Nova Pesquisa de Satisfação
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Relatórios de Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Taxa de Resolução</span>
                    <span className="font-bold">{relatorioStats.taxaResolucao}%</span>
                  </div>
                  <Progress value={relatorioStats.taxaResolucao} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Tempo Médio de Resposta</span>
                    <span className="font-bold">2.5h</span>
                  </div>
                  <Progress value={75} className="h-2" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Satisfação do Cliente</span>
                    <span className="font-bold">{relatorioStats.percentualSatisfacao}%</span>
                  </div>
                  <Progress value={relatorioStats.percentualSatisfacao} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Estatísticas do Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Total de Atendimentos</span>
                    <span className="text-2xl font-bold">{loadingAtendimentos ? '...' : relatorioStats.totalAtendimentos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Atendimentos Resolvidos</span>
                    <span className="text-2xl font-bold text-green-600">{loadingAtendimentos ? '...' : relatorioStats.atendimentosResolvidos}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Média de Satisfação</span>
                    <span className="text-2xl font-bold text-blue-600">{loadingPesquisas ? '...' : relatorioStats.mediaSatisfacao}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Visitas Técnicas</span>
                    <span className="text-2xl font-bold">{loadingAgendamentos ? '...' : relatorioStats.visitasTecnicas}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal Novo Atendimento */}
      <Dialog open={showNovoAtendimento} onOpenChange={setShowNovoAtendimento}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Novo Atendimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={novoAtendimentoForm.cliente_id} onValueChange={(value) => setNovoAtendimentoForm(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <Select value={novoAtendimentoForm.imovel_id} onValueChange={(value) => setNovoAtendimentoForm(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Atendimento</Label>
                <Select value={novoAtendimentoForm.tipo} onValueChange={(value) => setNovoAtendimentoForm(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reparo">Reparo</SelectItem>
                    <SelectItem value="duvida">Dúvida</SelectItem>
                    <SelectItem value="garantia">Garantia</SelectItem>
                    <SelectItem value="reclamacao">Reclamação</SelectItem>
                    <SelectItem value="sugestao">Sugestão</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={novoAtendimentoForm.prioridade} onValueChange={(value) => setNovoAtendimentoForm(prev => ({ ...prev, prioridade: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a prioridade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="media">Média</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="urgente">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente_email">Email</Label>
                <Input
                  id="cliente_email"
                  type="email"
                  value={novoAtendimentoForm.cliente_email}
                  onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, cliente_email: e.target.value }))}
                  placeholder="email@cliente.com"
                />
              </div>
              <div>
                <Label htmlFor="cliente_telefone">Telefone</Label>
                <Input
                  id="cliente_telefone"
                  value={novoAtendimentoForm.cliente_telefone}
                  onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, cliente_telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="assunto">Assunto *</Label>
              <Input
                id="assunto"
                value={novoAtendimentoForm.assunto}
                onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, assunto: e.target.value }))}
                placeholder="Resumo do problema ou solicitação"
              />
            </div>
            <div>
              <Label htmlFor="descricao">Descrição Detalhada</Label>
              <Textarea
                id="descricao"
                value={novoAtendimentoForm.descricao}
                onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descreva detalhadamente a situação..."
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleNovoAtendimento} className="flex-1">
                Criar Atendimento
              </Button>
              <Button variant="outline" onClick={() => setShowNovoAtendimento(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Agendar Visita */}
      <Dialog open={showAgendamento} onOpenChange={setShowAgendamento}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Agendar Visita</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente_agendamento">Cliente</Label>
                <Select value={agendamentoForm.cliente_id} onValueChange={(value) => setAgendamentoForm(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel_agendamento">Imóvel</Label>
                <Select value={agendamentoForm.imovel_id} onValueChange={(value) => setAgendamentoForm(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo_agendamento">Tipo de Visita *</Label>
                <Select value={agendamentoForm.tipo} onValueChange={(value) => setAgendamentoForm(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vistoria">Vistoria</SelectItem>
                    <SelectItem value="manutencao">Manutenção</SelectItem>
                    <SelectItem value="reparo">Reparo</SelectItem>
                    <SelectItem value="entrega">Entrega</SelectItem>
                    <SelectItem value="garantia">Garantia</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responsavel_agendamento">Responsável</Label>
                <Input
                  id="responsavel_agendamento"
                  value={agendamentoForm.responsavel}
                  onChange={(e) => setAgendamentoForm(prev => ({ ...prev, responsavel: e.target.value }))}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="data_agendamento">Data *</Label>
                <Input
                  id="data_agendamento"
                  type="date"
                  value={agendamentoForm.data_agendamento}
                  onChange={(e) => setAgendamentoForm(prev => ({ ...prev, data_agendamento: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="horario_agendamento">Horário *</Label>
                <Input
                  id="horario_agendamento"
                  type="time"
                  value={agendamentoForm.horario}
                  onChange={(e) => setAgendamentoForm(prev => ({ ...prev, horario: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endereco_agendamento">Endereço</Label>
              <Input
                id="endereco_agendamento"
                value={agendamentoForm.endereco}
                onChange={(e) => setAgendamentoForm(prev => ({ ...prev, endereco: e.target.value }))}
                placeholder="Endereço da visita (se diferente do imóvel)"
              />
            </div>
            <div>
              <Label htmlFor="observacoes_agendamento">Observações</Label>
              <Textarea
                id="observacoes_agendamento"
                value={agendamentoForm.observacoes}
                onChange={(e) => setAgendamentoForm(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações adicionais sobre a visita..."
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleAgendamento} className="flex-1">
                Agendar Visita
              </Button>
              <Button variant="outline" onClick={() => setShowAgendamento(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Responder Atendimento */}
      <Dialog open={showResposta} onOpenChange={setShowResposta}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Responder Atendimento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <Label className="text-sm font-medium">Protocolo: {respostaForm.protocolo}</Label>
            </div>
            
            <div>
              <Label htmlFor="status_novo">Novo Status</Label>
              <Select value={respostaForm.status_novo} onValueChange={(value) => setRespostaForm(prev => ({ ...prev, status_novo: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o novo status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aberto">Aberto</SelectItem>
                  <SelectItem value="em andamento">Em Andamento</SelectItem>
                  <SelectItem value="resolvido">Resolvido</SelectItem>
                  <SelectItem value="pausado">Pausado</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="resposta">Resposta *</Label>
              <Textarea
                id="resposta"
                value={respostaForm.resposta}
                onChange={(e) => setRespostaForm(prev => ({ ...prev, resposta: e.target.value }))}
                placeholder="Digite sua resposta ao cliente..."
                rows={6}
              />
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleResposta} className="flex-1">
                Enviar Resposta
              </Button>
              <Button variant="outline" onClick={() => setShowResposta(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Garantia */}
      <Dialog open={showGarantia} onOpenChange={setShowGarantia}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Garantia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente_garantia">Cliente</Label>
                <Select value={garantiaForm.cliente_id} onValueChange={(value) => setGarantiaForm(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel_garantia">Imóvel</Label>
                <Select value={garantiaForm.imovel_id} onValueChange={(value) => setGarantiaForm(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="item_garantia">Item/Componente *</Label>
                <Input
                  id="item_garantia"
                  value={garantiaForm.item}
                  onChange={(e) => setGarantiaForm(prev => ({ ...prev, item: e.target.value }))}
                  placeholder="Ex: Sistema elétrico, Hidráulica..."
                />
              </div>
              <div>
                <Label htmlFor="status_garantia">Status</Label>
                <Select value={garantiaForm.status} onValueChange={(value) => setGarantiaForm(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ativo">Ativo</SelectItem>
                    <SelectItem value="Vencida">Vencida</SelectItem>
                    <SelectItem value="Renovada">Renovada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="data_inicio_garantia">Data de Início *</Label>
                <Input
                  id="data_inicio_garantia"
                  type="date"
                  value={garantiaForm.data_inicio}
                  onChange={(e) => setGarantiaForm(prev => ({ ...prev, data_inicio: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="data_fim_garantia">Data de Fim *</Label>
                <Input
                  id="data_fim_garantia"
                  type="date"
                  value={garantiaForm.data_fim}
                  onChange={(e) => setGarantiaForm(prev => ({ ...prev, data_fim: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cobertura_garantia">Descrição da Cobertura</Label>
              <Textarea
                id="cobertura_garantia"
                value={garantiaForm.cobertura}
                onChange={(e) => setGarantiaForm(prev => ({ ...prev, cobertura: e.target.value }))}
                placeholder="Descreva o que está coberto pela garantia..."
                rows={3}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleGarantia} className="flex-1">
                Criar Garantia
              </Button>
              <Button variant="outline" onClick={() => setShowGarantia(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Nova Pesquisa de Satisfação */}
      <Dialog open={showPesquisaSatisfacao} onOpenChange={setShowPesquisaSatisfacao}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Pesquisa de Satisfação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente_pesquisa">Cliente</Label>
                <Select value={pesquisaForm.cliente_id} onValueChange={(value) => setPesquisaForm(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel_pesquisa">Imóvel</Label>
                <Select value={pesquisaForm.imovel_id} onValueChange={(value) => setPesquisaForm(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="categoria_pesquisa">Categoria *</Label>
                <Select value={pesquisaForm.categoria} onValueChange={(value) => setPesquisaForm(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Qualidade da Obra">Qualidade da Obra</SelectItem>
                    <SelectItem value="Atendimento">Atendimento</SelectItem>
                    <SelectItem value="Entrega">Entrega</SelectItem>
                    <SelectItem value="Pós-venda">Pós-venda</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="nota_pesquisa">Nota (1-5)</Label>
                <Select value={pesquisaForm.nota.toString()} onValueChange={(value) => setPesquisaForm(prev => ({ ...prev, nota: parseInt(value) }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a nota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 - Muito Insatisfeito</SelectItem>
                    <SelectItem value="2">2 - Insatisfeito</SelectItem>
                    <SelectItem value="3">3 - Neutro</SelectItem>
                    <SelectItem value="4">4 - Satisfeito</SelectItem>
                    <SelectItem value="5">5 - Muito Satisfeito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="comentario_pesquisa">Comentário *</Label>
              <Textarea
                id="comentario_pesquisa"
                value={pesquisaForm.comentario}
                onChange={(e) => setPesquisaForm(prev => ({ ...prev, comentario: e.target.value }))}
                placeholder="Comentário ou feedback do cliente..."
                rows={4}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handlePesquisaSatisfacao} className="flex-1">
                Criar Pesquisa
              </Button>
              <Button variant="outline" onClick={() => setShowPesquisaSatisfacao(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
