import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { paginate, Paginated } from '../../common/dto/paginated.dto';
import { Locale } from '../../common/enums/locale.enum';
import { AuthUser } from '../../common/interfaces/auth-user.interface';
import { randomSuffix, slugify } from '../../common/utils/slug.util';
import { hasUniqueLocales, mergeTranslations, pickTranslation } from '../../common/utils/translation.util';
import { CreateNewsDto } from './dto/create-news.dto';
import { LocalizedNewsDto } from './dto/news-response.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsTranslation } from './entities/news-translation.entity';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService {
  constructor(
    @InjectRepository(News) private readonly newsRepo: Repository<News>,
    @InjectRepository(NewsTranslation) private readonly translationRepo: Repository<NewsTranslation>,
  ) {}

  async findPublished(query: QueryNewsDto, lang: Locale): Promise<Paginated<LocalizedNewsDto>> {
    const qb = this.buildListQuery(query).andWhere('news.isPublished = true').andWhere('news.publishedAt <= now()');
    const [items, total] = await qb.getManyAndCount();
    return paginate(
      items.map((item) => this.localize(item, lang, false)),
      total,
      query.page,
      query.limit,
    );
  }

  async findAllAdmin(query: QueryNewsDto): Promise<Paginated<News>> {
    const [items, total] = await this.buildListQuery(query).getManyAndCount();
    return paginate(items, total, query.page, query.limit);
  }

  async findPublishedBySlug(slug: string, lang: Locale): Promise<LocalizedNewsDto> {
    const news = await this.newsRepo.findOne({
      where: { slug, isPublished: true },
      relations: { translations: true },
    });
    if (!news) throw new NotFoundException('Yangilik topilmadi');
    await this.newsRepo.increment({ id: news.id }, 'views', 1);
    news.views += 1;
    return this.localize(news, lang, true);
  }

  async findOne(id: string): Promise<News> {
    const news = await this.newsRepo.findOne({ where: { id }, relations: { translations: true } });
    if (!news) throw new NotFoundException('Yangilik topilmadi');
    return news;
  }

  async create(dto: CreateNewsDto, author?: AuthUser): Promise<News> {
    this.assertLocales(dto.translations);
    const { translations, publishedAt, slug, ...rest } = dto;
    const news = this.newsRepo.create({
      ...rest,
      slug: await this.uniqueSlug(slug ?? translations[0].title),
      publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      translations: translations.map((item) => this.translationRepo.create(item)),
      author: author ? ({ id: author.id } as News['author']) : null,
    });
    const saved = await this.newsRepo.save(news);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateNewsDto): Promise<News> {
    const news = await this.findOne(id);
    const { translations, publishedAt, slug, ...rest } = dto;
    Object.assign(news, rest);
    if (publishedAt) news.publishedAt = new Date(publishedAt);
    if (slug && slug !== news.slug) news.slug = await this.uniqueSlug(slug, id);
    if (translations) {
      this.assertLocales(translations);
      news.translations = mergeTranslations(news.translations, translations, (data) => this.translationRepo.create(data));
    }
    await this.newsRepo.save(news);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const news = await this.findOne(id);
    await this.newsRepo.remove(news);
  }

  async categories(): Promise<string[]> {
    const rows = await this.newsRepo
      .createQueryBuilder('news')
      .select('DISTINCT news.category', 'category')
      .where('news.isPublished = true')
      .orderBy('category')
      .getRawMany<{ category: string }>();
    return rows.map((row) => row.category);
  }

  private buildListQuery(query: QueryNewsDto) {
    const qb = this.newsRepo
      .createQueryBuilder('news')
      .leftJoinAndSelect('news.translations', 'translation')
      .orderBy('news.publishedAt', 'DESC')
      .skip((query.page - 1) * query.limit)
      .take(query.limit);
    if (query.category) qb.andWhere('news.category = :category', { category: query.category });
    if (query.featured !== undefined) qb.andWhere('news.isFeatured = :featured', { featured: query.featured });
    if (query.search) {
      qb.andWhere(
        'EXISTS (SELECT 1 FROM news_translations s WHERE s.news_id = news.id AND (s.title ILIKE :search OR s.summary ILIKE :search))',
        { search: `%${query.search}%` },
      );
    }
    return qb;
  }

  private localize(news: News, lang: Locale, withContent: boolean): LocalizedNewsDto {
    const translation = pickTranslation(news.translations, lang);
    return {
      id: news.id,
      slug: news.slug,
      locale: translation?.locale ?? lang,
      title: translation?.title ?? '',
      summary: translation?.summary ?? null,
      ...(withContent ? { content: translation?.content ?? '' } : {}),
      coverImage: news.coverImage,
      category: news.category,
      isFeatured: news.isFeatured,
      views: news.views,
      publishedAt: news.publishedAt,
      availableLocales: (news.translations ?? []).map((item) => item.locale),
    };
  }

  private assertLocales(translations: { locale: Locale }[]): void {
    if (!hasUniqueLocales(translations)) throw new BadRequestException('Har bir til faqat bir marta berilishi kerak');
  }

  private async uniqueSlug(source: string, excludeId?: string): Promise<string> {
    const base = slugify(source) || randomSuffix();
    let candidate = base;
    while (true) {
      const existing = await this.newsRepo.findOne({ where: { slug: candidate }, select: { id: true } });
      if (!existing || existing.id === excludeId) return candidate;
      candidate = `${base}-${randomSuffix()}`;
    }
  }
}
