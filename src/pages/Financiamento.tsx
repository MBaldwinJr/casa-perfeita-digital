
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CreditCard, DollarSign, FileText, CheckCircle, Clock, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Financiamento() {
  const [showForm, setShowForm] = useState(false);

  const financiamentos = [
    {
      id: 1,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      valor: "R$ 420.000",
      banco: "Caixa Econômica",
      status: "Em Análise",
      statusColor: "bg-blue-500",
      progresso: 60,
      dataSubmissao: "2024-01-10",
      prazoResposta: "2024-02-10"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      imovel: "Terreno - Centro",
      valor: "R$ 280.000",
      banco: "Banco do Brasil",
      status: "Aprovado",
      statusColor: "bg-green-500",
      progresso: 100,
      dataSubmissao: "2024-01-05",
      prazoResposta: "2024-01-25"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      imovel: "Casa - Vila Nova",
      valor: "R$ 300.000",
      banco: "Santander",
      status: "Documentação Pendente",
      statusColor: "bg-yellow-500",
      progresso: 30,
      dataSubmissao: "2024-01-15",
      prazoResposta: "2024-02-20"
    }
  ];

  const bancos = [
    { nome: "Caixa Econômica", taxa: "8,5%", prazo: "30 dias", status: "Ativo" },
    { nome: "Banco do Brasil", taxa: "8,8%", prazo: "25 dias", status: "Ativo" },
    { nome: "Santander", taxa: "9,2%", prazo: "35 dias", status: "Ativo" },
    { nome: "Itaú", taxa: "9,0%", prazo: "28 days", status: "Ativo" }
  ];

  const simularFinanciamento = () => {
    toast({
      title: "Simulação iniciada!",
      description: "Calculando as melhores opções de financiamento...",
    });
  };

  const enviarDocumentacao = (cliente: string) => {
    toast({
      title: "Documentos enviados!",
      description: `Documentação de ${cliente} enviada ao banco.`,
    });
  };

  const acompanharStatus = (cliente: string) => {
    toast({
      title: "Status atualizado",
      description: `Verificando status do financiamento de ${cliente}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financiamento Imobiliário</h2>
          <p className="text-muted-foreground">Gestão de financiamentos e parcerias bancárias</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={simularFinanciamento}>
            <CreditCard className="h-4 w-4 mr-2" />
            Simular
          </Button>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Financiamento
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Solicitações Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">5 aprovadas este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">média dos últimos 6 meses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Valor Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 315K</div>
            <p className="text-xs text-muted-foreground">+12% vs mês anterior</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Prazo Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28 dias</div>
            <p className="text-xs text-muted-foreground">para aprovação</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Financiamentos em Andamento</CardTitle>
          <CardDescription>Acompanhe o status das solicitações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {financiamentos.map((financiamento) => (
              <div key={financiamento.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold">{financiamento.cliente}</h4>
                    <p className="text-sm text-muted-foreground">{financiamento.imovel}</p>
                    <p className="text-sm">Banco: {financiamento.banco}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={`${financiamento.statusColor} text-white`}>
                      {financiamento.status}
                    </Badge>
                    <p className="text-sm font-semibold">{financiamento.valor}</p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <span>{financiamento.progresso}%</span>
                  </div>
                  <Progress value={financiamento.progresso} className="w-full" />
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Enviado: {new Date(financiamento.dataSubmissao).toLocaleDateString('pt-BR')}</span>
                    <span>Prazo: {new Date(financiamento.prazoResposta).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => enviarDocumentacao(financiamento.cliente)}>
                      <FileText className="h-4 w-4 mr-1" />
                      Documentos
                    </Button>
                    <Button size="sm" onClick={() => acompanharStatus(financiamento.cliente)}>
                      Acompanhar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            Parcerias Bancárias
          </CardTitle>
          <CardDescription>Condições e taxas dos bancos parceiros</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {bancos.map((banco, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{banco.nome}</h4>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    {banco.status}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span>Taxa:</span>
                    <span className="font-medium">{banco.taxa}</span>
                  </p>
                  <p className="flex justify-between">
                    <span>Prazo:</span>
                    <span className="font-medium">{banco.prazo}</span>
                  </p>
                </div>
                <Button size="sm" className="w-full mt-3" onClick={simularFinanciamento}>
                  Simular
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
