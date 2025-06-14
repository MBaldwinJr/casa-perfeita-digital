import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator, 
  Building, 
  CreditCard, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  BarChart3,
  Target
} from "lucide-react";

// Simulação de dados em tempo real do Banco Central
const useBankRates = () => {
  const [rates, setRates] = useState([
    {
      banco: "Caixa Econômica Federal",
      codigo: "caixa",
      taxaMin: 8.16,
      taxaMax: 10.50,
      prazoMax: 420,
      entrada: 20,
      trend: "down",
      lastUpdate: new Date(),
      specialty: "SFH",
      aprovacao: 85
    },
    {
      banco: "Banco do Brasil",
      codigo: "bb",
      taxaMin: 8.50,
      taxaMax: 11.20,
      prazoMax: 420,
      entrada: 20,
      trend: "up",
      lastUpdate: new Date(),
      specialty: "Construção",
      aprovacao: 78
    },
    {
      banco: "Bradesco",
      codigo: "bradesco",
      taxaMin: 9.20,
      taxaMax: 12.50,
      prazoMax: 360,
      entrada: 30,
      trend: "stable",
      lastUpdate: new Date(),
      specialty: "Imóveis Usados",
      aprovacao: 82
    },
    {
      banco: "Itaú",
      codigo: "itau",
      taxaMin: 8.80,
      taxaMax: 11.80,
      prazoMax: 420,
      entrada: 20,
      trend: "down",
      lastUpdate: new Date(),
      specialty: "Renda Alta",
      aprovacao: 89
    },
    {
      banco: "Santander",
      codigo: "santander",
      taxaMin: 9.50,
      taxaMax: 13.20,
      prazoMax: 360,
      entrada: 30,
      trend: "up",
      lastUpdate: new Date(),
      specialty: "Imóveis Novos",
      aprovacao: 75
    }
  ]);

  // Simular atualização em tempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prev => prev.map(rate => ({
        ...rate,
        taxaMin: Math.max(7, rate.taxaMin + (Math.random() - 0.5) * 0.1),
        taxaMax: rate.taxaMax + (Math.random() - 0.5) * 0.15,
        lastUpdate: new Date(),
        trend: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'up' : 'down') : rate.trend
      })));
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, []);

  return rates;
};

