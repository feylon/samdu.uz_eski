import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { unlink } from 'fs/promises';
import { join, relative, resolve } from 'path';
import { Repository } from 'typeorm';
import { paginate, Paginated } from '../../common/dto/paginated.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { User } from '../users/entities/user.entity';
import { Media } from './entities/media.entity';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly uploadRoot: string;

  constructor(
    @InjectRepository(Media) private readonly mediaRepo: Repository<Media>,
    config: ConfigService,
  ) {
    this.uploadRoot = resolve(config.getOrThrow<string>('upload.dir'));
  }

  async save(file: Express.Multer.File, user?: AuthUser): Promise<Media> {
    const filename = relative(this.uploadRoot, file.path).split('\\').join('/');
    const media = this.mediaRepo.create({
      filename,
      originalName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
      mimeType: file.mimetype,
      size: file.size,
      url: `/uploads/${filename}`,
      uploadedBy: user ? ({ id: user.id } as User) : null,
    });
    return this.mediaRepo.save(media);
  }

  async findAll(query: PaginationQueryDto): Promise<Paginated<Media>> {
    const qb = this.mediaRepo
      .createQueryBuilder('media')
      .orderBy('media.createdAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.search) qb.where('media.originalName ILIKE :search', { search: `%${query.search}%` });
    const [items, total] = await qb.getManyAndCount();
    return paginate(items, total, query.page, query.limit);
  }

  async remove(id: string): Promise<void> {
    const media = await this.mediaRepo.findOne({ where: { id } });
    if (!media) throw new NotFoundException('Fayl topilmadi');
    await this.mediaRepo.remove(media);
    await unlink(join(this.uploadRoot, media.filename)).catch((error: Error) =>
      this.logger.warn(`Faylni o'chirib bo'lmadi: ${media.filename} (${error.message})`),
    );
  }
}
