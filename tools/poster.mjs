/* poster.mjs — Hero 영상 첫 프레임을 캡처해 포스터(WebP)로 저장
   영상→포스터 페이드인이 자연스럽게 이어지도록 함 */
import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import path from 'node:path';
import { writeFile, rm } from 'node:fs/promises';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(import.meta.dirname, '..');
const VIDEO = 'file:///' + path.join(ROOT, 'assets/videos/university-success-hero.mp4').replace(/\\/g, '/');
const OUT = path.join(ROOT, 'assets/images/university-success-poster.webp');
const TMP = path.join(import.meta.dirname, 'poster-frame.png');

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
});

// about:blank(setContent)에서는 file:// 미디어가 차단되므로 실제 파일로 로드
const TMP_HTML = path.join(import.meta.dirname, 'poster-tmp.html');
await writeFile(
  TMP_HTML,
  `<body style="margin:0;background:#000">
     <video src="${VIDEO}" muted autoplay
            style="width:1920px;height:1080px;object-fit:cover;display:block"></video>
   </body>`
);

const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.goto('file:///' + TMP_HTML.replace(/\\/g, '/'));

// 재생 시작 직후 프레임에서 정지
await page.waitForFunction(() => {
  const v = document.querySelector('video');
  return v && v.currentTime > 0.03 && v.readyState >= 2;
}, { timeout: 30000 });
await page.evaluate(() => document.querySelector('video').pause());

await page.screenshot({ path: TMP });
await browser.close();
await rm(TMP_HTML, { force: true });

await sharp(TMP).webp({ quality: 88 }).toFile(OUT);
console.log('poster updated from first video frame:', OUT);
