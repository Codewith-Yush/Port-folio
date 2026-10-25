const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'public', 'images', 'projects');
const files = fs.readdirSync(dir);

async function run() {
  let totalOrig = 0;
  let totalWebp = 0;

  for (const f of files) {
    if (!/\.(png|jpe?g)$/i.test(f)) continue;
    if (f.endsWith('.webp')) continue;
    const src = path.join(dir, f);
    const baseName = f.substring(0, f.lastIndexOf('.'));
    const dest = path.join(dir, `${baseName}.webp`);
    const stat = fs.statSync(src);
    totalOrig += stat.size;
    await sharp(src)
      .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(dest);
    const newStat = fs.statSync(dest);
    totalWebp += newStat.size;
  }

  const heroSrc = path.join(__dirname, 'public', 'images', 'hero-poster.png');
  const heroDest = path.join(__dirname, 'public', 'images', 'hero-poster.webp');
  if (fs.existsSync(heroSrc)) {
    const stat = fs.statSync(heroSrc);
    totalOrig += stat.size;
    await sharp(heroSrc)
      .resize({ width: 1600, height: 1200, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 5 })
      .toFile(heroDest);
    const newStat = fs.statSync(heroDest);
    totalWebp += newStat.size;
  }

  console.log(`Original: ${(totalOrig / (1024 * 1024)).toFixed(2)} MB -> WebP: ${(totalWebp / (1024 * 1024)).toFixed(2)} MB`);
}

run().catch(console.error);

