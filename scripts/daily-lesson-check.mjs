/**
 * Independent daily lesson checker — no Cloudflare D1/KV.
 * Reads/writes local state file and emails bitachon@ via FormSubmit
 * when the Bitachon podcast or YouTube channels have a new item.
 *
 * Also fans out to addresses listed in src/data/daily-subscribers.json
 * (optional plain JSON file you maintain — still no cloud database).
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const STATE_FILE = path.join(ROOT, "scripts", ".daily-lesson-state.json");
const SUBS_FILE = path.join(ROOT, "src", "data", "daily-subscribers.json");
const CONTACT = process.env.DAILY_LESSON_TO || "bitachon@trusthashem.org";
const BITACHON_RSS = "https://rss.jewishpodcasts.fm/rss/861";
const BITACHON_URL = "https://jewishpodcasts.fm/bitachon";
const YT = {
  en: "https://www.youtube.com/feeds/videos.xml?channel_id=UCrjPPpQXzsB60_Z2m6Ux0LA",
  es: "https://www.youtube.com/feeds/videos.xml?channel_id=UCri3wFr3GBlAt9EJ7xUCJtA",
};

function readJson(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function parseRssLatest(xml) {
  const item = xml.match(/<item>([\s\S]*?)<\/item>/i)?.[1] || "";
  const title =
    item.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1] ||
    item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ||
    "";
  const guid =
    item.match(/<guid[^>]*>([\s\S]*?)<\/guid>/i)?.[1] ||
    item.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ||
    title;
  const link = item.match(/<link>([\s\S]*?)<\/link>/i)?.[1]?.trim() || BITACHON_URL;
  return {
    id: String(guid || "").trim(),
    title: String(title || "").replace(/<[^>]+>/g, "").trim(),
    link,
  };
}

function parseAtomLatest(xml) {
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/i)?.[1] || "";
  const title =
    entry.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() || "";
  const id =
    entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/i)?.[1] ||
    entry.match(/<id>([\s\S]*?)<\/id>/i)?.[1] ||
    title;
  const link = entry.match(/<link[^>]+href="([^"]+)"/i)?.[1] || "";
  return { id: String(id || "").trim(), title, link };
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      Accept: "application/rss+xml, application/atom+xml, application/xml, text/xml",
      "User-Agent": "TrustHashemDailyLessonBot/1.0",
    },
  });
  if (!res.ok) throw new Error(`${url} → ${res.status}`);
  return res.text();
}

async function sendFormSubmit(to, { subject, message, replyTo }) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: "Trust Hashem Daily Lesson",
      email: replyTo || CONTACT,
      subject,
      message,
      _subject: subject,
      _replyto: replyTo || CONTACT,
      _template: "box",
      _captcha: "false",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === "false" || data.success === false) {
    throw new Error(data.message || `FormSubmit failed for ${to}`);
  }
}

async function main() {
  const state = readJson(STATE_FILE, {});
  const updates = [];

  try {
    const podcast = parseRssLatest(await fetchText(BITACHON_RSS));
    if (podcast.id && podcast.id !== state.podcast) {
      updates.push({
        kind: "Bitachon podcast",
        title: podcast.title || "New episode",
        link: podcast.link || BITACHON_URL,
        key: "podcast",
        id: podcast.id,
      });
    }
  } catch (err) {
    console.warn("podcast check failed:", err.message);
  }

  for (const [lang, url] of Object.entries(YT)) {
    try {
      const video = parseAtomLatest(await fetchText(url));
      const key = `yt_${lang}`;
      if (video.id && video.id !== state[key]) {
        updates.push({
          kind: lang === "es" ? "Spanish video" : "English video",
          title: video.title || "New video",
          link: video.link || `https://www.youtube.com/watch?v=${video.id}`,
          key,
          id: video.id,
        });
      }
    } catch (err) {
      console.warn(`${lang} youtube check failed:`, err.message);
    }
  }

  if (!updates.length) {
    console.log("No new lessons.");
    return;
  }

  const lines = updates.map((u) => `• ${u.kind}: ${u.title}\n  ${u.link}`).join("\n\n");
  const subject =
    updates.length === 1
      ? `New Hisook Bitachon lesson: ${updates[0].title}`
      : `New Hisook Bitachon lessons (${updates.length} updates)`;
  const message = `Shalom,

A new Hisook Bitachon lesson is ready:

${lines}

Listen: ${BITACHON_URL}
Watch: https://trusthashem.org/videos/

— Trust Hashem daily lesson checker`;

  await sendFormSubmit(CONTACT, { subject: `[Daily lesson] ${subject}`, message });

  const subs = readJson(SUBS_FILE, { emails: [] });
  const emails = Array.isArray(subs.emails)
    ? [...new Set(subs.emails.map((e) => String(e).trim().toLowerCase()).filter(Boolean))]
    : [];

  let sent = 0;
  for (const email of emails) {
    try {
      await sendFormSubmit(email, {
        subject,
        message,
        replyTo: CONTACT,
      });
      sent += 1;
    } catch (err) {
      console.warn(`subscriber ${email}:`, err.message);
    }
  }

  for (const u of updates) state[u.key] = u.id;
  state.checkedAt = new Date().toISOString();
  writeJson(STATE_FILE, state);

  console.log(`Updates: ${updates.length}; emailed ${CONTACT}; subscribers sent: ${sent}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
