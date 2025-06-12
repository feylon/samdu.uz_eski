import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { TranslationLocaleDto } from '../../../common/dto/translation-locale.dto';

export class DepartmentTranslationDto extends TranslationLocaleDto {
  @ApiProperty({ example: 'Algebra va geometriya kafedrasi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(200)
  headName?: string;
}

export class CreateDepartmentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsInt()
  sortOrder?: number;

  @ApiProperty({ type: [DepartmentTranslationDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DepartmentTranslationDto)
  translations: DepartmentTranslationDto[];
}

export class UpdateDepartmentDto extends PartialType(CreateDepartmentDto) {}
