import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Play, 
  Pause, 
  CheckCircle, 
  AlertTriangle,
  Plus,
  Settings,
  Trash2,
  Edit
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Obra = Tables<'obras'>;
type CronogramaObra = Tables<'cronograma_obras'>;
type TemplateEtapa = Tables<'template_etapas_obras'>;
type ObraEtapaSelecionada = Tables<'obra_etapas_selecionadas'>;

interface CronogramaModalProps {
  obraId: string;
  obraNome: string;
  dataInicioObra: string;
  cronogramas: CronogramaObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CronogramaModal({ obraId, obraNome, dataInicioObra, cronogramas, open, onOpenChange }: CronogramaModalProps) {
  const [localCronogramas, setLocalCronogramas] = useState<CronogramaObra[]>(cronogramas || []);
  const [templates, setTemplates] = useState<TemplateEtapa[]>([]);
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<ObraEtapaSelecionada[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [dataInicio, setDataInicio] = useState<Date | undefined>(dataInicioObra ? new Date(dataInicioObra) : undefined);
  const [editingEtapa, setEditingEtapa] = useState<CronogramaObra | null>(null);
  const [newEtapaForm, setNewEtapaForm] = useState({
    etapa: '',
    descricao: '',
    data_inicio_prevista: undefined as Date | undefined,
    data_fim_prevista: undefined as Date | undefined,
    ordem_execucao: 1
  });

  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && obraId) {
      loadData();
    }
  }, [open, obraId]);

  const loadData = async () => {
    if (!obraId) return;

    setLoading(true);
    try {
      // Carregar cronogramas existentes
      const { data: cronogramData, error: cronogramError } = await supabase
        .from('cronograma_obras')
        .select('*')
        .eq('obra_id', obraId)
        .order('ordem_execucao');

      if (cronogramError) throw cronogramError;

      // Carregar templates disponíveis
      const { data: templateData, error: templateError } = await supabase
        .from('template_etapas_obras')
        .select('*')
        .eq('ativo', true)
        .order('ordem_execucao');

      if (templateError) throw templateError;

      // Carregar etapas selecionadas para esta obra
      const { data: selecionadasData, error: selecionadasError } = await supabase
        .from('obra_etapas_selecionadas')
        .select('*')
        .eq('obra_id', obraId)
        .eq('ativo', true);

      if (selecionadasError) throw selecionadasError;

      setLocalCronogramas(cronogramData || []);
      setTemplates(templateData || []);
      setEtapasSelecionadas(selecionadasData || []);
      
      // Se não há cronograma, definir data de início como a data da obra
      if (!cronogramData?.length && dataInicioObra) {
        setDataInicio(new Date(dataInicioObra));
      }
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateToggle = (templateId: string) => {
    setSelectedTemplates(prev => 
      prev.includes(templateId) 
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    );
  };

  const gerarCronogramaDosTemplates = async () => {
    if (!obraId || !user || !dataInicio || selectedTemplates.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos uma etapa e defina a data de início",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Primeiro, salvar etapas selecionadas
      const etapasParaSalvar = selectedTemplates.map(templateId => ({
        obra_id: obraId,
        template_etapa_id: templateId,
        ativo: true
      }));

      const { error: etapasError } = await supabase
        .from('obra_etapas_selecionadas')
        .upsert(etapasParaSalvar, { 
          onConflict: 'obra_id,template_etapa_id',
          ignoreDuplicates: false 
        });

      if (etapasError) throw etapasError;

      // Gerar cronograma baseado nos templates selecionados
      const templatesOrdenados = templates
        .filter(t => selectedTemplates.includes(t.id))
        .sort((a, b) => a.ordem_execucao - b.ordem_execucao);

      let dataAtual = new Date(dataInicio);
      const cronogramasParaCriar = [];

      for (const template of templatesOrdenados) {
        const dataFim = new Date(dataAtual);
        dataFim.setDate(dataFim.getDate() + template.duracao_estimada_dias);

        cronogramasParaCriar.push({
          obra_id: obraId,
          etapa: template.nome,
          descricao: template.descricao,
          data_inicio_prevista: dataAtual.toISOString().split('T')[0],
          data_fim_prevista: dataFim.toISOString().split('T')[0],
          ordem_execucao: template.ordem_execucao,
          status: 'pendente'
        });

        // Próxima etapa começa no dia seguinte
        dataAtual = new Date(dataFim);
        dataAtual.setDate(dataAtual.getDate() + 1);
      }

      const { error: cronogramaError } = await supabase
        .from('cronograma_obras')
        .insert(cronogramasParaCriar);

      if (cronogramaError) throw cronogramaError;

      toast({
        title: "Sucesso!",
        description: "Cronograma gerado com sucesso a partir dos templates.",
      });

      // Limpar seleções e recarregar dados
      setSelectedTemplates([]);
      setDataInicio(undefined);
      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao gerar cronograma",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const adicionarEtapaCustomizada = async () => {
    if (!obraId || !user || !newEtapaForm.etapa || !newEtapaForm.data_inicio_prevista || !newEtapaForm.data_fim_prevista) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const novaEtapa = {
        obra_id: obraId,
        etapa: newEtapaForm.etapa,
        descricao: newEtapaForm.descricao,
        data_inicio_prevista: newEtapaForm.data_inicio_prevista.toISOString().split('T')[0],
        data_fim_prevista: newEtapaForm.data_fim_prevista.toISOString().split('T')[0],
        ordem_execucao: newEtapaForm.ordem_execucao,
        status: 'pendente'
      };

      const { error } = await supabase
        .from('cronograma_obras')
        .insert([novaEtapa]);

      if (error) throw error;

      toast({
        title: "Sucesso!",
        description: "Etapa customizada adicionada com sucesso.",
      });

      // Reset form
      setNewEtapaForm({
        etapa: '',
        descricao: '',
        data_inicio_prevista: undefined,
        data_fim_prevista: undefined,
        ordem_execucao: localCronogramas.length + 1
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao adicionar etapa",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const atualizarStatusEtapa = async (etapaId: string, novoStatus: string, dataReal?: Date) => {
    try {
      const updateData: any = { status: novoStatus };
      
      if (novoStatus === 'em_andamento' && !localCronogramas.find(c => c.id === etapaId)?.data_inicio_real) {
        updateData.data_inicio_real = new Date().toISOString().split('T')[0];
      }
      
      if (novoStatus === 'concluida') {
        updateData.data_fim_real = (dataReal || new Date()).toISOString().split('T')[0];
      }

      const { error } = await supabase
        .from('cronograma_obras')
        .update(updateData)
        .eq('id', etapaId);

      if (error) throw error;

      // Atualizar progresso da obra baseado nas etapas concluídas
      await atualizarProgressoObra();

      toast({
        title: "Status atualizado",
        description: "Status da etapa foi atualizado com sucesso.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const atualizarProgressoObra = async () => {
    try {
      // Buscar todas as etapas da obra
      const { data: todasEtapas, error: etapasError } = await supabase
        .from('cronograma_obras')
        .select('*')
        .eq('obra_id', obraId);

      if (etapasError) throw etapasError;

      if (todasEtapas && todasEtapas.length > 0) {
        const etapasConcluidas = todasEtapas.filter(etapa => etapa.status === 'concluida').length;
        const progressoCalculado = Math.round((etapasConcluidas / todasEtapas.length) * 100);

        // Atualizar o progresso da obra
        const { error: obraError } = await supabase
          .from('obras')
          .update({ progresso_percentual: progressoCalculado })
          .eq('id', obraId);

        if (obraError) throw obraError;
      }
    } catch (error: any) {
      console.error('Erro ao atualizar progresso da obra:', error);
    }
  };

  const excluirEtapa = async (etapaId: string) => {
    try {
      const { error } = await supabase
        .from('cronograma_obras')
        .delete()
        .eq('id', etapaId);

      if (error) throw error;

      toast({
        title: "Etapa removida",
        description: "Etapa foi removida do cronograma.",
      });

      loadData();
    } catch (error: any) {
      toast({
        title: "Erro ao remover etapa",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pendente': 'bg-gray-500',
      'em_andamento': 'bg-blue-500',
      'concluida': 'bg-green-500',
      'atrasada': 'bg-red-500'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'em_andamento': return <Play className="h-4 w-4" />;
      case 'concluida': return <CheckCircle className="h-4 w-4" />;
      case 'atrasada': return <AlertTriangle className="h-4 w-4" />;
      default: return <Pause className="h-4 w-4" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento',
      'concluida': 'Concluída',
      'atrasada': 'Atrasada'
    };
    return statusMap[status] || status;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cronograma - {obraNome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="cronograma" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="nova-etapa">Nova Etapa</TabsTrigger>
          </TabsList>

          <TabsContent value="cronograma" className="space-y-4">
            {loading ? (
              <div className="text-center py-8">Carregando cronograma...</div>
            ) : localCronogramas.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">Nenhuma etapa no cronograma</p>
                <p className="text-sm text-muted-foreground">
                  Use a aba "Templates" para gerar um cronograma ou "Nova Etapa" para adicionar manualmente
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {localCronogramas.map((etapa) => (
                  <Card key={etapa.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${getStatusColor(etapa.status)} text-white`}>
                              {getStatusIcon(etapa.status)}
                              <span className="ml-1 capitalize">{getStatusLabel(etapa.status)}</span>
                            </Badge>
                            <span className="text-sm text-muted-foreground">Ordem: {etapa.ordem_execucao}</span>
                          </div>
                          <h4 className="font-medium text-lg">{etapa.etapa}</h4>
                          {etapa.descricao && (
                            <p className="text-sm text-muted-foreground mt-1">{etapa.descricao}</p>
                          )}
                          <div className="flex items-center gap-4 mt-3 text-sm">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              <span>Previsto: {new Date(etapa.data_inicio_prevista).toLocaleDateString('pt-BR')} - {new Date(etapa.data_fim_prevista).toLocaleDateString('pt-BR')}</span>
                            </div>
                            {etapa.data_inicio_real && (
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>Real: {new Date(etapa.data_inicio_real).toLocaleDateString('pt-BR')} - {etapa.data_fim_real ? new Date(etapa.data_fim_real).toLocaleDateString('pt-BR') : 'Em andamento'}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {etapa.status === 'pendente' && (
                            <Button
                              size="sm"
                              onClick={() => atualizarStatusEtapa(etapa.id, 'em_andamento')}
                            >
                              <Play className="h-4 w-4 mr-1" />
                              Iniciar
                            </Button>
                          )}
                          {etapa.status === 'em_andamento' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => atualizarStatusEtapa(etapa.id, 'concluida')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Concluir
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => excluirEtapa(etapa.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerar Cronograma dos Templates</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Início</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !dataInicio && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={dataInicio}
                          onSelect={setDataInicio}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Selecionar Etapas</label>
                    <div className="grid gap-2 max-h-60 overflow-y-auto">
                      {templates.map((template) => (
                        <div key={template.id} className="flex items-center space-x-2 p-2 border rounded">
                          <Checkbox
                            id={template.id}
                            checked={selectedTemplates.includes(template.id)}
                            onCheckedChange={() => handleTemplateToggle(template.id)}
                          />
                          <div className="flex-1">
                            <label htmlFor={template.id} className="text-sm font-medium cursor-pointer">
                              {template.nome}
                            </label>
                            <p className="text-xs text-muted-foreground">{template.descricao}</p>
                            <div className="text-xs text-muted-foreground">
                              Duração: {template.duracao_estimada_dias} dias | Categoria: {template.categoria}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={gerarCronogramaDosTemplates}
                    disabled={saving || selectedTemplates.length === 0 || !dataInicio}
                    className="w-full"
                  >
                    {saving ? "Gerando..." : "Gerar Cronograma"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nova-etapa" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Adicionar Etapa Customizada</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Nome da Etapa *</label>
                    <Input
                      value={newEtapaForm.etapa}
                      onChange={(e) => setNewEtapaForm(prev => ({ ...prev, etapa: e.target.value }))}
                      placeholder="Ex: Instalação elétrica personalizada"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Ordem de Execução</label>
                    <Input
                      type="number"
                      value={newEtapaForm.ordem_execucao}
                      onChange={(e) => setNewEtapaForm(prev => ({ ...prev, ordem_execucao: Number(e.target.value) }))}
                      min="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    value={newEtapaForm.descricao}
                    onChange={(e) => setNewEtapaForm(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição detalhada da etapa..."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Início *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full",
                            !newEtapaForm.data_inicio_prevista && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEtapaForm.data_inicio_prevista ? format(newEtapaForm.data_inicio_prevista, "dd/MM/yyyy") : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newEtapaForm.data_inicio_prevista}
                          onSelect={(date) => setNewEtapaForm(prev => ({ ...prev, data_inicio_prevista: date }))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Data de Fim *</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal w-full",
                            !newEtapaForm.data_fim_prevista && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {newEtapaForm.data_fim_prevista ? format(newEtapaForm.data_fim_prevista, "dd/MM/yyyy") : "Selecione a data"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={newEtapaForm.data_fim_prevista}
                          onSelect={(date) => setNewEtapaForm(prev => ({ ...prev, data_fim_prevista: date }))}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button
                  onClick={adicionarEtapaCustomizada}
                  disabled={saving || !newEtapaForm.etapa || !newEtapaForm.data_inicio_prevista || !newEtapaForm.data_fim_prevista}
                  className="w-full"
                >
                  {saving ? "Adicionando..." : "Adicionar Etapa"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}