import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SolicitacoesDemo, DEMO_STORAGE_KEY } from './solicitacoes-demo';
import {
  createRequestForm,
  mockRequestValues,
  requestInput,
} from '../../features/solicitar-visita/request-form';

describe('Persistência das solicitações demonstrativas', () => {
  let data: Map<string, string>;
  let storage: { getItem: ReturnType<typeof vi.fn>; setItem: ReturnType<typeof vi.fn> };
  let browser: { localStorage: typeof storage; crypto: { randomUUID: () => string } };
  let service: SolicitacoesDemo;
  const input = () => {
    const form = createRequestForm();
    form.reset(mockRequestValues());
    return requestInput(form);
  };

  beforeEach(() => {
    data = new Map();
    storage = {
      getItem: vi.fn((key) => data.get(key) ?? null),
      setItem: vi.fn((key, value) => data.set(key, value)),
    };
    let counter = 0;
    browser = {
      localStorage: storage,
      crypto: {
        randomUUID: () => `00000000-0000-4000-8000-${String(++counter).padStart(12, '0')}`,
      },
    };
    TestBed.configureTestingModule({
      providers: [
        SolicitacoesDemo,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: DOCUMENT, useValue: { defaultView: browser } },
      ],
    });
    service = TestBed.inject(SolicitacoesDemo);
  });

  it('persiste a entrada com ID demo e status local e preserva os registros anteriores', () => {
    const first = service.save(input());
    const second = service.save({
      ...input(),
      escola: { ...input().escola, nome: 'Outro exemplo' },
    });
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    const saved = JSON.parse(data.get(DEMO_STORAGE_KEY)!);
    expect(saved.version).toBe(1);
    expect(saved.records).toHaveLength(2);
    expect(saved.records[0].idLocal).not.toBe(saved.records[1].idLocal);
    expect(saved.records[0]).toMatchObject({ ...input(), status: 'registrada_localmente' });
    expect(saved.records[0].idLocal).toMatch(/^DEMO-/);
    expect(Number.isFinite(Date.parse(saved.records[0].criadoEm))).toBe(true);
    // Simula uma nova instância após recarregar: a origem da verdade é o storage, não um array em memória.
    const reloaded = TestBed.runInInjectionContext(() => new SolicitacoesDemo());
    expect(reloaded.save(input()).ok).toBe(true);
    expect(JSON.parse(data.get(DEMO_STORAGE_KEY)!).records).toHaveLength(3);
  });

  it.each(['{invalid', '{"version":2,"records":[]}', '{"version":1,"records":[{}]}'])(
    'não sobrescreve dados ilegíveis ou incompatíveis: %s',
    (raw) => {
      data.set(DEMO_STORAGE_KEY, raw);
      const result = service.save(input());
      expect(result.ok).toBe(false);
      expect(storage.setItem).not.toHaveBeenCalled();
      expect(data.get(DEMO_STORAGE_KEY)).toBe(raw);
    },
  );

  it('não anuncia sucesso quando há falha de escrita ou acesso ao armazenamento', () => {
    storage.setItem.mockImplementationOnce(() => {
      throw new Error('Quota exceeded');
    });
    const failed = service.save(input());
    expect(failed.ok).toBe(false);
    expect(data.size).toBe(0);
    Object.defineProperty(browser, 'localStorage', {
      get: () => {
        throw new Error('Access denied');
      },
    });
    expect(service.save(input()).ok).toBe(false);
  });

  it('não acessa o storage ou gera identificador no SSR', () => {
    TestBed.resetTestingModule();
    const read = vi.fn(() => {
      throw new Error('Not allowed in SSR');
    });
    const serverBrowser = Object.defineProperty({}, 'localStorage', { get: read });
    TestBed.configureTestingModule({
      providers: [
        SolicitacoesDemo,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: DOCUMENT, useValue: { defaultView: serverBrowser } },
      ],
    });
    expect(TestBed.inject(SolicitacoesDemo).save(input()).ok).toBe(false);
    expect(read).not.toHaveBeenCalled();
  });

  it('recusa entrada estruturalmente inválida antes de escrever', () => {
    expect(service.save({ ...input(), quantidadeEstudantes: 0 }).ok).toBe(false);
    expect(service.save({ ...input(), dataPreferida: '2026-02-30' }).ok).toBe(false);
    expect(storage.setItem).not.toHaveBeenCalled();
  });

  it('valida a política em novas gravações, mas preserva e atualiza registros legados', () => {
    const old = {
      ...input(),
      idLocal: 'DEMO-00000000-0000-4000-8000-999999999999',
      status: 'registrada_localmente',
      criadoEm: '2026-10-23T12:00:00Z',
      atualizadoEm: '2026-10-23T12:00:00Z',
    };
    delete old.quantidadeAcompanhantes;
    delete old.responsavel.telefone;
    old.dataPreferida = '';
    old.turnoPreferido = 'Tarde — registro anterior';
    const raw = JSON.stringify({ version: 1, records: [old] });
    data.set(DEMO_STORAGE_KEY, raw);
    expect(service.find(old.idLocal)).toEqual({ ok: true, record: old });
    expect(data.get(DEMO_STORAGE_KEY)).toBe(raw);
    expect(service.save(input()).ok).toBe(true);
    expect(service.find(old.idLocal)).toEqual({ ok: true, record: old });
    expect(service.updateStatus(old.idLocal, 'em_analise_demo').ok).toBe(true);
    const legacy = service.find(old.idLocal);
    if (!legacy.ok || !legacy.record) throw new Error('Registro legado ausente');
    expect(legacy.record.quantidadeAcompanhantes).toBeUndefined();
    expect(legacy.record.responsavel.telefone).toBeUndefined();
    expect(legacy.record.turnoPreferido).toBe(old.turnoPreferido);
    const before = storage.setItem.mock.calls.length;
    for (const value of [
      { ...input(), quantidadeAcompanhantes: undefined },
      { ...input(), dataPreferida: '2026-10-24' },
      { ...input(), turnoPreferido: '14:00' },
      { ...input(), responsavel: { ...input().responsavel, telefone: '' } },
    ])
      expect(service.save(value).ok).toBe(false);
    expect(storage.setItem.mock.calls.length).toBe(before);
  });

  it('consulta por código sem diferenciar maiúsculas e distingue vazio, inválido e inexistente', () => {
    expect(service.list()).toEqual({ ok: true, records: [] });
    expect(storage.setItem).not.toHaveBeenCalled();
    const saved = service.save(input());
    if (saved.ok === false) throw new Error(saved.message);
    expect(service.find(' ' + saved.record.idLocal.toUpperCase() + ' ')).toEqual({
      ok: true,
      record: saved.record,
    });
    expect(service.find('DEMO-00000000-0000-4000-8000-999999999999')).toEqual({
      ok: true,
      record: null,
    });
    expect(service.find('codigo-invalido').ok).toBe(false);
  });

  it('preserva registros da Sprint 04 e restringe as transições ao fluxo de simulação', () => {
    const saved = service.save(input());
    if (saved.ok === false) throw new Error(saved.message);
    const id = saved.record.idLocal;
    expect(saved.record.observacoesAdministrativas).toBeUndefined();
    expect(service.updateStatus(id, 'aprovada_demo').ok).toBe(false);
    for (const state of [
      'em_analise_demo',
      'ajustes_solicitados_demo',
      'em_analise_demo',
      'aprovada_demo',
    ] as const) {
      expect(service.updateStatus(id, state).ok).toBe(true);
    }
    expect(service.updateStatus(id, 'em_analise_demo').ok).toBe(false);
    const result = service.find(id);
    if (result.ok === false || !result.record) throw new Error('Record missing');
    expect(result.record.status).toBe('aprovada_demo');
    expect(result.record.escola).toEqual(saved.record.escola);
    expect(result.record.criadoEm).toBe(saved.record.criadoEm);
  });

  it('acrescenta observações sem apagar as existentes e rejeita texto vazio ou falha de escrita', () => {
    const saved = service.save(input());
    if (saved.ok === false) throw new Error(saved.message);
    const id = saved.record.idLocal;
    expect(service.addObservation(id, '   ').ok).toBe(false);
    expect(service.addObservation(id, ' Primeiro comentário fictício ').ok).toBe(true);
    expect(service.addObservation(id, 'Segundo comentário fictício').ok).toBe(true);
    const before = data.get(DEMO_STORAGE_KEY);
    storage.setItem.mockImplementationOnce(() => {
      throw new Error('Quota exceeded');
    });
    expect(service.addObservation(id, 'Não pode aparecer como salvo').ok).toBe(false);
    expect(data.get(DEMO_STORAGE_KEY)).toBe(before);
    const reloaded = TestBed.runInInjectionContext(() => new SolicitacoesDemo());
    const result = reloaded.find(id);
    if (result.ok === false || !result.record) throw new Error('Record missing');
    expect(result.record.observacoesAdministrativas).toEqual([
      'Primeiro comentário fictício',
      'Segundo comentário fictício',
    ]);
  });

  it('adiciona exemplos somente por ação explícita e sem duplicar ou substituir dados anteriores', () => {
    const user = service.save(input());
    if (user.ok === false) throw new Error(user.message);
    expect(service.addExamples()).toEqual({ ok: true, added: 3 });
    const list = service.list();
    if (list.ok === false) throw new Error(list.message);
    expect(list.records).toHaveLength(4);
    expect(service.addExamples()).toEqual({ ok: true, added: 0 });
    expect(service.find(user.record.idLocal)).toEqual({ ok: true, record: user.record });
    const first = list.records[1];
    service.addObservation(first.idLocal, 'Preservar anotação fictícia');
    service.addExamples();
    const result = service.find(first.idLocal);
    if (result.ok === false || !result.record) throw new Error('Record missing');
    expect(result.record.observacoesAdministrativas).toContain('Preservar anotação fictícia');
  });

  it('recusa consulta e mutações de dados incompatíveis sem sobrescrevê-los', () => {
    const raw = '{"version":1,"records":[{}]}';
    data.set(DEMO_STORAGE_KEY, raw);
    const id = 'DEMO-00000000-0000-4000-8000-000000000001';
    expect(service.list().ok).toBe(false);
    expect(service.find(id).ok).toBe(false);
    expect(service.updateStatus(id, 'em_analise_demo').ok).toBe(false);
    expect(service.addObservation(id, 'Exemplo').ok).toBe(false);
    expect(service.addExamples().ok).toBe(false);
    expect(data.get(DEMO_STORAGE_KEY)).toBe(raw);
    expect(storage.setItem).not.toHaveBeenCalled();
  });
});
