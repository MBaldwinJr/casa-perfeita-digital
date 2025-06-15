import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, FileText, Camera, MapPin, User, DollarSign, Clock, Files } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { FileManagerModal } from "./FileManagerModal";

type Obra = Tables<'obras'>;
type CronogramaObra = Tables<'cronograma_obras'>;
type LicencaObra = Tables<'licencas_obras'>;
type FotoObra = Tables<'fotos_obras'>;

interface ObraDetailsModalProps {
  obra: Obra | null;
  cronogramas: CronogramaObra[];
  licencas: LicencaObra[];
  fotos: FotoObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenCronograma: () => void;
  onOpenLicencas: () => void;
  onOpenFotos: () => void;
}

export function ObraDetailsModal({ 
  obra, 
  cronogramas, 
  licencas, 
  fotos, 
  open, 
  onOpenChange,
  onOpenCronograma,
  onOpenLicencas,
  onOpenFotos 
}: ObraDetailsModalProps) {
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  
  if (!obra) return null;

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'planejamento': 'bg-gray-500',
      'fundacao': 'bg-yellow-500',
      'estrutura': 'bg-orange-500',
      'alvenaria': 'bg-blue-500',
      'cobertura': 'bg-purple-500',
      'instalacoes': 'bg-indigo-500',
      'acabamento': 'bg-green-500',
      'concluida': 'bg-emerald-500',
      'pausada': 'bg-red-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'planejamento': 'Planejamento',
      'fundacao': 'Fundação',
      'estrutura': 'Estrutura',
      'alvenaria': 'Alvenaria',
      'cobertura': 'Cobertura',
      'instalacoes': 'Instalações',
      'acabamento': 'Acabamento',
      'concluida': 'Concluída',
      'pausada': 'Pausada'
    };
    return statusMap[status] || status;
  };

  const etapasAndamento = cronogramas.filter(c => c.status === 'em_andamento').length;
  const etapasConcluidas = cronogramas.filter(c => c.status === 'concluida').length;
  const licencasAprovadas = licencas.filter(l => l.status === 'aprovada').length;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              {obra.nome}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Informações Gerais */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Endereço:</span>
                    <span className="text-sm">{obra.endereco}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(obra.status)} text-white`}>
                      {getStatusLabel(obra.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Início:</span>
                    <span className="text-sm">{new Date(obra.data_inicio).toLocaleDateString('pt-BR')}</span>
                  </div>
                  
                  {obra.data_previsao_fim && (
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Previsão:</span>
                      <span className="text-sm">{new Date(obra.data_previsao_fim).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                  
                  {obra.responsavel_tecnico && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Responsável:</span>
                      <span className="text-sm">{obra.responsavel_tecnico}</span>
                    </div>
                  )}
                  
                  {obra.valor_orcamento && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Orçamento:</span>
                      <span className="text-sm">
                        {new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL' 
                        }).format(Number(obra.valor_orcamento))}
                      </span>
                    </div>
                  )}
                </div>
                
                {obra.descricao && (
                  <div>
                    <span className="text-sm font-medium">Descrição:</span>
                    <p className="text-sm text-muted-foreground mt-1">{obra.descricao}</p>
                  </div>
                )}
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span>{obra.progresso_percentual}%</span>
                  </div>
                  <Progress value={obra.progresso_percentual} className="h-3" />
                </div>
              </CardContent>
            </Card>

            {/* Resumo de Atividades */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">{etapasAndamento}</div>
                  <p className="text-xs text-muted-foreground">Etapas em Andamento</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">{etapasConcluidas}</div>
                  <p className="text-xs text-muted-foreground">Etapas Concluídas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">{licencasAprovadas}</div>
                  <p className="text-xs text-muted-foreground">Licenças Aprovadas</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">{fotos.length}</div>
                  <p className="text-xs text-muted-foreground">Fotos Registradas</p>
                </CardContent>
              </Card>
            </div>

            {/* Ações Rápidas */}
            <div className="flex flex-wrap gap-3">
              <Button onClick={onOpenCronograma} className="flex-1 min-w-40">
                <Calendar className="h-4 w-4 mr-2" />
                Gerenciar Cronograma
              </Button>
              
              <Button onClick={() => setFileManagerOpen(true)} variant="outline" className="flex-1 min-w-40">
                <Files className="h-4 w-4 mr-2" />
                Gerenciar Arquivos
              </Button>
              
              <Button onClick={onOpenFotos} variant="outline" className="flex-1 min-w-40">
                <Camera className="h-4 w-4 mr-2" />
                Visualizar Fotos
              </Button>
              
              <Button onClick={onOpenLicencas} variant="outline" className="flex-1 min-w-40">
                <FileText className="h-4 w-4 mr-2" />
                Gerenciar Licenças
              </Button>
            </div>

            {/* Preview do Cronograma */}
            {cronogramas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Próximas Etapas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cronogramas
                      .filter(c => c.status !== 'concluida')
                      .slice(0, 3)
                      .map((etapa) => (
                        <div key={etapa.id} className="flex items-center justify-between p-2 border rounded">
                          <span className="text-sm font-medium">{etapa.etapa}</span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(etapa.data_inicio_prevista).toLocaleDateString('pt-BR')}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <FileManagerModal
        obra={obra}
        open={fileManagerOpen}
        onOpenChange={setFileManagerOpen}
      />
    </>
  );
}