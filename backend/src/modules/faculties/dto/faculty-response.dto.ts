import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Locale } from '../../../common/enums/locale.enum';

export class LocalizedDepartmentDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  description: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  headName: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;
}

export class LocalizedFacultyDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  slug: string;

  @ApiProperty({ enum: Locale })
  locale: Locale;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  shortDescription: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  description?: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  deanName: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  address: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  image: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  icon: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  email: string | null;

  @ApiProperty()
  studentsCount: number;

  @ApiProperty()
  departmentsCount: number;

  @ApiPropertyOptional({ type: [LocalizedDepartmentDto] })
  departments?: LocalizedDepartmentDto[];
}
