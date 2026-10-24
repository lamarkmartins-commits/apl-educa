import { ValidatorFn } from '@angular/forms';
import { isCalendarDate } from '../../shared/utils/calendar-date';

/** Política publicada pela APL e incorporada na seção 18 da especificação. */
export const visitPolicy = {
  source: 'https://aplpb.com.br/visitacao/',
  email: 'academiadeletraspb@gmail.com',
  opening: '08:00',
  closing: '12:00',
  idealStudents: 50,
} as const;

export const visitDate: ValidatorFn = ({ value }) => {
  if (!value) return null; // Obrigatoriedade é declarada pelo formulário.
  if (!isCalendarDate(value)) return { date: true };
  const day = new Date(`${value}T12:00:00Z`).getUTCDay();
  return day === 0 || day === 6 ? { weekday: true } : null;
};

export function isVisitingTime(value: string): boolean {
  return (
    /^\d{2}:\d{2}$/.test(value) &&
    value >= visitPolicy.opening &&
    value <= visitPolicy.closing &&
    Number(value.slice(3)) < 60
  );
}

export function isVisitingDate(value: string): boolean {
  if (!isCalendarDate(value)) return false;
  const day = new Date(`${value}T12:00:00Z`).getUTCDay();
  return day !== 0 && day !== 6;
}

export const visitTime: ValidatorFn = ({ value }) => {
  if (!value) return null;
  return typeof value === 'string' && isVisitingTime(value) ? null : { visitingHours: true };
};

export const accompanyingCount: ValidatorFn = ({ value }) =>
  value === null || (Number.isSafeInteger(value) && value >= 0)
    ? null
    : { nonNegativeInteger: true };
