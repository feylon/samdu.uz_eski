import { DEFAULT_LOCALE, Locale } from '../enums/locale.enum';

export const pickTranslation = <T extends { locale: Locale }>(
  translations: T[] | undefined,
  locale: Locale,
): T | undefined => {
  const list = translations ?? [];
  return (
    list.find((item) => item.locale === locale) ??
    list.find((item) => item.locale === DEFAULT_LOCALE) ??
    list[0]
  );
};

export const mergeTranslations = <T extends { locale: Locale }>(
  existing: T[] | undefined,
  incoming: Partial<T>[],
  create: (data: Partial<T>) => T,
): T[] => {
  const result = [...(existing ?? [])];
  for (const data of incoming) {
    const current = result.find((item) => item.locale === data.locale);
    if (current) {
      Object.assign(current, data);
    } else {
      result.push(create(data));
    }
  }
  return result;
};

export const hasUniqueLocales = (translations: { locale: Locale }[]): boolean =>
  new Set(translations.map((item) => item.locale)).size === translations.length;
