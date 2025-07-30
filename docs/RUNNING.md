# Ishga tushirish bo'yicha qo'llanma

## 1. Docker orqali (tavsiya etiladi)

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
```

Barcha servislar `healthy` bo'lishi kerak:

```
samdu-postgres-1   healthy   127.0.0.1:5442->5432
samdu-backend-1    healthy   0.0.0.0:4000->4000
samdu-frontend-1   healthy   0.0.0.0:3000->3000
```

### Ishga tushish tartibi

1. `postgres` — `pg_isready` healthcheck o'tguncha kutiladi.
2. `backend` — `seed.js` (jadvallar + demo ma'lumot, idempotent) → `main.js`. Admin yo'q bo'lsa `.env` dagi `ADMIN_*` bilan yaratiladi.
3. `frontend` — backend `healthy` bo'lgach ishga tushadi.

### Tizimga kirish

| Sahifa | Manzil |
|--------|--------|
| Login | http://localhost:3000/login |
| Boshqaruv paneli | http://localhost:3000/admin |
| Swagger (API orqali login) | http://localhost:4000/api/docs → `POST /auth/login` → **Authorize** |

Login: `ADMIN_EMAIL` / `ADMIN_PASSWORD` (standart `admin@samdu.uz` / `Admin12345!`). Batafsil: [AUTH.md](AUTH.md).

### Muhit o'zgaruvchilari (`.env`)

| O'zgaruvchi | Standart | Tavsif |
|-------------|----------|--------|
| `DB_USER` / `DB_PASSWORD` / `DB_NAME` | samdu / samdu_secret / samdu | Postgres |
| `DB_HOST_PORT` | 5442 | Hostdagi Postgres porti |
| `DB_SYNC` | true | TypeORM schema sync. Production'da `false` + migratsiya |
| `API_HOST_PORT` | 4000 | API porti |
| `API_PUBLIC_URL` | http://localhost:4000 | Brauzer API'ga murojaat qiladigan manzil |
| `CORS_ORIGINS` | http://localhost:3000 | Vergul bilan ajratilgan ruxsat etilgan originlar |
| `WEB_HOST_PORT` | 3000 | Sayt porti |
| `SITE_URL` | http://localhost:3000 | SEO (hreflang, canonical) uchun |
| `JWT_SECRET` | — | **Albatta o'zgartiring** |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | admin@samdu.uz / Admin12345! | Birinchi admin |

### Foydali buyruqlar

```bash
docker compose logs -f backend
docker compose restart backend
docker compose up -d --build frontend
docker compose exec postgres psql -U samdu -d samdu
docker compose exec backend node dist/database/seeds/seed.js
docker compose down
docker compose down -v
```

## 2. Lokal ishlab chiqish

### Backend

```bash
docker compose up -d postgres
cd backend
cp .env.example .env
npm install
npm run seed
npm run start:dev
```

| Skript | Vazifa |
|--------|--------|
| `npm run start:dev` | watch rejimida ishga tushirish |
| `npm run build` / `npm run start:prod` | production build va ishga tushirish |
| `npm run typecheck` | TypeScript tekshiruvi |
| `npm run seed` | demo ma'lumotlarni yuklash (bo'sh jadvallarga) |
| `npm run migration:generate` | entity o'zgarishlaridan migratsiya yaratish |
| `npm run migration:run` / `migration:revert` | migratsiyani qo'llash / bekor qilish |

### Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

| Skript | Vazifa |
|--------|--------|
| `npm run dev` | http://localhost:3000 da HMR bilan |
| `npm run build` | SSR production build (`.output/`) |
| `npm run start` | build'ni ishga tushirish |
| `npm run typecheck` | vue-tsc tekshiruvi |

Frontend runtime sozlamalari (`NUXT_*` env orqali almashtiriladi):

| Env | Vazifa |
|-----|--------|
| `NUXT_API_BASE_SERVER` | SSR paytida server API'ga murojaat qiladigan ichki manzil |
| `NUXT_PUBLIC_API_BASE` | Brauzerdan API manzili |
| `NUXT_PUBLIC_MEDIA_BASE` | `/uploads/...` fayllar uchun prefiks |
| `NUXT_PUBLIC_I18N_BASE_URL` | hreflang/canonical uchun sayt manzili |

## 3. Production'ga chiqarish bo'yicha tavsiyalar

1. `JWT_SECRET`, `ADMIN_PASSWORD`, `DB_PASSWORD` ni kuchli qiymatlarga almashtiring.
2. `DB_SYNC=false` qiling, `npm run migration:generate` bilan boshlang'ich migratsiya yarating va `migration:run` ni deploy bosqichiga qo'shing.
3. Oldiga Nginx/Traefik qo'yib, HTTPS yoqing: `samdu.uz → frontend:3000`, `api.samdu.uz → backend:4000`.
4. `API_PUBLIC_URL=https://api.samdu.uz`, `SITE_URL=https://samdu.uz`, `CORS_ORIGINS=https://samdu.uz`.
5. `uploads` va `postgres_data` volume'larining zaxira nusxasini oling.

## 4. Muammolar yechimi

| Belgi | Yechim |
|-------|--------|
| `port is already allocated` | `.env` da `DB_HOST_PORT`, `API_HOST_PORT` yoki `WEB_HOST_PORT` ni o'zgartiring |
| Sayt ochiladi, lekin ma'lumot yo'q | `docker compose logs backend`, so'ng `curl localhost:4000/api/health` |
| Brauzerda CORS xatosi | `CORS_ORIGINS` sayt manzilini o'z ichiga olganini tekshiring |
| Rasm yuklanmaydi (`/uploads/...`) | `API_PUBLIC_URL` brauzerdan ochiladigan manzil ekanini tekshiring |
| Login'da "Email yoki parol noto'g'ri" | `ADMIN_*` faqat **birinchi** ishga tushishda (admin yo'q bo'lsa) qo'llaniladi. Parolni o'zgartirgan bo'lsangiz, `docker compose down -v` bilan qaytadan boshlang yoki `POST /auth/change-password` |
| Login'dan keyin yana `/login` ga qaytaradi | Token muddati tugagan (`JWT_EXPIRES_IN`) yoki `JWT_SECRET` o'zgargan — qayta kiring |
| Seed qayta ishlamaydi | U faqat bo'sh jadvallarni to'ldiradi; qayta yuklash uchun `docker compose down -v` |
