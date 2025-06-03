import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar, CalendarIcon, FileText, User, Home, DollarSign } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function PropostaForm() {
  const [proposta, setProposta] = useState({
    clienteId: '',
    imovelId: '',
    valorProposta: '',
    formaPagamento: '',
    entrada: '',
    financiamento: '',
    observacoes: '',
    status: 'em_analise'
  });

  const [dataVencimento, setDataVencimento] = useState<Date>();
  const [dataAssinatura, setDataAssinatura] = useState<Date>();

  const clientes = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Oliveira" },
  ];

  const imoveis = [
    { id: 1, descricao: "Casa 3 quartos - Centro" },
    { id: 2, descricao: "Apartamento 2 quartos - Jardins" },
    { id: 3, descricao: "Terreno 500m² - Vila Nova" },
  ];

  const salvarProposta = () => {
    console.log("Proposta salva:", { ...proposta, dataVencimento, dataAssinatura });
    toast({
      title: "Proposta salva!",
      description: "A proposta foi criada com sucesso.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Nova Proposta
          </CardTitle>
          <CardDescription>Criar uma nova proposta de compra</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={proposta.clienteId} onValueChange={(value) => setProposta({...proposta, clienteId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">João Silva</SelectItem>
                  <SelectItem value="2">Maria Santos</SelectItem>
                  <SelectItem value="3">Pedro Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imovel">Imóvel</Label>
              <Select value={proposta.imovelId} onValueChange={(value) => setProposta({...proposta, imovelId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o imóvel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Casa 3 quartos - Centro</SelectItem>
                  <SelectItem value="2">Apartamento 2 quartos - Jardins</SelectItem>
                  <SelectItem value="3">Terreno 500m² - Vila Nova</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valorProposta">Valor da Proposta</Label>
              <Input
                id="valorProposta"
                placeholder="R$ 0,00"
                value={proposta.valorProposta}
                onChange={(e) => setProposta({...proposta, valorProposta: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select value={proposta.formaPagamento} onValueChange={(value) => setProposta({...proposta, formaPagamento: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a_vista">À Vista</SelectItem>
                  <SelectItem value="financiado">Financiado</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="entrada">Valor da Entrada</Label>
              <Input
                id="entrada"
                placeholder="R$ 0,00"
                value={proposta.entrada}
                onChange={(e) => setProposta({...proposta, entrada: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="financiamento">Valor Financiado</Label>
              <Input
                id="financiamento"
                placeholder="R$ 0,00"
                value={proposta.financiamento}
                onChange={(e) => setProposta({...proposta, financiamento: e.target.value})}
              />
            </div>

            <div>
              <Label>Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dataVencimento}
                    onSelect={setDataVencimento}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>Data de Assinatura</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataAssinatura ? format(dataAssinatura, "dd/MM/yyyy") : "Selecionar data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={dataAssinatura}
                    onSelect={setDataAssinatura}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <Label htmlFor="observacoes">Observações</Label>
            <Textarea
              id="observacoes"
              placeholder="Observações adicionais sobre a proposta..."
              value={proposta.observacoes}
              onChange={(e) => setProposta({...proposta, observacoes: e.target.value})}
              rows={4}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline">Cancelar</Button>
            <Button onClick={salvarProposta}>Salvar Proposta</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
