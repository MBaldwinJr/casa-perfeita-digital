import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, BarChart3, Eye } from "lucide-react";
import { AlertaJuridico, AnaliseJuridica, ProcessoJuridico, DocumentoJuridico } from "@/hooks/useSupabaseQuery";
import JuridicoStats from "./JuridicoStats";
import JuridicoChart from "./JuridicoChart";

interface JuridicoOverviewProps {
  alertas: AlertaJuridico[];
  analises: AnaliseJuridica[];
  processos: ProcessoJuridico[];
  documentos: DocumentoJuridico[];
  onVerAlerta: (alerta: AlertaJuridico) => void;
}

export default function JuridicoOverview({ 
  alertas, 
  analises, 
  processos, 
  documentos, 
  onVerAlerta 
}: JuridicoOverviewProps) {
  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'bg-red-500';
      case 'atencao': return 'bg-yellow-500';
      case 'info': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  // Calcular estatísticas
  const estatisticas = {
    processosAtivos: processos.filter(p => p.status === 'ativo').length,
    documentosValidos: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0,
    alertasAtivos: alertas.length,
    processosConcluidos: processos.filter(p => p.status === 'finalizado').length,
    prazosVencidos: documentos.filter(d => d.data_vencimento && new Date(d.data_vencimento) < new Date()).length,
    certificacoesOk: documentos.length > 0 ? Math.round((documentos.filter(d => d.status === 'valido').length / documentos.length) * 100) : 0
  };

  return (
    <div className="space-y-6">
      <JuridicoStats estatisticas={estatisticas} />

      {/* Alertas Jurídicos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Alertas Jurídicos
          </CardTitle>
          <CardDescription>Pendências que requerem atenção imediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertas.length > 0 ? (
              alertas.map((alerta) => (
                <div key={alerta.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Badge className={`${getCorPorTipo(alerta.tipo)} text-white`}>
                    {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
                  </Badge>
                  <span className="flex-1">{alerta.mensagem}</span>
                  <Button size="sm" variant="outline" onClick={() => onVerAlerta(alerta)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">Nenhum alerta ativo no momento</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboard de Produtividade */}
      <JuridicoChart 
        analises={analises}
        processos={processos}
        documentos={documentos}
      />
    </div>
  );
}