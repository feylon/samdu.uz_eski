import { BadRequestException, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, join, resolve } from 'path';
import { Media } from './entities/media.entity';
import { ALLOWED_MIME_TYPES } from './media.constants';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Media]),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const root = resolve(config.getOrThrow<string>('upload.dir'));
        return {
          storage: diskStorage({
            destination: (_req, _file, callback) => {
              const now = new Date();
              const folder = join(root, String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, '0'));
              mkdirSync(folder, { recursive: true });
              callback(null, folder);
            },
            filename: (_req, file, callback) => {
              callback(null, `${randomUUID()}${extname(file.originalname).toLowerCase()}`);
            },
          }),
          limits: { fileSize: config.getOrThrow<number>('upload.maxSizeMb') * 1024 * 1024 },
          fileFilter: (_req, file, callback) => {
            if (ALLOWED_MIME_TYPES.includes(file.mimetype)) return callback(null, true);
            callback(new BadRequestException(`Ruxsat etilmagan fayl turi: ${file.mimetype}`), false);
          },
        };
      },
    }),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaUploadModule {}
