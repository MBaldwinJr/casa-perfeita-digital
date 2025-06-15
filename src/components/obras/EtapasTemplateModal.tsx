import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calendar, Settings, Play, Plus, CheckCircle2 } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { 
  useTemplateEtapas, 
  useObraEtapasSelecionadas, 
  useToggleEtapaObra,
  useGerarCronogramaTemplate 
} from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";

type TemplateEtapa = Tables<'template_etapas_obras'>;

interface EtapasTemplateModalProps {
  obraId: string;
  obraNome: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCronogramaGerado: () => void;
}

export function EtapasTemplateModal({ 
  obraId, 
  obraNome, 
  open, 
  onOpenChange,
  onCronogramaGerado 
}: EtapasTemplateModalProps) {
  const { toast } = useToast();
  const [dataInicio, setDataInicio] = useState(new Date().toISOString().split('T')[0]);
  
  const { data: templates = [] } = useTemplateEtapas();
  const { data: etapasSelecionadas = [] } = useObraEtapasSelecionadas(obraId);
  const toggleEtapa = useToggleEtapaObra();
  const gerarCronograma = useGerarCronogramaTemplate();

  const etapasAtivasIds = new Set(etapasSelecionadas.map(e => e.template_etapa_id));

  const handleToggleEtapa = async (template: TemplateEtapa, ativo: boolean) => {
    await toggleEtapa.mutateAsync({
      obraId,
      templateEtapaId: template.id,
      ativo,
      ordemPersonalizada: template.ordem_execucao
    });
  };

  const handleGerarCronograma = async () => {
    if (!dataInicio) {
      toast({
        title: "Erro",
        description: "Selecione a data de início da obra.",
        variant: "destructive",
      });
      return;
    }

    if (etapasSelecionadas.length === 0) {
      toast({
        title: "Erro", 
        description: "Selecione pelo menos uma etapa para gerar o cronograma.",
        variant: "destructive",
      });
      return;
    }

    try {
      await gerarCronograma.mutateAsync({
        obraId,
        dataInicio
      });
      
      onCronogramaGerado();
      onOpenChange(false);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const categorias = {
    'planejamento': { label: 'Planejamento', color: 'bg-blue-100 text-blue-700' },
    'preparacao': { label: 'Preparação', color: 'bg-orange-100 text-orange-700' },
    'estrutural': { label: 'Estrutural', color: 'bg-red-100 text-red-700' },
    'cobertura': { label: 'Cobertura', color: 'bg-purple-100 text-purple-700' },
    'instalacoes': { label: 'Instalações', color: 'bg-yellow-100 text-yellow-700' },
    'acabamento': { label: 'Acabamento', color: 'bg-green-100 text-green-700' },
    'finalizacao': { label: 'Finalização', color: 'bg-gray-100 text-gray-700' }
  };

  const templatesPorCategoria = templates.reduce((acc, template) => {
    const cat = template.categoria;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(template);
    return acc;
  }, {} as Record<string, TemplateEtapa[]>);

  const totalDias = etapasSelecionadas.reduce((total, etapa) => {
    const template = templates.find(t => t.id === etapa.template_etapa_id);
    return total + (etapa.duracao_personalizada_dias || template?.duracao_estimada_dias || 0);
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurar Etapas - {obraNome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo e Ações */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Resumo das Etapas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{etapasSelecionadas.length}</div>
                  <p className="text-sm text-muted-foreground">Etapas Selecionadas</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{totalDias}</div>
                  <p className="text-sm text-muted-foreground">Dias Estimados</p>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {totalDias > 0 ? Math.ceil(totalDias / 30) : 0}
                  </div>
                  <p className="text-sm text-muted-foreground">Meses Estimados</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="data-inicio">Data de Início da Obra</Label>
                  <Input
                    id="data-inicio"
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <Button 
                  onClick={handleGerarCronograma}
                  disabled={gerarCronograma.isPending || etapasSelecionadas.length === 0}
                  className="mt-6"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {gerarCronograma.isPending ? 'Gerando...' : 'Gerar Cronograma'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Lista de Etapas por Categoria */}
          <div className="space-y-6">
            {Object.entries(templatesPorCategoria).map(([categoria, etapas]) => (
              <Card key={categoria}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge className={categorias[categoria]?.color || 'bg-gray-100'}>
                      {categorias[categoria]?.label || categoria}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      ({etapas.length} etapas)
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {etapas.map((template) => {
                      const isAtiva = etapasAtivasIds.has(template.id);
                      
                      return (
                        <div 
                          key={template.id} 
                          className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            isAtiva ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3">
                              <Switch
                                checked={isAtiva}
                                onCheckedChange={(checked) => handleToggleEtapa(template, checked)}
                                disabled={toggleEtapa.isPending}
                              />
                              <div>
                                <h4 className="font-medium">{template.nome}</h4>
                                {template.descricao && (
                                  <p className="text-sm text-muted-foreground">
                                    {template.descricao}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="text-center">
                              <div className="font-medium">{template.duracao_estimada_dias}</div>
                              <div className="text-xs">dias</div>
                            </div>
                            <div className="text-center">
                              <div className="font-medium">#{template.ordem_execucao}</div>
                              <div className="text-xs">ordem</div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ações do Modal */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}