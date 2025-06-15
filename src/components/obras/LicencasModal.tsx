import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FileText, Edit, AlertTriangle, CheckCircle, Clock, X } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { useCreateLicencaObra, useUpdateLicencaObra, useDeleteLicencaObra } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";

type LicencaObra = Tables<'licencas_obras'>;

interface LicencasModalProps {
  obraId: string;
  obraNome: string;
  licencas: LicencaObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LicencasModal({ obraId, obraNome, licencas, open, onOpenChange }: LicencasModalProps) {
  const { toast } = useToast();
  const createLicenca = useCreateLicencaObra();
  const updateLicenca = useUpdateLicencaObra();
  const deleteLicenca = useDeleteLicencaObra();
  
  const [showForm, setShowForm] = useState(false);
  const [editingLicenca, setEditingLicenca] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    numero_licenca: '',
    orgao_emissor: '',
    data_emissao: '',
    data_vencimento: '',
    status: 'pendente' as 'pendente' | 'aprovada' | 'vencida' | 'renovacao' | 'negada',
    arquivo_url: '',
    observacoes: ''
  });

  const resetForm = () => {
    setFormData({
      nome: '',
      tipo: '',
      numero_licenca: '',
      orgao_emissor: '',
      data_emissao: '',
      data_vencimento: '',
      status: 'pendente' as 'pendente' | 'aprovada' | 'vencida' | 'renovacao' | 'negada',
      arquivo_url: '',
      observacoes: ''
    });
    setEditingLicenca(null);
  };

  const handleSubmit = async () => {
    if (!formData.nome || !formData.tipo) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingLicenca) {
        await updateLicenca.mutateAsync({
          id: editingLicenca,
          ...formData
        });
      } else {
        await createLicenca.mutateAsync({
          obra_id: obraId,
          ...formData
        });
      }

      setShowForm(false);
      resetForm();
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleEdit = (licenca: LicencaObra) => {
    setFormData({
      nome: licenca.nome,
      tipo: licenca.tipo,
      numero_licenca: licenca.numero_licenca || '',
      orgao_emissor: licenca.orgao_emissor || '',
      data_emissao: licenca.data_emissao || '',
      data_vencimento: licenca.data_vencimento || '',
      status: licenca.status as 'pendente' | 'aprovada' | 'vencida' | 'renovacao' | 'negada',
      arquivo_url: licenca.arquivo_url || '',
      observacoes: licenca.observacoes || ''
    });
    setEditingLicenca(licenca.id);
    setShowForm(true);
  };

  const handleDelete = async (licenca: LicencaObra) => {
    if (confirm(`Tem certeza que deseja remover a licença "${licenca.nome}"?`)) {
      await deleteLicenca.mutateAsync({ id: licenca.id, obraId });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aprovada': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'vencida': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'negada': return <X className="h-4 w-4 text-red-500" />;
      case 'renovacao': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'pendente': 'Pendente',
      'aprovada': 'Aprovada',
      'vencida': 'Vencida',
      'renovacao': 'Renovação',
      'negada': 'Negada'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aprovada': return 'text-green-600 border-green-600';
      case 'vencida': return 'text-red-600 border-red-600';
      case 'negada': return 'text-red-600 border-red-600';
      case 'renovacao': return 'text-yellow-600 border-yellow-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const tiposLicenca = [
    'Licença de Construção',
    'Alvará de Construção',
    'Licença Ambiental',
    'Licença de Instalação',
    'Licença de Operação',
    'Habite-se',
    'AVCB - Auto de Vistoria do Corpo de Bombeiros',
    'Licença Sanitária',
    'Alvará de Funcionamento',
    'Outros'
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Licenças e Documentos - {obraNome}
            </div>
            <Button onClick={() => { setShowForm(!showForm); if (showForm) resetForm(); }} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              {showForm ? 'Cancelar' : 'Nova Licença'}
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário para Nova/Editar Licença */}
          {showForm && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  {editingLicenca ? 'Editar Licença' : 'Nova Licença'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome da Licença *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="Ex: Alvará de Construção"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="tipo">Tipo *</Label>
                    <Select value={formData.tipo} onValueChange={(value) => setFormData(prev => ({ ...prev, tipo: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposLicenca.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="numero_licenca">Número da Licença</Label>
                    <Input
                      id="numero_licenca"
                      value={formData.numero_licenca}
                      onChange={(e) => setFormData(prev => ({ ...prev, numero_licenca: e.target.value }))}
                      placeholder="Ex: AL-2024-001"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="orgao_emissor">Órgão Emissor</Label>
                    <Input
                      id="orgao_emissor"
                      value={formData.orgao_emissor}
                      onChange={(e) => setFormData(prev => ({ ...prev, orgao_emissor: e.target.value }))}
                      placeholder="Ex: Prefeitura Municipal"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="data_emissao">Data de Emissão</Label>
                    <Input
                      id="data_emissao"
                      type="date"
                      value={formData.data_emissao}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_emissao: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                    <Input
                      id="data_vencimento"
                      type="date"
                      value={formData.data_vencimento}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_vencimento: e.target.value }))}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="aprovada">Aprovada</SelectItem>
                        <SelectItem value="vencida">Vencida</SelectItem>
                        <SelectItem value="renovacao">Renovação</SelectItem>
                        <SelectItem value="negada">Negada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="arquivo_url">URL do Arquivo</Label>
                    <Input
                      id="arquivo_url"
                      value={formData.arquivo_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, arquivo_url: e.target.value }))}
                      placeholder="https://..."
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações sobre a licença..."
                  />
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleSubmit} 
                    disabled={createLicenca.isPending || updateLicenca.isPending}
                  >
                    {(createLicenca.isPending || updateLicenca.isPending) ? 'Salvando...' : 'Salvar Licença'}
                  </Button>
                  <Button variant="outline" onClick={() => { setShowForm(false); resetForm(); }}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Lista de Licenças */}
          <div className="space-y-4">
            {licencas.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma licença cadastrada</p>
                <p className="text-sm text-muted-foreground">Adicione licenças para controlar a documentação da obra</p>
              </div>
            ) : (
              licencas.map((licenca) => (
                <Card key={licenca.id} className="border-l-4 border-l-primary">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{licenca.nome}</h4>
                          {getStatusIcon(licenca.status)}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium">Tipo:</span>
                            <p className="text-muted-foreground">{licenca.tipo}</p>
                          </div>
                          
                          {licenca.numero_licenca && (
                            <div>
                              <span className="font-medium">Número:</span>
                              <p className="text-muted-foreground">{licenca.numero_licenca}</p>
                            </div>
                          )}
                          
                          {licenca.orgao_emissor && (
                            <div>
                              <span className="font-medium">Órgão Emissor:</span>
                              <p className="text-muted-foreground">{licenca.orgao_emissor}</p>
                            </div>
                          )}
                          
                          {licenca.data_emissao && (
                            <div>
                              <span className="font-medium">Data Emissão:</span>
                              <p className="text-muted-foreground">
                                {new Date(licenca.data_emissao).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                          
                          {licenca.data_vencimento && (
                            <div>
                              <span className="font-medium">Vencimento:</span>
                              <p className="text-muted-foreground">
                                {new Date(licenca.data_vencimento).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          )}
                        </div>
                        
                        {licenca.observacoes && (
                          <div className="mt-3 pt-3 border-t">
                            <span className="font-medium text-sm">Observações:</span>
                            <p className="text-sm text-muted-foreground mt-1">{licenca.observacoes}</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-4 flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(licenca)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(licenca)}
                          disabled={deleteLicenca.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {licenca.arquivo_url && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(licenca.arquivo_url, '_blank')}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Badge 
                          variant="outline" 
                          className={getStatusColor(licenca.status)}
                        >
                          {getStatusLabel(licenca.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}