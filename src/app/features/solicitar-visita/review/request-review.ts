import { Component, computed, input, output } from '@angular/core';
import { SolicitacaoDemoInput } from '../../../core/models/solicitacao-demo';

@Component({
  selector: 'app-request-review',
  template: `
    <div class="review-grid">
      @for (group of groups(); track group.title; let index = $index) {
        <section>
          <div class="review-heading">
            <h3>{{ group.title }}</h3>
            <button
              type="button"
              (click)="edit.emit(index)"
              [attr.aria-label]="'Editar ' + group.title"
            >
              Editar ↗
            </button>
          </div>
          <dl>
            @for (row of group.rows; track row.label) {
              <div>
                <dt>{{ row.label }}</dt>
                <dd>{{ row.value || 'Não informado' }}</dd>
              </div>
            }
          </dl>
        </section>
      }
    </div>
  `,
  styleUrl: './request-review.scss',
})
export class RequestReview {
  readonly value = input.required<SolicitacaoDemoInput>();
  readonly edit = output<number>();
  protected readonly groups = computed(() => {
    const v = this.value();
    return [
      {
        title: 'Escola',
        rows: [
          { label: 'Instituição', value: v.escola.nome },
          { label: 'Rede', value: v.escola.tipo === 'publica' ? 'Pública' : 'Particular' },
          { label: 'Cidade', value: v.escola.cidade },
          { label: 'E-mail da escola', value: v.escola.contatoEmail },
          { label: 'Telefone da escola', value: v.escola.contatoTelefone },
        ],
      },
      {
        title: 'Responsável',
        rows: [
          { label: 'Nome', value: v.responsavel.nome },
          { label: 'Cargo ou função', value: v.responsavel.cargo },
          { label: 'E-mail', value: v.responsavel.email },
          { label: 'Telefone/WhatsApp', value: v.responsavel.telefone },
        ],
      },
      {
        title: 'Visita pretendida',
        rows: [
          { label: 'Estudantes', value: String(v.quantidadeEstudantes) },
          {
            label: 'Professores/responsáveis acompanhantes',
            value: v.quantidadeAcompanhantes === undefined ? '' : String(v.quantidadeAcompanhantes),
          },
          { label: 'Turma', value: v.turma },
          {
            label: 'Data de preferência',
            value: v.dataPreferida ? v.dataPreferida.split('-').reverse().join('/') : '',
          },
          { label: 'Turno ou horário', value: v.turnoPreferido },
          { label: 'Objetivo pedagógico', value: v.objetivoPedagogico },
        ],
      },
    ];
  });
}
