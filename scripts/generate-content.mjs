import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const catalog = JSON.parse(
  fs.readFileSync(path.join(ROOT, "_recovery", "catalog.json"), "utf8"),
);

const LOCAL = {
  "laws-of-lashon-hara": "/images/Screenshot-2023-11-12-170217.jpg",
  "book-of-psalms": "/images/Screenshot-2023-11-13-152252.jpg",
  "ahavas-yisrael": "/images/ahavat-israel.webp",
  "meeting-with-the-king-of-kings": "/images/meeting-with-hashem.jpeg",
  "understanding-shema-amidah-tefillah-what-are-you-really-saying":
    "/images/shma2.jpeg",
  "knowing-gods-plan": "/images/gods-plan.jpeg",
  "the-path-of-the-just": "/images/ranhal.jpeg",
  "the-10-gates-of-chovos-halevavos":
    "/images/The-10-Gates-of-Chovos-HaLevavos-Womens-Learning-Group.jpeg",
  "yonah-journey-of-the-soul":
    "/images/Yonah-Journey-of-the-Soul-Womens-Learning-Group-.jpeg",
  "pirkei-avot-ethics-of-our-fathers":
    "/images/Pirkei-Avot-Ethics-of-Our-Fathers-Womens-Learning-Group.jpeg",
  "secrets-of-redemption":
    "/images/Secrets-of-Redemption-Maamar-HaGeulah-RaMCHaL-Womens-Learning-Group.jpeg",
  "the-pele-yoetz":
    "/images/The-Pele-Yoetz-Giving-Meaning-to-Jewish-Life-WOMENS-GROUP.jpeg",
  "the-power-of-the-festivals":
    "/images/The-POWER-of-the-Festivals-Womens-Learning-Group.jpeg",
  "the-tomer-devorah": "/images/THE-Tomer-Devorah-Womens-Learning-Group.webp",
  "roni-akarah-guide-for-the-childless":
    "/images/WhatsApp-Image-2024-07-18-at-16.15.17.jpeg",
  "shidduchim-mine-or-hashems": "/images/shidduchim.webp",
  "gateways-to-hashem": "/images/gateway.webp",
  "master-your-words-master-your-life": "/images/2024-09-3.webp",
  "how-to-create-the-neshama-of-a-mitzvah-sefer-kaasher-tzivah-hashem":
    "/images/2024-09-2.webp",
  "the-13-principles-of-faith": "/images/2024-09-1.webp",
};

function cleanSummary(paragraphs) {
  return (paragraphs || [])
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(
      (p) =>
        p &&
        !p.toLowerCase().includes("we are not spammers") &&
        !p.toLowerCase().startsWith("we promise to send"),
    );
}

function loadTracks(ids) {
  const tracks = [];
  for (const id of ids || []) {
    const file = path.join(ROOT, "_recovery", "playlists", `${id}.json`);
    if (!fs.existsSync(file)) continue;
    const items = JSON.parse(fs.readFileSync(file, "utf8"));
    for (const item of items) {
      if (!item?.audio) continue;
      tracks.push({
        title: item.title || "Lesson",
        subtitle: item.subtitle || "",
        audio: item.audio,
        cover: item.cover || "",
      });
    }
  }
  return tracks;
}

const lessons = catalog.lessons.map((lesson) => ({
  slug: lesson.slug,
  path: `/${lesson.slug}/`,
  title: lesson.title,
  h1: lesson.h1 || lesson.title,
  summary: cleanSummary(lesson.summary),
  whatsapp: lesson.whatsapp,
  image: LOCAL[lesson.slug] || lesson.thumbnail,
  tracks: loadTracks(lesson.playlist_ids),
}));

const homeTracks = loadTracks([33]);

const outDir = path.join(ROOT, "src", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "content.json"),
  JSON.stringify(
    {
      paypalButtonId: catalog.paypal_hosted_button_id,
      email: catalog.contact_email,
      homeWhatsapp: catalog.home_whatsapp,
      homeTracks,
      lessons,
    },
    null,
    2,
  ),
);
console.log(
  `Wrote ${lessons.length} lessons, ${lessons.reduce((n, l) => n + l.tracks.length, 0)} tracks, home ${homeTracks.length}`,
);
