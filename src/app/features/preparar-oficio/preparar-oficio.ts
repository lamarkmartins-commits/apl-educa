import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Textarea } from '@openng/optimus-ui/textarea';
import { createOficioForm, oficioGroups, OficioField } from './oficio-form';
import { OficioDraft } from './oficio-model';
import { OficioPreview } from './preview/oficio-preview';

@Component({
  selector: 'app-preparar-oficio-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, InputText, Textarea, OficioPreview],
  templateUrl: './preparar-oficio.html',
  styleUrl: './preparar-oficio.scss',
})
export class PrepararOficioPage {
  private readonly document = inject(DOCUMENT);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  @ViewChild('previewHeading') private previewHeading?: ElementRef<HTMLElement>;
  protected readonly form = createOficioForm();
  protected readonly groups = oficioGroups;
  protected readonly draft = signal<OficioDraft | null>(null);
  protected readonly submitted = signal(false);
  protected readonly feedback = signal('');
  protected readonly quantity = signal<number | null>(null);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.quantity.set(value.quantidade ?? null);
      if (this.draft()) {
        this.draft.set(null);
        this.feedback.set(
          'Os dados foram alterados. Gere a prévia novamente antes de copiar ou imprimir.',
        );
      }
    });
  }

  protected error(field: OficioField): string {
    const control = this.form.controls[field.name];
    if (!(control.touched || this.submitted()) || !control.invalid) return '';
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
    return 'Confira o valor informado.';
  }

  protected review(): void {
    this.submitted.set(true);
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.feedback.set('Confira os campos indicados antes de gerar a prévia.');
      this.changeDetector.detectChanges();
      const invalid =
        this.element.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]');
      invalid?.focus();
      return;
    }
    const raw = this.form.getRawValue();
    const trimmed = Object.fromEntries(
      Object.entries(raw).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ]),
    );
    this.draft.set(trimmed as unknown as OficioDraft);
    this.feedback.set('Prévia preparada. Revise o conteúdo antes de copiar ou imprimir.');
    // O destino já existe no HTML; o foco indica a mudança de contexto sem usar APIs globais no SSR.
    this.previewHeading?.nativeElement.focus();
  }

  protected print(): void {
    if (this.draft() && this.form.valid) this.document.defaultView?.print();
  }
}
