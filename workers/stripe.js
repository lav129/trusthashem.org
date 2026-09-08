/**
 * Stripe Checkout Worker — processing-fee payments only.
 * PayPal donations stay on the existing hosted button. These two systems
 * are not connected (no Connect, no split, no shared customer).
 *
 * Secret key: STRIPE_SECRET_KEY (restricted rk_ preferred). Never sent to the browser.
 */

const STRIPE_API = "https://api.stripe.com/v1";
const STRIPE_VERSION = "2026-07-29.dahlia";
const FEE_RATE = 0.02;
const MIN_DONATION_CENTS = 100;
const MAX_DONATION_CENTS = 10_000_000;
const STRIPE_MIN_CHARGE_CENTS = 50;
const SESSION_ID_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;
const IDEMPOTENCY_RE = /^[A-Za-z0-9._:-]{8,255}$/;

function feeCentsFromDonation(donationCents) {
  return Math.max(Math.round(donationCents * FEE_RATE), STRIPE_MIN_CHARGE_CENTS);
}

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

function flattenParams(value, prefix, out) {
  if (value == null) return;
  if (Array.isArray(value)) {
    value.forEach((item, i) => flattenParams(item, `${prefix}[${i}]`, out));
    return;
  }
  if (typeof value === "object") {
    for (const [key, nested] of Object.entries(value)) {
      flattenParams(nested, prefix ? `${prefix}[${key}]` : key, out);
    }
    return;
  }
  out.append(prefix, String(value));
}

function createStripeClient(secretKey) {
  async function request(method, path, params, idempotencyKey) {
    const headers = {
      Authorization: `Bearer ${secretKey}`,
      "Stripe-Version": STRIPE_VERSION,
    };
    let body;
    if (method === "POST") {
      headers["Content-Type"] = "application/x-www-form-urlencoded";
      const encoded = new URLSearchParams();
      flattenParams(params, "", encoded);
      body = encoded;
    }
    if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;

    const res = await fetch(`${STRIPE_API}${path}`, { method, headers, body });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = data?.error?.message || "Stripe request failed";
      const err = new Error(message);
      err.status = res.status;
      err.payload = data;
      throw err;
    }
    return data;
  }

  return {
    checkout: {
      sessions: {
        create: (params, { idempotencyKey } = {}) =>
          request("POST", "/checkout/sessions", params, idempotencyKey),
        retrieve: (id) =>
          request("GET", `/checkout/sessions/${encodeURIComponent(id)}`),
      },
    },
  };
}

function parseDonationCents(body) {
  const raw = body?.donationAmount ?? body?.amount ?? body?.donation_cents;
  if (raw == null || raw === "") return null;
  if (typeof raw === "number" && Number.isFinite(raw) && raw >= MIN_DONATION_CENTS && Number.isInteger(raw)) {
    return raw;
  }
  const dollars = Number(raw);
  if (!Number.isFinite(dollars) || dollars <= 0) return null;
  return Math.round(dollars * 100);
}

function safeReturnPath(path) {
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) return "/donate/";
  if (path.includes("://") || path.includes("\\") || path.includes("..")) return "/donate/";
  if (!/^\/[A-Za-z0-9/_-]*\/?$/.test(path)) return "/donate/";
  return path.endsWith("/") ? path : `${path}/`;
}

function integrationId() {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const suffix = Array.from(bytes, (b) => alphabet[b % 26]).join("");
  return `thdonate_${suffix}`;
}

async function createCheckout(request, env, origin) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe is not configured." }, 500, origin);
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body." }, 400, origin);
  }

  const donationCents = parseDonationCents(body);
  if (donationCents == null || donationCents < MIN_DONATION_CENTS) {
    return json({ error: "Enter a donation of at least $1.00." }, 400, origin);
  }
  if (donationCents > MAX_DONATION_CENTS) {
    return json({ error: "That amount is too large." }, 400, origin);
  }

  const feeCents = feeCentsFromDonation(donationCents);
  const returnOrigin = origin || env.SITE_ORIGIN || "https://trusthashem.org";
  const returnPath = safeReturnPath(body.returnPath);
  const returnUrl = `${returnOrigin}${returnPath}?session_id={CHECKOUT_SESSION_ID}`;

  const idempotencyKey = request.headers.get("Idempotency-Key") || body.idempotencyKey;
  if (idempotencyKey && !IDEMPOTENCY_RE.test(idempotencyKey)) {
    return json({ error: "Invalid idempotency key." }, 400, origin);
  }

  const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
  const sessionParams = {
    mode: "payment",
    ui_mode: "embedded_page",
    redirect_on_completion: "if_required",
    return_url: returnUrl,
    submit_type: "pay",
    managed_payments: { enabled: false },
    integration_identifier: integrationId(),
    metadata: {
      kind: "processing_fee",
      donation_cents: String(donationCents),
      fee_cents: String(feeCents),
    },
    payment_intent_data: {
      metadata: {
        kind: "processing_fee",
        donation_cents: String(donationCents),
        fee_cents: String(feeCents),
      },
    },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: feeCents,
          product_data: {
            name: "Processing fee",
          },
        },
      },
    ],
  };
  const opts = { idempotencyKey: idempotencyKey || crypto.randomUUID() };

  try {
    let session;
    try {
      session = await stripe.checkout.sessions.create(sessionParams, opts);
    } catch (err) {
      if (!/ui_mode/i.test(err.message || "")) throw err;
      session = await stripe.checkout.sessions.create(
        { ...sessionParams, ui_mode: "embedded" },
        { idempotencyKey: `${opts.idempotencyKey}-embedded` },
      );
    }

    if (!session.client_secret) {
      return json({ error: "Stripe did not return a client secret." }, 502, origin);
    }

    return json(
      {
        clientSecret: session.client_secret,
        sessionId: session.id,
        feeCents,
        donationCents,
      },
      200,
      origin,
    );
  } catch (err) {
    return json(
      { error: err.message || "Could not start checkout." },
      err.status && err.status < 500 ? err.status : 502,
      origin,
    );
  }
}

async function verifySession(request, env, origin) {
  if (!env.STRIPE_SECRET_KEY) {
    return json({ error: "Stripe is not configured." }, 500, origin);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id") || "";
  if (!SESSION_ID_RE.test(sessionId)) {
    return json({ paid: false, error: "Missing or invalid session." }, 400, origin);
  }

  const stripe = createStripeClient(env.STRIPE_SECRET_KEY);
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid = session.payment_status === "paid";
    const donationCents = Number(session.metadata?.donation_cents || 0);
    const feeCents = Number(session.metadata?.fee_cents || session.amount_total || 0);
    return json(
      {
        paid,
        status: session.status,
        payment_status: session.payment_status,
        donationCents: Number.isFinite(donationCents) ? donationCents : 0,
        feeCents: Number.isFinite(feeCents) ? feeCents : 0,
      },
      200,
      origin,
    );
  } catch (err) {
    return json(
      { paid: false, error: err.message || "Could not verify payment." },
      err.status && err.status < 500 ? err.status : 502,
      origin,
    );
  }
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

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    if (request.method === "POST" && (path === "/create-checkout-session" || path === "/")) {
      return createCheckout(request, env, origin);
    }
    if (request.method === "GET" && (path === "/verify-session" || path === "/session-status")) {
      return verifySession(request, env, origin);
    }

    return json({ error: "Not found." }, 404, origin);
  },
};
