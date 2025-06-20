import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Locale } from '../../common/enums/locale.enum';
import { MenuLocation } from '../../common/enums/menu-location.enum';
import { hasUniqueLocales, mergeTranslations, pickTranslation } from '../../common/utils/translation.util';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { MenuTreeItemDto } from './dto/menu-tree.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';
import { MenuItemTranslation } from './entities/menu-item-translation.entity';
import { MenuItem } from './entities/menu-item.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(MenuItem) private readonly menuRepo: Repository<MenuItem>,
    @InjectRepository(MenuItemTranslation) private readonly translationRepo: Repository<MenuItemTranslation>,
  ) {}

  async tree(location: MenuLocation, lang: Locale): Promise<MenuTreeItemDto[]> {
    const items = await this.menuRepo.find({
      where: { location, isActive: true },
      relations: { translations: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
    const nodes = new Map<string, MenuTreeItemDto>();
    for (const item of items) {
      nodes.set(item.id, {
        id: item.id,
        title: pickTranslation(item.translations, lang)?.title ?? '',
        url: item.url,
        icon: item.icon,
        isExternal: item.isExternal,
        children: [],
      });
    }
    const roots: MenuTreeItemDto[] = [];
    for (const item of items) {
      const node = nodes.get(item.id)!;
      const parent = item.parentId ? nodes.get(item.parentId) : undefined;
      if (parent) parent.children.push(node);
      else if (!item.parentId) roots.push(node);
    }
    return roots;
  }

  findAllAdmin(location?: MenuLocation): Promise<MenuItem[]> {
    return this.menuRepo.find({
      where: location ? { location } : {},
      relations: { translations: true },
      order: { location: 'ASC', sortOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<MenuItem> {
    const item = await this.menuRepo.findOne({ where: { id }, relations: { translations: true } });
    if (!item) throw new NotFoundException('Menyu elementi topilmadi');
    return item;
  }

  async create(dto: CreateMenuItemDto): Promise<MenuItem> {
    this.assertLocales(dto.translations);
    const { translations, ...rest } = dto;
    if (rest.parentId) await this.findOne(rest.parentId);
    const item = this.menuRepo.create({
      ...rest,
      translations: translations.map((translation) => this.translationRepo.create(translation)),
    });
    const saved = await this.menuRepo.save(item);
    return this.findOne(saved.id);
  }

  async update(id: string, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.findOne(id);
    const { translations, ...rest } = dto;
    if (rest.parentId) await this.assertValidParent(id, rest.parentId);
    Object.assign(item, rest);
    if (translations) {
      this.assertLocales(translations);
      item.translations = mergeTranslations(item.translations, translations, (data) => this.translationRepo.create(data));
    }
    await this.menuRepo.save(item);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const item = await this.findOne(id);
    await this.menuRepo.remove(item);
  }

  private async assertValidParent(id: string, parentId: string): Promise<void> {
    let cursor: string | null = parentId;
    while (cursor) {
      if (cursor === id) throw new BadRequestException('Menyu elementi o\'zining ichiga joylashtirilmaydi');
      const parent: MenuItem | null = await this.menuRepo.findOne({ where: { id: cursor }, select: { id: true, parentId: true } });
      if (!parent) throw new NotFoundException('Ota menyu topilmadi');
      cursor = parent.parentId;
    }
  }

  private assertLocales(translations: { locale: Locale }[]): void {
    if (!hasUniqueLocales(translations)) throw new BadRequestException('Har bir til faqat bir marta berilishi kerak');
  }
}
