import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Home, MapPin, DollarSign, Bed, Bath, Car } from "lucide-react";
import { useCreateImovel } from "@/hooks/useSupabaseQuery";

interface ImovelFormProps {
  imovel?: any;
  onClose?: () => void;
}

export default function ImovelForm({ imovel: imovelInicial, onClose }: ImovelFormProps = {}) {
  const [imovel, setImovel] = useState({
    titulo: imovelInicial?.titulo || '',
    tipo: imovelInicial?.tipo || '',
    endereco: imovelInicial?.endereco || '',
    cidade: imovelInicial?.cidade || '',
    estado: imovelInicial?.estado || '',
    cep: imovelInicial?.cep || '',
    area: imovelInicial?.area?.toString() || '',
    quartos: imovelInicial?.quartos?.toString() || '',
    banheiros: imovelInicial?.banheiros?.toString() || '',
    vagas: imovelInicial?.vagas?.toString() || '',
    valor: imovelInicial?.valor?.toString() || '',
    status: imovelInicial?.status || 'disponivel',
    descricao: imovelInicial?.descricao || ''
  });

  const createImovel = useCreateImovel();

  const salvarImovel = () => {
    if (!imovel.titulo.trim() || !imovel.tipo || !imovel.endereco.trim() || !imovel.valor) {
      return;
    }

    createImovel.mutate({
      titulo: imovel.titulo,
      tipo: imovel.tipo,
      endereco: imovel.endereco,
      cidade: imovel.cidade,
      estado: imovel.estado,
      cep: imovel.cep || undefined,
      area: imovel.area ? parseFloat(imovel.area) : undefined,
      quartos: imovel.quartos ? parseInt(imovel.quartos) : undefined,
      banheiros: imovel.banheiros ? parseInt(imovel.banheiros) : undefined,
      vagas: imovel.vagas ? parseInt(imovel.vagas) : undefined,
      valor: parseFloat(imovel.valor),
      status: imovel.status,
      descricao: imovel.descricao || undefined,
    }, {
      onSuccess: () => {
        // Reset form
        setImovel({
          titulo: '',
          tipo: '',
          endereco: '',
          cidade: '',
          estado: '',
          cep: '',
          area: '',
          quartos: '',
          banheiros: '',
          vagas: '',
          valor: '',
          status: 'disponivel',
          descricao: ''
        });
        onClose?.();
      }
    });
  };

  const handleCancel = () => {
    // Reset form
    setImovel({
      titulo: imovelInicial?.titulo || '',
      tipo: imovelInicial?.tipo || '',
      endereco: imovelInicial?.endereco || '',
      cidade: imovelInicial?.cidade || '',
      estado: imovelInicial?.estado || '',
      cep: imovelInicial?.cep || '',
      area: imovelInicial?.area?.toString() || '',
      quartos: imovelInicial?.quartos?.toString() || '',
      banheiros: imovelInicial?.banheiros?.toString() || '',
      vagas: imovelInicial?.vagas?.toString() || '',
      valor: imovelInicial?.valor?.toString() || '',
      status: imovelInicial?.status || 'disponivel',
      descricao: imovelInicial?.descricao || ''
    });
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            {imovelInicial ? 'Editar Imóvel' : 'Novo Imóvel'}
          </CardTitle>
          <CardDescription>
            {imovelInicial ? 'Editar informações do imóvel' : 'Cadastrar um novo imóvel no sistema'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="titulo">Título</Label>
              <Input
                id="titulo"
                placeholder="Ex: Casa 3 quartos no Centro"
                value={imovel.titulo}
                onChange={(e) => setImovel({...imovel, titulo: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={imovel.tipo} onValueChange={(value) => setImovel({...imovel, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro"
                value={imovel.endereco}
                onChange={(e) => setImovel({...imovel, endereco: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Nome da cidade"
                value={imovel.cidade}
                onChange={(e) => setImovel({...imovel, cidade: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="UF"
                value={imovel.estado}
                onChange={(e) => setImovel({...imovel, estado: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                placeholder="450000"
                type="number"
                value={imovel.valor}
                onChange={(e) => setImovel({...imovel, valor: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="area">Área (m²)</Label>
              <Input
                id="area"
                placeholder="120"
                type="number"
                value={imovel.area}
                onChange={(e) => setImovel({...imovel, area: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="quartos">Quartos</Label>
              <Input
                id="quartos"
                placeholder="3"
                type="number"
                value={imovel.quartos}
                onChange={(e) => setImovel({...imovel, quartos: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="banheiros">Banheiros</Label>
              <Input
                id="banheiros"
                placeholder="2"
                type="number"
                value={imovel.banheiros}
                onChange={(e) => setImovel({...imovel, banheiros: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="vagas">Vagas de Garagem</Label>
              <Input
                id="vagas"
                placeholder="2"
                type="number"
                value={imovel.vagas}
                onChange={(e) => setImovel({...imovel, vagas: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={imovel.status} onValueChange={(value) => setImovel({...imovel, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                placeholder="Descrição detalhada do imóvel..."
                value={imovel.descricao}
                onChange={(e) => setImovel({...imovel, descricao: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button 
              onClick={salvarImovel} 
              disabled={createImovel.isPending || !imovel.titulo.trim() || !imovel.tipo || !imovel.endereco.trim() || !imovel.valor}
            >
              {createImovel.isPending ? "Salvando..." : imovelInicial ? "Atualizar Imóvel" : "Salvar Imóvel"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}