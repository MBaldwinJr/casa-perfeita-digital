import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon, FileText } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { useClientes, useImoveis, useCreateProposta } from "@/hooks/useSupabaseQuery";

interface PropostaFormProps {
  proposta?: any;
  onClose?: () => void;
}

export default function PropostaForm({ proposta: propostaInicial, onClose }: PropostaFormProps = {}) {
  const [proposta, setProposta] = useState({
    cliente_id: propostaInicial?.cliente_id || '',
    imovel_id: propostaInicial?.imovel_id || '',
    valor_proposta: propostaInicial?.valor_proposta?.toString() || '',
    forma_pagamento: propostaInicial?.forma_pagamento || '',
    entrada: propostaInicial?.entrada?.toString() || '',
    financiamento: propostaInicial?.financiamento?.toString() || '',
    observacoes: propostaInicial?.observacoes || '',
    status: propostaInicial?.status || 'em_analise'
  });

  const [dataVencimento, setDataVencimento] = useState<Date>();
  const [dataAssinatura, setDataAssinatura] = useState<Date>();

  const { data: clientes = [], isLoading: clientesLoading } = useClientes();
  const { data: imoveis = [], isLoading: imoveisLoading } = useImoveis();
  const createProposta = useCreateProposta();

  const salvarProposta = () => {
    if (!proposta.cliente_id || !proposta.imovel_id || !proposta.valor_proposta || !proposta.forma_pagamento) {
      return;
    }

    createProposta.mutate({
      cliente_id: proposta.cliente_id,
      imovel_id: proposta.imovel_id,
      valor_proposta: parseFloat(proposta.valor_proposta),
      forma_pagamento: proposta.forma_pagamento,
      entrada: proposta.entrada ? parseFloat(proposta.entrada) : undefined,
      financiamento: proposta.financiamento ? parseFloat(proposta.financiamento) : undefined,
      data_vencimento: dataVencimento?.toISOString().split('T')[0],
      data_assinatura: dataAssinatura?.toISOString().split('T')[0],
      status: proposta.status,
      observacoes: proposta.observacoes || undefined,
    }, {
      onSuccess: () => {
        onClose?.();
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            {propostaInicial ? 'Editar Proposta' : 'Nova Proposta'}
          </CardTitle>
          <CardDescription>
            {propostaInicial ? 'Editar proposta de compra' : 'Criar uma nova proposta de compra'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={proposta.cliente_id} onValueChange={(value) => setProposta({...proposta, cliente_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={clientesLoading ? "Carregando..." : "Selecione o cliente"} />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="imovel">Imóvel</Label>
              <Select value={proposta.imovel_id} onValueChange={(value) => setProposta({...proposta, imovel_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder={imoveisLoading ? "Carregando..." : "Selecione o imóvel"} />
                </SelectTrigger>
                <SelectContent>
                  {imoveis.map((imovel) => (
                    <SelectItem key={imovel.id} value={imovel.id}>
                      {imovel.titulo} - {imovel.cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valorProposta">Valor da Proposta</Label>
              <Input
                id="valorProposta"
                placeholder="R$ 0,00"
                value={proposta.valor_proposta}
                onChange={(e) => setProposta({...proposta, valor_proposta: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select value={proposta.forma_pagamento} onValueChange={(value) => setProposta({...proposta, forma_pagamento: value})}>
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
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button 
              onClick={salvarProposta}
              disabled={createProposta.isPending || !proposta.cliente_id || !proposta.imovel_id || !proposta.valor_proposta || !proposta.forma_pagamento}
            >
              {createProposta.isPending ? "Salvando..." : propostaInicial ? "Atualizar Proposta" : "Salvar Proposta"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
