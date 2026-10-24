import { ChangeDetectorRef, Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { Checkbox } from '@openng/optimus-ui/checkbox';
import { SolicitacaoDemoInput, SolicitacaoVisitaDemo } from '../../core/models/solicitacao-demo';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';
import { createRequestForm, mockRequestValues, requestInput, requestSteps } from './request-form';
import { RequestFields } from './fields/request-fields';
import { RequestReview } from './review/request-review';

@Component({
  selector: 'app-solicitar-visita-page',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    ButtonDirective,
    Checkbox,
    RequestFields,
    RequestReview,
  ],
  templateUrl: './solicitar-visita.html',
  styleUrl: './solicitar-visita.scss',
})
export class SolicitarVisitaPage {
  private readonly store = inject(SolicitacoesDemo);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  @ViewChild('stepHeading') private stepHeading?: ElementRef<HTMLElement>;
  protected readonly form = createRequestForm();
  protected readonly consent = new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  });
  protected readonly steps = requestSteps;
  protected readonly step = signal(0);
  protected readonly submitted = signal(false);
  protected readonly review = signal<SolicitacaoDemoInput | null>(null);
  protected readonly saved = signal<SolicitacaoVisitaDemo | null>(null);
  protected readonly feedback = signal('');
  protected readonly saveError = signal('');
  protected readonly quantity = signal<number | null>(null);

  constructor() {
    this.form.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.quantity.set(value.visita?.quantidade ?? null);
      this.review.set(null);
      this.consent.setValue(false);
      this.saveError.set('');
    });
  }

  protected fillExample(): void {
    if (this.saved()) return;
    this.form.reset(mockRequestValues());
    this.goTo(0);
    this.feedback.set(
      'Exemplo fictício preenchido. Você pode revisar e alterar os campos antes de salvar.',
    );
  }

  protected next(): void {
    if (this.saved() || this.step() >= this.steps.length) return;
    const group = this.form.controls[this.steps[this.step()].key];
    this.submitted.set(true);
    group.markAllAsTouched();
    if (group.invalid) {
      this.feedback.set('Confira os campos indicados antes de avançar.');
      this.focusInvalid();
      return;
    }
    if (this.step() === 2) {
      if (this.form.invalid) {
        this.goTo(0);
        return;
      }
      this.review.set(requestInput(this.form));
    }
    this.goTo(this.step() + 1);
  }

  protected back(): void {
    if (!this.saved() && this.step() > 0) this.goTo(this.step() - 1);
  }
  protected edit(index: number): void {
    if (!this.saved() && index >= 0 && index < 3) {
      this.review.set(null);
      this.consent.setValue(false);
      this.goTo(index);
    }
  }

  protected save(): void {
    if (this.saved() || this.step() !== 3) return;
    this.consent.markAsTouched();
    if (this.consent.invalid) {
      this.saveError.set(
        'Confirme que está usando dados fictícios e que compreende o salvamento local.',
      );
      this.focusInvalid();
      return;
    }
    const input = this.review();
    if (this.form.invalid || !input) {
      this.saveError.set('Revise os campos novamente antes de salvar.');
      return;
    }
    const result = this.store.save(input);
    if (result.ok === false) {
      this.saveError.set(result.message);
      return;
    }
    this.saved.set(result.record);
    this.saveError.set('');
    this.feedback.set(
      'Demonstração salva somente neste navegador. Nenhum pedido foi enviado à APL.',
    );
    this.changeDetector.detectChanges();
    this.element.nativeElement.querySelector<HTMLElement>('#saved-title')?.focus();
  }

  private goTo(index: number): void {
    if (index < 3) this.consent.setValue(false);
    this.step.set(index);
    this.submitted.set(false);
    this.feedback.set('');
    this.saveError.set('');
    this.changeDetector.detectChanges();
    this.stepHeading?.nativeElement.focus();
  }

  private focusInvalid(): void {
    this.changeDetector.detectChanges();
    this.element.nativeElement
      .querySelector<HTMLElement>(
        '[aria-invalid="true"] input, input[aria-invalid="true"], select[aria-invalid="true"]',
      )
      ?.focus();
  }
}
