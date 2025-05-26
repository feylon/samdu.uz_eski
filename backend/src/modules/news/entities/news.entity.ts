import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { User } from '../../users/entities/user.entity';
import { NewsTranslation } from './news-translation.entity';

@Entity('news')
export class News extends AppBaseEntity {
  @ApiProperty({ example: 'samdu-xalqaro-reytingda' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200 })
  slug: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string | null;

  @ApiProperty({ example: 'university' })
  @Index()
  @Column({ type: 'varchar', length: 50, default: 'general' })
  category: string;

  @ApiProperty()
  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @ApiProperty()
  @Column({ name: 'is_featured', type: 'boolean', default: false })
  isFeatured: boolean;

  @ApiProperty()
  @Column({ type: 'int', default: 0 })
  views: number;

  @ApiProperty()
  @Index()
  @Column({ name: 'published_at', type: 'timestamptz', default: () => 'now()' })
  publishedAt: Date;

  @ApiProperty({ type: () => [NewsTranslation] })
  @OneToMany(() => NewsTranslation, (translation) => translation.news, { cascade: true })
  translations: NewsTranslation[];

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'author_id' })
  author: User | null;
}
