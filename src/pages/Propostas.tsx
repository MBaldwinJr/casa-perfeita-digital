
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, DollarSign, User } from "lucide-react";

export default function Propostas() {
  const propostas = [
    {
      id: 1,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      valorProposta: "R$ 420.000",
      valorImovel: "R$ 450.000",
      data: "2024-01-15",
      status: "Pendente",
      statusColor: "bg-yellow-500",
    },
    {
      id: 2,
      cliente: "Maria Santos",
      imovel: "Terreno - Centro",
      valorProposta: "R$ 280.000",
      valorImovel: "R$ 280.000",
      data: "2024-01-14",
      status: "Aceita",
      statusColor: "bg-green-500",
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      imovel: "Casa - Vila Nova",
      valorProposta: "R$ 300.000",
      valorImovel: "R$ 320.000",
      data: "2024-01-13",
      status: "Negociando",
      statusColor: "bg-blue-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Propostas & Contratos</h2>
          <p className="text-muted-foreground">Gerencie propostas, contratos e documentação</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Nova Proposta
        </Button>
      </div>

      <div className="grid gap-6">
        {propostas.map((proposta) => (
          <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{proposta.imovel}</CardTitle>
                  <CardDescription className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {proposta.cliente}
                  </CardDescription>
                </div>
                <Badge className={`${proposta.statusColor} text-white`}>
                  {proposta.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Proposta: {proposta.valorProposta}</div>
                    <div className="text-xs text-muted-foreground">Valor: {proposta.valorImovel}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{new Date(proposta.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex space-x-2 md:col-span-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button size="sm">
                    Gerar Contrato
                  </Button>
                  <Button variant="outline" size="sm">
                    Histórico
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
