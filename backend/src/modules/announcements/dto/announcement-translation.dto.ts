import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TranslationLocaleDto } from '../../../common/dto/translation-locale.dto';

export class AnnouncementTranslationDto extends TranslationLocaleDto {
  @ApiProperty({ example: 'Xalqaro ilmiy-amaliy konferensiya' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @ApiProperty({ example: '<p>E\'lon matni</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({ example: 'Bosh bino, 1-qavat, majlislar zali' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  location?: string;
}
