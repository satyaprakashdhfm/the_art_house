/** Studio contact details — change them here only. */
export const WHATSAPP_DISPLAY = "+91 87902 84586";
const WHATSAPP_NUMBER = "918790284586";

export const EMAIL = "info@veronaarts.com";

/** Person customers can call directly (shown on the About page). Add a name to show it. */
export const CONTACT_PERSON = { name: "Satya Prakash Reddy", role: "Customer care", phone: "+91 93815 02998", tel: "+919381502998" };

/** wa.me link that opens a chat, optionally with a pre-filled message. */
export function whatsappLink(text?: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
