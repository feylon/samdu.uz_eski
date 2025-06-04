import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { Announcement } from './announcement.entity';

@Entity('announcement_translations')
@Unique('UQ_announcement_translation_locale', ['announcement', 'locale'])
export class AnnouncementTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 300 })
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 300, nullable: true })
  location: string | null;

  @ManyToOne(() => Announcement, (announcement) => announcement.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'announcement_id' })
  announcement: Announcement;
}
