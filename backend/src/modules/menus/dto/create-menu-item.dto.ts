import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TranslationLocaleDto } from '../../../common/dto/translation-locale.dto';
import { MenuLocation } from '../../../common/enums/menu-location.enum';

export class MenuItemTranslationDto extends TranslationLocaleDto {
  @ApiProperty({ example: 'Universitet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;
}

export class CreateMenuItemDto {
  @ApiPropertyOptional({ enum: MenuLocation, default: MenuLocation.HEADER })
  @IsOptional()
  @IsEnum(MenuLocation)
  location?: MenuLocation;

  @ApiPropertyOptional({ example: '/about' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  url?: string;

  @ApiPropertyOptional({ example: 'building-2' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  icon?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isExternal?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  @IsUUID()
  parentId?: string | null;

  @ApiProperty({ type: [MenuItemTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => MenuItemTranslationDto)
  translations: MenuItemTranslationDto[];
}
