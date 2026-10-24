import { DOCUMENT } from '@angular/common';
import { Component, computed, inject, input, output, signal } from '@angular/core';
import { ButtonDirective } from '@openng/optimus-ui/button';
import { OficioDraft, oficioParagraphs } from '../oficio-model';

@Component({
  selector: 'app-oficio-preview',
  imports: [ButtonDirective],
  templateUrl: './oficio-preview.html',
  styleUrl: './oficio-preview.scss',
})
export class OficioPreview {
  private readonly document = inject(DOCUMENT);
  readonly draft = input.required<OficioDraft>();
  readonly printRequested = output<void>();
  protected readonly paragraphs = computed(() => oficioParagraphs(this.draft()));
  protected readonly text = computed(() => this.paragraphs().join('\n\n'));
  protected readonly copyMessage = signal('');
  protected readonly manualCopy = signal(false);

  protected async copy(): Promise<void> {
    try {
      const clipboard = this.document.defaultView?.navigator.clipboard;
      if (!clipboard) throw new Error('Clipboard unavailable');
      await clipboard.writeText(this.text());
      this.manualCopy.set(false);
      this.copyMessage.set(
        'Texto copiado. Revise e coloque em papel timbrado antes de assinar e encaminhar.',
      );
    } catch {
      this.manualCopy.set(true);
      this.copyMessage.set(
        'A cópia automática não está disponível. Selecione e copie o texto no campo abaixo.',
      );
    }
  }
}
