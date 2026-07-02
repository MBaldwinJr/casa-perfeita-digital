import { describe, it, expect } from "vitest";
import {
  buildDashboardStatistics,
  buildRelatorioStatistics,
  calcularPercentualSatisfacao,
  calcularSatisfacaoMedia,
  calcularTaxaResolucao,
  contarAgendamentosHoje,
  contarGarantiasVencendo,
  validarNovoAgendamento,
  validarNovoAtendimento,
  validarNovaPesquisa,
} from "@/features/pos-venda/utils/statistics";

const REF = new Date("2026-07-02T12:00:00Z");
const isoDaysFromRef = (days: number): string => {
  const d = new Date(REF.getTime() + days * 24 * 60 * 60 * 1000);
  return d.toISOString();
};

describe("calcularSatisfacaoMedia", () => {
  it("retorna 0 para lista vazia (estado vazio)", () => {
    expect(calcularSatisfacaoMedia([])).toBe(0);
  });

  it("calcula média com uma casa decimal", () => {
    expect(calcularSatisfacaoMedia([{ nota: 5 }, { nota: 4 }, { nota: 3 }])).toBe(4);
    expect(calcularSatisfacaoMedia([{ nota: 5 }, { nota: 4 }])).toBe(4.5);
  });
});

describe("calcularPercentualSatisfacao", () => {
  it("retorna 0 quando não há pesquisas", () => {
    expect(calcularPercentualSatisfacao([])).toBe(0);
  });

  it("converte média para percentual do máximo (5)", () => {
    expect(calcularPercentualSatisfacao([{ nota: 5 }])).toBe(100);
    expect(calcularPercentualSatisfacao([{ nota: 4 }])).toBe(80);
    expect(calcularPercentualSatisfacao([{ nota: 1 }, { nota: 5 }])).toBe(60);
  });
});

describe("calcularTaxaResolucao", () => {
  it("retorna 0 sem atendimentos (evita divisão por zero)", () => {
    expect(calcularTaxaResolucao([])).toBe(0);
  });

  it("calcula percentual arredondado de resolvidos", () => {
    expect(
      calcularTaxaResolucao([
        { status: "resolvido", prioridade: "media" },
        { status: "aberto", prioridade: "media" },
        { status: "resolvido", prioridade: "media" },
      ]),
    ).toBe(67);
  });

  it("retorna 100 quando todos estão resolvidos", () => {
    expect(
      calcularTaxaResolucao([
        { status: "resolvido", prioridade: "baixa" },
        { status: "resolvido", prioridade: "alta" },
      ]),
    ).toBe(100);
  });
});

describe("contarGarantiasVencendo", () => {
  it("conta apenas as que vencem dentro da janela e no futuro", () => {
    const garantias = [
      { data_fim: isoDaysFromRef(10) }, // dentro
      { data_fim: isoDaysFromRef(29) }, // dentro
      { data_fim: isoDaysFromRef(31) }, // fora
      { data_fim: isoDaysFromRef(-1) }, // já vencida
    ];
    expect(contarGarantiasVencendo(garantias, REF)).toBe(2);
  });

  it("ignora datas inválidas (caso de erro)", () => {
    expect(contarGarantiasVencendo([{ data_fim: "not-a-date" }], REF)).toBe(0);
  });

  it("retorna 0 para lista vazia", () => {
    expect(contarGarantiasVencendo([], REF)).toBe(0);
  });
});

describe("contarAgendamentosHoje", () => {
  it("conta apenas os do dia de referência", () => {
    const hoje = REF.toISOString().split("T")[0];
    const agendamentos = [
      { data_agendamento: hoje },
      { data_agendamento: hoje },
      { data_agendamento: "2026-07-03" },
    ];
    expect(contarAgendamentosHoje(agendamentos, REF)).toBe(2);
  });

  it("retorna 0 quando não há agendamentos", () => {
    expect(contarAgendamentosHoje([], REF)).toBe(0);
  });
});

