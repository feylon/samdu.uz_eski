# Arxitektura

```
Brauzer ──► Nuxt 4 SSR (3000) ──► NestJS API (4000) ──► PostgreSQL (5432)
   │                                   ▲
   └────── client-side $fetch ─────────┘   /uploads (static, volume)
```

- **SSR**: sahifa serverda `NUXT_API_BASE_SERVER` (Docker ichki tarmoq `http://backend:4000/api`) orqali ma'lumot oladi, HTML tayyor holda qaytadi. Payload brauzerga serializatsiya qilinadi, qayta so'rov yuborilmaydi.
- **Client navigatsiya**: `NUXT_PUBLIC_API_BASE` orqali to'g'ridan-to'g'ri API'ga.
- **Til**: URL prefiksi (`/`, `/ru`, `/en`) → `?lang=` query + `Accept-Language` header → backend tarjimani tanlaydi, topilmasa `uz` ga qaytadi.

## 1. Frontend (Nuxt 4)

### Komponentlar xaritasi

| Blok | Komponent | Tavsif |
|------|-----------|--------|
| Topbar | `layout/TheTopbar.vue` | telefon, email, ish vaqti, maxsus imkoniyatlar, qidiruv, til |
| Til tanlash | `layout/LanguageSwitcher.vue` | `useSwitchLocalePath` bilan UZ/RU/EN |
| Imkoniyati cheklanganlar | `layout/AccessibilityPanel.vue` + `stores/accessibility.ts` | shrift 100/112/125%, oq-qora, yuqori kontrast, rasmlarsiz. Cookie'da saqlanadi → SSR'da ham to'g'ri chiqadi |
| Qidiruv | `layout/SearchOverlay.vue`, `pages/search.vue` | yangilik va e'lonlar bo'yicha `?search=` |
| Header | `layout/TheHeader.vue`, `ui/AppLogo.vue` | logo, manzil, telefon |
| Navigatsiya | `layout/TheNavigation.vue` + rekursiv `layout/NavDropdown.vue` | API'dan keluvchi cheksiz darajali dropdown (hover + klaviatura `focus-within`) |
| Mobil menyu | `layout/TheMobileMenu.vue` + rekursiv `layout/MobileMenuItem.vue` | drawer + accordion |
| Hero slider | `home/HeroSlider.vue` | autoplay, progress, pauza (hover/focus), Ken Burns effekti, strelkalar |
| Tezkor havolalar | `home/QuickLinks.vue` | heroga ustma-ust tushuvchi 4 karta |
| Yangiliklar | `home/NewsGrid.vue`, `news/NewsCard.vue` | featured + grid, skeleton holat |
| E'lonlar | `home/AnnouncementsList.vue`, `announcements/AnnouncementCard.vue` | sana bloki, turi, muddat, joy |
| Statistika | `home/StatsSection.vue` | IntersectionObserver bilan animatsion hisoblagich |
| Fakultetlar | `home/FacultiesSection.vue`, `faculties/FacultyCard.vue` | ikonka, kafedra/talaba soni |
| Footer | `layout/TheFooter.vue` | bo'limlar, API'dagi footer menyusi, kontaktlar, ijtimoiy tarmoqlar |
| Login | `pages/login.vue` (`blank` layout, `guest` middleware) | email/parol, parolni ko'rsatish, xato xabarlari, `?redirect=` |
| Boshqaruv paneli | `pages/admin/index.vue` (`auth` middleware) | foydalanuvchi, rol, statistika, so'nggi yangiliklar, chiqish |
| Umumiy UI | `ui/SectionTitle`, `ui/PageHero`, `ui/AppPagination`, `ui/StateMessage`, `ui/SkeletonCard`, `ui/MenuLink`, `ui/SocialIcon` | |

### Ma'lumot oqimi

| Fayl | Vazifa |
|------|--------|
| `plugins/api.ts` | `$api = $fetch.create({ baseURL })` — server/client uchun mos manzil, `Accept-Language` |
| `composables/useApiFetch.ts` | `useFetch` + `$api` (Nuxt rasmiy "custom useFetch" pattern) |
| `composables/useContent.ts` | `useNewsList`, `useNewsItem`, `useAnnouncementsList`, `useFaculties`, `useSlides` ... — `locale` reaktiv, til almashganda avtomatik qayta yuklanadi |
| `stores/auth.ts` | JWT `samdu_token` cookie'da, `login`, `fetchMe`, `logout`. `$api` har so'rovga `Authorization: Bearer` qo'shadi, 401 da token o'chiriladi |
| `stores/menu.ts` | menyular `location:lang` kaliti bilan keshlanadi (Pinia, SSR state hydration) |
| `composables/useFormatDate.ts` | `Asia/Samarkand` vaqt zonasi, o'zbekcha oy nomlari — server va client natijasi bir xil (hydration mismatch yo'q) |

### Brend palitrasi (`tailwind.config.ts`)

