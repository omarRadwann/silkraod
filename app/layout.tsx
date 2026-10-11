import type { Metadata } from "next";
import "./globals.css";
import "./products.css";
import "./premium.css";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: "Silk Road | From China to Egypt.",
  description:
    "Connecting China with businesses in Egypt. Explore BODUO wholesale beverage ingredients, build an order or discuss your next sourcing opportunity with Silk Road.",
  openGraph: {
    title: "Silk Road — From China to Egypt.",
    description: "Bubble tea ingredients & China-to-Egypt sourcing.",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_PATH || ""}/og.jpg`,
        width: 1200,
        height: 630,
        alt: "Silk Road wholesale bubble tea ingredients",
      },
    ],
  },
  robots: { index: true, follow: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.png` },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
