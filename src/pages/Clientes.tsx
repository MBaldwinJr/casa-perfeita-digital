
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Phone, Mail, FileText, Edit, Eye } from "lucide-react";
import ClienteForm from "@/components/forms/ClienteForm";
import { useClientes } from "@/hooks/useSupabaseQuery";

export default function Clientes() {
  const [showForm, setShowForm] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const { data: clientes = [], isLoading } = useClientes();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Gestão de Clientes</h2>
          <p className="text-muted-foreground">Gerencie seu cadastro de compradores e interessados</p>
        </div>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Cliente</DialogTitle>
            </DialogHeader>
            <ClienteForm 
              cliente={selectedCliente} 
              onClose={() => {
                setShowForm(false);
                setSelectedCliente(null);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Modal de Detalhes */}
      <Dialog open={!!viewDetails} onOpenChange={() => setViewDetails(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cliente</DialogTitle>
          </DialogHeader>
          {viewDetails && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Nome</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.nome}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.email || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Telefone</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.telefone || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">CPF/CNPJ</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.cpf_cnpj || 'Não informado'}</p>
                </div>
                <div className="md:col-span-2">
                  <Label className="font-semibold">Endereço</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.endereco || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Cidade</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.cidade || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Estado</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.estado || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">CEP</Label>
                  <p className="text-sm text-muted-foreground">{viewDetails.cep || 'Não informado'}</p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Cadastro</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(viewDetails.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                {viewDetails.observacoes && (
                  <div className="md:col-span-2">
                    <Label className="font-semibold">Observações</Label>
                    <p className="text-sm text-muted-foreground">{viewDetails.observacoes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {clientes.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center h-96">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum cliente cadastrado</h3>
            <p className="text-muted-foreground text-center mb-4">
              Comece cadastrando seu primeiro cliente no sistema.
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar primeiro cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {clientes.map((cliente) => (
            <Card key={cliente.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{cliente.nome}</CardTitle>
                    <CardDescription>
                      {cliente.email && (
                        <span className="flex items-center mt-1">
                          <Mail className="h-4 w-4 mr-1" />
                          {cliente.email}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-500 text-white">
                    Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  {cliente.telefone && (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cliente.telefone}</span>
                    </div>
                  )}
                  {cliente.cidade && (
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cliente.cidade}</span>
                    </div>
                  )}
                   <div className="flex space-x-2">
                     <Button 
                       variant="outline" 
                       size="sm"
                       onClick={() => setViewDetails(cliente)}
                     >
                       <Eye className="h-4 w-4 mr-1" />
                       Ver Detalhes
                     </Button>
                     <Button 
                       size="sm"
                       onClick={() => {
                         setSelectedCliente(cliente);
                         setShowForm(true);
                       }}
                     >
                       <Edit className="h-4 w-4 mr-1" />
                       Editar
                     </Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
