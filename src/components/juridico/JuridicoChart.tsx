import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Line, LineChart } from 'recharts';
import { AnaliseJuridica, ProcessoJuridico, DocumentoJuridico } from "@/hooks/useSupabaseQuery";

interface JuridicoChartProps {
  analises: AnaliseJuridica[];
  processos: ProcessoJuridico[];
  documentos: DocumentoJuridico[];
}

export default function JuridicoChart({ analises, processos, documentos }: JuridicoChartProps) {
  // Dados para gráfico de barras - análises por tipo
  const analisesData = [
    { tipo: 'Documentos', count: analises.filter(a => a.tipo === 'documentos').length },
    { tipo: 'Viabilidade', count: analises.filter(a => a.tipo === 'viabilidade').length },
    { tipo: 'Riscos', count: analises.filter(a => a.tipo === 'riscos').length },
    { tipo: 'Due Diligence', count: analises.filter(a => a.tipo === 'due_diligence').length },
  ];

  // Dados para gráfico de linha - processos por mês
  const processosData = [
    { mes: 'Jan', ativos: 12, finalizados: 8 },
    { mes: 'Fev', ativos: 15, finalizados: 10 },
    { mes: 'Mar', ativos: 18, finalizados: 14 },
    { mes: 'Abr', ativos: 22, finalizados: 16 },
    { mes: 'Mai', ativos: 20, finalizados: 18 },
    { mes: 'Jun', ativos: processos.filter(p => p.status === 'ativo').length, finalizados: processos.filter(p => p.status === 'finalizado').length },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="h-5 w-5 mr-2" />
          Dashboard de Produtividade
        </CardTitle>
        <CardDescription>Análise de performance do setor jurídico</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico de Análises por Tipo */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Análises por Tipo</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analisesData}>
                <XAxis dataKey="tipo" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de Processos por Mês */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Processos por Mês</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={processosData}>
                <XAxis dataKey="mes" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="ativos" stroke="hsl(var(--primary))" strokeWidth={2} />
                <Line type="monotone" dataKey="finalizados" stroke="hsl(var(--secondary))" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Estatísticas de Performance */}
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          <div className="space-y-4">
            <div className="border-l-4 border-green-500 pl-4">
              <h4 className="font-semibold text-green-700">Processos Finalizados</h4>
              <p className="text-2xl font-bold text-green-600">{processos.filter(p => p.status === 'finalizado').length}</p>
              <p className="text-sm text-muted-foreground">total acumulado</p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-blue-700">Tempo Médio de Processo</h4>
              <p className="text-2xl font-bold text-blue-600">45 dias</p>
              <p className="text-sm text-muted-foreground">média estimada</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-yellow-700">Documentos Processados</h4>
              <p className="text-2xl font-bold text-yellow-600">{documentos.length}</p>
              <p className="text-sm text-muted-foreground">total no sistema</p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h4 className="font-semibold text-purple-700">Taxa de Aprovação</h4>
              <p className="text-2xl font-bold text-purple-600">94%</p>
              <p className="text-sm text-muted-foreground">documentos válidos</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}