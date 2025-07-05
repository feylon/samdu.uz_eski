import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import configuration from './config/configuration';
import { buildDataSourceOptions } from './database/typeorm.config';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AuthModule } from './modules/auth/auth.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { HealthModule } from './modules/health/health.module';
import { MediaUploadModule } from './modules/media/media.module';
import { MenusModule } from './modules/menus/menus.module';
import { NewsModule } from './modules/news/news.module';
import { SlidersModule } from './modules/sliders/sliders.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration], cache: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({ ...buildDataSourceOptions(), autoLoadEntities: true }),
    }),
    AuthModule,
    UsersModule,
    NewsModule,
    AnnouncementsModule,
    FacultiesModule,
    MenusModule,
    MediaUploadModule,
    SlidersModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_INTERCEPTOR, useClass: ClassSerializerInterceptor },
  ],
})
export class AppModule {}
