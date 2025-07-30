# 1-qadam: samdu.uz dizayni va media fayllarini ko'chirish

> Faqat o'zingizga tegishli yoki ruxsat olingan saytni ko'chiring. Skriptlar so'rovlar orasida pauza qiladi va serverga yuklama bermaydi.

```bash
cd scripts/scraper
npm install
npm run install:browser
```

## A. Playwright (tavsiya etiladi)

JavaScript bilan render qilinadigan sahifalar, lazy-load rasmlar, shriftlar va CSS'ni haqiqiy brauzer orqali yig'adi.

```bash
npm run scrape -- --url https://samdu.uz/uz --max-pages 25 --delay 1500
```

| Parametr | Standart | Tavsif |
|----------|----------|--------|
| `--url` | `https://samdu.uz/uz` | boshlang'ich sahifa |
| `--out` | `output` | natija papkasi |
| `--max-pages` | 25 | nechta sahifa |
| `--delay` | 1500 | sahifalar orasidagi pauza (ms) |
| `--same-path` | false | faqat boshlang'ich yo'l ichida qolish |
| `--headful` | false | brauzerni ko'rinadigan rejimda ochish |

Natija:

```
output/
├── html/                    render qilingan HTML
├── assets/<host>/…          CSS, JS, rasmlar, shriftlar (asl yo'llar bilan)
├── screenshots/desktop/     1440px to'liq sahifa skrinshotlari
├── screenshots/mobile/      390px
└── manifest.json            sahifalar va assetlar ro'yxati
```

### Dizayn tokenlarini ajratib olish

```bash
npm run tokens -- --url https://samdu.uz/uz
```

`output/design-tokens.json` — eng ko'p ishlatilgan ranglar, fonlar, shriftlar, o'lchamlar va radiuslar. Bu qiymatlar `frontend/tailwind.config.ts` dagi `navy` / `gold` palitrasini aniqlashtirish uchun ishlatiladi.

## B. HTTrack (statik nusxa)

```bash
sudo apt install httrack
npm run httrack -- https://samdu.uz/uz output/httrack
```

`robots.txt` ga rioya qiladi, chuqurlik 3, tezlik ~250 KB/s.

## Ko'chirilgan materialdan foydalanish

1. **Skrinshotlar** → komponentlarga bo'lish (header, nav, hero, news, footer) — `docs/ARCHITECTURE.md` dagi jadval bo'yicha.
2. **design-tokens.json** → `tailwind.config.ts` ranglari va shriftlari.
3. **Rasmlar** (`assets/…/uploads`) → API orqali yuklash (`POST /api/media/upload`) yoki `backend/uploads/` ga nusxalab, `seed-data.ts` dagi `coverImage` / `image` yo'llarini almashtirish.
4. **Matnlar** (HTML) → seed yoki admin API orqali 3 tilda kiritish.
