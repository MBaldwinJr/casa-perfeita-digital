
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, Hammer, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import ObraForm from "@/components/forms/ObraForm";

export default function Obras() {
  const [showForm, setShowForm] = useState(false);

  const obras = [
    {
      id: 1,
      nome: "Reforma Cozinha - Casa João",
      imovel: "Casa - Jardim América",
      tipo: "Reforma",
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      orcamento: "R$ 25.000",
      gasto: "R$ 18.500",
      dataInicio: "2024-01-10",
      dataPrevisao: "2024-02-15",
      progresso: 75,
    },
    {
      id: 2,
      nome: "Construção Anexo",
      imovel: "Casa - Vila Nova",
      tipo: "Construção",
      status: "Planejamento",
      statusColor: "bg-yellow-500",
      orcamento: "R$ 85.000",
      gasto: "R$ 0",
      dataInicio: "2024-02-01",
      dataPrevisao: "2024-06-30",
      progresso: 0,
    },
    {
      id: 3,
      nome: "Reparo Infiltração",
      imovel: "Apartamento - Centro",
      tipo: "Reparo",
      status: "Concluído",
      statusColor: "bg-green-500",
      orcamento: "R$ 3.500",
      gasto: "R$ 3.200",
      dataInicio: "2024-01-05",
      dataPrevisao: "2024-01-20",
      progresso: 100,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Obras</h2>
          <p className="text-muted-foreground">Acompanhe projetos de construção e reforma</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Obra
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Obra</DialogTitle>
            </DialogHeader>
            <ObraForm onClose={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Obras Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 em andamento</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Investimento Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 485K</div>
            <p className="text-xs text-muted-foreground">R$ 215K executado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">75%</div>
            <p className="text-xs text-muted-foreground">6 de 8 obras</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">58%</div>
            <p className="text-xs text-muted-foreground">+12% este mês</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {obras.map((obra) => (
          <Card key={obra.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{obra.nome}</CardTitle>
                  <CardDescription>{obra.imovel}</CardDescription>
                </div>
                <Badge className={`${obra.statusColor} text-white`}>
                  {obra.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <Hammer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Tipo: {obra.tipo}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div>Orçado: {obra.orcamento}</div>
                      <div className="text-xs text-muted-foreground">Gasto: {obra.gasto}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm">
                      <div>Início: {new Date(obra.dataInicio).toLocaleDateString('pt-BR')}</div>
                      <div className="text-xs text-muted-foreground">Previsão: {new Date(obra.dataPrevisao).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Progresso: {obra.progresso}%</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${obra.progresso}%` }}
                  ></div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-1" />
                    Cronograma
                  </Button>
                  <Button variant="outline" size="sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    Financeiro
                  </Button>
                  <Button size="sm">
                    Ver Detalhes
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
