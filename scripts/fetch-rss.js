import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Parser from 'rss-parser';

const parser = new Parser();

async function main() {
  const filePath = path.join(process.cwd(), 'src/data/site.yml');
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const siteData = yaml.load(fileContents);

  const rssData = {};

  const fetchPromises = siteData.links
    .filter(link => link.rssUrl)
    .map(async (link) => {
      try {
        console.log(`Fetching RSS for ${link.icon}: ${link.rssUrl}`);
        const feed = await parser.parseURL(link.rssUrl);
        if (feed.items && feed.items.length > 0) {
          const latestItem = feed.items[0];
          rssData[link.icon] = {
            title: latestItem.title,
            link: latestItem.link
          };
          console.log(`✅ Success: [${link.icon}] ${latestItem.title}`);
        } else {
          console.log(`⚠️ No items found for ${link.icon}`);
        }
      } catch (error) {
        console.error(`❌ Failed to fetch RSS for ${link.icon}:`, error.message);
      }
    });

  await Promise.all(fetchPromises);

  const outputPath = path.join(process.cwd(), 'rss-feed.json');
  fs.writeFileSync(outputPath, JSON.stringify(rssData, null, 2));
  console.log(`\n🎉 Saved RSS data to ${outputPath}`);
}

main().catch(console.error);
