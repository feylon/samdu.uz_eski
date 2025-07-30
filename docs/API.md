# REST API

- Base URL: `http://localhost:4000/api`
- Swagger UI: `http://localhost:4000/api/docs`
- OpenAPI JSON: `http://localhost:4000/api/docs-json` (Postman / Insomnia'ga import qilish yoki `openapi-typescript` bilan frontend tiplarini generatsiya qilish uchun)

## Til

Har bir public endpoint `?lang=uz|ru|en` yoki `Accept-Language` headerini qabul qiladi. Ustuvorlik: `lang` → header → `uz`.

## Autentifikatsiya

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@samdu.uz","password":"Admin12345!"}'
```

```json
{
  "accessToken": "eyJhbGciOi…",
  "tokenType": "Bearer",
  "expiresIn": "1d",
  "user": { "id": "…", "email": "admin@samdu.uz", "fullName": "SamDU Administrator", "role": "admin" }
}
```

Keyingi so'rovlarda: `Authorization: Bearer <accessToken>`. Swagger'da **Authorize** tugmasi orqali.

Rollar: `admin` (hammasi), `editor` (kontent yaratish/tahrirlash), `user`.

## Endpointlar

| Metod | Yo'l | Ruxsat | Tavsif |
|-------|------|--------|--------|
| POST | `/auth/login` | public | token olish |
| GET | `/auth/me` | auth | joriy foydalanuvchi |
| POST | `/auth/change-password` | auth | parolni almashtirish |
| GET/POST | `/users` | admin | ro'yxat / yaratish |
| GET/PATCH/DELETE | `/users/:id` | admin | |
| GET | `/news?page&limit&category&featured&search&lang` | public | sahifalangan ro'yxat |
| GET | `/news/categories` | public | kategoriyalar |
| GET | `/news/:slug` | public | bitta yangilik (+1 ko'rish) |
| GET | `/news/admin`, `/news/admin/:id` | admin, editor | barcha tarjimalar bilan |
| POST / PATCH | `/news`, `/news/:id` | admin, editor | |
| DELETE | `/news/:id` | admin | |
| GET | `/announcements?type&upcoming&search&page&limit&lang` | public | |
| GET | `/announcements/:slug` | public | |
| GET | `/announcements/admin`, `/announcements/admin/:id` | admin, editor | |
| POST / PATCH / DELETE | `/announcements[/:id]` | admin, editor / admin | |
| GET | `/faculties` | public | |
| GET | `/faculties/stats` | public | fakultet, kafedra, talaba soni |
| GET | `/faculties/:slug` | public | kafedralar bilan |
| GET | `/faculties/admin`, `/faculties/admin/:id` | admin, editor | |
| POST / PATCH / DELETE | `/faculties[/:id]` | admin / admin, editor / admin | |
| POST | `/faculties/:id/departments` | admin, editor | kafedra qo'shish |
| PATCH / DELETE | `/faculties/departments/:departmentId` | admin, editor / admin | |
| GET | `/menus?location=header\|footer\|topbar&lang` | public | daraxt |
| GET | `/menus/admin?location` | admin | tekis ro'yxat |
| POST / PATCH / DELETE | `/menus[/:id]` | admin | `parentId` bilan ichma-ich |
| POST | `/media/upload` | admin, editor | `multipart/form-data`, maydon `file` |
| GET | `/media?page&limit&search` | admin, editor | |
| DELETE | `/media/:id` | admin, editor | fayl diskdan ham o'chadi |
| GET | `/sliders?lang` | public | hero slaydlar |
| GET | `/sliders/admin` | admin, editor | |
| POST / PATCH / DELETE | `/sliders[/:id]` | admin, editor / admin | |
| GET | `/health` | public | servis va DB holati |

## Misollar

Ko'p tilli yangilik yaratish:

```bash
curl -X POST http://localhost:4000/api/news \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{
    "category": "science",
    "isFeatured": true,
    "coverImage": "/uploads/2025/07/abc.jpg",
    "translations": [
      { "locale": "uz", "title": "Yangi grant loyihasi", "summary": "Qisqacha", "content": "<p>Matn</p>" },
      { "locale": "ru", "title": "Новый грантовый проект", "content": "<p>Текст</p>" },
      { "locale": "en", "title": "New grant project", "content": "<p>Text</p>" }
    ]
  }'
```

`slug` berilmasa birinchi tarjima sarlavhasidan yaratiladi (kirill → lotin transliteratsiya, takrorlansa suffiks qo'shiladi).

Faqat inglizcha tarjimani yangilash:

```bash
curl -X PATCH http://localhost:4000/api/news/$ID \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{ "translations": [{ "locale": "en", "title": "Updated title", "content": "<p>…</p>" }] }'
```

Fayl yuklash:

```bash
curl -X POST http://localhost:4000/api/media/upload \
  -H "Authorization: Bearer $TOKEN" -F "file=@photo.jpg"
```

Ichma-ich menyu elementi:

```bash
curl -X POST http://localhost:4000/api/menus \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' \
  -d '{ "location": "header", "parentId": "<ota-id>", "url": "/news?category=science",
        "translations": [{ "locale": "uz", "title": "Ilmiy yangiliklar" }, { "locale": "ru", "title": "Научные новости" }] }'
```

## Xato formati

```json
{ "statusCode": 400, "message": ["translations must contain at least 1 elements"], "error": "Bad Request" }
```
