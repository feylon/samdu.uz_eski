import { ApiProperty } from '@nestjs/swagger';

export class FacultyStatsDto {
  @ApiProperty()
  faculties: number;

  @ApiProperty()
  departments: number;

  @ApiProperty()
  students: number;
}
