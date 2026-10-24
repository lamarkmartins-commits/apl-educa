import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { accompanyingCount, visitDate, visitTime } from '../../core/models/visit-policy';
import { SolicitacaoDemoInput } from '../../core/models/solicitacao-demo';

const requiredText: ValidatorFn = (control) =>
  typeof control.value === 'string' && control.value.trim() ? null : { required: true };
const positiveInteger: ValidatorFn = (control) =>
  control.value === null || (Number.isSafeInteger(control.value) && control.value > 0)
    ? null
    : { integer: true };
const text = (validators: ValidatorFn[] = []) =>
  new FormControl('', { nonNullable: true, validators });

export function createRequestForm() {
  return new FormGroup({
    escola: new FormGroup({
      nome: text([requiredText]),
      tipo: text([Validators.required, Validators.pattern(/^(publica|particular)$/)]),
      cidade: text(),
      contatoEmail: text([Validators.email]),
      contatoTelefone: text(),
    }),
    responsavel: new FormGroup({
      nome: text([requiredText]),
      cargo: text(),
      email: text([requiredText, Validators.email]),
      telefone: text([requiredText]),
    }),
    visita: new FormGroup({
      quantidade: new FormControl<number | null>(null, {
        validators: [Validators.required, positiveInteger],
      }),
      acompanhantes: new FormControl<number | null>(null, {
        validators: [Validators.required, accompanyingCount],
      }),
      turma: text([requiredText]),
      dataPreferida: text([Validators.required, visitDate]),
      turnoPreferido: text([requiredText, visitTime]),
      objetivoPedagogico: text(),
    }),
  });
}

export function requestInput(form: ReturnType<typeof createRequestForm>): SolicitacaoDemoInput {
  const { escola, responsavel, visita } = form.getRawValue();
  return {
    escola: {
      nome: escola.nome.trim(),
      tipo: escola.tipo as 'publica' | 'particular',
      cidade: escola.cidade.trim(),
      contatoEmail: escola.contatoEmail.trim(),
      contatoTelefone: escola.contatoTelefone.trim(),
    },
    responsavel: {
      nome: responsavel.nome.trim(),
      cargo: responsavel.cargo.trim(),
      email: responsavel.email.trim(),
      telefone: responsavel.telefone.trim(),
    },
    quantidadeEstudantes: visita.quantidade!,
    quantidadeAcompanhantes: visita.acompanhantes!,
    turma: visita.turma.trim(),
    dataPreferida: visita.dataPreferida,
    turnoPreferido: visita.turnoPreferido.trim(),
    objetivoPedagogico: visita.objetivoPedagogico.trim(),
  };
}

export function mockRequestValues(): ReturnType<
  ReturnType<typeof createRequestForm>['getRawValue']
> {
  return {
    escola: {
      nome: 'Escola Exemplo — Dados fictícios',
      tipo: 'publica',
      cidade: 'Cidade Exemplo',
      contatoEmail: 'escola@example.com',
      contatoTelefone: '',
    },
    responsavel: {
      nome: 'Pessoa Exemplo',
      cargo: 'Docente — Demonstração',
      email: 'responsavel@example.com',
      telefone: '(00) 00000-0000',
    },
    visita: {
      quantidade: 25,
      acompanhantes: 2,
      turma: 'Turma Exemplo',
      dataPreferida: '2026-10-23',
      turnoPreferido: '09:00',
      objetivoPedagogico: 'Exemplo fictício: aproximar os estudantes da literatura paraibana.',
    },
  };
}

export interface RequestField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'time' | 'select' | 'textarea';
  min?: number;
  required?: boolean;
  hint?: string;
}
export const requestSteps: {
  key: 'escola' | 'responsavel' | 'visita';
  title: string;
  description: string;
  fields: RequestField[];
}[] = [
  {
    key: 'escola',
    title: 'Dados da escola',
    description:
      'Use apenas dados fictícios. Os dados seguem a política da APL; rede e e-mail do responsável também identificam este registro demonstrativo.',
    fields: [
      { name: 'nome', label: 'Nome da instituição', type: 'text', required: true },
      {
        name: 'tipo',
        label: 'Rede pública ou particular',
        type: 'select',
        required: true,
        hint: 'Rede pública: gratuidade. Particular: R$ 5,00 por aluno; professores e coordenadores acompanhantes isentos. Não há pagamento nesta plataforma.',
      },
      { name: 'cidade', label: 'Cidade', type: 'text' },
      {
        name: 'contatoEmail',
        label: 'E-mail da escola',
        type: 'email',
        hint: 'Opcional. Use um exemplo como escola@example.com.',
      },
      {
        name: 'contatoTelefone',
        label: 'Telefone da escola',
        type: 'tel',
        hint: 'Opcional. Não informe um telefone real.',
      },
    ],
  },
  {
    key: 'responsavel',
    title: 'Responsável e contato',
    description:
      'Identifique um responsável fictício pelo registro. Nenhuma mensagem será enviada.',
    fields: [
      { name: 'nome', label: 'Nome do responsável', type: 'text', required: true },
      { name: 'cargo', label: 'Cargo ou função', type: 'text' },
      {
        name: 'email',
        label: 'E-mail do responsável',
        type: 'email',
        required: true,
        hint: 'Use um e-mail fictício, por exemplo responsavel@example.com.',
      },
      {
        name: 'telefone',
        label: 'Telefone/WhatsApp do responsável',
        type: 'tel',
        required: true,
        hint: 'Contato direto do professor ou coordenador. No teste, use (00) 00000-0000.',
      },
    ],
  },
  {
    key: 'visita',
    title: 'Turma e preferência de visita',
    description:
      'Data e turno são preferências. Esta plataforma não consulta agenda nem reserva vagas.',
    fields: [
      {
        name: 'quantidade',
        label: 'Quantidade de estudantes',
        type: 'number',
        required: true,
        hint: 'Número inteiro positivo. Acima de 50 alunos, desmembre o grupo e solicite datas ou turnos diferentes.',
      },
      {
        name: 'acompanhantes',
        label: 'Quantidade de professores/responsáveis acompanhantes',
        type: 'number',
        required: true,
        min: 0,
        hint: 'Total de acompanhantes separado do número de alunos.',
      },
      { name: 'turma', label: 'Série/ano das turmas', type: 'text', required: true },
      {
        name: 'dataPreferida',
        label: 'Data pretendida',
        type: 'date',
        required: true,
        hint: 'Segunda a sexta; fechado nos feriados. APL recomenda 7 dias úteis de antecedência. Feriados e disponibilidade devem ser conferidos com a equipe.',
      },
      {
        name: 'turnoPreferido',
        label: 'Horário sugerido para a visita',
        type: 'time',
        required: true,
        hint: 'Das 08h às 12h. Trata-se de uma sugestão, sem garantia de vaga.',
      },
      { name: 'objetivoPedagogico', label: 'Objetivo pedagógico', type: 'textarea' },
    ],
  },
];
