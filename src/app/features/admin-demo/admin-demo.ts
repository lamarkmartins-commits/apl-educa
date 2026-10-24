import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { InputText } from '@openng/optimus-ui/inputtext';
import { Textarea } from '@openng/optimus-ui/textarea';
import {
  SolicitacaoVisitaDemo,
  demoStatusLabels,
  demoTransitions,
  isDemoStatus,
} from '../../core/models/solicitacao-demo';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';
import { DemoStatus } from '../../shared/components/demo-status/demo-status';
import { DemoRecordDetails } from '../../shared/components/demo-record-details/demo-record-details';

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('pt-BR');

@Component({
  selector: 'app-admin-demo-page',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    ButtonDirective,
    InputText,
    Textarea,
    DemoStatus,
    DemoRecordDetails,
  ],
  templateUrl: './admin-demo.html',
  styleUrl: './admin-demo.scss',
})
export class AdminDemoPage {
  private readonly store = inject(SolicitacoesDemo);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly changeDetector = inject(ChangeDetectorRef);
  protected readonly ready = signal(false);
  protected readonly records = signal<SolicitacaoVisitaDemo[]>([]);
  protected readonly selectedId = signal('');
  protected readonly error = signal('');
  protected readonly message = signal('');
  protected readonly detailError = signal('');
  protected readonly detailMessage = signal('');
  protected readonly search = new FormControl('', { nonNullable: true });
  protected readonly statusFilter = new FormControl('', { nonNullable: true });
  protected readonly schoolFilter = new FormControl('', { nonNullable: true });
  protected readonly nextStatus = new FormControl('', { nonNullable: true });
  protected readonly observation = new FormControl('', { nonNullable: true });
  private readonly searchValue = toSignal(this.search.valueChanges, { initialValue: '' });
  private readonly statusValue = toSignal(this.statusFilter.valueChanges, { initialValue: '' });
  private readonly schoolValue = toSignal(this.schoolFilter.valueChanges, { initialValue: '' });
  protected readonly statusOptions = Object.entries(demoStatusLabels).map(([value, label]) => ({
    value,
    label,
  }));
  protected readonly labels = demoStatusLabels;
  protected readonly selected = computed(
    () => this.records().find((record) => record.idLocal === this.selectedId()) ?? null,
  );
  protected readonly allowed = computed(() => {
    const record = this.selected();
    return record ? demoTransitions[record.status] : [];
  });
  protected readonly filtered = computed(() => {
    const query = normalize(this.searchValue().trim());
    return this.records().filter(
      (record) =>
        (!this.statusValue() || record.status === this.statusValue()) &&
        (!this.schoolValue() || record.escola.tipo === this.schoolValue()) &&
        (!query ||
          normalize(
            [
              record.idLocal,
              record.escola.nome,
              record.responsavel.nome,
              record.responsavel.email,
            ].join(' '),
          ).includes(query)),
    );
  });
  protected readonly summary = computed(() => [
    { label: 'Registros demonstrativos', count: this.records().length },
    {
      label: 'Registrados localmente',
      count: this.records().filter((r) => r.status === 'registrada_localmente').length,
    },
    {
      label: 'Em análise — simulação',
      count: this.records().filter((r) => r.status === 'em_analise_demo').length,
    },
    {
      label: 'Decisões simuladas',
      count: this.records().filter(
        (r) => r.status === 'aprovada_demo' || r.status === 'nao_aprovada_demo',
      ).length,
    },
  ]);

  constructor() {
    afterNextRender(() => {
      this.ready.set(true);
      this.refresh();
    });
  }

  protected refresh(): void {
    if (!this.ready()) return;
    this.message.set('');
    this.error.set('');
    this.detailError.set('');
    this.detailMessage.set('');
    const result = this.store.list();
    if (result.ok === false) {
      this.error.set(result.message);
      this.records.set([]);
      return;
    }
    this.records.set(
      [...result.records].sort((a, b) => Date.parse(b.criadoEm) - Date.parse(a.criadoEm)),
    );
  }
  protected examples(): void {
    if (!this.ready()) return;
    this.message.set('');
    this.error.set('');
    const result = this.store.addExamples();
    if (result.ok === false) {
      this.error.set(result.message);
      return;
    }
    this.refresh();
    if (this.error()) return;
    this.message.set(
      result.added
        ? `${result.added} exemplos fictícios adicionados somente neste navegador.`
        : 'Os exemplos já existem. Seus registros e alterações foram preservados.',
    );
  }
  protected select(id: string): void {
    this.selectedId.set(id);
    this.nextStatus.setValue('');
    this.observation.setValue('');
    this.detailError.set('');
    this.detailMessage.set('');
    this.changeDetector.detectChanges();
    this.element.nativeElement.querySelector<HTMLElement>('#detail-title')?.focus();
  }
  protected updateStatus(): void {
    this.detailError.set('');
    this.detailMessage.set('');
    const record = this.selected();
    const next = this.nextStatus.value;
    if (!record || !isDemoStatus(next)) {
      this.detailError.set('Escolha um próximo estado demonstrativo.');
      return;
    }
    const result = this.store.updateStatus(record.idLocal, next);
    if (result.ok === false) {
      this.detailError.set(result.message);
      return;
    }
    this.applyRecord(result.record);
    this.nextStatus.setValue('');
    this.detailError.set('');
    this.detailMessage.set(
      'Status de simulação salvo no navegador. Nenhuma decisão foi enviada à APL.',
    );
  }
  protected addObservation(): void {
    this.detailError.set('');
    this.detailMessage.set('');
    const record = this.selected();
    if (!record) return;
    const result = this.store.addObservation(record.idLocal, this.observation.value);
    if (result.ok === false) {
      this.detailError.set(result.message);
      return;
    }
    this.applyRecord(result.record);
    this.observation.setValue('');
    this.detailError.set('');
    this.detailMessage.set('Observação demonstrativa salva somente neste navegador.');
  }
  private applyRecord(updated: SolicitacaoVisitaDemo): void {
    this.records.update((records) =>
      records.map((record) => (record.idLocal === updated.idLocal ? updated : record)),
    );
  }
}
