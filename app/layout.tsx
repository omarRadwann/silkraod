import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
const inter = localFont({
  src: "../public/fonts/inter-latin-variable.woff2",
  variable: "--font-inter",
  weight: "400 700",
  display: "swap",
});
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#101e30",
};
import "./globals.css";
export const metadata: Metadata = {
  ...(process.env.NEXT_PUBLIC_SITE_URL
    ? { metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL) }
    : {}),
  title: "Silk Road | From Asia to Egypt.",
  description:
    "Connecting Asia with businesses in Egypt. Explore BODUO wholesale beverage ingredients, build an order or discuss your next sourcing opportunity with Silk Road.",
  openGraph: {
    title: "Silk Road — From Asia to Egypt.",
    description: "Bubble tea ingredients & Asia-to-Egypt sourcing.",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_PATH || ""}/visuals/tiger-ritual.webp`,
        width: 1000,
        height: 1250,
        alt: "Silk Road — brown sugar milk tea serving inspiration",
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
    <html lang="en" className={inter.variable}>
      <head>
        <link
          rel="preload"
          as="image"
          href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/silk-road-transparent.webp`}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
