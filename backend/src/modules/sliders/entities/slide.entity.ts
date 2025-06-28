import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { SlideTranslation } from './slide-translation.entity';

@Entity('slides')
export class Slide extends AppBaseEntity {
  @ApiProperty({ example: '/images/hero-1.svg' })
  @Column({ type: 'varchar', length: 500 })
  image: string;

  @ApiPropertyOptional({ type: String, nullable: true, example: '/news' })
  @Column({ type: 'varchar', length: 500, nullable: true })
  link: string | null;

  @ApiProperty()
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ApiProperty()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ type: () => [SlideTranslation] })
  @OneToMany(() => SlideTranslation, (translation) => translation.slide, { cascade: true })
  translations: SlideTranslation[];
}
