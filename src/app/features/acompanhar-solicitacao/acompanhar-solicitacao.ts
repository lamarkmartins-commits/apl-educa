import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { DEMO_ID_PATTERN, SolicitacaoVisitaDemo } from '../../core/models/solicitacao-demo';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';
import { DemoRecordDetails } from '../../shared/components/demo-record-details/demo-record-details';

@Component({
  selector: 'app-acompanhar-solicitacao-page',
  imports: [ReactiveFormsModule, RouterLink, ButtonDirective, InputText, DemoRecordDetails],
  templateUrl: './acompanhar-solicitacao.html',
  styleUrl: './acompanhar-solicitacao.scss',
})
export class AcompanharSolicitacaoPage {
  private readonly store = inject(SolicitacoesDemo);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  protected readonly code = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.pattern(DEMO_ID_PATTERN)],
  });
  protected readonly ready = signal(false);
  protected readonly record = signal<SolicitacaoVisitaDemo | null>(null);
  protected readonly error = signal('');
  protected readonly notFound = signal(false);

  constructor() {
    this.code.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.record.set(null);
      this.error.set('');
      this.notFound.set(false);
    });
    afterNextRender(() => {
      this.ready.set(true);
      this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
        const code = params.get('codigo');
        if (code) {
          this.code.setValue(code.trim());
          this.lookup();
        }
      });
    });
  }

  protected lookup(): void {
    if (!this.ready()) return;
    this.code.setValue(this.code.value.trim(), { emitEvent: false });
    this.code.markAsTouched();
    this.record.set(null);
    this.error.set('');
    this.notFound.set(false);
    if (this.code.invalid) {
      this.error.set('Informe o código local completo no formato DEMO-…');
      return;
    }
    const result = this.store.find(this.code.value);
    if (result.ok === false) {
      this.error.set(result.message);
      return;
    }
    this.record.set(result.record);
    this.notFound.set(!result.record);
    this.changeDetector.detectChanges();
    this.element.nativeElement.querySelector<HTMLElement>('#result-title')?.focus();
  }
}
