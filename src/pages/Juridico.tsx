
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, AlertTriangle, CheckCircle, FileText, Clock, Eye, Plus, BarChart3 } from "lucide-react";
import DocumentManager from "@/components/juridico/DocumentManager";
import ProcessManager from "@/components/juridico/ProcessManager";
import { useToast } from "@/hooks/use-toast";
import { 
  useAlertasJuridicos, 
  useAnalises, 
  useProcessos, 
  useDocumentosJuridicos, 
  useCreateAnalise, 
  useUpdateAlertaStatus,
  useClientes,
  useImoveis
} from "@/hooks/useSupabaseQuery";

export default function Juridico() {
  const { toast } = useToast();
  
  // Estado local
  const [activeTab, setActiveTab] = useState('overview');
  const [showNovaAnaliseDialog, setShowNovaAnaliseDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<any>(null);
  const [formData, setFormData] = useState({
    cliente_id: '',
    imovel_id: '',
    tipo: '',
    prioridade: '',
    responsavel: '',
    prazo_conclusao: '',
    observacoes: ''
  });

  // Hooks para dados
  const { data: alertas = [], isLoading: loadingAlertas } = useAlertasJuridicos();
  const { data: analises = [], isLoading: loadingAnalises } = useAnalises();
  const { data: processos = [], isLoading: loadingProcessos } = useProcessos();
  const { data: documentos = [], isLoading: loadingDocumentos } = useDocumentosJuridicos();
  const { data: clientes = [] } = useClientes();
  const { data: imoveis = [] } = useImoveis();
  
  const createAnalise = useCreateAnalise();
  const updateAlertaStatus = useUpdateAlertaStatus();

  // Loading state
  const isLoading = loadingAlertas || loadingAnalises || loadingProcessos || loadingDocumentos;

  // Calcular estatísticas reais
  const estatisticas = {
    processosAtivos: processos.filter(p => p.status === 'ativo').length,
    documentosValidos: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0,
    alertasAtivos: alertas.length,
    processosConcluidos: processos.filter(p => p.status === 'finalizado').length,
    prazosVencidos: documentos.filter(d => d.data_vencimento && new Date(d.data_vencimento) < new Date()).length,
    certificacoesOk: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0
  };

  const handleNovaAnalise = () => {
    setShowNovaAnaliseDialog(true);
  };

  const handleVerAlerta = (alerta: any) => {
    setSelectedAlert(alerta);
    setShowAlertDialog(true);
  };

  const handleCriarAnalise = async () => {
    if (!formData.tipo || !formData.prioridade || !formData.responsavel) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createAnalise.mutateAsync({
        tipo: formData.tipo as any,
        prioridade: formData.prioridade as any,
        responsavel: formData.responsavel,
        cliente_id: formData.cliente_id || undefined,
        imovel_id: formData.imovel_id || undefined,
        prazo_conclusao: formData.prazo_conclusao || undefined,
        observacoes: formData.observacoes || undefined,
        status: 'pendente'
      });
      
      setShowNovaAnaliseDialog(false);
      setFormData({
        cliente_id: '',
        imovel_id: '',
        tipo: '',
        prioridade: '',
        responsavel: '',
        prazo_conclusao: '',
        observacoes: ''
      });
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  const handleMarcarComoVisto = async () => {
    if (selectedAlert?.id) {
      try {
        await updateAlertaStatus.mutateAsync({
          id: selectedAlert.id,
          status: 'visto'
        });
        
        toast({
          title: "Alerta Marcado",
          description: "Alerta marcado como visualizado.",
        });
        setShowAlertDialog(false);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Erro ao marcar alerta como visto.",
          variant: "destructive",
        });
      }
    }
  };

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'bg-red-500';
      case 'atencao': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Módulo Jurídico</h2>
          <p className="text-muted-foreground">Gestão completa de processos e documentos jurídicos</p>
        </div>
        <Button onClick={handleNovaAnalise}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas Gerais */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.processosAtivos}</div>
                <p className="text-xs text-muted-foreground">+2 esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.documentosValidos}%</div>
                <p className="text-xs text-muted-foreground">3 documentos vencidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{estatisticas.alertasAtivos}</div>
                <p className="text-xs text-muted-foreground">2 urgentes</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{estatisticas.processosConcluidos}</div>
                <p className="text-xs text-muted-foreground">este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prazos Vencidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{estatisticas.prazosVencidos}</div>
                <p className="text-xs text-muted-foreground">requer ação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Certificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{estatisticas.certificacoesOk}%</div>
                <p className="text-xs text-muted-foreground">conformidade</p>
              </CardContent>
            </Card>
          </div>

          {/* Alertas Jurídicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Alertas Jurídicos
              </CardTitle>
              <CardDescription>Pendências que requerem atenção imediata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alertas.length > 0 ? (
                  alertas.map((alerta) => (
                    <div key={alerta.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      <Badge className={`${getCorPorTipo(alerta.tipo)} text-white`}>
                        {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
                      </Badge>
                      <span className="flex-1">{alerta.mensagem}</span>
                      <Button size="sm" variant="outline" onClick={() => handleVerAlerta(alerta)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">Nenhum alerta ativo no momento</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Dashboard de Produtividade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Resumo de Produtividade
              </CardTitle>
              <CardDescription>Performance do setor jurídico nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700">Processos Finalizados</h4>
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-muted-foreground">+20% vs mês anterior</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-700">Tempo Médio de Processo</h4>
                    <p className="text-2xl font-bold text-blue-600">45 dias</p>
                    <p className="text-sm text-muted-foreground">-5 dias vs mês anterior</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700">Documentos Processados</h4>
                    <p className="text-2xl font-bold text-yellow-600">156</p>
                    <p className="text-sm text-muted-foreground">+12% vs mês anterior</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-700">Taxa de Aprovação</h4>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-muted-foreground">+2% vs mês anterior</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processos">
          <ProcessManager />
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentManager />
        </TabsContent>
      </Tabs>

      {/* Modal Nova Análise */}
      <Dialog open={showNovaAnaliseDialog} onOpenChange={setShowNovaAnaliseDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Análise Jurídica</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={formData.cliente_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
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
                <Select value={formData.imovel_id} onValueChange={(value) => setFormData(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo} - {imovel.endereco}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tipo">Tipo de Análise</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="documentos">Análise de Documentos</SelectItem>
                    <SelectItem value="viabilidade">Viabilidade Jurídica</SelectItem>
                    <SelectItem value="riscos">Análise de Riscos</SelectItem>
                    <SelectItem value="due_diligence">Due Diligence</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade</Label>
                <Select value={formData.prioridade} onValueChange={(value) => setFormData(prev => ({ ...prev, prioridade: value }))}>
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
                <Label htmlFor="prazo">Prazo</Label>
                <Input 
                  id="prazo" 
                  type="date" 
                  value={formData.prazo_conclusao}
                  onChange={(e) => setFormData(prev => ({ ...prev, prazo_conclusao: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="responsavel">Responsável</Label>
                <Select value={formData.responsavel} onValueChange={(value) => setFormData(prev => ({ ...prev, responsavel: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o responsável" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Carlos Santos">Dr. Carlos Santos</SelectItem>
                    <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                    <SelectItem value="Dr. Roberto Lima">Dr. Roberto Lima</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Detalhes sobre a análise solicitada..." 
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCriarAnalise} className="flex-1">
                Criar Análise
              </Button>
              <Button variant="outline" onClick={() => setShowNovaAnaliseDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal Detalhes do Alerta */}
      <Dialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Alerta</DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div>
                <Label className="font-semibold">Tipo</Label>
                <Badge className={`${getCorPorTipo(selectedAlert.tipo)} text-white ml-2`}>
                  {selectedAlert.tipo.charAt(0).toUpperCase() + selectedAlert.tipo.slice(1)}
                </Badge>
              </div>
              <div>
                <Label className="font-semibold">Título</Label>
                <p className="text-sm font-medium mt-1">{selectedAlert.titulo}</p>
              </div>
              <div>
                <Label className="font-semibold">Mensagem</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedAlert.mensagem}</p>
              </div>
              {selectedAlert.data_vencimento && (
                <div>
                  <Label className="font-semibold">Data de Vencimento</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedAlert.data_vencimento).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              )}
              <div>
                <Label className="font-semibold">Ações Recomendadas</Label>
                <div className="mt-2 space-y-2">
                  {selectedAlert.tipo === "urgente" && (
                    <p className="text-sm">• Ação imediata necessária - Verifique os detalhes e tome as medidas cabíveis</p>
                  )}
                  {selectedAlert.tipo === "atencao" && (
                    <p className="text-sm">• Requer atenção - Agende uma revisão nos próximos dias</p>
                  )}
                  {selectedAlert.tipo === "info" && (
                    <p className="text-sm">• Informativo - Tome conhecimento da situação</p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setShowAlertDialog(false)} className="flex-1">
                  Fechar
                </Button>
                <Button onClick={handleMarcarComoVisto}>
                  Marcar como Visto
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
