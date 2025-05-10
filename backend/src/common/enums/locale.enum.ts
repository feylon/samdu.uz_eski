export enum Locale {
  UZ = 'uz',
  RU = 'ru',
  EN = 'en',
}

export const DEFAULT_LOCALE = Locale.UZ;

export const SUPPORTED_LOCALES: Locale[] = Object.values(Locale);
