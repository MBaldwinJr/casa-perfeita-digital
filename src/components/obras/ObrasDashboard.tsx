import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { Calendar, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { Badge } from "@/components/ui/badge";
import { format, addDays, eachDayOfInterval, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Obra = Tables<'obras'>;
type CronogramaObra = Tables<'cronograma_obras'>;

interface ObrasDashboardProps {
  obras: Obra[];
  cronogramas: CronogramaObra[];
}

export function ObrasDashboard({ obras, cronogramas }: ObrasDashboardProps) {
  // Prepare cost data
  const costData = obras.map(obra => ({
    nome: obra.nome.length > 20 ? obra.nome.substring(0, 20) + '...' : obra.nome,
    orcamento: Number(obra.valor_orcamento || 0),
    gasto: Number(obra.valor_gasto || 0),
    percentual: obra.progresso_percentual || 0
  }));

  // Prepare status distribution
  const statusDistribution = obras.reduce((acc, obra) => {
    const status = obra.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusData = Object.entries(statusDistribution).map(([status, count]) => ({
    name: getStatusLabel(status),
    value: count,
    color: getStatusColor(status)
  }));

  // Prepare timeline data for Gantt chart
  const timelineData = React.useMemo(() => {
    const startDate = new Date();
    const endDate = addDays(startDate, 365); // Next year
    const dates = eachDayOfInterval({ start: startDate, end: endDate });
    
    return dates.slice(0, 50).map(date => {
      const dayData: any = {
        date: format(date, 'dd/MM', { locale: ptBR }),
        fullDate: date
      };
      
      cronogramas.forEach((cronograma, index) => {
        const startDate = new Date(cronograma.data_inicio_prevista);
        const endDate = new Date(cronograma.data_fim_prevista);
        
        if (isWithinInterval(date, { start: startDate, end: endDate })) {
          dayData[`etapa_${index}`] = 1;
        }
      });
      
      return dayData;
    });
  }, [cronogramas]);

  // Progress over time data
  const progressData = obras.map(obra => ({
    nome: obra.nome.length > 15 ? obra.nome.substring(0, 15) + '...' : obra.nome,
    progresso: obra.progresso_percentual || 0,
    prazo: obra.data_previsao_fim ? new Date(obra.data_previsao_fim) > new Date() ? 'No Prazo' : 'Atrasado' : 'Sem Prazo'
  }));

  // Budget efficiency data
  const budgetEfficiency = obras
    .filter(obra => obra.valor_orcamento && obra.valor_orcamento > 0)
    .map(obra => ({
      nome: obra.nome.length > 15 ? obra.nome.substring(0, 15) + '...' : obra.nome,
      eficiencia: obra.progresso_percentual && obra.valor_orcamento && obra.valor_gasto 
        ? Math.round((obra.progresso_percentual / ((Number(obra.valor_gasto) / Number(obra.valor_orcamento)) * 100)) * 100) / 100
        : 0
    }));

  function getStatusColor(status: string) {
    const colors: Record<string, string> = {
      'planejamento': '#6b7280',
      'fundacao': '#eab308',
      'estrutura': '#f97316',
      'alvenaria': '#3b82f6',
      'cobertura': '#8b5cf6',
      'instalacoes': '#6366f1',
      'acabamento': '#10b981',
      'concluida': '#059669',
      'pausada': '#ef4444'
    };
    return colors[status] || '#6b7280';
  }

  function getStatusLabel(status: string) {
    const labels: Record<string, string> = {
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
    return labels[status] || status;
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Obras</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obras.length}</div>
            <p className="text-xs text-muted-foreground">
              {obras.filter(o => o.status !== 'concluida').length} ativas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                notation: 'compact'
              }).format(obras.reduce((sum, obra) => sum + Number(obra.valor_orcamento || 0), 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              Orçamentos totais
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {obras.length > 0 
                ? Math.round(obras.reduce((sum, obra) => sum + (obra.progresso_percentual || 0), 0) / obras.length)
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Todas as obras
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {obras.filter(obra => {
                if (!obra.data_previsao_fim) return true;
                return new Date(obra.data_previsao_fim) > new Date();
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              De {obras.length} obras
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Tabs */}
      <Tabs defaultValue="custos" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="custos">Custos</TabsTrigger>
          <TabsTrigger value="progresso">Progresso</TabsTrigger>
          <TabsTrigger value="cronograma">Cronograma</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="custos" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orçamento vs Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={costData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="nome" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis 
                      tickFormatter={(value) => 
                        new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL',
                          notation: 'compact'
                        }).format(value)
                      }
                    />
                    <Tooltip 
                      formatter={(value: any) => 
                        new Intl.NumberFormat('pt-BR', { 
                          style: 'currency', 
                          currency: 'BRL'
                        }).format(value)
                      }
                    />
                    <Bar dataKey="orcamento" fill="#3b82f6" name="Orçamento" />
                    <Bar dataKey="gasto" fill="#ef4444" name="Gasto" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Eficiência do Orçamento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={budgetEfficiency}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="nome" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="eficiencia" 
                      stroke="#10b981" 
                      strokeWidth={2}
                      name="Eficiência (%)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progresso" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Progresso das Obras</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="nome" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="progresso" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.3}
                    name="Progresso (%)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cronograma" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Timeline de Etapas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cronogramas.slice(0, 10).map((cronograma, index) => (
                  <div key={cronograma.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{cronograma.etapa}</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(cronograma.data_inicio_prevista), 'dd/MM/yyyy', { locale: ptBR })} - {' '}
                        {format(new Date(cronograma.data_fim_prevista), 'dd/MM/yyyy', { locale: ptBR })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="outline" 
                        className={
                          cronograma.status === 'concluida' ? 'text-green-600 border-green-600' :
                          cronograma.status === 'em_andamento' ? 'text-blue-600 border-blue-600' :
                          cronograma.status === 'atrasada' ? 'text-red-600 border-red-600' :
                          'text-gray-600 border-gray-600'
                        }
                      >
                        {cronograma.status === 'concluida' ? 'Concluída' :
                         cronograma.status === 'em_andamento' ? 'Em Andamento' :
                         cronograma.status === 'atrasada' ? 'Atrasada' : 'Pendente'}
                      </Badge>
                      {cronograma.status === 'concluida' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {cronograma.status === 'atrasada' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      {cronograma.status === 'em_andamento' && <Clock className="h-4 w-4 text-blue-500" />}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Detalhado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusData.map((status, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: status.color }}
                        />
                        <span className="text-sm font-medium">{status.name}</span>
                      </div>
                      <Badge variant="outline">{status.value}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}