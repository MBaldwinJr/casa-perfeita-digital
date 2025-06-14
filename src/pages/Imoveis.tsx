
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Bath, Bed, Car, Edit, Eye, Home } from "lucide-react";
import { Label } from "@/components/ui/label";
import ImovelForm from "@/components/forms/ImovelForm";
import { useImoveis } from "@/hooks/useSupabaseQuery";

export default function Imoveis() {
  const [showForm, setShowForm] = useState(false);
  const [selectedImovel, setSelectedImovel] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const { data: imoveis = [], isLoading } = useImoveis();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-green-500';
      case 'reservado': return 'bg-yellow-500';
      case 'vendido': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'reservado': return 'Reservado';
      case 'vendido': return 'Vendido';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Imóveis</h2>
          <p className="text-muted-foreground">Cadastre e gerencie seu portfólio de imóveis</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Imóvel
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
            </DialogHeader>
            <ImovelForm 
              imovel={selectedImovel}
              onClose={() => {
                setShowForm(false);
                setSelectedImovel(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Imóvel</DialogTitle>
          </DialogHeader>
          {viewDetails && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Título</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.titulo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo</Label>
                  <p className="text-sm text-muted-foreground capitalize">{viewDetails.tipo}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="font-semibold">Endereço</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.endereco}</p>
                </div>
                <div>
                  <Label className="font-semibold">Cidade</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.cidade}</p>
                </div>
                <div>
                  <Label className="font-semibold">Estado</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.estado}</p>
                </div>
                <div>
                  <Label className="font-semibold">CEP</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.cep || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Valor</Label>
                  <p className="text-sm text-muted-foreground font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(viewDetails.valor)}
                  </p>
                </div>
                {viewDetails.area && (
                  <div>
                    <Label className="font-semibold">Área</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.area}m²</p>
                  </div>
                )}
                {viewDetails.quartos && (
                  <div>
                    <Label className="font-semibold">Quartos</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.quartos}</p>
                  </div>
                )}
                {viewDetails.banheiros && (
                  <div>
                    <Label className="font-semibold">Banheiros</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.banheiros}</p>
                  </div>
                )}
                {viewDetails.vagas && (
                  <div>
                    <Label className="font-semibold">Vagas</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.vagas}</p>
                  </div>
                )}
                <div>
                  <Label className="font-semibold">Status</Label>
                  <p className="text-sm text-muted-foreground capitalize">{getStatusLabel(viewDetails.status)}</p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Cadastro</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(viewDetails.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {viewDetails.descricao && (
                  <div className="md:col-span-2">
                    <Label className="font-semibold">Descrição</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.descricao}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {imoveis.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-96">
            <Home className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum imóvel cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando seu primeiro imóvel no sistema.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro imóvel
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {imoveis.map((imovel) => (
            <Card key={imovel.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg capitalize">{imovel.tipo}</CardTitle>
                  <Badge className={`${getStatusColor(imovel.status)} text-white`}>
                    {getStatusLabel(imovel.status)}
                  </Badge>
                </div>
                <CardDescription className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {imovel.endereco}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(imovel.valor)}
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    {imovel.quartos && (
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 mr-1" />
                        {imovel.quartos} quartos
                      </div>
                    )}
                    {imovel.banheiros && (
                      <div className="flex items-center">
                        <Bath className="h-4 w-4 mr-1" />
                        {imovel.banheiros} banheiros
                      </div>
                    )}
                    {imovel.vagas && (
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {imovel.vagas} vagas
                      </div>
                    )}
                    {imovel.area && (
                      <div className="text-sm text-muted-foreground">
                        {imovel.area}m²
                      </div>
                    )}
                  </div>

                   <div className="flex space-x-2">
                     <Button 
                       variant="outline" 
                       size="sm" 
                       className="flex-1"
                       onClick={() => setViewDetails(imovel)}
                     >
                       <Eye className="h-4 w-4 mr-1" />
                       Ver Detalhes
                     </Button>
                     <Button 
                       size="sm" 
                       className="flex-1"
                       onClick={() => {
                         setSelectedImovel(imovel);
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
    </div>
  );
}
