import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideOptimus } from '@openng/optimus-ui/config';
import { aplPreset } from '../../theme';
import { demoExamples } from '../../core/models/demo-examples';
import { SolicitacoesDemo } from '../../core/services/solicitacoes-demo';
import { SolicitacaoVisitaDemo } from '../../core/models/solicitacao-demo';
import { AdminDemoPage } from './admin-demo';

describe('Administração demonstrativa', () => {
  let fixture: ComponentFixture<AdminDemoPage>;
  let element: HTMLElement;
  let records: SolicitacaoVisitaDemo[];
  let list: ReturnType<typeof vi.fn>;
  let updateStatus: ReturnType<typeof vi.fn>;
  let addObservation: ReturnType<typeof vi.fn>;
  beforeEach(async () => {
    records = demoExamples('2026-10-23T12:00:00Z');
    list = vi.fn(() => ({ ok: true, records }));
    updateStatus = vi.fn((id, status) => ({
      ok: true,
      record: { ...records.find((record) => record.idLocal === id)!, status },
    }));
    addObservation = vi.fn((id, note) => ({
      ok: true,
      record: {
        ...records.find((record) => record.idLocal === id)!,
        observacoesAdministrativas: [note],
      },
    }));
    TestBed.configureTestingModule({
      imports: [AdminDemoPage],
      providers: [
        provideRouter([]),
        provideOptimus({ theme: { preset: aplPreset } }),
        {
          provide: SolicitacoesDemo,
          useValue: {
            list,
            updateStatus,
            addObservation,
            addExamples: vi.fn(() => ({ ok: true, added: 0 })),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(AdminDemoPage);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    element = fixture.nativeElement;
  });
  async function click(text: string) {
    const button = Array.from(element.querySelectorAll<HTMLButtonElement>('button')).find((b) =>
      b.textContent?.includes(text),
    );
    expect(button).toBeTruthy();
    button!.click();
    await fixture.whenStable();
    fixture.detectChanges();
  }
  async function change(id: string, value: string, event = 'input') {
    const input = element.querySelector<HTMLInputElement>('#' + id)!;
    input.value = value;
    input.dispatchEvent(new Event(event, { bubbles: true }));
    await fixture.whenStable();
    fixture.detectChanges();
  }

  it('lista dados locais e filtra por busca normalizada, status e rede', async () => {
    expect(element.textContent).toContain('sem autenticação');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(3);
    await change('admin-search', 'responsavel exemplo 2');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    await change('admin-search', '');
    await change('admin-status-filter', 'aprovada_demo', 'change');
    expect(element.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(element.querySelector('tbody')?.textContent).toContain('Aprovada — simulação');
    await change('admin-school-filter', 'particular', 'change');
    expect(element.querySelector('.empty')?.textContent).toContain('Nenhum resultado');
  });
  it('exibe detalhe completo e salva status e observação com indicação de simulação', async () => {
    await click('Ver detalhes');
    expect(element.querySelector('.detail')?.textContent).toContain('escola1@example.com');
    await change('next-status', 'em_analise_demo', 'change');
    await click('Salvar status de simulação');
    expect(updateStatus).toHaveBeenCalledWith(records[0].idLocal, 'em_analise_demo');
    expect(element.querySelector('.detail')?.textContent).toContain('Em análise — simulação');
    await change('admin-observation', 'Observação de teste');
    await click('Salvar observação local');
    expect(addObservation).toHaveBeenCalledWith(records[0].idLocal, 'Observação de teste');
    expect(element.querySelector('.notes')?.textContent).toContain('Observação de teste');
  });
  it('não apresenta sucesso nem muda o status visível se o armazenamento falhar', async () => {
    await click('Ver detalhes');
    updateStatus.mockReturnValueOnce({ ok: false, message: 'Falha de escrita no navegador.' });
    await change('next-status', 'em_analise_demo', 'change');
    await click('Salvar status de simulação');
    expect(element.querySelector('.detail .error')?.textContent).toContain('Falha de escrita');
    expect(element.querySelector('.detail app-demo-status')?.textContent).toContain(
      'Registrada localmente',
    );
  });
  it('distingue armazenamento vazio de erro e não cria exemplos automaticamente', async () => {
    list.mockReturnValueOnce({ ok: true, records: [] });
    await click('Atualizar registros');
    expect(element.querySelector('.empty')?.textContent).toContain('Nenhum registro local');
    list.mockReturnValueOnce({ ok: false, message: 'Dados incompatíveis, preservados.' });
    await click('Atualizar registros');
    expect(element.querySelector('.error')?.textContent).toContain('Dados incompatíveis');
    expect(element.querySelector('.empty')).toBeNull();
  });

  it('remove feedback antigo ao atualizar e não confunde sucesso anterior com falha de leitura', async () => {
    await click('Adicionar exemplos fictícios');
    expect(element.querySelector('.feedback')?.textContent).toContain('já existem');
    await click('Ver detalhes');
    await change('next-status', 'em_analise_demo', 'change');
    await click('Salvar status de simulação');
    list.mockReturnValueOnce({ ok: false, message: 'Leitura bloqueada. Dados preservados.' });
    await click('Atualizar registros');
    expect(element.querySelector('.feedback')?.textContent?.trim()).toBe('');
    expect(element.querySelector('.error')?.textContent).toContain('Leitura bloqueada');
    expect(element.querySelector('.detail')).toBeNull();
  });
});
