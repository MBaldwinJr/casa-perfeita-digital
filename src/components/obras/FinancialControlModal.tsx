import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DollarSign, Plus, Trash2, Edit, Receipt, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

type Obra = Tables<'obras'>;
type CronogramaObra = Tables<'cronograma_obras'>;

interface Gasto {
  id: string;
  etapa_id: string;
  categoria: string;
  fornecedor: string;
  descricao: string;
  valor: number;
  data_gasto: string;
  documento_fiscal?: string;
  observacoes?: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  cnpj?: string;
  telefone?: string;
  email?: string;
  especialidade: string[];
  total_gastos: number;
}

interface FinancialControlModalProps {
  obra: Obra | null;
  cronogramas: CronogramaObra[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FinancialControlModal({ obra, cronogramas, open, onOpenChange }: FinancialControlModalProps) {
  const { toast } = useToast();
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [showNovoGasto, setShowNovoGasto] = useState(false);
  const [showNovoFornecedor, setShowNovoFornecedor] = useState(false);
  const [editingGasto, setEditingGasto] = useState<Gasto | null>(null);
  
  const [formGasto, setFormGasto] = useState({
    etapa_id: '',
    categoria: '',
    fornecedor: '',
    descricao: '',
    valor: 0,
    data_gasto: new Date().toISOString().split('T')[0],
    documento_fiscal: '',
    observacoes: ''
  });

  const [formFornecedor, setFormFornecedor] = useState({
    nome: '',
    cnpj: '',
    telefone: '',
    email: '',
    especialidade: [] as string[]
  });

  const categorias = [
    'Material',
    'Mão de obra',
    'Equipamentos',
    'Transporte',
    'Licenças',
    'Outros'
  ];

  const especialidades = [
    'Fundação',
    'Estrutura',
    'Alvenaria',
    'Cobertura',
    'Elétrica',
    'Hidráulica',
    'Pintura',
    'Acabamento',
    'Paisagismo'
  ];

  const handleSalvarGasto = () => {
    if (!formGasto.categoria || !formGasto.descricao || !formGasto.valor) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const novoGasto: Gasto = {
      id: Math.random().toString(36).substr(2, 9),
      etapa_id: formGasto.etapa_id,
      categoria: formGasto.categoria,
      fornecedor: formGasto.fornecedor,
      descricao: formGasto.descricao,
      valor: formGasto.valor,
      data_gasto: formGasto.data_gasto,
      documento_fiscal: formGasto.documento_fiscal,
      observacoes: formGasto.observacoes
    };

    if (editingGasto) {
      setGastos(gastos.map(g => g.id === editingGasto.id ? { ...novoGasto, id: editingGasto.id } : g));
      setEditingGasto(null);
      toast({
        title: "Sucesso",
        description: "Gasto atualizado com sucesso.",
      });
    } else {
      setGastos([...gastos, novoGasto]);
      toast({
        title: "Sucesso",
        description: "Gasto cadastrado com sucesso.",
      });
    }

    setFormGasto({
      etapa_id: '',
      categoria: '',
      fornecedor: '',
      descricao: '',
      valor: 0,
      data_gasto: new Date().toISOString().split('T')[0],
      documento_fiscal: '',
      observacoes: ''
    });
    setShowNovoGasto(false);
  };

  const handleSalvarFornecedor = () => {
    if (!formFornecedor.nome) {
      toast({
        title: "Erro",
        description: "Nome do fornecedor é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    const novoFornecedor: Fornecedor = {
      id: Math.random().toString(36).substr(2, 9),
      nome: formFornecedor.nome,
      cnpj: formFornecedor.cnpj,
      telefone: formFornecedor.telefone,
      email: formFornecedor.email,
      especialidade: formFornecedor.especialidade,
      total_gastos: 0
    };

    setFornecedores([...fornecedores, novoFornecedor]);
    setFormFornecedor({
      nome: '',
      cnpj: '',
      telefone: '',
      email: '',
      especialidade: []
    });
    setShowNovoFornecedor(false);
    
    toast({
      title: "Sucesso",
      description: "Fornecedor cadastrado com sucesso.",
    });
  };

  const handleEditarGasto = (gasto: Gasto) => {
    setFormGasto({
      etapa_id: gasto.etapa_id,
      categoria: gasto.categoria,
      fornecedor: gasto.fornecedor,
      descricao: gasto.descricao,
      valor: gasto.valor,
      data_gasto: gasto.data_gasto,
      documento_fiscal: gasto.documento_fiscal || '',
      observacoes: gasto.observacoes || ''
    });
    setEditingGasto(gasto);
    setShowNovoGasto(true);
  };

  const handleRemoverGasto = (gastoId: string) => {
    setGastos(gastos.filter(g => g.id !== gastoId));
    toast({
      title: "Sucesso",
      description: "Gasto removido com sucesso.",
    });
  };

  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
  const orcamento = Number(obra?.valor_orcamento || 0);
  const percentualGasto = orcamento > 0 ? (totalGastos / orcamento) * 100 : 0;

  // Gastos por etapa
  const gastosPorEtapa = cronogramas.map(etapa => {
    const gastosEtapa = gastos.filter(g => g.etapa_id === etapa.id);
    const totalEtapa = gastosEtapa.reduce((sum, g) => sum + g.valor, 0);
    return {
      etapa: etapa.etapa,
      total: totalEtapa,
      gastos: gastosEtapa
    };
  });

  // Gastos por categoria
  const gastosPorCategoria = categorias.map(categoria => {
    const gastosCategoria = gastos.filter(g => g.categoria === categoria);
    const totalCategoria = gastosCategoria.reduce((sum, g) => sum + g.valor, 0);
    return {
      categoria,
      total: totalCategoria,
      count: gastosCategoria.length
    };
  }).filter(item => item.total > 0);

  if (!obra) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Controle Financeiro - {obra.nome}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalGastos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Saldo Restante</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${orcamento - totalGastos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orcamento - totalGastos)}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">% Gasto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${percentualGasto <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {percentualGasto.toFixed(1)}%
                </div>
                <Progress value={Math.min(percentualGasto, 100)} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="gastos" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="gastos">Gastos</TabsTrigger>
              <TabsTrigger value="etapas">Por Etapa</TabsTrigger>
              <TabsTrigger value="categorias">Por Categoria</TabsTrigger>
              <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            </TabsList>

            <TabsContent value="gastos" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Gastos Registrados</h3>
                <Button onClick={() => setShowNovoGasto(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Gasto
                </Button>
              </div>

              <div className="space-y-3">
                {gastos.map((gasto) => (
                  <Card key={gasto.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{gasto.categoria}</Badge>
                            {gasto.fornecedor && <Badge variant="secondary">{gasto.fornecedor}</Badge>}
                          </div>
                          <h4 className="font-medium">{gasto.descricao}</h4>
                          <p className="text-sm text-muted-foreground">
                            {new Date(gasto.data_gasto).toLocaleDateString('pt-BR')}
                            {gasto.etapa_id && ` • ${cronogramas.find(c => c.id === gasto.etapa_id)?.etapa}`}
                          </p>
                          {gasto.observacoes && (
                            <p className="text-sm text-muted-foreground mt-1">{gasto.observacoes}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-600">
                            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(gasto.valor)}
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditarGasto(gasto)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleRemoverGasto(gasto.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {gastos.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4" />
                    <p>Nenhum gasto registrado</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="etapas" className="space-y-4">
              <h3 className="text-lg font-semibold">Gastos por Etapa</h3>
              <div className="space-y-3">
                {gastosPorEtapa.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.etapa}</h4>
                          <p className="text-sm text-muted-foreground">{item.gastos.length} gastos</p>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="categorias" className="space-y-4">
              <h3 className="text-lg font-semibold">Gastos por Categoria</h3>
              <div className="space-y-3">
                {gastosPorCategoria.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium">{item.categoria}</h4>
                          <p className="text-sm text-muted-foreground">{item.count} gastos</p>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fornecedores" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Fornecedores</h3>
                <Button onClick={() => setShowNovoFornecedor(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Fornecedor
                </Button>
              </div>

              <div className="space-y-3">
                {fornecedores.map((fornecedor) => (
                  <Card key={fornecedor.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{fornecedor.nome}</h4>
                          {fornecedor.cnpj && <p className="text-sm text-muted-foreground">CNPJ: {fornecedor.cnpj}</p>}
                          {fornecedor.telefone && <p className="text-sm text-muted-foreground">Tel: {fornecedor.telefone}</p>}
                          {fornecedor.email && <p className="text-sm text-muted-foreground">Email: {fornecedor.email}</p>}
                          <div className="flex gap-1 mt-2">
                            {fornecedor.especialidade.map((esp, index) => (
                              <Badge key={index} variant="outline" className="text-xs">{esp}</Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-green-600">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(fornecedor.total_gastos)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {fornecedores.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Receipt className="h-12 w-12 mx-auto mb-4" />
                    <p>Nenhum fornecedor cadastrado</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Modal Novo Gasto */}
        {showNovoGasto && (
          <Dialog open={showNovoGasto} onOpenChange={setShowNovoGasto}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingGasto ? 'Editar' : 'Novo'} Gasto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="categoria">Categoria *</Label>
                    <Select value={formGasto.categoria} onValueChange={(value) => setFormGasto(prev => ({ ...prev, categoria: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map(categoria => (
                          <SelectItem key={categoria} value={categoria}>{categoria}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="etapa">Etapa</Label>
                    <Select value={formGasto.etapa_id} onValueChange={(value) => setFormGasto(prev => ({ ...prev, etapa_id: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a etapa" />
                      </SelectTrigger>
                      <SelectContent>
                        {cronogramas.map(etapa => (
                          <SelectItem key={etapa.id} value={etapa.id}>{etapa.etapa}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="descricao">Descrição *</Label>
                  <Input
                    id="descricao"
                    value={formGasto.descricao}
                    onChange={(e) => setFormGasto(prev => ({ ...prev, descricao: e.target.value }))}
                    placeholder="Descrição do gasto"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="valor">Valor *</Label>
                    <Input
                      id="valor"
                      type="number"
                      step="0.01"
                      value={formGasto.valor}
                      onChange={(e) => setFormGasto(prev => ({ ...prev, valor: parseFloat(e.target.value) || 0 }))}
                      placeholder="0,00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="data_gasto">Data do Gasto</Label>
                    <Input
                      id="data_gasto"
                      type="date"
                      value={formGasto.data_gasto}
                      onChange={(e) => setFormGasto(prev => ({ ...prev, data_gasto: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="fornecedor">Fornecedor</Label>
                    <Input
                      id="fornecedor"
                      value={formGasto.fornecedor}
                      onChange={(e) => setFormGasto(prev => ({ ...prev, fornecedor: e.target.value }))}
                      placeholder="Nome do fornecedor"
                    />
                  </div>
                  <div>
                    <Label htmlFor="documento_fiscal">Documento Fiscal</Label>
                    <Input
                      id="documento_fiscal"
                      value={formGasto.documento_fiscal}
                      onChange={(e) => setFormGasto(prev => ({ ...prev, documento_fiscal: e.target.value }))}
                      placeholder="Número da nota fiscal"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={formGasto.observacoes}
                    onChange={(e) => setFormGasto(prev => ({ ...prev, observacoes: e.target.value }))}
                    placeholder="Observações adicionais"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSalvarGasto} className="flex-1">
                    {editingGasto ? 'Atualizar' : 'Salvar'} Gasto
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setShowNovoGasto(false);
                    setEditingGasto(null);
                  }}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Modal Novo Fornecedor */}
        {showNovoFornecedor && (
          <Dialog open={showNovoFornecedor} onOpenChange={setShowNovoFornecedor}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Novo Fornecedor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="nome_fornecedor">Nome *</Label>
                  <Input
                    id="nome_fornecedor"
                    value={formFornecedor.nome}
                    onChange={(e) => setFormFornecedor(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Nome do fornecedor"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="cnpj_fornecedor">CNPJ</Label>
                    <Input
                      id="cnpj_fornecedor"
                      value={formFornecedor.cnpj}
                      onChange={(e) => setFormFornecedor(prev => ({ ...prev, cnpj: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="telefone_fornecedor">Telefone</Label>
                    <Input
                      id="telefone_fornecedor"
                      value={formFornecedor.telefone}
                      onChange={(e) => setFormFornecedor(prev => ({ ...prev, telefone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email_fornecedor">Email</Label>
                  <Input
                    id="email_fornecedor"
                    type="email"
                    value={formFornecedor.email}
                    onChange={(e) => setFormFornecedor(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="email@fornecedor.com"
                  />
                </div>

                <div>
                  <Label>Especialidades</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {especialidades.map(esp => (
                      <label key={esp} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formFornecedor.especialidade.includes(esp)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormFornecedor(prev => ({ 
                                ...prev, 
                                especialidade: [...prev.especialidade, esp] 
                              }));
                            } else {
                              setFormFornecedor(prev => ({ 
                                ...prev, 
                                especialidade: prev.especialidade.filter(item => item !== esp) 
                              }));
                            }
                          }}
                        />
                        <span className="text-sm">{esp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button onClick={handleSalvarFornecedor} className="flex-1">
                    Salvar Fornecedor
                  </Button>
                  <Button variant="outline" onClick={() => setShowNovoFornecedor(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </DialogContent>
    </Dialog>
  );
}