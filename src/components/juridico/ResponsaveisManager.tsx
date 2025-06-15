import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, UserCheck, Mail, Phone, Briefcase } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useResponsaveis, useCreateResponsavel, useUpdateResponsavel, ResponsavelJuridico } from "@/hooks/useSupabaseQuery";

interface FormData {
  nome: string;
  email: string;
  telefone: string;
  oab: string;
  especializacao: string;
}

export default function ResponsaveisManager() {
  const { toast } = useToast();
  const { data: responsaveis = [], isLoading } = useResponsaveis();
  const createResponsavel = useCreateResponsavel();
  const updateResponsavel = useUpdateResponsavel();
  
  const [showDialog, setShowDialog] = useState(false);
  const [editingResponsavel, setEditingResponsavel] = useState<ResponsavelJuridico | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    email: '',
    telefone: '',
    oab: '',
    especializacao: ''
  });

  const handleSubmit = async () => {
    if (!formData.nome) {
      toast({
        title: "Erro",
        description: "Nome é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingResponsavel) {
        await updateResponsavel.mutateAsync({
          id: editingResponsavel.id,
          ...formData
        });
      } else {
        await createResponsavel.mutateAsync({ ...formData, ativo: true });
      }
      
      setShowDialog(false);
      setEditingResponsavel(null);
      setFormData({ nome: '', email: '', telefone: '', oab: '', especializacao: '' });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleEdit = (responsavel: ResponsavelJuridico) => {
    setEditingResponsavel(responsavel);
    setFormData({
      nome: responsavel.nome,
      email: responsavel.email || '',
      telefone: responsavel.telefone || '',
      oab: responsavel.oab || '',
      especializacao: responsavel.especializacao || ''
    });
    setShowDialog(true);
  };

  const handleToggleAtivo = async (responsavel: ResponsavelJuridico) => {
    try {
      await updateResponsavel.mutateAsync({
        id: responsavel.id,
        ativo: !responsavel.ativo
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const responsaveisAtivos = responsaveis.filter(r => r.ativo);
  const responsaveisInativos = responsaveis.filter(r => !r.ativo);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestão de Responsáveis</h3>
          <p className="text-muted-foreground">Cadastre e gerencie advogados e responsáveis</p>
        </div>
        <Button onClick={() => setShowDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Responsável
        </Button>
      </div>

      {/* Responsáveis Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Responsáveis Ativos ({responsaveisAtivos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : responsaveisAtivos.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum responsável cadastrado</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {responsaveisAtivos.map((responsavel) => (
                <div key={responsavel.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{responsavel.nome}</h4>
                      {responsavel.oab && (
                        <Badge variant="outline" className="mt-1">
                          OAB: {responsavel.oab}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={responsavel.ativo}
                        onCheckedChange={() => handleToggleAtivo(responsavel)}
                      />
                      <Button size="sm" variant="outline" onClick={() => handleEdit(responsavel)}>
                        Editar
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {responsavel.email && (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        {responsavel.email}
                      </div>
                    )}
                    {responsavel.telefone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        {responsavel.telefone}
                      </div>
                    )}
                    {responsavel.especializacao && (
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                        {responsavel.especializacao}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Responsáveis Inativos */}
      {responsaveisInativos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Responsáveis Inativos ({responsaveisInativos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {responsaveisInativos.map((responsavel) => (
                <div key={responsavel.id} className="border rounded-lg p-4 opacity-60">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{responsavel.nome}</h4>
                      {responsavel.oab && (
                        <Badge variant="outline" className="mt-1">
                          OAB: {responsavel.oab}
                        </Badge>
                      )}
                    </div>
                    <Switch
                      checked={responsavel.ativo}
                      onCheckedChange={() => handleToggleAtivo(responsavel)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Cadastro/Edição */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingResponsavel ? 'Editar Responsável' : 'Novo Responsável'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Dr. João Silva"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="joao@escritorio.com"
                />
              </div>
              <div>
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div>
                <Label htmlFor="oab">OAB</Label>
                <Input
                  id="oab"
                  value={formData.oab}
                  onChange={(e) => setFormData(prev => ({ ...prev, oab: e.target.value }))}
                  placeholder="SP 123456"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="especializacao">Especialização</Label>
              <Input
                id="especializacao"
                value={formData.especializacao}
                onChange={(e) => setFormData(prev => ({ ...prev, especializacao: e.target.value }))}
                placeholder="Direito Imobiliário, Civil, etc."
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleSubmit} className="flex-1">
                {editingResponsavel ? 'Salvar Alterações' : 'Cadastrar'}
              </Button>
              <Button variant="outline" onClick={() => setShowDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}