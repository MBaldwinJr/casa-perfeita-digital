import React from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, FilterX, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface JuridicoFiltersState {
  search: string;
  status: string;
  tipo: string;
  prioridade: string;
  responsavel: string;
  dataInicio: string;
  dataFim: string;
  tags: string[];
}

interface JuridicoFiltersProps {
  filters: JuridicoFiltersState;
  onFiltersChange: (filters: Partial<JuridicoFiltersState>) => void;
  onClearFilters: () => void;
  showAdvanced?: boolean;
  onToggleAdvanced?: () => void;
}

export default function JuridicoFilters({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  showAdvanced = false,
  onToggleAdvanced
}: JuridicoFiltersProps) {
  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== ''
  );

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      {/* Filtros básicos */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar..."
            value={filters.search}
            onChange={(e) => onFiltersChange({ search: e.target.value })}
            className="pl-10"
          />
        </div>
        
        <Select value={filters.status} onValueChange={(value) => onFiltersChange({ status: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="ativo">Ativo</SelectItem>
            <SelectItem value="pendente">Pendente</SelectItem>
            <SelectItem value="em_andamento">Em Andamento</SelectItem>
            <SelectItem value="concluida">Concluída</SelectItem>
            <SelectItem value="finalizado">Finalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.tipo} onValueChange={(value) => onFiltersChange({ tipo: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos</SelectItem>
            <SelectItem value="documentos">Documentos</SelectItem>
            <SelectItem value="viabilidade">Viabilidade</SelectItem>
            <SelectItem value="riscos">Riscos</SelectItem>
            <SelectItem value="due_diligence">Due Diligence</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={showAdvanced ? "default" : "outline"}
            size="sm"
            onClick={onToggleAdvanced}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={onClearFilters}>
              <FilterX className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </div>

      {/* Filtros avançados */}
      {showAdvanced && (
        <div className="grid gap-4 md:grid-cols-3 pt-4 border-t">
          <Select value={filters.prioridade} onValueChange={(value) => onFiltersChange({ prioridade: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Prioridade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todas</SelectItem>
              <SelectItem value="baixa">Baixa</SelectItem>
              <SelectItem value="media">Média</SelectItem>
              <SelectItem value="alta">Alta</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filters.responsavel} onValueChange={(value) => onFiltersChange({ responsavel: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Todos</SelectItem>
              <SelectItem value="Dr. Carlos Santos">Dr. Carlos Santos</SelectItem>
              <SelectItem value="Dra. Ana Costa">Dra. Ana Costa</SelectItem>
              <SelectItem value="Dr. Roberto Lima">Dr. Roberto Lima</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Input
              type="date"
              placeholder="Data início"
              value={filters.dataInicio}
              onChange={(e) => onFiltersChange({ dataInicio: e.target.value })}
            />
            <Input
              type="date"
              placeholder="Data fim"
              value={filters.dataFim}
              onChange={(e) => onFiltersChange({ dataFim: e.target.value })}
            />
          </div>
        </div>
      )}

      {/* Tags ativas */}
      {filters.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-sm text-muted-foreground">Tags:</span>
          {filters.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer">
              {tag}
              <button
                onClick={() => {
                  const newTags = filters.tags.filter((_, i) => i !== index);
                  onFiltersChange({ tags: newTags });
                }}
                className="ml-1 hover:text-destructive"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}