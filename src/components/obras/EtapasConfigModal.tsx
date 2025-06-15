import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Layers, Wand2, CheckCircle2 } from "lucide-react";
import { useTemplateEtapas, useObraEtapasSelecionadas, useToggleEtapaObra, useGerarCronogramaAutomatico } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";

interface EtapasConfigModalProps {
  obraId: string;
  obraNome: string;
  dataInicioObra: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EtapasConfigModal({ 
  obraId, 
  obraNome, 
  dataInicioObra, 
  open, 
  onOpenChange 
}: EtapasConfigModalProps) {
  const { toast } = useToast();
  const { data: templateEtapas = [], isLoading } = useTemplateEtapas();
  const { data: etapasSelecionadas = [] } = useObraEtapasSelecionadas(obraId);
  const toggleEtapa = useToggleEtapaObra();
  const gerarCronograma = useGerarCronogramaAutomatico();
  
  const [duracoesPers, setDuracoesPers] = useState<Record<string, number>>({});

  // Mapear etapas selecionadas por template_id para facilitar verificação
  const etapasAtivas = etapasSelecionadas.reduce((acc, etapa) => {
    acc[etapa.template_etapa_id] = {
      ativo: etapa.ativo,
      duracao: etapa.duracao_personalizada_dias,
      ordem: etapa.ordem_personalizada
    };
    return acc;
  }, {} as Record<string, { ativo: boolean; duracao?: number; ordem?: number }>);

  // Agrupar etapas por categoria
  const etapasPorCategoria = templateEtapas.reduce((acc, etapa) => {
    if (!acc[etapa.categoria]) acc[etapa.categoria] = [];
    acc[etapa.categoria].push(etapa);
    return acc;
  }, {} as Record<string, typeof templateEtapas>);

  const categoriaLabels: Record<string, { nome: string; cor: string; icone: string }> = {
    'planejamento': { nome: 'Planejamento', cor: 'bg-blue-500', icone: '📋' },
    'preparacao': { nome: 'Preparação', cor: 'bg-orange-500', icone: '🚧' },
    'estrutural': { nome: 'Estrutural', cor: 'bg-red-500', icone: '🏗️' },
    'cobertura': { nome: 'Cobertura', cor: 'bg-purple-500', icone: '🏠' },
    'instalacoes': { nome: 'Instalações', cor: 'bg-yellow-500', icone: '⚡' },
    'acabamento': { nome: 'Acabamento', cor: 'bg-green-500', icone: '🎨' },
    'finalizacao': { nome: 'Finalização', cor: 'bg-gray-500', icone: '✅' }
  };

  const handleToggleEtapa = async (templateEtapa: any, ativo: boolean) => {
    const duracaoPersonalizada = duracoesPers[templateEtapa.id];
    
    await toggleEtapa.mutateAsync({
      obraId,
      templateEtapaId: templateEtapa.id,
      ativo,
      ordemPersonalizada: templateEtapa.ordem_execucao,
      duracaoPersonalizada: duracaoPersonalizada || templateEtapa.duracao_estimada_dias
    });
  };

  const handleGerarCronograma = async () => {
    const etapasAtivasCount = Object.values(etapasAtivas).filter(e => e.ativo).length;
    
    if (etapasAtivasCount === 0) {
      toast({
        title: "Nenhuma etapa selecionada",
        description: "Selecione pelo menos uma etapa para gerar o cronograma.",
        variant: "destructive",
      });
      return;
    }

    await gerarCronograma.mutateAsync({
      obraId,
      dataInicio: dataInicioObra
    });
  };

  const totalEtapasAtivas = Object.values(etapasAtivas).filter(e => e.ativo).length;
  const duracaoTotalEstimada = templateEtapas
    .filter(t => etapasAtivas[t.id]?.ativo)
    .reduce((total, t) => {
      const duracaoPersonalizada = duracoesPers[t.id] || etapasAtivas[t.id]?.duracao;
      return total + (duracaoPersonalizada || t.duracao_estimada_dias);
    }, 0);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Configurar Etapas - {obraNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo */}
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalEtapasAtivas}</div>
                  <p className="text-sm text-muted-foreground">Etapas Selecionadas</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{duracaoTotalEstimada}</div>
                  <p className="text-sm text-muted-foreground">Dias Estimados</p>
                </div>
                <div className="text-center">
                  <Button 
                    onClick={handleGerarCronograma}
                    disabled={totalEtapasAtivas === 0 || gerarCronograma.isPending}
                    className="w-full"
                  >
                    <Wand2 className="h-4 w-4 mr-2" />
                    {gerarCronograma.isPending ? 'Gerando...' : 'Gerar Cronograma'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Etapas por Categoria */}
          <div className="space-y-6">
            {Object.entries(etapasPorCategoria).map(([categoria, etapas]) => {
              const catInfo = categoriaLabels[categoria] || { nome: categoria, cor: 'bg-gray-500', icone: '📁' };
              
              return (
                <Card key={categoria}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className={`w-3 h-3 rounded-full ${catInfo.cor}`}></div>
                      <span className="text-lg">{catInfo.icone}</span>
                      {catInfo.nome}
                      <Badge variant="outline" className="ml-auto">
                        {etapas.filter(e => etapasAtivas[e.id]?.ativo).length}/{etapas.length}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {etapas.map((etapa) => {
                      const isAtivo = etapasAtivas[etapa.id]?.ativo || false;
                      const duracaoAtual = duracoesPers[etapa.id] || etapasAtivas[etapa.id]?.duracao || etapa.duracao_estimada_dias;
                      
                      return (
                        <div key={etapa.id} className={`p-4 border rounded-lg transition-all ${isAtivo ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Switch
                                  checked={isAtivo}
                                  onCheckedChange={(checked) => handleToggleEtapa(etapa, checked)}
                                  disabled={toggleEtapa.isPending}
                                />
                                <div>
                                  <h4 className="font-semibold">{etapa.nome}</h4>
                                  <p className="text-sm text-muted-foreground">{etapa.descricao}</p>
                                </div>
                                {isAtivo && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              </div>
                              
                              {isAtivo && (
                                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 bg-background/50 p-3 rounded">
                                  <div>
                                    <Label htmlFor={`duracao-${etapa.id}`} className="text-xs">
                                      Duração (dias)
                                    </Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Clock className="h-3 w-3 text-muted-foreground" />
                                      <Input
                                        id={`duracao-${etapa.id}`}
                                        type="number"
                                        value={duracaoAtual}
                                        onChange={(e) => {
                                          const valor = parseInt(e.target.value) || etapa.duracao_estimada_dias;
                                          setDuracoesPers(prev => ({ ...prev, [etapa.id]: valor }));
                                        }}
                                        className="h-8 text-xs"
                                        min="1"
                                      />
                                      <span className="text-xs text-muted-foreground">
                                        (padrão: {etapa.duracao_estimada_dias})
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div>
                                    <Label className="text-xs">Ordem de Execução</Label>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge variant="outline" className="text-xs">
                                        #{etapa.ordem_execucao}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Ações */}
          <Separator />
          <div className="flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Selecione as etapas que serão executadas nesta obra e personalize as durações conforme necessário.
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}