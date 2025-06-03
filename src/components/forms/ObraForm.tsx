
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Hammer } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ObraFormProps {
  onClose?: () => void;
}

export default function ObraForm({ onClose }: ObraFormProps) {
  const [obra, setObra] = useState({
    imovelId: '',
    nome: '',
    descricao: '',
    tipoObra: '',
    orcamento: '',
    status: 'planejamento'
  });

  const [dataInicio, setDataInicio] = useState<Date>();
  const [dataPrevisao, setDataPrevisao] = useState<Date>();

  const imoveis = [
    { id: '1', descricao: "Casa - Jardim América" },
    { id: '2', descricao: "Terreno - Centro" },
    { id: '3', descricao: "Casa - Vila Nova" },
  ];

  const salvarObra = () => {
    if (!obra.imovelId || !obra.nome || !obra.tipoObra) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    console.log("Obra criada:", { ...obra, dataInicio, dataPrevisao });
    toast({
      title: "Obra criada!",
      description: "A obra foi registrada com sucesso.",
    });
    
    if (onClose) onClose();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Hammer className="h-5 w-5 mr-2" />
          Nova Obra
        </CardTitle>
        <CardDescription>Registrar novo projeto de construção/reforma</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="imovel">Imóvel *</Label>
            <Select value={obra.imovelId} onValueChange={(value) => setObra({...obra, imovelId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o imóvel" />
              </SelectTrigger>
              <SelectContent>
                {imoveis.map(imovel => (
                  <SelectItem key={imovel.id} value={imovel.id}>{imovel.descricao}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="nome">Nome da Obra *</Label>
            <Input
              id="nome"
              placeholder="Ex: Reforma da Cozinha"
              value={obra.nome}
              onChange={(e) => setObra({...obra, nome: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="tipoObra">Tipo de Obra *</Label>
            <Select value={obra.tipoObra} onValueChange={(value) => setObra({...obra, tipoObra: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construcao">Construção</SelectItem>
                <SelectItem value="reforma">Reforma</SelectItem>
                <SelectItem value="ampliacao">Ampliação</SelectItem>
                <SelectItem value="reparo">Reparo</SelectItem>
                <SelectItem value="manutencao">Manutenção</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="orcamento">Orçamento</Label>
            <Input
              id="orcamento"
              placeholder="R$ 0,00"
              value={obra.orcamento}
              onChange={(e) => setObra({...obra, orcamento: e.target.value})}
            />
          </div>

          <div>
            <Label>Data de Início</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataInicio ? format(dataInicio, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataInicio}
                  onSelect={setDataInicio}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label>Data de Previsão</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataPrevisao ? format(dataPrevisao, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dataPrevisao}
                  onSelect={setDataPrevisao}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Descrição detalhada da obra..."
            value={obra.descricao}
            onChange={(e) => setObra({...obra, descricao: e.target.value})}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={salvarObra}>Criar Obra</Button>
        </div>
      </CardContent>
    </Card>
  );
}
