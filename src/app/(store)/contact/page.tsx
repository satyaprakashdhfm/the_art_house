import type { Metadata } from "next";
import { Clock, Mail, MapPin, MessageCircle } from "lucide-react";
import PageHeader from "@/components/ui/PageHeader";
import ContactForm from "@/components/ui/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Verona Arts for orders, custom art and questions.",
};

const DETAILS = [
  { icon: MessageCircle, title: "WhatsApp", text: "+91 90000 00000" },
  { icon: Mail, title: "Email", text: "hello@veronaarts.example" },
  { icon: MapPin, title: "Studio", text: "Studio address, India" },
  { icon: Clock, title: "Hours", text: "Mon – Sat, 10am – 7pm IST" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader title="Contact us" description="Questions about an artwork, an order or a custom piece? We'd love to hear from you." crumbs={[{ label: "Contact" }]} />
      <div className="container-page grid gap-12 py-14 lg:grid-cols-[1fr_360px]">
        <ContactForm />
        <ul className="space-y-6">
          {DETAILS.map(({ icon: Icon, title, text }) => (
            <li key={title} className="flex gap-4">
              <Icon className="mt-0.5 h-5 w-5 text-gold" />
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-sm text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
