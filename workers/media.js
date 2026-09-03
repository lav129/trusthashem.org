import https from "node:https";
import { Readable } from "node:stream";

const ORIGIN_HOST = "ftp.trusthashem.org";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Range",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
};

function originRequest(path, method, range) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        host: ORIGIN_HOST,
        servername: ORIGIN_HOST,
        port: 443,
        path,
        method,
        rejectUnauthorized: false,
        headers: {
          Host: ORIGIN_HOST,
          "User-Agent": "TrustHashemMedia/1.0",
          ...(range ? { Range: range } : {}),
        },
      },
      (res) => resolve(res),
    );
    req.on("error", reject);
    req.setTimeout(25000, () => {
      req.destroy(new Error("origin timeout"));
    });
    req.end();
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }
    if (!url.pathname.startsWith("/wp-content/")) {
      return new Response("Not found", { status: 404, headers: cors });
    }

    const path = url.pathname + url.search;
    const method = request.method === "HEAD" ? "HEAD" : "GET";
    const range = request.headers.get("Range");

    let res;
    try {
      res = await originRequest(path, method, range);
    } catch (err) {
      return new Response("Audio origin unavailable", {
        status: 502,
        headers: { ...cors, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const headers = new Headers(cors);
    const pass = [
      "content-type",
      "content-length",
      "content-range",
      "accept-ranges",
      "etag",
      "last-modified",
      "cache-control",
    ];
    for (const key of pass) {
      const value = res.headers[key];
      if (value) headers.set(key, String(value));
    }
    if (!headers.has("Accept-Ranges")) headers.set("Accept-Ranges", "bytes");
    if (!headers.has("Cache-Control")) headers.set("Cache-Control", "public, max-age=86400");
    headers.set("X-Content-Type-Options", "nosniff");

    if (method === "HEAD") {
      res.resume();
      return new Response(null, { status: res.statusCode || 200, headers });
    }

    return new Response(Readable.toWeb(res), {
      status: res.statusCode || 200,
      headers,
    });
  },
};
