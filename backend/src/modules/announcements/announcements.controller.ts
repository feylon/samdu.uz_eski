import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { ApiLang, Lang } from '../../common/decorators/lang.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Paginated } from '../../common/dto/paginated.dto';
import { Locale } from '../../common/enums/locale.enum';
import { Role } from '../../common/enums/role.enum';
import { AnnouncementsService } from './announcements.service';
import { LocalizedAnnouncementDto } from './dto/announcement-response.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { Announcement } from './entities/announcement.entity';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Public()
  @Get()
  @ApiLang()
  @ApiOperation({ summary: 'Chop etilgan e\'lonlar (tanlangan tilda)' })
  @ApiPaginatedResponse(LocalizedAnnouncementDto)
  findPublished(
    @Query() query: QueryAnnouncementDto,
    @Lang() lang: Locale,
  ): Promise<Paginated<LocalizedAnnouncementDto>> {
    return this.announcementsService.findPublished(query, lang);
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Barcha e\'lonlar (barcha tarjimalar bilan)' })
  @ApiPaginatedResponse(Announcement)
  findAllAdmin(@Query() query: QueryAnnouncementDto): Promise<Paginated<Announcement>> {
    return this.announcementsService.findAllAdmin(query);
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'E\'lon (barcha tarjimalar bilan)' })
  @ApiOkResponse({ type: Announcement })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Announcement> {
    return this.announcementsService.findOne(id);
  }

  @Public()
  @Get(':slug')
  @ApiLang()
  @ApiOperation({ summary: 'E\'lon slug bo\'yicha' })
  @ApiOkResponse({ type: LocalizedAnnouncementDto })
  findBySlug(@Param('slug') slug: string, @Lang() lang: Locale): Promise<LocalizedAnnouncementDto> {
    return this.announcementsService.findPublishedBySlug(slug, lang);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'E\'lon yaratish' })
  @ApiCreatedResponse({ type: Announcement })
  create(@Body() dto: CreateAnnouncementDto): Promise<Announcement> {
    return this.announcementsService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'E\'lonni tahrirlash' })
  @ApiOkResponse({ type: Announcement })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateAnnouncementDto): Promise<Announcement> {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'E\'lonni o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.announcementsService.remove(id);
  }
}
