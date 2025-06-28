import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiLang, Lang } from '../../common/decorators/lang.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Locale } from '../../common/enums/locale.enum';
import { Role } from '../../common/enums/role.enum';
import { CreateSlideDto, LocalizedSlideDto, UpdateSlideDto } from './dto/slide.dto';
import { Slide } from './entities/slide.entity';
import { SlidersService } from './sliders.service';

@ApiTags('Sliders')
@Controller('sliders')
export class SlidersController {
  constructor(private readonly slidersService: SlidersService) {}

  @Public()
  @Get()
  @ApiLang()
  @ApiOperation({ summary: 'Bosh sahifa hero slayderi' })
  @ApiOkResponse({ type: [LocalizedSlideDto] })
  findActive(@Lang() lang: Locale): Promise<LocalizedSlideDto[]> {
    return this.slidersService.findActive(lang);
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Barcha slaydlar (tarjimalar bilan)' })
  @ApiOkResponse({ type: [Slide] })
  findAllAdmin(): Promise<Slide[]> {
    return this.slidersService.findAllAdmin();
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Slayd yaratish' })
  @ApiCreatedResponse({ type: Slide })
  create(@Body() dto: CreateSlideDto): Promise<Slide> {
    return this.slidersService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Slaydni tahrirlash' })
  @ApiOkResponse({ type: Slide })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateSlideDto): Promise<Slide> {
    return this.slidersService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Slaydni o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.slidersService.remove(id);
  }
}
