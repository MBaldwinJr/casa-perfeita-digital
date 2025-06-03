
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, MapPin, Bath, Bed, Car } from "lucide-react";

export default function Imoveis() {
  const imoveis = [
    {
      id: 1,
      tipo: "Casa",
      endereco: "Rua das Flores, 123 - Jardim América",
      preco: "R$ 450.000",
      quartos: 3,
      banheiros: 2,
      vagas: 2,
      status: "Disponível",
      statusColor: "bg-green-500",
    },
    {
      id: 2,
      tipo: "Terreno",
      endereco: "Av. Principal, 456 - Centro",
      preco: "R$ 280.000",
      area: "500m²",
      status: "Reservado",
      statusColor: "bg-yellow-500",
    },
    {
      id: 3,
      tipo: "Casa",
      endereco: "Rua do Sol, 789 - Vila Nova",
      preco: "R$ 320.000",
      quartos: 2,
      banheiros: 1,
      vagas: 1,
      status: "Vendido",
      statusColor: "bg-red-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Imóveis</h2>
          <p className="text-muted-foreground">Cadastre e gerencie seu portfólio de imóveis</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Imóvel
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {imoveis.map((imovel) => (
          <Card key={imovel.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{imovel.tipo}</CardTitle>
                <Badge className={`${imovel.statusColor} text-white`}>
                  {imovel.status}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {imovel.endereco}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-2xl font-bold text-primary">{imovel.preco}</div>
                
                {imovel.tipo === "Casa" ? (
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      {imovel.quartos} quartos
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      {imovel.banheiros} banheiros
                    </div>
                    <div className="flex items-center">
                      <Car className="h-4 w-4 mr-1" />
                      {imovel.vagas} vagas
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    Área: {imovel.area}
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                  <Button size="sm" className="flex-1">
                    Editar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
