
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, CalendarIcon, Calculator } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const propostaSchema = z.object({
  cliente: z.string().min(1, "Cliente é obrigatório"),
  imovel: z.string().min(1, "Imóvel é obrigatório"),
  valorProposta: z.string().min(1, "Valor da proposta é obrigatório"),
  formaPagamento: z.string().min(1, "Forma de pagamento é obrigatória"),
  entrada: z.string().optional(),
  prazoEntrega: z.string().optional(),
  observacoes: z.string().optional(),
  condicoes: z.string().optional(),
});

type PropostaFormData = z.infer<typeof propostaSchema>;

interface PropostaFormProps {
  onClose: () => void;
}

export function PropostaForm({ onClose }: PropostaFormProps) {
  const [dataVencimento, setDataVencimento] = React.useState<Date>();
  const [calculoFinanciamento, setCalculoFinanciamento] = React.useState<any>(null);
  
  const form = useForm<PropostaFormData>({
    resolver: zodResolver(propostaSchema),
    defaultValues: {
      cliente: "",
      imovel: "",
      valorProposta: "",
      formaPagamento: "",
      entrada: "",
      prazoEntrega: "",
      observacoes: "",
      condicoes: "",
    },
  });

  const onSubmit = (data: PropostaFormData) => {
    console.log("Dados da proposta:", data);
    console.log("Data de vencimento:", dataVencimento);
    console.log("Cálculo de financiamento:", calculoFinanciamento);
    
    toast({
      title: "Proposta criada com sucesso!",
      description: `Proposta para ${data.cliente} foi registrada no sistema.`,
    });
    
    onClose();
  };

  const calcularFinanciamento = () => {
    const valorProposta = parseFloat(form.getValues('valorProposta').replace(/[^\d,]/g, '').replace(',', '.'));
    const entrada = parseFloat(form.getValues('entrada')?.replace(/[^\d,]/g, '').replace(',', '.') || '0');
    const valorFinanciado = valorProposta - entrada;
    
    // Simulação com taxa de 10.5% ao ano por 30 anos
    const taxa = 0.105 / 12; // Taxa mensal
    const parcelas = 360; // 30 anos
    
    if (valorFinanciado > 0) {
      const prestacao = valorFinanciado * (taxa * Math.pow(1 + taxa, parcelas)) / (Math.pow(1 + taxa, parcelas) - 1);
      
      setCalculoFinanciamento({
        valorProposta: valorProposta.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        entrada: entrada.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        valorFinanciado: valorFinanciado.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        prestacao: prestacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
        total: (prestacao * parcelas + entrada).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      });
    }
  };

  // Dados mockados para os selects
  const clientes = [
    { id: 1, nome: "João Silva" },
    { id: 2, nome: "Maria Santos" },
    { id: 3, nome: "Pedro Costa" },
    { id: 4, nome: "Ana Oliveira" },
  ];

  const imoveis = [
    { id: 1, nome: "Casa - Jardim América" },
    { id: 2, nome: "Terreno - Centro" },
    { id: 3, nome: "Casa - Vila Nova" },
    { id: 4, nome: "Apartamento - Centro" },
  ];

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="cliente">Cliente</Label>
              <Select onValueChange={(value) => form.setValue('cliente', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.nome}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.cliente && (
                <p className="text-red-500 text-sm">{form.formState.errors.cliente.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="imovel">Imóvel</Label>
              <Select onValueChange={(value) => form.setValue('imovel', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o imóvel" />
                </SelectTrigger>
                <SelectContent>
                  {imoveis.map((imovel) => (
                    <SelectItem key={imovel.id} value={imovel.nome}>
                      {imovel.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.imovel && (
                <p className="text-red-500 text-sm">{form.formState.errors.imovel.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="valorProposta">Valor da Proposta (R$)</Label>
              <Input 
                {...form.register("valorProposta")} 
                placeholder="450.000,00"
                onChange={(e) => {
                  form.setValue('valorProposta', e.target.value);
                  // Auto-calcular quando valor mudar
                  setTimeout(calcularFinanciamento, 100);
                }}
              />
              {form.formState.errors.valorProposta && (
                <p className="text-red-500 text-sm">{form.formState.errors.valorProposta.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="dataVencimento">Data de Vencimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dataVencimento && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dataVencimento ? format(dataVencimento, "dd/MM/yyyy") : <span>Selecione a data</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dataVencimento}
                    onSelect={setDataVencimento}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Condições de Pagamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
              <Select onValueChange={(value) => form.setValue('formaPagamento', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="avista">À Vista</SelectItem>
                  <SelectItem value="financiamento">Financiamento</SelectItem>
                  <SelectItem value="parcelado">Parcelado</SelectItem>
                  <SelectItem value="misto">Misto (Entrada + Financiamento)</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.formaPagamento && (
                <p className="text-red-500 text-sm">{form.formState.errors.formaPagamento.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="entrada">Valor de Entrada (R$)</Label>
              <Input 
                {...form.register("entrada")} 
                placeholder="90.000,00"
                onChange={(e) => {
                  form.setValue('entrada', e.target.value);
                  // Auto-calcular quando entrada mudar
                  setTimeout(calcularFinanciamento, 100);
                }}
              />
            </div>

            <div>
              <Label htmlFor="prazoEntrega">Prazo de Entrega</Label>
              <Input {...form.register("prazoEntrega")} placeholder="Ex: 180 dias, Na assinatura, etc." />
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={calcularFinanciamento}
              className="w-full"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Financiamento
            </Button>

            {calculoFinanciamento && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Simulação de Financiamento</h4>
                <div className="space-y-1 text-sm">
                  <p><strong>Valor da Proposta:</strong> {calculoFinanciamento.valorProposta}</p>
                  <p><strong>Entrada:</strong> {calculoFinanciamento.entrada}</p>
                  <p><strong>Valor Financiado:</strong> {calculoFinanciamento.valorFinanciado}</p>
                  <p><strong>Prestação Mensal:</strong> {calculoFinanciamento.prestacao}</p>
                  <p><strong>Total Geral:</strong> {calculoFinanciamento.total}</p>
                  <p className="text-xs text-gray-600 mt-2">
                    *Simulação com taxa de 10,5% a.a. em 360 meses
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Condições e Observações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="condicoes">Condições Especiais</Label>
              <Textarea 
                {...form.register("condicoes")} 
                placeholder="Ex: Sujeito a aprovação de crédito, documentação regular, etc."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                {...form.register("observacoes")} 
                placeholder="Informações adicionais sobre a proposta..."
                rows={3}
              />
            </div>

            <div className="space-y-3">
              <Label>Incluir Cláusulas:</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="clausula1" />
                  <label htmlFor="clausula1" className="text-sm">
                    Sujeito à aprovação de crédito
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="clausula2" />
                  <label htmlFor="clausula2" className="text-sm">
                    Documentação em ordem
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="clausula3" />
                  <label htmlFor="clausula3" className="text-sm">
                    Vistoria aprovada
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="clausula4" />
                  <label htmlFor="clausula4" className="text-sm">
                    Quitação de débitos
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Criar Proposta
        </Button>
      </div>
    </form>
  );
}
