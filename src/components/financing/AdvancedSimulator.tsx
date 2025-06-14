import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calculator, FileDown, TrendingUp, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SimulationData {
  valorImovel: string;
  entrada: string;
  prazo: string;
  renda: string;
}

interface SimulationResult {
  banco: string;
  codigo: string;
  valorFinanciado: number;
  parcela: number;
  totalPago: number;
  jurosTotal: number;
  atendeCriterios: boolean;
  economia: number;
  taxaMin: number;
}

interface AdvancedSimulatorProps {
  simulacao: SimulationData;
  setSimulacao: (simulacao: SimulationData) => void;
  resultados: SimulationResult[];
  calcularFinanciamento: () => void;
  onSolicitarProposta: (resultado: SimulationResult) => void;
}

export default function AdvancedSimulator({ 
  simulacao, 
  setSimulacao, 
  resultados, 
  calcularFinanciamento,
  onSolicitarProposta 
}: AdvancedSimulatorProps) {
  const { toast } = useToast();
  const [cenarios, setCenarios] = useState([
    { entrada: 20, prazo: 360 },
    { entrada: 30, prazo: 300 },
    { entrada: 40, prazo: 240 }
  ]);

  const calcularCapacidadePagamento = () => {
    if (!simulacao.renda) return 0;
    const renda = parseFloat(simulacao.renda);
    return renda * 0.3; // 30% da renda
  };

  const exportarPDF = () => {
    toast({
      title: "Export Iniciado",
      description: "Sua simulação será exportada em PDF em breve.",
    });
  };

  const calcularScore = () => {
    if (!simulacao.renda || !simulacao.entrada || !simulacao.valorImovel) return 0;
    
    const renda = parseFloat(simulacao.renda);
    const entrada = parseFloat(simulacao.entrada);
    const valor = parseFloat(simulacao.valorImovel);
    const entradaPercent = (entrada / valor) * 100;
    
    let score = 50;
    if (entradaPercent >= 30) score += 25;
    else if (entradaPercent >= 20) score += 15;
    
    if (renda >= 10000) score += 25;
    else if (renda >= 5000) score += 15;
    
    return Math.min(100, score);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="simulador" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
          <TabsTrigger value="cenarios">Cenários</TabsTrigger>
          <TabsTrigger value="capacidade">Capacidade</TabsTrigger>
        </TabsList>

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
                <div className="space-y-2">
                  <Button onClick={calcularFinanciamento} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Simular Financiamento
                  </Button>
                  {resultados.length > 0 && (
                    <Button variant="outline" onClick={exportarPDF} className="w-full">
                      <FileDown className="h-4 w-4 mr-2" />
                      Exportar PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Score e Análise */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Análise de Aprovabilidade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {calcularScore()}%
                  </div>
                  <Badge variant={calcularScore() > 80 ? "default" : calcularScore() > 60 ? "secondary" : "destructive"}>
                    {calcularScore() > 80 ? 'Excelente' : calcularScore() > 60 ? 'Bom' : 'Regular'}
                  </Badge>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Entrada vs Valor do Imóvel</span>
                    <span className={simulacao.entrada && simulacao.valorImovel && 
                      (parseFloat(simulacao.entrada) / parseFloat(simulacao.valorImovel)) >= 0.2 ? 
                      'text-green-600' : 'text-red-600'}>
                      {simulacao.entrada && simulacao.valorImovel ? 
                        `${((parseFloat(simulacao.entrada) / parseFloat(simulacao.valorImovel)) * 100).toFixed(1)}%` : 
                        '0%'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Capacidade de Pagamento</span>
                    <span className="text-blue-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(calcularCapacidadePagamento())}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span>Renda Comprometida</span>
                    <span className={resultados.length > 0 && simulacao.renda && 
                      (resultados[0]?.parcela / parseFloat(simulacao.renda)) < 0.3 ? 
                      'text-green-600' : 'text-yellow-600'}>
                      {resultados.length > 0 && simulacao.renda ? 
                        `${((resultados[0]?.parcela / parseFloat(simulacao.renda)) * 100).toFixed(1)}%` : 
                        '0%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cenarios" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Cenários</CardTitle>
              <CardDescription>Veja como diferentes entradas e prazos afetam sua parcela</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {cenarios.map((cenario, index) => {
                  if (!simulacao.valorImovel) return null;
                  
                  const valorImovel = parseFloat(simulacao.valorImovel);
                  const entradaValor = valorImovel * (cenario.entrada / 100);
                  const valorFinanciado = valorImovel - entradaValor;
                  const taxaMensal = 0.085 / 12; // Taxa exemplo
                  const parcela = valorFinanciado * (taxaMensal * Math.pow(1 + taxaMensal, cenario.prazo)) / (Math.pow(1 + taxaMensal, cenario.prazo) - 1);
                  
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid gap-4 md:grid-cols-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Entrada ({cenario.entrada}%)</Label>
                          <p className="font-semibold">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(entradaValor)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Prazo</Label>
                          <p className="font-semibold">{cenario.prazo} meses</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Parcela Estimada</Label>
                          <p className="font-semibold text-primary">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format(parcela)}
                          </p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Total de Juros</Label>
                          <p className="font-semibold text-red-600">
                            {new Intl.NumberFormat('pt-BR', {
                              style: 'currency',
                              currency: 'BRL'
                            }).format((parcela * cenario.prazo) - valorFinanciado)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="capacidade" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calculadora de Capacidade</CardTitle>
              <CardDescription>Descubra o valor máximo que você pode financiar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label>Renda Líquida Mensal</Label>
                    <Input
                      placeholder="R$ 8.000"
                      value={simulacao.renda}
                      onChange={(e) => setSimulacao({...simulacao, renda: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Comprometimento Máximo (%)</Label>
                    <Select defaultValue="30">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25%</SelectItem>
                        <SelectItem value="30">30%</SelectItem>
                        <SelectItem value="35">35%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <Label className="text-sm font-medium">Parcela Máxima</Label>
                    <p className="text-2xl font-bold text-blue-600">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(calcularCapacidadePagamento())}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <Label className="text-sm font-medium">Valor Máximo do Imóvel (entrada 30%)</Label>
                    <p className="text-xl font-bold text-green-600">
                      {simulacao.renda ? new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(calcularCapacidadePagamento() * 360 * 1.43) : 'R$ 0,00'} {/* Fórmula aproximada */}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
                    <Button 
                      size="sm" 
                      disabled={!resultado.atendeCriterios}
                      onClick={() => resultado.atendeCriterios && onSolicitarProposta(resultado)}
                    >
                      {resultado.atendeCriterios ? 'Solicitar Proposta' : 'Não Elegível'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}