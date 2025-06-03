
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Recibo {
  id: number;
  cliente: string;
  valor: string;
  referencia: string;
  status: string;
}

export default function RecibosManager() {
  const recibos: Recibo[] = [
    { id: 1, cliente: "João Silva", valor: "R$ 1.200,00", referencia: "Janeiro/2024", status: "Pago" },
    { id: 2, cliente: "Maria Santos", valor: "R$ 800,00", referencia: "Janeiro/2024", status: "Pendente" },
    { id: 3, cliente: "Pedro Costa", valor: "R$ 950,00", referencia: "Janeiro/2024", status: "Pago" },
  ];

  const gerarRecibos = () => {
    toast({
      title: "Recibos gerados!",
      description: "Os recibos mensais foram gerados com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Receipt className="h-5 w-5 mr-2" />
          Recibos e Cobrança
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recibos.map((recibo) => (
            <div key={recibo.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <p className="font-medium">{recibo.cliente}</p>
                <p className="text-sm text-muted-foreground">{recibo.referencia}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{recibo.valor}</p>
                <Badge 
                  variant="outline"
                  className={
                    recibo.status === 'Pago' ? 'text-green-600 border-green-600' :
                    'text-orange-600 border-orange-600'
                  }
                >
                  {recibo.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" onClick={gerarRecibos}>
          <Receipt className="h-4 w-4 mr-2" />
          Gerar Novos Recibos
        </Button>
      </CardContent>
    </Card>
  );
}
