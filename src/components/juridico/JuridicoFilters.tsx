import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, FilterX, Search } from "lucide-react";

interface JuridicoFiltersProps {
  filters: {
    busca: string;
    status: string;
    tipo: string;
    prioridade: string;
    responsavel: string;
    dataInicio: string;
    dataFim: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export default function JuridicoFilters({ filters, onFiltersChange, onClearFilters }: JuridicoFiltersProps) {
  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filtros
          </div>
          {hasActiveFilters && (
            <Button size="sm" variant="outline" onClick={onClearFilters}>
              <FilterX className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <Label htmlFor="busca">Busca Geral</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="busca"
                placeholder="Buscar por nome, número..."
                value={filters.busca}
                onChange={(e) => handleFilterChange('busca', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluida">Concluída</SelectItem>
                <SelectItem value="ativo">Ativo</SelectItem>
                <SelectItem value="finalizado">Finalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="tipo">Tipo</Label>
            <Select value={filters.tipo} onValueChange={(value) => handleFilterChange('tipo', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="documentos">Análise de Documentos</SelectItem>
                <SelectItem value="viabilidade">Viabilidade Jurídica</SelectItem>
                <SelectItem value="riscos">Análise de Riscos</SelectItem>
                <SelectItem value="due_diligence">Due Diligence</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="prioridade">Prioridade</Label>
            <Select value={filters.prioridade} onValueChange={(value) => handleFilterChange('prioridade', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todas as prioridades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todas</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="responsavel">Responsável</Label>
            <Select value={filters.responsavel} onValueChange={(value) => handleFilterChange('responsavel', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Todos os responsáveis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="Dr. Carlos Santos">Dr. Carlos Santos</SelectItem>
                <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
                <SelectItem value="Dr. Roberto Lima">Dr. Roberto Lima</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="data-inicio">Data Início</Label>
            <Input
              id="data-inicio"
              type="date"
              value={filters.dataInicio}
              onChange={(e) => handleFilterChange('dataInicio', e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}