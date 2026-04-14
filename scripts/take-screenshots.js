import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const sites = [
  { name: 'blog', url: 'https://myamio.coolis.jp/' },
  { name: 'topic', url: 'https://myamio.coolis.jp/topic' },
  { name: 'proverbs', url: 'https://daily-proverbs.netlify.app/' },
  { name: 'foodie', url: 'https://tokyofoodiefinder.netlify.app/' },
  { name: 'katsudon', url: 'https://tokyokatsudonfinder.netlify.app/' },
  { name: 'groceries', url: 'https://tokyogroceriesfinder.netlify.app/' }
];

(async () => {
  const browser = await chromium.launch();
  for (const site of sites) {
    const context = await browser.newContext({
      extraHTTPHeaders: {
        'Referer': site.url
      }
    });
    const page = await context.newPage();
    console.log(`Taking screenshot of ${site.url}...`);
    await page.goto(site.url, { waitUntil: 'networkidle' });
    // Wait an extra bit for maps to load
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `public/images/sites/${site.name}.png` });
    await context.close();
  }
  await browser.close();
})();
