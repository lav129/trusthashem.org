export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Range",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        },
      });
    }
    if (!url.pathname.startsWith("/wp-content/")) {
      return new Response("Not found", { status: 404 });
    }
    const path = url.pathname + url.search;
    const headers = new Headers();
    if (request.headers.get("Range")) headers.set("Range", request.headers.get("Range"));
    const res = await fetch("http://ftp.trusthashem.org" + path, {
      method: request.method === "HEAD" ? "HEAD" : "GET",
      headers,
      redirect: "follow",
    });
    const out = new Headers(res.headers);
    out.set("Access-Control-Allow-Origin", "*");
    out.set("Access-Control-Expose-Headers", "Content-Length, Content-Range, Accept-Ranges");
    out.delete("Set-Cookie");
    return new Response(res.body, { status: res.status, headers: out });
  },
};
