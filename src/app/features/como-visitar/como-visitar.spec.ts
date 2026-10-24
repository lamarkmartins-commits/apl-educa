import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideOptimus } from '@openng/optimus-ui/config';
import { routes } from '../../app.routes';
import { aplPreset } from '../../theme';

describe('Como visitar a Academia', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [
        provideRouter(routes),
        provideOptimus({ theme: { preset: aplPreset, options: { darkModeSelector: false } } }),
      ],
    }),
  );

  it('apresenta a política da seção 18 sem tratar o protótipo como canal oficial', async () => {
    const harness = await RouterTestingHarness.create('/como-visitar');
    const element = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain('Como visitar');
    expect(element.querySelectorAll('.process-list > li')).toHaveLength(7);
    expect(element.textContent).toContain('Solicitação não significa visita confirmada');
    expect(element.textContent).toContain('academiadeletraspb@gmail.com');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('7 dias úteis');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('50 estudantes');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('desmembrar');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('08h às 12h');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('R$ 5,00');
    expect(element.querySelector('#orientacoes')?.textContent).toContain('são isentos');
    expect(element.querySelector('a[href="https://aplpb.com.br/visitacao/"]')).toBeTruthy();
    expect(element.textContent).not.toContain('ainda não estão homologadas');
    expect(element.querySelector('input[type="file"]')).toBeNull();
    expect(element.querySelector('form')).toBeNull();
  });

  it('permite marcar e desmarcar o checklist sem persistir ou impedir o próximo passo', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    const harness = await RouterTestingHarness.create('/como-visitar');
    const element = harness.routeNativeElement!;
    const inputs = element.querySelectorAll<HTMLInputElement>('#checklist input[type="checkbox"]');
    expect(inputs).toHaveLength(6);
    const next = element.querySelector<HTMLAnchorElement>('.next-step a[href="/preparar-oficio"]')!;
    expect(next.getAttribute('aria-disabled')).not.toBe('true');
    inputs[0].click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('.checklist-progress')?.textContent).toContain('1 de 6');
    inputs[0].click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(element.querySelector('.checklist-progress')?.textContent).toContain('0 de 6');
    inputs[1].click();
    await harness.fixture.whenStable();
    await harness.navigateByUrl('/');
    await harness.navigateByUrl('/como-visitar');
    expect(harness.routeNativeElement?.querySelector('.checklist-progress')?.textContent).toContain(
      '0 de 6',
    );
    expect(setItem).not.toHaveBeenCalled();
    setItem.mockRestore();
  });

  it('abre e fecha uma resposta do FAQ com controle acessível', async () => {
    const harness = await RouterTestingHarness.create('/como-visitar');
    const element = harness.routeNativeElement!;
    const headers = element.querySelectorAll<HTMLElement>('#duvidas [aria-expanded]');
    expect(headers).toHaveLength(10);
    const header = headers[0];
    expect(header.getAttribute('aria-expanded')).toBe('false');
    expect(header.getAttribute('aria-controls')).toBeTruthy();
    header.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(header.getAttribute('aria-expanded')).toBe('true');
    const answer = element.querySelector('#' + header.getAttribute('aria-controls'));
    expect(answer?.textContent).toContain('não um bloqueio automático');
    header.click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(header.getAttribute('aria-expanded')).toBe('false');
  });

  it('leva ao formulário de ofício e à solicitação demonstrativa e permite voltar à Home', async () => {
    const harness = await RouterTestingHarness.create('/como-visitar');
    for (const path of ['/preparar-oficio', '/solicitar-visita']) {
      harness
        .routeNativeElement!.querySelector<HTMLAnchorElement>('.next-step a[href="' + path + '"]')!
        .click();
      await harness.fixture.whenStable();
      if (path === '/preparar-oficio') {
        expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
        expect(harness.routeNativeElement?.textContent).toContain('Gerar prévia para revisar');
      } else {
        expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
        expect(harness.routeNativeElement?.textContent).toContain('Preencher com exemplo');
      }
      await harness.navigateByUrl('/como-visitar');
    }
    harness
      .routeNativeElement!.querySelector<HTMLAnchorElement>('.breadcrumb a[href="/"]')!
      .click();
    await harness.fixture.whenStable();
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('fora da sala');
  });
});
