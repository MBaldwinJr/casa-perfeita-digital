import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface JuridicoStatsProps {
  estatisticas: {
    processosAtivos: number;
    documentosValidos: number;
    alertasAtivos: number;
    processosConcluidos: number;
    prazosVencidos: number;
    certificacoesOk: number;
  };
}

export default function JuridicoStats({ estatisticas }: JuridicoStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-primary">{estatisticas.processosAtivos}</div>
          <p className="text-xs text-muted-foreground">+2 esta semana</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{estatisticas.documentosValidos}%</div>
          <p className="text-xs text-muted-foreground">3 documentos vencidos</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">{estatisticas.alertasAtivos}</div>
          <p className="text-xs text-muted-foreground">2 urgentes</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-success">{estatisticas.processosConcluidos}</div>
          <p className="text-xs text-muted-foreground">este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prazos Vencidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-warning">{estatisticas.prazosVencidos}</div>
          <p className="text-xs text-muted-foreground">requer ação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Certificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-info">{estatisticas.certificacoesOk}%</div>
          <p className="text-xs text-muted-foreground">conformidade</p>
        </CardContent>
      </Card>
    </div>
  );
}