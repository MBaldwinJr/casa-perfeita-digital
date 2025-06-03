
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Atendimento {
  id: number;
  cliente: string;
  imovel: string;
  tipo: string;
  assunto: string;
  status: string;
  statusColor: string;
  dataAbertura: string;
  prioridade: string;
}

export default function AtendimentosList() {
  const atendimentos: Atendimento[] = [
    {
      id: 1,
      cliente: "João Silva",
      imovel: "Casa - Jardim América",
      tipo: "Reparo",
      assunto: "Problema na torneira da cozinha",
      status: "Aberto",
      statusColor: "bg-red-500",
      dataAbertura: "2024-01-15",
      prioridade: "Média"
    },
    {
      id: 2,
      cliente: "Maria Santos",
      imovel: "Terreno - Centro",
      tipo: "Dúvida",
      assunto: "Documentação de transferência",
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      dataAbertura: "2024-01-14",
      prioridade: "Baixa"
    },
    {
      id: 3,
      cliente: "Pedro Costa",
      imovel: "Casa - Vila Nova",
      tipo: "Garantia",
      assunto: "Infiltração na parede",
      status: "Resolvido",
      statusColor: "bg-green-500",
      dataAbertura: "2024-01-10",
      prioridade: "Alta"
    },
  ];

  const ligarCliente = (cliente: string) => {
    toast({
      title: "Ligação iniciada",
      description: `Iniciando ligação para ${cliente}...`,
    });
  };

  const enviarEmail = (cliente: string) => {
    toast({
      title: "Email enviado",
      description: `Email enviado para ${cliente} com sucesso.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Atendimentos Recentes</CardTitle>
        <CardDescription>Solicitações e suporte ao cliente</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {atendimentos.map((atendimento) => (
            <div key={atendimento.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{atendimento.cliente}</h4>
                  <p className="text-sm text-muted-foreground">{atendimento.imovel}</p>
                  <p className="text-sm">{atendimento.assunto}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge className={`${atendimento.statusColor} text-white`}>
                    {atendimento.status}
                  </Badge>
                  <Badge 
                    variant="outline"
                    className={
                      atendimento.prioridade === 'Alta' ? 'text-red-600 border-red-600' :
                      atendimento.prioridade === 'Média' ? 'text-yellow-600 border-yellow-600' :
                      'text-green-600 border-green-600'
                    }
                  >
                    {atendimento.prioridade}
                  </Badge>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Tipo: {atendimento.tipo}</span>
                  <span>Abertura: {new Date(atendimento.dataAbertura).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => ligarCliente(atendimento.cliente)}>
                    <Phone className="h-4 w-4 mr-1" />
                    Ligar
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => enviarEmail(atendimento.cliente)}>
                    <Mail className="h-4 w-4 mr-1" />
                    Email
                  </Button>
                  <Button size="sm">Responder</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
