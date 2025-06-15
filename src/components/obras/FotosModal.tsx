import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Camera, Upload, Calendar } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

type FotoObra = Tables<'fotos_obras'>;
import { useCreateFotoObra } from "@/hooks/useSupabaseQuery";
import { useToast } from "@/hooks/use-toast";

interface FotosModalProps {
  obraId: string;
  fotos: FotoObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FotosModal({ obraId, fotos, open, onOpenChange }: FotosModalProps) {
  const { toast } = useToast();
  const createFoto = useCreateFotoObra();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    arquivo_url: '',
    etapa: '',
    data_foto: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async () => {
    if (!formData.arquivo_url) {
      toast({
        title: "Erro",
        description: "Selecione uma foto para upload.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createFoto.mutateAsync({
        obra_id: obraId,
        titulo: formData.titulo,
        descricao: formData.descricao,
        arquivo_url: formData.arquivo_url,
        etapa: formData.etapa,
        data_foto: formData.data_foto
      });

      setShowForm(false);
      setFormData({
        titulo: '',
        descricao: '',
        arquivo_url: '',
        etapa: '',
        data_foto: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulação de upload - em produção seria enviado para o Supabase Storage
      const url = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, arquivo_url: url }));
      if (!formData.titulo) {
        setFormData(prev => ({ ...prev, titulo: file.name }));
      }
    }
  };

  const fotosPorData = fotos.reduce((acc, foto) => {
    const data = foto.data_foto;
    if (!acc[data]) acc[data] = [];
    acc[data].push(foto);
    return acc;
  }, {} as Record<string, FotoObra[]>);

  const datasOrdenadas = Object.keys(fotosPorData).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Fotos da Obra
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Foto
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Formulário para Nova Foto */}
          {showForm && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="file">Arquivo da Foto *</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="file"
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="cursor-pointer"
                      />
                      <Upload className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      placeholder="Título da foto..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="etapa">Etapa</Label>
                    <Input
                      id="etapa"
                      value={formData.etapa}
                      onChange={(e) => setFormData(prev => ({ ...prev, etapa: e.target.value }))}
                      placeholder="Ex: Fundação, Estrutura..."
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="data_foto">Data da Foto</Label>
                    <Input
                      id="data_foto"
                      type="date"
                      value={formData.data_foto}
                      onChange={(e) => setFormData(prev => ({ ...prev, data_foto: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição da foto..."
                  />
                </div>
                
                {formData.arquivo_url && (
                  <div>
                    <Label>Preview</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img 
                        src={formData.arquivo_url} 
                        alt="Preview" 
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button onClick={handleSubmit} disabled={createFoto.isPending}>
                    {createFoto.isPending ? 'Salvando...' : 'Salvar Foto'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Galeria de Fotos */}
          <div className="space-y-6">
            {fotos.length === 0 ? (
              <div className="text-center py-8">
                <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma foto cadastrada</p>
                <p className="text-sm text-muted-foreground">Adicione fotos para documentar o progresso da obra</p>
              </div>
            ) : (
              datasOrdenadas.map(data => (
                <div key={data} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <h3 className="font-semibold">
                      {new Date(data).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'long', 
                        year: 'numeric' 
                      })}
                    </h3>
                    <Badge variant="outline">{fotosPorData[data].length} fotos</Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {fotosPorData[data].map((foto) => (
                      <Card key={foto.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          <img 
                            src={foto.arquivo_url} 
                            alt={foto.titulo || 'Foto da obra'}
                            className="w-full h-full object-cover"
                          />
                          {foto.etapa && (
                            <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                              {foto.etapa}
                            </Badge>
                          )}
                        </div>
                        
                        <CardContent className="p-3">
                          {foto.titulo && (
                            <h4 className="font-medium text-sm mb-1">{foto.titulo}</h4>
                          )}
                          {foto.descricao && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {foto.descricao}
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}