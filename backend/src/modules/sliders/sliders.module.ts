import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlideTranslation } from './entities/slide-translation.entity';
import { Slide } from './entities/slide.entity';
import { SlidersController } from './sliders.controller';
import { SlidersService } from './sliders.service';

@Module({
  imports: [TypeOrmModule.forFeature([Slide, SlideTranslation])],
  controllers: [SlidersController],
  providers: [SlidersService],
})
export class SlidersModule {}
