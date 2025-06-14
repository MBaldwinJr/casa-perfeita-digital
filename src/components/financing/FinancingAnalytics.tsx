import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target,
  Calendar,
  PieChart,
  FileText
} from "lucide-react";

interface AnalyticsData {
  conversaoSimulacao: number;
  conversaoProposta: number;
  conversaoAprovacao: number;
  ticketMedio: number;
  volumeTotal: number;
  bancoMaisAprovado: string;
  tempoMedioAprovacao: number;
}

export default function FinancingAnalytics() {
  const [periodo, setPeriodo] = useState('30d');
  
  const analytics: AnalyticsData = {
    conversaoSimulacao: 68,
    conversaoProposta: 45,
    conversaoAprovacao: 78,
    ticketMedio: 380000,
    volumeTotal: 15200000,
    bancoMaisAprovado: 'Itaú',
    tempoMedioAprovacao: 12
  };

  const bancoStats = [
    { banco: 'Itaú', propostas: 25, aprovadas: 22, taxa: 88, volume: 5200000 },
    { banco: 'Caixa', propostas: 30, aprovadas: 24, taxa: 80, volume: 4800000 },
    { banco: 'Banco do Brasil', propostas: 20, aprovadas: 15, taxa: 75, volume: 3200000 },
    { banco: 'Bradesco', propostas: 18, aprovadas: 14, taxa: 78, volume: 2200000 },
  ];

  const tendenciaMensal = [
    { mes: 'Jan', simulacoes: 120, propostas: 82, aprovadas: 64 },
    { mes: 'Fev', simulacoes: 135, propostas: 91, aprovadas: 71 },
    { mes: 'Mar', simulacoes: 148, propostas: 98, aprovadas: 76 },
    { mes: 'Abr', simulacoes: 162, propostas: 109, aprovadas: 85 },
    { mes: 'Mai', simulacoes: 155, propostas: 105, aprovadas: 82 },
    { mes: 'Jun', simulacoes: 168, propostas: 114, aprovadas: 89 },
  ];

  const kpis = [
    {
      title: 'Taxa de Conversão',
      value: `${analytics.conversaoSimulacao}%`,
      subtitle: 'Simulação → Proposta',
      icon: Target,
      trend: 'up',
      change: '+5.2%'
    },
    {
      title: 'Taxa de Aprovação',
      value: `${analytics.conversaoAprovacao}%`,
      subtitle: 'Proposta → Aprovação',
      icon: TrendingUp,
      trend: 'up',
      change: '+2.1%'
    },
    {
      title: 'Ticket Médio',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact'
      }).format(analytics.ticketMedio),
      subtitle: 'Por financiamento',
      icon: DollarSign,
      trend: 'up',
      change: '+8.3%'
    },
    {
      title: 'Volume Total',
      value: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact'
      }).format(analytics.volumeTotal),
      subtitle: 'Últimos 30 dias',
      icon: BarChart3,
      trend: 'down',
      change: '-1.5%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Analytics & Relatórios</h3>
          <p className="text-muted-foreground">Métricas de performance e insights</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map((p) => (
            <Badge
              key={p}
              variant={periodo === p ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setPeriodo(p)}
            >
              {p}
            </Badge>
          ))}
        </div>
      </div>

      {/* KPIs Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className={`flex items-center text-xs ${
                    kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {kpi.trend === 'up' ? (
                      <TrendingUp className="h-3 w-3 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 mr-1" />
                    )}
                    {kpi.change}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.subtitle}</p>
                <CardTitle className="text-sm font-medium mt-2">{kpi.title}</CardTitle>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="conversao" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="conversao">Conversão</TabsTrigger>
          <TabsTrigger value="bancos">Por Banco</TabsTrigger>
          <TabsTrigger value="tendencias">Tendências</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="conversao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Acompanhe a jornada do cliente do interesse à aprovação</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Simulações Realizadas</h4>
                      <p className="text-sm text-muted-foreground">168 simulações no período</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">100%</div>
                    </div>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Propostas Enviadas</h4>
                      <p className="text-sm text-muted-foreground">114 propostas enviadas</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">68%</div>
                      <div className="text-xs text-muted-foreground">+5.2% vs mês anterior</div>
                    </div>
                  </div>
                  <Progress value={68} className="h-3" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Financiamentos Aprovados</h4>
                      <p className="text-sm text-muted-foreground">89 aprovações confirmadas</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">53%</div>
                      <div className="text-xs text-muted-foreground">+2.1% vs mês anterior</div>
                    </div>
                  </div>
                  <Progress value={53} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bancos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance por Banco</CardTitle>
              <CardDescription>Compare a performance de cada instituição financeira</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bancoStats.map((banco, index) => (
                  <div key={banco.banco} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{banco.banco}</h4>
                        <p className="text-sm text-muted-foreground">
                          {banco.propostas} propostas • {banco.aprovadas} aprovadas
                        </p>
                      </div>
                      <Badge variant={banco.taxa > 80 ? "default" : "secondary"}>
                        {banco.taxa}% aprovação
                      </Badge>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Taxa de Aprovação</div>
                        <Progress value={banco.taxa} className="h-2" />
                        <div className="text-sm font-medium mt-1">{banco.taxa}%</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Volume Financiado</div>
                        <div className="text-sm font-medium">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                            notation: 'compact'
                          }).format(banco.volume)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">ROI</div>
                        <div className="text-sm font-medium text-green-600">
                          {((banco.volume * 0.02) / banco.propostas).toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tendencias" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
              <CardDescription>Acompanhe o crescimento mês a mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tendenciaMensal.map((mes) => (
                  <div key={mes.mes} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{mes.mes}/2024</h4>
                      <div className="flex space-x-4 text-sm">
                        <span className="text-blue-600">Simulações: {mes.simulacoes}</span>
                        <span className="text-yellow-600">Propostas: {mes.propostas}</span>
                        <span className="text-green-600">Aprovadas: {mes.aprovadas}</span>
                      </div>
                    </div>
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <Progress value={(mes.simulacoes / 200) * 100} className="h-2 bg-blue-100" />
                      </div>
                      <div>
                        <Progress value={(mes.propostas / 200) * 100} className="h-2 bg-yellow-100" />
                      </div>
                      <div>
                        <Progress value={(mes.aprovadas / 200) * 100} className="h-2 bg-green-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2" />
                  Insights Automáticos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h4 className="font-semibold text-green-700">Oportunidade</h4>
                  <p className="text-sm text-muted-foreground">
                    O Itaú tem a maior taxa de aprovação (88%). Considere direcioná-lo como primeira opção.
                  </p>
                </div>
                <div className="border-l-4 border-blue-500 pl-4">
                  <h4 className="font-semibold text-blue-700">Crescimento</h4>
                  <p className="text-sm text-muted-foreground">
                    Suas conversões aumentaram 15% nos últimos 3 meses. Continue o bom trabalho!
                  </p>
                </div>
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h4 className="font-semibold text-yellow-700">Atenção</h4>
                  <p className="text-sm text-muted-foreground">
                    O tempo médio de aprovação está 2 dias acima da meta. Revise os processos.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Metas vs Realizados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Volume Mensal</span>
                    <span>R$ 15,2M / R$ 18M</span>
                  </div>
                  <Progress value={84} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">84% da meta alcançada</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conversão Simulação→Proposta</span>
                    <span>68% / 70%</span>
                  </div>
                  <Progress value={97} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">97% da meta alcançada</p>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Taxa de Aprovação</span>
                    <span>78% / 75%</span>
                  </div>
                  <Progress value={104} className="h-2 bg-green-100" />
                  <p className="text-xs text-green-600 mt-1">Meta superada em 4%!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}