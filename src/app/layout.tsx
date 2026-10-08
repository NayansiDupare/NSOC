import type { Metadata, Viewport } from "next";

import { Providers } from "@/components/providers";

import "@fontsource-variable/bricolage-grotesque";
import "@fontsource-variable/jetbrains-mono";
import "@fontsource-variable/manrope";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://nsoc.in"),
  title: "NSoC Winter Edition — Build in the cold. Ship into the open.",
  description:
    "Join the NSoC Winter Edition: a 45-day open-source sprint for contributors, project maintainers, and campus ambassadors.",
  openGraph: {
    title: "NSoC Winter Edition",
    description: "A 45-day open-source sprint built around real projects and meaningful merges.",
    type: "website",
    url: "/",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050a0e" },
    { media: "(prefers-color-scheme: light)", color: "#eff8fb" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
