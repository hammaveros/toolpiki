// 빌드 후 404.html에 CSS 링크를 index.html에서 복사해 주입
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'out');
const indexPath = path.join(outDir, 'index.html');
const notFoundPath = path.join(outDir, '404.html');

if (!fs.existsSync(indexPath) || !fs.existsSync(notFoundPath)) {
  console.log('index.html or 404.html not found, skipping');
  process.exit(0);
}

const indexHtml = fs.readFileSync(indexPath, 'utf-8');
const notFoundHtml = fs.readFileSync(notFoundPath, 'utf-8');

// index.html에서 CSS 링크 추출
const cssLinks = indexHtml.match(/<link rel="stylesheet"[^>]*>/g) || [];
const fontLinks = indexHtml.match(/<link rel="preload"[^>]*as="font"[^>]*>/g) || [];

if (cssLinks.length === 0) {
  console.log('No CSS links found in index.html');
  process.exit(0);
}

const linksToInject = [...fontLinks, ...cssLinks].join('\n');

// 404.html의 <head> 안에 CSS 링크 주입
const fixed = notFoundHtml.replace('</head>', `${linksToInject}</head>`);

fs.writeFileSync(notFoundPath, fixed, 'utf-8');
console.log(`Injected ${cssLinks.length} CSS + ${fontLinks.length} font links into 404.html`);
