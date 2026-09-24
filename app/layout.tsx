import type { Metadata } from "next";
import { Cormorant_Garamond, Fraunces, Great_Vibes, IBM_Plex_Mono, Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import HomecomingBanner from "@/components/HomecomingBanner";
import Shell from "@/components/Shell";
import "./globals.css";

const display = Cormorant_Garamond({
  weight: ["500", "600"],
  subsets: ["latin"],
  variable: "--font-display",
});
const script = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-script",
});
const body = Outfit({
  subsets: ["latin"],
  variable: "--font-body",
});
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
});
const mono = IBM_Plex_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Sporting Events · True Family Photography",
    template: "%s · Sporting Events",
  },
  description:
    "Sporting Events by @truefamilyphotography. Game photos, 1-1 shoots, and clean originals.",
  icons: { icon: "/brand/mark.svg" },
  referrer: "same-origin",
};

export const viewport = {
  themeColor: "#f4ede3",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${script.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
        <Shell>
          <HomecomingBanner />
          {children}
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
