import { isCalendarDate } from '../../shared/utils/calendar-date';

export interface SolicitacaoDemoInput {
  escola: {
    nome: string;
    tipo: 'publica' | 'particular';
    cidade: string;
    contatoEmail: string;
    contatoTelefone: string;
  };
  responsavel: { nome: string; cargo: string; email: string; telefone?: string };
  quantidadeEstudantes: number;
  quantidadeAcompanhantes?: number;
  turma: string;
  dataPreferida: string;
  turnoPreferido: string;
  objetivoPedagogico: string;
}

export interface SolicitacaoVisitaDemo extends SolicitacaoDemoInput {
  idLocal: string;
  status: StatusDemo;
  observacoesAdministrativas?: string[];
  criadoEm: string;
  atualizadoEm: string;
}

export const DEMO_ID_PATTERN =
  /^DEMO-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const demoStatusLabels = {
  rascunho: 'Rascunho — simulação',
  registrada_localmente: 'Registrada localmente — demonstração',
  em_analise_demo: 'Em análise — simulação',
  ajustes_solicitados_demo: 'Ajustes solicitados — simulação',
  aprovada_demo: 'Aprovada — simulação',
  nao_aprovada_demo: 'Não aprovada — simulação',
} as const;
export type StatusDemo = keyof typeof demoStatusLabels;
// Fluxo de simulação da seção 10.4 da especificação; não é um processo institucional homologado.
export const demoTransitions: Record<StatusDemo, readonly StatusDemo[]> = {
  rascunho: ['registrada_localmente'],
  registrada_localmente: ['em_analise_demo'],
  em_analise_demo: ['ajustes_solicitados_demo', 'aprovada_demo', 'nao_aprovada_demo'],
  ajustes_solicitados_demo: ['em_analise_demo'],
  aprovada_demo: [],
  nao_aprovada_demo: [],
};
export function isDemoStatus(value: unknown): value is StatusDemo {
  return typeof value === 'string' && Object.hasOwn(demoStatusLabels, value);
}

function object(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}
const text = (value: unknown): value is string => typeof value === 'string';
const nonBlank = (value: unknown): value is string => text(value) && !!value.trim();

export function isSolicitacaoInput(value: unknown): value is SolicitacaoDemoInput {
  if (!object(value) || !object(value['escola']) || !object(value['responsavel'])) return false;
  const school = value['escola'];
  const responsible = value['responsavel'];
  return (
    nonBlank(school['nome']) &&
    (school['tipo'] === 'publica' || school['tipo'] === 'particular') &&
    ['cidade', 'contatoEmail', 'contatoTelefone'].every((key) => text(school[key])) &&
    nonBlank(responsible['nome']) &&
    text(responsible['cargo']) &&
    nonBlank(responsible['email']) &&
    (responsible['telefone'] === undefined || text(responsible['telefone'])) &&
    (value['quantidadeAcompanhantes'] === undefined ||
      (Number.isSafeInteger(value['quantidadeAcompanhantes']) &&
        (value['quantidadeAcompanhantes'] as number) >= 0)) &&
    Number.isSafeInteger(value['quantidadeEstudantes']) &&
    (value['quantidadeEstudantes'] as number) > 0 &&
    ['turma', 'dataPreferida', 'turnoPreferido', 'objetivoPedagogico'].every((key) =>
      text(value[key]),
    ) &&
    (value['dataPreferida'] === '' || isCalendarDate(value['dataPreferida'] as string))
  );
}

export function isSolicitacaoRecord(value: unknown): value is SolicitacaoVisitaDemo {
  if (!isSolicitacaoInput(value) || !object(value)) return false;
  return (
    text(value['idLocal']) &&
    DEMO_ID_PATTERN.test(value['idLocal']) &&
    isDemoStatus(value['status']) &&
    (value['observacoesAdministrativas'] === undefined ||
      (Array.isArray(value['observacoesAdministrativas']) &&
        value['observacoesAdministrativas'].every(nonBlank))) &&
    ['criadoEm', 'atualizadoEm'].every(
      (key) => text(value[key]) && Number.isFinite(Date.parse(value[key] as string)),
    )
  );
}
