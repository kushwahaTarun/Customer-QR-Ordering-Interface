import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Fraunces,
  Geist_Mono,
  Karla,
  Montserrat,
  Playfair_Display,
} from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Shagun",
    template: "%s · Shagun",
  },
  description:
    "Order food at your Shagun table. Scan the QR, see the menu, and we will bring food to you.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16080C",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${karla.variable} ${cormorant.variable} ${montserrat.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#16080C] font-sans text-foreground">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <ThemeProvider>
          {children}
          <Toaster position="top-center" duration={4000} />
        </ThemeProvider>
      </body>
    </html>
  );
}
