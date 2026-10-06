/** Studio contact details — change them here only. */
export const WHATSAPP_DISPLAY = "+91 87902 84586";
const WHATSAPP_NUMBER = "918790284586";

export const EMAIL = "info@veronaarts.com";

/** wa.me link that opens a chat, optionally with a pre-filled message. */
export function whatsappLink(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
