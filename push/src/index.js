/* boogie-push — a tiny Cloudflare Worker that relays Web Push for Boogie.
   Free tier, no Firebase Blaze plan needed. The app, after writing an
   announcement or a DM, POSTs the recipients' push subscriptions here and
   this Worker encrypts and sends them (VAPID).

   POST /notify  {key, subs:[{endpoint,keys}], payload:{title, body, url, tag}}
   → {results:[{endpoint, status}]}   (404/410 means: drop that subscription)

   Secrets (wrangler secret put …): VAPID_JWK (private key, JSON) ·
   Vars (wrangler.toml): VAPID_PUBLIC, VAPID_SUBJECT, PUSH_KEY, ALLOW_ORIGINS */
import { sendPush } from "./webpush.js";

// Only real browser push services — the Worker is never a general-purpose relay.
const PUSH_HOSTS = [
  /^fcm\.googleapis\.com$/, /^android\.googleapis\.com$/,     // Chrome, Edge-on-Android, most Android browsers
  /^web\.push\.apple\.com$/,                                  // Safari / iOS home-screen apps
  /\.push\.services\.mozilla\.com$/,                          // Firefox
  /\.notify\.windows\.com$/,                                  // Edge on Windows
];
const okEndpoint = e => { try { const u = new URL(e); return u.protocol === "https:" && PUSH_HOSTS.some(r => r.test(u.hostname)); } catch { return false; } };

function cors(req, env) {
  const origin = req.headers.get("Origin") || "";
  const allowed = (env.ALLOW_ORIGINS || "").split(",").map(s => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0] || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}
const json = (obj, status, h) => new Response(JSON.stringify(obj), { status, headers: { ...h, "Content-Type": "application/json" } });

export default {
  async fetch(req, env) {
    const h = cors(req, env);
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: h });
    const url = new URL(req.url);
    if (req.method === "GET" && url.pathname === "/") return json({ ok: true, service: "boogie-push" }, 200, h);
    if (req.method !== "POST" || url.pathname !== "/notify") return json({ error: "not found" }, 404, h);

    let msg;
    try { msg = await req.json(); } catch { return json({ error: "bad json" }, 400, h); }
    if (!msg || msg.key !== env.PUSH_KEY) return json({ error: "forbidden" }, 403, h);
    const subs = (Array.isArray(msg.subs) ? msg.subs : []).filter(s => s && okEndpoint(s.endpoint) && s.keys && s.keys.p256dh && s.keys.auth).slice(0, 200);
    const p = msg.payload || {};
    const payload = {
      title: String(p.title || "Boogie").slice(0, 120),
      body: String(p.body || "").slice(0, 400),
      url: String(p.url || "./").slice(0, 300),
      tag: String(p.tag || "boogie").slice(0, 60),
    };
    const vapid = { jwk: JSON.parse(env.VAPID_JWK), publicKey: env.VAPID_PUBLIC, subject: env.VAPID_SUBJECT };
    const results = await Promise.all(subs.map(async s => {
      try { return { endpoint: s.endpoint, status: await sendPush(s, payload, vapid, { topic: payload.tag }) }; }
      catch (e) { return { endpoint: s.endpoint, status: 0, error: String(e && e.message || e) }; }
    }));
    return json({ results }, 200, h);
  },
};
