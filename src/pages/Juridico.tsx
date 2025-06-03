
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Scale, AlertTriangle, CheckCircle, FileText, Clock, Eye } from "lucide-react";

export default function Juridico() {
  const processos = [
    {
      id: 1,
      imovel: "Casa - Jardim América",
      cliente: "João Silva",
      etapa: "Análise de Documentos",
      progresso: 75,
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      alertas: 1
    },
    {
      id: 2,
      imovel: "Terreno - Centro",
      cliente: "Maria Santos",
      etapa: "Certidões Negativas",
      progresso: 90,
      status: "Quase Pronto",
      statusColor: "bg-green-500",
      alertas: 0
    },
    {
      id: 3,
      imovel: "Casa - Vila Nova",
      cliente: "Pedro Costa",
      etapa: "Escritura",
      progresso: 40,
      status: "Pendente",
      statusColor: "bg-yellow-500",
      alertas: 2
    },
  ];

  const documentos = [
    { nome: "Certidão de Ônus Reais", status: "Válida", vencimento: "15/03/2024", cor: "text-green-600" },
    { nome: "Certidão de Distribuição", status: "Vencida", vencimento: "10/01/2024", cor: "text-red-600" },
    { nome: "IPTU", status: "Válida", vencimento: "30/06/2024", cor: "text-green-600" },
    { nome: "Matrícula Atualizada", status: "Pendente", vencimento: "-", cor: "text-yellow-600" },
  ];

  const alertasJuridicos = [
    { tipo: "Urgente", mensagem: "Certidão de distribuição vencida - Casa Jardim América", cor: "bg-red-500" },
    { tipo: "Atenção", mensagem: "IPTU em atraso - Terreno Centro", cor: "bg-yellow-500" },
    { tipo: "Info", mensagem: "Nova certidão disponível para retirada", cor: "bg-blue-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Módulo Jurídico</h2>
          <p className="text-muted-foreground">Verificação de documentos e processos legais</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Nova Análise
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Processos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Documentos Válidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">86%</div>
            <p className="text-xs text-muted-foreground">3 documentos vencidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Alertas Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">5</div>
            <p className="text-xs text-muted-foreground">2 urgentes</p>
          </CardContent>
        </Card>
      </div>

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
            {alertasJuridicos.map((alerta, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg">
                <Badge className={`${alerta.cor} text-white`}>
                  {alerta.tipo}
                </Badge>
                <span className="flex-1">{alerta.mensagem}</span>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Processos em Andamento</CardTitle>
          <CardDescription>Acompanhe o status dos processos jurídicos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processos.map((processo) => (
              <div key={processo.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{processo.imovel}</h4>
                    <p className="text-sm text-muted-foreground">{processo.cliente}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {processo.alertas > 0 && (
                      <Badge className="bg-red-500 text-white">
                        {processo.alertas} alerta{processo.alertas > 1 ? 's' : ''}
                      </Badge>
                    )}
                    <Badge className={`${processo.statusColor} text-white`}>
                      {processo.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Etapa: {processo.etapa}</span>
                    <span>{processo.progresso}%</span>
                  </div>
                  <Progress value={processo.progresso} className="h-2" />
                </div>
                
                <div className="flex space-x-2 mt-3">
                  <Button size="sm" variant="outline">Ver Documentos</Button>
                  <Button size="sm">Atualizar Status</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Status dos Documentos</CardTitle>
          <CardDescription>Verificação automática de validade</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {documentos.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{doc.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    Vencimento: {doc.vencimento}
                  </p>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="outline" 
                    className={`${doc.cor} border-current`}
                  >
                    {doc.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
