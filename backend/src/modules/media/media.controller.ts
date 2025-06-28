import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-response.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { Paginated } from '../../common/dto/paginated.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Role } from '../../common/enums/role.enum';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { UploadMediaDto } from './dto/upload-media.dto';
import { Media } from './entities/media.entity';
import { MediaService } from './media.service';

@ApiTags('Media')
@ApiBearerAuth()
@Roles(Role.ADMIN, Role.EDITOR)
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMediaDto })
  @ApiOperation({ summary: 'Fayl yuklash (rasm, PDF, Word, Excel)' })
  @ApiCreatedResponse({ type: Media })
  upload(@UploadedFile() file: Express.Multer.File | undefined, @CurrentUser() user: AuthUser): Promise<Media> {
    if (!file) throw new BadRequestException('Fayl yuborilmadi');
    return this.mediaService.save(file, user);
  }

  @Get()
  @ApiOperation({ summary: 'Yuklangan fayllar' })
  @ApiPaginatedResponse(Media)
  findAll(@Query() query: PaginationQueryDto): Promise<Paginated<Media>> {
    return this.mediaService.findAll(query);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Faylni o\'chirish' })
  @ApiNoContentResponse()
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.mediaService.remove(id);
  }
}
