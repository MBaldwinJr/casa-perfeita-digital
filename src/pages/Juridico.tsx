
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Scale, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Juridico() {
  const [showForm, setShowForm] = useState(false);

  const processos = [
    {
      id: 1,
      numero: "2024.001.001",
      tipo: "Regularização",
      imovel: "Casa - Jardim América",
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      dataInicio: "2024-01-10",
      prazo: "2024-03-10",
      advogado: "Dr. Carlos Silva",
      prioridade: "Media"
    },
    {
      id: 2,
      numero: "2024.001.002",
      tipo: "ITBI",
      imovel: "Terreno - Centro",
      status: "Concluído",
      statusColor: "bg-green-500",
      dataInicio: "2024-01-05",
      prazo: "2024-02-05",
      advogado: "Dra. Ana Santos",
      prioridade: "Alta"
    },
    {
      id: 3,
      numero: "2024.001.003",
      tipo: "Escritura",
      imovel: "Casa - Vila Nova",
      status: "Pendente",
      statusColor: "bg-yellow-500",
      dataInicio: "2024-01-15",
      prazo: "2024-02-20",
      advogado: "Dr. João Costa",
      prioridade: "Baixa"
    }
  ];

  const documentos = [
    { nome: "Certidão de Registro", status: "Válido", vencimento: "2024-12-15" },
    { nome: "Alvará de Construção", status: "Pendente", vencimento: "2024-03-20" },
    { nome: "Habite-se", status: "Válido", vencimento: "2025-01-10" },
    { nome: "Licença Ambiental", status: "Vencido", vencimento: "2024-01-05" }
  ];

  const gerarContrato = () => {
    toast({
      title: "Contrato gerado!",
      description: "O contrato foi gerado e está pronto para assinatura.",
    });
  };

  const verificarDocumento = (doc: string) => {
    toast({
      title: "Verificação iniciada",
      description: `Verificando ${doc}...`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Departamento Jurídico</h2>
          <p className="text-muted-foreground">Gestão de processos e documentação legal</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Processo
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 com prazo próximo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">85%</div>
            <p className="text-xs text-muted-foreground">34 de 40 documentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Contratos Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">7</div>
            <p className="text-xs text-muted-foreground">aguardando assinatura</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">3</div>
            <p className="text-xs text-muted-foreground">prazos vencendo</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Processos em Andamento</CardTitle>
          <CardDescription>Acompanhamento de processos jurídicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processos.map((processo) => (
              <div key={processo.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">Processo {processo.numero}</h4>
                    <p className="text-sm text-muted-foreground">{processo.imovel}</p>
                    <p className="text-sm">Tipo: {processo.tipo}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={`${processo.statusColor} text-white`}>
                      {processo.status}
                    </Badge>
                    <Badge 
                      variant="outline"
                      className={
                        processo.prioridade === 'Alta' ? 'text-red-600 border-red-600' :
                        processo.prioridade === 'Media' ? 'text-yellow-600 border-yellow-600' :
                        'text-green-600 border-green-600'
                      }
                    >
                      {processo.prioridade}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Advogado: {processo.advogado}</span>
                    <span>Prazo: {new Date(processo.prazo).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <FileText className="h-4 w-4 mr-1" />
                      Documentos
                    </Button>
                    <Button size="sm" onClick={gerarContrato}>
                      Gerar Contrato
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
            <FileText className="h-5 w-5 mr-2" />
            Status dos Documentos
          </CardTitle>
          <CardDescription>Validade e situação da documentação</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {documentos.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{doc.nome}</p>
                  <p className="text-sm text-muted-foreground">Vence: {new Date(doc.vencimento).toLocaleDateString('pt-BR')}</p>
                </div>
                <div className="text-right space-y-1">
                  <Badge 
                    variant="outline"
                    className={
                      doc.status === 'Válido' ? 'text-green-600 border-green-600' :
                      doc.status === 'Pendente' ? 'text-yellow-600 border-yellow-600' :
                      'text-red-600 border-red-600'
                    }
                  >
                    {doc.status}
                  </Badge>
                  <Button size="sm" variant="ghost" onClick={() => verificarDocumento(doc.nome)}>
                    Verificar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
