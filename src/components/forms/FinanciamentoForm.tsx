import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CreditCard, CalendarIcon, Calculator } from "lucide-react";
import { format } from "date-fns";
import { useClientes, useImoveis, useCreateFinanciamento } from "@/hooks/useSupabaseQuery";

interface FinanciamentoFormProps {
  financiamento?: any;
  onClose?: () => void;
}

export default function FinanciamentoForm({ financiamento: financiamentoInicial, onClose }: FinanciamentoFormProps = {}) {
  const [financiamento, setFinanciamento] = useState({
    cliente_id: financiamentoInicial?.cliente_id || '',
    imovel_id: financiamentoInicial?.imovel_id || '',
    banco: financiamentoInicial?.banco || '',
    valor_financiado: financiamentoInicial?.valor_financiado?.toString() || '',
    entrada: financiamentoInicial?.entrada?.toString() || '',
    prazo_meses: financiamentoInicial?.prazo_meses?.toString() || '',
    taxa_juros: financiamentoInicial?.taxa_juros?.toString() || '',
    valor_parcela: financiamentoInicial?.valor_parcela?.toString() || '',
    status: financiamentoInicial?.status || 'analise',
    observacoes: financiamentoInicial?.observacoes || ''
  });

  const [dataAprovacao, setDataAprovacao] = useState<Date>();
  const { data: clientes = [], isLoading: clientesLoading } = useClientes();
  const { data: imoveis = [], isLoading: imoveisLoading } = useImoveis();
  const createFinanciamento = useCreateFinanciamento();

  const calcularParcela = () => {
    if (financiamento.valor_financiado && financiamento.prazo_meses && financiamento.taxa_juros) {
      const valor = parseFloat(financiamento.valor_financiado);
      const meses = parseInt(financiamento.prazo_meses);
      const taxa = parseFloat(financiamento.taxa_juros) / 100 / 12; // Taxa mensal

      const parcela = valor * (taxa * Math.pow(1 + taxa, meses)) / (Math.pow(1 + taxa, meses) - 1);
      setFinanciamento({...financiamento, valor_parcela: parcela.toFixed(2)});
    }
  };

  const salvarFinanciamento = () => {
    if (!financiamento.cliente_id || !financiamento.imovel_id || !financiamento.banco || !financiamento.valor_financiado) {
      return;
    }

    createFinanciamento.mutate({
      cliente_id: financiamento.cliente_id,
      imovel_id: financiamento.imovel_id,
      banco: financiamento.banco,
      valor_financiado: parseFloat(financiamento.valor_financiado),
      entrada: financiamento.entrada ? parseFloat(financiamento.entrada) : undefined,
      prazo_meses: financiamento.prazo_meses ? parseInt(financiamento.prazo_meses) : undefined,
      taxa_juros: financiamento.taxa_juros ? parseFloat(financiamento.taxa_juros) : undefined,
      valor_parcela: financiamento.valor_parcela ? parseFloat(financiamento.valor_parcela) : undefined,
      status: financiamento.status,
      data_aprovacao: dataAprovacao?.toISOString().split('T')[0],
      observacoes: financiamento.observacoes || undefined,
    }, {
      onSuccess: () => {
        onClose?.();
      }
    });
  };

  const handleCancel = () => {
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2" />
            {financiamentoInicial ? 'Editar Financiamento' : 'Novo Financiamento'}
          </CardTitle>
          <CardDescription>
            {financiamentoInicial ? 'Editar solicitação de financiamento' : 'Cadastrar solicitação de financiamento'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select value={financiamento.cliente_id} onValueChange={(value) => setFinanciamento({...financiamento, cliente_id: value})}>
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
              <Select value={financiamento.imovel_id} onValueChange={(value) => setFinanciamento({...financiamento, imovel_id: value})}>
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
              <Label htmlFor="banco">Banco</Label>
              <Select value={financiamento.banco} onValueChange={(value) => setFinanciamento({...financiamento, banco: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o banco" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="caixa">Caixa Econômica Federal</SelectItem>
                  <SelectItem value="bb">Banco do Brasil</SelectItem>
                  <SelectItem value="bradesco">Bradesco</SelectItem>
                  <SelectItem value="itau">Itaú</SelectItem>
                  <SelectItem value="santander">Santander</SelectItem>
                  <SelectItem value="outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={financiamento.status} onValueChange={(value) => setFinanciamento({...financiamento, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Status do financiamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analise">Em Análise</SelectItem>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="negado">Negado</SelectItem>
                  <SelectItem value="aguardando_documentos">Aguardando Documentos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="valor_financiado">Valor Financiado</Label>
              <Input
                id="valor_financiado"
                placeholder="350000"
                type="number"
                value={financiamento.valor_financiado}
                onChange={(e) => setFinanciamento({...financiamento, valor_financiado: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="entrada">Valor da Entrada</Label>
              <Input
                id="entrada"
                placeholder="100000"
                type="number"
                value={financiamento.entrada}
                onChange={(e) => setFinanciamento({...financiamento, entrada: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="prazo_meses">Prazo (meses)</Label>
              <Input
                id="prazo_meses"
                placeholder="360"
                type="number"
                value={financiamento.prazo_meses}
                onChange={(e) => setFinanciamento({...financiamento, prazo_meses: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="taxa_juros">Taxa de Juros (% a.a.)</Label>
              <div className="flex space-x-2">
                <Input
                  id="taxa_juros"
                  placeholder="8.5"
                  type="number"
                  step="0.01"
                  value={financiamento.taxa_juros}
                  onChange={(e) => setFinanciamento({...financiamento, taxa_juros: e.target.value})}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={calcularParcela}
                  disabled={!financiamento.valor_financiado || !financiamento.prazo_meses || !financiamento.taxa_juros}
                >
                  <Calculator className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="valor_parcela">Valor da Parcela</Label>
              <Input
                id="valor_parcela"
                placeholder="2500.00"
                type="number"
                value={financiamento.valor_parcela}
                onChange={(e) => setFinanciamento({...financiamento, valor_parcela: e.target.value})}
                readOnly
              />
            </div>

            {financiamento.status === 'aprovado' && (
              <div>
                <Label>Data de Aprovação</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataAprovacao ? format(dataAprovacao, "dd/MM/yyyy") : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dataAprovacao}
                      onSelect={setDataAprovacao}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações sobre o financiamento..."
                value={financiamento.observacoes}
                onChange={(e) => setFinanciamento({...financiamento, observacoes: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button 
              onClick={salvarFinanciamento} 
              disabled={createFinanciamento.isPending || !financiamento.cliente_id || !financiamento.imovel_id || !financiamento.banco || !financiamento.valor_financiado}
            >
              {createFinanciamento.isPending ? "Salvando..." : financiamentoInicial ? "Atualizar Financiamento" : "Salvar Financiamento"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}