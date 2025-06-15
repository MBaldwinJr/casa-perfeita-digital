import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProcessoJuridico, DocumentoJuridico, AlertaJuridico } from "@/hooks/useSupabaseQuery";

interface JuridicoStatsProps {
  processos: ProcessoJuridico[];
  documentos: DocumentoJuridico[];
  alertas: AlertaJuridico[];
}

export default function JuridicoStats({ processos, documentos, alertas }: JuridicoStatsProps) {
  const estatisticas = {
    processosAtivos: processos.filter(p => p.status === 'ativo').length,
    documentosValidos: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0,
    alertasAtivos: alertas.length,
    processosConcluidos: processos.filter(p => p.status === 'finalizado').length,
    prazosVencidos: documentos.filter(d => d.data_vencimento && new Date(d.data_vencimento) < new Date()).length,
    certificacoesOk: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0
  };

  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.processosAtivos}</div>
          <p className="text-xs text-muted-foreground">em andamento</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estatisticas.documentosValidos}%</div>
          <p className="text-xs text-muted-foreground">conformidade</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{estatisticas.alertasAtivos}</div>
          <p className="text-xs text-muted-foreground">requer ação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{estatisticas.processosConcluidos}</div>
          <p className="text-xs text-muted-foreground">este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Prazos Vencidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{estatisticas.prazosVencidos}</div>
          <p className="text-xs text-muted-foreground">necessário ação</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Certificações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{estatisticas.certificacoesOk}%</div>
          <p className="text-xs text-muted-foreground">válidas</p>
        </CardContent>
      </Card>
    </div>
  );
}