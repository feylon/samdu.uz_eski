import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { Faculty } from './faculty.entity';

@Entity('faculty_translations')
@Unique('UQ_faculty_translation_locale', ['faculty', 'locale'])
export class FacultyTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'short_description', type: 'varchar', length: 500, nullable: true })
  shortDescription: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'dean_name', type: 'varchar', length: 200, nullable: true })
  deanName: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 300, nullable: true })
  address: string | null;

  @ManyToOne(() => Faculty, (faculty) => faculty.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;
}
