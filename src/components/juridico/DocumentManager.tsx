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

interface Document {
  id: string;
  nome: string;
  tipo: string;
  status: 'valido' | 'vencido' | 'pendente' | 'analise';
  vencimento: string;
  processo: string;
  cliente: string;
  responsavel: string;
  dataUpload: string;
  observacoes?: string;
  arquivo?: string;
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
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    tipo: 'todos',
    busca: ''
  });

  const documentos: Document[] = [
    {
      id: '1',
      nome: 'Certidão de Ônus Reais',
      tipo: 'Certidão',
      status: 'valido',
      vencimento: '15/03/2025',
      processo: 'PROC-001',
      cliente: 'João Silva',
      responsavel: 'Dr. Carlos',
      dataUpload: '10/01/2024',
      observacoes: 'Documento verificado e aprovado'
    },
    {
      id: '2',
      nome: 'Certidão de Distribuição',
      tipo: 'Certidão',
      status: 'vencido',
      vencimento: '10/01/2024',
      processo: 'PROC-002',
      cliente: 'Maria Santos',
      responsavel: 'Dra. Ana',
      dataUpload: '05/01/2024',
      observacoes: 'Necessário renovação urgente'
    },
    {
      id: '3',
      nome: 'Escritura de Compra e Venda',
      tipo: 'Contrato',
      status: 'analise',
      vencimento: '-',
      processo: 'PROC-003',
      cliente: 'Pedro Costa',
      responsavel: 'Dr. Roberto',
      dataUpload: '20/01/2024'
    },
    {
      id: '4',
      nome: 'IPTU 2024',
      tipo: 'Tributário',
      status: 'pendente',
      vencimento: '31/12/2024',
      processo: 'PROC-001',
      cliente: 'João Silva',
      responsavel: 'Dr. Carlos',
      dataUpload: '15/01/2024',
      observacoes: 'Aguardando pagamento'
    }
  ];

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

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'valido': return 'bg-green-500';
      case 'vencido': return 'bg-red-500';
      case 'pendente': return 'bg-yellow-500';
      case 'analise': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: Document['status']) => {
    switch (status) {
      case 'valido': return 'Válido';
      case 'vencido': return 'Vencido';
      case 'pendente': return 'Pendente';
      case 'analise': return 'Em Análise';
      default: return status;
    }
  };

  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'valido': return <CheckCircle className="h-4 w-4" />;
      case 'vencido': return <AlertTriangle className="h-4 w-4" />;
      case 'pendente': return <Clock className="h-4 w-4" />;
      case 'analise': return <FileCheck className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const documentosFiltrados = documentos.filter(doc => {
    const matchBusca = doc.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
                      doc.cliente.toLowerCase().includes(filtros.busca.toLowerCase());
    const matchStatus = filtros.status === 'todos' || doc.status === filtros.status;
    const matchTipo = filtros.tipo === 'todos' || doc.tipo === filtros.tipo;
    
    return matchBusca && matchStatus && matchTipo;
  });

  const estatisticas = {
    total: documentos.length,
    validos: documentos.filter(d => d.status === 'valido').length,
    vencidos: documentos.filter(d => d.status === 'vencido').length,
    pendentes: documentos.filter(d => d.status === 'pendente').length,
    analise: documentos.filter(d => d.status === 'analise').length
  };

  const handleUploadDocument = () => {
    toast({
      title: "Upload Realizado",
      description: "Documento enviado para análise com sucesso.",
    });
    setShowUploadDialog(false);
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
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{estatisticas.analise}</div>
            <p className="text-xs text-muted-foreground">processando</p>
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
                  <SelectItem value="analise">Em Análise</SelectItem>
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
          <div className="space-y-4">
            {documentosFiltrados.map((documento) => (
              <div key={documento.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      {getStatusIcon(documento.status)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{documento.nome}</h4>
                      <p className="text-sm text-muted-foreground">
                        {documento.cliente} • {documento.processo}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Responsável: {documento.responsavel}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={`${getStatusColor(documento.status)} text-white`}>
                      {getStatusLabel(documento.status)}
                    </Badge>
                    <Badge variant="outline">
                      {documento.tipo}
                    </Badge>
                  </div>
                </div>

                <div className="grid gap-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Upload:</span>
                    <span className="ml-1">{documento.dataUpload}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vencimento:</span>
                    <span className={`ml-1 ${documento.status === 'vencido' ? 'text-red-600 font-medium' : ''}`}>
                      {documento.vencimento || 'N/A'}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedDocument(documento)}>
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                  </div>
                </div>

                {documento.observacoes && (
                  <div className="mt-3 p-2 bg-muted rounded text-sm">
                    <span className="font-medium">Observações:</span> {documento.observacoes}
                  </div>
                )}
              </div>
            ))}
          </div>
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
                  <Label className="font-semibold">Status</Label>
                  <Badge className={`${getStatusColor(selectedDocument.status)} text-white`}>
                    {getStatusLabel(selectedDocument.status)}
                  </Badge>
                </div>
                <div>
                  <Label className="font-semibold">Processo</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.processo}</p>
                </div>
                <div>
                  <Label className="font-semibold">Cliente</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.cliente}</p>
                </div>
                <div>
                  <Label className="font-semibold">Responsável</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.responsavel}</p>
                </div>
                <div>
                  <Label className="font-semibold">Data de Upload</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.dataUpload}</p>
                </div>
                <div>
                  <Label className="font-semibold">Vencimento</Label>
                  <p className="text-sm text-muted-foreground">{selectedDocument.vencimento}</p>
                </div>
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
                <Label htmlFor="nomeDoc">Nome do Documento</Label>
                <Input id="nomeDoc" placeholder="Ex: Certidão de Ônus Reais" />
              </div>
              <div>
                <Label htmlFor="tipoDoc">Tipo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="certidao">Certidão</SelectItem>
                    <SelectItem value="contrato">Contrato</SelectItem>
                    <SelectItem value="tributario">Tributário</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="processo">Processo</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o processo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="proc-001">PROC-001</SelectItem>
                    <SelectItem value="proc-002">PROC-002</SelectItem>
                    <SelectItem value="proc-003">PROC-003</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vencimento">Vencimento</Label>
                <Input id="vencimento" type="date" />
              </div>
            </div>
            <div>
              <Label htmlFor="arquivo">Arquivo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Clique para selecionar ou arraste o arquivo aqui
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, DOC, DOCX até 10MB
                </p>
              </div>
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Input id="observacoes" placeholder="Observações sobre o documento..." />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleUploadDocument} className="flex-1">
                Fazer Upload
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