export default function FinancingComparison() {
  const rates = useBankRates();
  const [simulacao, setSimulacao] = useState({
    valorImovel: '',
    entrada: '',
    prazo: '360',
    renda: ''
  });
  const [resultados, setResultados] = useState([]);

  const calcularFinanciamento = () => {
    if (!simulacao.valorImovel || !simulacao.entrada) return;

    const valorFinanciado = parseFloat(simulacao.valorImovel) - parseFloat(simulacao.entrada);
    const prazoMeses = parseInt(simulacao.prazo);

    const novosResultados = rates.map(rate => {
      const taxaMensal = rate.taxaMin / 100 / 12;
      const parcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, prazoMeses)) / (Math.pow(1 + taxaMensal, prazoMeses) - 1);
      const totalPago = parcela * prazoMeses;
      const jurosTotal = totalPago - valorFinanciado;
      
      // Verificar se atende critérios do banco
      const entradaPercent = (parseFloat(simulacao.entrada) / parseFloat(simulacao.valorImovel)) * 100;
      const atendeCriterios = entradaPercent >= rate.entrada && prazoMeses <= rate.prazoMax;
      
      return {
        ...rate,
        valorFinanciado,
        parcela,
        totalPago,
        jurosTotal,
        atendeCriterios,
        economia: 0 // Será calculada após ordenação
      };
    }).sort((a, b) => a.parcela - b.parcela);

    // Calcular economia comparada ao pior
    const piorParcela = novosResultados[novosResultados.length - 1].parcela;
    novosResultados.forEach(resultado => {
      resultado.economia = piorParcela - resultado.parcela;
    });

    setResultados(novosResultados);
  };

  useEffect(() => {
    if (simulacao.valorImovel && simulacao.entrada) {
      calcularFinanciamento();
    }
  }, [simulacao, rates]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Central de Financiamento</h2>
          <p className="text-muted-foreground">Taxas em tempo real • Comparação de bancos • Simulação avançada</p>
        </div>
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-4 w-4 text-green-500 animate-spin" />
          <span className="text-sm text-muted-foreground">Atualizando...</span>
        </div>
      </div>

      <Tabs defaultValue="comparacao" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
          <TabsTrigger value="mercado">Mercado</TabsTrigger>
          <TabsTrigger value="gestao">Gestão</TabsTrigger>
        </TabsList>

        <TabsContent value="comparacao" className="space-y-6">
          {/* Métricas Gerais */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Menor Taxa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {Math.min(...rates.map(r => r.taxaMin)).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">
                  {rates.find(r => r.taxaMin === Math.min(...rates.map(x => x.taxaMin)))?.banco}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Média do Mercado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {(rates.reduce((acc, r) => acc + r.taxaMin, 0) / rates.length).toFixed(2)}%
                </div>
                <p className="text-xs text-muted-foreground">Últimas 24h</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Bancos Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{rates.length}</div>
                <p className="text-xs text-muted-foreground">Com taxas atualizadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Melhor Aprovação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {Math.max(...rates.map(r => r.aprovacao))}%
                </div>
                <p className="text-xs text-muted-foreground">Taxa de sucesso</p>
              </CardContent>
            </Card>
          </div>

          {/* Comparação de Bancos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Comparação de Taxas por Banco
              </CardTitle>
              <CardDescription>Taxas atualizadas em tempo real via Banco Central</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rates.map((rate, index) => (
                  <div key={rate.codigo} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 
                          index === 2 ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                        <div>
                          <h4 className="font-semibold">{rate.banco}</h4>
                          <p className="text-sm text-muted-foreground">
                            Especialidade: {rate.specialty}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getTrendIcon(rate.trend)}
                        <Badge variant={rate.aprovacao > 80 ? "default" : "secondary"}>
                          {rate.aprovacao}% aprovação
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <div>
                        <Label className="text-xs text-muted-foreground">Taxa Mínima</Label>
                        <p className="text-lg font-bold text-green-600">
                          {rate.taxaMin.toFixed(2)}% a.a.
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Taxa Máxima</Label>
                        <p className="text-lg font-bold">
                          {rate.taxaMax.toFixed(2)}% a.a.
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Entrada Mínima</Label>
                        <p className="text-lg font-bold">{rate.entrada}%</p>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground">Prazo Máximo</Label>
                        <p className="text-lg font-bold">{rate.prazoMax} meses</p>
                      </div>
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Competitividade</span>
                        <span>{rate.taxaMin < 9 ? 'Excelente' : rate.taxaMin < 10 ? 'Boa' : 'Regular'}</span>
                      </div>
                      <Progress 
                        value={Math.max(0, 100 - (rate.taxaMin - 7) * 10)} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      <span className="text-xs text-muted-foreground">
                        Última atualização: {rate.lastUpdate.toLocaleTimeString('pt-BR')}
                      </span>
                      <Button size="sm" variant="outline">
                        Solicitar Simulação
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simulador" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Formulário de Simulação */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Simulador Avançado
                </CardTitle>
                <CardDescription>Compare automaticamente todos os bancos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="valorImovel">Valor do Imóvel</Label>
                  <Input
                    id="valorImovel"
                    placeholder="R$ 450.000"
                    value={simulacao.valorImovel}
                    onChange={(e) => setSimulacao({...simulacao, valorImovel: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="entrada">Valor da Entrada</Label>
                  <Input
                    id="entrada"
                    placeholder="R$ 90.000"
                    value={simulacao.entrada}
                    onChange={(e) => setSimulacao({...simulacao, entrada: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="prazo">Prazo (meses)</Label>
                  <Select value={simulacao.prazo} onValueChange={(value) => setSimulacao({...simulacao, prazo: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="240">240 meses (20 anos)</SelectItem>
                      <SelectItem value="300">300 meses (25 anos)</SelectItem>
                      <SelectItem value="360">360 meses (30 anos)</SelectItem>
                      <SelectItem value="420">420 meses (35 anos)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="renda">Renda Familiar</Label>
                  <Input
                    id="renda"
                    placeholder="R$ 8.000"
                    value={simulacao.renda}
                    onChange={(e) => setSimulacao({...simulacao, renda: e.target.value})}
                  />
                </div>
                <Button onClick={calcularFinanciamento} className="w-full">
                  <Calculator className="h-4 w-4 mr-2" />
                  Simular Financiamento
                </Button>
              </CardContent>
            </Card>

            {/* Alertas e Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Dicas Inteligentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Momento Favorável</p>
                    <p className="text-xs text-muted-foreground">
                      As taxas estão 0.3% abaixo da média histórica
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Dica de Economia</p>
                    <p className="text-xs text-muted-foreground">
                      Aumentar entrada para 25% pode reduzir juros significativamente
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">
                  <Building className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Programa Habitacional</p>
                    <p className="text-xs text-muted-foreground">
                      Você pode se qualificar para Casa Verde e Amarela
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resultados da Simulação */}
          {resultados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resultados da Simulação</CardTitle>
                <CardDescription>Ordenado pela melhor proposta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resultados.map((resultado, index) => (
                    <div key={resultado.codigo} className={`border rounded-lg p-4 ${
                      !resultado.atendeCriterios ? 'opacity-50 bg-gray-50' : 
                      index === 0 ? 'border-green-500 bg-green-50' : ''
                    }`}>
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          {index === 0 && <Badge className="bg-green-500">Melhor Opção</Badge>}
                          <h4 className="font-semibold">{resultado.banco}</h4>
                        </div>
                        {!resultado.atendeCriterios && (
                          <Badge variant="destructive">Não Atende Critérios</Badge>
                        )}
                      </div>

                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Parcela Mensal</Label>
                          <p className="text-lg font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(resultado.parcela)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Total de Juros</Label>
                          <p className="text-lg font-bold text-red-600">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(resultado.jurosTotal)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Total Pago</Label>
                          <p className="text-lg font-bold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(resultado.totalPago)}
                          </p>
                        </div>
                        {index > 0 && (
                          <div>
                            <Label className="text-xs text-muted-foreground">Economia vs Pior</Label>
                            <p className="text-lg font-bold text-green-600">
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL'
                              }).format(resultado.economia)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end mt-3">
                        <Button size="sm" disabled={!resultado.atendeCriterios}>
                          {resultado.atendeCriterios ? 'Solicitar Proposta' : 'Não Elegível'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mercado" className="space-y-6">
          {/* Indicadores de Mercado */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">SELIC Atual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">10.75%</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">-0.25% no mês</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">IPCA Acumulado</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.23%</div>
                <div className="flex items-center space-x-1 text-sm">
                  <TrendingUp className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">+0.15% no mês</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">TR (Taxa Referencial)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.00%</div>
                <div className="flex items-center space-x-1 text-sm">
                  <span className="text-gray-600">Estável há 8 anos</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Análise de Tendências */}
          <Card>
            <CardHeader>
              <CardTitle>Análise de Mercado</CardTitle>
              <CardDescription>Tendências e projeções para os próximos meses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-semibold text-green-700">Cenário Positivo</h4>
                <p className="text-sm text-muted-foreground">
                  Expectativa de redução gradual da Selic pode levar a menores taxas de financiamento nos próximos 6 meses.
                </p>
              </div>
              <div className="border-l-4 border-yellow-500 pl-4">
                <h4 className="font-semibold text-yellow-700">Atenção</h4>
                <p className="text-sm text-muted-foreground">
                  Pressão inflacionária pode influenciar decisões do COPOM sobre juros.
                </p>
              </div>
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-blue-700">Recomendação</h4>
                <p className="text-sm text-muted-foreground">
                  Momento favorável para financiamentos de longo prazo com taxa pré-fixada.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gestao" className="space-y-6">
          <div className="text-center p-8">
            <CreditCard className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Gestão de Financiamentos</h3>
            <p className="text-muted-foreground">
              Esta seção permitirá gerenciar financiamentos ativos, histórico e documentos.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}