// Stack <prefix>-ref.png over <prefix>-port.png (with a red rule between) into <prefix>-sbs.png.
import fs from "node:fs";
import { PNG } from "pngjs";
for (const pre of process.argv.slice(2)) {
  const a = PNG.sync.read(fs.readFileSync(pre + "-ref.png")), b = PNG.sync.read(fs.readFileSync(pre + "-port.png"));
  const w = Math.max(a.width, b.width), h = a.height + b.height + 6;
  const o = new PNG({ width: w, height: h });
  o.data.fill(255);
  PNG.bitblt(a, o, 0, 0, a.width, a.height, 0, 0);
  for (let y = a.height; y < a.height + 6; y++) for (let x = 0; x < w; x++) { const i = (y * w + x) * 4; o.data[i] = 220; o.data[i + 1] = 30; o.data[i + 2] = 30; o.data[i + 3] = 255; }
  PNG.bitblt(b, o, 0, 0, b.width, b.height, 0, a.height + 6);
  fs.writeFileSync(pre + "-sbs.png", PNG.sync.write(o));
}
