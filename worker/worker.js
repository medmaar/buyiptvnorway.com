/**
 * BuyIPTVNorway — Free Trial Worker
 * Language: English · Panel: Norway
 * RESEND_KEY loaded from Cloudflare Worker Secret (env.RESEND_KEY)
 */

const API_BASE    = "https://activationpanel.ru/api/api.php";
const API_KEY     = "35cf68cc83a3a82e1a0ac5361c7b6105";
const HOST        = "http://mag.trexlive.me";
const FROM_EMAIL  = "NorwayIPTV <contact@buyiptvnorway.com>";
const ADMIN_EMAIL = "contact@buyiptvnorway.com";
const SITE_URL    = "https://buyiptvnorway.com";
const PACK_NAME   = "Norway";
const WA_NUMBER   = "17828026280";
const DARK        = "#0a0414";
const RED         = "#fd0322";

function jsonRes(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
  });
}

async function apiGet(params) {
  const qs = new URLSearchParams({ ...params, api_key: API_KEY });
  const res = await fetch(`${API_BASE}?${qs}`);
  return { status: res.status, text: await res.text() };
}

async function sendEmail(to, subject, html, resendKey) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  });
  if (!res.ok) throw new Error(`Resend (${res.status}): ${await res.text()}`);
}

function emailWrap(content) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f2f2f2;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f2f2f2;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
           style="max-width:600px;background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
      <tr><td style="background-color:${DARK};padding:32px 40px;text-align:center;border-bottom:3px solid ${RED};">
        <h1 style="margin:0;font-family:Arial,sans-serif;font-size:26px;font-weight:bold;color:#ffffff;">NorwayIPTV</h1>
        <p style="margin:6px 0 0;font-family:Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.70);">Premium IPTV Norway · 4K Streaming</p>
      </td></tr>
      <tr><td style="padding:36px 40px;">${content}</td></tr>
      <tr><td style="background-color:#f8f8f8;border-top:1px solid #eeeeee;padding:18px 40px;text-align:center;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#aaaaaa;">
          © 2026 NorwayIPTV · <a href="${SITE_URL}" style="color:${RED};text-decoration:none;">buyiptvnorway.com</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function credBox(username, password, m3uUrl) {
  const server = (() => { try { return new URL(m3uUrl).origin; } catch { return HOST; } })();
  return `
  <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;color:#333333;">Xtream Codes</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:18px;">
    <tr><td style="padding:18px 22px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="padding:0 0 11px;border-bottom:1px solid #e8e8e8;">
          <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;">Server</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#333333;font-weight:bold;">${server}</p>
        </td></tr>
        <tr><td style="padding:11px 0;border-bottom:1px solid #e8e8e8;">
          <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;">Username</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#333333;font-weight:bold;">${username}</p>
        </td></tr>
        <tr><td style="padding:11px 0 0;">
          <p style="margin:0 0 2px;font-family:Arial,sans-serif;font-size:11px;color:#888888;text-transform:uppercase;">Password</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#333333;font-weight:bold;">${password}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
  <p style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:13px;font-weight:bold;color:#333333;">M3U Link</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#f8f8f8;border:1px solid #e0e0e0;border-radius:6px;margin-bottom:28px;">
    <tr><td style="padding:14px 20px;">
      <p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:${RED};word-break:break-all;">${m3uUrl}</p>
    </td></tr>
  </table>`;
}

function ctaButton(text, url) {
  return `
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
    <tr><td style="background-color:${RED};border-radius:8px;padding:14px 32px;text-align:center;">
      <a href="${url}" style="font-family:Arial,sans-serif;font-size:15px;font-weight:bold;color:#ffffff;text-decoration:none;">${text}</a>
    </td></tr>
  </table>`;
}

function replyYesBox() {
  return `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background-color:#fff5f5;border-left:4px solid ${RED};border-radius:6px;margin-bottom:22px;">
    <tr><td style="padding:20px 24px;">
      <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#8b0000;font-weight:bold;">
        📩 The fastest way?
      </p>
      <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#555555;">
        Simply reply <strong>"YES"</strong> to this email — we'll activate your subscription in minutes, no form, no hassle.
      </p>
    </td></tr>
  </table>`;
}

function welcomeEmail(name, username, password, m3uUrl) {
  const firstName = name ? name.split(" ")[0] : "";
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  return emailWrap(`
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:15px;color:#333333;">${greeting}</p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">Your free trial is ready! 🎉</p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      We've unlocked all countries and languages so you can fully test our service.
    </p>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:13px;line-height:1.65;color:#777777;font-style:italic;">
      Note: Don't worry if the channel list seems too long — you can always ask us to hide regions or categories you don't need!
    </p>
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;color:#555555;">Here are your login credentials:</p>
    ${credBox(username, password, m3uUrl)}
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Need help with setup? Reply to this email or reach us on WhatsApp:
      <a href="https://wa.me/${WA_NUMBER}" style="color:${RED};text-decoration:none;font-weight:bold;">+1 782-802-6280</a>
    </p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555555;">Best regards,<br><strong>The NorwayIPTV Team</strong></p>
  `);
}

