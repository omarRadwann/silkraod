import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { siteUrl, siteName, organization } from "@/lib/site";
import StructuredData from "@/components/StructuredData";
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
  metadataBase: new URL(siteUrl),
  verification: { google: "pcYMbSq4TeDjpk9gqoqzzjOTlp91iKJWj2Cfqe6vT1o" },
  title: "Silk Road Egypt | Bubble Tea Ingredients & China Sourcing",
  description:
    "Shop popping boba, tapioca pearls, matcha, taro, creamer and brown sugar syrup in Egypt. Prices per item. Order on WhatsApp or request custom sourcing from China.",
  openGraph: {
    title: "Silk Road Egypt | Bubble Tea Ingredients & China Sourcing",
    description: "Bubble tea ingredients & China-to-Egypt sourcing.",
    siteName,
    locale: "en_EG",
    url: `${siteUrl}/`,
    type: "website",
    images: [
      {
        url: `${siteUrl}/visuals/tiger-ritual.webp`,
        width: 1000,
        height: 1250,
        alt: "Silk Road — brown sugar milk tea serving inspiration",
      },
    ],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/icon.png` },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <StructuredData data={organization} />
        {children}
      </body>
    </html>
  );
}
