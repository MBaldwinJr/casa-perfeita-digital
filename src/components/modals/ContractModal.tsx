import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileText, Download, CalendarIcon, Printer } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface ContractModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proposta: any;
}

export default function ContractModal({ open, onOpenChange, proposta }: ContractModalProps) {
  const [contractData, setContractData] = useState({
    numero_contrato: `CONT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
    clausulas_especiais: '',
    observacoes: '',
  });
  
  const [dataAssinatura, setDataAssinatura] = useState<Date>(new Date());
  const [dataVencimento, setDataVencimento] = useState<Date>();
  const [isGenerating, setIsGenerating] = useState(false);

  const gerarContrato = async () => {
    setIsGenerating(true);
    
    try {
      // Simular geração do contrato
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Contrato gerado com sucesso!",
        description: "O contrato foi gerado e está pronto para download.",
      });
      
      // Aqui você implementaria a lógica real de geração do PDF
      // Por exemplo, usando jsPDF ou uma API de geração de documentos
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erro ao gerar contrato",
        description: "Ocorreu um erro durante a geração do contrato.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const previewContrato = () => {
    // Implementar preview do contrato
    toast({
      title: "Preview em desenvolvimento",
      description: "Funcionalidade de preview será implementada em breve.",
    });
  };

  if (!proposta) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Gerar Contrato de Compra e Venda
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informações da Proposta */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados da Proposta</CardTitle>
              <CardDescription>Informações base para o contrato</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{proposta.clientes?.nome || 'Cliente não especificado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Imóvel</Label>
                  <p className="text-sm text-muted-foreground">{proposta.imoveis?.titulo || 'Imóvel não especificado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Valor da Proposta</Label>
                  <p className="text-sm text-muted-foreground font-bold text-primary">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(proposta.valor_proposta)}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Forma de Pagamento</Label>
                  <p className="text-sm text-muted-foreground capitalize">{proposta.forma_pagamento?.replace('_', ' ')}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados do Contrato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dados do Contrato</CardTitle>
              <CardDescription>Configure os detalhes específicos do contrato</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="numero_contrato">Número do Contrato</Label>
                  <Input
                    id="numero_contrato"
                    value={contractData.numero_contrato}
                    onChange={(e) => setContractData({...contractData, numero_contrato: e.target.value})}
                  />
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

                <div>
                  <Label>Data de Vencimento (Opcional)</Label>
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
              </div>

              <div>
                <Label htmlFor="clausulas_especiais">Cláusulas Especiais</Label>
                <Textarea
                  id="clausulas_especiais"
                  placeholder="Digite cláusulas específicas para este contrato..."
                  value={contractData.clausulas_especiais}
                  onChange={(e) => setContractData({...contractData, clausulas_especiais: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Observações que aparecerão no contrato..."
                  value={contractData.observacoes}
                  onChange={(e) => setContractData({...contractData, observacoes: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Template Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preview do Contrato</CardTitle>
              <CardDescription>Visualização prévia do documento que será gerado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50 text-sm space-y-2">
                <h3 className="font-bold text-center">CONTRATO DE COMPRA E VENDA DE IMÓVEL</h3>
                <p><strong>Contrato Nº:</strong> {contractData.numero_contrato}</p>
                <p><strong>Data:</strong> {dataAssinatura ? format(dataAssinatura, "dd/MM/yyyy") : "___/___/____"}</p>
                
                <div className="mt-4">
                  <p><strong>VENDEDOR:</strong> [Dados da Imobiliária]</p>
                  <p><strong>COMPRADOR:</strong> {proposta.clientes?.nome || '[Nome do Cliente]'}</p>
                </div>
                
                <div className="mt-4">
                  <p><strong>IMÓVEL:</strong> {proposta.imoveis?.titulo || '[Descrição do Imóvel]'}</p>
                  <p><strong>ENDEREÇO:</strong> {proposta.imoveis?.endereco || '[Endereço]'}</p>
                </div>
                
                <div className="mt-4">
                  <p><strong>VALOR TOTAL:</strong> {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(proposta.valor_proposta)}</p>
                  <p><strong>FORMA DE PAGAMENTO:</strong> {proposta.forma_pagamento?.replace('_', ' ') || '[Forma de Pagamento]'}</p>
                </div>
                
                {contractData.clausulas_especiais && (
                  <div className="mt-4">
                    <p><strong>CLÁUSULAS ESPECIAIS:</strong></p>
                    <p className="ml-4">{contractData.clausulas_especiais}</p>
                  </div>
                )}
                
                <p className="mt-4 text-center text-xs text-gray-500">
                  [O contrato completo será gerado com todas as cláusulas padrão e assinaturas]
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex justify-between space-x-2">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={previewContrato}
                disabled={isGenerating}
              >
                <Printer className="h-4 w-4 mr-2" />
                Preview Completo
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isGenerating}
              >
                Cancelar
              </Button>
              <Button 
                onClick={gerarContrato}
                disabled={isGenerating || !contractData.numero_contrato}
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Gerando...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Gerar Contrato PDF
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}