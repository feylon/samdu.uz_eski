import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { Slide } from './slide.entity';

@Entity('slide_translations')
@Unique('UQ_slide_translation_locale', ['slide', 'locale'])
export class SlideTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 250 })
  title: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  subtitle: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'button_text', type: 'varchar', length: 100, nullable: true })
  buttonText: string | null;

  @ManyToOne(() => Slide, (slide) => slide.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'slide_id' })
  slide: Slide;
}
