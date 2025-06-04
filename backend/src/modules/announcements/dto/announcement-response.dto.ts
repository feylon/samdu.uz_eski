import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AnnouncementType } from '../../../common/enums/announcement-type.enum';
import { Locale } from '../../../common/enums/locale.enum';

export class LocalizedAnnouncementDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: Locale })
  locale: Locale;

  @ApiProperty({ enum: AnnouncementType })
  type: AnnouncementType;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  summary: string | null;

  @ApiPropertyOptional()
  content?: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  location: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  coverImage: string | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  eventDate: Date | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  deadline: Date | null;

  @ApiProperty()
  isPinned: boolean;

  @ApiProperty()
  publishedAt: Date;
}
