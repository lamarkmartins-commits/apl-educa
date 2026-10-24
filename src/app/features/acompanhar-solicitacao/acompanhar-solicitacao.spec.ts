import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideOptimus } from '@openng/optimus-ui/config';
import { aplPreset } from '../../theme';
import { routes } from '../../app.routes';
import { demoExamples } from '../../core/models/demo-examples';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';

describe('Consulta de acompanhamento demonstrativo', () => {
  const record = demoExamples('2026-10-23T12:00:00Z')[2];
  let find: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    find = vi.fn(() => ({ ok: true, record }));
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideOptimus({ theme: { preset: aplPreset } }),
        { provide: SolicitacoesDemo, useValue: { find } },
      ],
    });
  });
  it('abre pelo código da URL e rotula aprovação como simulação, sem confirmação real', async () => {
    const harness = await RouterTestingHarness.create(
      '/acompanhar-solicitacao?codigo=' + record.idLocal,
    );
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(find).toHaveBeenCalledWith(record.idLocal);
    expect(harness.routeNativeElement?.querySelector('app-demo-status')?.textContent).toContain(
      'Aprovada — simulação',
    );
    expect(harness.routeNativeElement?.textContent).toContain('não confirma uma visita real');
    expect(harness.routeNativeElement?.textContent).toContain(
      'Exemplo fictício de decisão simulada',
    );
  });
  it('diferencia código inválido, inexistente e erro de armazenamento', async () => {
    const harness = await RouterTestingHarness.create('/acompanhar-solicitacao');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const element = harness.routeNativeElement!;
    const code = element.querySelector<HTMLInputElement>('#lookup-code')!;
    async function search(value: string) {
      code.value = value;
      code.dispatchEvent(new Event('input', { bubbles: true }));
      element
        .querySelector('form')!
        .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      await harness.fixture.whenStable();
      harness.detectChanges();
    }
    await search('invalido');
    expect(find).not.toHaveBeenCalled();
    find.mockReturnValueOnce({ ok: true, record: null });
    await search(record.idLocal);
    expect(element.querySelector('.empty')?.textContent).toContain('Código não encontrado');
    find.mockReturnValueOnce({ ok: false, message: 'Armazenamento bloqueado.' });
    await search(record.idLocal);
    expect(element.querySelector('#lookup-error')?.textContent).toContain('bloqueado');
    expect(element.querySelector('.empty')).toBeNull();
    expect(element.querySelector('.result')).toBeNull();
  });
});
