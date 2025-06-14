import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3
} from "lucide-react";

interface BankRate {
  banco: string;
  codigo: string;
  taxaMin: number;
  taxaMax: number;
  prazoMax: number;
  entrada: number;
  trend: string;
  lastUpdate: Date;
  specialty: string;
  aprovacao: number;
}

interface BankRatesComparisonProps {
  rates: BankRate[];
  onSolicitarSimulacao: (rate: BankRate) => void;
}

export default function BankRatesComparison({ rates, onSolicitarSimulacao }: BankRatesComparisonProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-red-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-green-500" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  return (
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
                <Button size="sm" variant="outline" onClick={() => onSolicitarSimulacao(rate)}>
                  Solicitar Simulação
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}