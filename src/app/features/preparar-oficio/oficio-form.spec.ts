import { createOficioForm } from './oficio-form';
import { formatDocumentDate, isCalendarDate, oficioParagraphs, OficioDraft } from './oficio-model';

export const sampleDraft: OficioDraft = {
  numero: '',
  escola: 'Escola Exemplo',
  tipo: '',
  cidade: 'Cidade Exemplo',
  dataDocumento: '2026-10-23',
  responsavel: 'Pessoa Exemplo',
  cargo: 'Docente',
  email: 'escola@example.com',
  telefone: '(00) 00000-0000',
  quantidade: 25,
  acompanhantes: 2,
  turma: '8º ano',
  dataPreferida: '2026-10-23',
  turno: '09:00',
  objetivo: 'Aproximar a turma da literatura paraibana.',
};

describe('Validação e texto do modelo de ofício', () => {
  it('exige acompanhantes, série/ano, data e horário sugeridos e telefone do responsável', () => {
    const form = createOficioForm();
    form.setValue(sampleDraft);
    for (const field of ['turma', 'dataPreferida', 'turno', 'telefone'] as const) {
      form.controls[field].setValue('');
      expect(form.controls[field].hasError('required')).toBe(true);
      form.setValue(sampleDraft);
    }
    form.controls.acompanhantes.setValue(null);
    expect(form.invalid).toBe(true);
    form.controls.acompanhantes.setValue(0);
    expect(form.valid).toBe(true);
    form.controls.turno.setValue('14:00');
    expect(form.controls.turno.hasError('visitingHours')).toBe(true);
  });
  it('rejeita campos vazios e exige telefone direto, mesmo com e-mail preenchido', () => {
    const form = createOficioForm();
    form.setValue({ ...sampleDraft, escola: '   ', email: '', telefone: '  ' });
    expect(form.controls.escola.hasError('required')).toBe(true);
    expect(form.controls.telefone.hasError('required')).toBe(true);
    form.patchValue({ escola: 'Escola Exemplo', telefone: '(00) 0000-0000' });
    expect(form.valid).toBe(true);
    form.patchValue({ email: 'email-invalido' });
    expect(form.controls.email.hasError('email')).toBe(true);
  });

  it('valida o total de estudantes e registra desmembramento para grupos acima de 50', () => {
    const form = createOficioForm();
    form.setValue(sampleDraft);
    for (const value of [0, -1, 1.5, Infinity]) {
      form.controls.quantidade.setValue(value);
      expect(form.controls.quantidade.hasError('integer')).toBe(true);
    }
    form.controls.quantidade.setValue(75);
    expect(form.valid).toBe(true);
    expect(oficioParagraphs({ ...sampleDraft, quantidade: 75 }).join(' ')).toContain(
      'deverá ser desmembrado',
    );
  });

  it('valida o calendário sem bloquear datas por antecedência e formata sem fuso horário', () => {
    expect(isCalendarDate('2026-02-30')).toBe(false);
    expect(isCalendarDate('2024-02-29')).toBe(true);
    expect(isCalendarDate('2026-02-29')).toBe(false);
    expect(formatDocumentDate('2026-01-01')).toBe('1 de janeiro de 2026');
    const form = createOficioForm();
    form.setValue({ ...sampleDraft, dataPreferida: sampleDraft.dataDocumento });
    expect(form.valid).toBe(true);
    form.controls.dataPreferida.setValue('2026-02-30');
    expect(form.controls.dataPreferida.hasError('date')).toBe(true);
  });

  it('não inventa número, data pretendida ou destinatário e inclui os dados opcionais quando fornecidos', () => {
    const text = oficioParagraphs({ ...sampleDraft, dataPreferida: '', turno: '' }).join('\n\n');
    expect(text).toContain('OFÍCIO\n\n');
    expect(text).not.toContain('OFÍCIO Nº');
    expect(text).not.toContain('preferencialmente');
    expect(text).toContain('conforme disponibilidade e confirmação');
    expect(text).toContain('Assinatura');
    const complete = oficioParagraphs({
      ...sampleDraft,
      numero: '12/2026',
      tipo: 'publica',
      turma: '8º ano',
      dataPreferida: '2026-11-02',
      turno: '09:00',
      telefone: '(00) 0000-0000',
    }).join('\n\n');
    expect(complete).toContain('OFÍCIO Nº 12/2026');
    expect(complete).toContain('(rede pública)');
    expect(complete).toContain('8º ano');
    expect(complete).toContain('2 de novembro de 2026, 09:00');
    expect(complete).toContain('2 professores/responsáveis acompanhantes');
    expect(complete).toContain('escola@example.com · (00) 0000-0000');
  });
});
