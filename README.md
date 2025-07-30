# SamDU.uz — qayta qurilgan rasmiy sayt

Sharof Rashidov nomidagi Samarqand davlat universiteti rasmiy sayti uchun to'liq stek loyiha:

| Qism | Texnologiya |
|------|-------------|
| Frontend | Nuxt 4 (Vue 3, Composition API, SSR), Tailwind CSS, Pinia, @nuxtjs/i18n, Lucide |
| Backend | NestJS 11, TypeScript, REST, Swagger (OpenAPI), JWT Auth |
| Ma'lumotlar bazasi | PostgreSQL 16 + TypeORM |
| Infratuzilma | Docker, Docker Compose |
| Ko'chirish vositalari | Playwright skripti, HTTrack skripti |

Kontent 3 tilda: **o'zbek (uz)**, **rus (ru)**, **ingliz (en)**.

---

## ⚡ Tezkor ishga tushirish (Docker)

Talab: Docker 24+ va Docker Compose v2.

```bash
cp .env.example .env
docker compose up -d --build
```

Bir necha daqiqadan so'ng:

| Servis | Manzil |
|--------|--------|
| Sayt (Nuxt SSR) | http://localhost:3000 |
| REST API | http://localhost:4000/api |
| Swagger UI | http://localhost:4000/api/docs |
| OpenAPI JSON | http://localhost:4000/api/docs-json |
| PostgreSQL | `localhost:5442` (user `samdu`, parol `samdu_secret`) |

Standart admin: `admin@samdu.uz` / `Admin12345!` (`.env` da o'zgartiring).

Birinchi ishga tushishda backend jadvallarni yaratadi va demo ma'lumotlarni (slaydlar, yangiliklar, e'lonlar, 10 ta fakultet, ko'p darajali menyu) avtomatik yuklaydi.

```bash
docker compose ps
docker compose logs -f backend
docker compose down
docker compose down -v
```

`down -v` bazani va yuklangan fayllarni ham o'chiradi.

---

## 🛠 Lokal ishlab chiqish (Docker'siz)

Talab: Node.js 22+, PostgreSQL 14+ (yoki faqat bazani Docker'da ko'taring).

```bash
docker compose up -d postgres

cd backend
cp .env.example .env
npm install
npm run seed
npm run start:dev
```

Yangi terminalda:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Batafsil: [docs/RUNNING.md](docs/RUNNING.md)

---

## 📁 Loyiha tuzilmasi

```
samdu.uz/
├── backend/                  NestJS REST API
│   └── src/
│       ├── common/           enum, guard, decorator, DTO, util
│       ├── config/           konfiguratsiya
│       ├── database/         TypeORM data source, migratsiyalar, seed
│       └── modules/
│           ├── auth/         JWT login, /me, parol almashtirish
│           ├── users/        foydalanuvchilar (admin)
│           ├── news/         yangiliklar + news_translations
│           ├── announcements/ e'lonlar + tarjimalar
│           ├── faculties/    fakultetlar, kafedralar + tarjimalar
│           ├── menus/        ko'p darajali menyu daraxti
│           ├── media/        fayl yuklash (MediaUploadModule)
│           ├── sliders/      bosh sahifa hero slayderi
│           └── health/       holat tekshiruvi
├── frontend/                 Nuxt 4
│   ├── app/
│   │   ├── components/       layout/, home/, news/, announcements/, faculties/, ui/
│   │   ├── composables/      useApiFetch, useContent, useFormatDate ...
│   │   ├── layouts/          default.vue
│   │   ├── pages/            index, news, announcements, faculties, about, search
│   │   ├── plugins/          $api ($fetch instance)
│   │   ├── stores/           Pinia: accessibility, menu, ui
│   │   └── types/            API tiplari
│   ├── i18n/locales/         uz.json, ru.json, en.json
│   ├── server/api/           Nitro server route'lar
│   ├── public/               logo, rasmlar
│   └── tailwind.config.ts    SamDU brend palitrasi
├── scripts/scraper/          Playwright / HTTrack ko'chirish skriptlari
├── docs/                     hujjatlar
└── docker-compose.yml
```

## 📚 Hujjatlar

- [docs/RUNNING.md](docs/RUNNING.md) — ishga tushirish, buyruqlar, muammolar yechimi
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — arxitektura, komponentlar, DB sxemasi
- [docs/API.md](docs/API.md) — endpointlar va misollar
- [docs/SCRAPING.md](docs/SCRAPING.md) — samdu.uz dizayni va media fayllarini ko'chirish
- [docs/ROADMAP.md](docs/ROADMAP.md) — bosqichma-bosqich ish rejasi
