import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locale } from '../../common/enums/locale.enum';
import { hasUniqueLocales, mergeTranslations, pickTranslation } from '../../common/utils/translation.util';
import { CreateSlideDto, LocalizedSlideDto, UpdateSlideDto } from './dto/slide.dto';
import { SlideTranslation } from './entities/slide-translation.entity';
import { Slide } from './entities/slide.entity';

@Injectable()
export class SlidersService {
  constructor(
    @InjectRepository(Slide) private readonly slideRepo: Repository<Slide>,
    @InjectRepository(SlideTranslation) private readonly translationRepo: Repository<SlideTranslation>,
  ) {}

  async findActive(lang: Locale): Promise<LocalizedSlideDto[]> {
    const slides = await this.slideRepo.find({
      where: { isActive: true },
      relations: { translations: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    return slides.map((slide) => {
      const translation = pickTranslation(slide.translations, lang);
      return {
        id: slide.id,
        locale: translation?.locale ?? lang,
        image: slide.image,
        link: slide.link,
        title: translation?.title ?? '',
        subtitle: translation?.subtitle ?? null,
        buttonText: translation?.buttonText ?? null,
      };
    });
  }

  findAllAdmin(): Promise<Slide[]> {
    return this.slideRepo.find({ relations: { translations: true }, order: { sortOrder: 'ASC' } });
  }

  async findOne(id: string): Promise<Slide> {
    const slide = await this.slideRepo.findOne({ where: { id }, relations: { translations: true } });
    if (!slide) throw new NotFoundException('Slayd topilmadi');
    return slide;
  }

  async create(dto: CreateSlideDto): Promise<Slide> {
    this.assertLocales(dto.translations);
    const slide = this.slideRepo.create({
      ...dto,
      translations: dto.translations.map((item) => this.translationRepo.create(item)),
    });
    const saved = await this.slideRepo.save(slide);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateSlideDto): Promise<Slide> {
    const slide = await this.findOne(id);
    const { translations, ...rest } = dto;
    Object.assign(slide, rest);
    if (translations) {
      this.assertLocales(translations);
      slide.translations = mergeTranslations(slide.translations, translations, (data) => this.translationRepo.create(data));
    }
    await this.slideRepo.save(slide);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const slide = await this.findOne(id);
    await this.slideRepo.remove(slide);
  }

  private assertLocales(translations: { locale: Locale }[]): void {
    if (!hasUniqueLocales(translations)) throw new BadRequestException('Har bir til faqat bir marta berilishi kerak');
  }
}
