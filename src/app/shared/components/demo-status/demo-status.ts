import { Component, input } from '@angular/core';
import { StatusDemo, demoStatusLabels } from '../../../core/models/solicitacao-demo';

@Component({
  selector: 'app-demo-status',
  template: `<span class="status" [attr.data-state]="value()">{{ labels[value()] }}</span>`,
  styles: `
    .status {
      display: inline-block;
      padding: 0.35rem 0.6rem;
      border: 1px solid var(--apl-border);
      border-radius: 0.35rem;
      background: var(--apl-cream);
      color: var(--apl-brown);
      font-size: 0.72rem;
      line-height: 1.6;
    }
    [data-state='aprovada_demo'] {
      background: #edf1ec;
    }
    [data-state='nao_aprovada_demo'] {
      background: #fff4f2;
    }
  `,
})
export class DemoStatus {
  readonly value = input.required<StatusDemo>();
  protected readonly labels = demoStatusLabels;
}
