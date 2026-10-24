import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideOptimus } from '@openng/optimus-ui/config';
import { routes } from './app.routes';
import { aplPreset } from './theme';

describe('Navegação pública do APL Educa', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideOptimus({ theme: { preset: aplPreset } })],
    }),
  );

  it('apresenta a Home e identifica o ambiente demonstrativo', async () => {
    const harness = await RouterTestingHarness.create('/');
    const element = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toContain('fora da sala');
    expect(element.textContent).toContain('Não realiza agendamentos oficiais');
    expect(element.querySelector('nav a[aria-current="page"]')?.textContent).toContain('Início');
    expect(element.querySelector('a[href="#conteudo"]')).toBeTruthy();
  });

  it('abre o menu, fecha com Escape e devolve o foco ao botão', async () => {
    const harness = await RouterTestingHarness.create('/');
    const element = harness.routeNativeElement!;
    const toggle = element.querySelector<HTMLButtonElement>('.menu-toggle')!;
    toggle.click();
    harness.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    const nav = element.querySelector('nav')!;
    expect(nav.classList.contains('open')).toBe(true);
    nav.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    harness.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('abre o catálogo sem manter o conteúdo da página anterior', async () => {
    const harness = await RouterTestingHarness.create('/');
    for (const [path, title] of [['/materiais-educativos', 'Materiais educativos']]) {
      await harness.navigateByUrl(path);
      expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toBe(title);
      expect(harness.routeNativeElement?.querySelectorAll('.material-card')).toHaveLength(3);
      expect(harness.routeNativeElement?.querySelector('form')).toBeNull();
    }
  });

  it('fecha o menu ao navegar e permite retornar de um endereço inexistente', async () => {
    const harness = await RouterTestingHarness.create('/');
    const toggle = harness.routeNativeElement!.querySelector<HTMLButtonElement>('.menu-toggle')!;
    toggle.click();
    harness.detectChanges();
    harness
      .routeNativeElement!.querySelector<HTMLAnchorElement>('nav a[href="/como-visitar"]')!
      .click();
    await harness.fixture.whenStable();
    harness.detectChanges();
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('Como visitar');
    await harness.navigateByUrl('/endereco-inexistente');
    expect(harness.routeNativeElement?.textContent).toContain('Página não encontrada');
    await harness.navigateByUrl('/');
    expect(harness.routeNativeElement?.querySelector('h1')?.textContent).toContain('fora da sala');
  });
});
