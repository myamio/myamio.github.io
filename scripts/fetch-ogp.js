import fs from 'fs';
import path from 'path';
import { parse } from 'node-html-parser';
import https from 'https';
import http from 'http';

const outputs = [
  { id: 'kindle1', url: 'https://www.amazon.co.jp/dp/B0GWYFZQ2T' },
  { id: 'kindle2', url: 'https://www.amazon.co.jp/dp/B0DKFZLPX6' },
  { id: 'note1', url: 'https://note.com/myamio/n/n1946d5983cf8' },
  { id: 'zenn1', url: 'https://zenn.dev/myamio/books/ai-induced-cognitive-load' },
  { id: 'zenn2', url: 'https://zenn.dev/myamio/books/ai-era-software-design' }
];

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHtml(res.headers.location));
      }

      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

async function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(dest);
    client.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        return resolve(downloadImage(res.headers.location, dest));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

(async () => {
  for (const output of outputs) {
    try {
      console.log(`Fetching ${output.url}...`);
      const html = await fetchHtml(output.url);
      const root = parse(html);

      const title = root.querySelector('meta[property="og:title"]')?.getAttribute('content') || root.querySelector('title')?.text || '';
      const description = root.querySelector('meta[property="og:description"]')?.getAttribute('content') || root.querySelector('meta[name="description"]')?.getAttribute('content') || '';
      const image = root.querySelector('meta[property="og:image"]')?.getAttribute('content') || '';

      console.log(`Title: ${title}`);
      console.log(`Description: ${description}`);
      console.log(`Image: ${image}`);

      if (image) {
        const ext = path.extname(new URL(image).pathname) || '.jpg';
        const imgPath = `public/images/outputs/${output.id}${ext}`;
        await downloadImage(image, imgPath);
        console.log(`Saved image to ${imgPath}`);
      }
      console.log('---');
    } catch (e) {
      console.error(`Error processing ${output.url}: ${e.message}`);
    }
  }
})();
