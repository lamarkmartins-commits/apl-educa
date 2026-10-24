import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideOptimus } from '@openng/optimus-ui/config';
import { aplPreset } from '../../theme';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';
import { SolicitacaoDemoInput } from '../../core/models/solicitacao-demo';
import { SolicitarVisitaPage } from './solicitar-visita';

describe('Jornada de solicitação demonstrativa', () => {
  let fixture: ComponentFixture<SolicitarVisitaPage>;
  let element: HTMLElement;
  let save: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    save = vi.fn((input: SolicitacaoDemoInput) => ({
      ok: true,
      record: {
        ...input,
        idLocal: 'DEMO-00000000-0000-4000-8000-000000000001',
        status: 'registrada_localmente',
        criadoEm: '2026-10-23T12:00:00Z',
        atualizadoEm: '2026-10-23T12:00:00Z',
      },
    }));
    TestBed.configureTestingModule({
      imports: [SolicitarVisitaPage],
      providers: [
        provideRouter([]),
        provideOptimus({ theme: { preset: aplPreset } }),
        { provide: SolicitacoesDemo, useValue: { save } },
      ],
    });
    fixture = TestBed.createComponent(SolicitarVisitaPage);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });

  async function click(text: string) {
    const button = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find((item) =>
      item.textContent?.includes(text),
    );
    expect(button).toBeTruthy();
    button!.click();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function next() {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function review() {
    await click('Preencher com exemplo');
    await next();
    await next();
    await next();
  }
  async function consent() {
    element.querySelector<HTMLInputElement>('#demo-consent')!.click();
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('impede avançar uma etapa inválida e associa os erros aos campos', async () => {
    await next();
    expect(element.querySelector('#step-title')?.textContent).toContain('Dados da escola');
    expect(element.querySelector('#request-escola-nome')?.getAttribute('aria-invalid')).toBe(
      'true',
    );
    expect(
      element.querySelector('#request-escola-nome')?.getAttribute('aria-describedby'),
    ).toContain('error-nome');
    expect(save).not.toHaveBeenCalled();
  });

  it('preserva os campos ao voltar e atualiza o resumo após edição', async () => {
    await review();
    expect(element.querySelector('app-request-review')?.textContent).toContain('Escola Exemplo');
    await click('Editar');
    const name = element.querySelector<HTMLInputElement>('#request-escola-nome')!;
    name.value = 'Outro exemplo fictício';
    name.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await next();
    await click('Voltar');
    expect(element.querySelector<HTMLInputElement>('#request-escola-nome')?.value).toBe(
      'Outro exemplo fictício',
    );
    await next();
    await next();
    await next();
    expect(element.querySelector('app-request-review')?.textContent).toContain(
      'Outro exemplo fictício',
    );
    expect(element.querySelector('app-request-review')?.textContent).toContain('Não informado');
  });

  it('exige ciência do caráter demonstrativo e não salva registros duplicados por clique repetido', async () => {
    await review();
    await click('Salvar demonstração local');
    expect(save).not.toHaveBeenCalled();
    expect(element.querySelector('.save-error')?.textContent).toContain('dados fictícios');
    await consent();
    const button = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find((item) =>
      item.textContent?.includes('Salvar demonstração local'),
    )!;
    button.click();
    button.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(save).toHaveBeenCalledOnce();
    expect(element.querySelector('.local-code')?.textContent).toMatch(/^DEMO-/);
    expect(element.querySelector('.success')?.textContent).toContain(
      'não é um protocolo institucional',
    );
    expect(element.querySelector('form')).toBeNull();
  });

  it('mantém a revisão em caso de falha e permite tentar salvar novamente', async () => {
    save.mockReturnValueOnce({ ok: false, message: 'Armazenamento bloqueado. Nada foi salvo.' });
    await review();
    await consent();
    await click('Salvar demonstração local');
    expect(element.querySelector('.success')).toBeNull();
    expect(element.querySelector('.save-error')?.textContent).toContain('bloqueado');
    expect(element.querySelector('app-request-review')?.textContent).toContain('Pessoa Exemplo');
    await click('Salvar demonstração local');
    expect(save).toHaveBeenCalledTimes(2);
    expect(element.querySelector('.success')).toBeTruthy();
  });

  it('mantém a exigência de desmembramento na revisão e preserva acompanhantes e contato', async () => {
    await click('Preencher com exemplo');
    await next();
    await next();
    const quantity = element.querySelector<HTMLInputElement>('#request-visita-quantidade')!;
    quantity.value = '75';
    quantity.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await next();
    expect(element.querySelector('.capacity-note')?.textContent).toContain('exige desmembramento');
    expect(element.querySelector('app-request-review')?.textContent).toContain('(00) 00000-0000');
    await consent();
    await click('Salvar demonstração local');
    expect(save).toHaveBeenCalledWith(
      expect.objectContaining({
        quantidadeEstudantes: 75,
        quantidadeAcompanhantes: 2,
        responsavel: expect.objectContaining({ telefone: '(00) 00000-0000' }),
      }),
    );
  });
});
