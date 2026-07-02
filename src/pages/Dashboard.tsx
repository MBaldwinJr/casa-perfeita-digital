
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, Users, FileText, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";
import { useClientes, useImoveis, usePropostas, useFinanciamentos } from "@/hooks/useSupabaseQuery";

export default function Dashboard() {
  const { data: clientes = [] } = useClientes();
  const { data: imoveis = [] } = useImoveis();
  const { data: propostas = [] } = usePropostas();
  const { data: financiamentos = [] } = useFinanciamentos();

  const imoveisDisponiveis = imoveis.filter(i => i.status === 'disponivel').length;
  const propostasPendentes = propostas.filter(p => p.status === 'em_analise').length;
  const vendasMes = propostas
    .filter(p => p.status === 'aprovada' && new Date(p.created_at).getMonth() === new Date().getMonth())
    .reduce((total, p) => total + p.valor_proposta, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do seu negócio imobiliário</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Última atualização</p>
          <p className="font-semibold">{new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Imóveis Cadastrados</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{imoveis.length}</div>
            <p className="text-xs text-muted-foreground">{imoveisDisponiveis} disponíveis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{clientes.length}</div>
            <p className="text-xs text-muted-foreground">Total de clientes cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{propostasPendentes}</div>
            <p className="text-xs text-muted-foreground">Aguardando análise</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas do Mês</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(vendasMes)}
            </div>
            <p className="text-xs text-muted-foreground">Vendas aprovadas este mês</p>
          </CardContent>
        </Card>
      </div>

      <AnalyticsDashboard />

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Alertas Importantes</CardTitle>
            <CardDescription>Pendências que requerem atenção</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Documentação Pendente</p>
                <p className="text-sm text-muted-foreground">3 imóveis com documentação incompleta</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Contratos Vencendo</p>
                <p className="text-sm text-muted-foreground">2 contratos vencem em 7 dias</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">Financiamentos Aprovados</p>
                <p className="text-sm text-muted-foreground">5 clientes com financiamento aprovado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>Últimas movimentações do sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Nova proposta recebida</p>
                <p className="text-sm text-muted-foreground">Casa no Jardim América - há 2 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Contrato assinado</p>
                <p className="text-sm text-muted-foreground">Terreno no Centro - há 4 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Cliente cadastrado</p>
                <p className="text-sm text-muted-foreground">Maria Silva - há 6 horas</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="h-2 w-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium">Imóvel adicionado</p>
                <p className="text-sm text-muted-foreground">Casa Vila Nova - há 8 horas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
