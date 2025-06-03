
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Download, FileText, Users, Building2, DollarSign } from "lucide-react";
import RelatorioVendas from "@/components/reports/RelatorioVendas";
import RelatorioClientes from "@/components/reports/RelatorioClientes";
import { toast } from "@/hooks/use-toast";

export default function Relatorios() {
  const [activeTab, setActiveTab] = useState("vendas");

  const relatoriosRapidos = [
    {
      titulo: "Vendas do Mês",
      descricao: "Relatório completo de vendas do mês atual",
      icone: DollarSign,
      acao: () => toast({ title: "Gerando relatório de vendas..." })
    },
    {
      titulo: "Base de Clientes",
      descricao: "Análise completa da base de clientes",
      icone: Users,
      acao: () => toast({ title: "Gerando relatório de clientes..." })
    },
    {
      titulo: "Estoque de Imóveis",
      descricao: "Status atual do portfólio de imóveis",
      icone: Building2,
      acao: () => toast({ title: "Gerando relatório de imóveis..." })
    },
    {
      titulo: "Performance Geral",
      descricao: "Dashboard executivo com KPIs principais",
      icone: BarChart3,
      acao: () => toast({ title: "Gerando dashboard executivo..." })
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Relatórios e Análises</h2>
          <p className="text-muted-foreground">Insights e métricas do seu negócio</p>
        </div>
        <Button>
          <FileText className="h-4 w-4 mr-2" />
          Relatório Personalizado
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {relatoriosRapidos.map((relatorio, index) => (
          <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={relatorio.acao}>
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-2">
                <relatorio.icone className="h-5 w-5 text-primary" />
                <CardTitle className="text-sm font-medium">{relatorio.titulo}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-3">{relatorio.descricao}</p>
              <Button size="sm" variant="outline" className="w-full">
                <Download className="h-3 w-3 mr-1" />
                Gerar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Detalhados</CardTitle>
          <CardDescription>Análises aprofundadas por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="vendas">Vendas</TabsTrigger>
              <TabsTrigger value="clientes">Clientes</TabsTrigger>
              <TabsTrigger value="imoveis">Imóveis</TabsTrigger>
              <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
            </TabsList>

            <TabsContent value="vendas" className="mt-6">
              <RelatorioVendas />
            </TabsContent>

            <TabsContent value="clientes" className="mt-6">
              <RelatorioClientes />
            </TabsContent>

            <TabsContent value="imoveis" className="mt-6">
              <div className="text-center py-12">
                <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatório de Imóveis</h3>
                <p className="text-muted-foreground mb-4">Análise detalhada do portfólio de imóveis</p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="financeiro" className="mt-6">
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Relatório Financeiro</h3>
                <p className="text-muted-foreground mb-4">Análise financeira completa</p>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Gerar Relatório
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
