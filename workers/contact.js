/**
 * Contact form Worker — accepts HTTPS JSON and delivers email.
 * Never uses mailto (that triggers Chrome's "not secure" warning).
 */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD = 400;
const MAX_MESSAGE = 5000;
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function corsHeaders(origin, extra = {}) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
    ...extra,
  };
  if (origin) headers["Access-Control-Allow-Origin"] = origin;
  return headers;
}

function isAllowedOrigin(origin, siteOrigin) {
  if (origin === siteOrigin) return true;
  if (origin === "https://trusthashem.org" || origin === "https://www.trusthashem.org") return true;
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

function json(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: corsHeaders(origin, { "Content-Type": "application/json" }),
  });
}

function clean(value, max) {
  if (typeof value !== "string") return "";
  return value.replace(/\r\n/g, "\n").trim().slice(0, max);
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("x-forwarded-for") || "unknown";
}

function rateLimited(ip) {
  const now = Date.now();
  const row = hits.get(ip) || [];
  const fresh = row.filter((t) => now - t < WINDOW_MS);
  if (fresh.length >= MAX_PER_WINDOW) {
    hits.set(ip, fresh);
    return true;
  }
  fresh.push(now);
  hits.set(ip, fresh);
  return false;
}

async function deliverWithBinding(env, payload) {
  if (!env.EMAIL || typeof env.EMAIL.send !== "function") return false;
  await env.EMAIL.send({
    to: env.CONTACT_TO,
    from: { email: `contact@${new URL(env.SITE_ORIGIN).hostname}`, name: env.CONTACT_FROM_NAME || "Trust Hashem" },
    replyTo: { email: payload.email, name: payload.name },
    subject: payload.subjectLine,
    text: payload.text,
    html: payload.html,
  });
  return true;
}

async function deliverWithFormsubmit(payload, to) {
  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
      _subject: payload.subjectLine,
      _replyto: payload.email,
      _template: "box",
      _captcha: "false",
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === "false" || data.success === false) {
    const err = new Error(data.message || "Could not deliver the message.");
    err.status = res.status;
    throw err;
  }
  return true;
}

export default {
  async fetch(request, env) {
    const origin = allowedOrigin(request, env.SITE_ORIGIN || "https://trusthashem.org");
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(origin || "*") });
    }

    if (request.method !== "POST") {
      return json({ error: "Not found." }, 404, origin);
    }

    if (!origin && request.headers.get("Origin")) {
      return json({ error: "Origin not allowed." }, 403, "");
    }

    if (rateLimited(clientIp(request))) {
      return json({ error: "Please wait a few minutes before sending another message." }, 429, origin);
    }

    let body = {};
    try {
      const ctype = request.headers.get("Content-Type") || "";
      if (ctype.includes("application/json")) {
        body = await request.json();
      } else {
        const form = await request.formData();
        body = Object.fromEntries(form.entries());
      }
    } catch {
      return json({ error: "Invalid form data." }, 400, origin);
    }

    if (clean(body.company || body.website || "", 80)) {
      return json({ ok: true }, 200, origin);
    }

    const name = clean(body.name, MAX_FIELD);
    const email = clean(body.email, MAX_FIELD).toLowerCase();
    const subject = clean(body.subject, MAX_FIELD);
    const message = clean(body.message, MAX_MESSAGE);

    if (name.length < 2) return json({ error: "Please enter your name." }, 400, origin);
    if (!EMAIL_RE.test(email)) return json({ error: "Please enter a valid email address." }, 400, origin);
    if (subject.length < 2) return json({ error: "Please enter a subject." }, 400, origin);
    if (message.length < 10) return json({ error: "Please enter a longer message." }, 400, origin);

    const to = env.CONTACT_TO || "bitachon@trusthashem.org";
    const subjectLine = `Trust Hashem contact: ${subject}`;
    const text = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
    const html = `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>`;
    const payload = { name, email, subject, message, subjectLine, text, html };

    try {
      try {
        const sent = await deliverWithBinding(env, payload);
        if (sent) return json({ ok: true }, 200, origin);
      } catch {
        /* fall through to HTTPS delivery */
      }
      await deliverWithFormsubmit(payload, to);
      return json({ ok: true }, 200, origin);
    } catch (err) {
      return json(
        { error: err.message || "Could not send the message. Please try again." },
        err.status && err.status < 500 ? err.status : 502,
        origin,
      );
    }
  },
};

