import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class MenuTreeItemDto {
  @ApiProperty({ format: 'uuid' })
  id: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  url: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  icon: string | null;

  @ApiProperty()
  isExternal: boolean;

  @ApiProperty({ type: () => [MenuTreeItemDto] })
  children: MenuTreeItemDto[];
}
