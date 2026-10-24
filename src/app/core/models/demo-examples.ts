import { SolicitacaoVisitaDemo } from './solicitacao-demo';

// Exemplos fictícios adicionados somente após ação explícita no painel. IDs estáveis evitam duplicação.
export function demoExamples(now: string): SolicitacaoVisitaDemo[] {
  return (['registrada_localmente', 'em_analise_demo', 'aprovada_demo'] as const).map(
    (status, index) => ({
      idLocal: `DEMO-00000000-0000-4000-8000-00000000010${index + 1}`,
      escola: {
        nome: `Escola Exemplo ${index + 1} — Fictícia`,
        tipo: index === 1 ? 'particular' : 'publica',
        cidade: 'Cidade Exemplo',
        contatoEmail: `escola${index + 1}@example.com`,
        contatoTelefone: '',
      },
      responsavel: {
        nome: `Responsável Exemplo ${index + 1}`,
        cargo: 'Docente fictício',
        email: `responsavel${index + 1}@example.com`,
        telefone: '(00) 00000-0000',
      },
      quantidadeEstudantes: 20 + index * 5,
      quantidadeAcompanhantes: 2,
      turma: 'Turma fictícia',
      dataPreferida: '2026-10-23',
      turnoPreferido: '09:00',
      objetivoPedagogico: 'Demonstração de preparação para uma visita literária.',
      status,
      criadoEm: now,
      atualizadoEm: now,
      observacoesAdministrativas:
        status === 'aprovada_demo'
          ? ['Exemplo fictício de decisão simulada. Não confirma visita real.']
          : [],
    }),
  );
}
