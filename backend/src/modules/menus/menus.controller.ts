import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiLang, Lang } from '../../common/decorators/lang.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Locale } from '../../common/enums/locale.enum';
import { MenuLocation } from '../../common/enums/menu-location.enum';
import { Role } from '../../common/enums/role.enum';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuTreeItemDto } from './dto/menu-tree.dto';
import { QueryMenuDto } from './dto/query-menu.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItem } from './entities/menu-item.entity';
import { MenusService } from './menus.service';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Public()
  @Get()
  @ApiLang()
  @ApiOperation({ summary: 'Ko\'p darajali menyu daraxti (tanlangan tilda)' })
  @ApiOkResponse({ type: [MenuTreeItemDto] })
  tree(@Query() query: QueryMenuDto, @Lang() lang: Locale): Promise<MenuTreeItemDto[]> {
    return this.menusService.tree(query.location ?? MenuLocation.HEADER, lang);
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Barcha menyu elementlari (tarjimalar bilan)' })
  @ApiOkResponse({ type: [MenuItem] })
  findAllAdmin(@Query() query: QueryMenuDto): Promise<MenuItem[]> {
    return this.menusService.findAllAdmin(query.location);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menyu elementi yaratish' })
  @ApiCreatedResponse({ type: MenuItem })
  create(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menusService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Menyu elementini tahrirlash' })
  @ApiOkResponse({ type: MenuItem })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateMenuItemDto): Promise<MenuItem> {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Menyu elementini (va ichki elementlarini) o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.menusService.remove(id);
  }
}
