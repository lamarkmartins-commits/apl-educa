import { createRequestForm, mockRequestValues, requestInput } from './request-form';

describe('Formulário de solicitação demonstrativa', () => {
  it('valida cada etapa, incluindo texto não vazio e e-mails opcionais quando informados', () => {
    const form = createRequestForm();
    expect(form.controls.escola.invalid).toBe(true);
    form.reset(mockRequestValues());
    expect(form.valid).toBe(true);
    form.controls.escola.controls.nome.setValue('   ');
    expect(form.controls.escola.invalid).toBe(true);
    form.controls.escola.controls.nome.setValue('Exemplo');
    form.controls.escola.controls.contatoEmail.setValue('invalido');
    expect(form.controls.escola.controls.contatoEmail.hasError('email')).toBe(true);
    form.controls.responsavel.controls.email.setValue('invalido');
    expect(form.controls.responsavel.invalid).toBe(true);
  });

  it('aceita apenas inteiros positivos e não bloqueia grupos maiores ou datas por antecedência', () => {
    const form = createRequestForm();
    form.reset(mockRequestValues());
    for (const value of [0, -1, 2.5, Infinity]) {
      form.controls.visita.controls.quantidade.setValue(value);
      expect(form.controls.visita.invalid).toBe(true);
    }
    form.controls.visita.patchValue({ quantidade: 75, dataPreferida: '2026-10-23' });
    expect(form.valid).toBe(true);
    form.controls.visita.controls.dataPreferida.setValue('2026-02-30');
    expect(form.controls.visita.invalid).toBe(true);
  });

  it('gera um resumo fiel sem completar dados opcionais ou inventar disponibilidade', () => {
    const form = createRequestForm();
    form.reset(mockRequestValues());
    form.controls.escola.controls.nome.setValue(' Escola Exemplo ');
    const value = requestInput(form);
    expect(value.escola.nome).toBe('Escola Exemplo');
    expect(value.dataPreferida).toBe('2026-10-23');
    expect(value.quantidadeAcompanhantes).toBe(2);
    expect(value.responsavel.telefone).toBe('(00) 00000-0000');
    expect(value.quantidadeEstudantes).toBe(25);
    expect(value.responsavel.email).toBe('responsavel@example.com');
  });

  it('exige os dados da política para novas entradas e rejeita horário fora da visitação', () => {
    const form = createRequestForm();
    form.reset(mockRequestValues());
    form.controls.responsavel.controls.telefone.setValue('  ');
    expect(form.controls.responsavel.invalid).toBe(true);
    form.reset(mockRequestValues());
    for (const field of ['turma', 'dataPreferida', 'turnoPreferido'] as const) {
      form.controls.visita.controls[field].setValue('');
      expect(form.controls.visita.controls[field].hasError('required')).toBe(true);
      form.reset(mockRequestValues());
    }
    form.controls.visita.controls.acompanhantes.setValue(null);
    expect(form.controls.visita.invalid).toBe(true);
    form.controls.visita.controls.acompanhantes.setValue(0);
    expect(form.valid).toBe(true);
    expect(requestInput(form).quantidadeAcompanhantes).toBe(0);
    form.controls.visita.controls.turnoPreferido.setValue('15:00');
    expect(form.controls.visita.controls.turnoPreferido.hasError('visitingHours')).toBe(true);
  });
});
