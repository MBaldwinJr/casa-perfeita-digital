
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Calendar } from "lucide-react";
import DocumentManager from "@/components/juridico/DocumentManager";
import ProcessManager from "@/components/juridico/ProcessManager";
import ResponsaveisManager from "@/components/juridico/ResponsaveisManager";
import JuridicoOverview from "@/components/juridico/JuridicoOverview";
import JuridicoCalendar from "@/components/juridico/JuridicoCalendar";
import JuridicoFilters from "@/components/juridico/JuridicoFilters";
import { useToast } from "@/hooks/use-toast";
import { 
  useAlertasJuridicos, 
  useAnalises, 
  useProcessos, 
  useDocumentosJuridicos, 
  useCreateAnalise, 
  useUpdateAlertaStatus,
  useClientes,
  useImoveis,
  useResponsaveis,
  AlertaJuridico
} from "@/hooks/useSupabaseQuery";

export default function Juridico() {
  const { toast } = useToast();
  
  // Estado local
  const [activeTab, setActiveTab] = useState('overview');
  const [showNovaAnaliseDialog, setShowNovaAnaliseDialog] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<AlertaJuridico | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    busca: '',
    status: '',
    tipo: '',
    prioridade: '',
    responsavel: '',
    dataInicio: '',
    dataFim: ''
  });

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
  const { data: responsaveis = [] } = useResponsaveis();
  
  const createAnalise = useCreateAnalise();
  const updateAlertaStatus = useUpdateAlertaStatus();

  // Loading state
  const isLoading = loadingAlertas || loadingAnalises || loadingProcessos || loadingDocumentos;

  // Funções de filtro
  const handleFiltersChange = (newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleClearFilters = () => {
    setFilters({
      busca: '',
      status: '',
      tipo: '',
      prioridade: '',
      responsavel: '',
      dataInicio: '',
      dataFim: ''
    });
  };

  // Aplicar filtros aos dados
  const filteredAnalises = analises.filter(analise => {
    if (filters.busca && !analise.tipo.toLowerCase().includes(filters.busca.toLowerCase()) && 
        !analise.responsavel.toLowerCase().includes(filters.busca.toLowerCase())) return false;
    if (filters.status && filters.status !== 'all' && analise.status !== filters.status) return false;
    if (filters.tipo && filters.tipo !== 'all' && analise.tipo !== filters.tipo) return false;
    if (filters.prioridade && filters.prioridade !== 'all' && analise.prioridade !== filters.prioridade) return false;
    if (filters.responsavel && filters.responsavel !== 'all' && analise.responsavel !== filters.responsavel) return false;
    return true;
  });

  const filteredProcessos = processos.filter(processo => {
    if (filters.busca && !processo.tipo.toLowerCase().includes(filters.busca.toLowerCase()) &&
        !processo.advogado_responsavel.toLowerCase().includes(filters.busca.toLowerCase())) return false;
    if (filters.status && filters.status !== 'all' && processo.status !== filters.status) return false;
    return true;
  });

  const handleNovaAnalise = () => {
    setShowNovaAnaliseDialog(true);
  };

  const handleVerAlerta = (alerta: AlertaJuridico) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold">Módulo Jurídico</h2>
          <p className="text-muted-foreground">Gestão completa de processos e documentos jurídicos</p>
        </div>
        <Button onClick={handleNovaAnalise}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      {/* Filtros */}
      {(activeTab === 'processos' || activeTab === 'documentos') && (
        <JuridicoFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 h-auto">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="responsaveis">Responsáveis</TabsTrigger>
          <TabsTrigger value="calendario">Calendário</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <JuridicoOverview
            alertas={alertas}
            analises={analises}
            processos={processos}
            documentos={documentos}
            onVerAlerta={handleVerAlerta}
          />
        </TabsContent>

        <TabsContent value="processos">
          <ProcessManager />
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentManager />
        </TabsContent>

        <TabsContent value="responsaveis">
          <ResponsaveisManager />
        </TabsContent>

        <TabsContent value="calendario">
          <JuridicoCalendar
            analises={analises}
            processos={processos}
            documentos={documentos}
          />
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
                    {clientes.filter(cliente => cliente.id && cliente.id.trim() !== '').map((cliente) => (
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
                    {imoveis.filter(imovel => imovel.id && imovel.id.trim() !== '').map((imovel) => (
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
                    {responsaveis.filter(resp => resp.ativo).map((responsavel) => (
                      <SelectItem key={responsavel.id} value={responsavel.nome}>
                        {responsavel.nome}
                      </SelectItem>
                    ))}
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
                <Badge className={`${selectedAlert.tipo === 'urgente' ? 'bg-red-500' : selectedAlert.tipo === 'atencao' ? 'bg-yellow-500' : 'bg-blue-500'} text-white ml-2`}>
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
