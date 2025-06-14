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

  const getContractTemplate = (tipoImovel: string) => {
    const templates = {
      casa: {
        titulo: "CONTRATO DE COMPRA E VENDA DE CASA RESIDENCIAL",
        clausulas: `1. DO OBJETO: Casa residencial com ${proposta?.imoveis?.quartos || 'X'} quartos, ${proposta?.imoveis?.banheiros || 'X'} banheiros, ${proposta?.imoveis?.vagas || 'X'} vagas de garagem, área construída de ${proposta?.imoveis?.area || 'X'}m².

2. DAS CONDIÇÕES DO IMÓVEL: O imóvel está sendo vendido no estado em que se encontra, livre e desembaraçado de qualquer ônus, dívida ou responsabilidade.

3. DA DOCUMENTAÇÃO: O vendedor declara que o imóvel possui toda documentação em dia, incluindo IPTU, certidões negativas e matrícula atualizada.

4. DA VISTORIA: O comprador declara ter vistoriado o imóvel e estar ciente de suas condições.

5. DAS BENFEITORIAS: Todas as benfeitorias existentes no imóvel fazem parte da presente venda.`,
        observacoes: "Imóvel residencial com todas as instalações em perfeito funcionamento."
      },
      apartamento: {
        titulo: "CONTRATO DE COMPRA E VENDA DE APARTAMENTO",
        clausulas: `1. DO OBJETO: Apartamento residencial localizado no ${proposta?.imoveis?.endereco}, com ${proposta?.imoveis?.quartos || 'X'} quartos, ${proposta?.imoveis?.banheiros || 'X'} banheiros, ${proposta?.imoveis?.vagas || 'X'} vagas de garagem.

2. DO CONDOMÍNIO: O comprador assume todas as obrigações condominiais a partir da data de assinatura, incluindo taxas ordinárias e extraordinárias.

3. DA CONVENÇÃO CONDOMINIAL: O comprador declara conhecer e aceitar integralmente a convenção e regulamento interno do condomínio.

4. DAS ÁREAS COMUNS: O comprador terá direito ao uso das áreas comuns do condomínio conforme estabelecido na convenção.

5. DA ADMINISTRAÇÃO: Todas as questões relacionadas ao condomínio serão regidas pela administração predial.`,
        observacoes: "Apartamento com acesso a todas as áreas comuns do condomínio."
      },
      terreno: {
        titulo: "CONTRATO DE COMPRA E VENDA DE TERRENO",
        clausulas: `1. DO OBJETO: Terreno urbano com área total de ${proposta?.imoveis?.area || 'X'}m², conforme descrição na matrícula do imóvel.

2. DAS CARACTERÍSTICAS: Terreno plano, com frente de Xm, laterais de Xm cada, e fundos de Xm, totalizando ${proposta?.imoveis?.area || 'X'}m².

3. DAS CONFRONTAÇÕES: O terreno confronta-se conforme descrição constante na matrícula registrada no Cartório de Registro de Imóveis.

4. DO USO: O terreno destina-se à construção residencial/comercial, respeitando-se as normas urbanísticas municipais.

5. DAS LIMITAÇÕES: O comprador compromete-se a respeitar os recuos e índices construtivos estabelecidos pela legislação municipal.

6. DA TOPOGRAFIA: O comprador declara conhecer as condições topográficas do terreno.`,
        observacoes: "Terreno pronto para construção, respeitando legislação municipal."
      },
      comercial: {
        titulo: "CONTRATO DE COMPRA E VENDA DE IMÓVEL COMERCIAL",
        clausulas: `1. DO OBJETO: Imóvel comercial com área útil de ${proposta?.imoveis?.area || 'X'}m², destinado a atividades comerciais.

2. DO ALVARÁ: O imóvel possui alvará de funcionamento para atividades comerciais, cabendo ao comprador renovar conforme necessário.

3. DAS INSTALAÇÕES: O imóvel conta com instalações elétricas, hidráulicas e sanitárias adequadas para uso comercial.

4. DO ZONEAMENTO: O imóvel está localizado em zona comercial conforme plano diretor municipal.

5. DAS ATIVIDADES: O comprador poderá exercer qualquer atividade comercial permitida pela legislação vigente.

6. DAS NORMAS: O comprador deve observar todas as normas municipais, estaduais e federais aplicáveis à atividade.`,
        observacoes: "Imóvel comercial com todas as licenças necessárias para funcionamento."
      }
    };

    return templates[tipoImovel as keyof typeof templates] || templates.casa;
  };

  const currentTemplate = getContractTemplate(proposta?.imoveis?.tipo || 'casa');

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
              <div className="border rounded-lg p-4 bg-gray-50 text-sm space-y-3">
                <h3 className="font-bold text-center text-lg">{currentTemplate.titulo}</h3>
                <div className="text-center">
                  <p><strong>Contrato Nº:</strong> {contractData.numero_contrato}</p>
                  <p><strong>Data:</strong> {dataAssinatura ? format(dataAssinatura, "dd/MM/yyyy") : "___/___/____"}</p>
                </div>
                
                <div className="space-y-2">
                  <p><strong>VENDEDOR:</strong> [Nome da Imobiliária], CNPJ: XX.XXX.XXX/0001-XX</p>
                  <p><strong>COMPRADOR:</strong> {proposta.clientes?.nome || '[Nome do Cliente]'}</p>
                  <p><strong>CPF/CNPJ:</strong> {proposta.clientes?.cpf_cnpj || '[CPF/CNPJ]'}</p>
                </div>
                
                <div className="space-y-2">
                  <p><strong>IMÓVEL:</strong> {proposta.imoveis?.titulo || '[Descrição do Imóvel]'}</p>
                  <p><strong>ENDEREÇO:</strong> {proposta.imoveis?.endereco || '[Endereço]'}, {proposta.imoveis?.cidade || '[Cidade]'}/{proposta.imoveis?.estado || '[UF]'}</p>
                  <p><strong>CEP:</strong> {proposta.imoveis?.cep || '[CEP]'}</p>
                </div>
                
                <div className="space-y-2">
                  <p><strong>VALOR TOTAL:</strong> {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(proposta.valor_proposta)} ({proposta.valor_proposta})</p>
                  <p><strong>FORMA DE PAGAMENTO:</strong> {proposta.forma_pagamento?.replace('_', ' ') || '[Forma de Pagamento]'}</p>
                  {proposta.entrada && (
                    <p><strong>ENTRADA:</strong> {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(proposta.entrada)}</p>
                  )}
                </div>

                <div className="space-y-1 text-xs leading-relaxed">
                  <p><strong>CLÁUSULAS CONTRATUAIS:</strong></p>
                  <div className="whitespace-pre-line">{currentTemplate.clausulas}</div>
                </div>
                
                {contractData.clausulas_especiais && (
                  <div className="space-y-1">
                    <p><strong>CLÁUSULAS ESPECIAIS:</strong></p>
                    <p className="text-xs">{contractData.clausulas_especiais}</p>
                  </div>
                )}

                <div className="space-y-1">
                  <p><strong>OBSERVAÇÕES:</strong></p>
                  <p className="text-xs">{contractData.observacoes || currentTemplate.observacoes}</p>
                </div>
                
                <div className="mt-6 text-center space-y-4">
                  <p className="text-xs">Este contrato é celebrado em caráter irrevogável e irretratável.</p>
                  <div className="flex justify-between text-xs">
                    <div className="text-center">
                      <p>_________________________</p>
                      <p>VENDEDOR</p>
                    </div>
                    <div className="text-center">
                      <p>_________________________</p>
                      <p>COMPRADOR</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p>_________________________</p>
                    <p>TESTEMUNHA 1</p>
                  </div>
                </div>
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