function reminderEmail(name, username, password, m3uUrl) {
  const firstName = name ? name.split(" ")[0] : "";
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  return emailWrap(`
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:15px;color:#333333;">${greeting}</p>
    <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Your free trial <strong>expires in 4 hours</strong> ⏳ and honestly? We don't want to see you go.
    </p>
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      You've had a taste of what real streaming feels like. Crystal-clear 4K, live sports the moment the puck drops — NRK, TV2, Premier League, Eliteserien — and a library so deep you'll run out of weekends before you run out of things to watch.
    </p>
    <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      <strong>Don't let it end here.</strong>
    </p>
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Keep the same login. Keep the same quality. Just make it permanent.
    </p>
    ${replyYesBox()}
    <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Prefer to browse our plans first?
    </p>
    ${ctaButton("View Our Plans →", SITE_URL + "/pricing.html")}
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;color:#555555;">Your active credentials:</p>
    ${credBox(username, password, m3uUrl)}
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Questions? Reply to this email or reach us on WhatsApp:
      <a href="https://wa.me/${WA_NUMBER}" style="color:${RED};text-decoration:none;font-weight:bold;">+1 782-802-6280</a> — we're always here.
    </p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555555;">Best regards,<br><strong>The NorwayIPTV Team</strong></p>
  `);
}

function followupEmail(name) {
  const firstName = name ? name.split(" ")[0] : "";
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";
  return emailWrap(`
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:15px;color:#333333;">${greeting}</p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Your free trial has ended — but here's the thing: <strong>everything you just experienced? It's still waiting for you.</strong>
    </p>
    <p style="margin:0 0 16px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      The live sports. The late-night movies. The crystal-clear 4K that made your old streaming service look like a bad dream.
    </p>
    <p style="margin:0 0 22px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      All of it, one click away.
    </p>
    <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Here's how to get back in — same quality, zero interruption:
    </p>
    ${replyYesBox()}
    <p style="margin:0 0 14px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Prefer to choose your own plan?
    </p>
    ${ctaButton("Choose My Plan →", SITE_URL + "/pricing.html")}
    <p style="margin:0 0 20px;font-family:Arial,sans-serif;font-size:14px;line-height:1.65;color:#555555;">
      Any questions? Reply here or drop us a message on WhatsApp:
      <a href="https://wa.me/${WA_NUMBER}" style="color:${RED};text-decoration:none;font-weight:bold;">+1 782-802-6280</a> — we'd love to have you stay.
    </p>
    <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#555555;">Best regards,<br><strong>The NorwayIPTV Team</strong></p>
  `);
}

function adminEmail(name, email, country, device, whatsapp, notes, username, password, m3uUrl) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"></head>
<body style="font-family:Arial,sans-serif;font-size:14px;color:#333;padding:20px;">
  <h2 style="color:${RED};margin-top:0;">New Free Trial — NorwayIPTV</h2>
  <table cellpadding="6" cellspacing="0" border="0">
    <tr><td style="color:#888;width:120px;">Name</td><td><strong>${name}</strong></td></tr>
    <tr><td style="color:#888;">Email</td><td>${email}</td></tr>
    <tr><td style="color:#888;">Country</td><td>${country||"—"}</td></tr>
    <tr><td style="color:#888;">Device</td><td>${device||"—"}</td></tr>
    <tr><td style="color:#888;">WhatsApp</td><td>${whatsapp||"—"}</td></tr>
    <tr><td style="color:#888;">Notes</td><td>${notes||"—"}</td></tr>
    <tr><td colspan="2"><hr style="border:none;border-top:1px solid #eee;margin:8px 0;"></td></tr>
    <tr><td style="color:#888;">Username</td><td><strong>${username}</strong></td></tr>
    <tr><td style="color:#888;">Password</td><td><strong>${password}</strong></td></tr>
    <tr><td style="color:#888;">M3U</td><td style="word-break:break-all;font-size:12px;">${m3uUrl}</td></tr>
  </table>
