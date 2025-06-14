
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MapPin, Bath, Bed, Car, Edit, Eye, Home } from "lucide-react";
import ImovelForm from "@/components/forms/ImovelForm";
import { useImoveis } from "@/hooks/useSupabaseQuery";

export default function Imoveis() {
  const [showForm, setShowForm] = useState(false);
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
            <ImovelForm />
          </DialogContent>
        </Dialog>
      </div>

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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                    <Button size="sm" className="flex-1">
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
