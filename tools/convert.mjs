import sharp from 'sharp';
import { mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'assets', 'source_png');
const OUT_SOURCE = path.join(ROOT, 'assets', 'source');
const OUT_THUMBS = path.join(ROOT, 'assets', 'thumbnails');
const OUT_IMAGES = path.join(ROOT, 'assets', 'images');

await mkdir(OUT_SOURCE, { recursive: true });
await mkdir(OUT_THUMBS, { recursive: true });
await mkdir(OUT_IMAGES, { recursive: true });

const files = (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort();

for (const f of files) {
  const base = f.replace(/\.png$/i, '');
  const input = path.join(SRC, f);
  // 텍스트 선명도 우선: 무손실에 가까운 고품질 WebP
  await sharp(input)
    .webp({ quality: 92, effort: 6 })
    .toFile(path.join(OUT_SOURCE, `${base}.webp`));
  await sharp(input)
    .resize(480, 270, { fit: 'contain', background: '#050810' })
    .webp({ quality: 82 })
    .toFile(path.join(OUT_THUMBS, `${base}.webp`));
  console.log(`converted ${base}`);
}

// Hero 포스터: Deep Navy 기반 프리미엄 테크 그라디언트 (영상 폴백용)
const posterSvg = `<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="22%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#0c2b33"/>
      <stop offset="45%" stop-color="#071722"/>
      <stop offset="100%" stop-color="#04070f"/>
    </radialGradient>
    <radialGradient id="g2" cx="80%" cy="85%" r="60%">
      <stop offset="0%" stop-color="#0a3d34" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#04070f" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#19c98c" stop-opacity="0.10"/>
      <stop offset="50%" stop-color="#19c98c" stop-opacity="0.02"/>
      <stop offset="100%" stop-color="#00e5ff" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <rect width="1920" height="1080" fill="url(#g1)"/>
  <rect width="1920" height="1080" fill="url(#g2)"/>
  <g stroke="#19c98c" stroke-opacity="0.10" stroke-width="1">
    ${Array.from({ length: 12 }, (_, i) => `<line x1="${160 * i}" y1="0" x2="${160 * i}" y2="1080"/>`).join('')}
    ${Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${180 * i}" x2="1920" y2="${180 * i}"/>`).join('')}
  </g>
  <polygon points="0,1080 760,300 1920,1080" fill="url(#beam)"/>
  <circle cx="1500" cy="260" r="220" fill="#0e5f4a" opacity="0.16"/>
  <circle cx="1500" cy="260" r="120" fill="#19c98c" opacity="0.10"/>
</svg>`;
await sharp(Buffer.from(posterSvg))
  .webp({ quality: 88 })
  .toFile(path.join(OUT_IMAGES, 'university-success-poster.webp'));
console.log('poster generated');
