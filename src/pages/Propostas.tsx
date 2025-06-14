import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, User, Edit, Eye, FileText } from "lucide-react";
import PropostaForm from "@/components/forms/PropostaForm";
import { usePropostas } from "@/hooks/useSupabaseQuery";

export default function Propostas() {
  const [showForm, setShowForm] = useState(false);
  const { data: propostas = [], isLoading } = usePropostas();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'em_analise': return 'bg-yellow-500';
      case 'aprovada': return 'bg-green-500';
      case 'rejeitada': return 'bg-red-500';
      case 'negociando': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'em_analise': return 'Em Análise';
      case 'aprovada': return 'Aprovada';
      case 'rejeitada': return 'Rejeitada';
      case 'negociando': return 'Negociando';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Propostas & Contratos</h2>
          <p className="text-muted-foreground">Gerencie propostas, contratos e documentação</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Proposta
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Nova Proposta</DialogTitle>
            </DialogHeader>
            <PropostaForm />
          </DialogContent>
        </Dialog>
      </div>

      {propostas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-96">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhuma proposta registrada</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece criando sua primeira proposta de compra.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira proposta
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {propostas.map((proposta) => (
            <Card key={proposta.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">
                      {proposta.imoveis?.titulo || 'Imóvel não especificado'}
                    </CardTitle>
                    <CardDescription className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {proposta.clientes?.nome || 'Cliente não especificado'}
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(proposta.status)} text-white`}>
                    {getStatusLabel(proposta.status)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">
                        Proposta: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.valor_proposta)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Valor imóvel: {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(proposta.imoveis?.valor || 0)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(proposta.created_at).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div className="flex space-x-2 md:col-span-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm">
                      Gerar Contrato
                    </Button>
                    <Button variant="outline" size="sm">
                      Histórico
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
