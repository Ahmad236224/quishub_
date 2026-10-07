import type { Metadata } from "next";
import localFont from "next/font/local";
import { Sora } from "next/font/google";
import { GeistMono } from "geist/font/mono";
import { headers } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MotionProvider from "@/components/system/MotionProvider";
import DelayedChatbot from "@/components/ui/DelayedChatbot";


const texar = localFont({
  src: [
    {
      path: "../public/fonts/TEXAR.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-texar",
  display: "swap",
});

const ttLakesNeue = localFont({
  src: [
    {
      path: "../public/fonts/TT-Lakes-Neue-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/TT-Lakes-Neue-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/TT-Lakes-Neue-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/TT-Lakes-Neue-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tt-lakes",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const siteDescription =
  "Quishub designs and builds software, automation and AI systems around the way your business actually works.";

export const metadata: Metadata = {
  metadataBase: new URL("https://quishub.com"),
  title: "Quishub — Software for the work your business still does by hand",
  description: siteDescription,
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "custom software development",
    "workflow automation",
    "SaaS development",
    "systems integration",
    "AI in business workflows",
  ],
  openGraph: {
    title: "Quishub — Software for the work your business still does by hand",
    description: siteDescription,
    type: "website",
    // TODO(asset): /og-image.png is referenced but not yet in /public — add a 1200×630 image.
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Quishub — Software for the work your business still does by hand",
    description: siteDescription,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = headers().get("host") || "";
  const isHealthcareSubdomain = host.startsWith("healthcare.");

  if (isHealthcareSubdomain) {
    return (
      <html
        lang="en"
        data-theme="light"
        suppressHydrationWarning
        className={`theme-platinum ${texar.variable} ${ttLakesNeue.variable} ${sora.variable} ${GeistMono.variable}`}
      >
        <body className="font-body bg-quishub-light text-quishub-black min-h-screen">
          {/* Fixed clinical header strip */}
          <header className="fixed top-0 inset-x-0 z-50 bg-quishub-light border-b border-quishub-border">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10 h-16 flex items-center">
              <span className="font-bold text-quishub-black tracking-tight text-base md:text-lg">
                Quishub Healthcare Architecture
              </span>
            </div>
          </header>

          {/* Body offset to clear the fixed header */}
          <main className="pt-20 min-h-screen bg-quishub-light">{children}</main>

          {/* Minimal clinical footer */}
          <footer className="border-t border-quishub-border bg-quishub-light">
            <div className="mx-auto max-w-[1200px] px-6 md:px-10 py-6 text-center text-xs text-quishub-muted">
              © {new Date().getFullYear()} Quishub™ &middot; Managed by Muhammad Mujtaba Rehman.
            </div>
          </footer>
        </body>
      </html>
    );
  }

  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${texar.variable} ${ttLakesNeue.variable} ${sora.variable} ${GeistMono.variable}`}
    >
      <body className="font-body">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-background"
        >
          Skip to content
        </a>
        <MotionProvider>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
        </MotionProvider>
        <DelayedChatbot />
      </body>
    </html>
  );
}
