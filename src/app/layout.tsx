import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Toast from "@/components/ui/Toast";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Verona Arts — Handmade Paintings & Custom Art",
    template: "%s | Verona Arts",
  },
  description:
    "Buy original paintings, pencil sketches, oil, acrylic and digital art online. Spiritual art, portraits, animals, nature and custom portraits from photos.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        {children}
        <Toast />
      </body>
    </html>
  );
}
