import { readdirSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const root = join(process.cwd(), "public/images/listings");
if (!statSync(root, { throwIfNoEntry: false })) process.exit(0);

const ids = readdirSync(root).filter(d => statSync(join(root, d)).isDirectory());
for (const id of ids) {
  const dir = join(root, id);
  const files = readdirSync(dir)
    .filter(f => /\.(webp|jpg|jpeg|png)$/i.test(f))
    .sort((a, b) => {
      const na = parseInt(a.match(/^(\d+)/)?.[1] ?? "0", 10);
      const nb = parseInt(b.match(/^(\d+)/)?.[1] ?? "0", 10);
      return na - nb;
    });
  const manifest = { version: 1, images: files.map(f => ({ file: f })) };
  writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 2));
  console.log(`✅ ${id}: ${files.length} images`);
}
