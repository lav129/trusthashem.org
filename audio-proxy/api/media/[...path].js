import https from "node:https";

const ORIGIN_IP = "66.96.162.144";
const ORIGIN_HOST = "trusthashem.org";

function originLookup(_hostname, options, callback) {
  const result = { address: ORIGIN_IP, family: 4 };
  if (typeof options === "function") {
    callback = options;
    options = {};
  }
  if (options?.all) callback(null, [result]);
  else callback(null, result.address, result.family);
}

function audioContentType(pathname, upstream) {
  const path = pathname.split("?")[0].toLowerCase();
  if (path.endsWith(".ogg")) return "audio/ogg";
  if (path.endsWith(".mp3")) return "audio/mpeg";
  if (path.endsWith(".wav")) return "audio/wav";
  if (path.endsWith(".m4a") || path.endsWith(".mp4")) return "audio/mp4";
  return upstream || "application/octet-stream";
}

function originPathname(req) {
  const url = new URL(req.url || "/", "https://proxy.local");
  let pathname = url.pathname.replace(/^\/api/, "");
  if (pathname.startsWith("/media/")) pathname = `/wp-content${pathname.slice("/media".length)}`;
  const parts = req.query?.path;
  if (pathname === "/media" || pathname === "/media/") {
    if (Array.isArray(parts) && parts.length) pathname = `/wp-content/${parts.join("/")}`;
    else if (typeof parts === "string" && parts) pathname = `/wp-content/${parts}`;
  }
  return pathname;
}

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.setHeader(
    "Access-Control-Expose-Headers",
    "Content-Length, Content-Range, Accept-Ranges, Content-Type",
  );

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.statusCode = 405;
    res.end("Method not allowed");
    return;
  }

  const pathname = originPathname(req);
  if (!pathname.startsWith("/wp-content/uploads/") || pathname.includes("..")) {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  const headers = {
    Host: ORIGIN_HOST,
    "User-Agent": "curl/8.5.0",
    Accept: "*/*",
  };
  if (req.headers.range) headers.Range = req.headers.range;

  const originReq = https.request(
    {
      hostname: ORIGIN_HOST,
      port: 443,
      path: pathname,
      method: req.method,
      headers,
      lookup: originLookup,
      timeout: 25000,
    },
    (originRes) => {
      const status = originRes.statusCode || 502;
      if (status >= 400 && status !== 416) {
        originRes.resume();
        res.statusCode = status === 404 ? 404 : 502;
        res.end("Upstream error");
        return;
      }

      const out = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers":
          "Content-Length, Content-Range, Accept-Ranges, Content-Type",
        "Accept-Ranges": originRes.headers["accept-ranges"] || "bytes",
        "Content-Type": audioContentType(pathname, originRes.headers["content-type"]),
        "Cache-Control": "public, max-age=86400, immutable",
      };
      if (originRes.headers["content-length"]) out["Content-Length"] = originRes.headers["content-length"];
      if (originRes.headers["content-range"]) out["Content-Range"] = originRes.headers["content-range"];
      if (originRes.headers.etag) out.ETag = originRes.headers.etag;
      if (originRes.headers["last-modified"]) out["Last-Modified"] = originRes.headers["last-modified"];

      res.writeHead(status, out);
      if (req.method === "HEAD") {
        originRes.resume();
        res.end();
        return;
      }
      originRes.pipe(res);
    },
  );

  originReq.on("timeout", () => originReq.destroy(new Error("timeout")));
  originReq.on("error", () => {
    if (!res.headersSent) {
      res.statusCode = 502;
      res.end("Upstream unreachable");
    } else res.destroy();
  });
  originReq.end();
}

export const config = {
  maxDuration: 60,
  api: { responseLimit: false },
};
