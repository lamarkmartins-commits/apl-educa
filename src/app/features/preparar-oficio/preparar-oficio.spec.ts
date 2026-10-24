import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideOptimus } from '@openng/optimus-ui/config';
import { aplPreset } from '../../theme';
import { PrepararOficioPage } from './preparar-oficio';

describe('Preparação do ofício', () => {
  let fixture: ComponentFixture<PrepararOficioPage>;
  let element: HTMLElement;
  const clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PrepararOficioPage],
      providers: [provideRouter([]), provideOptimus({ theme: { preset: aplPreset } })],
    });
    fixture = TestBed.createComponent(PrepararOficioPage);
    fixture.detectChanges();
    element = fixture.nativeElement;
  });
  afterEach(() => {
    vi.restoreAllMocks();
    if (clipboardDescriptor) Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    else Reflect.deleteProperty(navigator, 'clipboard');
  });

  function fill(id: string, value: string): void {
    const input = element.querySelector<HTMLInputElement | HTMLTextAreaElement>('#oficio-' + id)!;
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }
  function validForm(): void {
    for (const [id, value] of Object.entries({
      escola: 'Escola Exemplo',
      cidade: 'Cidade Exemplo',
      dataDocumento: '2026-10-23',
      responsavel: 'Pessoa Exemplo',
      cargo: 'Docente',
      email: 'escola@example.com',
      telefone: '(00) 00000-0000',
      quantidade: '25',
      acompanhantes: '2',
      turma: '8º ano',
      dataPreferida: '2026-10-23',
      turno: '09:00',
      objetivo: 'Leitura e memória cultural.',
    }))
      fill(id, value);
  }
  async function review(): Promise<void> {
    element
      .querySelector('form')!
      .dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('mostra erros associados aos campos e não gera uma minuta incompleta', async () => {
    await review();
    expect(element.querySelector('.oficio-document')).toBeNull();
    const input = element.querySelector('#oficio-escola')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toContain('error-escola');
    expect(element.querySelector('#error-escola')?.textContent).toContain('Preencha');
  });

  it('gera prévia fiel e invalida a versão antiga ao editar os dados', async () => {
    const setItem = vi.spyOn(Storage.prototype, 'setItem');
    validForm();
    await review();
    expect(element.querySelector('.oficio-document')?.textContent).toContain('Escola Exemplo');
    expect(element.querySelector('.oficio-document')?.textContent).toContain(
      'Leitura e memória cultural.',
    );
    expect(element.textContent).toContain('papel timbrado');
    fill('escola', 'Nova Escola');
    expect(element.querySelector('.oficio-document')).toBeNull();
    expect(element.querySelector('.feedback')?.textContent).toContain('Gere a prévia novamente');
    await review();
    expect(element.querySelector('.oficio-document')?.textContent).toContain('Nova Escola');
    expect(element.querySelector('.oficio-document')?.textContent).not.toContain('Escola Exemplo');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('permite grupo acima da capacidade de referência com aviso e usa a impressão do navegador', async () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    validForm();
    fill('quantidade', '75');
    expect(element.querySelector('.capacity-note')?.textContent).toContain('desmembrar');
    await review();
    expect(element.querySelector('.oficio-document')?.textContent).toContain('75 estudantes');
    element.querySelector<HTMLButtonElement>('.preview-actions button')!.click();
    expect(print).toHaveBeenCalledOnce();
  });

  it('copia apenas o texto da minuta e oferece alternativa se a área de transferência falhar', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText } });
    validForm();
    await review();
    const copy = element.querySelectorAll<HTMLButtonElement>('.preview-actions button')[1];
    copy.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining('OFÍCIO\n\n'));
    expect(writeText.mock.calls[0][0]).not.toContain('Imprimir minuta');
    expect(element.querySelector('.copy-message')?.textContent).toContain('Texto copiado');
    writeText.mockRejectedValueOnce(new Error('Permission denied'));
    copy.click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(element.querySelector<HTMLTextAreaElement>('#manual-copy')?.value).toContain(
      'Escola Exemplo',
    );
    expect(element.querySelector('.copy-message')?.textContent).toContain(
      'cópia automática não está disponível',
    );
  });
});
