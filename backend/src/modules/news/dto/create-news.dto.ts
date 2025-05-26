import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { NewsTranslationDto } from './news-translation.dto';

export class CreateNewsDto {
  @ApiPropertyOptional({ example: 'samdu-xalqaro-reytingda', description: 'Bo\'sh qolsa sarlavhadan yaratiladi' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
  slug?: string;

  @ApiPropertyOptional({ example: '/uploads/2025/cover.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  coverImage?: string;

  @ApiPropertyOptional({ example: 'university', default: 'general' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  @ApiPropertyOptional({ example: '2025-05-12T09:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiProperty({ type: [NewsTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => NewsTranslationDto)
  translations: NewsTranslationDto[];
}
