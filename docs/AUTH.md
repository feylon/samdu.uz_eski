# Autentifikatsiya va login sahifasi

## Qayerda?

| | Manzil |
|---|---|
| Login sahifasi | http://localhost:3000/login · `/ru/login` · `/en/login` |
| Boshqaruv paneli | http://localhost:3000/admin |
| API endpoint | `POST http://localhost:4000/api/auth/login` |

Saytning yuqori panelida (topbar) **Kirish** tugmasi bor. Login qilingandan keyin u **Boshqaruv paneli** ga aylanadi.

Standart hisob (`.env`):

```
ADMIN_EMAIL=admin@samdu.uz
ADMIN_PASSWORD=Admin12345!
```

Backend birinchi ishga tushganda bazada bitta ham admin bo'lmasa, shu ma'lumotlar bilan admin yaratadi. Keyinchalik `.env` ni o'zgartirish mavjud adminning parolini **o'zgartirmaydi**.

## Oqim

```
/login  ──POST /api/auth/login──►  { accessToken, user }
   │                                      │
   │        samdu_token cookie (1 kun) ◄──┘
   ▼
/admin ── auth middleware ── token bor? ── yo'q ──► /login?redirect=/admin
                               │
                               └─ ha ─► GET /api/auth/me ─► sahifa
```

- `app/stores/auth.ts` — `login()`, `fetchMe()`, `logout()`; token `samdu_token` cookie'da saqlanadi, shuning uchun SSR'da ham (sahifa yangilanganda) foydalanuvchi tanib olinadi.
- `app/plugins/api.ts` — har bir so'rovga `Authorization: Bearer <token>` qo'shadi; API `401` qaytarsa token o'chiriladi.
- `app/middleware/auth.ts` — himoyalangan sahifalar uchun (`definePageMeta({ middleware: 'auth' })`).
- `app/middleware/guest.ts` — login qilgan foydalanuvchini `/login` dan `/admin` ga yo'naltiradi.
- `?redirect=` faqat `/` bilan boshlanadigan ichki yo'llarni qabul qiladi (open redirect himoyasi).

Yangi himoyalangan sahifa qo'shish:

```vue
<script setup lang="ts">
definePageMeta({ middleware: 'auth' });
const auth = useAuthStore();
</script>
```

## Rollar

| Rol | Huquqlar |
|-----|----------|
| `admin` | hammasi, shu jumladan foydalanuvchilar, menyular, o'chirish |
| `editor` | yangilik, e'lon, slayd, fakultet tahrirlash, fayl yuklash |
| `user` | faqat `/auth/me` |

## Yangi foydalanuvchi (muharrir) qo'shish

Swagger'da admin sifatida **Authorize** qilib, `POST /api/users`:

```bash
curl -X POST http://localhost:4000/api/users \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"email":"editor@samdu.uz","password":"Editor12345!","fullName":"Muharrir","role":"editor"}'
```

Muharrir shu email/parol bilan `/login` orqali kiradi.

## Parolni almashtirish

```bash
curl -X POST http://localhost:4000/api/auth/change-password \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{"currentPassword":"Admin12345!","newPassword":"YangiKuchliParol2025"}'
```

## Swagger orqali login

1. http://localhost:4000/api/docs → **Auth → POST /auth/login** → *Try it out* → *Execute*.
2. Javobdagi `accessToken` ni nusxalang.
3. Yuqoridagi **Authorize** tugmasi → tokenni kiriting. Endi himoyalangan endpointlarni sinash mumkin.

## Hozirgi cheklovlar

- Access token JavaScript o'qiy oladigan cookie'da (httpOnly emas). Production uchun refresh token + httpOnly cookie tavsiya etiladi.
- `/admin` hozircha dashboard: kontent CRUD formalari keyingi bosqichda, hozir Swagger orqali.
