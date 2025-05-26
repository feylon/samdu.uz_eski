import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { News } from './news.entity';

@Entity('news_translations')
@Unique('UQ_news_translation_locale', ['news', 'locale'])
export class NewsTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 300 })
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @ApiProperty()
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => News, (news) => news.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'news_id' })
  news: News;
}
