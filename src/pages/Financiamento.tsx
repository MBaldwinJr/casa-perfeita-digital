
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, CreditCard, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { useState } from "react";

export default function Financiamento() {
  const [simulacao, setSimulacao] = useState({
    valorImovel: "",
    entrada: "",
    prazo: "360",
    taxa: "10.5"
  });

  const financiamentos = [
    {
      id: 1,
      cliente: "João Silva",
      banco: "Banco do Brasil",
      valor: "R$ 360.000",
      status: "Aprovado",
      statusColor: "bg-green-500",
      progresso: 100,
      etapa: "Contrato Assinado"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      banco: "Caixa Econômica",
      valor: "R$ 200.000",
      status: "Em Análise",
      statusColor: "bg-blue-500",
      progresso: 60,
      etapa: "Avaliação do Imóvel"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      banco: "Santander",
      valor: "R$ 280.000",
      status: "Pendente",
      statusColor: "bg-yellow-500",
      progresso: 30,
      etapa: "Documentação"
    },
  ];

  const calcularFinanciamento = () => {
    const valor = parseFloat(simulacao.valorImovel.replace(/[^\d,]/g, '').replace(',', '.'));
    const entrada = parseFloat(simulacao.entrada.replace(/[^\d,]/g, '').replace(',', '.'));
    const valorFinanciado = valor - entrada;
    const taxa = parseFloat(simulacao.taxa) / 100 / 12;
    const parcelas = parseInt(simulacao.prazo);
    
    if (valor && entrada && !isNaN(valorFinanciado)) {
      const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
      return {
        valorFinanciado: valorFinanciado.toLocaleString('pt-BR'),
        prestacao: prestacao.toFixed(2).replace('.', ',')
      };
    }
    return null;
  };

  const resultado = calcularFinanciamento();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financiamento</h2>
          <p className="text-muted-foreground">Simulações e acompanhamento de financiamentos</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              Simulador de Financiamento
            </CardTitle>
            <CardDescription>Calcule as condições do financiamento</CardDescription>
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
                <select 
                  className="w-full p-2 border rounded-md"
                  value={simulacao.prazo}
                  onChange={(e) => setSimulacao({...simulacao, prazo: e.target.value})}
                >
                  <option value="240">240 meses (20 anos)</option>
                  <option value="300">300 meses (25 anos)</option>
                  <option value="360">360 meses (30 anos)</option>
                  <option value="420">420 meses (35 anos)</option>
                </select>
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

            {resultado && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Resultado da Simulação</h4>
                <div className="space-y-1">
                  <p>Valor Financiado: <span className="font-bold">R$ {resultado.valorFinanciado}</span></p>
                  <p>Prestação Mensal: <span className="font-bold text-green-600">R$ {resultado.prestacao}</span></p>
                  <p>Prazo: <span className="font-bold">{simulacao.prazo} meses</span></p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bancos Parceiros</CardTitle>
            <CardDescription>Taxas e condições especiais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">Caixa Econômica Federal</p>
                  <p className="text-sm text-muted-foreground">Taxa: 9.5% a.a. + TR</p>
                </div>
                <Badge className="bg-green-500 text-white">Preferencial</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">Banco do Brasil</p>
                  <p className="text-sm text-muted-foreground">Taxa: 10.2% a.a. + TR</p>
                </div>
                <Badge className="bg-blue-500 text-white">Conveniado</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-semibold">Santander</p>
                  <p className="text-sm text-muted-foreground">Taxa: 11.0% a.a. + TR</p>
                </div>
                <Badge variant="outline">Disponível</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financiamentos em Andamento</CardTitle>
          <CardDescription>Acompanhe o status dos financiamentos</CardDescription>
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
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso: {financiamento.etapa}</span>
                    <span>{financiamento.progresso}%</span>
                  </div>
                  <Progress value={financiamento.progresso} className="h-2" />
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">Ver Detalhes</Button>
                  <Button size="sm">Atualizar Status</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
