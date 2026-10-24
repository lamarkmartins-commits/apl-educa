import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideOptimus } from '@openng/optimus-ui/config';
import { routes } from '../../app.routes';
import { aplPreset } from '../../theme';
import { materiais } from './materiais';

describe('Catálogo de preparação', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), provideOptimus({ theme: { preset: aplPreset } })],
    }),
  );

  it('identifica os guias locais e a ausência de acervo institucional homologado', async () => {
    const harness = await RouterTestingHarness.create('/materiais-educativos');
    const element = harness.routeNativeElement!;
    expect(element.querySelector('h1')?.textContent).toBe('Materiais educativos');
    expect(element.querySelectorAll('.material-card')).toHaveLength(materiais.length);
    expect(element.textContent).toContain('Não são publicações oficiais');
    expect(element.textContent).toContain('Não há PDFs oficiais');
    expect(element.querySelector('a[download], a[href^="http"], iframe')).toBeNull();
  });

  it('oferece leitura nativa acessível e destinos internos existentes para cada guia', async () => {
    const harness = await RouterTestingHarness.create('/materiais-educativos');
    for (const material of materiais) {
      const card = harness.routeNativeElement!.querySelector(
        `[aria-labelledby="${material.id}-title"]`,
      )!;
      const details = card.querySelector('details')!;
      expect(details.open).toBe(false);
      expect(details.querySelector('summary')?.textContent).toContain(material.titulo);
      details.querySelector('summary')!.click();
      expect(details.open).toBe(true);
      expect(details.querySelectorAll('li')).toHaveLength(material.pontos.length);
      expect(details.querySelector('a')?.getAttribute('href')).toBe(material.rota);
      expect(routes[0].children?.some((route) => route.path === material.rota.slice(1))).toBe(true);
      details.querySelector('summary')!.click();
      expect(details.open).toBe(false);
    }
  });

  it('permite ir do catálogo ao ofício e voltar pela navegação sem gravar dados', async () => {
    const write = vi.spyOn(Storage.prototype, 'setItem');
    try {
      const harness = await RouterTestingHarness.create('/materiais-educativos');
      harness
        .routeNativeElement!.querySelector<HTMLAnchorElement>(
          '.next-step a[href="/preparar-oficio"]',
        )!
        .click();
      await harness.fixture.whenStable();
      harness.detectChanges();
      expect(harness.routeNativeElement?.querySelector('form')).toBeTruthy();
      await harness.navigateByUrl('/materiais-educativos');
      expect(harness.routeNativeElement?.querySelectorAll('.material-card')).toHaveLength(3);
      expect(write).not.toHaveBeenCalled();
    } finally {
      write.mockRestore();
    }
  });
});
