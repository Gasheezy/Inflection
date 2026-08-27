/* One-off script to generate the PWA icon set (navy/gold brand mark) as raw
 * PNGs, with no external dependencies — just zlib. Run with:
 *   node scripts/generate-icons.js
 */
import fs from "fs";
import path from "path";
import zlib from "zlib";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const NAVY = [0x1e, 0x27, 0x61];
const GOLD = [0xd4, 0xaf, 0x37];
const DEEP_NAVY = [0x12, 0x17, 0x3f];

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

function mix(a, b, t) {
  return Math.round(a + (b - a) * t);
}

function drawIcon(size) {
  const raw = Buffer.alloc(size * size * 4);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size * 0.38;
  const ringWidth = size * 0.045;
  const markR = size * 0.16;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Radial glow background: deep navy edges, navy center.
      const bgT = Math.min(1, dist / (size * 0.7));
      let r = mix(NAVY[0], DEEP_NAVY[0], bgT);
      let g = mix(NAVY[1], DEEP_NAVY[1], bgT);
      let b = mix(NAVY[2], DEEP_NAVY[2], bgT);

      // Gold ring.
      const ringDist = Math.abs(dist - outerR);
      if (ringDist < ringWidth) {
        const edge = 1 - Math.min(1, ringDist / ringWidth);
        r = mix(r, GOLD[0], edge);
        g = mix(g, GOLD[1], edge);
        b = mix(b, GOLD[2], edge);
      }

      // Center mark: an upward chevron ("inflection point") in gold.
      const markDx = (x - cx) / markR;
      const markDy = (y - cy) / markR;
      const onChevron =
        Math.abs(Math.abs(markDx) - markDy - 0.15) < 0.22 &&
        markDy > -0.9 &&
        markDy < 0.9 &&
        Math.abs(markDx) < 1.05;
      if (onChevron) {
        r = GOLD[0];
        g = GOLD[1];
        b = GOLD[2];
      }

      raw[idx] = r;
      raw[idx + 1] = g;
      raw[idx + 2] = b;
      raw[idx + 3] = 255;
    }
  }

  // Filter type 0 (none) per scanline, required by PNG format.
  const stride = size * 4;
  const filtered = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    filtered[y * (stride + 1)] = 0;
    raw.copy(filtered, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const idat = zlib.deflateSync(filtered);

  const signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  return Buffer.concat([
    signature,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outDir = path.join(__dirname, "..", "public", "icons");
fs.mkdirSync(outDir, { recursive: true });

for (const size of [192, 512]) {
  const png = drawIcon(size);
  fs.writeFileSync(path.join(outDir, `icon-${size}.png`), png);
  console.log(`Wrote icon-${size}.png (${png.length} bytes)`);
}
