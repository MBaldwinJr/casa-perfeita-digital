import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, CalendarIcon, Clock } from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

import { AnaliseJuridica, ProcessoJuridico, DocumentoJuridico } from "@/hooks/useSupabaseQuery";

interface JuridicoCalendarProps {
  analises: AnaliseJuridica[];
  processos: ProcessoJuridico[];
  documentos: DocumentoJuridico[];
}

interface PrazoItem {
  id: string;
  titulo: string;
  data: Date;
  tipo: 'analise' | 'processo' | 'documento';
  prioridade?: string;
  status: string;
}

export default function JuridicoCalendar({ analises, processos, documentos }: JuridicoCalendarProps) {
  const [visaoAtual, setVisaoAtual] = useState<'hoje' | 'semana' | 'mes'>('semana');
  const [analiseSelected, setAnaliseSelected] = useState<AnaliseJuridica | null>(null);
  const [formData, setFormData] = useState({ status: '', resultado: '' });
  const { toast } = useToast();

  // Consolidar todos os prazos
  const prazos: PrazoItem[] = React.useMemo(() => {
    const prazosArray: PrazoItem[] = [];

    // Prazos das análises
    analises.forEach(analise => {
      if (analise.prazo_conclusao) {
        prazosArray.push({
          id: analise.id,
          titulo: `Análise: ${analise.tipo}`,
          data: parseISO(analise.prazo_conclusao),
          tipo: 'analise',
          prioridade: analise.prioridade,
          status: analise.status
        });
      }
    });

    // Prazos dos processos
    processos.forEach(processo => {
      if (processo.data_conclusao) {
        prazosArray.push({
          id: processo.id,
          titulo: `Processo: ${processo.tipo}`,
          data: parseISO(processo.data_conclusao),
          tipo: 'processo',
          status: processo.status
        });
      }
    });

    // Prazos dos documentos
    documentos.forEach(documento => {
      if (documento.data_vencimento) {
        prazosArray.push({
          id: documento.id,
          titulo: `Doc: ${documento.nome}`,
          data: parseISO(documento.data_vencimento),
          tipo: 'documento',
          status: documento.status
        });
      }
    });

    return prazosArray.sort((a, b) => a.data.getTime() - b.data.getTime());
  }, [analises, processos, documentos]);

  // Filtrar prazos baseado na visão atual
  const prazosFiltrados = React.useMemo(() => {
    const hoje = new Date();
    
    switch (visaoAtual) {
      case 'hoje':
        return prazos.filter(prazo => isToday(prazo.data));
      case 'semana':
        return prazos.filter(prazo => isThisWeek(prazo.data, { weekStartsOn: 1 }));
      case 'mes':
        const proximoMes = addDays(hoje, 30);
        return prazos.filter(prazo => prazo.data >= hoje && prazo.data <= proximoMes);
      default:
        return prazos;
    }
  }, [prazos, visaoAtual]);

  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'analise': return 'bg-primary';
      case 'processo': return 'bg-success';
      case 'documento': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getCorPorPrioridade = (prioridade?: string) => {
    switch (prioridade) {
      case 'urgente': return 'border-l-destructive';
      case 'alta': return 'border-l-warning';
      case 'media': return 'border-l-info';
      case 'baixa': return 'border-l-success';
      default: return 'border-l-muted';
    }
  };

  const getStatusPrazo = (data: Date) => {
    if (isToday(data)) return { texto: 'Hoje', cor: 'text-destructive' };
    if (isTomorrow(data)) return { texto: 'Amanhã', cor: 'text-warning' };
    if (data < new Date()) return { texto: 'Vencido', cor: 'text-destructive' };
    return { texto: format(data, 'dd/MM'), cor: 'text-muted-foreground' };
  };

  const handleClickAnalise = (prazoId: string, tipo: string) => {
    if (tipo === 'analise') {
      const analise = analises.find(a => a.id === prazoId);
      if (analise) {
        setAnaliseSelected(analise);
        setFormData({ status: analise.status, resultado: analise.resultado || '' });
      }
    }
  };

  const handleUpdateAnalise = async () => {
    if (!analiseSelected) return;

    try {
      const { error } = await supabase
        .from('analises_juridicas')
        .update({
          status: formData.status as any,
          resultado: formData.resultado
        })
        .eq('id', analiseSelected.id);

      if (error) throw error;

      toast({
        title: "Análise atualizada!",
        description: "Status e resultado foram salvos com sucesso.",
      });

      setAnaliseSelected(null);
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar análise",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Calendário de Prazos
          </div>
          <div className="flex gap-2">
            {(['hoje', 'semana', 'mes'] as const).map((visao) => (
              <button
                key={visao}
                onClick={() => setVisaoAtual(visao)}
                className={`px-3 py-1 text-sm rounded-md transition-colors ${
                  visaoAtual === visao 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {visao.charAt(0).toUpperCase() + visao.slice(1)}
              </button>
            ))}
          </div>
        </CardTitle>
        <CardDescription>
          Prazos e vencimentos importantes - {prazosFiltrados.length} itens
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {prazosFiltrados.length > 0 ? (
            prazosFiltrados.map((prazo) => {
              const statusPrazo = getStatusPrazo(prazo.data);
              return (
                <div 
                  key={prazo.id} 
                  className={`p-3 border-l-4 ${getCorPorPrioridade(prazo.prioridade)} bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors ${prazo.tipo === 'analise' ? 'cursor-pointer' : ''}`}
                  onClick={() => handleClickAnalise(prazo.id, prazo.tipo)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge className={`${getCorPorTipo(prazo.tipo)} text-white`}>
                        {prazo.tipo.charAt(0).toUpperCase() + prazo.tipo.slice(1)}
                      </Badge>
                      <span className="font-medium">{prazo.titulo}</span>
                      {prazo.prioridade && (
                        <Badge variant="outline" className="text-xs">
                          {prazo.prioridade}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className={`text-sm font-medium ${statusPrazo.cor}`}>
                        {statusPrazo.texto}
                      </span>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Status: {prazo.status} • {format(prazo.data, 'dd/MM/yyyy')}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Nenhum prazo encontrado para o período selecionado</p>
            </div>
          )}
        </div>
      </CardContent>

      {/* Modal de Análise */}
      <Dialog open={!!analiseSelected} onOpenChange={() => setAnaliseSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Dar Seguimento à Análise</DialogTitle>
          </DialogHeader>
          {analiseSelected && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Tipo de Análise</Label>
                  <p className="text-sm text-muted-foreground">{analiseSelected.tipo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Prioridade</Label>
                  <Badge variant="outline">{analiseSelected.prioridade}</Badge>
                </div>
                <div>
                  <Label className="font-semibold">Responsável</Label>
                  <p className="text-sm text-muted-foreground">{analiseSelected.responsavel}</p>
                </div>
                <div>
                  <Label className="font-semibold">Prazo</Label>
                  <p className="text-sm text-muted-foreground">
                    {analiseSelected.prazo_conclusao ? format(parseISO(analiseSelected.prazo_conclusao), 'dd/MM/yyyy') : 'N/A'}
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluida">Concluída</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="resultado">Resultado/Observações</Label>
                <Textarea 
                  id="resultado" 
                  placeholder="Descreva o resultado da análise ou observações..."
                  value={formData.resultado}
                  onChange={(e) => setFormData(prev => ({ ...prev, resultado: e.target.value }))}
                  rows={4}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button onClick={handleUpdateAnalise} className="flex-1">
                  Salvar Alterações
                </Button>
                <Button variant="outline" onClick={() => setAnaliseSelected(null)}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}