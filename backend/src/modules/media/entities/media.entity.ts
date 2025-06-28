import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { AppBaseEntity } from '../../../common/entities/app-base.entity';
import { User } from '../../users/entities/user.entity';

@Entity('media')
export class Media extends AppBaseEntity {
  @ApiProperty({ example: '2025/06/0f8c7c1e.jpg' })
  @Column({ type: 'varchar', length: 300 })
  filename: string;

  @ApiProperty({ example: 'rektor.jpg' })
  @Column({ name: 'original_name', type: 'varchar', length: 300 })
  originalName: string;

  @ApiProperty({ example: 'image/jpeg' })
  @Column({ name: 'mime_type', type: 'varchar', length: 120 })
  mimeType: string;

  @ApiProperty({ example: 204800 })
  @Column({ type: 'int' })
  size: number;

  @ApiProperty({ example: '/uploads/2025/06/0f8c7c1e.jpg' })
  @Column({ type: 'varchar', length: 500 })
  url: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'uploaded_by' })
  uploadedBy: User | null;
}