describe("buildDashboardStatistics", () => {
  it("compõe todas as métricas corretamente", () => {
    const stats = buildDashboardStatistics({
      atendimentos: [
        { status: "aberto", prioridade: "urgente" },
        { status: "resolvido", prioridade: "media" },
        { status: "em_andamento", prioridade: "alta" },
      ],
      pesquisas: [{ nota: 5 }, { nota: 3 }],
      garantias: [{ data_fim: isoDaysFromRef(5) }],
      agendamentos: [{ data_agendamento: REF.toISOString().split("T")[0] }],
      referencia: REF,
    });
    expect(stats.atendimentosAtivos).toBe(2);
    expect(stats.atendimentosUrgentes).toBe(2);
    expect(stats.satisfacaoMedia).toBe("4.0");
    expect(stats.garantiasVencendo).toBe(1);
    expect(stats.agendamentosHoje).toBe(1);
  });

  it("gera valores neutros com todas as coleções vazias", () => {
    const stats = buildDashboardStatistics({
      atendimentos: [],
      pesquisas: [],
      garantias: [],
      agendamentos: [],
      referencia: REF,
    });
    expect(stats).toEqual({
      atendimentosAtivos: 0,
      atendimentosUrgentes: 0,
      satisfacaoMedia: "0.0",
      garantiasVencendo: 0,
      agendamentosHoje: 0,
    });
  });
});

describe("buildRelatorioStatistics", () => {
  it("agrega totais, taxas e satisfação", () => {
    const rel = buildRelatorioStatistics({
      atendimentos: [
        { status: "resolvido", prioridade: "media" },
        { status: "aberto", prioridade: "media" },
      ],
      pesquisas: [{ nota: 4 }, { nota: 5 }],
      agendamentos: [
        { data_agendamento: "2026-07-01" },
        { data_agendamento: "2026-07-02" },
      ],
    });
    expect(rel.totalAtendimentos).toBe(2);
    expect(rel.atendimentosResolvidos).toBe(1);
    expect(rel.taxaResolucao).toBe(50);
    expect(rel.mediaSatisfacao).toBe(4.5);
    expect(rel.visitasTecnicas).toBe(2);
    expect(rel.percentualSatisfacao).toBe(90);
  });
});

describe("validarNovoAtendimento", () => {
  it("aprova entrada com assunto", () => {
    const r = validarNovoAtendimento({ assunto: "Problema hidráulico" });
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("rejeita quando assunto está ausente", () => {
    const r = validarNovoAtendimento({});
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("Assunto é obrigatório.");
  });

  it("rejeita quando assunto é só espaços em branco", () => {
    const r = validarNovoAtendimento({ assunto: "   " });
    expect(r.valid).toBe(false);
  });
});

describe("validarNovoAgendamento", () => {
  it("aprova entrada válida no futuro", () => {
    const r = validarNovoAgendamento(
      { cliente_id: "abc", data_agendamento: "2026-07-05", tipo_visita: "tecnica" },
      REF,
    );
    expect(r.valid).toBe(true);
  });

  it("rejeita sem cliente e sem data", () => {
    const r = validarNovoAgendamento({}, REF);
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("Cliente é obrigatório.");
    expect(r.errors).toContain("Data de agendamento é obrigatória.");
  });

  it("rejeita data no passado", () => {
    const r = validarNovoAgendamento(
      { cliente_id: "abc", data_agendamento: "2026-06-01" },
      REF,
    );
    expect(r.valid).toBe(false);
    expect(r.errors).toContain(
      "Data de agendamento não pode ser no passado.",
    );
  });

  it("rejeita data inválida", () => {
    const r = validarNovoAgendamento(
      { cliente_id: "abc", data_agendamento: "not-a-date" },
      REF,
    );
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("Data de agendamento inválida.");
  });
});

describe("validarNovaPesquisa", () => {
  it("aprova nota dentro da escala", () => {
    expect(validarNovaPesquisa({ cliente_id: "abc", nota: 5 }).valid).toBe(true);
    expect(validarNovaPesquisa({ cliente_id: "abc", nota: 1 }).valid).toBe(true);
  });

  it("rejeita sem cliente", () => {
    const r = validarNovaPesquisa({ nota: 4 });
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("Cliente é obrigatório.");
  });

  it("rejeita nota fora da escala", () => {
    expect(validarNovaPesquisa({ cliente_id: "abc", nota: 0 }).valid).toBe(false);
    expect(validarNovaPesquisa({ cliente_id: "abc", nota: 6 }).valid).toBe(false);
  });

  it("rejeita nota ausente ou NaN", () => {
    expect(validarNovaPesquisa({ cliente_id: "abc" }).valid).toBe(false);
    expect(
      validarNovaPesquisa({ cliente_id: "abc", nota: Number.NaN }).valid,
    ).toBe(false);
  });
});
