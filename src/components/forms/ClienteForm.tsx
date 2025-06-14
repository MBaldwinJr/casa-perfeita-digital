import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, Mail, MapPin } from "lucide-react";
import { useCreateCliente } from "@/hooks/useSupabaseQuery";

interface ClienteFormProps {
  cliente?: any;
  onClose?: () => void;
}

export default function ClienteForm({ cliente: clienteInicial, onClose }: ClienteFormProps = {}) {
  const [cliente, setCliente] = useState({
    nome: clienteInicial?.nome || '',
    email: clienteInicial?.email || '',
    telefone: clienteInicial?.telefone || '',
    cpf_cnpj: clienteInicial?.cpf_cnpj || '',
    endereco: clienteInicial?.endereco || '',
    cidade: clienteInicial?.cidade || '',
    estado: clienteInicial?.estado || '',
    cep: clienteInicial?.cep || '',
    observacoes: clienteInicial?.observacoes || ''
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
    }, {
      onSuccess: () => {
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
        onClose?.();
      }
    });
  };

  const handleCancel = () => {
    // Reset form
    setCliente({
      nome: clienteInicial?.nome || '',
      email: clienteInicial?.email || '',
      telefone: clienteInicial?.telefone || '',
      cpf_cnpj: clienteInicial?.cpf_cnpj || '',
      endereco: clienteInicial?.endereco || '',
      cidade: clienteInicial?.cidade || '',
      estado: clienteInicial?.estado || '',
      cep: clienteInicial?.cep || '',
      observacoes: clienteInicial?.observacoes || ''
    });
    onClose?.();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            {clienteInicial ? 'Editar Cliente' : 'Novo Cliente'}
          </CardTitle>
          <CardDescription>
            {clienteInicial ? 'Editar informações do cliente' : 'Cadastrar um novo cliente no sistema'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                placeholder="Nome completo do cliente"
                value={cliente.nome}
                onChange={(e) => setCliente({...cliente, nome: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={cliente.email}
                onChange={(e) => setCliente({...cliente, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                placeholder="(11) 99999-9999"
                value={cliente.telefone}
                onChange={(e) => setCliente({...cliente, telefone: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="cpf_cnpj">CPF/CNPJ</Label>
              <Input
                id="cpf_cnpj"
                placeholder="000.000.000-00"
                value={cliente.cpf_cnpj}
                onChange={(e) => setCliente({...cliente, cpf_cnpj: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="endereco">Endereço</Label>
              <Input
                id="endereco"
                placeholder="Rua, número, bairro"
                value={cliente.endereco}
                onChange={(e) => setCliente({...cliente, endereco: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="cidade">Cidade</Label>
              <Input
                id="cidade"
                placeholder="Nome da cidade"
                value={cliente.cidade}
                onChange={(e) => setCliente({...cliente, cidade: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Input
                id="estado"
                placeholder="UF"
                value={cliente.estado}
                onChange={(e) => setCliente({...cliente, estado: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                placeholder="00000-000"
                value={cliente.cep}
                onChange={(e) => setCliente({...cliente, cep: e.target.value})}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                placeholder="Observações adicionais sobre o cliente..."
                value={cliente.observacoes}
                onChange={(e) => setCliente({...cliente, observacoes: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleCancel}>Cancelar</Button>
            <Button 
              onClick={salvarCliente} 
              disabled={createCliente.isPending || !cliente.nome.trim()}
            >
              {createCliente.isPending ? "Salvando..." : clienteInicial ? "Atualizar Cliente" : "Salvar Cliente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}