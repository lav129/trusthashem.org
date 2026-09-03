import http from "node:http";
import https from "node:https";

const PORT = Number(process.env.PORT || 8787);
const ORIGIN = "ftp.trusthashem.org";

const server = http.createServer((req, res) => {
  const path = req.url || "/";
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Range",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    });
    res.end();
    return;
  }
  if (!path.startsWith("/wp-content/")) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
    return;
  }

  const upstream = https.request(
    {
      hostname: ORIGIN,
      path,
      method: req.method === "HEAD" ? "HEAD" : "GET",
      rejectUnauthorized: false,
      headers: {
        Host: ORIGIN,
        "User-Agent": "TrustHashemLocalMedia/1.0",
        ...(req.headers.range ? { Range: req.headers.range } : {}),
      },
    },
    (up) => {
      const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Expose-Headers": "Content-Length, Content-Range, Accept-Ranges",
        "Content-Type": up.headers["content-type"] || "application/ogg",
        "Accept-Ranges": up.headers["accept-ranges"] || "bytes",
        "Cache-Control": "public, max-age=86400",
      };
      if (up.headers["content-length"]) headers["Content-Length"] = up.headers["content-length"];
      if (up.headers["content-range"]) headers["Content-Range"] = up.headers["content-range"];
      if (up.headers.etag) headers.ETag = up.headers.etag;
      res.writeHead(up.statusCode || 502, headers);
      if (req.method === "HEAD") {
        up.resume();
        res.end();
        return;
      }
      up.pipe(res);
    },
  );
  upstream.on("error", (err) => {
    res.writeHead(502, { "Content-Type": "text/plain" });
    res.end(String(err.message || err));
  });
  upstream.end();
});

server.listen(PORT, () => {
  console.log(`media proxy on http://127.0.0.1:${PORT}`);
});
