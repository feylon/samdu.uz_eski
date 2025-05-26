import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Locale } from '../../../common/enums/locale.enum';

export class LocalizedNewsDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: Locale })
  locale: Locale;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  summary: string | null;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  coverImage: string | null;

  @ApiProperty()
  category: string;

  @ApiProperty()
  isFeatured: boolean;

  @ApiProperty()
  views: number;

  @ApiProperty()
  publishedAt: Date;

  @ApiProperty({ enum: Locale, isArray: true })
  availableLocales: Locale[];
}
