# Bosqichma-bosqich ish rejasi

Muddat: **2025-03-01 — 2025-07-30**

| Bosqich | Davr | Natija |
|---------|------|--------|
| 0. Tayyorgarlik | 01.03 – 05.03 | repozitoriy, monorepo tuzilmasi, kod uslubi |
| 1. Ko'chirish va tahlil | 04.03 – 15.03 | Playwright/HTTrack skriptlari, skrinshotlar, dizayn tokenlari |
| 2. Nuxt 4 va UI | 12.03 – 30.04 | Tailwind brend palitrasi, i18n, header/nav/hero/news/footer komponentlari |
| 3. NestJS API va baza | 01.05 – 10.07 | modullar, ko'p tillik sxema, JWT, Swagger, seed |
| 4. Integratsiya | 10.07 – 25.07 | `useFetch`/`$fetch`, Pinia, til bo'yicha kontent, ichki sahifalar |
| 5. Deploy va hujjatlar | 22.07 – 30.07 | Docker, docker-compose, hujjatlar |

## Step 1 — Ko'chirish

- [x] `scripts/scraper/scrape.mjs` — HTML, assetlar, desktop/mobil skrinshotlar
- [x] `scripts/scraper/extract-tokens.mjs` — rang/shrift statistikasi
- [x] `scripts/scraper/httrack.sh` — statik nusxa
- [ ] Haqiqiy rasmlar va matnlarni API orqali import qilish

## Step 2 — Nuxt 4 va UI

- [x] `nuxt.config.ts`: SSR, Tailwind, Pinia, i18n (`prefix_except_default`)
- [x] `tailwind.config.ts`: `navy`, `gold`, `surface`, `ink`, gradientlar, soyalar, animatsiyalar
- [x] Topbar, til tanlash, maxsus imkoniyatlar paneli, qidiruv
- [x] Header + ko'p darajali dropdown navigatsiya, mobil drawer
- [x] Hero slider, tezkor havolalar, yangiliklar grid, e'lonlar, statistika, fakultetlar, footer

## Step 3 — NestJS API

- [x] Auth, Users, News, Announcements, Faculties, Menus, MediaUpload (+ Sliders, Health)
- [x] `*_translations` sxemasi, `uz` fallback
- [x] Global JWT va rol guardlari, validatsiya, Swagger
- [x] Idempotent seed
- [ ] Production uchun migratsiyalar (`DB_SYNC=false`)

## Step 4 — Integratsiya

- [x] `$api` plugin + `useApiFetch` (SSR'da ichki, brauzerda public URL)
- [x] Til almashganda kontent avtomatik qayta yuklanadi
- [x] Yangilik/e'lon/fakultet ichki sahifalari, qidiruv, sahifalash, filtrlar
- [x] SEO: `useSeoMeta`, hreflang (`useLocaleHead`)
- [x] Login sahifasi (`/login`), `auth`/`guest` middleware, `/admin` boshqaruv paneli

## Keyingi qadamlar

- Admin panelda to'liq CRUD formalar (yangilik/e'lon/fakultet/menyu tahrirlash, rasm yuklash) — hozir Swagger orqali
- Refresh token va httpOnly cookie (hozir access token JS o'qiy oladigan cookie'da)
- Sahifalar (`PagesModule`) — "Rahbariyat", "Tuzilma" kabi statik sahifalar uchun
- Rasm optimizatsiyasi (`@nuxt/image`, WebP), Redis kesh, sitemap.xml
- E2E testlar (Playwright), CI/CD (GitHub Actions → Docker registry)
