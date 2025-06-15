
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

export default function PosVenda() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("atendimentos");
  const [showNovoAtendimento, setShowNovoAtendimento] = useState(false);
  const [showAgendamento, setShowAgendamento] = useState(false);
  const [showGarantia, setShowGarantia] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const [novoAtendimentoForm, setNovoAtendimentoForm] = useState({
    cliente: '',
    imovel: '',
    tipo: '',
    assunto: '',
    descricao: '',
    prioridade: 'media'
  });

  const atendimentos = [
    {
      id: 1,
      protocolo: "AT-2024-001",
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      tipo: "Reparo",
      assunto: "Problema na torneira da cozinha",
      descricao: "Torneira apresenta vazamento constante, necessário reparo ou troca",
      status: "Aberto",
      statusColor: "bg-red-500",
      dataAbertura: "2024-01-15",
      prioridade: "Média",
      responsavel: "Equipe Técnica",
      prazoResposta: "24h",
      cliente_email: "joao@email.com",
      cliente_telefone: "(11) 99999-9999"
    },
    {
      id: 2,
      protocolo: "AT-2024-002",
      cliente: "Maria Santos",
      imovel: "Terreno - Centro",
      tipo: "Dúvida",
      assunto: "Documentação de transferência",
      descricao: "Dúvidas sobre o processo de transferência de titularidade",
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      dataAbertura: "2024-01-14",
      prioridade: "Baixa",
      responsavel: "Jurídico",
      prazoResposta: "48h",
      cliente_email: "maria@email.com",
      cliente_telefone: "(11) 88888-8888"
    },
    {
      id: 3,
      protocolo: "AT-2024-003",
      cliente: "Pedro Costa",
      imovel: "Casa - Vila Nova",
      tipo: "Garantia",
      assunto: "Infiltração na parede",
      descricao: "Infiltração detectada na parede do quarto principal",
      status: "Resolvido",
      statusColor: "bg-green-500",
      dataAbertura: "2024-01-10",
      prioridade: "Alta",
      responsavel: "Construção",
      prazoResposta: "12h",
      cliente_email: "pedro@email.com",
      cliente_telefone: "(11) 77777-7777"
    },
  ];

  const agendamentos = [
    {
      id: 1,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      tipo: "Vistoria Técnica",
      data: "2024-01-20",
      horario: "14:00",
      responsavel: "Eng. Carlos Santos",
      status: "Agendado",
      observacoes: "Verificar problema na torneira"
    },
    {
      id: 2,
      cliente: "Ana Oliveira",
      imovel: "Apartamento - Centro",
      tipo: "Entrega de Chaves",
      data: "2024-01-22",
      horario: "10:00",
      responsavel: "Corretor José",
      status: "Confirmado",
      observacoes: "Primeira entrega das chaves"
    }
  ];

  const garantias = [
    {
      id: 1,
      cliente: "Pedro Costa",
      imovel: "Casa - Vila Nova",
      item: "Estrutura",
      dataInicio: "2023-06-15",
      dataFim: "2028-06-15",
      prazoRestante: "4 anos, 5 meses",
      status: "Ativo",
      cobertura: "Estrutural e vedações"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      imovel: "Casa - Jardim Sul",
      item: "Instalações Elétricas",
      dataInicio: "2023-12-01",
      dataFim: "2025-12-01",
      prazoRestante: "11 meses",
      status: "Ativo",
      cobertura: "Sistema elétrico completo"
    },
    {
      id: 3,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      item: "Hidráulica",
      dataInicio: "2022-08-20",
      dataFim: "2024-08-20",
      prazoRestante: "7 meses",
      status: "Próximo ao Vencimento",
      cobertura: "Tubulações e conexões"
    }
  ];

  const pesquisasSatisfacao = [
    {
      id: 1,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      data: "2024-01-10",
      nota: 5,
      comentario: "Excelente atendimento, problema resolvido rapidamente",
      categoria: "Atendimento"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      imovel: "Terreno - Centro",
      data: "2024-01-08",
      nota: 4,
      comentario: "Bom suporte, mas poderia ser mais rápido",
      categoria: "Tempo de Resposta"
    }
  ];

  const estatisticas = {
    atendimentosAtivos: 23,
    atendimentosUrgentes: 5,
    satisfacaoMedia: 4.8,
    tempoMedioResposta: "2.5h",
    recibosPendentes: 8,
    valorPendente: "R$ 12.400,00",
    garantiasVencendo: 3,
    agendamentosHoje: 2
  };

  const handleNovoAtendimento = () => {
    if (!novoAtendimentoForm.cliente || !novoAtendimentoForm.assunto) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Atendimento criado!",
      description: `Protocolo AT-2024-${String(atendimentos.length + 1).padStart(3, '0')} gerado.`,
    });

    setNovoAtendimentoForm({
      cliente: '',
      imovel: '',
      tipo: '',
      assunto: '',
      descricao: '',
      prioridade: 'media'
    });
    setShowNovoAtendimento(false);
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
      <div className="flex justify-between items-center">
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
            <div className="text-2xl font-bold">{estatisticas.atendimentosAtivos}</div>
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
            <div className="text-2xl font-bold text-green-600">{estatisticas.satisfacaoMedia}</div>
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
            <div className="text-2xl font-bold text-orange-600">{estatisticas.garantiasVencendo}</div>
            <p className="text-xs text-muted-foreground">vencendo em 30 dias</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Conteúdo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
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
                {atendimentosFiltrados.map((atendimento) => (
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
                          <h4 className="font-semibold text-lg">{atendimento.cliente}</h4>
                          <p className="text-sm text-muted-foreground flex items-center">
                            <Home className="h-4 w-4 mr-1" />
                            {atendimento.imovel}
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
                          <span className="font-medium">Abertura:</span> {new Date(atendimento.dataAbertura).toLocaleDateString('pt-BR')}
                        </div>
                        <div>
                          <span className="font-medium">Responsável:</span> {atendimento.responsavel}
                        </div>
                        <div>
                          <span className="font-medium">Prazo:</span> {atendimento.prazoResposta}
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span className="flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {atendimento.cliente_email}
                          </span>
                          <span className="flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {atendimento.cliente_telefone}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Ligar
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </Button>
                          <Button size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Responder
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
                {agendamentos.map((agendamento) => (
                  <div key={agendamento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{agendamento.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{agendamento.imovel}</p>
                        <p className="font-medium text-primary">{agendamento.tipo}</p>
                      </div>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        {agendamento.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                      <div>
                        <span className="font-medium">Data:</span> {new Date(agendamento.data).toLocaleDateString('pt-BR')}
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
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="garantias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Gestão de Garantias
              </CardTitle>
              <CardDescription>Controle de prazos e coberturas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {garantias.map((garantia) => (
                  <div key={garantia.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{garantia.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{garantia.imovel}</p>
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
                        <span className="font-medium">Início:</span> {new Date(garantia.dataInicio).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Fim:</span> {new Date(garantia.dataFim).toLocaleDateString('pt-BR')}
                      </div>
                      <div>
                        <span className="font-medium">Restante:</span> {garantia.prazoRestante}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground bg-muted p-2 rounded">
                      <strong>Cobertura:</strong> {garantia.cobertura}
                    </p>
                    
                    {garantia.status === 'Próximo ao Vencimento' && (
                      <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                        <p className="text-sm text-orange-800 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Garantia vencendo em breve - considere renovação
                        </p>
                      </div>
                    )}
                  </div>
                ))}
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
                {pesquisasSatisfacao.map((pesquisa) => (
                  <div key={pesquisa.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{pesquisa.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{pesquisa.imovel}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(pesquisa.data).toLocaleDateString('pt-BR')} - {pesquisa.categoria}
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
                ))}
              </div>
              
              <Button className="w-full mt-4" variant="outline">
                <MessageSquare className="h-4 w-4 mr-2" />
                Enviar Nova Pesquisa de Satisfação
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
                    <span className="font-bold">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
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
                    <span className="font-bold">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
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
                    <span className="text-2xl font-bold">156</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Atendimentos Resolvidos</span>
                    <span className="text-2xl font-bold text-green-600">132</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Média de Satisfação</span>
                    <span className="text-2xl font-bold text-blue-600">4.8</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Visitas Técnicas</span>
                    <span className="text-2xl font-bold">34</span>
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
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={novoAtendimentoForm.cliente}
                  onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, cliente: e.target.value }))}
                  placeholder="Nome do cliente"
                />
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <Input
                  id="imovel"
                  value={novoAtendimentoForm.imovel}
                  onChange={(e) => setNovoAtendimentoForm(prev => ({ ...prev, imovel: e.target.value }))}
                  placeholder="Endereço do imóvel"
                />
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
    </div>
  );
}
