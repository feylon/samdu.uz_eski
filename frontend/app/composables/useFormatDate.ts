const INTL_LOCALES: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-GB',
};

const UZ_MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr'];
const UZ_MONTHS_SHORT = ['yan', 'fev', 'mar', 'apr', 'may', 'iyn', 'iyl', 'avg', 'sen', 'okt', 'noy', 'dek'];
const TIME_ZONE = 'Asia/Samarkand';

const parts = (date: Date) => {
  const values = new Intl.DateTimeFormat('en-GB', {
    timeZone: TIME_ZONE,
    day: '2-digit',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);
  const get = (type: string) => values.find((item) => item.type === type)?.value ?? '';
  return { day: get('day'), month: Number(get('month')) - 1, year: get('year'), hour: get('hour'), minute: get('minute') };
};

export function useFormatDate() {
  const { locale } = useI18n();

  const toDate = (value: string | Date | null | undefined) => (value ? (typeof value === 'string' ? new Date(value) : value) : null);
  const intl = (date: Date, options: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat(INTL_LOCALES[locale.value] ?? 'en-GB', { timeZone: TIME_ZONE, ...options }).format(date);

  const formatDate = (value: string | Date | null | undefined) => {
    const date = toDate(value);
    if (!date) return '';
    if (locale.value !== 'uz') return intl(date, { day: 'numeric', month: 'long', year: 'numeric' });
    const p = parts(date);
    return `${Number(p.day)}-${UZ_MONTHS[p.month]}, ${p.year}-yil`;
  };

  const formatDateTime = (value: string | Date | null | undefined) => {
    const date = toDate(value);
    if (!date) return '';
    const p = parts(date);
    return `${formatDate(date)}, ${p.hour}:${p.minute}`;
  };

  const dayAndMonth = (value: string | Date | null | undefined) => {
    const date = toDate(value);
    if (!date) return { day: '', month: '' };
    const p = parts(date);
    const month = locale.value === 'uz' ? UZ_MONTHS_SHORT[p.month]! : intl(date, { month: 'short' }).replace('.', '');
    return { day: p.day, month };
  };

  return { formatDate, formatDateTime, dayAndMonth };
}
