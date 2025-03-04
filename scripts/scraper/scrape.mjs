import { chromium } from 'playwright';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, extname, join } from 'node:path';
import { parseArgs } from 'node:util';

const { values } = parseArgs({
  options: {
    url: { type: 'string', default: 'https://samdu.uz/uz' },
    out: { type: 'string', default: 'output' },
    'max-pages': { type: 'string', default: '25' },
    delay: { type: 'string', default: '1500' },
    'same-path': { type: 'boolean', default: false },
    headful: { type: 'boolean', default: false },
  },
});

const startUrl = new URL(values.url);
const outDir = values.out;
const maxPages = Number(values['max-pages']);
const delay = Number(values.delay);
const ASSET_TYPES = new Set(['stylesheet', 'image', 'font', 'script', 'media']);
const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const pageFileName = (url) => {
  const path = url.pathname.replace(/\/+$/, '') || '/index';
  const query = url.search ? `__${createHash('md5').update(url.search).digest('hex').slice(0, 8)}` : '';
  return `${path.replace(/[^a-zA-Z0-9/_-]/g, '_')}${query}`;
};

const assetPath = (url) => {
  const clean = url.pathname.endsWith('/') ? `${url.pathname}index` : url.pathname;
  const ext = extname(clean) ? '' : '.bin';
  const query = url.search ? `__${createHash('md5').update(url.search).digest('hex').slice(0, 8)}` : '';
  return join(outDir, 'assets', url.hostname, `${clean}${query}${ext}`.replace(/[^a-zA-Z0-9/._-]/g, '_'));
};

const save = async (file, data) => {
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, data);
};

const isCrawlable = (url) =>
  url.hostname === startUrl.hostname &&
  !/\.(pdf|docx?|xlsx?|zip|rar|jpe?g|png|gif|webp|svg|mp4)$/i.test(url.pathname) &&
  (!values['same-path'] || url.pathname.startsWith(startUrl.pathname));

async function main() {
  const browser = await chromium.launch({ headless: !values.headful });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (SamDU redesign research bot; contact: webmaster@samdu.uz)',
    ignoreHTTPSErrors: true,
  });
  const page = await context.newPage();
  const savedAssets = new Set();
  const manifest = { startUrl: startUrl.href, startedAt: new Date().toISOString(), pages: [], assets: [] };

  page.on('response', async (response) => {
    const type = response.request().resourceType();
    if (!ASSET_TYPES.has(type) || !response.ok()) return;
    const url = new URL(response.url());
    if (savedAssets.has(url.href)) return;
    savedAssets.add(url.href);
    try {
      const body = await response.body();
      const file = assetPath(url);
      await save(file, body);
      manifest.assets.push({ url: url.href, type, file, size: body.length });
    } catch {
      savedAssets.delete(url.href);
    }
  });

  const queue = [startUrl.href];
  const visited = new Set();

  while (queue.length && visited.size < maxPages) {
    const href = queue.shift();
    if (visited.has(href)) continue;
    visited.add(href);
    const url = new URL(href);
    const name = pageFileName(url);
    console.log(`[${visited.size}/${maxPages}] ${href}`);

    try {
      await page.setViewportSize(VIEWPORTS[0]);
      await page.goto(href, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((resolve) => setTimeout(resolve, 120));
        }
        window.scrollTo(0, 0);
      });

      await save(join(outDir, 'html', `${name}.html`), await page.content());
      for (const viewport of VIEWPORTS) {
        await page.setViewportSize(viewport);
        await page.waitForTimeout(400);
        await page.screenshot({ path: join(outDir, 'screenshots', viewport.name, `${name}.png`), fullPage: true });
      }

      const links = await page.$$eval('a[href]', (anchors) => anchors.map((anchor) => anchor.href));
      for (const link of links) {
        try {
          const next = new URL(link);
          next.hash = '';
          if (isCrawlable(next) && !visited.has(next.href) && !queue.includes(next.href)) queue.push(next.href);
        } catch {
          continue;
        }
      }
      manifest.pages.push({ url: href, html: `html/${name}.html`, title: await page.title() });
    } catch (error) {
      console.warn(`  ! ${href}: ${error.message}`);
      manifest.pages.push({ url: href, error: error.message });
    }
    await sleep(delay);
  }

  manifest.finishedAt = new Date().toISOString();
  await save(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  await browser.close();
  console.log(`Tayyor: ${manifest.pages.length} sahifa, ${manifest.assets.length} asset -> ${outDir}/`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
