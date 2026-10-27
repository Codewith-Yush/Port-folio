const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const projectsDir = path.join(__dirname, 'public', 'images', 'projects');
const imagesDir = path.join(__dirname, 'public', 'images');

async function processFile(srcPath, baseDir, fileName) {
  const ext = path.extname(fileName).toLowerCase();
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null;

  const baseName = path.basename(fileName, ext);
  const webpDest = path.join(baseDir, `${baseName}.webp`);
  const avifDest = path.join(baseDir, `${baseName}.avif`);

  const stat = fs.statSync(srcPath);
  const origSize = stat.size;

  // Generate WebP
  await sharp(srcPath)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80, effort: 5 })
    .toFile(webpDest);
  const webpSize = fs.statSync(webpDest).size;

  // Generate AVIF
  await sharp(srcPath)
    .resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true })
    .avif({ quality: 72, effort: 4 })
    .toFile(avifDest);
  const avifSize = fs.statSync(avifDest).size;

  return { fileName, origSize, webpSize, avifSize };
}

async function run() {
  console.log('--- Starting High-Efficiency Image Optimization (WebP + AVIF) ---');
  let totalOrig = 0;
  let totalWebp = 0;
  let totalAvif = 0;
  let count = 0;

  // 1. Process projects
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir);
    for (const f of files) {
      const src = path.join(projectsDir, f);
      const res = await processFile(src, projectsDir, f);
      if (res) {
        count++;
        totalOrig += res.origSize;
        totalWebp += res.webpSize;
        totalAvif += res.avifSize;
      }
    }
  }

  // 2. Process root images
  if (fs.existsSync(imagesDir)) {
    const files = fs.readdirSync(imagesDir);
    for (const f of files) {
      const src = path.join(imagesDir, f);
      if (fs.statSync(src).isFile()) {
        const res = await processFile(src, imagesDir, f);
        if (res) {
          count++;
          totalOrig += res.origSize;
          totalWebp += res.webpSize;
          totalAvif += res.avifSize;
        }
      }
    }
  }

  const origMB = (totalOrig / (1024 * 1024)).toFixed(2);
  const webpMB = (totalWebp / (1024 * 1024)).toFixed(2);
  const avifMB = (totalAvif / (1024 * 1024)).toFixed(2);
  const webpSavings = (((totalOrig - totalWebp) / totalOrig) * 100).toFixed(1);
  const avifSavings = (((totalOrig - totalAvif) / totalOrig) * 100).toFixed(1);

  console.log(`Successfully optimized ${count} image assets:`);
  console.log(`Original: ${origMB} MB`);
  console.log(`WebP:     ${webpMB} MB (-${webpSavings}%)`);
  console.log(`AVIF:     ${avifMB} MB (-${avifSavings}%)`);
}

run().catch(console.error);

