import 'dotenv/config';
import 'reflect-metadata';
import { DataSource, EntityManager } from 'typeorm';
import { Locale, SUPPORTED_LOCALES } from '../../common/enums/locale.enum';
import { MenuLocation } from '../../common/enums/menu-location.enum';
import { AnnouncementTranslation } from '../../modules/announcements/entities/announcement-translation.entity';
import { Announcement } from '../../modules/announcements/entities/announcement.entity';
import { DepartmentTranslation } from '../../modules/faculties/entities/department-translation.entity';
import { Department } from '../../modules/faculties/entities/department.entity';
import { FacultyTranslation } from '../../modules/faculties/entities/faculty-translation.entity';
import { Faculty } from '../../modules/faculties/entities/faculty.entity';
import { MenuItemTranslation } from '../../modules/menus/entities/menu-item-translation.entity';
import { MenuItem } from '../../modules/menus/entities/menu-item.entity';
import { NewsTranslation } from '../../modules/news/entities/news-translation.entity';
import { News } from '../../modules/news/entities/news.entity';
import { SlideTranslation } from '../../modules/sliders/entities/slide-translation.entity';
import { Slide } from '../../modules/sliders/entities/slide.entity';
import { buildDataSourceOptions } from '../typeorm.config';
import {
  announcementsSeed,
  facultiesSeed,
  footerMenuSeed,
  headerMenuSeed,
  newsSeed,
  SeedMenu,
  slidesSeed,
} from './seed-data';

const log = (message: string) => console.log(`[seed] ${message}`);

async function seedSlides(manager: EntityManager) {
  if ((await manager.count(Slide)) > 0) return log('slides: mavjud, o\'tkazib yuborildi');
  for (const [index, item] of slidesSeed.entries()) {
    await manager.save(
      manager.create(Slide, {
        image: item.image,
        link: item.link,
        sortOrder: index,
        translations: SUPPORTED_LOCALES.map((locale) =>
          manager.create(SlideTranslation, {
            locale,
            title: item.title[locale],
            subtitle: item.subtitle[locale],
            buttonText: item.buttonText[locale],
          }),
        ),
      }),
    );
  }
  log(`slides: ${slidesSeed.length} ta qo'shildi`);
}

async function seedNews(manager: EntityManager) {
  if ((await manager.count(News)) > 0) return log('news: mavjud, o\'tkazib yuborildi');
  for (const item of newsSeed) {
    await manager.save(
      manager.create(News, {
        slug: item.slug,
        category: item.category,
        coverImage: item.coverImage,
        isFeatured: item.isFeatured,
        views: Math.floor(Math.random() * 900) + 100,
        publishedAt: new Date(item.publishedAt),
        translations: SUPPORTED_LOCALES.map((locale) =>
          manager.create(NewsTranslation, {
            locale,
            title: item.title[locale],
            summary: item.summary[locale],
            content: item.content[locale],
          }),
        ),
      }),
    );
  }
  log(`news: ${newsSeed.length} ta qo'shildi`);
}

async function seedAnnouncements(manager: EntityManager) {
  if ((await manager.count(Announcement)) > 0) return log('announcements: mavjud, o\'tkazib yuborildi');
  for (const item of announcementsSeed) {
    await manager.save(
      manager.create(Announcement, {
        slug: item.slug,
        type: item.type,
        isPinned: item.isPinned,
        eventDate: item.eventDate ? new Date(item.eventDate) : null,
        deadline: item.deadline ? new Date(item.deadline) : null,
        publishedAt: new Date(item.publishedAt),
        translations: SUPPORTED_LOCALES.map((locale) =>
          manager.create(AnnouncementTranslation, {
            locale,
            title: item.title[locale],
            summary: item.summary[locale],
            content: item.content[locale],
            location: item.location[locale],
          }),
        ),
      }),
    );
  }
  log(`announcements: ${announcementsSeed.length} ta qo'shildi`);
}

async function seedFaculties(manager: EntityManager) {
  if ((await manager.count(Faculty)) > 0) return log('faculties: mavjud, o\'tkazib yuborildi');
  for (const [index, item] of facultiesSeed.entries()) {
    const faculty = await manager.save(
      manager.create(Faculty, {
        slug: item.slug,
        icon: item.icon,
        image: `/images/faculty-${(index % 3) + 1}.svg`,
        studentsCount: item.studentsCount,
        email: `${item.slug}@samdu.uz`,
        phone: '+998 66 239-11-40',
        sortOrder: index,
        translations: SUPPORTED_LOCALES.map((locale) =>
          manager.create(FacultyTranslation, {
            locale,
            name: item.name[locale],
            shortDescription: item.short[locale],
            description: `<p>${item.short[locale]}</p>`,
          }),
        ),
      }),
    );
    for (const [order, department] of item.departments.entries()) {
      await manager.save(
        manager.create(Department, {
          faculty,
          sortOrder: order,
          translations: SUPPORTED_LOCALES.map((locale) =>
            manager.create(DepartmentTranslation, { locale, name: department[locale] }),
          ),
        }),
      );
    }
  }
  log(`faculties: ${facultiesSeed.length} ta qo'shildi`);
}

async function saveMenuTree(manager: EntityManager, items: SeedMenu[], location: MenuLocation, parentId: string | null) {
  for (const [index, item] of items.entries()) {
    const saved = await manager.save(
      manager.create(MenuItem, {
        location,
        url: item.url ?? null,
        icon: item.icon ?? null,
        isExternal: item.isExternal ?? false,
        sortOrder: index,
        parentId,
        translations: (Object.keys(item.title) as Locale[]).map((locale) =>
          manager.create(MenuItemTranslation, { locale, title: item.title[locale] }),
        ),
      }),
    );
    if (item.children?.length) await saveMenuTree(manager, item.children, location, saved.id);
  }
}

async function seedMenus(manager: EntityManager) {
  if ((await manager.count(MenuItem)) > 0) return log('menus: mavjud, o\'tkazib yuborildi');
  await saveMenuTree(manager, headerMenuSeed, MenuLocation.HEADER, null);
  await saveMenuTree(manager, footerMenuSeed, MenuLocation.FOOTER, null);
  log('menus: header va footer menyulari qo\'shildi');
}

async function run() {
  const dataSource = new DataSource(buildDataSourceOptions());
  await dataSource.initialize();
  try {
    await dataSource.transaction(async (manager) => {
      await seedSlides(manager);
      await seedNews(manager);
      await seedAnnouncements(manager);
      await seedFaculties(manager);
      await seedMenus(manager);
    });
    log('tayyor');
  } finally {
    await dataSource.destroy();
  }
}

run().catch((error) => {
  console.error('[seed] xatolik:', error);
  process.exit(1);
});
