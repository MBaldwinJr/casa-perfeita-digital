import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon, Clock, AlertTriangle } from "lucide-react";
import { AnaliseJuridica, ProcessoJuridico, DocumentoJuridico } from "@/hooks/useSupabaseQuery";
import { cn } from "@/lib/utils";

interface JuridicoCalendarProps {
  analises: AnaliseJuridica[];
  processos: ProcessoJuridico[];
  documentos: DocumentoJuridico[];
}

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: 'analise' | 'processo' | 'documento';
  priority: 'baixa' | 'media' | 'alta' | 'urgente';
  description: string;
}

export default function JuridicoCalendar({ analises, processos, documentos }: JuridicoCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Converter dados para eventos do calendário
  const events: CalendarEvent[] = [
    ...analises
      .filter(a => a.prazo_conclusao)
      .map(a => ({
        id: a.id,
        title: `Análise: ${a.tipo}`,
        date: new Date(a.prazo_conclusao!),
        type: 'analise' as const,
        priority: a.prioridade,
        description: a.observacoes || 'Sem descrição'
      })),
    ...processos
      .filter(p => p.data_conclusao)
      .map(p => ({
        id: p.id,
        title: `Processo: ${p.tipo}`,
        date: new Date(p.data_conclusao!),
        type: 'processo' as const,
        priority: 'media' as const,
        description: p.descricao || 'Sem descrição'
      })),
    ...documentos
      .filter(d => d.data_vencimento)
      .map(d => ({
        id: d.id,
        title: `Doc: ${d.nome}`,
        date: new Date(d.data_vencimento!),
        type: 'documento' as const,
        priority: (new Date(d.data_vencimento!) < new Date() ? 'urgente' : 'baixa') as 'baixa' | 'media' | 'alta' | 'urgente',
        description: d.observacoes || 'Documento jurídico'
      }))
  ];

  // Eventos do dia selecionado
  const selectedDateEvents = selectedDate 
    ? events.filter(event => 
        event.date.toDateString() === selectedDate.toDateString()
      )
    : [];

  // Próximos eventos (7 dias)
  const upcomingEvents = events
    .filter(event => {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      return event.date >= today && event.date <= nextWeek;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime())
    .slice(0, 5);

  // Datas com eventos
  const datesWithEvents = events.map(event => event.date);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgente': return 'bg-red-500';
      case 'alta': return 'bg-orange-500';
      case 'media': return 'bg-yellow-500';
      case 'baixa': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'analise': return '📋';
      case 'processo': return '⚖️';
      case 'documento': return '📄';
      default: return '📅';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Calendário */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Calendário de Prazos
              </CardTitle>
              <CardDescription>Visualização de todos os prazos jurídicos</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('calendar')}
              >
                Calendário
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                Lista
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'calendar' ? (
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className={cn("w-full pointer-events-auto")}
              modifiers={{
                hasEvent: datesWithEvents
              }}
              modifiersStyles={{
                hasEvent: { 
                  backgroundColor: 'hsl(var(--primary))', 
                  color: 'white',
                  fontWeight: 'bold'
                }
              }}
            />
          ) : (
            <div className="space-y-3">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <span className="text-2xl">{getTypeIcon(event.type)}</span>
                  <div className="flex-1">
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-sm text-muted-foreground">{event.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date.toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Badge className={`${getPriorityColor(event.priority)} text-white`}>
                    {event.priority}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eventos do dia / Próximos eventos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            {selectedDate ? 'Eventos do Dia' : 'Próximos Eventos'}
          </CardTitle>
          <CardDescription>
            {selectedDate 
              ? selectedDate.toLocaleDateString('pt-BR')
              : 'Próximos 7 dias'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(selectedDate ? selectedDateEvents : upcomingEvents).length > 0 ? (
              (selectedDate ? selectedDateEvents : upcomingEvents).map((event) => (
                <div key={event.id} className="space-y-2 p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{event.title}</span>
                    <Badge 
                      variant="outline" 
                      className={`${getPriorityColor(event.priority)} text-white border-transparent`}
                    >
                      {event.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{event.description}</p>
                  {!selectedDate && (
                    <p className="text-xs text-muted-foreground">
                      📅 {event.date.toLocaleDateString('pt-BR')}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  {selectedDate ? 'Nenhum evento neste dia' : 'Nenhum evento próximo'}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}