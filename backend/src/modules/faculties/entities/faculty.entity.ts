import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { Department } from './department.entity';
import { FacultyTranslation } from './faculty-translation.entity';

@Entity('faculties')
export class Faculty extends AppBaseEntity {
  @ApiProperty({ example: 'matematika' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  slug: string;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  image: string | null;

  @ApiPropertyOptional({ type: String, nullable: true, example: 'sigma' })
  @Column({ type: 'varchar', length: 50, nullable: true })
  icon: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @ApiProperty()
  @Column({ name: 'students_count', type: 'int', default: 0 })
  studentsCount: number;

  @ApiProperty()
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ApiProperty()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiProperty({ type: () => [FacultyTranslation] })
  @OneToMany(() => FacultyTranslation, (translation) => translation.faculty, { cascade: true })
  translations: FacultyTranslation[];

  @ApiProperty({ type: () => [Department] })
  @OneToMany(() => Department, (department) => department.faculty)
  departments: Department[];
}
