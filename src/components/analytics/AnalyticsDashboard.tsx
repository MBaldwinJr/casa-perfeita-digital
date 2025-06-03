
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, DollarSign, Users, Building2, Target, Calendar, AlertCircle } from "lucide-react";

export function AnalyticsDashboard() {
  const metricas = [
    {
      titulo: "Vendas Este Mês",
      valor: "R$ 2.4M",
      variacao: "+18%",
      tipo: "aumento",
      icon: DollarSign,
      descricao: "vs mês anterior"
    },
    {
      titulo: "Conversão de Leads",
      valor: "8.5%",
      variacao: "+2.1%",
      tipo: "aumento",
      icon: Target,
      descricao: "leads para vendas"
    },
    {
      titulo: "Tempo Médio Venda",
      valor: "45 dias",
      variacao: "-5 dias",
      tipo: "aumento",
      icon: Calendar,
      descricao: "do lead à venda"
    },
    {
      titulo: "Ticket Médio",
      valor: "R$ 387K",
      variacao: "-3.2%",
      tipo: "reducao",
      icon: TrendingUp,
      descricao: "por transação"
    }
  ];

  const funil = [
    { etapa: "Leads Gerados", quantidade: 450, percentual: 100, cor: "bg-blue-500" },
    { etapa: "Leads Qualificados", quantidade: 180, percentual: 40, cor: "bg-green-500" },
    { etapa: "Visitas Agendadas", quantidade: 90, percentual: 20, cor: "bg-yellow-500" },
    { etapa: "Propostas Enviadas", quantidade: 65, percentual: 14, cor: "bg-orange-500" },
    { etapa: "Vendas Realizadas", quantidade: 34, percentual: 8, cor: "bg-red-500" }
  ];

  const alertas = [
    { tipo: "Urgente", mensagem: "3 contratos vencem em 48h", cor: "bg-red-500" },
    { tipo: "Atenção", mensagem: "5 propostas aguardando resposta há mais de 7 dias", cor: "bg-yellow-500" },
    { tipo: "Info", mensagem: "12 novos leads esta semana", cor: "bg-blue-500" }
  ];

  const topCorretores = [
    { nome: "Ana Silva", vendas: 12, valor: "R$ 1.2M", meta: 85 },
    { nome: "Carlos Santos", vendas: 10, valor: "R$ 980K", meta: 72 },
    { nome: "Maria Costa", vendas: 8, valor: "R$ 756K", meta: 68 }
  ];

  return (
    <div className="space-y-6">
      {/* Métricas Principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metrica.titulo}</CardTitle>
              <metrica.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.valor}</div>
              <div className="flex items-center space-x-2 text-xs">
                {metrica.tipo === "aumento" ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={metrica.tipo === "aumento" ? "text-green-600" : "text-red-600"}>
                  {metrica.variacao}
                </span>
                <span className="text-muted-foreground">{metrica.descricao}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Funil de Vendas */}
        <Card>
          <CardHeader>
            <CardTitle>Funil de Vendas</CardTitle>
            <CardDescription>Conversão por etapa do processo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {funil.map((etapa, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{etapa.etapa}</span>
                    <span className="font-semibold">{etapa.quantidade} ({etapa.percentual}%)</span>
                  </div>
                  <Progress value={etapa.percentual} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Corretores */}
        <Card>
          <CardHeader>
            <CardTitle>Top Corretores Este Mês</CardTitle>
            <CardDescription>Performance dos vendedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCorretores.map((corretor, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{corretor.nome}</p>
                      <p className="text-sm text-muted-foreground">{corretor.vendas} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{corretor.valor}</p>
                    <Badge 
                      variant="outline"
                      className={
                        corretor.meta >= 80 ? 'text-green-600 border-green-600' :
                        corretor.meta >= 60 ? 'text-yellow-600 border-yellow-600' :
                        'text-red-600 border-red-600'
                      }
                    >
                      {corretor.meta}% meta
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alertas e Ações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            Alertas e Ações Necessárias
          </CardTitle>
          <CardDescription>Itens que requerem atenção imediata</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertas.map((alerta, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Badge className={`${alerta.cor} text-white`}>
                  {alerta.tipo}
                </Badge>
                <span className="flex-1">{alerta.mensagem}</span>
                <button className="text-blue-600 hover:underline text-sm">
                  Ver detalhes
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
