"use client";

import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/contact";

const GREETING = "Hi Verona Arts! I have a question.";

/** Floating WhatsApp chat button, bottom-right on every storefront page. */
export default function WhatsAppButton() {
  return (
    <a
      href={whatsappLink(GREETING)}
      // Add the page the visitor is on, so we know which artwork they mean.
      onClick={(e) => {
        e.currentTarget.href = whatsappLink(`${GREETING}\n\nI was looking at: ${document.title}\n${window.location.href}`);
      }}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-4 z-40 flex h-12 w-12 items-center justify-center sm:right-6 sm:bottom-6 sm:h-13 sm:w-13"
    >
      {/* Ripple rings */}
      <span aria-hidden="true" className="absolute inset-0 animate-ripple rounded-full bg-[#25d366] motion-reduce:hidden" />
      <span aria-hidden="true" className="absolute inset-0 animate-ripple rounded-full bg-[#25d366] [animation-delay:1.2s] motion-reduce:hidden" />
      {/* Button */}
      <span className="relative flex h-full w-full items-center justify-center rounded-full bg-[#25d366] text-white shadow-lg ring-[3px] ring-[#25d366]/25 transition-transform duration-200 group-hover:scale-105">
        <WhatsAppIcon className="h-6 w-6 sm:h-[26px] sm:w-[26px]" />
      </span>
      {/* Hover label (desktop) */}
      <span className="pointer-events-none absolute right-full mr-3 hidden translate-x-2 rounded-full bg-ink px-3 py-1.5 text-xs whitespace-nowrap text-paper opacity-0 shadow transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        Chat with us
      </span>
    </a>
  );
}
