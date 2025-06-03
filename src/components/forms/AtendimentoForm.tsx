
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface AtendimentoFormProps {
  onClose?: () => void;
}

export default function AtendimentoForm({ onClose }: AtendimentoFormProps) {
  const [atendimento, setAtendimento] = useState({
    clienteId: '',
    imovelId: '',
    tipo: '',
    assunto: '',
    descricao: '',
    prioridade: '',
    status: 'aberto'
  });

  const clientes = [
    { id: '1', nome: "João Silva" },
    { id: '2', nome: "Maria Santos" },
    { id: '3', nome: "Pedro Costa" },
  ];

  const imoveis = [
    { id: '1', descricao: "Casa - Jardim América" },
    { id: '2', descricao: "Terreno - Centro" },
    { id: '3', descricao: "Casa - Vila Nova" },
  ];

  const salvarAtendimento = () => {
    if (!atendimento.clienteId || !atendimento.tipo || !atendimento.assunto) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    console.log("Atendimento criado:", atendimento);
    toast({
      title: "Atendimento criado!",
      description: "O atendimento foi registrado com sucesso.",
    });
    
    if (onClose) onClose();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2" />
          Novo Atendimento
        </CardTitle>
        <CardDescription>Registrar nova solicitação de suporte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label htmlFor="cliente">Cliente *</Label>
            <Select value={atendimento.clienteId} onValueChange={(value) => setAtendimento({...atendimento, clienteId: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o cliente" />
              </SelectTrigger>
              <SelectContent>
                {clientes.map(cliente => (
                  <SelectItem key={cliente.id} value={cliente.id}>{cliente.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="imovel">Imóvel</Label>
            <Select value={atendimento.imovelId} onValueChange={(value) => setAtendimento({...atendimento, imovelId: value})}>
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
            <Label htmlFor="tipo">Tipo *</Label>
            <Select value={atendimento.tipo} onValueChange={(value) => setAtendimento({...atendimento, tipo: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="duvida">Dúvida</SelectItem>
                <SelectItem value="reparo">Reparo</SelectItem>
                <SelectItem value="garantia">Garantia</SelectItem>
                <SelectItem value="reclamacao">Reclamação</SelectItem>
                <SelectItem value="elogio">Elogio</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade *</Label>
            <Select value={atendimento.prioridade} onValueChange={(value) => setAtendimento({...atendimento, prioridade: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="assunto">Assunto *</Label>
          <Input
            id="assunto"
            placeholder="Resumo do problema ou solicitação"
            value={atendimento.assunto}
            onChange={(e) => setAtendimento({...atendimento, assunto: e.target.value})}
          />
        </div>

        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Textarea
            id="descricao"
            placeholder="Descrição detalhada do atendimento..."
            value={atendimento.descricao}
            onChange={(e) => setAtendimento({...atendimento, descricao: e.target.value})}
            rows={4}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={salvarAtendimento}>Criar Atendimento</Button>
        </div>
      </CardContent>
    </Card>
  );
}
