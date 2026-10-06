import { ArrowRight } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/lib/contact";

/** Small "Need help?" card that opens a WhatsApp chat about custom art. */
export default function WhatsAppHelp({ title = "Need help?", text = "Chat with us on WhatsApp for any questions" }: { title?: string; text?: string }) {
  return (
    <a
      href={whatsappLink("Hi Verona Arts! I have a question about a custom artwork.")}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-4 border border-line bg-paper p-5 transition-colors hover:border-gold"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-white">
        <WhatsAppIcon className="h-5 w-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium">{title}</span>
        <span className="block text-xs text-muted">{text}</span>
      </span>
      <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
    </a>
  );
}
