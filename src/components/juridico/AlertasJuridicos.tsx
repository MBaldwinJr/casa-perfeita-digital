import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Eye } from "lucide-react";
import { AlertaJuridico } from "@/hooks/useSupabaseQuery";

interface AlertasJuridicosProps {
  alertas: AlertaJuridico[];
  onVerAlerta: (alerta: AlertaJuridico) => void;
}

export default function AlertasJuridicos({ alertas, onVerAlerta }: AlertasJuridicosProps) {
  const getCorPorTipo = (tipo: string) => {
    switch (tipo) {
      case 'urgente': return 'bg-destructive';
      case 'atencao': return 'bg-warning';
      case 'info': return 'bg-info';
      default: return 'bg-muted';
    }
  };

  return (
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
          {alertas.length > 0 ? (
            alertas.map((alerta) => (
              <div key={alerta.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <Badge className={`${getCorPorTipo(alerta.tipo)} text-white`}>
                  {alerta.tipo.charAt(0).toUpperCase() + alerta.tipo.slice(1)}
                </Badge>
                <span className="flex-1">{alerta.mensagem}</span>
                <Button size="sm" variant="outline" onClick={() => onVerAlerta(alerta)}>
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">Nenhum alerta ativo no momento</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}