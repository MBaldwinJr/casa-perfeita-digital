
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MessageSquare, Receipt, Phone, Mail, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function PosVenda() {
  const atendimentos = [
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

  const recibos = [
    { id: 1, cliente: "João Silva", valor: "R$ 1.200,00", referencia: "Janeiro/2024", status: "Pago" },
    { id: 2, cliente: "Maria Santos", valor: "R$ 800,00", referencia: "Janeiro/2024", status: "Pendente" },
    { id: 3, cliente: "Pedro Costa", valor: "R$ 950,00", referencia: "Janeiro/2024", status: "Pago" },
  ];

  const satisfacao = [
    { periodo: "Janeiro 2024", nota: 4.8, respostas: 45 },
    { periodo: "Dezembro 2023", nota: 4.6, respostas: 38 },
    { periodo: "Novembro 2023", nota: 4.9, respostas: 42 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Pós-venda</h2>
          <p className="text-muted-foreground">Suporte ao cliente e acompanhamento</p>
        </div>
        <Button>
          <MessageSquare className="h-4 w-4 mr-2" />
          Novo Atendimento
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Atendimentos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">5 urgentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">4.8</div>
            <p className="text-xs text-muted-foreground">de 5.0 estrelas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Tempo Resposta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5h</div>
            <p className="text-xs text-muted-foreground">tempo médio</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Recibos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">8</div>
            <p className="text-xs text-muted-foreground">R$ 12.400,00</p>
          </CardContent>
        </Card>
      </div>

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
                    <Button size="sm" variant="outline">
                      <Phone className="h-4 w-4 mr-1" />
                      Ligar
                    </Button>
                    <Button size="sm" variant="outline">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Receipt className="h-5 w-5 mr-2" />
              Recibos e Cobrança
            </CardTitle>
            <CardDescription>Gestão de recibos mensais</CardDescription>
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
            <Button className="w-full mt-4">
              <Receipt className="h-4 w-4 mr-2" />
              Gerar Novos Recibos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pesquisa de Satisfação</CardTitle>
            <CardDescription>Avaliações dos clientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {satisfacao.map((pesquisa, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{pesquisa.periodo}</p>
                    <p className="text-sm text-muted-foreground">{pesquisa.respostas} respostas</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <span className="font-bold text-lg">{pesquisa.nota}</span>
                      <span className="text-yellow-500">★</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button className="w-full mt-4" variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Enviar Nova Pesquisa
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
