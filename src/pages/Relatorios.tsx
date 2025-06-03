
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, DollarSign, Users, Building2, FileText, Download, Filter } from "lucide-react";

export default function Relatorios() {
  const metricas = [
    { nome: "Vendas Realizadas", valor: "R$ 2.4M", variacao: "+18%", cor: "text-green-600" },
    { nome: "Imóveis Vendidos", valor: "34", variacao: "+12%", cor: "text-green-600" },
    { nome: "Novos Clientes", valor: "89", variacao: "+25%", cor: "text-green-600" },
    { nome: "Ticket Médio", valor: "R$ 387K", variacao: "-5%", cor: "text-red-600" },
  ];

  const vendasPorMes = [
    { mes: "Jan", vendas: 8, valor: "R$ 1.2M" },
    { mes: "Fev", vendas: 12, valor: "R$ 1.8M" },
    { mes: "Mar", vendas: 15, valor: "R$ 2.1M" },
    { mes: "Abr", vendas: 10, valor: "R$ 1.5M" },
    { mes: "Mai", vendas: 18, valor: "R$ 2.4M" },
  ];

  const topCorretores = [
    { nome: "Ana Silva", vendas: 12, comissao: "R$ 48.000", percentual: 85 },
    { nome: "Carlos Santos", vendas: 10, comissao: "R$ 42.000", percentual: 72 },
    { nome: "Maria Costa", vendas: 8, comissao: "R$ 35.000", percentual: 68 },
    { nome: "João Oliveira", vendas: 6, comissao: "R$ 28.000", percentual: 55 },
  ];

  const relatoriosDisponiveis = [
    { nome: "Relatório de Vendas Mensal", descricao: "Vendas por período, corretor e região", tipo: "Excel" },
    { nome: "Análise de Clientes", descricao: "Perfil e comportamento dos compradores", tipo: "PDF" },
    { nome: "Portfólio de Imóveis", descricao: "Inventário completo com status", tipo: "Excel" },
    { nome: "Comissões e Pagamentos", descricao: "Relatório financeiro detalhado", tipo: "PDF" },
    { nome: "Funil de Vendas", descricao: "Análise do processo comercial", tipo: "Dashboard" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
          <p className="text-muted-foreground">Análises detalhadas do desempenho do negócio</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {metricas.map((metrica, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">{metrica.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrica.valor}</div>
              <p className={`text-xs ${metrica.cor}`}>{metrica.variacao} vs mês anterior</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Vendas por Mês
            </CardTitle>
            <CardDescription>Performance mensal de vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendasPorMes.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{item.mes}/2024</p>
                    <p className="text-sm text-muted-foreground">{item.vendas} imóveis vendidos</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{item.valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Top Corretores
            </CardTitle>
            <CardDescription>Ranking de performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCorretores.map((corretor, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{corretor.nome}</p>
                      <p className="text-sm text-muted-foreground">{corretor.vendas} vendas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{corretor.comissao}</p>
                    <Badge 
                      variant="outline"
                      className={
                        corretor.percentual >= 80 ? 'text-green-600 border-green-600' :
                        corretor.percentual >= 60 ? 'text-yellow-600 border-yellow-600' :
                        'text-red-600 border-red-600'
                      }
                    >
                      {corretor.percentual}% meta
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>Gere relatórios personalizados para análise</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {relatoriosDisponiveis.map((relatorio, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold">{relatorio.nome}</h4>
                    <p className="text-sm text-muted-foreground">{relatorio.descricao}</p>
                  </div>
                  <Badge variant="outline">{relatorio.tipo}</Badge>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Baixar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Conversão do Funil</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Leads Gerados</span>
                <span className="font-bold">450</span>
              </div>
              <div className="flex justify-between">
                <span>Qualificados</span>
                <span className="font-bold">180 (40%)</span>
              </div>
              <div className="flex justify-between">
                <span>Propostas</span>
                <span className="font-bold">65 (14%)</span>
              </div>
              <div className="flex justify-between">
                <span>Vendas</span>
                <span className="font-bold text-green-600">34 (8%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tipos de Imóveis</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Casas</span>
                <span className="font-bold">60%</span>
              </div>
              <div className="flex justify-between">
                <span>Terrenos</span>
                <span className="font-bold">25%</span>
              </div>
              <div className="flex justify-between">
                <span>Apartamentos</span>
                <span className="font-bold">15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Origem dos Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Site/Online</span>
                <span className="font-bold">45%</span>
              </div>
              <div className="flex justify-between">
                <span>Indicação</span>
                <span className="font-bold">30%</span>
              </div>
              <div className="flex justify-between">
                <span>Placa/Fachada</span>
                <span className="font-bold">25%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
