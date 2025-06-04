import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Paginated } from '../../common/dto/paginated.dto';
import { Locale } from '../../common/enums/locale.enum';
import { randomSuffix, slugify } from '../../common/utils/slug.util';
import { hasUniqueLocales, mergeTranslations, pickTranslation } from '../../common/utils/translation.util';
import { LocalizedAnnouncementDto } from './dto/announcement-response.dto';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { QueryAnnouncementDto } from './dto/query-announcement.dto';
import { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementTranslation } from './entities/announcement-translation.entity';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement) private readonly announcementRepo: Repository<Announcement>,
    @InjectRepository(AnnouncementTranslation)
    private readonly translationRepo: Repository<AnnouncementTranslation>,
  ) {}

  async findPublished(query: QueryAnnouncementDto, lang: Locale): Promise<Paginated<LocalizedAnnouncementDto>> {
    const qb = this.buildListQuery(query)
      .andWhere('announcement.isPublished = true')
      .andWhere('announcement.publishedAt <= now()');
    const [items, total] = await qb.getManyAndCount();
    return paginate(
      items.map((item) => this.localize(item, lang, false)),
      total,
      query.page,
      query.limit,
    );
  }

  async findAllAdmin(query: QueryAnnouncementDto): Promise<Paginated<Announcement>> {
    const [items, total] = await this.buildListQuery(query).getManyAndCount();
    return paginate(items, total, query.page, query.limit);
  }

  async findPublishedBySlug(slug: string, lang: Locale): Promise<LocalizedAnnouncementDto> {
    const announcement = await this.announcementRepo.findOne({
      where: { slug, isPublished: true },
      relations: { translations: true },
    });
    if (!announcement) throw new NotFoundException('E\'lon topilmadi');
    return this.localize(announcement, lang, true);
  }

  async findOne(id: string): Promise<Announcement> {
    const announcement = await this.announcementRepo.findOne({ where: { id }, relations: { translations: true } });
    if (!announcement) throw new NotFoundException('E\'lon topilmadi');
    return announcement;
  }

  async create(dto: CreateAnnouncementDto): Promise<Announcement> {
    this.assertLocales(dto.translations);
    const { translations, slug, eventDate, deadline, publishedAt, ...rest } = dto;
    const announcement = this.announcementRepo.create({
      ...rest,
      slug: await this.uniqueSlug(slug ?? translations[0].title),
      eventDate: eventDate ? new Date(eventDate) : null,
      deadline: deadline ? new Date(deadline) : null,
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      translations: translations.map((item) => this.translationRepo.create(item)),
    });
    const saved = await this.announcementRepo.save(announcement);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateAnnouncementDto): Promise<Announcement> {
    const announcement = await this.findOne(id);
    const { translations, slug, eventDate, deadline, publishedAt, ...rest } = dto;
    Object.assign(announcement, rest);
    if (eventDate !== undefined) announcement.eventDate = eventDate ? new Date(eventDate) : null;
    if (deadline !== undefined) announcement.deadline = deadline ? new Date(deadline) : null;
    if (publishedAt) announcement.publishedAt = new Date(publishedAt);
    if (slug && slug !== announcement.slug) announcement.slug = await this.uniqueSlug(slug, id);
    if (translations) {
      this.assertLocales(translations);
      announcement.translations = mergeTranslations(announcement.translations, translations, (data) =>
        this.translationRepo.create(data),
      );
    }
    await this.announcementRepo.save(announcement);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const announcement = await this.findOne(id);
    await this.announcementRepo.remove(announcement);
  }

  private buildListQuery(query: QueryAnnouncementDto) {
    const qb = this.announcementRepo
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.translations', 'translation')
      .orderBy('announcement.isPinned', 'DESC')
      .addOrderBy('announcement.publishedAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.type) qb.andWhere('announcement.type = :type', { type: query.type });
    if (query.upcoming) qb.andWhere('announcement.eventDate >= now()');
    if (query.search) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM announcement_translations s WHERE s.announcement_id = announcement.id AND (s.title ILIKE :search OR s.summary ILIKE :search))',
        { search: `%${query.search}%` },
      );
    }
    return qb;
  }

  private localize(announcement: Announcement, lang: Locale, withContent: boolean): LocalizedAnnouncementDto {
    const translation = pickTranslation(announcement.translations, lang);
    return {
      id: announcement.id,
      slug: announcement.slug,
      locale: translation?.locale ?? lang,
      type: announcement.type,
      title: translation?.title ?? '',
      summary: translation?.summary ?? null,
      ...(withContent ? { content: translation?.content ?? '' } : {}),
      location: translation?.location ?? null,
      coverImage: announcement.coverImage,
      eventDate: announcement.eventDate,
      deadline: announcement.deadline,
      isPinned: announcement.isPinned,
      publishedAt: announcement.publishedAt,
    };
  }

  private assertLocales(translations: { locale: Locale }[]): void {
    if (!hasUniqueLocales(translations)) throw new BadRequestException('Har bir til faqat bir marta berilishi kerak');
  }

  private async uniqueSlug(source: string, excludeId?: string): Promise<string> {
    const base = slugify(source) || randomSuffix();
    let candidate = base;
    while (true) {
      const existing = await this.announcementRepo.findOne({ where: { slug: candidate }, select: { id: true } });
      if (!existing || existing.id === excludeId) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }
  }
}
