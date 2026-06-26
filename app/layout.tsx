import type { Metadata, Viewport } from "next";
import { Inter, Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CommandPaletteProvider } from "@/components/CommandPalette";
import TelemetryTracker from "@/components/TelemetryTracker";
import ScrollProgressBar from "@/components/ScrollProgressBar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Tari Technologies",
    template: "%s | Tari Technologies",
  },
  description:
    "Enterprise-grade digital products — web development, AI systems, and cloud infrastructure built for scale.",
  keywords: ["technology", "web development", "AI", "cloud", "Nigeria", "software"],
  authors: [{ name: "Tari Technologies" }],
  openGraph: {
    title: "Tari Technologies",
    description: "Enterprise-grade digital products built for scale.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0f" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${geist.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ScrollProgressBar />
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <CommandPaletteProvider>
            <TelemetryTracker />
            {children}
          </CommandPaletteProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
