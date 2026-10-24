import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { SolicitacaoVisitaDemo } from '../../../core/models/solicitacao-demo';
import { DemoStatus } from '../demo-status/demo-status';

@Component({
  selector: 'app-demo-record-details',
  imports: [DatePipe, DemoStatus],
  templateUrl: './demo-record-details.html',
  styleUrl: './demo-record-details.scss',
})
export class DemoRecordDetails {
  readonly record = input.required<SolicitacaoVisitaDemo>();
  protected readonly groups = computed(() => {
    const v = this.record();
    return [
      {
        title: 'Escola fictícia',
        rows: [
          { label: 'Instituição', value: v.escola.nome },
          { label: 'Rede', value: v.escola.tipo === 'publica' ? 'Pública' : 'Particular' },
          { label: 'Cidade', value: v.escola.cidade },
          { label: 'E-mail', value: v.escola.contatoEmail },
          { label: 'Telefone', value: v.escola.contatoTelefone },
        ],
      },
      {
        title: 'Responsável fictício',
        rows: [
          { label: 'Nome', value: v.responsavel.nome },
          { label: 'Cargo', value: v.responsavel.cargo },
          { label: 'E-mail', value: v.responsavel.email },
          { label: 'Telefone/WhatsApp', value: v.responsavel.telefone },
        ],
      },
      {
        title: 'Preferência de visita — sem reserva',
        rows: [
          { label: 'Estudantes', value: String(v.quantidadeEstudantes) },
          {
            label: 'Professores/responsáveis acompanhantes',
            value: v.quantidadeAcompanhantes === undefined ? '' : String(v.quantidadeAcompanhantes),
          },
          { label: 'Turma', value: v.turma },
          {
            label: 'Data pretendida',
            value: v.dataPreferida ? v.dataPreferida.split('-').reverse().join('/') : '',
          },
          { label: 'Turno ou horário', value: v.turnoPreferido },
          { label: 'Objetivo pedagógico', value: v.objetivoPedagogico },
        ],
      },
    ];
  });
}
