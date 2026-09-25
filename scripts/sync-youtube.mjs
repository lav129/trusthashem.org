import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT = path.join(ROOT, "src", "data", "youtube-videos.json");

const CHANNELS = [
  {
    lang: "en",
    handle: "rebbetzinleahdonner",
    channelId: "UCrjPPpQXzsB60_Z2m6Ux0LA",
    title: "English",
    label: "Trust Hashem — English",
  },
  {
    lang: "es",
    handle: "RabanitLeahDonner",
    channelId: "UCri3wFr3GBlAt9EJ7xUCJtA",
    title: "Spanish",
    label: "Bitajón — Español",
  },
];

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const INNERTUBE_KEY = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

function uploadsPlaylist(channelId) {
  return "UU" + channelId.slice(2);
}

function decodeTitle(raw) {
  if (!raw) return "Lesson";
  try {
    return JSON.parse(`"${raw}"`);
  } catch {
    return String(raw)
      .replace(/\\"/g, '"')
      .replace(/\\u0026/g, "&")
      .replace(/&amp;/g, "&")
      .replace(/&#39;/g, "'");
  }
}

/** Pull videoId + nearby title from YouTube HTML/JSON blobs. */
function extractVideos(blob) {
  const out = new Map();

  // Walk each videoId and look ahead for a title nearby
  const idRe = /"videoId":"([A-Za-z0-9_-]{11})"/g;
  let m;
  while ((m = idRe.exec(blob))) {
    const id = m[1];
    if (out.has(id)) continue;
    const window = blob.slice(m.index, m.index + 2500);
    const titleMatch =
      window.match(/"title":\{"runs":\[\{"text":"((?:\\.|[^"\\])*)"/) ||
      window.match(/"title":\{"simpleText":"((?:\\.|[^"\\])*)"/) ||
      window.match(/"accessibility":\{"accessibilityData":\{"label":"((?:\\.|[^"\\])*)"/);
    let title = titleMatch ? decodeTitle(titleMatch[1]) : "Lesson";
    // accessibility labels often look like "Title by Channel 12 minutes"
    if (title.includes(" by ") && title.length > 40) {
      title = title.split(" by ")[0].trim() || title;
    }
    out.set(id, {
      id,
      title,
      thumb: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      watch: `https://www.youtube.com/watch?v=${id}`,
      embed: `https://www.youtube.com/embed/${id}`,
    });
  }
  return [...out.values()];
}

function extractContinuation(blob) {
  return (
    blob.match(/"continuationCommand":\{"token":"([^"]+)"/)?.[1] ||
    blob.match(/"continuation":"([^"]+)"/)?.[1] ||
    null
  );
}

async function fetchInitialPlaylist(listId) {
  const res = await fetch(`https://www.youtube.com/playlist?list=${listId}`, {
    headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
  });
  const html = await res.text();
  return { videos: extractVideos(html), token: extractContinuation(html) };
}

async function fetchContinuation(token) {
  const body = {
    context: {
      client: {
        clientName: "WEB",
        clientVersion: "2.20240101.00.00",
        hl: "en",
        gl: "US",
      },
    },
    continuation: token,
  };
  const res = await fetch(
    `https://www.youtube.com/youtubei/v1/browse?key=${INNERTUBE_KEY}&prettyPrint=false`,
    {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": UA },
      body: JSON.stringify(body),
    },
  );
  const text = await res.text();
  return { videos: extractVideos(text), token: extractContinuation(text) };
}

async function syncChannel(ch) {
  const listId = uploadsPlaylist(ch.channelId);
  const seen = new Map();
  let page = await fetchInitialPlaylist(listId);
  for (const v of page.videos) seen.set(v.id, v);

  let token = page.token;
  let prev = "";
  for (let i = 0; i < 50 && token && token !== prev; i++) {
    prev = token;
    page = await fetchContinuation(token);
    for (const v of page.videos) seen.set(v.id, v);
    token = page.token;
    if (!page.videos.length) break;
  }

  if (seen.size < 5) {
    const res = await fetch(`https://www.youtube.com/@${ch.handle}/videos`, {
      headers: { "user-agent": UA, "accept-language": "en-US,en;q=0.9" },
    });
    for (const v of extractVideos(await res.text())) seen.set(v.id, v);
  }

  return {
    ...ch,
    url: `https://www.youtube.com/@${ch.handle}`,
    embedPlaylist: `https://www.youtube.com/embed/videoseries?list=${listId}`,
    uploadsPlaylistId: listId,
    count: seen.size,
    videos: [...seen.values()],
  };
}

const out = { syncedAt: new Date().toISOString(), channels: {} };
for (const ch of CHANNELS) {
  const data = await syncChannel(ch);
  out.channels[ch.lang] = data;
  console.log(`${ch.lang}: ${data.count} videos — sample: ${data.videos[0]?.title || "(none)"}`);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log(`wrote ${path.relative(ROOT, OUT)}`);
