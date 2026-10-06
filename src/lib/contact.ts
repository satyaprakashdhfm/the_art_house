/** Studio contact details — change them here only. */
export const WHATSAPP_DISPLAY = "+91 87902 84586";
const WHATSAPP_NUMBER = "918790284586";

export const EMAIL = "info@veronaarts.com";

/** Person customers can call or WhatsApp directly (shown on the About page). */
export const CONTACT_PERSON = {
  name: "Satya Prakash Reddy",
  role: "Customer care",
  phone: "+91 93815 02998",
  tel: "+919381502998",
  whatsapp: "919381502998",
};

/** wa.me link that opens a chat (with the studio number unless another is given), optionally with a pre-filled message. */
export function whatsappLink(text?: string, number = WHATSAPP_NUMBER) {
  return `https://wa.me/${number}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}
