import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Fraunces,
  Geist_Mono,
  Montserrat,
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
    default: "Restaurant Digital Dining Experience",
    template: "%s · Digital Dining",
  },
  description:
    "A private dining room in the guest’s hand. Branded menus, table ordering, and house rewards.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#100c09",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} ${fraunces.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-[#100c09] font-sans text-foreground">
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
