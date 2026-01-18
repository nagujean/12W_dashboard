const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// SVG 아이콘 생성 (12W 로고)
const createSvgIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.2}" fill="url(#grad)"/>
  <text
    x="50%"
    y="38%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="white"
    font-family="Arial, sans-serif"
    font-weight="bold"
    font-size="${size * 0.28}px"
  >12</text>
  <text
    x="50%"
    y="68%"
    dominant-baseline="middle"
    text-anchor="middle"
    fill="white"
    font-family="Arial, sans-serif"
    font-weight="bold"
    font-size="${size * 0.22}px"
  >WEEK</text>
</svg>
`.trim();

const iconsDir = path.join(__dirname, '../public/icons');
const publicDir = path.join(__dirname, '../public');

// 디렉토리 확인
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

async function generateIcons() {
  const sizes = [192, 512];

  for (const size of sizes) {
    const svg = createSvgIcon(size);
    const svgBuffer = Buffer.from(svg);

    // PNG 생성
    await sharp(svgBuffer)
      .png()
      .toFile(path.join(iconsDir, `icon-${size}x${size}.png`));

    console.log(`Created icon-${size}x${size}.png`);
  }

  // favicon.ico용 작은 아이콘 (32x32)
  const favicon = createSvgIcon(32);
  await sharp(Buffer.from(favicon))
    .png()
    .toFile(path.join(publicDir, 'icon.png'));

  // Apple Touch Icon (180x180)
  const appleTouchIcon = createSvgIcon(180);
  await sharp(Buffer.from(appleTouchIcon))
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  console.log('Created icon.png (favicon)');
  console.log('Created apple-touch-icon.png');
  console.log('\nAll icons generated successfully!');
}

generateIcons().catch(console.error);
