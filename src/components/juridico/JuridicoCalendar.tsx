import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarIcon, Clock } from "lucide-react";
import { format, parseISO, isToday, isTomorrow, isThisWeek, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
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
    return { texto: format(data, 'dd/MM', { locale: ptBR }), cor: 'text-muted-foreground' };
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
                  className={`p-3 border-l-4 ${getCorPorPrioridade(prazo.prioridade)} bg-muted/30 rounded-r-lg hover:bg-muted/50 transition-colors`}
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
                    Status: {prazo.status} • {format(prazo.data, 'dd/MM/yyyy - EEEE', { locale: ptBR })}
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
    </Card>
  );
}