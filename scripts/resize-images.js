import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const dirs = [
  'public/images/sites',
  'public/images/outputs'
];

async function resizeImages() {
  for (const dir of dirs) {
    const files = await fs.readdir(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      // Skip if it's not an image file we expect
      if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
      
      const tmpPath = `${filePath}.tmp`;
      
      try {
        const metadata = await sharp(filePath).metadata();
        // Only resize if width > 800
        if (metadata.width && metadata.width > 800) {
          await sharp(filePath)
            .resize({ width: 800, withoutEnlargement: true })
            .toFile(tmpPath);
          
          await fs.rename(tmpPath, filePath);
          console.log(`Resized ${file}`);
        } else {
          // If it's already small enough, we can still optimize it
          await sharp(filePath)
            // Just re-saving with sharp can sometimes optimize size
            .toFile(tmpPath);
          await fs.rename(tmpPath, filePath);
          console.log(`Optimized ${file}`);
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    }
  }
}

resizeImages().then(() => console.log('Done'));
