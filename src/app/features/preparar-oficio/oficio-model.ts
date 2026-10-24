export interface OficioDraft {
  numero: string;
  escola: string;
  tipo: string;
  cidade: string;
  dataDocumento: string;
  responsavel: string;
  cargo: string;
  email: string;
  telefone: string;
  quantidade: number;
  acompanhantes: number;
  turma: string;
  dataPreferida: string;
  turno: string;
  objetivo: string;
}

const months = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
];

export { isCalendarDate } from '../../shared/utils/calendar-date';

export function formatDocumentDate(value: string): string {
  const [year, month, day] = value.split('-').map(Number);
  return `${day} de ${months[month - 1]} de ${year}`;
}

export function oficioParagraphs(draft: OficioDraft): string[] {
  const schoolType =
    draft.tipo === 'publica'
      ? ' (rede pública)'
      : draft.tipo === 'particular'
        ? ' (rede particular)'
        : '';
  const group = draft.turma ? ` da(s) turma(s) ${draft.turma}` : '';
  const preferences = [
    draft.dataPreferida ? formatDocumentDate(draft.dataPreferida) : '',
    draft.turno,
  ]
    .filter(Boolean)
    .join(', ');
  const preferred = preferences ? `, preferencialmente em ${preferences}` : '';
  const contact = [draft.email, draft.telefone].filter(Boolean).join(' · ');
  return [
    draft.numero ? `OFÍCIO Nº ${draft.numero}` : 'OFÍCIO',
    `${draft.cidade}, ${formatDocumentDate(draft.dataDocumento)}.`,
    'À Academia Paraibana de Letras',
    'Assunto: Solicitação de visita escolar',
    'Prezados(as),',
    `A ${draft.escola}${schoolType}, por meio de seu(sua) representante ${draft.responsavel}, ${draft.cargo}, solicita a apreciação de uma visita educativa à Academia Paraibana de Letras, para ${draft.quantidade} estudantes e ${draft.acompanhantes} professores/responsáveis acompanhantes${group}${preferred}. A atividade tem como objetivo: ${draft.objetivo}`,
    ...(draft.quantidade > 50
      ? [
          'Conforme a política de visitação, este grupo deverá ser desmembrado para agendamento de datas ou turnos diferentes, sujeito à confirmação de disponibilidade pela APL.',
        ]
      : []),
    'Colocamo-nos à disposição para adequações de data, horário e orientações necessárias, conforme disponibilidade e confirmação dessa instituição.',
    'Atenciosamente,',
    `${draft.responsavel}\n${draft.cargo}\n\n________________________________________\nAssinatura\n\n${draft.escola}\n${contact}`,
  ];
}
