
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Hammer, Calendar, Camera, FileText, AlertTriangle, CheckCircle } from "lucide-react";

export default function Obras() {
  const obras = [
    {
      id: 1,
      nome: "Residencial Jardim das Flores",
      endereco: "Rua das Flores, 123",
      progresso: 75,
      status: "Em Andamento",
      statusColor: "bg-blue-500",
      previsao: "15/06/2024",
      responsavel: "Eng. Carlos Silva",
      fotos: 12
    },
    {
      id: 2,
      nome: "Condomínio Vista Verde",
      endereco: "Av. Principal, 456",
      progresso: 45,
      status: "Fundação",
      statusColor: "bg-yellow-500",
      previsao: "30/09/2024",
      responsavel: "Eng. Ana Costa",
      fotos: 8
    },
    {
      id: 3,
      nome: "Edifício Comercial Centro",
      endereco: "Rua Central, 789",
      progresso: 90,
      status: "Acabamento",
      statusColor: "bg-green-500",
      previsao: "05/04/2024",
      responsavel: "Eng. João Santos",
      fotos: 25
    },
  ];

  const cronograma = [
    { etapa: "Fundação", previsto: "01/01/2024", realizado: "05/01/2024", status: "Concluído" },
    { etapa: "Estrutura", previsto: "15/02/2024", realizado: "18/02/2024", status: "Concluído" },
    { etapa: "Alvenaria", previsto: "01/04/2024", realizado: "03/04/2024", status: "Concluído" },
    { etapa: "Cobertura", previsto: "15/05/2024", realizado: "-", status: "Em Andamento" },
    { etapa: "Instalações", previsto: "01/06/2024", realizado: "-", status: "Pendente" },
    { etapa: "Acabamento", previsto: "15/07/2024", realizado: "-", status: "Pendente" },
  ];

  const licencas = [
    { nome: "Alvará de Construção", status: "Válida", vencimento: "15/12/2024", cor: "text-green-600" },
    { nome: "Licença Ambiental", status: "Válida", vencimento: "30/08/2024", cor: "text-green-600" },
    { nome: "AVCB", status: "Vencida", vencimento: "10/01/2024", cor: "text-red-600" },
    { nome: "Habite-se", status: "Pendente", vencimento: "-", cor: "text-yellow-600" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Obras</h2>
          <p className="text-muted-foreground">Cronogramas, fotos e licenças de construção</p>
        </div>
        <Button>
          <Hammer className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Obras Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">3 concluindo este mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">75%</div>
            <p className="text-xs text-muted-foreground">2 obras atrasadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fotos Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">+12 esta semana</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Obras em Andamento</CardTitle>
          <CardDescription>Acompanhe o progresso das construções</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {obras.map((obra) => (
              <div key={obra.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{obra.nome}</h4>
                    <p className="text-sm text-muted-foreground">{obra.endereco}</p>
                    <p className="text-sm text-muted-foreground">Responsável: {obra.responsavel}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={`${obra.statusColor} text-white mb-1`}>
                      {obra.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground">Prev: {obra.previsao}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso Geral</span>
                    <span>{obra.progresso}%</span>
                  </div>
                  <Progress value={obra.progresso} className="h-2" />
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Calendar className="h-4 w-4 mr-1" />
                      Cronograma
                    </Button>
                    <Button size="sm" variant="outline">
                      <Camera className="h-4 w-4 mr-1" />
                      Fotos ({obra.fotos})
                    </Button>
                  </div>
                  <Button size="sm">Ver Detalhes</Button>
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
              <Calendar className="h-5 w-5 mr-2" />
              Cronograma - Residencial Jardim das Flores
            </CardTitle>
            <CardDescription>Acompanhamento das etapas da obra</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cronograma.map((etapa, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{etapa.etapa}</p>
                    <p className="text-sm text-muted-foreground">
                      Previsto: {etapa.previsto} | Realizado: {etapa.realizado || 'Pendente'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {etapa.status === 'Concluído' && <CheckCircle className="h-4 w-4 text-green-500" />}
                    {etapa.status === 'Em Andamento' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                    <Badge 
                      variant="outline" 
                      className={
                        etapa.status === 'Concluído' ? 'text-green-600 border-green-600' :
                        etapa.status === 'Em Andamento' ? 'text-blue-600 border-blue-600' :
                        'text-gray-600 border-gray-600'
                      }
                    >
                      {etapa.status}
                    </Badge>
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
              Licenças e Documentos
            </CardTitle>
            <CardDescription>Status das licenças de construção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {licencas.map((licenca, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{licenca.nome}</p>
                    <p className="text-sm text-muted-foreground">
                      {licenca.vencimento ? `Vencimento: ${licenca.vencimento}` : 'Aguardando emissão'}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${licenca.cor} border-current`}
                  >
                    {licenca.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
