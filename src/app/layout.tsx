import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Only For Seniors — Canada's Senior Marketplace",
    template: "%s | Only For Seniors",
  },
  description:
    "The friendly Canadian marketplace for seniors 65+. Find trusted home care, transportation, health services, products, and delivery — all in one place.",
  keywords: [
    "seniors Canada",
    "senior services",
    "home care",
    "senior marketplace",
    "65+ services",
    "elder care",
  ],
  authors: [{ name: "Only For Seniors" }],
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://onlyforseniors.ca",
    siteName: "Only For Seniors",
    title: "Only For Seniors — Canada's Senior Marketplace",
    description:
      "The friendly Canadian marketplace for seniors 65+. Trusted services, products, and delivery.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5, // allow pinch-zoom (a11y)
  themeColor: "#047857",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-CA">
      <body className="min-h-screen flex flex-col bg-cream-50">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50
            bg-ember-600 text-white px-4 py-3 rounded-chunky font-bold border-2 border-black"
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
