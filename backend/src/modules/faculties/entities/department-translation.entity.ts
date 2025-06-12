import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { Department } from './department.entity';

@Entity('department_translations')
@Unique('UQ_department_translation_locale', ['department', 'locale'])
export class DepartmentTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 250 })
  name: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ name: 'head_name', type: 'varchar', length: 200, nullable: true })
  headName: string | null;

  @ManyToOne(() => Department, (department) => department.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'department_id' })
  department: Department;
}
