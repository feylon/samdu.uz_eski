import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { AnnouncementType } from '../../../common/enums/announcement-type.enum';
import { AnnouncementTranslation } from './announcement-translation.entity';

@Entity('announcements')
export class Announcement extends AppBaseEntity {
  @ApiProperty()
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 200 })
  slug: string;

  @ApiProperty({ enum: AnnouncementType })
  @Index()
  @Column({ type: 'varchar', length: 30, default: AnnouncementType.NOTICE })
  type: AnnouncementType;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'cover_image', type: 'varchar', length: 500, nullable: true })
  coverImage: string | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @Column({ name: 'event_date', type: 'timestamptz', nullable: true })
  eventDate: Date | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  deadline: Date | null;

  @ApiProperty()
  @Column({ name: 'is_pinned', type: 'boolean', default: false })
  isPinned: boolean;

  @ApiProperty()
  @Column({ name: 'is_published', type: 'boolean', default: true })
  isPublished: boolean;

  @ApiProperty()
  @Index()
  @Column({ name: 'published_at', type: 'timestamptz', default: () => 'now()' })
  publishedAt: Date;

  @ApiProperty({ type: () => [AnnouncementTranslation] })
  @OneToMany(() => AnnouncementTranslation, (translation) => translation.announcement, { cascade: true })
  translations: AnnouncementTranslation[];
}
