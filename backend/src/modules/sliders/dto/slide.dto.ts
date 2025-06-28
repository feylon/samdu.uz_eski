import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TranslationLocaleDto } from '../../../common/dto/translation-locale.dto';
import { Locale } from '../../../common/enums/locale.enum';

export class SlideTranslationDto extends TranslationLocaleDto {
  @ApiProperty({ example: 'Samarqand davlat universiteti' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  title: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  subtitle?: string;

  @ApiPropertyOptional({ example: 'Batafsil' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  buttonText?: string;
}

export class CreateSlideDto {
  @ApiProperty({ example: '/uploads/2025/06/hero.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  image: string;

  @ApiPropertyOptional({ example: '/about' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  link?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [SlideTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SlideTranslationDto)
  translations: SlideTranslationDto[];
}

export class UpdateSlideDto extends PartialType(CreateSlideDto) {}

export class LocalizedSlideDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty({ enum: Locale })
  locale: Locale;

  @ApiProperty()
  image: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  link: string | null;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  subtitle: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  buttonText: string | null;
}
