import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RECOVERY = path.join(ROOT, "_recovery");
const ASSETS = path.join(RECOVERY, "assets");
const PUBLIC_IMAGES = path.join(ROOT, "public", "images");
const EXTRACTED = JSON.parse(
  fs.readFileSync(path.join(RECOVERY, "extracted.json"), "utf8"),
);

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.6778.86 Safari/537.36";

const ALIASES = {
  "https://trusthashem.org/wp-content/uploads/2023/11/cropped-WhatsApp-Image-2023-11-01-at-15.49.01-192x192.jpeg":
    "logo-192.jpeg",
  "https://trusthashem.org/wp-content/uploads/2023/11/cropped-WhatsApp-Image-2023-11-01-at-15.49.01-270x270.jpeg":
    "logo-270.jpeg",
  "https://trusthashem.org/wp-content/uploads/2024/06/2.webp": "hero.webp",
  "https://trusthashem.org/wp-content/uploads/2024/09/1.webp": "2024-09-1.webp",
  "https://trusthashem.org/wp-content/uploads/2024/09/2.webp": "2024-09-2.webp",
  "https://trusthashem.org/wp-content/uploads/2024/09/3.webp": "2024-09-3.webp",
};

function destName(url) {
  if (ALIASES[url]) return ALIASES[url];
  const u = new URL(url);
  const parts = decodeURIComponent(u.pathname)
    .replace(/^\/wp-content\/uploads\//, "")
    .split("/")
    .filter(Boolean);
  const raw = parts.join("-").replace(/[^\w.\-]+/g, "-");
  return raw || "image.bin";
}

async function download(url, dest) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "*/*" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 80) throw new Error(`too small (${buf.length} bytes)`);
  fs.writeFileSync(dest, buf);
  return buf.length;
}

fs.mkdirSync(ASSETS, { recursive: true });
fs.mkdirSync(PUBLIC_IMAGES, { recursive: true });

const attempts = EXTRACTED.meta?.images_download_attempts || [];
const seen = new Set();
const results = [];

for (const item of attempts) {
  const url = item.url;
  if (seen.has(url)) continue;
  seen.add(url);
  const file = destName(url);
  const dest = path.join(ASSETS, file);
  try {
    const bytes = await download(url, dest);
    fs.copyFileSync(dest, path.join(PUBLIC_IMAGES, file));
    results.push({ url, file, ok: true, bytes });
    console.log(`OK ${bytes} ${file}`);
  } catch (err) {
    results.push({ url, file, ok: false, error: String(err) });
    console.error(`FAIL ${url} :: ${err}`);
  }
}

const skipSlugs = new Set(["home", "product-create-endless-blessings"]);
const lessons = (EXTRACTED.lessons || [])
  .filter((l) => l.slug && !skipSlugs.has(l.slug))
  .map((l) => ({
    slug: l.slug,
    path: `/${l.slug}/`,
    title: l.title || l.h1 || l.slug,
    h1: l.h1 || l.title || "",
    summary: (l.paragraphs || []).slice(0, 3),
    playlist_ids: l.audioigniter_playlist_ids || [],
    whatsapp: (l.whatsapp_links || [])[0] || null,
    thumbnail:
      (l.image_urls || []).find(
        (u) =>
          !u.includes("cropped-WhatsApp-Image") &&
          !u.includes("-32x32") &&
          !u.includes("-100x100") &&
          !u.includes("-150x150") &&
          !u.includes("-180x180") &&
          !u.includes("-192x192") &&
          !u.includes("-270x270"),
      ) || null,
  }));

const catalog = {
  recovered_at: new Date().toISOString(),
  paypal_hosted_button_id: "BN88DN38MLPAA",
  contact_email: "bitachon@trusthashem.org",
  home_whatsapp: "https://chat.whatsapp.com/CdZNrs4dbEZJjunjnrmLfW",
  youtube: [],
  jewishpodcasts_in_html: [],
  products: EXTRACTED.wp_products || [],
  extra_pages: EXTRACTED.extra_pages_from_wp_rest || [],
  playlists: EXTRACTED.audioigniter_playlist_ids || [],
  audio_url_count: (EXTRACTED.audio_urls || []).length,
  whatsapp_groups: EXTRACTED.whatsapp_links || lessons.map((l) => l.whatsapp).filter(Boolean),
  lessons,
  images: results,
};

fs.writeFileSync(
  path.join(RECOVERY, "catalog.json"),
  JSON.stringify(catalog, null, 2),
);
fs.writeFileSync(
  path.join(RECOVERY, "image-restore.json"),
  JSON.stringify(results, null, 2),
);

const ok = results.filter((r) => r.ok).length;
console.log(`DONE images ${ok}/${results.length} catalog lessons ${lessons.length}`);
