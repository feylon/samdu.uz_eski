import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { Role } from '../../../common/enums/role.enum';

@Entity('users')
export class User extends AppBaseEntity {
  @ApiProperty({ example: 'editor@samdu.uz' })
  @Index({ unique: true })
  @Column({ type: 'varchar', length: 150 })
  email: string;

  @Exclude()
  @Column({ type: 'varchar', length: 200, select: false })
  password: string;

  @ApiProperty({ example: 'Aliyev Vali' })
  @Column({ name: 'full_name', type: 'varchar', length: 150 })
  fullName: string;

  @ApiProperty({ enum: Role })
  @Column({ type: 'varchar', length: 20, default: Role.EDITOR })
  role: Role;

  @ApiProperty()
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @Column({ name: 'last_login_at', type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;
}
