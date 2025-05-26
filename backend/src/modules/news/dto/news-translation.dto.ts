import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TranslationLocaleDto } from '../../../common/dto/translation-locale.dto';

export class NewsTranslationDto extends TranslationLocaleDto {
  @ApiProperty({ example: 'SamDU xalqaro reytingda yangi pog\'onaga ko\'tarildi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  title: string;

  @ApiPropertyOptional({ example: 'Qisqacha mazmun' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  summary?: string;

  @ApiProperty({ example: '<p>Yangilik matni</p>' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
