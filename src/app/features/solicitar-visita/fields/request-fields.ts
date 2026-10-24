import { Component, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Textarea } from '@openng/optimus-ui/textarea';
import { RequestField } from '../request-form';

@Component({
  selector: 'app-request-fields',
  imports: [ReactiveFormsModule, InputText, Textarea],
  templateUrl: './request-fields.html',
  styleUrl: './request-fields.scss',
})
export class RequestFields {
  readonly group = input.required<FormGroup>();
  readonly fields = input.required<RequestField[]>();
  readonly prefix = input.required<string>();
  readonly submitted = input(false);

  protected error(field: RequestField): string {
    const control = this.group().controls[field.name];
    if (!control.invalid || !(control.touched || this.submitted())) return '';
    if (control.hasError('required')) return `Preencha ${field.label.toLocaleLowerCase('pt-BR')}.`;
    if (control.hasError('email')) return 'Informe um e-mail com formato válido.';
    if (control.hasError('integer')) return 'Informe uma quantidade inteira e maior que zero.';
    if (control.hasError('nonNegativeInteger'))
      return 'Informe um total de acompanhantes inteiro e igual ou maior que zero.';
    if (control.hasError('weekday'))
      return 'Escolha uma data de segunda a sexta-feira. A APL não abre nos feriados.';
    if (control.hasError('visitingHours'))
      return 'Informe um horário entre 08h e 12h, sujeito à confirmação da APL.';
    if (control.hasError('date')) return 'Informe uma data válida.';
    return 'Confira a opção informada.';
  }
}
