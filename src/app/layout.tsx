import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Only For Seniors — Canada's Senior Directory",
    template: "%s | Only For Seniors",
  },
  description:
    "The friendly Canadian directory for seniors 65+. Find trusted home care, transportation, health services, products, and delivery — all in one place.",
  keywords: [
    "seniors Canada",
    "senior services",
    "home care",
    "senior directory",
    "65+ services",
    "elder care",
  ],
  authors: [{ name: "Only For Seniors" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://onlyforseniors.ca",
    siteName: "Only For Seniors",
    title: "Only For Seniors — Canada's Senior Directory",
    description:
      "The friendly Canadian directory for seniors 65+. Trusted services, products, and delivery.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA">
      <body className="min-h-screen flex flex-col bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
            bg-black text-white px-4 py-3 font-bold border-2 border-black"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1 w-full">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
