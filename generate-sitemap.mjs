import { readdirSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOMAIN = "https://clement-barbaste-mtc.fr";

const PRIORITIES = {
  "index.html": 1.0,
  "soins-tarifs.html": 0.9,
  "contact.html": 0.7,
  "mentions-legales.html": 0.2,
  "politique-confidentialite.html": 0.2,
};

const files = readdirSync(__dirname)
  .filter((f) => f.endsWith(".html"))
  .sort();

const urls = files
  .map((file) => {
    const loc = file === "index.html" ? `${DOMAIN}/` : `${DOMAIN}/${file}`;
    const priority = PRIORITIES[file] ?? 0.5;
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`;
  })
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(join(__dirname, "sitemap.xml"), xml);
console.log(`sitemap.xml written with ${files.length} URLs`);
