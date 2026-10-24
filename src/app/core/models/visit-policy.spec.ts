import { FormControl, Validators } from '@angular/forms';
import { accompanyingCount, visitDate, visitTime } from './visit-policy';

describe('Política de visitação — seção 18', () => {
  it('aceita dias úteis, sem inventar disponibilidade ou bloquear por antecedência', () => {
    const control = new FormControl('2026-10-23', [Validators.required, visitDate]);
    expect(control.valid).toBe(true);
    for (const value of ['2026-10-24', '2026-10-25']) {
      control.setValue(value);
      expect(control.hasError('weekday')).toBe(true);
    }
    control.setValue('2026-02-30');
    expect(control.hasError('date')).toBe(true);
    control.setValue('');
    expect(control.hasError('required')).toBe(true);
  });

  it('valida os horários publicados sem impor intervalos ou duração não especificados', () => {
    const control = new FormControl('', [Validators.required, visitTime]);
    for (const value of ['08:00', '09:17', '12:00']) {
      control.setValue(value);
      expect(control.valid).toBe(true);
    }
    for (const value of ['07:59', '12:01', '14:00', '09:60', '9:00', 'Manhã']) {
      control.setValue(value);
      expect(control.hasError('visitingHours')).toBe(true);
    }
  });

  it('exige o total de acompanhantes sem inventar uma proporção mínima por aluno', () => {
    const control = new FormControl<number | null>(null, [Validators.required, accompanyingCount]);
    expect(control.hasError('required')).toBe(true);
    for (const value of [0, 1, 4]) {
      control.setValue(value);
      expect(control.valid).toBe(true);
    }
    for (const value of [-1, 1.5, Infinity]) {
      control.setValue(value);
      expect(control.hasError('nonNegativeInteger')).toBe(true);
    }
  });
});
