export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
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
      analises_juridicas: {
        Row: {
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
          tipo: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_conclusao?: string | null
          prioridade?: string
          responsavel: string
          resultado?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
        }
        Update: {
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
          categoria: string
          created_at: string
          data_upload: string
          descricao: string | null
          id: string
          nome_arquivo: string
          nome_original: string
          obra_id: string
          publico: boolean
          status: string
          tags: string[] | null
          tamanho_bytes: number | null
          tipo_arquivo: string | null
          updated_at: string
          url_storage: string
          user_id: string
        }
        Insert: {
          categoria: string
          created_at?: string
          data_upload?: string
          descricao?: string | null
          id?: string
          nome_arquivo: string
          nome_original: string
          obra_id: string
          publico?: boolean
          status?: string
          tags?: string[] | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          updated_at?: string
          url_storage: string
          user_id: string
        }
        Update: {
          categoria?: string
          created_at?: string
          data_upload?: string
          descricao?: string | null
          id?: string
          nome_arquivo?: string
          nome_original?: string
          obra_id?: string
          publico?: boolean
          status?: string
          tags?: string[] | null
          tamanho_bytes?: number | null
          tipo_arquivo?: string | null
          updated_at?: string
          url_storage?: string
          user_id?: string
        }
        Relationships: [
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
          prazo_resposta: string | null
          prioridade: string
          protocolo: string | null
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
          prazo_resposta?: string | null
          prioridade?: string
          protocolo?: string | null
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
          prazo_resposta?: string | null
          prioridade?: string
          protocolo?: string | null
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
          ordem_execucao?: number
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
          cliente_id: string | null
          created_at: string
          data_aprovacao: string | null
          entrada: number | null
          id: string
          imovel_id: string | null
          observacoes: string | null
          prazo_meses: number | null
          status: string
          taxa_juros: number | null
          updated_at: string
          user_id: string
          valor_financiado: number
          valor_parcela: number | null
        }
        Insert: {
          banco: string
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          entrada?: number | null
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_meses?: number | null
          status?: string
          taxa_juros?: number | null
          updated_at?: string
          user_id: string
          valor_financiado?: number
          valor_parcela?: number | null
        }
        Update: {
          banco?: string
          cliente_id?: string | null
          created_at?: string
          data_aprovacao?: string | null
          entrada?: number | null
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          prazo_meses?: number | null
          status?: string
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
          status: string
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
          status?: string
          tipo: string
          titulo: string
          updated_at?: string
          user_id: string
          vagas?: number | null
          valor?: number
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
          status?: string
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
          progresso_percentual: number
          responsavel_tecnico: string | null
          status: string
          updated_at: string
          user_id: string
          valor_gasto: number
          valor_orcamento: number | null
        }
        Insert: {
          cnpj_responsavel?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          data_previsao_fim?: string | null
          descricao?: string | null
          endereco: string
          id?: string
          nome: string
          observacoes?: string | null
          progresso_percentual?: number
          responsavel_tecnico?: string | null
          status?: string
          updated_at?: string
          user_id: string
          valor_gasto?: number
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
          progresso_percentual?: number
          responsavel_tecnico?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          valor_gasto?: number
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
          tipo: string
          updated_at: string
          user_id: string
          valor_causa: number | null
          vara: string | null
        }
        Insert: {
          advogado_responsavel: string
          cliente_id?: string | null
          created_at?: string
          data_conclusao?: string | null
          data_inicio?: string
          descricao?: string | null
          id?: string
          imovel_id?: string | null
          instancia: string
          numero_processo?: string | null
          observacoes?: string | null
          status?: string
          tipo: string
          updated_at?: string
          user_id: string
          valor_causa?: number | null
          vara?: string | null
        }
        Update: {
          advogado_responsavel?: string
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
      propostas: {
        Row: {
          cliente_id: string | null
          created_at: string
          data_assinatura: string | null
          data_vencimento: string | null
          entrada: number | null
          financiamento: number | null
          forma_pagamento: string
          id: string
          imovel_id: string | null
          observacoes: string | null
          status: string
          updated_at: string
          user_id: string
          valor_proposta: number
        }
        Insert: {
          cliente_id?: string | null
          created_at?: string
          data_assinatura?: string | null
          data_vencimento?: string | null
          entrada?: number | null
          financiamento?: number | null
          forma_pagamento?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          status?: string
          updated_at?: string
          user_id: string
          valor_proposta?: number
        }
        Update: {
          cliente_id?: string | null
          created_at?: string
          data_assinatura?: string | null
          data_vencimento?: string | null
          entrada?: number | null
          financiamento?: number | null
          forma_pagamento?: string
          id?: string
          imovel_id?: string | null
          observacoes?: string | null
          status?: string
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
          categoria: string | null
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
          categoria?: string | null
          created_at?: string
          descricao?: string | null
          duracao_estimada_dias?: number
          id?: string
          nome: string
          ordem_execucao?: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string | null
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
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
