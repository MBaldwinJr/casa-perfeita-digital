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
      agendamentos_pos_venda: {
        Row: {
          atendimento_id: string | null
          cliente_id: string | null
          created_at: string
          data_agendamento: string
          endereco: string | null
          horario: string
          id: string
          imovel_id: string | null
          observacoes: string | null
          responsavel: string | null
          status: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          atendimento_id?: string | null
          cliente_id?: string | null
          created_at?: string
          data_agendamento: string
          endereco?: string | null
          horario: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          responsavel?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          atendimento_id?: string | null
          cliente_id?: string | null
          created_at?: string
          data_agendamento?: string
          endereco?: string | null
          horario?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          responsavel?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_pos_venda_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos_pos_venda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_pos_venda_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_pos_venda_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
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
      arquivos_obras: {
        Row: {
          arquivo_pai_id: string | null
          categoria: string
          created_at: string
          data_upload: string
          descricao: string | null
          id: string
          metadata: Json | null
          nome_arquivo: string
          nome_original: string
          obra_id: string
          publico: boolean
          status: string
          tags: string[] | null
          tamanho_bytes: number
          tipo_arquivo: string
          updated_at: string
          url_storage: string
          user_id: string
          versao: number
        }
        Insert: {
          arquivo_pai_id?: string | null
          categoria: string
          created_at?: string
          data_upload?: string
          descricao?: string | null
          id?: string
          metadata?: Json | null
          nome_arquivo: string
          nome_original: string
          obra_id: string
          publico?: boolean
          status?: string
          tags?: string[] | null
          tamanho_bytes: number
          tipo_arquivo: string
          updated_at?: string
          url_storage: string
          user_id: string
          versao?: number
        }
        Update: {
          arquivo_pai_id?: string | null
          categoria?: string
          created_at?: string
          data_upload?: string
          descricao?: string | null
          id?: string
          metadata?: Json | null
          nome_arquivo?: string
          nome_original?: string
          obra_id?: string
          publico?: boolean
          status?: string
          tags?: string[] | null
          tamanho_bytes?: number
          tipo_arquivo?: string
          updated_at?: string
          url_storage?: string
          user_id?: string
          versao?: number
        }
        Relationships: [
          {
            foreignKeyName: "arquivos_obras_arquivo_pai_id_fkey"
            columns: ["arquivo_pai_id"]
            isOneToOne: false
            referencedRelation: "arquivos_obras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "arquivos_obras_obra_id_fkey"
            columns: ["obra_id"]
            isOneToOne: false
            referencedRelation: "obras"
            referencedColumns: ["id"]
          },
        ]
      }
      atendimentos_pos_venda: {
        Row: {
          assunto: string
          cliente_email: string | null
          cliente_id: string | null
          cliente_telefone: string | null
          created_at: string
          data_abertura: string
          data_resolucao: string | null
          data_resposta: string | null
          descricao: string | null
          id: string
          imovel_id: string | null
          observacoes: string | null
          prazo_resposta: unknown | null
          prioridade: string
          protocolo: string
          responsavel: string | null
          status: string
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          assunto: string
          cliente_email?: string | null
          cliente_id?: string | null
          cliente_telefone?: string | null
          created_at?: string
          data_abertura?: string
          data_resolucao?: string | null
          data_resposta?: string | null
          descricao?: string | null
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_resposta?: unknown | null
          prioridade?: string
          protocolo: string
          responsavel?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
          assunto?: string
          cliente_email?: string | null
          cliente_id?: string | null
          cliente_telefone?: string | null
          created_at?: string
          data_abertura?: string
          data_resolucao?: string | null
          data_resposta?: string | null
          descricao?: string | null
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_resposta?: unknown | null
          prioridade?: string
          protocolo?: string
          responsavel?: string | null
          status?: string
          tipo?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "atendimentos_pos_venda_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "atendimentos_pos_venda_imovel_id_fkey"
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
      compartilhamentos_arquivos: {
        Row: {
          acessos_realizados: number
          arquivo_id: string
          ativo: boolean
          compartilhado_por: string
          created_at: string
          data_expiracao: string | null
          email_compartilhado: string
          id: string
          tipo_acesso: string
          token_acesso: string
          ultimo_acesso: string | null
        }
        Insert: {
          acessos_realizados?: number
          arquivo_id: string
          ativo?: boolean
          compartilhado_por: string
          created_at?: string
          data_expiracao?: string | null
          email_compartilhado: string
          id?: string
          tipo_acesso?: string
          token_acesso: string
          ultimo_acesso?: string | null
        }
        Update: {
          acessos_realizados?: number
          arquivo_id?: string
          ativo?: boolean
          compartilhado_por?: string
          created_at?: string
          data_expiracao?: string | null
          email_compartilhado?: string
          id?: string
          tipo_acesso?: string
          token_acesso?: string
          ultimo_acesso?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compartilhamentos_arquivos_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "arquivos_obras"
            referencedColumns: ["id"]
          },
        ]
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
      garantias_imoveis: {
        Row: {
          cliente_id: string | null
          cobertura: string | null
          created_at: string
          data_fim: string
          data_inicio: string
          id: string
          imovel_id: string | null
          item: string
          observacoes: string | null
          status: string
          termos_condicoes: string | null
          tipo_garantia: string
          updated_at: string
          user_id: string
          valor_cobertura: number | null
        }
        Insert: {
          cliente_id?: string | null
          cobertura?: string | null
          created_at?: string
          data_fim: string
          data_inicio: string
          id?: string
          imovel_id?: string | null
          item: string
          observacoes?: string | null
          status?: string
          termos_condicoes?: string | null
          tipo_garantia: string
          updated_at?: string
          user_id: string
          valor_cobertura?: number | null
        }
        Update: {
          cliente_id?: string | null
          cobertura?: string | null
          created_at?: string
          data_fim?: string
          data_inicio?: string
          id?: string
          imovel_id?: string | null
          item?: string
          observacoes?: string | null
          status?: string
          termos_condicoes?: string | null
          tipo_garantia?: string
          updated_at?: string
          user_id?: string
          valor_cobertura?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "garantias_imoveis_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "garantias_imoveis_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_arquivos: {
        Row: {
          acao: string
          arquivo_id: string
          created_at: string
          detalhes: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string
        }
        Insert: {
          acao: string
          arquivo_id: string
          created_at?: string
          detalhes?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id: string
        }
        Update: {
          acao?: string
          arquivo_id?: string
          created_at?: string
          detalhes?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_arquivos_arquivo_id_fkey"
            columns: ["arquivo_id"]
            isOneToOne: false
            referencedRelation: "arquivos_obras"
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
      pesquisas_satisfacao: {
        Row: {
          aspectos_avaliados: Json | null
          atendimento_id: string | null
          categoria: string
          cliente_id: string | null
          comentario: string | null
          created_at: string
          data_pesquisa: string
          id: string
          imovel_id: string | null
          nota: number
          sugestoes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          aspectos_avaliados?: Json | null
          atendimento_id?: string | null
          categoria: string
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_pesquisa?: string
          id?: string
          imovel_id?: string | null
          nota: number
          sugestoes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          aspectos_avaliados?: Json | null
          atendimento_id?: string | null
          categoria?: string
          cliente_id?: string | null
          comentario?: string | null
          created_at?: string
          data_pesquisa?: string
          id?: string
          imovel_id?: string | null
          nota?: number
          sugestoes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesquisas_satisfacao_atendimento_id_fkey"
            columns: ["atendimento_id"]
            isOneToOne: false
            referencedRelation: "atendimentos_pos_venda"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pesquisas_satisfacao_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pesquisas_satisfacao_imovel_id_fkey"
            columns: ["imovel_id"]
            isOneToOne: false
            referencedRelation: "imoveis"
            referencedColumns: ["id"]
          },
        ]
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
      generate_protocolo: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      gerar_alertas_automaticos: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      gerar_token_acesso: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      log_acao_arquivo: {
        Args: {
          arquivo_id_param: string
          user_id_param: string
          acao_param: string
          detalhes_param?: string
          ip_param?: unknown
          user_agent_param?: string
        }
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
