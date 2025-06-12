import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { DepartmentTranslation } from './department-translation.entity';
import { Faculty } from './faculty.entity';

@Entity('departments')
export class Department extends AppBaseEntity {
  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 50, nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ type: String, nullable: true })
  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string | null;

  @ApiProperty()
  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @ManyToOne(() => Faculty, (faculty) => faculty.departments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'faculty_id' })
  faculty: Faculty;

  @ApiProperty({ type: () => [DepartmentTranslation] })
  @OneToMany(() => DepartmentTranslation, (translation) => translation.department, { cascade: true })
  translations: DepartmentTranslation[];
}
