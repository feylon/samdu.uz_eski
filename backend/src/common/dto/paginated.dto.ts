import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total: number;

  @ApiProperty()
  totalPages: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMetaDto;
}

export const paginate = <T>(items: T[], total: number, page: number, limit: number): Paginated<T> => ({
  items,
  meta: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
});
