import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Calendar, CheckCircle, AlertTriangle, Clock, Settings2, Wand2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useCreateCronogramaObra, useObraEtapasSelecionadas } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";
import { EtapasConfigModal } from "./EtapasConfigModal";

type CronogramaObra = Tables<'cronograma_obras'>;

interface CronogramaModalProps {
  obraId: string;
  obraNome: string;
  dataInicioObra: string;
  cronogramas: CronogramaObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CronogramaModal({ obraId, obraNome, dataInicioObra, cronogramas, open, onOpenChange }: CronogramaModalProps) {
  const { toast } = useToast();
  const createCronograma = useCreateCronogramaObra();
  const { data: etapasSelecionadas = [] } = useObraEtapasSelecionadas(obraId);
  const [showForm, setShowForm] = useState(false);
  const [showEtapasConfig, setShowEtapasConfig] = useState(false);
  const [formData, setFormData] = useState({
    etapa: '',
    descricao: '',
    data_inicio_prevista: '',
    data_fim_prevista: '',
    ordem_execucao: cronogramas.length + 1,
    status: 'pendente' as const,
    observacoes: ''
  });

  const handleSubmit = async () => {
    if (!formData.etapa || !formData.data_inicio_prevista || !formData.data_fim_prevista) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCronograma.mutateAsync({
        obra_id: obraId,
        etapa: formData.etapa,
        descricao: formData.descricao,
        data_inicio_prevista: formData.data_inicio_prevista,
        data_fim_prevista: formData.data_fim_prevista,
        ordem_execucao: formData.ordem_execucao,
        status: formData.status,
        observacoes: formData.observacoes
      });

      setShowForm(false);
      setFormData({
        etapa: '',
        descricao: '',
        data_inicio_prevista: '',
        data_fim_prevista: '',
        ordem_execucao: cronogramas.length + 2,
        status: 'pendente',
        observacoes: ''
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'concluida': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'em_andamento': return <AlertTriangle className="h-4 w-4 text-blue-500" />;
      case 'atrasada': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
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

  const sortedCronogramas = [...cronogramas].sort((a, b) => a.ordem_execucao - b.ordem_execucao);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Cronograma da Obra
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setShowEtapasConfig(true)} size="sm" variant="outline">
                <Settings2 className="h-4 w-4 mr-2" />
                Configurar Etapas
              </Button>
            <Button onClick={() => setShowForm(!showForm)} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Nova Etapa
            </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário para Nova Etapa */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nova Etapa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="etapa">Nome da Etapa *</Label>
                    <Input
                      id="etapa"
                      value={formData.etapa}
                      onChange={(e) => setFormData(prev => ({ ...prev, etapa: e.target.value }))}
                      placeholder="Ex: Fundação, Estrutura..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="ordem">Ordem de Execução</Label>
                    <Input
                      id="ordem"
                      type="number"
                      value={formData.ordem_execucao}
                      onChange={(e) => setFormData(prev => ({ ...prev, ordem_execucao: parseInt(e.target.value) || 1 }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="data_inicio">Data Início Prevista *</Label>
                    <Input
                      id="data_inicio"
                      type="date"
                      value={formData.data_inicio_prevista}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_inicio_prevista: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="data_fim">Data Fim Prevista *</Label>
                    <Input
                      id="data_fim"
                      type="date"
                      value={formData.data_fim_prevista}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_fim_prevista: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="em_andamento">Em Andamento</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="atrasada">Atrasada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Detalhes da etapa..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações importantes..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} disabled={createCronograma.isPending}>
                    {createCronograma.isPending ? 'Salvando...' : 'Salvar Etapa'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista do Cronograma */}
          <div className="space-y-4">
            {sortedCronogramas.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma etapa cadastrada</p>
                <p className="text-sm text-muted-foreground">Adicione etapas para organizar o cronograma da obra</p>
              </div>
            ) : (
              sortedCronogramas.map((etapa, index) => (
                <Card key={etapa.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm bg-primary/10 px-2 py-1 rounded">
                            #{etapa.ordem_execucao}
                          </span>
                          <h4 className="font-semibold">{etapa.etapa}</h4>
                          {getStatusIcon(etapa.status)}
                        </div>
                        
                        {etapa.descricao && (
                          <p className="text-sm text-muted-foreground mb-3">{etapa.descricao}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Previsto:</span>
                            <p className="text-muted-foreground">
                              {new Date(etapa.data_inicio_prevista).toLocaleDateString('pt-BR')} - {new Date(etapa.data_fim_prevista).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          
                          {etapa.data_inicio_real && (
                            <div>
                              <span className="font-medium">Realizado:</span>
                              <p className="text-muted-foreground">
                                {new Date(etapa.data_inicio_real).toLocaleDateString('pt-BR')}
                                {etapa.data_fim_real && ` - ${new Date(etapa.data_fim_real).toLocaleDateString('pt-BR')}`}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {etapa.observacoes && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="font-medium text-sm">Observações:</span>
                            <p className="text-sm text-muted-foreground mt-1">{etapa.observacoes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4">
                        <Badge 
                          variant="outline" 
                          className={
                            etapa.status === 'concluida' ? 'text-green-600 border-green-600' :
                            etapa.status === 'em_andamento' ? 'text-blue-600 border-blue-600' :
                            etapa.status === 'atrasada' ? 'text-red-600 border-red-600' :
                            'text-gray-600 border-gray-600'
                          }
                        >
                          {getStatusLabel(etapa.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Modal de Configuração de Etapas */}
        <EtapasConfigModal
          obraId={obraId}
          obraNome={obraNome}
          dataInicioObra={dataInicioObra}
          open={showEtapasConfig}
          onOpenChange={setShowEtapasConfig}
        />
      </DialogContent>
    </Dialog>
  );
};