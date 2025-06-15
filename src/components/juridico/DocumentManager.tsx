import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Calendar, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  FileCheck,
  Search,
  Filter,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { 
  useDocumentosJuridicos, 
  useClientes, 
  useImoveis, 
  useCreateDocumento,
  DocumentoJuridico 
} from "@/hooks/useSupabaseQuery";
import { useFileUpload } from "@/hooks/useFileUpload";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UploadFormData {
  nome: string;
  tipo: string;
  categoria: string;
  cliente_id?: string;
  imovel_id?: string;
  data_vencimento?: string;
  orgao_emissor?: string;
  numero_documento?: string;
  observacoes?: string;
}

interface DocumentTemplate {
  id: string;
  nome: string;
  categoria: string;
  obrigatorio: boolean;
  prazoValidade: number; // em meses
  descricao: string;
  orgaoEmissor: string;
}

export default function DocumentManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const { uploadFile, uploading } = useFileUpload();
  
  // Hooks para dados
  const { data: documentos = [], isLoading } = useDocumentosJuridicos();
  const { data: clientes = [] } = useClientes();
  const { data: imoveis = [] } = useImoveis();
  const createDocumento = useCreateDocumento();
  
  // Estados locais
  const [selectedDocument, setSelectedDocument] = useState<DocumentoJuridico | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadFormData, setUploadFormData] = useState<UploadFormData>({
    nome: '',
    tipo: '',
    categoria: '',
    cliente_id: '',
    imovel_id: '',
    data_vencimento: '',
    orgao_emissor: '',
    numero_documento: '',
    observacoes: ''
  });
  
  const [filtros, setFiltros] = useState({
    status: 'todos',
    tipo: 'todos',
    busca: ''
  });


  const templates: DocumentTemplate[] = [
    {
      id: '1',
      nome: 'Certidão de Ônus Reais',
      categoria: 'Certidões',
      obrigatorio: true,
      prazoValidade: 12,
      descricao: 'Certidão negativa de ônus reais sobre o imóvel',
      orgaoEmissor: 'Cartório de Registro de Imóveis'
    },
    {
      id: '2',
      nome: 'Certidão de Distribuição Cível',
      categoria: 'Certidões',
      obrigatorio: true,
      prazoValidade: 3,
      descricao: 'Certidão de distribuição de ações cíveis',
      orgaoEmissor: 'Tribunal de Justiça'
    },
    {
      id: '3',
      nome: 'Certidão de Distribuição Criminal',
      categoria: 'Certidões',
      obrigatorio: true,
      prazoValidade: 3,
      descricao: 'Certidão de distribuição de ações criminais',
      orgaoEmissor: 'Tribunal de Justiça'
    },
    {
      id: '4',
      nome: 'IPTU',
      categoria: 'Tributário',
      obrigatorio: true,
      prazoValidade: 12,
      descricao: 'Imposto Predial e Territorial Urbano',
      orgaoEmissor: 'Prefeitura Municipal'
    },
    {
      id: '5',
      nome: 'Escritura Pública',
      categoria: 'Contratos',
      obrigatorio: true,
      prazoValidade: 0,
      descricao: 'Escritura pública de compra e venda',
      orgaoEmissor: 'Cartório de Notas'
    }
  ];

  // Verificar se o documento está vencido
  const isDocumentExpired = (documento: DocumentoJuridico) => {
    if (!documento.data_vencimento) return false;
    return new Date(documento.data_vencimento) < new Date();
  };

  // Atualizar status automático baseado na data de vencimento
  const getActualStatus = (documento: DocumentoJuridico) => {
    if (isDocumentExpired(documento)) {
      return 'vencido';
    }
    return documento.status;
  };

  const getStatusColor = (status: DocumentoJuridico['status']) => {
    switch (status) {
      case 'valido': return 'bg-green-500';
      case 'vencido': return 'bg-red-500';
      case 'pendente': return 'bg-yellow-500';
      case 'invalido': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: DocumentoJuridico['status']) => {
    switch (status) {
      case 'valido': return 'Válido';
      case 'vencido': return 'Vencido';
      case 'pendente': return 'Pendente';
      case 'invalido': return 'Inválido';
      default: return status;
    }
  };

  const getStatusIcon = (status: DocumentoJuridico['status']) => {
    switch (status) {
      case 'valido': return <CheckCircle className="h-4 w-4" />;
      case 'vencido': return <AlertTriangle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'invalido': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    const actualStatus = getActualStatus(doc);
    const cliente = doc.clientes?.nome || '';
    
    const matchBusca = doc.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      cliente.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      doc.tipo.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchStatus = filtros.status === 'todos' || actualStatus === filtros.status;
    const matchTipo = filtros.tipo === 'todos' || doc.tipo === filtros.tipo;
    
    return matchBusca && matchStatus && matchTipo;
  });

  const estatisticas = {
    total: documentos.length,
    validos: documentos.filter(d => getActualStatus(d) === 'valido').length,
    vencidos: documentos.filter(d => getActualStatus(d) === 'vencido').length,
    pendentes: documentos.filter(d => getActualStatus(d) === 'pendente').length,
    invalidos: documentos.filter(d => getActualStatus(d) === 'invalido').length
  };

  const handleUploadDocument = async () => {
    if (!selectedFile || !user) return;

    if (!uploadFormData.nome || !uploadFormData.tipo || !uploadFormData.categoria) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Nome, Tipo e Categoria.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Upload do arquivo
      const uploadResult = await uploadFile(selectedFile, 'documentos');
      if (!uploadResult) return;

      // Salvar dados no banco usando o hook
      await createDocumento.mutateAsync({
        nome: uploadFormData.nome,
        tipo: uploadFormData.tipo,
        categoria: uploadFormData.categoria,
        cliente_id: uploadFormData.cliente_id || null,
        imovel_id: uploadFormData.imovel_id || null,
        data_vencimento: uploadFormData.data_vencimento || null,
        orgao_emissor: uploadFormData.orgao_emissor || null,
        numero_documento: uploadFormData.numero_documento || null,
        observacoes: uploadFormData.observacoes || null,
        arquivo_url: uploadResult.url,
        status: 'pendente'
      });

      // Limpar formulário
      setShowUploadDialog(false);
      setSelectedFile(null);
      setUploadFormData({
        nome: '',
        tipo: '',
        categoria: '',
        cliente_id: '',
        imovel_id: '',
        data_vencimento: '',
        orgao_emissor: '',
        numero_documento: '',
        observacoes: ''
      });

    } catch (error: any) {
      toast({
        title: "Erro ao cadastrar documento",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGerarTemplate = (template: DocumentTemplate) => {
    toast({
      title: "Template Gerado",
      description: `Template "${template.nome}" foi criado com sucesso.`,
    });
    setShowTemplateDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">Gestão de Documentos</h3>
          <p className="text-muted-foreground">Controle completo de documentos jurídicos</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowTemplateDialog(true)}>
            <FileText className="h-4 w-4 mr-2" />
            Templates
          </Button>
          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documento
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{estatisticas.total}</div>
            <p className="text-xs text-muted-foreground">documentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Válidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{estatisticas.validos}</div>
            <p className="text-xs text-muted-foreground">em dia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{estatisticas.vencidos}</div>
            <p className="text-xs text-muted-foreground">urgente</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{estatisticas.pendentes}</div>
            <p className="text-xs text-muted-foreground">aguardando</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Inválidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{estatisticas.invalidos}</div>
            <p className="text-xs text-muted-foreground">rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <Label htmlFor="busca">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="busca"
                  placeholder="Nome ou cliente..."
                  value={filtros.busca}
                  onChange={(e) => setFiltros({...filtros, busca: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={filtros.status} onValueChange={(value) => setFiltros({...filtros, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="valido">Válido</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="invalido">Inválido</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="tipo">Tipo</Label>
              <Select value={filtros.tipo} onValueChange={(value) => setFiltros({...filtros, tipo: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="Certidão">Certidão</SelectItem>
                  <SelectItem value="Contrato">Contrato</SelectItem>
                  <SelectItem value="Tributário">Tributário</SelectItem>
                  <SelectItem value="Documento Pessoal">Documento Pessoal</SelectItem>
                  <SelectItem value="Registro">Registro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => setFiltros({status: 'todos', tipo: 'todos', busca: ''})}
                className="w-full"
              >
                Limpar Filtros
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos</CardTitle>
          <CardDescription>Lista de todos os documentos cadastrados</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : documentosFiltrados.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum documento encontrado</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documentosFiltrados.map((documento) => {
                const actualStatus = getActualStatus(documento);
                const cliente = documento.clientes?.nome || 'N/A';
                
                return (
                  <div key={documento.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-start space-x-3">
                        <div className="mt-1">
                          {getStatusIcon(actualStatus)}
                        </div>
                        <div>
                          <h4 className="font-semibold">{documento.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            Cliente: {cliente} • Categoria: {documento.categoria}
                          </p>
                          {documento.orgao_emissor && (
                            <p className="text-xs text-muted-foreground">
                              Órgão Emissor: {documento.orgao_emissor}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getStatusColor(actualStatus)} text-white`}>
                          {getStatusLabel(actualStatus)}
                        </Badge>
                        <Badge variant="outline">
                          {documento.tipo}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-2 md:grid-cols-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Criado em:</span>
                        <span className="ml-1">
                          {new Date(documento.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Vencimento:</span>
                        <span className={`ml-1 ${actualStatus === 'vencido' ? 'text-red-600 font-medium' : ''}`}>
                          {documento.data_vencimento 
                            ? new Date(documento.data_vencimento).toLocaleDateString('pt-BR')
                            : 'N/A'
                          }
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedDocument(documento)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Ver
                        </Button>
                        {documento.arquivo_url && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => window.open(documento.arquivo_url, '_blank')}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>

                    {documento.observacoes && (
                      <div className="mt-3 p-2 bg-muted rounded text-sm">
                        <span className="font-medium">Observações:</span> {documento.observacoes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Detalhes do Documento */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Documento</DialogTitle>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="font-semibold">Nome do Documento</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.nome}</p>
                </div>
                <div>
                  <Label className="font-semibold">Tipo</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.tipo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Categoria</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.categoria}</p>
                </div>
                <div>
                  <Label className="font-semibold">Status</Label>
                  <Badge className={`${getStatusColor(getActualStatus(selectedDocument))} text-white`}>
                    {getStatusLabel(getActualStatus(selectedDocument))}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Cliente</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.clientes?.nome || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Imóvel</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.imoveis?.titulo || 'N/A'}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Criação</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedDocument.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Vencimento</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedDocument.data_vencimento 
                      ? new Date(selectedDocument.data_vencimento).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </p>
                </div>
                {selectedDocument.orgao_emissor && (
                  <div>
                    <Label className="font-semibold">Órgão Emissor</Label>
                    <p className="text-sm text-muted-foreground">{selectedDocument.orgao_emissor}</p>
                  </div>
                )}
                {selectedDocument.numero_documento && (
                  <div>
                    <Label className="font-semibold">Número do Documento</Label>
                    <p className="text-sm text-muted-foreground">{selectedDocument.numero_documento}</p>
                  </div>
                )}
              </div>
              {selectedDocument.observacoes && (
                <div>
                  <Label className="font-semibold">Observações</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.observacoes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Upload */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Upload de Documento</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nomeDoc">Nome do Documento *</Label>
                <Input 
                  id="nomeDoc" 
                  placeholder="Ex: Certidão de Ônus Reais"
                  value={uploadFormData.nome}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="tipoDoc">Tipo *</Label>
                <Select value={uploadFormData.tipo} onValueChange={(value) => setUploadFormData(prev => ({ ...prev, tipo: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Certidão">Certidão</SelectItem>
                    <SelectItem value="Contrato">Contrato</SelectItem>
                    <SelectItem value="Tributário">Tributário</SelectItem>
                    <SelectItem value="Documento Pessoal">Documento Pessoal</SelectItem>
                    <SelectItem value="Registro">Registro</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="categoria">Categoria *</Label>
                <Select value={uploadFormData.categoria} onValueChange={(value) => setUploadFormData(prev => ({ ...prev, categoria: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Imóvel">Imóvel</SelectItem>
                    <SelectItem value="Pessoal">Pessoal</SelectItem>
                    <SelectItem value="Empresarial">Empresarial</SelectItem>
                    <SelectItem value="Fiscal">Fiscal</SelectItem>
                    <SelectItem value="Judicial">Judicial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <Select value={uploadFormData.cliente_id} onValueChange={(value) => setUploadFormData(prev => ({ ...prev, cliente_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="imovel">Imóvel</Label>
                <Select value={uploadFormData.imovel_id} onValueChange={(value) => setUploadFormData(prev => ({ ...prev, imovel_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o imóvel" />
                  </SelectTrigger>
                  <SelectContent>
                    {imoveis.map((imovel) => (
                      <SelectItem key={imovel.id} value={imovel.id}>
                        {imovel.titulo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vencimento">Data de Vencimento</Label>
                <Input 
                  id="vencimento" 
                  type="date"
                  value={uploadFormData.data_vencimento}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, data_vencimento: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="orgao">Órgão Emissor</Label>
                <Input 
                  id="orgao" 
                  placeholder="Ex: Cartório de Registro de Imóveis"
                  value={uploadFormData.orgao_emissor}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, orgao_emissor: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número do Documento</Label>
                <Input 
                  id="numero" 
                  placeholder="Ex: 123456/2024"
                  value={uploadFormData.numero_documento}
                  onChange={(e) => setUploadFormData(prev => ({ ...prev, numero_documento: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="arquivo">Arquivo *</Label>
              <div className="space-y-2">
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSelectedFile(file);
                      if (!uploadFormData.nome) {
                        setUploadFormData(prev => ({ 
                          ...prev, 
                          nome: file.name.split('.')[0] 
                        }));
                      }
                    }
                  }}
                />
                {selectedFile && (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded">
                    <FileText className="h-4 w-4" />
                    <span className="text-sm">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      ({(selectedFile.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input 
                id="observacoes" 
                placeholder="Observações sobre o documento..."
                value={uploadFormData.observacoes}
                onChange={(e) => setUploadFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleUploadDocument} 
                className="flex-1"
                disabled={uploading || !selectedFile}
              >
                {uploading ? "Enviando..." : "Fazer Upload"}
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de Templates */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Templates de Documentos</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {templates.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold flex items-center">
                      {template.nome}
                      {template.obrigatorio && (
                        <Badge variant="destructive" className="ml-2 text-xs">
                          Obrigatório
                        </Badge>
                      )}
                    </h4>
                    <p className="text-sm text-muted-foreground">{template.descricao}</p>
                  </div>
                  <Button size="sm" onClick={() => handleGerarTemplate(template)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Usar Template
                  </Button>
                </div>
                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Categoria:</span>
                    <span className="ml-1">{template.categoria}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Validade:</span>
                    <span className="ml-1">
                      {template.prazoValidade > 0 ? `${template.prazoValidade} meses` : 'Permanente'}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Órgão:</span>
                    <span className="ml-1">{template.orgaoEmissor}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}