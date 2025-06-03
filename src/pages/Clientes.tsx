
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Phone, Mail, FileText } from "lucide-react";

export default function Clientes() {
  const clientes = [
    {
      id: 1,
      nome: "João Silva",
      email: "joao@email.com",
      telefone: "(11) 99999-9999",
      interesse: "Casa - Jardim América",
      status: "Ativo",
      statusColor: "bg-green-500",
      documentos: "Completo",
    },
    {
      id: 2,
      nome: "Maria Santos",
      email: "maria@email.com",
      telefone: "(11) 88888-8888",
      interesse: "Terreno - Centro",
      status: "Aguardando Documentos",
      statusColor: "bg-yellow-500",
      documentos: "Pendente",
    },
    {
      id: 3,
      nome: "Pedro Costa",
      email: "pedro@email.com",
      telefone: "(11) 77777-7777",
      interesse: "Casa - Vila Nova",
      status: "Financiamento Aprovado",
      statusColor: "bg-blue-500",
      documentos: "Completo",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerencie seu cadastro de compradores e interessados</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="grid gap-6">
        {clientes.map((cliente) => (
          <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                  <CardDescription>{cliente.interesse}</CardDescription>
                </div>
                <Badge className={`${cliente.statusColor} text-white`}>
                  {cliente.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{cliente.telefone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Docs: {cliente.documentos}</span>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                  <Button size="sm">
                    Editar
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
