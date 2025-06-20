import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItemTranslation } from './entities/menu-item-translation.entity';
import { MenuItem } from './entities/menu-item.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([MenuItem, MenuItemTranslation])],
  controllers: [MenusController],
  providers: [MenusService],
})
export class MenusModule {}
