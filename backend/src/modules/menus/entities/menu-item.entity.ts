import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { MenuLocation } from '../../../common/enums/menu-location.enum';
import { MenuItemTranslation } from './menu-item-translation.entity';

@Entity('menu_items')
export class MenuItem extends AppBaseEntity {
  @ApiProperty({ enum: MenuLocation })
  @Index()
  @Column({ type: 'varchar', length: 20, default: MenuLocation.HEADER })
  location: MenuLocation;

  @ApiPropertyOptional({ type: String, nullable: true, example: '/news' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  url: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'graduation-cap' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;

  @ApiProperty()
  @Column({ name: 'is_external', type: 'boolean', default: false })
  isExternal: boolean;

  @ApiProperty()
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ApiProperty()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiPropertyOptional({ type: String, nullable: true, format: 'uuid' })
  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId: string | null;

  @ManyToOne(() => MenuItem, (item) => item.children, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'parent_id' })
  parent: MenuItem | null;

  @OneToMany(() => MenuItem, (item) => item.parent)
  children: MenuItem[];

  @ApiProperty({ type: () => [MenuItemTranslation] })
  @OneToMany(() => MenuItemTranslation, (translation) => translation.menuItem, { cascade: true })
  translations: MenuItemTranslation[];
}
