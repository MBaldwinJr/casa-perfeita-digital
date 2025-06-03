
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
import { Upload, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const imovelSchema = z.object({
  tipo: z.string().min(1, "Tipo é obrigatório"),
  endereco: z.string().min(1, "Endereço é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cep: z.string().min(8, "CEP deve ter 8 dígitos"),
  preco: z.string().min(1, "Preço é obrigatório"),
  area: z.string().min(1, "Área é obrigatória"),
  quartos: z.string().optional(),
  banheiros: z.string().optional(),
  vagas: z.string().optional(),
  descricao: z.string().min(10, "Descrição deve ter pelo menos 10 caracteres"),
  proprietario: z.string().min(1, "Nome do proprietário é obrigatório"),
  telefoneProprietario: z.string().min(1, "Telefone do proprietário é obrigatório"),
  emailProprietario: z.string().email("Email inválido"),
  situacao: z.string().min(1, "Situação é obrigatória"),
  registro: z.string().min(1, "Número do registro é obrigatório"),
  observacoes: z.string().optional(),
});

type ImovelFormData = z.infer<typeof imovelSchema>;

interface ImovelFormProps {
  onClose: () => void;
}

export function ImovelForm({ onClose }: ImovelFormProps) {
  const [uploadedFiles, setUploadedFiles] = React.useState<File[]>([]);
  
  const form = useForm<ImovelFormData>({
    resolver: zodResolver(imovelSchema),
    defaultValues: {
      tipo: "",
      endereco: "",
      cidade: "",
      bairro: "",
      cep: "",
      preco: "",
      area: "",
      quartos: "",
      banheiros: "",
      vagas: "",
      descricao: "",
      proprietario: "",
      telefoneProprietario: "",
      emailProprietario: "",
      situacao: "",
      registro: "",
      observacoes: "",
    },
  });

  const onSubmit = (data: ImovelFormData) => {
    console.log("Dados do imóvel:", data);
    console.log("Arquivos enviados:", uploadedFiles);
    
    toast({
      title: "Imóvel cadastrado com sucesso!",
      description: `${data.tipo} em ${data.bairro} foi adicionado ao sistema.`,
    });
    
    onClose();
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
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="tipo">Tipo de Imóvel</Label>
              <Select onValueChange={(value) => form.setValue('tipo', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casa">Casa</SelectItem>
                  <SelectItem value="terreno">Terreno</SelectItem>
                  <SelectItem value="apartamento">Apartamento</SelectItem>
                  <SelectItem value="comercial">Comercial</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.tipo && (
                <p className="text-red-500 text-sm">{form.formState.errors.tipo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Input {...form.register("endereco")} placeholder="Rua, número, complemento" />
              {form.formState.errors.endereco && (
                <p className="text-red-500 text-sm">{form.formState.errors.endereco.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cidade">Cidade</Label>
                <Input {...form.register("cidade")} />
                {form.formState.errors.cidade && (
                  <p className="text-red-500 text-sm">{form.formState.errors.cidade.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="bairro">Bairro</Label>
                <Input {...form.register("bairro")} />
                {form.formState.errors.bairro && (
                  <p className="text-red-500 text-sm">{form.formState.errors.bairro.message}</p>
                )}
              </div>
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
            <CardTitle>Características</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="preco">Preço (R$)</Label>
                <Input {...form.register("preco")} placeholder="450.000" />
                {form.formState.errors.preco && (
                  <p className="text-red-500 text-sm">{form.formState.errors.preco.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="area">Área (m²)</Label>
                <Input {...form.register("area")} placeholder="120" />
                {form.formState.errors.area && (
                  <p className="text-red-500 text-sm">{form.formState.errors.area.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quartos">Quartos</Label>
                <Input {...form.register("quartos")} placeholder="3" />
              </div>
              <div>
                <Label htmlFor="banheiros">Banheiros</Label>
                <Input {...form.register("banheiros")} placeholder="2" />
              </div>
              <div>
                <Label htmlFor="vagas">Vagas</Label>
                <Input {...form.register("vagas")} placeholder="2" />
              </div>
            </div>

            <div>
              <Label htmlFor="situacao">Situação</Label>
              <Select onValueChange={(value) => form.setValue('situacao', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a situação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disponivel">Disponível</SelectItem>
                  <SelectItem value="reservado">Reservado</SelectItem>
                  <SelectItem value="vendido">Vendido</SelectItem>
                  <SelectItem value="documentacao">Pendente Documentação</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.situacao && (
                <p className="text-red-500 text-sm">{form.formState.errors.situacao.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proprietário</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="proprietario">Nome Completo</Label>
              <Input {...form.register("proprietario")} />
              {form.formState.errors.proprietario && (
                <p className="text-red-500 text-sm">{form.formState.errors.proprietario.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="telefoneProprietario">Telefone</Label>
              <Input {...form.register("telefoneProprietario")} placeholder="(11) 99999-9999" />
              {form.formState.errors.telefoneProprietario && (
                <p className="text-red-500 text-sm">{form.formState.errors.telefoneProprietario.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="emailProprietario">Email</Label>
              <Input {...form.register("emailProprietario")} type="email" />
              {form.formState.errors.emailProprietario && (
                <p className="text-red-500 text-sm">{form.formState.errors.emailProprietario.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="registro">Registro/Matrícula</Label>
              <Input {...form.register("registro")} placeholder="Número do registro no cartório" />
              {form.formState.errors.registro && (
                <p className="text-red-500 text-sm">{form.formState.errors.registro.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentos e Fotos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Upload de Arquivos</Label>
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
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Arquivos Carregados:</Label>
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
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informações Adicionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="descricao">Descrição do Imóvel</Label>
              <Textarea 
                {...form.register("descricao")} 
                placeholder="Descreva as características, acabamentos, diferenciais..."
                rows={4}
              />
              {form.formState.errors.descricao && (
                <p className="text-red-500 text-sm">{form.formState.errors.descricao.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea 
                {...form.register("observacoes")} 
                placeholder="Informações adicionais, pendências, etc."
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
          Cadastrar Imóvel
        </Button>
      </div>
    </form>
  );
}