| Token | Asosiy | Ishlatilishi |
|-------|--------|-------------|
| `navy-900` / `primary` | `#14234a` | navigatsiya, sarlavhalar, kartalar |
| `navy-950` | `#0c1630` | topbar, footer |
| `gold-500` / `accent` | `#d4991a` | CTA tugmalar, aktiv holat, chiziqlar |
| `gold-300/400` | `#eec955` / `#e8b42e` | qorong'i fondagi aksentlar |
| `surface-muted` | `#f5f7fb` | sahifa foni |
| `ink` | `#14213d` | asosiy matn |

Qo'shimcha: `bg-navy-gradient`, `bg-gold-gradient`, `bg-hero-overlay`, `shadow-card`, `shadow-dropdown`, `animate-slide-up`, `animate-ken-burns`, `font-display` (Montserrat) va `font-sans` (Inter, kirill harflari bilan).

## 2. Backend (NestJS)

| Modul | Entity | Asosiy endpointlar |
|-------|--------|--------------------|
| `AuthModule` | — | `POST /auth/login`, `GET /auth/me`, `POST /auth/change-password` |
| `UsersModule` | `User` | `/users` CRUD (admin) |
| `NewsModule` | `News`, `NewsTranslation` | `GET /news`, `GET /news/:slug`, admin CRUD |
| `AnnouncementsModule` | `Announcement`, `AnnouncementTranslation` | `GET /announcements`, `GET /announcements/:slug`, admin CRUD |
| `FacultiesModule` | `Faculty`, `FacultyTranslation`, `Department`, `DepartmentTranslation` | `GET /faculties`, `GET /faculties/:slug`, `GET /faculties/stats`, kafedralar CRUD |
| `MenusModule` | `MenuItem` (self-reference), `MenuItemTranslation` | `GET /menus?location=header` — daraxt |
| `MediaUploadModule` | `Media` | `POST /media/upload` (multipart), `GET /media`, `DELETE /media/:id` |
| `SlidersModule` | `Slide`, `SlideTranslation` | `GET /sliders` |
| `HealthModule` | — | `GET /health` |

Har bir modul: `entities/` → `dto/` (class-validator + Swagger dekoratorlari) → `*.service.ts` (biznes mantiq) → `*.controller.ts` (routing, rol, Swagger).

### Xavfsizlik

- Global `JwtAuthGuard` — hamma narsa default himoyalangan, ochiq endpointlar `@Public()` bilan belgilanadi.
- Global `RolesGuard` — `@Roles(Role.ADMIN, Role.EDITOR)`.
- `ValidationPipe({ whitelist, forbidNonWhitelisted, transform })`.
- Parollar `bcrypt` bilan, `password` ustuni `select: false` va `@Exclude()`.
- Fayl yuklash: MIME whitelist, hajm limiti, UUID nomlar, `uploads/YYYY/MM/`.

## 3. Ko'p tillik ma'lumotlar bazasi sxemasi

Har bir tarjima qilinadigan obyekt ikki jadvaldan iborat: **asosiy jadval** (tilga bog'liq bo'lmagan maydonlar) va **`*_translations`** (har til uchun bitta qator, `UNIQUE(parent_id, locale)`).

```
news                               news_translations
├─ id (uuid, PK)                   ├─ id (uuid, PK)
├─ slug (unique)                   ├─ news_id (FK → news.id, ON DELETE CASCADE)
├─ cover_image                     ├─ locale ('uz' | 'ru' | 'en')
├─ category (index)                ├─ title
├─ is_published, is_featured       ├─ summary
├─ views                           ├─ content
├─ published_at (index)            └─ UNIQUE (news_id, locale)
├─ author_id (FK → users.id)
└─ created_at, updated_at

announcements                      announcement_translations
├─ id, slug, type (index)          ├─ announcement_id (FK, CASCADE)
├─ cover_image                     ├─ locale
├─ event_date, deadline            ├─ title, summary, content
├─ is_pinned, is_published         ├─ location
└─ published_at                    └─ UNIQUE (announcement_id, locale)

faculties ──< departments          faculty_translations / department_translations
menu_items (parent_id → menu_items.id)   menu_item_translations
slides                             slide_translations
users                              media (uploaded_by → users.id)
```

Afzalliklari:
- Yangi til qo'shish = `Locale` enumga qiymat qo'shish, sxema o'zgarmaydi.
- Tarjima to'liq bo'lmasa ham obyekt ishlaydi (`uz` ga fallback, `availableLocales` maydoni).
- Qidiruv barcha tillar bo'yicha `EXISTS (... ILIKE ...)` bilan.

Javob formati (public endpoint, `?lang=ru`):

```json
{
  "id": "e80b…",
  "slug": "xalqaro-ilmiy-konferensiya-2025",
  "locale": "ru",
  "title": "Успешно проведена международная научно-практическая конференция",
  "summary": "…",
  "coverImage": "/images/news-2.svg",
  "category": "science",
  "publishedAt": "2025-07-15T10:30:00.000Z",
  "availableLocales": ["uz", "ru", "en"]
}
```

Admin endpointlari (`/news/admin/:id`) esa obyektni barcha `translations` bilan qaytaradi. `PATCH` da yuborilgan tarjimalar `locale` bo'yicha birlashtiriladi (upsert) — yuborilmagan tillar o'zgarmaydi.
