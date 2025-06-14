import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { 
  Scale, 
  Plus, 
  Eye, 
  Edit, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  User,
  Building,
  MapPin,
  DollarSign,
  Gavel
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProcessoJuridico {
  id: string;
  numero: string;
  tipo: 'compra_venda' | 'locacao' | 'escritura' | 'inventario' | 'usucapiao' | 'regularizacao';
  titulo: string;
  cliente: string;
  imovel: string;
  endereco: string;
  valor: number;
  status: 'iniciado' | 'documentacao' | 'analise' | 'cartorio' | 'finalizado' | 'suspenso';
  progresso: number;
  responsavel: string;
  dataInicio: string;
  previsaoFim: string;
  etapaAtual: string;
  observacoes: string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  documentosRequeridos: string[];
  documentosRecebidos: string[];
  historico: ProcessoHistorico[];
}

interface ProcessoHistorico {
  id: string;
  data: string;
  acao: string;
  responsavel: string;
  observacao: string;
  tipo: 'inicio' | 'documento' | 'analise' | 'aprovacao' | 'observacao' | 'finalizacao';
}

interface Etapa {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  concluida: boolean;
  dataInicio?: string;
  dataConclusao?: string;
  responsavel: string;
  documentosNecessarios: string[];
}

export default function ProcessManager() {
  const { toast } = useToast();
  const [selectedProcess, setSelectedProcess] = useState<ProcessoJuridico | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showTimelineDialog, setShowTimelineDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('ativos');

  const processos: ProcessoJuridico[] = [
    {
      id: '1',
      numero: 'PROC-2024-001',
      tipo: 'compra_venda',
      titulo: 'Compra e Venda - Casa Jardim América',
      cliente: 'João Silva',
      imovel: 'Casa - Jardim América',
      endereco: 'Rua das Flores, 123',
      valor: 450000,
      status: 'documentacao',
      progresso: 65,
      responsavel: 'Dr. Carlos Santos',
      dataInicio: '10/01/2024',
      previsaoFim: '15/03/2024',
      etapaAtual: 'Análise de Documentos',
      observacoes: 'Aguardando certidão negativa de débitos',
      prioridade: 'alta',
      documentosRequeridos: ['Certidão de Ônus', 'IPTU', 'Certidão Negativa', 'RG/CPF'],
      documentosRecebidos: ['Certidão de Ônus', 'IPTU'],
      historico: [
        {
          id: '1',
          data: '10/01/2024',
          acao: 'Processo iniciado',
          responsavel: 'Dr. Carlos Santos',
          observacao: 'Processo de compra e venda iniciado',
          tipo: 'inicio'
        },
        {
          id: '2',
          data: '15/01/2024',
          acao: 'Documentos recebidos',
          responsavel: 'Secretária Ana',
          observacao: 'Recebidos: Certidão de Ônus e IPTU',
          tipo: 'documento'
        }
      ]
    },
    {
      id: '2',
      numero: 'PROC-2024-002',
      tipo: 'escritura',
      titulo: 'Escritura Pública - Terreno Centro',
      cliente: 'Maria Santos',
      imovel: 'Terreno - Centro',
      endereco: 'Av. Principal, 456',
      valor: 280000,
      status: 'cartorio',
      progresso: 85,
      responsavel: 'Dra. Ana Costa',
      dataInicio: '05/01/2024',
      previsaoFim: '28/02/2024',
      etapaAtual: 'Registro em Cartório',
      observacoes: 'Escritura em fase final de registro',
      prioridade: 'media',
      documentosRequeridos: ['Matrícula', 'Certidões', 'Comprovante Pagamento'],
      documentosRecebidos: ['Matrícula', 'Certidões', 'Comprovante Pagamento'],
      historico: []
    },
    {
      id: '3',
      numero: 'PROC-2024-003',
      tipo: 'regularizacao',
      titulo: 'Regularização - Lote Vila Nova',
      cliente: 'Pedro Costa',
      imovel: 'Lote - Vila Nova',
      endereco: 'Rua B, s/n',
      valor: 120000,
      status: 'suspenso',
      progresso: 40,
      responsavel: 'Dr. Roberto Lima',
      dataInicio: '20/12/2023',
      previsaoFim: '30/04/2024',
      etapaAtual: 'Documentação Pendente',
      observacoes: 'Aguardando documentos da prefeitura',
      prioridade: 'baixa',
      documentosRequeridos: ['Habite-se', 'Aprovação Prefeitura', 'Levantamento Topográfico'],
      documentosRecebidos: ['Levantamento Topográfico'],
      historico: []
    }
  ];

  const etapasCompraVenda: Etapa[] = [
    {
      id: '1',
      nome: 'Análise Inicial',
      descricao: 'Análise dos documentos básicos e viabilidade',
      ordem: 1,
      concluida: true,
      dataInicio: '10/01/2024',
      dataConclusao: '12/01/2024',
      responsavel: 'Dr. Carlos Santos',
      documentosNecessarios: ['RG/CPF', 'Comprovante Renda']
    },
    {
      id: '2',
      nome: 'Documentação Completa',
      descricao: 'Reunião de todos os documentos necessários',
      ordem: 2,
      concluida: true,
      dataInicio: '12/01/2024',
      dataConclusao: '20/01/2024',
      responsavel: 'Secretária Ana',
      documentosNecessarios: ['Certidão de Ônus', 'IPTU', 'Certidão Negativa']
    },
    {
      id: '3',
      nome: 'Análise Jurídica',
      descricao: 'Análise detalhada da documentação',
      ordem: 3,
      concluida: false,
      dataInicio: '20/01/2024',
      responsavel: 'Dr. Carlos Santos',
      documentosNecessarios: ['Todos os documentos anteriores']
    },
    {
      id: '4',
      nome: 'Minuta do Contrato',
      descricao: 'Elaboração da minuta do contrato',
      ordem: 4,
      concluida: false,
      responsavel: 'Dr. Carlos Santos',
      documentosNecessarios: []
    },
    {
      id: '5',
      nome: 'Assinatura',
      descricao: 'Assinatura do contrato pelas partes',
      ordem: 5,
      concluida: false,
      responsavel: 'Dr. Carlos Santos',
      documentosNecessarios: ['Contrato finalizado']
    },
    {
      id: '6',
      nome: 'Registro',
      descricao: 'Registro em cartório',
      ordem: 6,
      concluida: false,
      responsavel: 'Cartório',
      documentosNecessarios: ['Contrato assinado', 'Documentos registrais']
    }
  ];

  const getStatusColor = (status: ProcessoJuridico['status']) => {
    switch (status) {
      case 'iniciado': return 'bg-blue-500';
      case 'documentacao': return 'bg-yellow-500';
      case 'analise': return 'bg-purple-500';
      case 'cartorio': return 'bg-orange-500';
      case 'finalizado': return 'bg-green-500';
      case 'suspenso': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: ProcessoJuridico['status']) => {
    switch (status) {
      case 'iniciado': return 'Iniciado';
      case 'documentacao': return 'Documentação';
      case 'analise': return 'Em Análise';
      case 'cartorio': return 'Em Cartório';
      case 'finalizado': return 'Finalizado';
      case 'suspenso': return 'Suspenso';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: ProcessoJuridico['prioridade']) => {
    switch (prioridade) {
      case 'baixa': return 'bg-gray-500';
      case 'media': return 'bg-blue-500';
      case 'alta': return 'bg-yellow-500';
      case 'urgente': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoLabel = (tipo: ProcessoJuridico['tipo']) => {
    switch (tipo) {
      case 'compra_venda': return 'Compra e Venda';
      case 'locacao': return 'Locação';
      case 'escritura': return 'Escritura';
      case 'inventario': return 'Inventário';
      case 'usucapiao': return 'Usucapião';
      case 'regularizacao': return 'Regularização';
      default: return tipo;
    }
  };

  const processosAtivos = processos.filter(p => p.status !== 'finalizado');
  const processosFinalizados = processos.filter(p => p.status === 'finalizado');
  const processosSuspensos = processos.filter(p => p.status === 'suspenso');

  const estatisticas = {
    total: processos.length,
    ativos: processosAtivos.length,
    finalizados: processosFinalizados.length,
    suspensos: processosSuspensos.length,
    prazoVencido: processos.filter(p => {
      const hoje = new Date();
      const previsao = new Date(p.previsaoFim.split('/').reverse().join('-'));
      return previsao < hoje && p.status !== 'finalizado';
    }).length
  };

  const handleCreateProcess = () => {
    toast({
      title: "Processo Criado",
      description: "Novo processo jurídico foi criado com sucesso.",
    });
    setShowCreateDialog(false);
  };

  const handleUpdateStatus = (processo: ProcessoJuridico, novoStatus: ProcessoJuridico['status']) => {
    toast({
      title: "Status Atualizado",
      description: `Processo ${processo.numero} atualizado para ${getStatusLabel(novoStatus)}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestão de Processos</h3>
          <p className="text-muted-foreground">Acompanhamento completo de processos jurídicos</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-muted-foreground">processos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.ativos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.finalizados}</div>
            <p className="text-xs text-muted-foreground">concluídos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Suspensos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.suspensos}</div>
            <p className="text-xs text-muted-foreground">pausados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Atrasados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{estatisticas.prazoVencido}</div>
            <p className="text-xs text-muted-foreground">vencidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Processos */}
      <Card>
        <CardHeader>
          <CardTitle>Processos Jurídicos</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ativos">Ativos ({estatisticas.ativos})</TabsTrigger>
              <TabsTrigger value="finalizados">Finalizados ({estatisticas.finalizados})</TabsTrigger>
              <TabsTrigger value="suspensos">Suspensos ({estatisticas.suspensos})</TabsTrigger>
            </TabsList>

            <TabsContent value="ativos" className="space-y-4">
              {processosAtivos.map((processo) => (
                <ProcessCard 
                  key={processo.id} 
                  processo={processo} 
                  onViewDetails={setSelectedProcess}
                  onViewTimeline={setShowTimelineDialog}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </TabsContent>

            <TabsContent value="finalizados" className="space-y-4">
              {processosFinalizados.map((processo) => (
                <ProcessCard 
                  key={processo.id} 
                  processo={processo} 
                  onViewDetails={setSelectedProcess}
                  onViewTimeline={setShowTimelineDialog}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </TabsContent>

            <TabsContent value="suspensos" className="space-y-4">
              {processosSuspensos.map((processo) => (
                <ProcessCard 
                  key={processo.id} 
                  processo={processo} 
                  onViewDetails={setSelectedProcess}
                  onViewTimeline={setShowTimelineDialog}
                  onUpdateStatus={handleUpdateStatus}
                />
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Processo */}
      <Dialog open={!!selectedProcess} onOpenChange={() => setSelectedProcess(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Processo</DialogTitle>
          </DialogHeader>
          {selectedProcess && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Número do Processo</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.numero}</p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo</Label>
                  <p className="text-sm text-muted-foreground">{getTipoLabel(selectedProcess.tipo)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.cliente}</p>
                </div>
                <div>
                  <Label className="font-semibold">Responsável</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.responsavel}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={`${getStatusColor(selectedProcess.status)} text-white`}>
                    {getStatusLabel(selectedProcess.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Prioridade</Label>
                  <Badge className={`${getPrioridadeColor(selectedProcess.prioridade)} text-white`}>
                    {selectedProcess.prioridade.toUpperCase()}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Data de Início</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.dataInicio}</p>
                </div>
                <div>
                  <Label className="font-semibold">Previsão de Fim</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.previsaoFim}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="font-semibold">Imóvel</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.imovel}</p>
                  <p className="text-xs text-muted-foreground">{selectedProcess.endereco}</p>
                </div>
                <div>
                  <Label className="font-semibold">Valor</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(selectedProcess.valor)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Progresso</Label>
                  <div className="flex items-center space-x-2">
                    <Progress value={selectedProcess.progresso} className="flex-1" />
                    <span className="text-sm font-medium">{selectedProcess.progresso}%</span>
                  </div>
                </div>
              </div>

              <div>
                <Label className="font-semibold">Etapa Atual</Label>
                <p className="text-sm text-muted-foreground">{selectedProcess.etapaAtual}</p>
              </div>

              <div>
                <Label className="font-semibold">Observações</Label>
                <p className="text-sm text-muted-foreground">{selectedProcess.observacoes}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Documentos Requeridos</Label>
                  <div className="space-y-1">
                    {selectedProcess.documentosRequeridos.map((doc, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        {selectedProcess.documentosRecebidos.includes(doc) ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="text-sm">{doc}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="font-semibold">Progresso dos Documentos</Label>
                  <div className="mt-2">
                    <Progress 
                      value={(selectedProcess.documentosRecebidos.length / selectedProcess.documentosRequeridos.length) * 100} 
                      className="h-3"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedProcess.documentosRecebidos.length} de {selectedProcess.documentosRequeridos.length} documentos recebidos
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Timeline */}
      <Dialog open={showTimelineDialog} onOpenChange={setShowTimelineDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Timeline do Processo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {etapasCompraVenda.map((etapa, index) => (
              <div key={etapa.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    etapa.concluida ? 'bg-green-500' : 'bg-gray-300'
                  }`}>
                    {etapa.concluida ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <span className="text-sm font-medium text-gray-600">{etapa.ordem}</span>
                    )}
                  </div>
                  {index < etapasCompraVenda.length - 1 && (
                    <div className={`w-0.5 h-12 ${etapa.concluida ? 'bg-green-500' : 'bg-gray-300'}`} />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <h4 className={`font-semibold ${etapa.concluida ? 'text-green-700' : 'text-gray-700'}`}>
                    {etapa.nome}
                  </h4>
                  <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <User className="h-3 w-3" />
                      <span>Responsável: {etapa.responsavel}</span>
                    </div>
                    {etapa.dataInicio && (
                      <div className="flex items-center space-x-2 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>Início: {etapa.dataInicio}</span>
                        {etapa.dataConclusao && <span>• Fim: {etapa.dataConclusao}</span>}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Criação de Processo */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Processo Jurídico</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="numeroProcesso">Número do Processo</Label>
                <Input id="numeroProcesso" placeholder="PROC-2024-XXX" />
              </div>
              <div>
                <Label htmlFor="tipoProcesso">Tipo de Processo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compra_venda">Compra e Venda</SelectItem>
                    <SelectItem value="locacao">Locação</SelectItem>
                    <SelectItem value="escritura">Escritura</SelectItem>
                    <SelectItem value="inventario">Inventário</SelectItem>
                    <SelectItem value="usucapiao">Usucapião</SelectItem>
                    <SelectItem value="regularizacao">Regularização</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="joao">João Silva</SelectItem>
                    <SelectItem value="maria">Maria Santos</SelectItem>
                    <SelectItem value="pedro">Pedro Costa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa1">Casa - Jardim América</SelectItem>
                    <SelectItem value="terreno1">Terreno - Centro</SelectItem>
                    <SelectItem value="casa2">Casa - Vila Nova</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-carlos">Dr. Carlos Santos</SelectItem>
                    <SelectItem value="dra-ana">Dra. Ana Costa</SelectItem>
                    <SelectItem value="dr-roberto">Dr. Roberto Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select>
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
              <div>
                <Label htmlFor="valor">Valor</Label>
                <Input id="valor" placeholder="R$ 0,00" />
              </div>
              <div>
                <Label htmlFor="previsaoFim">Previsão de Conclusão</Label>
                <Input id="previsaoFim" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea id="observacoes" placeholder="Observações sobre o processo..." />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateProcess} className="flex-1">
                Criar Processo
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Componente do Card de Processo
interface ProcessCardProps {
  processo: ProcessoJuridico;
  onViewDetails: (processo: ProcessoJuridico) => void;
  onViewTimeline: (show: boolean) => void;
  onUpdateStatus: (processo: ProcessoJuridico, status: ProcessoJuridico['status']) => void;
}

function ProcessCard({ processo, onViewDetails, onViewTimeline, onUpdateStatus }: ProcessCardProps) {
  const getStatusColor = (status: ProcessoJuridico['status']) => {
    switch (status) {
      case 'iniciado': return 'bg-blue-500';
      case 'documentacao': return 'bg-yellow-500';
      case 'analise': return 'bg-purple-500';
      case 'cartorio': return 'bg-orange-500';
      case 'finalizado': return 'bg-green-500';
      case 'suspenso': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: ProcessoJuridico['status']) => {
    switch (status) {
      case 'iniciado': return 'Iniciado';
      case 'documentacao': return 'Documentação';
      case 'analise': return 'Em Análise';
      case 'cartorio': return 'Em Cartório';
      case 'finalizado': return 'Finalizado';
      case 'suspenso': return 'Suspenso';
      default: return status;
    }
  };

  const getPrioridadeColor = (prioridade: ProcessoJuridico['prioridade']) => {
    switch (prioridade) {
      case 'baixa': return 'bg-gray-500';
      case 'media': return 'bg-blue-500';
      case 'alta': return 'bg-yellow-500';
      case 'urgente': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTipoLabel = (tipo: ProcessoJuridico['tipo']) => {
    switch (tipo) {
      case 'compra_venda': return 'Compra e Venda';
      case 'locacao': return 'Locação';
      case 'escritura': return 'Escritura';
      case 'inventario': return 'Inventário';
      case 'usucapiao': return 'Usucapião';
      case 'regularizacao': return 'Regularização';
      default: return tipo;
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">{processo.numero}</h4>
            <Badge variant="outline">{getTipoLabel(processo.tipo)}</Badge>
          </div>
          <p className="text-sm font-medium">{processo.titulo}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{processo.cliente}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Building className="h-3 w-3" />
              <span>{processo.imovel}</span>
            </div>
            <div className="flex items-center space-x-1">
              <DollarSign className="h-3 w-3" />
              <span>
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  notation: 'compact'
                }).format(processo.valor)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getPrioridadeColor(processo.prioridade)} text-white text-xs`}>
            {processo.prioridade.toUpperCase()}
          </Badge>
          <Badge className={`${getStatusColor(processo.status)} text-white`}>
            {getStatusLabel(processo.status)}
          </Badge>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Etapa: {processo.etapaAtual}</span>
          <span>{processo.progresso}%</span>
        </div>
        <Progress value={processo.progresso} className="h-2" />
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Início: {processo.dataInicio}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>Previsão: {processo.previsaoFim}</span>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="sm" variant="outline" onClick={() => onViewTimeline(true)}>
            <Gavel className="h-4 w-4 mr-1" />
            Timeline
          </Button>
          <Button size="sm" variant="outline" onClick={() => onViewDetails(processo)}>
            <Eye className="h-4 w-4 mr-1" />
            Detalhes
          </Button>
        </div>
      </div>

      {processo.observacoes && (
        <div className="mt-3 p-2 bg-muted rounded text-sm">
          <span className="font-medium">Observações:</span> {processo.observacoes}
        </div>
      )}
    </div>
  );
}