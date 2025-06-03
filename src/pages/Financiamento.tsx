
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, CreditCard, CheckCircle, AlertTriangle, Clock, FileText, TrendingUp, Users, Building } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

export default function Financiamento() {
  const [simulacao, setSimulacao] = useState({
    valorImovel: "",
    entrada: "",
    prazo: "360",
    taxa: "10.5",
    sistema: "SAC",
    renda: "",
    tipoRenda: "CLT"
  });

  const [comparacao, setComparacao] = useState<any[]>([]);

  const financiamentos = [
    {
      id: 1,
      cliente: "João Silva",
      banco: "Banco do Brasil",
      valor: "R$ 360.000",
      valorAprovado: "R$ 360.000",
      status: "Aprovado",
      statusColor: "bg-green-500",
      progresso: 100,
      etapa: "Contrato Assinado",
      taxa: "9.8% a.a.",
      prazo: "360 meses",
      prestacao: "R$ 2.850,00",
      dataAprovacao: "2024-01-10",
      observacoes: "Aprovação concluída com sucesso"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      banco: "Caixa Econômica",
      valor: "R$ 200.000",
      valorAprovado: "R$ 180.000",
      status: "Em Análise",
      statusColor: "bg-blue-500",
      progresso: 60,
      etapa: "Avaliação do Imóvel",
      taxa: "9.5% a.a.",
      prazo: "300 meses",
      prestacao: "R$ 1.650,00",
      dataAprovacao: "",
      observacoes: "Aguardando laudo de avaliação"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      banco: "Santander",
      valor: "R$ 280.000",
      valorAprovado: "",
      status: "Pendente",
      statusColor: "bg-yellow-500",
      progresso: 30,
      etapa: "Documentação",
      taxa: "11.0% a.a.",
      prazo: "360 meses",
      prestacao: "",
      dataAprovacao: "",
      observacoes: "Faltam comprovantes de renda"
    },
  ];

  const bancos = [
    { 
      nome: "Caixa Econômica Federal", 
      taxa: "9.5", 
      tipo: "Preferencial",
      cor: "bg-green-500",
      requisitos: "Renda mínima: R$ 2.000",
      prazoMax: "420 meses",
      valorMax: "R$ 1.5M"
    },
    { 
      nome: "Banco do Brasil", 
      taxa: "10.2", 
      tipo: "Conveniado",
      cor: "bg-blue-500",
      requisitos: "Renda mínima: R$ 2.500",
      prazoMax: "360 meses",
      valorMax: "R$ 2M"
    },
    { 
      nome: "Santander", 
      taxa: "11.0", 
      tipo: "Disponível",
      cor: "bg-gray-500",
      requisitos: "Renda mínima: R$ 3.000",
      prazoMax: "360 meses",
      valorMax: "R$ 1.8M"
    },
    { 
      nome: "Itaú", 
      taxa: "10.8", 
      tipo: "Disponível",
      cor: "bg-orange-500",
      requisitos: "Renda mínima: R$ 3.500",
      prazoMax: "360 meses",
      valorMax: "R$ 2.5M"
    },
  ];

  const calcularFinanciamento = () => {
    const valor = parseFloat(simulacao.valorImovel.replace(/[^\d,]/g, '').replace(',', '.'));
    const entrada = parseFloat(simulacao.entrada.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorFinanciado = valor - entrada;
    const taxa = parseFloat(simulacao.taxa) / 100 / 12;
    const parcelas = parseInt(simulacao.prazo);
    
    if (valor && entrada && !isNaN(valorFinanciado) && valorFinanciado > 0) {
      if (simulacao.sistema === "SAC") {
        // Sistema SAC
        const amortizacao = valorFinanciado / parcelas;
        const jurosPrimeira = valorFinanciado * taxa;
        const prestacaoPrimeira = amortizacao + jurosPrimeira;
        const jurosUltima = amortizacao * taxa;
        const prestacaoUltima = amortizacao + jurosUltima;
        const totalJuros = (parcelas * amortizacao * taxa * (parcelas + 1)) / 2;
        
        return {
          sistema: "SAC",
          valorFinanciado: valorFinanciado.toLocaleString('pt-BR'),
          prestacaoPrimeira: prestacaoPrimeira.toFixed(2).replace('.', ','),
          prestacaoUltima: prestacaoUltima.toFixed(2).replace('.', ','),
          totalJuros: totalJuros.toFixed(2).replace('.', ','),
          totalGeral: (valorFinanciado + totalJuros).toFixed(2).replace('.', ','),
          amortizacao: amortizacao.toFixed(2).replace('.', ',')
        };
      } else {
        // Sistema PRICE
        const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
        const totalPago = prestacao * parcelas;
        const totalJuros = totalPago - valorFinanciado;
        
        return {
          sistema: "PRICE",
          valorFinanciado: valorFinanciado.toLocaleString('pt-BR'),
          prestacao: prestacao.toFixed(2).replace('.', ','),
          totalJuros: totalJuros.toFixed(2).replace('.', ','),
          totalGeral: totalPago.toFixed(2).replace('.', ',')
        };
      }
    }
    return null;
  };

  const compararBancos = () => {
    const valor = parseFloat(simulacao.valorImovel.replace(/[^\d,]/g, '').replace(',', '.'));
    const entrada = parseFloat(simulacao.entrada.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorFinanciado = valor - entrada;
    const parcelas = parseInt(simulacao.prazo);
    
    if (valorFinanciado > 0) {
      const resultados = bancos.map(banco => {
        const taxa = parseFloat(banco.taxa) / 100 / 12;
        const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
        const totalPago = prestacao * parcelas;
        const totalJuros = totalPago - valorFinanciado;
        
        return {
          banco: banco.nome,
          taxa: banco.taxa + "% a.a.",
          prestacao: prestacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          totalJuros: totalJuros.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          total: totalPago.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
          tipo: banco.tipo,
          requisitos: banco.requisitos
        };
      });
      
      setComparacao(resultados);
      toast({
        title: "Comparação realizada!",
        description: "Veja os resultados na aba de comparação.",
      });
    }
  };

  const calcularCapacidadePagamento = () => {
    const renda = parseFloat(simulacao.renda.replace(/[^\d,]/g, '').replace(',', '.'));
    if (renda > 0) {
      const capacidade = renda * 0.3; // 30% da renda
      const valorMaximo = capacidade * parseInt(simulacao.prazo);
      
      toast({
        title: "Capacidade de Pagamento",
        description: `Prestação máxima: R$ ${capacidade.toFixed(2).replace('.', ',')} | Financiamento máximo: R$ ${valorMaximo.toLocaleString('pt-BR')}`,
      });
    }
  };

  const resultado = calcularFinanciamento();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financiamento Imobiliário</h2>
          <p className="text-muted-foreground">Simulações, comparações e acompanhamento de financiamentos</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Novo Financiamento
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Financiamentos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">+3 este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa Média Aprovada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">9.8%</div>
            <p className="text-xs text-muted-foreground">a.a. + TR</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Total Aprovado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 8.2M</div>
            <p className="text-xs text-muted-foreground">Este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">85%</div>
            <p className="text-xs text-muted-foreground">Últimos 30 dias</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="simulador" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="simulador">Simulador</TabsTrigger>
          <TabsTrigger value="comparacao">Comparação</TabsTrigger>
          <TabsTrigger value="acompanhamento">Acompanhamento</TabsTrigger>
          <TabsTrigger value="bancos">Bancos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="simulador" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Simulador Avançado
                </CardTitle>
                <CardDescription>Calcule as condições do financiamento com diferentes sistemas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Valor do Imóvel</Label>
                    <Input 
                      value={simulacao.valorImovel}
                      onChange={(e) => setSimulacao({...simulacao, valorImovel: e.target.value})}
                      placeholder="R$ 450.000"
                    />
                  </div>
                  <div>
                    <Label>Entrada</Label>
                    <Input 
                      value={simulacao.entrada}
                      onChange={(e) => setSimulacao({...simulacao, entrada: e.target.value})}
                      placeholder="R$ 90.000"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Prazo (meses)</Label>
                    <Select 
                      value={simulacao.prazo}
                      onValueChange={(value) => setSimulacao({...simulacao, prazo: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="180">180 meses (15 anos)</SelectItem>
                        <SelectItem value="240">240 meses (20 anos)</SelectItem>
                        <SelectItem value="300">300 meses (25 anos)</SelectItem>
                        <SelectItem value="360">360 meses (30 anos)</SelectItem>
                        <SelectItem value="420">420 meses (35 anos)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Taxa de Juros (%)</Label>
                    <Input 
                      value={simulacao.taxa}
                      onChange={(e) => setSimulacao({...simulacao, taxa: e.target.value})}
                      placeholder="10.5"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Sistema</Label>
                    <Select 
                      value={simulacao.sistema}
                      onValueChange={(value) => setSimulacao({...simulacao, sistema: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PRICE">PRICE (Prestação Fixa)</SelectItem>
                        <SelectItem value="SAC">SAC (Prestação Decrescente)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Renda Familiar</Label>
                    <Input 
                      value={simulacao.renda}
                      onChange={(e) => setSimulacao({...simulacao, renda: e.target.value})}
                      placeholder="R$ 8.000"
                    />
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={calcularCapacidadePagamento} variant="outline" className="flex-1">
                    Capacidade de Pagamento
                  </Button>
                  <Button onClick={compararBancos} className="flex-1">
                    Comparar Bancos
                  </Button>
                </div>

                {resultado && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Resultado da Simulação - {resultado.sistema}</h4>
                    <div className="space-y-1">
                      <p>Valor Financiado: <span className="font-bold">R$ {resultado.valorFinanciado}</span></p>
                      {resultado.sistema === "PRICE" ? (
                        <p>Prestação Mensal: <span className="font-bold text-green-600">R$ {resultado.prestacao}</span></p>
                      ) : (
                        <>
                          <p>Primeira Prestação: <span className="font-bold text-green-600">R$ {resultado.prestacaoPrimeira}</span></p>
                          <p>Última Prestação: <span className="font-bold text-blue-600">R$ {resultado.prestacaoUltima}</span></p>
                          <p>Amortização Mensal: <span className="font-bold">R$ {resultado.amortizacao}</span></p>
                        </>
                      )}
                      <p>Total de Juros: <span className="font-bold text-red-600">R$ {resultado.totalJuros}</span></p>
                      <p>Total Geral: <span className="font-bold">R$ {resultado.totalGeral}</span></p>
                      <p>Prazo: <span className="font-bold">{simulacao.prazo} meses</span></p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análise de Viabilidade</CardTitle>
                <CardDescription>Verifique se o financiamento é viável</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Tipo de Renda</Label>
                  <Select 
                    value={simulacao.tipoRenda}
                    onValueChange={(value) => setSimulacao({...simulacao, tipoRenda: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CLT">CLT</SelectItem>
                      <SelectItem value="autonomo">Autônomo</SelectItem>
                      <SelectItem value="empresario">Empresário</SelectItem>
                      <SelectItem value="servidor">Servidor Público</SelectItem>
                      <SelectItem value="aposentado">Aposentado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {simulacao.renda && resultado && (
                  <div className="space-y-3">
                    <div className="bg-gray-50 p-3 rounded">
                      <h5 className="font-medium mb-2">Análise Financeira</h5>
                      <div className="space-y-1 text-sm">
                        {(() => {
                          const renda = parseFloat(simulacao.renda.replace(/[^\d,]/g, '').replace(',', '.'));
                          const prestacao = resultado.sistema === "PRICE" 
                            ? parseFloat(resultado.prestacao?.replace('.', ',') || '0')
                            : parseFloat(resultado.prestacaoPrimeira?.replace('.', ',') || '0');
                          const comprometimento = (prestacao / renda) * 100;
                          
                          return (
                            <>
                              <p>Renda Informada: R$ {renda.toLocaleString('pt-BR')}</p>
                              <p>Prestação: R$ {prestacao.toLocaleString('pt-BR')}</p>
                              <p>Comprometimento: <span className={comprometimento > 30 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>{comprometimento.toFixed(1)}%</span></p>
                              <div className="mt-2">
                                {comprometimento <= 30 ? (
                                  <Badge className="bg-green-500 text-white">✓ Viável</Badge>
                                ) : comprometimento <= 35 ? (
                                  <Badge className="bg-yellow-500 text-white">⚠ Atenção</Badge>
                                ) : (
                                  <Badge className="bg-red-500 text-white">✗ Alto Risco</Badge>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded">
                      <h5 className="font-medium mb-2">Documentos Necessários - {simulacao.tipoRenda}</h5>
                      <ul className="text-sm space-y-1">
                        <li>• Documento de identificação</li>
                        <li>• CPF</li>
                        <li>• Comprovante de residência</li>
                        {simulacao.tipoRenda === "CLT" && (
                          <>
                            <li>• Carteira de trabalho</li>
                            <li>• 3 últimos holerites</li>
                            <li>• Declaração do empregador</li>
                          </>
                        )}
                        {simulacao.tipoRenda === "autonomo" && (
                          <>
                            <li>• Declaração de Imposto de Renda</li>
                            <li>• Extratos bancários (6 meses)</li>
                            <li>• Declaração de autonomo</li>
                          </>
                        )}
                        {simulacao.tipoRenda === "empresario" && (
                          <>
                            <li>• Contrato social da empresa</li>
                            <li>• Declaração de Imposto de Renda</li>
                            <li>• Balanço patrimonial</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="comparacao" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Comparação de Bancos</CardTitle>
              <CardDescription>Compare as condições oferecidas pelos diferentes bancos</CardDescription>
            </CardHeader>
            <CardContent>
              {comparacao.length > 0 ? (
                <div className="space-y-4">
                  {comparacao.map((resultado, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold">{resultado.banco}</h4>
                          <p className="text-sm text-muted-foreground">{resultado.requisitos}</p>
                        </div>
                        <Badge variant="outline">{resultado.tipo}</Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Taxa</p>
                          <p className="font-semibold">{resultado.taxa}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Prestação</p>
                          <p className="font-semibold text-green-600">{resultado.prestacao}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Juros</p>
                          <p className="font-semibold text-red-600">{resultado.totalJuros}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Geral</p>
                          <p className="font-semibold">{resultado.total}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Use o simulador para comparar as condições dos bancos</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acompanhamento" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Financiamentos em Andamento</CardTitle>
              <CardDescription>Acompanhe o status detalhado dos financiamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {financiamentos.map((financiamento) => (
                  <div key={financiamento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{financiamento.cliente}</h4>
                        <p className="text-sm text-muted-foreground">{financiamento.banco}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{financiamento.valor}</p>
                        <Badge className={`${financiamento.statusColor} text-white`}>
                          {financiamento.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-muted-foreground">Taxa</p>
                        <p className="font-semibold">{financiamento.taxa}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prazo</p>
                        <p className="font-semibold">{financiamento.prazo}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prestação</p>
                        <p className="font-semibold text-green-600">{financiamento.prestacao || "A calcular"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Aprovado</p>
                        <p className="font-semibold">{financiamento.valorAprovado || "Em análise"}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progresso: {financiamento.etapa}</span>
                        <span>{financiamento.progresso}%</span>
                      </div>
                      <Progress value={financiamento.progresso} className="h-2" />
                    </div>
                    
                    {financiamento.observacoes && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                        {financiamento.observacoes}
                      </div>
                    )}
                    
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm" variant="outline">Ver Detalhes</Button>
                      <Button size="sm">Atualizar Status</Button>
                      <Button size="sm" variant="outline">Documentos</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bancos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bancos Parceiros</CardTitle>
              <CardDescription>Taxas e condições especiais negociadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bancos.map((banco, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{banco.nome}</h4>
                        <p className="text-sm text-muted-foreground">{banco.requisitos}</p>
                      </div>
                      <Badge className={`${banco.cor} text-white`}>
                        {banco.tipo}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Taxa</p>
                        <p className="font-bold text-lg">{banco.taxa}% a.a. + TR</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Prazo Máximo</p>
                        <p className="font-semibold">{banco.prazoMax}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Valor Máximo</p>
                        <p className="font-semibold">{banco.valorMax}</p>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-3">
                      <Button size="sm">Simular Neste Banco</Button>
                      <Button size="sm" variant="outline">Ver Condições</Button>
                      <Button size="sm" variant="outline">Contato</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="relatorios" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Aprovações por Mês
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Janeiro</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fevereiro</span>
                    <span className="font-bold">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Março</span>
                    <span className="font-bold">92%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Por Tipo de Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>CLT</span>
                    <span className="font-bold">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Autônomo</span>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Empresário</span>
                    <span className="font-bold">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-sm">
                  <Building className="h-4 w-4 mr-2" />
                  Por Banco
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Caixa</span>
                    <span className="font-bold">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Banco do Brasil</span>
                    <span className="font-bold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outros</span>
                    <span className="font-bold">30%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Relatórios Disponíveis</CardTitle>
              <CardDescription>Gere relatórios detalhados sobre financiamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Relatório de Aprovações</h4>
                  <p className="text-sm text-muted-foreground mb-3">Análise detalhada das aprovações por período</p>
                  <Button size="sm">Gerar Relatório</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Comparativo de Bancos</h4>
                  <p className="text-sm text-muted-foreground mb-3">Performance e condições dos bancos parceiros</p>
                  <Button size="sm">Gerar Relatório</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Análise de Clientes</h4>
                  <p className="text-sm text-muted-foreground mb-3">Perfil dos clientes aprovados e negados</p>
                  <Button size="sm">Gerar Relatório</Button>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">Comissões de Financiamento</h4>
                  <p className="text-sm text-muted-foreground mb-3">Relatório financeiro de comissões recebidas</p>
                  <Button size="sm">Gerar Relatório</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
