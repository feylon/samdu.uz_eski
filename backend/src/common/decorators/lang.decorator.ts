import { applyDecorators, createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ApiHeader, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';
import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from '../enums/locale.enum';

export const resolveLocale = (value?: unknown): Locale | undefined => {
  if (typeof value !== 'string') return undefined;
  const code = value.trim().slice(0, 2).toLowerCase() as Locale;
  return SUPPORTED_LOCALES.includes(code) ? code : undefined;
};

export const Lang = createParamDecorator((_data: unknown, ctx: ExecutionContext): Locale => {
  const request = ctx.switchToHttp().getRequest<Request>();
  return (
    resolveLocale(request.query.lang) ??
    resolveLocale(request.headers['accept-language']) ??
    DEFAULT_LOCALE
  );
});

export const ApiLang = () =>
  applyDecorators(
    ApiQuery({ name: 'lang', enum: Locale, required: false, description: 'Kontent tili' }),
    ApiHeader({ name: 'Accept-Language', required: false, description: 'uz | ru | en' }),
  );
