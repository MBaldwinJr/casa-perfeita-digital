import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { 
  Scale, 
  Plus, 
  Eye, 
  Calendar, 
  Clock,
  User,
  Building,
  DollarSign,
  Gavel
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useProcessos, 
  useCreateProcesso, 
  useClientes, 
  useImoveis, 
  ProcessoJuridico as ProcessoJuridicoType
} from "@/hooks/useSupabaseQuery";

interface FormData {
  numero_processo: string;
  tipo: string;
  instancia: string;
  vara: string;
  cliente_id: string;
  imovel_id: string;
  advogado_responsavel: string;
  data_inicio: string;
  valor_causa: string;
  descricao: string;
  observacoes: string;
}

export default function ProcessManager() {
  const { toast } = useToast();
  const [selectedProcess, setSelectedProcess] = useState<ProcessoJuridicoType | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('ativos');

  // Form state
  const [formData, setFormData] = useState<FormData>({
    numero_processo: '',
    tipo: '',
    instancia: '',
    vara: '',
    cliente_id: '',
    imovel_id: '',
    advogado_responsavel: '',
    data_inicio: '',
    valor_causa: '',
    descricao: '',
    observacoes: ''
  });

  // Hooks para dados
  const { data: processos = [], isLoading: loadingProcessos } = useProcessos();
  const { data: clientes = [] } = useClientes();
  const { data: imoveis = [] } = useImoveis();
  const createProcesso = useCreateProcesso();

  // Filtrar processos por status
  const processosAtivos = processos.filter(p => p.status === 'ativo');
  const processosFinalizados = processos.filter(p => p.status === 'finalizado');
  const processosSuspensos = processos.filter(p => p.status === 'suspenso');

  const estatisticas = {
    total: processos.length,
    ativos: processosAtivos.length,
    finalizados: processosFinalizados.length,
    suspensos: processosSuspensos.length,
  };

  const handleCreateProcess = async () => {
    if (!formData.tipo || !formData.instancia || !formData.advogado_responsavel || !formData.data_inicio) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createProcesso.mutateAsync({
        numero_processo: formData.numero_processo || undefined,
        tipo: formData.tipo,
        instancia: formData.instancia,
        vara: formData.vara || undefined,
        status: 'ativo',
        data_inicio: formData.data_inicio,
        valor_causa: formData.valor_causa ? parseFloat(formData.valor_causa) : undefined,
        advogado_responsavel: formData.advogado_responsavel,
        cliente_id: formData.cliente_id || undefined,
        imovel_id: formData.imovel_id || undefined,
        descricao: formData.descricao || undefined,
        observacoes: formData.observacoes || undefined,
      });

      setShowCreateDialog(false);
      setFormData({
        numero_processo: '',
        tipo: '',
        instancia: '',
        vara: '',
        cliente_id: '',
        imovel_id: '',
        advogado_responsavel: '',
        data_inicio: '',
        valor_causa: '',
        descricao: '',
        observacoes: ''
      });
    } catch (error) {
      // O erro já é tratado no hook
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'arquivado': return 'bg-gray-500';
      case 'suspenso': return 'bg-red-500';
      case 'finalizado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'arquivado': return 'Arquivado';
      case 'suspenso': return 'Suspenso';
      case 'finalizado': return 'Finalizado';
      default: return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'compra_venda': 'Compra e Venda',
      'locacao': 'Locação',
      'escritura': 'Escritura',
      'inventario': 'Inventário',
      'usucapiao': 'Usucapião',
      'regularizacao': 'Regularização',
      'execucao': 'Execução',
      'cobranca': 'Cobrança'
    };
    return tipos[tipo] || tipo;
  };

  if (loadingProcessos) {
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
          <h3 className="text-xl font-semibold">Gestão de Processos</h3>
          <p className="text-muted-foreground">Acompanhamento completo de processos jurídicos</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
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
            <div className="text-2xl font-bold text-green-600">{estatisticas.ativos}</div>
            <p className="text-xs text-muted-foreground">em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Finalizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.finalizados}</div>
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
              {processosAtivos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum processo ativo encontrado.</p>
              ) : (
                processosAtivos.map((processo) => (
                  <ProcessCard 
                    key={processo.id} 
                    processo={processo} 
                    onViewDetails={setSelectedProcess}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="finalizados" className="space-y-4">
              {processosFinalizados.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum processo finalizado encontrado.</p>
              ) : (
                processosFinalizados.map((processo) => (
                  <ProcessCard 
                    key={processo.id} 
                    processo={processo} 
                    onViewDetails={setSelectedProcess}
                  />
                ))
              )}
            </TabsContent>

            <TabsContent value="suspensos" className="space-y-4">
              {processosSuspensos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Nenhum processo suspenso encontrado.</p>
              ) : (
                processosSuspensos.map((processo) => (
                  <ProcessCard 
                    key={processo.id} 
                    processo={processo} 
                    onViewDetails={setSelectedProcess}
                  />
                ))
              )}
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
                  <p className="text-sm text-muted-foreground">{selectedProcess.numero_processo || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo</Label>
                  <p className="text-sm text-muted-foreground">{getTipoLabel(selectedProcess.tipo)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Instância</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.instancia}</p>
                </div>
                <div>
                  <Label className="font-semibold">Vara</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.vara || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Responsável</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.advogado_responsavel}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={`${getStatusColor(selectedProcess.status)} text-white`}>
                    {getStatusLabel(selectedProcess.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Data de Início</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedProcess.data_inicio).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {selectedProcess.data_conclusao && (
                  <div>
                    <Label className="font-semibold">Data de Conclusão</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(selectedProcess.data_conclusao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {selectedProcess.valor_causa && (
                  <div>
                    <Label className="font-semibold">Valor da Causa</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(selectedProcess.valor_causa)}
                    </p>
                  </div>
                )}
                {selectedProcess.clientes && (
                  <div>
                    <Label className="font-semibold">Cliente</Label>
                    <p className="text-sm text-muted-foreground">{selectedProcess.clientes.nome}</p>
                  </div>
                )}
                {selectedProcess.imoveis && (
                  <div>
                    <Label className="font-semibold">Imóvel</Label>
                    <p className="text-sm text-muted-foreground">{selectedProcess.imoveis.titulo}</p>
                    <p className="text-xs text-muted-foreground">{selectedProcess.imoveis.endereco}</p>
                  </div>
                )}
              </div>

              {selectedProcess.descricao && (
                <div>
                  <Label className="font-semibold">Descrição</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.descricao}</p>
                </div>
              )}

              {selectedProcess.observacoes && (
                <div>
                  <Label className="font-semibold">Observações</Label>
                  <p className="text-sm text-muted-foreground">{selectedProcess.observacoes}</p>
                </div>
              )}
            </div>
          )}
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
                <Input 
                  id="numeroProcesso" 
                  placeholder="PROC-2024-XXX" 
                  value={formData.numero_processo}
                  onChange={(e) => setFormData(prev => ({ ...prev, numero_processo: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tipoProcesso">Tipo de Processo *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
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
                    <SelectItem value="execucao">Execução</SelectItem>
                    <SelectItem value="cobranca">Cobrança</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="instancia">Instância *</Label>
                <Select value={formData.instancia} onValueChange={(value) => setFormData(prev => ({ ...prev, instancia: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a instância" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1ª Instância">1ª Instância</SelectItem>
                    <SelectItem value="2ª Instância">2ª Instância</SelectItem>
                    <SelectItem value="Superior">Superior</SelectItem>
                    <SelectItem value="Supremo">Supremo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vara">Vara</Label>
                <Input 
                  id="vara" 
                  placeholder="Ex: 1ª Vara Cível" 
                  value={formData.vara}
                  onChange={(e) => setFormData(prev => ({ ...prev, vara: e.target.value }))}
                />
              </div>
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
                <Label htmlFor="responsavel">Advogado Responsável *</Label>
                <Select value={formData.advogado_responsavel} onValueChange={(value) => setFormData(prev => ({ ...prev, advogado_responsavel: value }))}>
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
              <div>
                <Label htmlFor="dataInicio">Data de Início *</Label>
                <Input 
                  id="dataInicio" 
                  type="date" 
                  value={formData.data_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="valorCausa">Valor da Causa</Label>
                <Input 
                  id="valorCausa" 
                  placeholder="R$ 0,00" 
                  value={formData.valor_causa}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor_causa: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea 
                id="descricao" 
                placeholder="Descrição do processo..." 
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                id="observacoes" 
                placeholder="Observações sobre o processo..." 
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCreateProcess} className="flex-1" disabled={createProcesso.isPending}>
                {createProcesso.isPending ? "Criando..." : "Criar Processo"}
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
  processo: ProcessoJuridicoType;
  onViewDetails: (processo: ProcessoJuridicoType) => void;
}

function ProcessCard({ processo, onViewDetails }: ProcessCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-500';
      case 'arquivado': return 'bg-gray-500';
      case 'suspenso': return 'bg-red-500';
      case 'finalizado': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ativo': return 'Ativo';
      case 'arquivado': return 'Arquivado';
      case 'suspenso': return 'Suspenso';
      case 'finalizado': return 'Finalizado';
      default: return status;
    }
  };

  const getTipoLabel = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'compra_venda': 'Compra e Venda',
      'locacao': 'Locação',
      'escritura': 'Escritura',
      'inventario': 'Inventário',
      'usucapiao': 'Usucapião',
      'regularizacao': 'Regularização',
      'execucao': 'Execução',
      'cobranca': 'Cobrança'
    };
    return tipos[tipo] || tipo;
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <h4 className="font-semibold">{processo.numero_processo || `Processo ${processo.id.slice(0, 8)}`}</h4>
            <Badge variant="outline">{getTipoLabel(processo.tipo)}</Badge>
          </div>
          <p className="text-sm font-medium">{processo.descricao || getTipoLabel(processo.tipo)}</p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{processo.advogado_responsavel}</span>
            </div>
            {processo.clientes && (
              <div className="flex items-center space-x-1">
                <Building className="h-3 w-3" />
                <span>{processo.clientes.nome}</span>
              </div>
            )}
            {processo.valor_causa && (
              <div className="flex items-center space-x-1">
                <DollarSign className="h-3 w-3" />
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                    notation: 'compact'
                  }).format(processo.valor_causa)}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className={`${getStatusColor(processo.status)} text-white`}>
            {getStatusLabel(processo.status)}
          </Badge>
        </div>
      </div>

      <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-3 w-3" />
            <span>Início: {new Date(processo.data_inicio).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gavel className="h-3 w-3" />
            <span>{processo.instancia}</span>
          </div>
        </div>
        <div className="flex space-x-2">
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