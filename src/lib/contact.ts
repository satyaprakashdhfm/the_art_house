/** Studio WhatsApp number. Placeholder until the real number is set; change it here only. */
export const WHATSAPP_DISPLAY = "+91 90000 00000";
const WHATSAPP_NUMBER = "919000000000";

/** wa.me link that opens a chat, optionally with a pre-filled message. */
export function whatsappLink(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
