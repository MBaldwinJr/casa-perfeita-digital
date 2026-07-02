/**
 * Pure business logic for the Pós-Venda (post-sales) flow.
 * Extracted so it can be unit-tested independently of Supabase / React.
 */

export interface AtendimentoLike {
  readonly status: string;
  readonly prioridade: string;
}

export interface PesquisaLike {
  readonly nota: number;
}

export interface GarantiaLike {
  readonly data_fim: string; // ISO date
}

export interface AgendamentoLike {
  readonly data_agendamento: string; // "YYYY-MM-DD"
}

export interface DashboardStatistics {
  readonly atendimentosAtivos: number;
  readonly atendimentosUrgentes: number;
  readonly satisfacaoMedia: string;
  readonly garantiasVencendo: number;
  readonly agendamentosHoje: number;
}

export interface RelatorioStatistics {
  readonly totalAtendimentos: number;
  readonly atendimentosResolvidos: number;
  readonly taxaResolucao: number;
  readonly mediaSatisfacao: number;
  readonly visitasTecnicas: number;
  readonly percentualSatisfacao: number;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const RATING_SCALE_MAX = 5;

export const calcularSatisfacaoMedia = (
  pesquisas: readonly PesquisaLike[],
): number => {
  if (pesquisas.length === 0) return 0;
  const soma = pesquisas.reduce((acc, p) => acc + p.nota, 0);
  return Number((soma / pesquisas.length).toFixed(1));
};

export const calcularPercentualSatisfacao = (
  pesquisas: readonly PesquisaLike[],
): number => {
  if (pesquisas.length === 0) return 0;
  const media = pesquisas.reduce((acc, p) => acc + p.nota, 0) / pesquisas.length;
  return Math.round((media / RATING_SCALE_MAX) * 100);
};

export const calcularTaxaResolucao = (
  atendimentos: readonly AtendimentoLike[],
): number => {
  if (atendimentos.length === 0) return 0;
  const resolvidos = atendimentos.filter((a) => a.status === "resolvido").length;
  return Math.round((resolvidos / atendimentos.length) * 100);
};

export const contarGarantiasVencendo = (
  garantias: readonly GarantiaLike[],
  referencia: Date = new Date(),
  janelaEmDias = 30,
): number =>
  garantias.filter((g) => {
    const fim = new Date(g.data_fim);
    if (Number.isNaN(fim.getTime())) return false;
    const diff = (fim.getTime() - referencia.getTime()) / MS_PER_DAY;
    return diff > 0 && diff <= janelaEmDias;
  }).length;

export const contarAgendamentosHoje = (
  agendamentos: readonly AgendamentoLike[],
  referencia: Date = new Date(),
): number => {
  const hoje = referencia.toISOString().split("T")[0];
  return agendamentos.filter((a) => a.data_agendamento === hoje).length;
};

export const buildDashboardStatistics = (input: {
  readonly atendimentos: readonly AtendimentoLike[];
  readonly pesquisas: readonly PesquisaLike[];
  readonly garantias: readonly GarantiaLike[];
  readonly agendamentos: readonly AgendamentoLike[];
  readonly referencia?: Date;
}): DashboardStatistics => {
  const { atendimentos, pesquisas, garantias, agendamentos, referencia } = input;
  return {
    atendimentosAtivos: atendimentos.filter((a) => a.status !== "resolvido").length,
    atendimentosUrgentes: atendimentos.filter(
      (a) => a.prioridade === "urgente" || a.prioridade === "alta",
    ).length,
    satisfacaoMedia: calcularSatisfacaoMedia(pesquisas).toFixed(1),
    garantiasVencendo: contarGarantiasVencendo(garantias, referencia),
    agendamentosHoje: contarAgendamentosHoje(agendamentos, referencia),
  };
};

export const buildRelatorioStatistics = (input: {
  readonly atendimentos: readonly AtendimentoLike[];
  readonly pesquisas: readonly PesquisaLike[];
  readonly agendamentos: readonly AgendamentoLike[];
}): RelatorioStatistics => {
  const { atendimentos, pesquisas, agendamentos } = input;
  const resolvidos = atendimentos.filter((a) => a.status === "resolvido").length;
  return {
    totalAtendimentos: atendimentos.length,
    atendimentosResolvidos: resolvidos,
    taxaResolucao: calcularTaxaResolucao(atendimentos),
    mediaSatisfacao: calcularSatisfacaoMedia(pesquisas),
    visitasTecnicas: agendamentos.length,
    percentualSatisfacao: calcularPercentualSatisfacao(pesquisas),
  };
};

// -------------------- Validações de formulário --------------------

export interface NovoAtendimentoInput {
  readonly assunto?: string;
  readonly tipo?: string;
  readonly prioridade?: string;
}

export interface NovoAgendamentoInput {
  readonly cliente_id?: string | null;
  readonly data_agendamento?: string;
  readonly tipo_visita?: string;
}

export interface NovaPesquisaInput {
  readonly cliente_id?: string | null;
  readonly nota?: number;
}

export interface ValidationResult {
  readonly valid: boolean;
  readonly errors: readonly string[];
}

const ok = (): ValidationResult => ({ valid: true, errors: [] });
const fail = (errors: readonly string[]): ValidationResult => ({
  valid: false,
  errors,
});

export const validarNovoAtendimento = (
  input: NovoAtendimentoInput,
): ValidationResult => {
  const errors: string[] = [];
  if (!input.assunto || input.assunto.trim().length === 0) {
    errors.push("Assunto é obrigatório.");
  }
  return errors.length ? fail(errors) : ok();
};

export const validarNovoAgendamento = (
  input: NovoAgendamentoInput,
  referencia: Date = new Date(),
): ValidationResult => {
  const errors: string[] = [];
  if (!input.cliente_id) errors.push("Cliente é obrigatório.");
  if (!input.data_agendamento) {
    errors.push("Data de agendamento é obrigatória.");
  } else {
    const data = new Date(input.data_agendamento);
    if (Number.isNaN(data.getTime())) {
      errors.push("Data de agendamento inválida.");
    } else {
      const inicioHoje = new Date(referencia);
      inicioHoje.setHours(0, 0, 0, 0);
      if (data.getTime() < inicioHoje.getTime()) {
        errors.push("Data de agendamento não pode ser no passado.");
      }
    }
  }
  return errors.length ? fail(errors) : ok();
};

export const validarNovaPesquisa = (
  input: NovaPesquisaInput,
): ValidationResult => {
  const errors: string[] = [];
  if (!input.cliente_id) errors.push("Cliente é obrigatório.");
  if (
    input.nota === undefined ||
    input.nota === null ||
    Number.isNaN(input.nota)
  ) {
    errors.push("Nota é obrigatória.");
  } else if (input.nota < 1 || input.nota > 5) {
    errors.push("Nota deve estar entre 1 e 5.");
  }
  return errors.length ? fail(errors) : ok();
};