</body></html>`;
}

async function handleFetch(request, env) {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    }});
  }
  if (request.method === "GET") {
    const u = new URL(request.url);
    if (u.searchParams.has("debug")) {
      const bq = await apiGet({ action: "bouquet" });
      const trials = await env.TRIALS.list();
      return jsonRes({ bouquet: bq.text.slice(0,400), kv_keys: trials.keys.length });
    }
    return new Response("NorwayIPTV Trial Worker — OK", { status: 200 });
  }
  if (request.method !== "POST") return jsonRes({ success: false, error: "POST only" }, 405);

  let body;
  try { body = await request.json(); }
  catch { return jsonRes({ success: false, error: "Invalid JSON" }, 400); }

  const { name, email, country, device, whatsapp, notes } = body;
  if (!email) return jsonRes({ success: false, error: "Email required" }, 400);

  let step = "bouquet";
  try {
    const bqRes = await apiGet({ action: "bouquet" });
    let packId = "all";
    if (bqRes.text.trim().startsWith("[") || bqRes.text.trim().startsWith("{")) {
      const arr = JSON.parse(bqRes.text);
      const list = Array.isArray(arr) ? arr : Object.values(arr);
      const pkg = list.find(b => (b.name || "").trim().toLowerCase() === PACK_NAME.toLowerCase());
      if (pkg) packId = pkg.id;
    }

    step = "create_demo";
    const crRes = await apiGet({
      action: "new", type: "m3u", sub: "99", pack: packId,
      note: `Trial / buyiptvnorway.com / ${email} | ${whatsapp || ""}`,
    });
    if (!crRes.text.trim().startsWith("[") && !crRes.text.trim().startsWith("{")) {
      throw new Error(`Panel non-JSON: ${crRes.text.slice(0, 200)}`);
    }
    const crData = JSON.parse(crRes.text);
    const item = Array.isArray(crData) ? crData[0] : crData;
    if (!item || String(item.status) !== "true") {
      throw new Error(`Panel: ${item?.message || JSON.stringify(item)}`);
    }

    step = "extract";
    const rawUrl = item.url || "";
    let username = "", password = "";
    try { const u = new URL(rawUrl); username = u.searchParams.get("username") || ""; password = u.searchParams.get("password") || ""; } catch {}
    const m3uUrl = `${HOST}/get.php?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&type=m3u_plus&output=ts`;

    step = "email_client";
    await sendEmail(email, "Your NorwayIPTV Free Trial is Ready — 24H Access Activated ✓", welcomeEmail(name, username, password, m3uUrl), env.RESEND_KEY);

    step = "email_admin";
    await sendEmail(ADMIN_EMAIL, `Automation / buyiptvnorway.com / trial / ${name || "—"} / ${email}`, adminEmail(name, email, country, device, whatsapp, notes, username, password, m3uUrl), env.RESEND_KEY);

    step = "kv_store";
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    await env.TRIALS.put(
      `trial:${email}`,
      JSON.stringify({ name, email, username, password, m3uUrl, expiry, reminder_sent: false, followup_sent: false }),
      { expirationTtl: 4 * 24 * 60 * 60 }
    );

    return jsonRes({ success: true });

  } catch (err) {
    console.error(`[step=${step}]`, err.message);
    return jsonRes({ success: false, error: `[${step}] ${err.message}` }, 500);
  }
}

async function handleScheduled(env) {
  const now = Date.now();
  const FOUR_HOURS = 4 * 60 * 60 * 1000;
  const { keys } = await env.TRIALS.list({ prefix: "trial:" });
  console.log(`[cron] Checking ${keys.length} trials`);

  for (const { name: key } of keys) {
    let trial;
    try { const raw = await env.TRIALS.get(key); if (!raw) continue; trial = JSON.parse(raw); } catch { continue; }
    const { name, email, username, password, m3uUrl, expiry, reminder_sent, followup_sent } = trial;

    if (!reminder_sent && now >= expiry - FOUR_HOURS && now < expiry) {
      try {
        await sendEmail(email, "⏳ Your NorwayIPTV Trial Expires in 4 Hours", reminderEmail(name, username, password, m3uUrl), env.RESEND_KEY);
        trial.reminder_sent = true;
        await env.TRIALS.put(key, JSON.stringify(trial), { expirationTtl: 4 * 24 * 60 * 60 });
        console.log(`[cron] Reminder → ${email}`);
      } catch (e) { console.error(`[cron] Reminder failed:`, e.message); }
    }

    if (!followup_sent && now >= expiry) {
      try {
        await sendEmail(email, "Your NorwayIPTV Trial Has Ended — Come Back Anytime 🎬", followupEmail(name), env.RESEND_KEY);
        trial.followup_sent = true;
        await env.TRIALS.put(key, JSON.stringify(trial), { expirationTtl: 4 * 24 * 60 * 60 });
        console.log(`[cron] Follow-up → ${email}`);
      } catch (e) { console.error(`[cron] Follow-up failed:`, e.message); }
    }
  }
}

export default {
  async fetch(request, env) { return handleFetch(request, env); },
  async scheduled(event, env, ctx) { ctx.waitUntil(handleScheduled(env)); },
};
