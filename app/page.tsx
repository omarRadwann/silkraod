import Storefront from "@/components/Storefront";
import type { Metadata } from "next";
import { siteUrl, siteName, organizationId } from "@/lib/site";
import StructuredData from "@/components/StructuredData";
import {
  Introduction,
  ClosingSections,
  SiteFooter,
} from "@/components/HomeSections";
export const metadata: Metadata = { alternates: { canonical: "/" } };
const website = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  name: siteName,
  alternateName: ["Silk Road", "Silkroad EG", "silkroadeg.net"],
  url: `${siteUrl}/`,
  inLanguage: "en",
  publisher: { "@id": organizationId },
};
export default function Home() {
  return (
    <>
      <StructuredData data={website} />
      <Storefront
        introduction={<Introduction />}
        closing={<ClosingSections />}
        footer={<SiteFooter />}
      />
    </>
  );
}
