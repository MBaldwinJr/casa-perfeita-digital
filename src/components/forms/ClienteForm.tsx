
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, Mail, FileText, MapPin } from "lucide-react";
import { useCreateCliente } from "@/hooks/useSupabaseQuery";

export default function ClienteForm() {
  const [cliente, setCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    cpf_cnpj: '',
    endereco: '',
    cidade: '',
    estado: '',
    cep: '',
    observacoes: ''
  });

  const createCliente = useCreateCliente();

  const salvarCliente = () => {
    if (!cliente.nome.trim()) {
      return;
    }

    createCliente.mutate({
      nome: cliente.nome,
      email: cliente.email || undefined,
      telefone: cliente.telefone || undefined,
      cpf_cnpj: cliente.cpf_cnpj || undefined,
      endereco: cliente.endereco || undefined,
      cidade: cliente.cidade || undefined,
      estado: cliente.estado || undefined,
      cep: cliente.cep || undefined,
      observacoes: cliente.observacoes || undefined,
    });

    // Reset form
    setCliente({
      nome: '',
      email: '',
      telefone: '',
      cpf_cnpj: '',
      endereco: '',
      cidade: '',
      estado: '',
      cep: '',
      observacoes: ''
    });
  };

  const calcularCapacidadePagamento = () => {
    const renda = parseFloat(form.getValues('renda').replace(/[^\d,]/g, '').replace(',', '.'));
    const capacidade = renda * 0.3; // 30% da renda
    const valorMaximoFinanciamento = capacidade * 360; // 30 anos
    
    setResultadoSimulacao({
      capacidadePagamento: capacidade.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      valorMaximo: valorMaximoFinanciamento.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      renda: renda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input {...form.register("nome")} />
              {form.formState.errors.nome && (
                <p className="text-red-500 text-sm">{form.formState.errors.nome.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input {...form.register("cpf")} placeholder="000.000.000-00" />
                {form.formState.errors.cpf && (
                  <p className="text-red-500 text-sm">{form.formState.errors.cpf.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="rg">RG</Label>
                <Input {...form.register("rg")} />
                {form.formState.errors.rg && (
                  <p className="text-red-500 text-sm">{form.formState.errors.rg.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input {...form.register("email")} type="email" />
              {form.formState.errors.email && (
                <p className="text-red-500 text-sm">{form.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input {...form.register("telefone")} placeholder="(11) 99999-9999" />
              {form.formState.errors.telefone && (
                <p className="text-red-500 text-sm">{form.formState.errors.telefone.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="estadoCivil">Estado Civil</Label>
              <Select onValueChange={(value) => form.setValue('estadoCivil', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                  <SelectItem value="casado">Casado(a)</SelectItem>
                  <SelectItem value="divorciado">Divorciado(a)</SelectItem>
                  <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                  <SelectItem value="uniao-estavel">União Estável</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.estadoCivil && (
                <p className="text-red-500 text-sm">{form.formState.errors.estadoCivil.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Endereço</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input {...form.register("endereco")} placeholder="Rua, número, complemento" />
              {form.formState.errors.endereco && (
                <p className="text-red-500 text-sm">{form.formState.errors.endereco.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input {...form.register("cidade")} />
              {form.formState.errors.cidade && (
                <p className="text-red-500 text-sm">{form.formState.errors.cidade.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input {...form.register("cep")} placeholder="00000-000" />
              {form.formState.errors.cep && (
                <p className="text-red-500 text-sm">{form.formState.errors.cep.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="profissao">Profissão</Label>
              <Input {...form.register("profissao")} />
              {form.formState.errors.profissao && (
                <p className="text-red-500 text-sm">{form.formState.errors.profissao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="renda">Renda Mensal (R$)</Label>
              <Input {...form.register("renda")} placeholder="5.000,00" />
              {form.formState.errors.renda && (
                <p className="text-red-500 text-sm">{form.formState.errors.renda.message}</p>
              )}
            </div>

            <Button 
              type="button" 
              variant="outline" 
              onClick={calcularCapacidadePagamento}
              className="w-full"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calcular Capacidade de Pagamento
            </Button>

            {resultadoSimulacao && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Análise Financeira</h4>
                <div className="space-y-1 text-sm">
                  <p>Renda: {resultadoSimulacao.renda}</p>
                  <p>Capacidade de Pagamento: {resultadoSimulacao.capacidadePagamento}</p>
                  <p>Valor Máximo de Financiamento: {resultadoSimulacao.valorMaximo}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Interesse de Compra</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="interesse">Tipo de Interesse</Label>
              <Select onValueChange={(value) => form.setValue('interesse', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o interesse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.interesse && (
                <p className="text-red-500 text-sm">{form.formState.errors.interesse.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="orcamento">Orçamento (R$)</Label>
              <Input {...form.register("orcamento")} placeholder="450.000,00" />
              {form.formState.errors.orcamento && (
                <p className="text-red-500 text-sm">{form.formState.errors.orcamento.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload de Documentos</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Clique para fazer upload ou arraste arquivos aqui
                    </span>
                    <input
                      id="file-upload"
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  CPF, RG, Comprovante de Renda, Comprovante de Residência
                </p>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Documentos Carregados:</Label>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                {...form.register("observacoes")} 
                placeholder="Informações adicionais sobre o cliente..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          Cadastrar Cliente
        </Button>
      </div>
    </form>
  );
}
