import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiLang, Lang } from '../../common/decorators/lang.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Locale } from '../../common/enums/locale.enum';
import { Role } from '../../common/enums/role.enum';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { CreateDepartmentDto, UpdateDepartmentDto } from './dto/department.dto';
import { LocalizedFacultyDto } from './dto/faculty-response.dto';
import { FacultyStatsDto } from './dto/faculty-stats.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { Department } from './entities/department.entity';
import { Faculty } from './entities/faculty.entity';
import { FacultiesService } from './faculties.service';

@ApiTags('Faculties')
@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Public()
  @Get()
  @ApiLang()
  @ApiOperation({ summary: 'Faol fakultetlar ro\'yxati' })
  @ApiOkResponse({ type: [LocalizedFacultyDto] })
  findActive(@Lang() lang: Locale): Promise<LocalizedFacultyDto[]> {
    return this.facultiesService.findActive(lang);
  }

  @Public()
  @Get('stats')
  @ApiOperation({ summary: 'Fakultet, kafedra va talabalar statistikasi' })
  @ApiOkResponse({ type: FacultyStatsDto })
  stats(): Promise<FacultyStatsDto> {
    return this.facultiesService.stats();
  }

  @Get('admin')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Barcha fakultetlar (tarjimalar bilan)' })
  @ApiOkResponse({ type: [Faculty] })
  findAllAdmin(): Promise<Faculty[]> {
    return this.facultiesService.findAllAdmin();
  }

  @Get('admin/:id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Fakultet (tarjimalar bilan)' })
  @ApiOkResponse({ type: Faculty })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Faculty> {
    return this.facultiesService.findOne(id);
  }

  @Public()
  @Get(':slug')
  @ApiLang()
  @ApiOperation({ summary: 'Fakultet va kafedralari slug bo\'yicha' })
  @ApiOkResponse({ type: LocalizedFacultyDto })
  findBySlug(@Param('slug') slug: string, @Lang() lang: Locale): Promise<LocalizedFacultyDto> {
    return this.facultiesService.findActiveBySlug(slug, lang);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Fakultet yaratish' })
  @ApiCreatedResponse({ type: Faculty })
  create(@Body() dto: CreateFacultyDto): Promise<Faculty> {
    return this.facultiesService.create(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Fakultetni tahrirlash' })
  @ApiOkResponse({ type: Faculty })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateFacultyDto): Promise<Faculty> {
    return this.facultiesService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Fakultetni o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.facultiesService.remove(id);
  }

  @Post(':id/departments')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Fakultetga kafedra qo\'shish' })
  @ApiCreatedResponse({ type: Department })
  addDepartment(@Param('id', ParseUUIDPipe) id: string, @Body() dto: CreateDepartmentDto): Promise<Department> {
    return this.facultiesService.addDepartment(id, dto);
  }

  @Patch('departments/:departmentId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN, Role.EDITOR)
  @ApiOperation({ summary: 'Kafedrani tahrirlash' })
  @ApiOkResponse({ type: Department })
  updateDepartment(
    @Param('departmentId', ParseUUIDPipe) departmentId: string,
    @Body() dto: UpdateDepartmentDto,
  ): Promise<Department> {
    return this.facultiesService.updateDepartment(departmentId, dto);
  }

  @Delete('departments/:departmentId')
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Kafedrani o\'chirish' })
  @ApiNoContentResponse()
  removeDepartment(@Param('departmentId', ParseUUIDPipe) departmentId: string): Promise<void> {
    return this.facultiesService.removeDepartment(departmentId);
  }
}
