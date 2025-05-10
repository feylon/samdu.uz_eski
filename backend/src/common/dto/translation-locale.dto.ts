import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { Locale } from '../enums/locale.enum';

export class TranslationLocaleDto {
  @ApiProperty({ enum: Locale, example: Locale.UZ })
  @IsEnum(Locale)
  locale: Locale;
}
