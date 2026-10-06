import type { Metadata } from "next";
import type { ComponentType } from "react";
import { Clock, Mail, MapPin } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ui/ContactForm";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { EMAIL, LOCATION, WHATSAPP_DISPLAY, whatsappLink } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Verona Arts for orders, custom art and questions.",
};

const DETAILS: { icon: ComponentType<{ className?: string }>; title: string; text: string; href?: string }[] = [
  { icon: WhatsAppIcon, title: "WhatsApp", text: WHATSAPP_DISPLAY, href: whatsappLink() },
  { icon: Mail, title: "Email", text: EMAIL, href: `mailto:${EMAIL}` },
  { icon: MapPin, title: "Studio", text: LOCATION },
  { icon: Clock, title: "Hours", text: "Mon – Sat, 10am – 7pm IST" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" description="Questions about an artwork, an order or a custom piece? We'd love to hear from you." crumbs={[{ label: "Contact" }]} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_360px]">
        <ContactForm />
        <ul className="space-y-6">
          {DETAILS.map(({ icon: Icon, title, text, href }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-0.5 h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                {href ? (
                  <a
                    href={href}
                    {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="text-sm text-muted hover:text-gold"
                  >
                    {text}
                  </a>
                ) : (
                  <p className="text-sm text-muted">{text}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
