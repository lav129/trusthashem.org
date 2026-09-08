/** Proxies existing origin audio via the hosting IP. No extra storage. */
const AUDIO_HOST = "trusthashem.org";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers":
    "Content-Length, Content-Range, Accept-Ranges, Content-Disposition",
};

function isAudioResponse(res) {
  if (!(res.ok || res.status === 206)) return false;
  const type = (res.headers.get("Content-Type") || "").toLowerCase();
  if (!type || type.includes("text/html")) return false;
  return (
    type.includes("ogg") ||
    type.includes("audio") ||
    type.includes("mpeg") ||
    type.includes("octet-stream") ||
    type.includes("mp4")
  );
}

async function fetchUpstream(pathname, request) {
  const headers = new Headers();
  if (request.headers.get("Range")) headers.set("Range", request.headers.get("Range"));
  headers.set("User-Agent", "TrustHashemMedia/1.0");
  headers.set("Accept", "*/*");
  const method = request.method === "HEAD" ? "HEAD" : "GET";

  const attempts = [
    {
      url: `https://${AUDIO_HOST}${pathname}`,
      init: { cf: { resolveOverride: "ftp.trusthashem.org" } },
    },
    {
      url: `https://ftp.trusthashem.org${pathname}`,
    },
  ];

  for (const attempt of attempts) {
    try {
      const res = await fetch(attempt.url, {
        method,
        headers,
        redirect: "manual",
        ...attempt.init,
      });
      if (isAudioResponse(res)) return res;
    } catch {
      /* try next */
    }
  }
  return null;
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (!url.pathname.startsWith("/wp-content/")) {
      return new Response("Not found", { status: 404, headers: cors });
    }

    const res = await fetchUpstream(url.pathname, request);
    if (!res) {
      return new Response("Upstream unreachable", { status: 502, headers: cors });
    }

    const out = new Headers(res.headers);
    out.set("Access-Control-Allow-Origin", "*");
    out.set(
      "Access-Control-Expose-Headers",
      "Content-Length, Content-Range, Accept-Ranges, Content-Disposition",
    );
    out.delete("Set-Cookie");
    if (!out.has("Cache-Control")) out.set("Cache-Control", "public, max-age=3600");

    const fileName = decodeURIComponent(url.pathname.split("/").pop() || "lesson.ogg");
    out.set(
      "Content-Disposition",
      url.searchParams.has("download")
        ? `attachment; filename="${fileName.replace(/"/g, "")}"`
        : "inline",
    );

    return new Response(res.body, { status: res.status, headers: out });
  },
};
