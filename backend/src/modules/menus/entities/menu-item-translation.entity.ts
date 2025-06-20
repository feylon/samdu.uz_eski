import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { TranslationBaseEntity } from '../../../common/entities/translation-base.entity';
import { MenuItem } from './menu-item.entity';

@Entity('menu_item_translations')
@Unique('UQ_menu_item_translation_locale', ['menuItem', 'locale'])
export class MenuItemTranslation extends TranslationBaseEntity {
  @ApiProperty()
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ManyToOne(() => MenuItem, (item) => item.translations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;
}
