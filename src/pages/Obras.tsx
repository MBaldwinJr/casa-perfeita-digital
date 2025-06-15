
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Hammer, Calendar, Camera, FileText, AlertTriangle, CheckCircle, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useObras, useCreateObra, useCronogramasObra, useLicencasObra, useFotosObra } from "@/hooks/useSupabaseQuery";

export default function Obras() {
  const { toast } = useToast();
  const { data: obras = [], isLoading } = useObras();
  
  const [showNovaObraDialog, setShowNovaObraDialog] = useState(false);
  const [selectedObraId, setSelectedObraId] = useState('');
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    descricao: '',
    data_inicio: '',
    data_previsao_fim: '',
    valor_orcamento: 0,
    responsavel_tecnico: '',
    cnpj_responsavel: '',
    status: 'planejamento' as const,
    observacoes: ''
  });

  const createObra = useCreateObra();

  // Usar a primeira obra como exemplo para cronograma/licenças
  const primeiraObra = obras[0]?.id || '';
  const { data: cronogramas = [] } = useCronogramasObra(primeiraObra);
  const { data: licencas = [] } = useLicencasObra(primeiraObra);
  const { data: fotos = [] } = useFotosObra(primeiraObra);

  const handleNovaObra = () => {
    setShowNovaObraDialog(true);
  };

  const handleCriarObra = async () => {
    if (!formData.nome || !formData.endereco || !formData.data_inicio) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createObra.mutateAsync({
        nome: formData.nome,
        endereco: formData.endereco,
        descricao: formData.descricao,
        data_inicio: formData.data_inicio,
        data_previsao_fim: formData.data_previsao_fim || undefined,
        valor_orcamento: formData.valor_orcamento || undefined,
        valor_gasto: 0,
        progresso_percentual: 0,
        responsavel_tecnico: formData.responsavel_tecnico,
        cnpj_responsavel: formData.cnpj_responsavel,
        status: formData.status,
        observacoes: formData.observacoes
      });
      
      setShowNovaObraDialog(false);
      setFormData({
        nome: '',
        endereco: '',
        descricao: '',
        data_inicio: '',
        data_previsao_fim: '',
        valor_orcamento: 0,
        responsavel_tecnico: '',
        cnpj_responsavel: '',
        status: 'planejamento',
        observacoes: ''
      });
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      'planejamento': 'bg-gray-500',
      'fundacao': 'bg-yellow-500',
      'estrutura': 'bg-orange-500',
      'alvenaria': 'bg-blue-500',
      'cobertura': 'bg-purple-500',
      'instalacoes': 'bg-indigo-500',
      'acabamento': 'bg-green-500',
      'concluida': 'bg-emerald-500',
      'pausada': 'bg-red-500'
    };
    return statusMap[status] || 'bg-gray-500';
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      'planejamento': 'Planejamento',
      'fundacao': 'Fundação',
      'estrutura': 'Estrutura',
      'alvenaria': 'Alvenaria',
      'cobertura': 'Cobertura',
      'instalacoes': 'Instalações',
      'acabamento': 'Acabamento',
      'concluida': 'Concluída',
      'pausada': 'Pausada'
    };
    return statusMap[status] || status;
  };

  const obrasAtivas = obras.filter(obra => obra.status !== 'concluida' && obra.status !== 'pausada');
  const obrasNoPrazo = obras.filter(obra => {
    if (!obra.data_previsao_fim) return true;
    return new Date(obra.data_previsao_fim) > new Date();
  });
  const totalFotos = fotos.length;

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
          <h2 className="text-2xl font-bold">Gestão de Obras</h2>
          <p className="text-muted-foreground">Cronogramas, fotos e licenças de construção</p>
        </div>
        <Button onClick={handleNovaObra}>
          <Hammer className="h-4 w-4 mr-2" />
          Nova Obra
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Obras Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{obrasAtivas.length}</div>
            <p className="text-xs text-muted-foreground">
              {obras.filter(o => o.progresso_percentual > 80).length} concluindo este mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">No Prazo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {obras.length > 0 ? Math.round((obrasNoPrazo.length / obras.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              {obras.length - obrasNoPrazo.length} obras atrasadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Fotos Cadastradas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFotos}</div>
            <p className="text-xs text-muted-foreground">
              {fotos.filter(f => {
                const dataFoto = new Date(f.data_foto);
                const semanaPassada = new Date();
                semanaPassada.setDate(semanaPassada.getDate() - 7);
                return dataFoto > semanaPassada;
              }).length} esta semana
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Obras em Andamento</CardTitle>
          <CardDescription>Acompanhe o progresso das construções</CardDescription>
        </CardHeader>
        <CardContent>
          {obras.length === 0 ? (
            <div className="text-center py-8">
              <Hammer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma obra cadastrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {obras.map((obra) => (
                <div key={obra.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold">{obra.nome}</h4>
                      <p className="text-sm text-muted-foreground">{obra.endereco}</p>
                      {obra.responsavel_tecnico && (
                        <p className="text-sm text-muted-foreground">
                          Responsável: {obra.responsavel_tecnico}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={`${getStatusColor(obra.status)} text-white mb-1`}>
                        {getStatusLabel(obra.status)}
                      </Badge>
                      {obra.data_previsao_fim && (
                        <p className="text-sm text-muted-foreground">
                          Prev: {new Date(obra.data_previsao_fim).toLocaleDateString('pt-BR')}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progresso Geral</span>
                      <span>{obra.progresso_percentual}%</span>
                    </div>
                    <Progress value={obra.progresso_percentual} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Cronograma
                      </Button>
                      <Button size="sm" variant="outline">
                        <Camera className="h-4 w-4 mr-1" />
                        Fotos ({obra.id === primeiraObra ? fotos.length : 0})
                      </Button>
                    </div>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Cronograma {obras[0] ? `- ${obras[0].nome}` : ''}
            </CardTitle>
            <CardDescription>Acompanhamento das etapas da obra</CardDescription>
          </CardHeader>
          <CardContent>
            {cronogramas.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma etapa cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cronogramas.map((etapa) => (
                  <div key={etapa.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{etapa.etapa}</p>
                      <p className="text-sm text-muted-foreground">
                        Previsto: {new Date(etapa.data_inicio_prevista).toLocaleDateString('pt-BR')} - {new Date(etapa.data_fim_prevista).toLocaleDateString('pt-BR')}
                      </p>
                      {etapa.data_inicio_real && (
                        <p className="text-sm text-muted-foreground">
                          Realizado: {new Date(etapa.data_inicio_real).toLocaleDateString('pt-BR')}
                          {etapa.data_fim_real && ` - ${new Date(etapa.data_fim_real).toLocaleDateString('pt-BR')}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {etapa.status === 'concluida' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {etapa.status === 'em_andamento' && <AlertTriangle className="h-4 w-4 text-blue-500" />}
                      {etapa.status === 'atrasada' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                      <Badge 
                        variant="outline" 
                        className={
                          etapa.status === 'concluida' ? 'text-green-600 border-green-600' :
                          etapa.status === 'em_andamento' ? 'text-blue-600 border-blue-600' :
                          etapa.status === 'atrasada' ? 'text-red-600 border-red-600' :
                          'text-gray-600 border-gray-600'
                        }
                      >
                        {etapa.status === 'concluida' ? 'Concluída' :
                         etapa.status === 'em_andamento' ? 'Em Andamento' :
                         etapa.status === 'atrasada' ? 'Atrasada' : 'Pendente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Licenças e Documentos
            </CardTitle>
            <CardDescription>Status das licenças de construção</CardDescription>
          </CardHeader>
          <CardContent>
            {licencas.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Nenhuma licença cadastrada</p>
              </div>
            ) : (
              <div className="space-y-3">
                {licencas.map((licenca) => (
                  <div key={licenca.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{licenca.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {licenca.data_vencimento 
                          ? `Vencimento: ${new Date(licenca.data_vencimento).toLocaleDateString('pt-BR')}`
                          : 'Aguardando emissão'
                        }
                      </p>
                      {licenca.orgao_emissor && (
                        <p className="text-sm text-muted-foreground">Órgão: {licenca.orgao_emissor}</p>
                      )}
                    </div>
                    <Badge 
                      variant="outline" 
                      className={
                        licenca.status === 'aprovada' ? 'text-green-600 border-green-600' :
                        licenca.status === 'vencida' ? 'text-red-600 border-red-600' :
                        licenca.status === 'negada' ? 'text-red-600 border-red-600' :
                        licenca.status === 'renovacao' ? 'text-yellow-600 border-yellow-600' :
                        'text-gray-600 border-gray-600'
                      }
                    >
                      {licenca.status === 'aprovada' ? 'Válida' :
                       licenca.status === 'vencida' ? 'Vencida' :
                       licenca.status === 'negada' ? 'Negada' :
                       licenca.status === 'renovacao' ? 'Renovação' : 'Pendente'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal Nova Obra */}
      <Dialog open={showNovaObraDialog} onOpenChange={setShowNovaObraDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Obra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="nome">Nome da Obra *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                  placeholder="Residencial Jardim das Flores"
                />
              </div>
              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData(prev => ({ ...prev, endereco: e.target.value }))}
                  placeholder="Rua das Flores, 123"
                />
              </div>
              <div>
                <Label htmlFor="data_inicio">Data de Início *</Label>
                <Input
                  id="data_inicio"
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_inicio: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="data_previsao_fim">Previsão de Conclusão</Label>
                <Input
                  id="data_previsao_fim"
                  type="date"
                  value={formData.data_previsao_fim}
                  onChange={(e) => setFormData(prev => ({ ...prev, data_previsao_fim: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="valor_orcamento">Valor do Orçamento</Label>
                <Input
                  id="valor_orcamento"
                  type="number"
                  value={formData.valor_orcamento}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor_orcamento: parseFloat(e.target.value) || 0 }))}
                  placeholder="1000000"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="fundacao">Fundação</SelectItem>
                    <SelectItem value="estrutura">Estrutura</SelectItem>
                    <SelectItem value="alvenaria">Alvenaria</SelectItem>
                    <SelectItem value="cobertura">Cobertura</SelectItem>
                    <SelectItem value="instalacoes">Instalações</SelectItem>
                    <SelectItem value="acabamento">Acabamento</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="responsavel_tecnico">Responsável Técnico</Label>
                <Input
                  id="responsavel_tecnico"
                  value={formData.responsavel_tecnico}
                  onChange={(e) => setFormData(prev => ({ ...prev, responsavel_tecnico: e.target.value }))}
                  placeholder="Eng. João Silva"
                />
              </div>
              <div>
                <Label htmlFor="cnpj_responsavel">CNPJ Responsável</Label>
                <Input
                  id="cnpj_responsavel"
                  value={formData.cnpj_responsavel}
                  onChange={(e) => setFormData(prev => ({ ...prev, cnpj_responsavel: e.target.value }))}
                  placeholder="00.000.000/0000-00"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea
                id="descricao"
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                placeholder="Descrição detalhada da obra..."
              />
            </div>
            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                placeholder="Observações importantes sobre a obra..."
              />
            </div>
            <div className="flex space-x-2">
              <Button onClick={handleCriarObra} className="flex-1">
                Criar Obra
              </Button>
              <Button variant="outline" onClick={() => setShowNovaObraDialog(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
