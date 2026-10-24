import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideOptimus } from '@openng/optimus-ui/config';
import { routes } from './app.routes';
import { aplPreset } from './theme';

const publicPaths = [
  '/',
  '/como-visitar',
  '/materiais-educativos',
  '/preparar-oficio',
  '/solicitar-visita',
  '/acompanhar-solicitacao',
  '/admin',
  '/pagina-inexistente',
];

describe('Sprint 06 — verificações estruturais de acessibilidade e navegação', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideOptimus({ theme: { preset: aplPreset } })],
    }),
  );

  for (const path of publicPaths) {
    it(`mantém estrutura, nomes e referências acessíveis em ${path}`, async () => {
      const harness = await RouterTestingHarness.create(path);
      await harness.fixture.whenStable();
      harness.detectChanges();
      const page = harness.routeNativeElement!;
      expect(page.querySelectorAll('main')).toHaveLength(1);
      expect(page.querySelectorAll('h1')).toHaveLength(1);
      expect(page.querySelector('a[href="#conteudo"]')).toBeTruthy();
      const ids = Array.from(page.querySelectorAll('[id]')).map((node) => node.id);
      expect(new Set(ids).size).toBe(ids.length);
      for (const node of page.querySelectorAll(
        '[aria-labelledby], [aria-describedby], [aria-controls]',
      )) {
        for (const attr of ['aria-labelledby', 'aria-describedby', 'aria-controls']) {
          for (const id of (node.getAttribute(attr) ?? '').split(/\s+/).filter(Boolean)) {
            expect(ids, `${path}: ${attr}=${id}`).toContain(id);
          }
        }
      }
      for (const control of page.querySelectorAll('input:not([type="hidden"]), select, textarea')) {
        const labelled =
          control.getAttribute('aria-label') ||
          control.getAttribute('aria-labelledby') ||
          Array.from(page.querySelectorAll('label')).some(
            (label) => label.htmlFor === control.id && !!control.id,
          ) ||
          control.closest('label');
        expect(!!labelled, `${path}: controle ${control.id} sem nome`).toBe(true);
      }
      for (const control of page.querySelectorAll('button, a, summary')) {
        expect(
          (control.getAttribute('aria-label') || control.textContent || '').trim().length,
          `${path}: controle sem texto`,
        ).toBeGreaterThan(0);
      }
    });
  }

  it('oferece destino de foco no conteúdo depois da troca de página', async () => {
    const harness = await RouterTestingHarness.create('/');
    await harness.navigateByUrl('/materiais-educativos');
    await harness.fixture.whenStable();
    harness.detectChanges();
    const main = harness.routeNativeElement!.querySelector('main')!;
    expect(main.getAttribute('tabindex')).toBe('-1');
    expect(document.activeElement).toBe(main);
  });
});
