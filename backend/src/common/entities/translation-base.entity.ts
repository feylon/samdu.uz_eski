import { Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Locale } from '../enums/locale.enum';

export abstract class TranslationBaseEntity {
  @ApiProperty({ format: 'uuid' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ enum: Locale })
  @Column({ type: 'varchar', length: 2 })
  locale: Locale;
}
