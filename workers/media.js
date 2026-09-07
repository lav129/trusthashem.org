/** Proxies existing FTP audio via local media proxy (localhost.run). No extra storage. */
const ORIGIN = "https://e4e76878c119c9.lhr.life";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers":
    "Content-Length, Content-Range, Accept-Ranges, Content-Disposition",
};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (!url.pathname.startsWith("/wp-content/")) {
      return new Response("Not found", { status: 404, headers: cors });
    }

    const headers = new Headers();
    if (request.headers.get("Range")) headers.set("Range", request.headers.get("Range"));
    headers.set("User-Agent", "TrustHashemMedia/1.0");

    let res;
    try {
      res = await fetch(ORIGIN + url.pathname, {
        method: request.method === "HEAD" ? "HEAD" : "GET",
        headers,
      });
    } catch {
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
