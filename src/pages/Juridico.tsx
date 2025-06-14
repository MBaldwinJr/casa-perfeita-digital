
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Scale, AlertTriangle, CheckCircle, FileText, Clock, Eye, Plus, BarChart3 } from "lucide-react";
import DocumentManager from "@/components/juridico/DocumentManager";
import ProcessManager from "@/components/juridico/ProcessManager";

export default function Juridico() {
  const [activeTab, setActiveTab] = useState('overview');

  const handleNovaAnalise = () => {
    // Implementar ação para nova análise
    console.log('Nova análise clicada');
  };

  const alertasJuridicos = [
    { tipo: "Urgente", mensagem: "Certidão de distribuição vencida - Casa Jardim América", cor: "bg-red-500" },
    { tipo: "Atenção", mensagem: "IPTU em atraso - Terreno Centro", cor: "bg-yellow-500" },
    { tipo: "Info", mensagem: "Nova certidão disponível para retirada", cor: "bg-blue-500" },
  ];

  const estatisticas = {
    processosAtivos: 12,
    documentosValidos: 86,
    alertasAtivos: 5,
    processosConcluidos: 24,
    prazosVencidos: 3,
    certificacoesOk: 92
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Módulo Jurídico</h2>
          <p className="text-muted-foreground">Gestão completa de processos e documentos jurídicos</p>
        </div>
        <Button onClick={handleNovaAnalise}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="processos">Processos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Estatísticas Gerais */}
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.processosAtivos}</div>
                <p className="text-xs text-muted-foreground">+2 esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{estatisticas.documentosValidos}%</div>
                <p className="text-xs text-muted-foreground">3 documentos vencidos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{estatisticas.alertasAtivos}</div>
                <p className="text-xs text-muted-foreground">2 urgentes</p>
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
                <p className="text-xs text-muted-foreground">requer ação</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Certificações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{estatisticas.certificacoesOk}%</div>
                <p className="text-xs text-muted-foreground">conformidade</p>
              </CardContent>
            </Card>
          </div>

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
                {alertasJuridicos.map((alerta, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Badge className={`${alerta.cor} text-white`}>
                      {alerta.tipo}
                    </Badge>
                    <span className="flex-1">{alerta.mensagem}</span>
                    <Button size="sm" variant="outline" onClick={() => console.log('Ver alerta:', alerta.mensagem)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Dashboard de Produtividade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Resumo de Produtividade
              </CardTitle>
              <CardDescription>Performance do setor jurídico nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-semibold text-green-700">Processos Finalizados</h4>
                    <p className="text-2xl font-bold text-green-600">24</p>
                    <p className="text-sm text-muted-foreground">+20% vs mês anterior</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-blue-700">Tempo Médio de Processo</h4>
                    <p className="text-2xl font-bold text-blue-600">45 dias</p>
                    <p className="text-sm text-muted-foreground">-5 dias vs mês anterior</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <h4 className="font-semibold text-yellow-700">Documentos Processados</h4>
                    <p className="text-2xl font-bold text-yellow-600">156</p>
                    <p className="text-sm text-muted-foreground">+12% vs mês anterior</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <h4 className="font-semibold text-purple-700">Taxa de Aprovação</h4>
                    <p className="text-2xl font-bold text-purple-600">94%</p>
                    <p className="text-sm text-muted-foreground">+2% vs mês anterior</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="processos">
          <ProcessManager />
        </TabsContent>

        <TabsContent value="documentos">
          <DocumentManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
