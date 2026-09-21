import type { Metadata } from "next";
import { Bebas_Neue, Fraunces, IBM_Plex_Mono, Outfit } from "next/font/google";
import Footer from "@/components/Footer";
import HomecomingBanner from "@/components/HomecomingBanner";
import Shell from "@/components/Shell";
import "./globals.css";

const display = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
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
    default: "Mesa Verde Mavericks · Photos",
    template: "%s · Mesa Verde Mavericks",
  },
  description:
    "Home-game photography for Mesa Verde Mavericks football in Citrus Heights. Albums, roster, schedule, fundraisers, and true-resolution downloads.",
  icons: { icon: "/brand/maverick-crest.jpg" },
};

export const viewport = {
  themeColor: "#04140e",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}>
        <Shell>
          <HomecomingBanner />
          {children}
          <Footer />
        </Shell>
      </body>
    </html>
  );
}
