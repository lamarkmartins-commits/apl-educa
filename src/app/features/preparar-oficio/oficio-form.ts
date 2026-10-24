import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { isCalendarDate } from './oficio-model';
import { accompanyingCount, visitDate, visitTime } from '../../core/models/visit-policy';

const nonBlank: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };
const dateValue: ValidatorFn = (control) =>
  !control.value || isCalendarDate(control.value) ? null : { date: true };
const positiveInteger: ValidatorFn = (control) =>
  control.value === null ||
  control.value === '' ||
  (Number.isSafeInteger(control.value) && control.value > 0)
    ? null
    : { integer: true };

export function createOficioForm() {
  return new FormGroup({
    numero: new FormControl('', { nonNullable: true }),
    escola: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    tipo: new FormControl('', { nonNullable: true }),
    cidade: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    dataDocumento: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, dateValue],
    }),
    responsavel: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    cargo: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.email] }),
    telefone: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    quantidade: new FormControl<number | null>(null, {
      validators: [Validators.required, positiveInteger],
    }),
    acompanhantes: new FormControl<number | null>(null, {
      validators: [Validators.required, accompanyingCount],
    }),
    turma: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
    dataPreferida: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, visitDate],
    }),
    turno: new FormControl('', { nonNullable: true, validators: [Validators.required, visitTime] }),
    objetivo: new FormControl('', { nonNullable: true, validators: [nonBlank] }),
  });
}

export type OficioFieldName = keyof ReturnType<typeof createOficioForm>['controls'];
export interface OficioField {
  name: OficioFieldName;
  label: string;
  type: 'text' | 'email' | 'date' | 'time' | 'number' | 'tel' | 'select' | 'textarea';
  min?: number;
  required?: boolean;
  hint?: string;
}

export const oficioGroups: { title: string; description: string; fields: OficioField[] }[] = [
  {
    title: 'Escola e documento',
    description: 'Use os dados que devem constar no ofício da escola.',
    fields: [
      { name: 'escola', label: 'Nome oficial da escola', type: 'text', required: true },
      {
        name: 'tipo',
        label: 'Rede da escola',
        type: 'select',
        hint: 'Opcional no documento. Rede pública: gratuidade; particular: R$ 5,00 por aluno. Professores e coordenadores acompanhantes são isentos.',
      },
      { name: 'cidade', label: 'Cidade do documento', type: 'text', required: true },
      { name: 'dataDocumento', label: 'Data do documento', type: 'date', required: true },
      {
        name: 'numero',
        label: 'Número do ofício',
        type: 'text',
        hint: 'Opcional. Use apenas um número fornecido pela escola; não é protocolo da APL.',
      },
    ],
  },
  {
    title: 'Responsável e contato',
    description:
      'O ofício deve ser assinado pela direção ou coordenação. Informe o contato direto do professor ou coordenador responsável pela visita.',
    fields: [
      { name: 'responsavel', label: 'Nome de quem assinará', type: 'text', required: true },
      { name: 'cargo', label: 'Cargo na direção ou coordenação', type: 'text', required: true },
      {
        name: 'email',
        label: 'E-mail de contato da escola',
        type: 'email',
        hint: 'Nenhuma mensagem será enviada por este protótipo.',
      },
      {
        name: 'telefone',
        label: 'Telefone/WhatsApp do responsável pela visita',
        type: 'tel',
        required: true,
        hint: 'Contato direto do professor ou coordenador. Use dados fictícios nos testes.',
      },
    ],
  },
  {
    title: 'Visita pretendida',
    description: 'Data e turno são preferências. Não há consulta de agenda ou garantia de vaga.',
    fields: [
      {
        name: 'quantidade',
        label: 'Quantidade de estudantes',
        type: 'number',
        required: true,
        hint: 'Número inteiro positivo. Acima de 50 alunos, é necessário desmembrar o grupo e solicitar datas ou turnos diferentes.',
      },
      {
        name: 'acompanhantes',
        label: 'Quantidade de professores/responsáveis acompanhantes',
        type: 'number',
        required: true,
        min: 0,
        hint: 'Informe o total de acompanhantes separadamente dos estudantes.',
      },
      {
        name: 'turma',
        label: 'Turma ou ano escolar',
        type: 'text',
        required: true,
        hint: 'Informe a série/ano das turmas, conforme a política da APL.',
      },
      {
        name: 'dataPreferida',
        label: 'Data pretendida',
        type: 'date',
        required: true,
        hint: 'Segunda a sexta-feira; fechado nos feriados. Recomenda-se solicitar com 7 dias úteis de antecedência. Feriados e disponibilidade devem ser conferidos com a APL.',
      },
      {
        name: 'turno',
        label: 'Horário sugerido para a visita',
        type: 'time',
        required: true,
        hint: 'Visitação das 08h às 12h. O horário sugerido não representa reserva.',
      },
      {
        name: 'objetivo',
        label: 'Objetivo pedagógico da visita',
        type: 'textarea',
        required: true,
      },
    ],
  },
];
