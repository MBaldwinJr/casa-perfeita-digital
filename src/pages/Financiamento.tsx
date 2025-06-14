
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, CreditCard, Calendar, DollarSign, Building, User, Eye, Edit } from "lucide-react";
import FinanciamentoForm from "@/components/forms/FinanciamentoForm";
import { useFinanciamentos } from "@/hooks/useSupabaseQuery";

export default function Financiamento() {
  const [showForm, setShowForm] = useState(false);
  const { data: financiamentos = [], isLoading } = useFinanciamentos();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'analise': return 'bg-blue-500';
      case 'aprovado': return 'bg-green-500';
      case 'negado': return 'bg-red-500';
      case 'aguardando_documentos': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'analise': return 'Em Análise';
      case 'aprovado': return 'Aprovado';
      case 'negado': return 'Negado';
      case 'aguardando_documentos': return 'Aguardando Documentos';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Financiamento Imobiliário</h2>
          <p className="text-muted-foreground">Gerencie solicitações e acompanhe financiamentos</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Financiamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Financiamento</DialogTitle>
            </DialogHeader>
            <FinanciamentoForm />
          </DialogContent>
        </Dialog>
      </div>

      {financiamentos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-96">
            <CreditCard className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum financiamento registrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando sua primeira solicitação de financiamento.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro financiamento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {financiamentos.map((financiamento) => (
            <Card key={financiamento.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {financiamento.clientes?.nome || 'Cliente não especificado'}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <Building className="h-4 w-4 mr-1" />
                      {financiamento.imoveis?.titulo || 'Imóvel não especificado'}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(financiamento.status)} text-white`}>
                    {getStatusLabel(financiamento.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Banco: {financiamento.banco}</div>
                      <div className="text-xs text-muted-foreground">
                        Valor: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(financiamento.valor_financiado)}
                      </div>
                    </div>
                  </div>
                  {financiamento.valor_parcela && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="text-sm font-medium">
                          Parcela: {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(financiamento.valor_parcela)}
                        </div>
                        {financiamento.prazo_meses && (
                          <div className="text-xs text-muted-foreground">
                            {financiamento.prazo_meses} meses
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(financiamento.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
