import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import {
  SolicitacaoDemoInput,
  SolicitacaoVisitaDemo,
  StatusDemo,
  DEMO_ID_PATTERN,
  demoTransitions,
  isDemoStatus,
  isSolicitacaoInput,
  isSolicitacaoRecord,
} from '../models/solicitacao-demo';
import { demoExamples } from '../models/demo-examples';
import { isVisitingDate, isVisitingTime } from '../models/visit-policy';

export const DEMO_STORAGE_KEY = 'apl-educa.solicitacoes-demo.v1';
type DemoFailure = { ok: false; message: string };
export type SaveDemoResult = { ok: true; record: SolicitacaoVisitaDemo } | DemoFailure;
export type ListDemoResult = { ok: true; records: SolicitacaoVisitaDemo[] } | DemoFailure;
export type FindDemoResult = { ok: true; record: SolicitacaoVisitaDemo | null } | DemoFailure;

@Injectable({ providedIn: 'root' })
export class SolicitacoesDemo {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  list(): ListDemoResult {
    if (!isPlatformBrowser(this.platformId))
      return { ok: false, message: 'Os registros locais estão disponíveis apenas no navegador.' };
    try {
      const raw = this.storage().getItem(DEMO_STORAGE_KEY);
      if (raw === null) return { ok: true, records: [] };
      let decoded: unknown;
      try {
        decoded = JSON.parse(raw);
      } catch {
        return this.incompatible();
      }
      if (
        !decoded ||
        typeof decoded !== 'object' ||
        !('version' in decoded) ||
        decoded.version !== 1 ||
        !('records' in decoded) ||
        !Array.isArray(decoded.records) ||
        !decoded.records.every(isSolicitacaoRecord)
      )
        return this.incompatible();
      const ids = decoded.records.map((record) => record.idLocal.toLowerCase());
      if (new Set(ids).size !== ids.length) return this.incompatible();
      return { ok: true, records: decoded.records };
    } catch {
      return this.failure();
    }
  }

  find(id: string): FindDemoResult {
    const code = id.trim();
    if (!DEMO_ID_PATTERN.test(code))
      return { ok: false, message: 'Informe um identificador local completo no formato DEMO-…' };
    const result = this.list();
    if (result.ok === false) return result;
    return {
      ok: true,
      record:
        result.records.find((record) => record.idLocal.toLowerCase() === code.toLowerCase()) ??
        null,
    };
  }

  save(input: SolicitacaoDemoInput): SaveDemoResult {
    // Leitura de registros legados permanece tolerante; as novas entradas seguem a seção 18.
    if (
      !isSolicitacaoInput(input) ||
      input.quantidadeAcompanhantes === undefined ||
      !input.responsavel.telefone?.trim() ||
      !input.turma.trim() ||
      !isVisitingDate(input.dataPreferida) ||
      !isVisitingTime(input.turnoPreferido)
    )
      return { ok: false, message: 'Confira os dados da demonstração antes de salvar.' };
    const result = this.list();
    if (result.ok === false) return result;
    try {
      const idLocal = 'DEMO-' + this.document.defaultView!.crypto.randomUUID();
      if (result.records.some((record) => record.idLocal.toLowerCase() === idLocal.toLowerCase()))
        return {
          ok: false,
          message: 'Não foi possível gerar um código local único. Tente novamente.',
        };
      const now = new Date().toISOString();
      const record: SolicitacaoVisitaDemo = {
        ...input,
        idLocal,
        status: 'registrada_localmente',
        criadoEm: now,
        atualizadoEm: now,
      };
      return this.commit([...result.records, record], record);
    } catch {
      return this.failure();
    }
  }

  updateStatus(id: string, next: StatusDemo): SaveDemoResult {
    return this.change(id, (record) => {
      if (!isDemoStatus(next) || !demoTransitions[record.status].includes(next))
        return {
          ok: false,
          message:
            'Essa mudança não está prevista no fluxo demonstrativo atual. Atualize os dados e confira os próximos estados permitidos.',
        };
      return { ok: true, record: { ...record, status: next } };
    });
  }

  addObservation(id: string, text: string): SaveDemoResult {
    const note = text.trim();
    if (!note)
      return { ok: false, message: 'Escreva uma observação demonstrativa antes de salvar.' };
    return this.change(id, (record) => ({
      ok: true,
      record: {
        ...record,
        observacoesAdministrativas: [...(record.observacoesAdministrativas ?? []), note],
      },
    }));
  }

  addExamples(): { ok: true; added: number } | DemoFailure {
    const result = this.list();
    if (result.ok === false) return result;
    const additions = demoExamples(new Date().toISOString()).filter(
      (example) =>
        !result.records.some(
          (record) => record.idLocal.toLowerCase() === example.idLocal.toLowerCase(),
        ),
    );
    if (!additions.length) return { ok: true, added: 0 };
    try {
      this.storage().setItem(
        DEMO_STORAGE_KEY,
        JSON.stringify({ version: 1, records: [...result.records, ...additions] }),
      );
      return { ok: true, added: additions.length };
    } catch {
      return this.failure();
    }
  }

  private change(
    id: string,
    operation: (record: SolicitacaoVisitaDemo) => SaveDemoResult,
  ): SaveDemoResult {
    const result = this.list();
    if (result.ok === false) return result;
    const existing = result.records.find(
      (record) => record.idLocal.toLowerCase() === id.trim().toLowerCase(),
    );
    if (!existing)
      return {
        ok: false,
        message: 'Registro não encontrado neste navegador. Atualize a listagem.',
      };
    const change = operation(existing);
    if (change.ok === false) return change;
    const record = { ...change.record, atualizadoEm: new Date().toISOString() };
    return this.commit(
      result.records.map((item) => (item.idLocal === existing.idLocal ? record : item)),
      record,
    );
  }

  private commit(records: SolicitacaoVisitaDemo[], record: SolicitacaoVisitaDemo): SaveDemoResult {
    try {
      this.storage().setItem(DEMO_STORAGE_KEY, JSON.stringify({ version: 1, records }));
      return { ok: true, record };
    } catch {
      return this.failure();
    }
  }

  private storage(): Storage {
    const storage = this.document.defaultView?.localStorage;
    if (!storage) throw new Error('Storage unavailable');
    return storage;
  }
  private failure(): DemoFailure {
    return {
      ok: false,
      message:
        'Não foi possível acessar ou salvar os dados no navegador. O armazenamento pode estar bloqueado ou sem espaço. Nada foi enviado à APL; seus campos foram mantidos para tentar novamente.',
    };
  }
  private incompatible(): DemoFailure {
    return {
      ok: false,
      message:
        'Os dados locais existentes estão ilegíveis ou em uma versão incompatível. Eles não foram sobrescritos. Use um perfil de teste separado ou solicite revisão desses dados antes de tentar novamente.',
    };
  }
}
