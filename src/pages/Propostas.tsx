import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Calendar, DollarSign, User, Edit, Eye, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import PropostaForm from "@/components/forms/PropostaForm";
import ContractModal from "@/components/modals/ContractModal";
import { usePropostas } from "@/hooks/useSupabaseQuery";

export default function Propostas() {
  const [showForm, setShowForm] = useState(false);
  const [selectedProposta, setSelectedProposta] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [showContractModal, setShowContractModal] = useState(false);
  const [contractProposta, setContractProposta] = useState(null);
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
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
            <PropostaForm 
              proposta={selectedProposta}
              onClose={() => {
                setShowForm(false);
                setSelectedProposta(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Proposta</DialogTitle>
          </DialogHeader>
          {viewDetails && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.clientes?.nome || 'Cliente não especificado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Imóvel</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.imoveis?.titulo || 'Imóvel não especificado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Valor da Proposta</Label>
                  <p className="text-sm text-muted-foreground font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(viewDetails.valor_proposta)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Valor do Imóvel</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(viewDetails.imoveis?.valor || 0)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Forma de Pagamento</Label>
                  <p className="text-sm text-muted-foreground capitalize">{viewDetails.forma_pagamento.replace('_', ' ')}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="text-sm text-muted-foreground capitalize">{getStatusLabel(viewDetails.status)}</p>
                </div>
                {viewDetails.entrada && (
                  <div>
                    <Label className="font-semibold">Entrada</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(viewDetails.entrada)}
                    </p>
                  </div>
                )}
                {viewDetails.financiamento && (
                  <div>
                    <Label className="font-semibold">Financiamento</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(viewDetails.financiamento)}
                    </p>
                  </div>
                )}
                {viewDetails.data_vencimento && (
                  <div>
                    <Label className="font-semibold">Data de Vencimento</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(viewDetails.data_vencimento).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                {viewDetails.data_assinatura && (
                  <div>
                    <Label className="font-semibold">Data de Assinatura</Label>
                    <p className="text-sm text-muted-foreground">
                      {new Date(viewDetails.data_assinatura).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                )}
                <div>
                  <Label className="font-semibold">Data de Criação</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(viewDetails.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {viewDetails.observacoes && (
                  <div className="md:col-span-2">
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => setViewDetails(proposta)}
                     >
                       <Eye className="h-4 w-4 mr-1" />
                       Ver Detalhes
                     </Button>
                     <Button 
                       size="sm"
                       onClick={() => {
                         setContractProposta(proposta);
                         setShowContractModal(true);
                       }}
                     >
                       Gerar Contrato
                     </Button>
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => {
                         setSelectedProposta(proposta);
                         setShowForm(true);
                       }}
                     >
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

      {/* Modal de Geração de Contrato */}
      <ContractModal 
        open={showContractModal}
        onOpenChange={setShowContractModal}
        proposta={contractProposta}
      />
    </div>
  );
}
