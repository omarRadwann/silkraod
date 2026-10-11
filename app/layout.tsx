import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: "Silkraod | A world of ingredients. A new way to grow.",
  description:
    "Discover BODUO wholesale bubble tea ingredients in Egypt. Popping boba, tapioca pearls, matcha, taro and more. Build your order and request prices on WhatsApp.",
  openGraph: {
    title: "Silkraod — From Asia, with possibility.",
    description: "Bubble tea ingredients & China-to-Egypt sourcing.",
    type: "website",
    images: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_PATH || ""}/og.jpg`, width: 1200, height: 630, alt: 'Silkraod wholesale bubble tea ingredients' }],
  },
  robots: { index: true, follow: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.svg` },
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
