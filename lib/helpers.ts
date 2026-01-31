import { differenceInDays, differenceInMonths, differenceInYears, format, isToday, isYesterday } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import i18n from './i18n';

export function getBabyAge(birthday: string): string {
  const t = i18n.t;
  const birth = new Date(birthday);
  const now = new Date();
  const days = differenceInDays(now, birth);
  const months = differenceInMonths(now, birth);
  const years = differenceInYears(now, birth);

  if (years >= 1) {
    return `${years} ${t('dashboard.years')}`;
  }
  if (months >= 1) {
    return `${months} ${t('dashboard.months')}`;
  }
  return `${days} ${t('dashboard.days')}`;
}

export function formatEventTime(dateStr: string): string {
  const date = new Date(dateStr);
  const locale = i18n.language === 'fr' ? fr : enUS;
  return format(date, 'HH:mm', { locale });
}

export function formatEventDate(dateStr: string): string {
  const date = new Date(dateStr);
  const t = i18n.t;

  if (isToday(date)) return t('common.today');
  if (isYesterday(date)) return t('common.yesterday');

  const locale = i18n.language === 'fr' ? fr : enUS;
  return format(date, 'dd MMM yyyy', { locale });
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  if (h > 0) return `${h}h`;
  return `${m}min`;
}

export function getLastEventOfType(events: { type: string; startTime: string }[], type: string): string | null {
  const filtered = events.filter((e) => e.type === type);
  if (filtered.length === 0) return null;
  return filtered[0].startTime;
}
