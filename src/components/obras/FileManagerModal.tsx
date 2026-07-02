import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Upload, 
  File, 
  Download, 
  Trash2, 
  Eye, 
  Share2, 
  History, 
  Filter,
  Search,
  FileText,
  Image,
  Video,
  Archive
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface FileData {
  id: string;
  nome_arquivo: string;
  nome_original: string;
  categoria: string;
  tipo_arquivo: string;
  tamanho_bytes: number;
  url_storage: string;
  descricao?: string;
  tags?: string[];
  versao?: number;
  publico: boolean;
  status: string;
  data_upload: string;
  metadata?: any;
}

interface FileManagerModalProps {
  obra: { id: string; nome: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileManagerModal({ obra, open, onOpenChange }: FileManagerModalProps) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadDescription, setUploadDescription] = useState('');
  const [uploadTags, setUploadTags] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  const categories = [
    'projetos',
    'licencas',
    'contratos',
    'orcamentos',
    'fotos',
    'documentos_legais',
    'relatórios',
    'outros'
  ];

  useEffect(() => {
    if (open && obra) {
      loadFiles();
    }
  }, [open, obra]);

  const loadFiles = async () => {
    if (!obra) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('arquivos_obras')
        .select('*')
        .eq('obra_id', obra.id)
        .eq('status', 'ativo')
        .order('data_upload', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar arquivos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !obra || !user || !uploadCategory) {
      toast({
        title: "Erro",
        description: "Selecione um arquivo e preencha as informações obrigatórias",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/obras/${obra.id}/${fileName}`;

      // Upload do arquivo
      const { error: uploadError } = await supabase.storage
        .from('obras-arquivos')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('obras-arquivos')
        .getPublicUrl(filePath);

      // Salvar metadados no banco
      const { error: dbError } = await supabase
        .from('arquivos_obras')
        .insert({
          obra_id: obra.id,
          user_id: user.id,
          nome_arquivo: fileName,
          nome_original: selectedFile.name,
          categoria: uploadCategory,
          tipo_arquivo: selectedFile.type,
          tamanho_bytes: selectedFile.size,
          url_storage: publicUrl,
          descricao: uploadDescription || null,
          tags: uploadTags ? uploadTags.split(',').map(tag => tag.trim()) : null,
          publico: false,
          status: 'ativo'
        });

      if (dbError) throw dbError;

      toast({
        title: "Sucesso!",
        description: "Arquivo enviado com sucesso.",
      });

      // Reset form
      setSelectedFile(null);
      setUploadCategory('');
      setUploadDescription('');
      setUploadTags('');
      
      // Reload files
      loadFiles();
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileDelete = async (fileId: string, filePath: string) => {
    try {
      // Remover do storage
      const { error: storageError } = await supabase.storage
        .from('obras-arquivos')
        .remove([filePath]);

      if (storageError) throw storageError;

      // Marcar como inativo no banco
      const { error: dbError } = await supabase
        .from('arquivos_obras')
        .update({ status: 'inativo' })
        .eq('id', fileId);

      if (dbError) throw dbError;

      toast({
        title: "Arquivo removido",
        description: "Arquivo foi removido com sucesso.",
      });

      loadFiles();
    } catch (error: any) {
      toast({
        title: "Erro ao remover arquivo",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.nome_original.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (file.descricao && file.descricao.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || file.categoria === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-8 w-8 text-green-500" />;
    if (type.startsWith('video/')) return <Video className="h-8 w-8 text-blue-500" />;
    if (type === 'application/pdf') return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('zip') || type.includes('rar')) return <Archive className="h-8 w-8 text-yellow-500" />;
    return <File className="h-8 w-8 text-gray-500" />;
  };

  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Gerenciar Arquivos - {obra.nome}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="files">Arquivos</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="files" className="space-y-4">
            {/* Filtros */}
            <div className="flex gap-4 items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar arquivos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Lista de arquivos */}
            {loading ? (
              <div className="text-center py-8">Carregando arquivos...</div>
            ) : (
              <div className="grid gap-4">
                {filteredFiles.map((file) => (
                  <Card key={file.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getFileIcon(file.tipo_arquivo)}
                          <div className="flex-1">
                            <h4 className="font-medium">{file.nome_original}</h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Badge variant="outline">{file.categoria}</Badge>
                              <span>{formatFileSize(file.tamanho_bytes)}</span>
                              <span>v{file.versao}</span>
                              <span>{new Date(file.data_upload).toLocaleDateString('pt-BR')}</span>
                            </div>
                            {file.descricao && (
                              <p className="text-sm text-muted-foreground mt-1">{file.descricao}</p>
                            )}
                            {file.tags && file.tags.length > 0 && (
                              <div className="flex gap-1 mt-2">
                                {file.tags.map((tag, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(file.url_storage, '_blank')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              const link = document.createElement('a');
                              link.href = file.url_storage;
                              link.download = file.nome_original;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleFileDelete(file.id, file.url_storage)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredFiles.length === 0 && !loading && (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum arquivo encontrado
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Arquivo</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Categoria *</label>
                  <Select value={uploadCategory} onValueChange={setUploadCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Textarea
                    placeholder="Descrição do arquivo..."
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tags</label>
                  <Input
                    placeholder="Tags separadas por vírgula..."
                    value={uploadTags}
                    onChange={(e) => setUploadTags(e.target.value)}
                    disabled={uploading}
                  />
                </div>

                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || uploading || !uploadCategory}
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Progress value={50} className="w-4 h-4 mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Enviar Arquivo
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}