/* qa.mjs — 자가 QA: 해상도별 렌더링 스크린샷 + 콘솔 에러 + 키보드 내비게이션 검증 */
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import { mkdir } from 'node:fs/promises';

const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const ROOT = path.resolve(import.meta.dirname, '..');
const URL = 'file:///' + path.join(ROOT, 'index.html').replace(/\\/g, '/');
const OUT = path.join(ROOT, 'tools', 'qa-shots');
await mkdir(OUT, { recursive: true });

const consoleErrors = [];
const pageErrors = [];

const browser = await puppeteer.launch({
  executablePath: EDGE,
  headless: 'new',
  args: ['--no-sandbox', '--allow-file-access-from-files'],
});

const page = await browser.newPage();
page.on('console', (msg) => {
  if (msg.type() === 'error') consoleErrors.push(msg.text());
});
page.on('pageerror', (err) => pageErrors.push(String(err)));

const sizes = [
  [1366, 768],
  [1920, 1080],
  [2560, 1440],
  [3840, 2160],
];

// 1) 해상도별 Hero 렌더링
for (const [w, h] of sizes) {
  await page.setViewport({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 2200)); // Hero 모션 + 가이드 등장 대기
  await page.screenshot({ path: path.join(OUT, `hero-${w}x${h}.png`) });
  console.log(`shot hero-${w}x${h}`);
}

// 2) 키보드 내비게이션: 발표 시작 → 슬라이드 순회
await page.setViewport({ width: 1920, height: 1080 });
await page.goto(URL, { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 2000));

await page.keyboard.press('ArrowRight'); // 1→2 cinematic
await new Promise((r) => setTimeout(r, 1300));
await page.screenshot({ path: path.join(OUT, 'slide-02.png') });
const hash2 = await page.evaluate(() => location.hash);
console.log('after ArrowRight hash =', hash2);

// 연타 안정성: 빠르게 5회 입력 → 잠금으로 1단계만 이동해야 함
for (let i = 0; i < 5; i++) await page.keyboard.press('ArrowRight', { delay: 30 });
await new Promise((r) => setTimeout(r, 1400));
const hashAfterSpam = await page.evaluate(() => location.hash);
console.log('after 5x rapid ArrowRight hash =', hashAfterSpam);

// 3→4 horizontal slide 확인
await page.keyboard.press('ArrowRight');
await new Promise((r) => setTimeout(r, 500));
await page.screenshot({ path: path.join(OUT, 'transition-hslide-mid.png') });
await new Promise((r) => setTimeout(r, 700));
await page.screenshot({ path: path.join(OUT, 'slide-04.png') });

// 전환 완료 후 정지 상태 검증 (opacity/filter/transform 초기화)
const finalState = await page.evaluate(() => {
  const active = document.querySelector('.slide.active');
  const cs = getComputedStyle(active);
  return { id: active.id, opacity: cs.opacity, filter: cs.filter, transform: cs.transform, classes: active.className };
});
console.log('active slide state =', JSON.stringify(finalState));

// 3) Overview Mode
await page.keyboard.press('o');
await new Promise((r) => setTimeout(r, 600));
await page.screenshot({ path: path.join(OUT, 'overview.png') });
const ovOpen = await page.evaluate(() => !document.getElementById('overview').hidden);
console.log('overview open =', ovOpen);

// ESC 닫기 전용
await page.keyboard.press('Escape');
await new Promise((r) => setTimeout(r, 500));
const ovClosed = await page.evaluate(() => document.getElementById('overview').hidden);
const hashAfterEsc = await page.evaluate(() => location.hash);
console.log('overview closed =', ovClosed, '/ hash unchanged =', hashAfterEsc);

// 4) End / Home / 숫자 점프
await page.keyboard.press('End');
await new Promise((r) => setTimeout(r, 1300));
await page.screenshot({ path: path.join(OUT, 'slide-10.png') });
console.log('End hash =', await page.evaluate(() => location.hash));

await page.keyboard.press('5');
await page.keyboard.press('Enter');
await new Promise((r) => setTimeout(r, 1300));
console.log('jump 5 hash =', await page.evaluate(() => location.hash));

// 5) 블랙아웃
await page.keyboard.press('b');
await new Promise((r) => setTimeout(r, 200));
const blackoutOn = await page.evaluate(() => !document.getElementById('blackout').hidden);
await page.keyboard.press('b');
console.log('blackout toggle =', blackoutOn);

// 6) localStorage 복구 (재로드 → 마지막 위치)
await page.goto(URL.split('#')[0], { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 600));
console.log('restored hash =', await page.evaluate(() => location.hash));

// 7) env-gate (협소 뷰포트)
await page.setViewport({ width: 900, height: 1200 });
await page.goto(URL.split('#')[0], { waitUntil: 'networkidle0' });
await new Promise((r) => setTimeout(r, 400));
const gateShown = await page.evaluate(() => !document.getElementById('env-gate').hidden);
await page.screenshot({ path: path.join(OUT, 'env-gate.png') });
console.log('env-gate shown on 900x1200 =', gateShown);

await browser.close();

console.log('\n=== RESULT ===');
console.log('console errors:', consoleErrors.length, consoleErrors);
console.log('page errors:', pageErrors.length, pageErrors);
