// Generates responsive WebP variants of large local images into public/_opt/ and writes
// lib/image-manifest.json, which lib/image-loader.ts uses to map next/image srcset widths to them.
// Run after adding/replacing a source image: `npm run images` (commit the output).
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const SOURCES = ["/candaherosection.jpeg", "/canda_infosection.jpeg"];
const WIDTHS = [384, 640, 828, 1080, 1200, 1920];
const QUALITY = 72;

const root = path.resolve(import.meta.dirname, "..");
const outDir = path.join(root, "public/_opt");
await mkdir(outDir, { recursive: true });
for (const f of await readdir(outDir)) await rm(path.join(outDir, f));

const manifest = {};
for (const src of SOURCES) {
  const input = path.join(root, "public", src);
  const { width: max } = await sharp(input).metadata();
  const widths = [...new Set([...WIDTHS.filter((w) => w < max), max])];
  const base = path.basename(src, path.extname(src));
  for (const w of widths) {
    const out = path.join(outDir, `${base}-${w}.webp`);
    const info = await sharp(input).resize({ width: w }).webp({ quality: QUALITY, effort: 6 }).toFile(out);
    console.log(`${src} → /_opt/${base}-${w}.webp ${(info.size / 1024).toFixed(1)} KiB`);
  }
  manifest[src] = widths;
}
await writeFile(path.join(root, "lib/image-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
