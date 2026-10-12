import { EMAIL, WHATSAPP_DISPLAY } from "@/lib/contact";
import type { OrderRow } from "@/lib/db";
import { formatINR } from "@/lib/format";

/**
 * Server-only: order emails sent through Resend (https://resend.com), API key in RESEND_KEY.
 * The sender's domain must be verified in Resend, or Resend refuses to send.
 */

const SITE = "https://www.veronaarts.com";
const FROM = process.env.EMAIL_FROM || "Verona Arts <orders@veronaarts.com>";
/** Where new-order alerts go. */
const SHOP_INBOX = process.env.ORDER_NOTIFY_EMAIL || EMAIL;

const ENTITIES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ENTITIES[c]);

async function send(email: { to: string; subject: string; html: string; replyTo: string; idempotencyKey: string }) {
  const key = process.env.RESEND_KEY;
  if (!key) {
    console.warn(`email: RESEND_KEY not set, skipped "${email.subject}"`);
    return;
  }
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      // A retried webhook or a double call can't send the same email twice.
      "Idempotency-Key": email.idempotencyKey,
    },
    body: JSON.stringify({ from: FROM, to: [email.to], subject: email.subject, html: email.html, reply_to: email.replyTo }),
    cache: "no-store",
  });
  if (!res.ok) console.error(`email: "${email.subject}" to ${email.to} failed: ${res.status} ${await res.text()}`);
}

function orderTable(o: OrderRow) {
  const row = (label: string, value: string, strong = false) =>
    `<tr><td style="padding:4px 0;color:#5c6a61">${label}</td><td style="padding:4px 0;text-align:right;${strong ? "font-weight:600;color:#1f3d2b" : ""}">${value}</td></tr>`;
  const items = o.lines
    .map((l) => {
      const extras = [l.sizeLabel, l.addons.frame && "Frame", l.addons.giftWrap && "Gift wrap", l.addons.express && "Express"].filter(Boolean).join(" · ");
      return `<tr><td style="padding:8px 0;border-bottom:1px solid #ebe2d2">${esc(l.title)} × ${l.qty}<br><span style="font-size:12px;color:#5c6a61">${esc(extras)}</span></td><td style="padding:8px 0;border-bottom:1px solid #ebe2d2;text-align:right;vertical-align:top">${formatINR(l.lineTotal)}</td></tr>`;
    })
    .join("");
  return `<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;border-collapse:collapse">${items}</table>
<table width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;margin-top:8px">
${row("Subtotal", formatINR(o.subtotal))}
${o.coupon_discount ? row(`Coupon${o.coupon ? ` (${esc(o.coupon)})` : ""}`, `− ${formatINR(o.coupon_discount)}`) : ""}
${row("Shipping", o.shipping ? formatINR(o.shipping) : "Free")}
${row("Total paid", formatINR(o.total), true)}
</table>`;
}

const address = (o: OrderRow) =>
  `${esc(o.name)}<br>${esc(o.address).replace(/\n/g, "<br>")}<br>${esc(o.city)}, ${esc(o.state)} ${esc(o.pincode)}<br>+91 ${esc(o.phone)}`;

const layout = (body: string) => `<!doctype html><html><body style="margin:0;background:#f9f2e6;font-family:Georgia,'Times New Roman',serif;color:#1f3d2b">
<table width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:24px 12px">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:1px solid #ebe2d2">
<tr><td style="padding:28px 28px 8px;text-align:center"><img src="${SITE}/images/brand/emblem.png" alt="Verona Arts" width="96" style="display:inline-block;height:auto"></td></tr>
<tr><td style="padding:8px 28px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:1.6">${body}</td></tr>
</table></td></tr></table></body></html>`;

function customerEmail(o: OrderRow) {
  return layout(`
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:24px;margin:0 0 8px">Thank you, ${esc(o.name.split(" ")[0])}!</h1>
<p style="margin:0 0 20px">We've received your payment and your order <strong>${esc(o.id)}</strong> is confirmed.</p>
${orderTable(o)}
<p style="margin:24px 0 4px;font-size:12px;letter-spacing:2px;color:#c27c38;text-transform:uppercase">Delivering to</p>
<p style="margin:0">${address(o)}</p>
<p style="margin:24px 0 4px;font-size:12px;letter-spacing:2px;color:#c27c38;text-transform:uppercase">What happens next</p>
<ol style="margin:0;padding-left:18px">
<li>We confirm your order on WhatsApp / email within 24 hours.</li>
<li>Ready artworks ship in 5–7 days; made-to-order pieces in 12–18 days.</li>
<li>You'll receive a tracking link once your artwork is dispatched.</li>
</ol>
<p style="margin:24px 0 0;color:#5c6a61">Questions? Just reply to this email, or WhatsApp us on ${esc(WHATSAPP_DISPLAY)}.</p>`);
}

function shopEmail(o: OrderRow) {
  return layout(`
<h1 style="font-family:Georgia,serif;font-weight:normal;font-size:22px;margin:0 0 8px">New paid order ${esc(o.id)}</h1>
<p style="margin:0 0 20px">${formatINR(o.total)} paid online · Razorpay payment ${esc(o.razorpay_payment_id)}</p>
${orderTable(o)}
<p style="margin:24px 0 4px;font-size:12px;letter-spacing:2px;color:#c27c38;text-transform:uppercase">Ship to</p>
<p style="margin:0">${address(o)}<br><a href="mailto:${esc(o.email)}" style="color:#a2642a">${esc(o.email)}</a></p>
<p style="margin:24px 0 0"><a href="${SITE}/admin/orders" style="display:inline-block;background:#c27c38;color:#ffffff;padding:10px 18px;text-decoration:none">Open orders in admin</a></p>`);
}

/** Order confirmation to the customer and a new-order alert to the shop. Never throws. */
export async function sendOrderEmails(o: OrderRow) {
  const results = await Promise.allSettled([
    send({
      to: o.email,
      subject: `Your Verona Arts order ${o.id} is confirmed`,
      html: customerEmail(o),
      replyTo: EMAIL,
      idempotencyKey: `order-confirmation/${o.id}`,
    }),
    send({
      to: SHOP_INBOX,
      subject: `New order ${o.id} — ${formatINR(o.total)} — ${o.name}`,
      html: shopEmail(o),
      replyTo: o.email,
      idempotencyKey: `order-alert/${o.id}`,
    }),
  ]);
  for (const r of results) if (r.status === "rejected") console.error("email: send failed", r.reason);
}
