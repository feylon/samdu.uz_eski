import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ApiLang, Lang } from '../../common/decorators/lang.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Paginated } from '../../common/dto/paginated.dto';
import { Locale } from '../../common/enums/locale.enum';
import { Role } from '../../common/enums/role.enum';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { CreateNewsDto } from './dto/create-news.dto';
import { LocalizedNewsDto } from './dto/news-response.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { News } from './entities/news.entity';
import { NewsService } from './news.service';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  @ApiLang()
  @ApiOperation({ summary: 'Chop etilgan yangiliklar (tanlangan tilda)' })
  @ApiPaginatedResponse(LocalizedNewsDto)
  findPublished(@Query() query: QueryNewsDto, @Lang() lang: Locale): Promise<Paginated<LocalizedNewsDto>> {
    return this.newsService.findPublished(query, lang);
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'Yangilik kategoriyalari' })
  @ApiOkResponse({ type: [String] })
  categories(): Promise<string[]> {
    return this.newsService.categories();
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Barcha yangiliklar (barcha tarjimalar bilan)' })
  @ApiPaginatedResponse(News)
  findAllAdmin(@Query() query: QueryNewsDto): Promise<Paginated<News>> {
    return this.newsService.findAllAdmin(query);
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Yangilik (barcha tarjimalar bilan)' })
  @ApiOkResponse({ type: News })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<News> {
    return this.newsService.findOne(id);
  }

  @Public()
  @Get(':slug')
  @ApiLang()
  @ApiOperation({ summary: 'Yangilik slug bo\'yicha' })
  @ApiOkResponse({ type: LocalizedNewsDto })
  findBySlug(@Param('slug') slug: string, @Lang() lang: Locale): Promise<LocalizedNewsDto> {
    return this.newsService.findPublishedBySlug(slug, lang);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Yangilik yaratish' })
  @ApiCreatedResponse({ type: News })
  create(@Body() dto: CreateNewsDto, @CurrentUser() user: AuthUser): Promise<News> {
    return this.newsService.create(dto, user);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Yangilikni tahrirlash' })
  @ApiOkResponse({ type: News })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateNewsDto): Promise<News> {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Yangilikni o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.newsService.remove(id);
  }
}
