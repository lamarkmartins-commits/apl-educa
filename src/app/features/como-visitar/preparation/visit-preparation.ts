import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Checkbox } from '@openng/optimus-ui/checkbox';

@Component({
  selector: 'app-visit-preparation',
  imports: [FormsModule, Checkbox],
  templateUrl: './visit-preparation.html',
  styleUrl: './visit-preparation.scss',
})
export class VisitPreparation {
  protected readonly groups = [
    {
      title: 'Escola',
      fields: ['Nome completo da instituição', 'Rede pública ou privada'],
    },
    {
      title: 'Responsável',
      fields: [
        'Nome do professor ou coordenador responsável',
        'Telefone/WhatsApp para contato direto',
        'Direção ou coordenação que assinará o ofício',
      ],
    },
    {
      title: 'Visita',
      fields: [
        'Data pretendida',
        'Horário sugerido entre 08h e 12h',
        'Número total de estudantes',
        'Número total de professores/responsáveis acompanhantes',
        'Série/ano das turmas',
      ],
    },
    {
      title: 'Documentação',
      fields: [
        'Ofício da instituição',
        'Papel timbrado da escola',
        'Revisão dos dados',
        'Assinatura da direção ou coordenação',
      ],
    },
  ];
  protected readonly checks = [
    { id: 'responsavel', label: 'Sou responsável pela solicitação da escola.' },
    { id: 'escola', label: 'Tenho os dados da instituição.' },
    { id: 'participantes', label: 'Sei aproximadamente quantos estudantes participarão.' },
    { id: 'data', label: 'Tenho uma data pretendida.' },
    {
      id: 'regras',
      label: 'Li a política de visitação e conheço as regras para o grupo escolar.',
    },
    { id: 'confirmacao', label: 'Sei que a visita depende de confirmação da equipe da APL.' },
  ];
  protected readonly selected = signal<ReadonlySet<string>>(new Set());
  protected readonly checkedCount = computed(() => this.selected().size);

  protected toggle(id: string, checked: boolean): void {
    this.selected.update((current) => {
      const next = new Set(current);
      if (checked) next.add(id);
      else next.delete(id);
      return next;
    });
  }
}
