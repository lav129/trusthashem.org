/**
 * Stripe Checkout Worker — processing-fee payments are retired.
 * Donations go directly through the existing PayPal hosted button.
 */

function corsHeaders(origin, extra = {}) {
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Idempotency-Key",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    ...extra,
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function allowedOrigin(request, siteOrigin) {
  const origin = request.headers.get("Origin") || "";
  if (origin && isAllowedOrigin(origin, siteOrigin)) return origin;
  const referer = request.headers.get("Referer") || "";
  try {
    const refOrigin = referer ? new URL(referer).origin : "";
    if (refOrigin && isAllowedOrigin(refOrigin, siteOrigin)) return refOrigin;
  } catch {
    /* ignore */
  }
  return "";
}

function isAllowedOrigin(origin, siteOrigin) {
  if (origin === siteOrigin) return true;
  if (origin === "https://trusthashem.org" || origin === "https://www.trusthashem.org") {
    return true;
  }
  try {
    const { protocol, hostname } = new URL(origin);
    if (
      (protocol === "http:" || protocol === "https:") &&
      (hostname === "localhost" || hostname === "127.0.0.1")
    ) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin, { "Content-Type": "application/json" }),
  });
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env.SITE_ORIGIN || "https://trusthashem.org");
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin || "*") });
    }

    if (!origin && request.headers.get("Origin")) {
      return json({ error: "Origin not allowed." }, 403, "");
    }

    return json(
      {
        error: "Processing fees are no longer collected. Please donate through PayPal.",
      },
      410,
      origin,
    );
  },
};
