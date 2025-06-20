import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { Locale } from '../../../common/enums/locale.enum';
import { MenuLocation } from '../../../common/enums/menu-location.enum';

export class QueryMenuDto {
  @ApiPropertyOptional({ enum: MenuLocation, default: MenuLocation.HEADER })
  @IsOptional()
  @IsEnum(MenuLocation)
  location?: MenuLocation;

  @ApiPropertyOptional({ enum: Locale })
  @IsOptional()
  @IsEnum(Locale)
  lang?: Locale;
}
