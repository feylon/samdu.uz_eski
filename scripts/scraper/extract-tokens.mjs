import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    url: { type: 'string', default: 'https://samdu.uz/uz' },
    out: { type: 'string', default: 'output/design-tokens.json' },
  },
});

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(values.url, { waitUntil: 'networkidle', timeout: 60000 });

const tokens = await page.evaluate(() => {
  const count = (map, key) => key && map.set(key, (map.get(key) ?? 0) + 1);
  const colors = new Map();
  const backgrounds = new Map();
  const fonts = new Map();
  const sizes = new Map();
  const radii = new Map();

  for (const element of document.querySelectorAll('body *')) {
    const style = getComputedStyle(element);
    if (style.display === 'none' || style.visibility === 'hidden') continue;
    count(colors, style.color);
    if (style.backgroundColor !== 'rgba(0, 0, 0, 0)') count(backgrounds, style.backgroundColor);
    count(fonts, style.fontFamily);
    count(sizes, style.fontSize);
    if (style.borderRadius !== '0px') count(radii, style.borderRadius);
  }

  const top = (map, limit = 15) =>
    [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit).map(([value, uses]) => ({ value, uses }));

  const box = (selector) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return { selector, height: Math.round(rect.height), background: style.backgroundColor, color: style.color };
  };

  return {
    url: location.href,
    title: document.title,
    colors: top(colors),
    backgrounds: top(backgrounds),
    fontFamilies: top(fonts, 6),
    fontSizes: top(sizes, 12),
    borderRadii: top(radii, 8),
    landmarks: ['header', 'nav', 'main', 'footer', '.swiper', '.slider', '.hero'].map(box).filter(Boolean),
  };
});

await mkdir('output', { recursive: true });
await writeFile(values.out, JSON.stringify(tokens, null, 2));
await browser.close();
console.log(`Dizayn tokenlari saqlandi: ${values.out}`);
