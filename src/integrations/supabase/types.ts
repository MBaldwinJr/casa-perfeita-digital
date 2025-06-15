export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      alertas_juridicos: {
        Row: {
          created_at: string
          data_vencimento: string | null
          entidade_id: string | null
          entidade_tipo: string | null
          id: string
          mensagem: string
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_vencimento?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          id?: string
          mensagem: string
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_vencimento?: string | null
          entidade_id?: string | null
          entidade_tipo?: string | null
          id?: string
          mensagem?: string
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      alertas_obras: {
        Row: {
          created_at: string
          data_alerta: string
          descricao: string
          entidade_relacionada_id: string | null
          id: string
          obra_id: string
          prioridade: string
          status: string
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data_alerta?: string
          descricao: string
          entidade_relacionada_id?: string | null
          id?: string
          obra_id: string
          prioridade?: string
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          data_alerta?: string
          descricao?: string
          entidade_relacionada_id?: string | null
          id?: string
          obra_id?: string
          prioridade?: string
          status?: string
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_obras_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      analises_juridicas: {
        Row: {
          arquivos_anexos: string[] | null
          cliente_id: string | null
          created_at: string
          id: string
          imovel_id: string | null
          observacoes: string | null
          prazo_conclusao: string | null
          prioridade: string
          responsavel: string
          resultado: string | null
          status: string
          tags: string[] | null
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          arquivos_anexos?: string[] | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_conclusao?: string | null
          prioridade: string
          responsavel: string
          resultado?: string | null
          status?: string
          tags?: string[] | null
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          arquivos_anexos?: string[] | null
          cliente_id?: string | null
          created_at?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_conclusao?: string | null
          prioridade?: string
          responsavel?: string
          resultado?: string | null
          status?: string
          tags?: string[] | null
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analises_juridicas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analises_juridicas_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          cep: string | null
          cidade: string | null
          cpf_cnpj: string | null
          created_at: string
          email: string | null
          endereco: string | null
          estado: string | null
          id: string
          nome: string
          observacoes: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cep?: string | null
          cidade?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          email?: string | null
          endereco?: string | null
          estado?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      contratos: {
        Row: {
          created_at: string
          data_assinatura: string
          data_vencimento: string | null
          id: string
          numero_contrato: string
          observacoes: string | null
          proposta_id: string
          status: string | null
          updated_at: string
          user_id: string
          valor_total: number
        }
        Insert: {
          created_at?: string
          data_assinatura: string
          data_vencimento?: string | null
          id?: string
          numero_contrato: string
          observacoes?: string | null
          proposta_id: string
          status?: string | null
          updated_at?: string
          user_id: string
          valor_total: number
        }
        Update: {
          created_at?: string
          data_assinatura?: string
          data_vencimento?: string | null
          id?: string
          numero_contrato?: string
          observacoes?: string | null
          proposta_id?: string
          status?: string | null
          updated_at?: string
          user_id?: string
          valor_total?: number
        }
        Relationships: [
          {
            foreignKeyName: "contratos_proposta_id_fkey"
            columns: ["proposta_id"]
            isOneToOne: false
            referencedRelation: "propostas"
            referencedColumns: ["id"]
          },
        ]
      }
      cronograma_obras: {
        Row: {
          created_at: string
          data_fim_prevista: string
          data_fim_real: string | null
          data_inicio_prevista: string
          data_inicio_real: string | null
          descricao: string | null
          etapa: string
          id: string
          obra_id: string
          observacoes: string | null
          ordem_execucao: number
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_fim_prevista: string
          data_fim_real?: string | null
          data_inicio_prevista: string
          data_inicio_real?: string | null
          descricao?: string | null
          etapa: string
          id?: string
          obra_id: string
          observacoes?: string | null
          ordem_execucao: number
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_fim_prevista?: string
          data_fim_real?: string | null
          data_inicio_prevista?: string
          data_inicio_real?: string | null
          descricao?: string | null
          etapa?: string
          id?: string
          obra_id?: string
          observacoes?: string | null
          ordem_execucao?: number
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cronograma_obras_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      documentos_juridicos: {
        Row: {
          analise_id: string | null
          arquivo_url: string | null
          categoria: string
          cliente_id: string | null
          created_at: string
          data_emissao: string | null
          data_vencimento: string | null
          id: string
          imovel_id: string | null
          nome: string
          numero_documento: string | null
          observacoes: string | null
          orgao_emissor: string | null
          processo_id: string | null
          status: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          analise_id?: string | null
          arquivo_url?: string | null
          categoria: string
          cliente_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_vencimento?: string | null
          id?: string
          imovel_id?: string | null
          nome: string
          numero_documento?: string | null
          observacoes?: string | null
          orgao_emissor?: string | null
          processo_id?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          analise_id?: string | null
          arquivo_url?: string | null
          categoria?: string
          cliente_id?: string | null
          created_at?: string
          data_emissao?: string | null
          data_vencimento?: string | null
          id?: string
          imovel_id?: string | null
          nome?: string
          numero_documento?: string | null
          observacoes?: string | null
          orgao_emissor?: string | null
          processo_id?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "documentos_juridicos_analise_id_fkey"
            columns: ["analise_id"]
            isOneToOne: false
            referencedRelation: "analises_juridicas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_juridicos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_juridicos_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documentos_juridicos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos_juridicos"
            referencedColumns: ["id"]
          },
        ]
      }
      financiamentos: {
        Row: {
          banco: string
          cliente_id: string
          created_at: string
          data_aprovacao: string | null
          entrada: number | null
          id: string
          imovel_id: string
          observacoes: string | null
          prazo_meses: number | null
          status: string | null
          taxa_juros: number | null
          updated_at: string
          user_id: string
          valor_financiado: number
          valor_parcela: number | null
        }
        Insert: {
          banco: string
          cliente_id: string
          created_at?: string
          data_aprovacao?: string | null
          entrada?: number | null
          id?: string
          imovel_id: string
          observacoes?: string | null
          prazo_meses?: number | null
          status?: string | null
          taxa_juros?: number | null
          updated_at?: string
          user_id: string
          valor_financiado: number
          valor_parcela?: number | null
        }
        Update: {
          banco?: string
          cliente_id?: string
          created_at?: string
          data_aprovacao?: string | null
          entrada?: number | null
          id?: string
          imovel_id?: string
          observacoes?: string | null
          prazo_meses?: number | null
          status?: string | null
          taxa_juros?: number | null
          updated_at?: string
          user_id?: string
          valor_financiado?: number
          valor_parcela?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "financiamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financiamentos_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      fotos_obras: {
        Row: {
          arquivo_url: string
          created_at: string
          cronograma_id: string | null
          data_foto: string
          descricao: string | null
          etapa: string | null
          id: string
          obra_id: string
          titulo: string | null
          updated_at: string
        }
        Insert: {
          arquivo_url: string
          created_at?: string
          cronograma_id?: string | null
          data_foto?: string
          descricao?: string | null
          etapa?: string | null
          id?: string
          obra_id: string
          titulo?: string | null
          updated_at?: string
        }
        Update: {
          arquivo_url?: string
          created_at?: string
          cronograma_id?: string | null
          data_foto?: string
          descricao?: string | null
          etapa?: string | null
          id?: string
          obra_id?: string
          titulo?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fotos_obras_cronograma_id_fkey"
            columns: ["cronograma_id"]
            isOneToOne: false
            referencedRelation: "cronograma_obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fotos_obras_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_atividades: {
        Row: {
          acao: string
          created_at: string
          descricao: string
          entidade_id: string
          entidade_tipo: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          acao: string
          created_at?: string
          descricao: string
          entidade_id: string
          entidade_tipo: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          acao?: string
          created_at?: string
          descricao?: string
          entidade_id?: string
          entidade_tipo?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      imoveis: {
        Row: {
          area: number | null
          banheiros: number | null
          cep: string | null
          cidade: string
          created_at: string
          descricao: string | null
          endereco: string
          estado: string
          id: string
          quartos: number | null
          status: string | null
          tipo: string
          titulo: string
          updated_at: string
          user_id: string
          vagas: number | null
          valor: number
        }
        Insert: {
          area?: number | null
          banheiros?: number | null
          cep?: string | null
          cidade: string
          created_at?: string
          descricao?: string | null
          endereco: string
          estado: string
          id?: string
          quartos?: number | null
          status?: string | null
          tipo: string
          titulo: string
          updated_at?: string
          user_id: string
          vagas?: number | null
          valor: number
        }
        Update: {
          area?: number | null
          banheiros?: number | null
          cep?: string | null
          cidade?: string
          created_at?: string
          descricao?: string | null
          endereco?: string
          estado?: string
          id?: string
          quartos?: number | null
          status?: string | null
          tipo?: string
          titulo?: string
          updated_at?: string
          user_id?: string
          vagas?: number | null
          valor?: number
        }
        Relationships: []
      }
      licencas_obras: {
        Row: {
          arquivo_url: string | null
          created_at: string
          data_emissao: string | null
          data_vencimento: string | null
          id: string
          nome: string
          numero_licenca: string | null
          obra_id: string
          observacoes: string | null
          orgao_emissor: string | null
          status: string
          tipo: string
          updated_at: string
        }
        Insert: {
          arquivo_url?: string | null
          created_at?: string
          data_emissao?: string | null
          data_vencimento?: string | null
          id?: string
          nome: string
          numero_licenca?: string | null
          obra_id: string
          observacoes?: string | null
          orgao_emissor?: string | null
          status?: string
          tipo: string
          updated_at?: string
        }
        Update: {
          arquivo_url?: string | null
          created_at?: string
          data_emissao?: string | null
          data_vencimento?: string | null
          id?: string
          nome?: string
          numero_licenca?: string | null
          obra_id?: string
          observacoes?: string | null
          orgao_emissor?: string | null
          status?: string
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "licencas_obras_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obra_etapas_selecionadas: {
        Row: {
          ativo: boolean
          created_at: string
          duracao_personalizada_dias: number | null
          id: string
          obra_id: string
          ordem_personalizada: number | null
          template_etapa_id: string
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          duracao_personalizada_dias?: number | null
          id?: string
          obra_id: string
          ordem_personalizada?: number | null
          template_etapa_id: string
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          duracao_personalizada_dias?: number | null
          id?: string
          obra_id?: string
          ordem_personalizada?: number | null
          template_etapa_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "obra_etapas_selecionadas_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "obra_etapas_selecionadas_template_etapa_id_fkey"
            columns: ["template_etapa_id"]
            isOneToOne: false
            referencedRelation: "template_etapas_obras"
            referencedColumns: ["id"]
          },
        ]
      }
      obras: {
        Row: {
          cnpj_responsavel: string | null
          created_at: string
          data_conclusao: string | null
          data_inicio: string
          data_previsao_fim: string | null
          descricao: string | null
          endereco: string
          id: string
          nome: string
          observacoes: string | null
          progresso_percentual: number | null
          responsavel_tecnico: string | null
          status: string
          updated_at: string
          user_id: string
          valor_gasto: number | null
          valor_orcamento: number | null
        }
        Insert: {
          cnpj_responsavel?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio: string
          data_previsao_fim?: string | null
          descricao?: string | null
          endereco: string
          id?: string
          nome: string
          observacoes?: string | null
          progresso_percentual?: number | null
          responsavel_tecnico?: string | null
          status?: string
          updated_at?: string
          user_id: string
          valor_gasto?: number | null
          valor_orcamento?: number | null
        }
        Update: {
          cnpj_responsavel?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          data_previsao_fim?: string | null
          descricao?: string | null
          endereco?: string
          id?: string
          nome?: string
          observacoes?: string | null
          progresso_percentual?: number | null
          responsavel_tecnico?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          valor_gasto?: number | null
          valor_orcamento?: number | null
        }
        Relationships: []
      }
      processos_juridicos: {
        Row: {
          advogado_responsavel: string
          arquivos_anexos: string[] | null
          cliente_id: string | null
          created_at: string
          data_conclusao: string | null
          data_inicio: string
          descricao: string | null
          id: string
          imovel_id: string | null
          instancia: string
          numero_processo: string | null
          observacoes: string | null
          status: string
          tags: string[] | null
          tipo: string
          updated_at: string
          user_id: string
          valor_causa: number | null
          vara: string | null
        }
        Insert: {
          advogado_responsavel: string
          arquivos_anexos?: string[] | null
          cliente_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio: string
          descricao?: string | null
          id?: string
          imovel_id?: string | null
          instancia: string
          numero_processo?: string | null
          observacoes?: string | null
          status?: string
          tags?: string[] | null
          tipo: string
          updated_at?: string
          user_id: string
          valor_causa?: number | null
          vara?: string | null
        }
        Update: {
          advogado_responsavel?: string
          arquivos_anexos?: string[] | null
          cliente_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          descricao?: string | null
          id?: string
          imovel_id?: string | null
          instancia?: string
          numero_processo?: string | null
          observacoes?: string | null
          status?: string
          tags?: string[] | null
          tipo?: string
          updated_at?: string
          user_id?: string
          valor_causa?: number | null
          vara?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processos_juridicos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processos_juridicos_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          nome: string
          role: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          nome: string
          role?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          nome?: string
          role?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      propostas: {
        Row: {
          cliente_id: string
          created_at: string
          data_assinatura: string | null
          data_vencimento: string | null
          entrada: number | null
          financiamento: number | null
          forma_pagamento: string
          id: string
          imovel_id: string
          observacoes: string | null
          status: string | null
          updated_at: string
          user_id: string
          valor_proposta: number
        }
        Insert: {
          cliente_id: string
          created_at?: string
          data_assinatura?: string | null
          data_vencimento?: string | null
          entrada?: number | null
          financiamento?: number | null
          forma_pagamento: string
          id?: string
          imovel_id: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
          valor_proposta: number
        }
        Update: {
          cliente_id?: string
          created_at?: string
          data_assinatura?: string | null
          data_vencimento?: string | null
          entrada?: number | null
          financiamento?: number | null
          forma_pagamento?: string
          id?: string
          imovel_id?: string
          observacoes?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
          valor_proposta?: number
        }
        Relationships: [
          {
            foreignKeyName: "propostas_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "propostas_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      responsaveis_juridicos: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          especializacao: string | null
          id: string
          nome: string
          oab: string | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          especializacao?: string | null
          id?: string
          nome: string
          oab?: string | null
          telefone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          especializacao?: string | null
          id?: string
          nome?: string
          oab?: string | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      template_etapas_obras: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          descricao: string | null
          duracao_estimada_dias: number
          id: string
          nome: string
          ordem_execucao: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          descricao?: string | null
          duracao_estimada_dias?: number
          id?: string
          nome: string
          ordem_execucao: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          descricao?: string | null
          duracao_estimada_dias?: number
          id?: string
          nome?: string
          ordem_execucao?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      gerar_alertas_automaticos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
