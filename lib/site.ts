export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://silkroadeg.net").replace(/\/$/, "");
export const siteName = "Silk Road Egypt";
export const organizationId = `${siteUrl}/#organization`;
export const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteName,
  alternateName: "Silk Road Import & Export",
  url: `${siteUrl}/`,
  logo: `${siteUrl}/silk-road-approved-320.webp`,
  telephone: "+201097477503",
  areaServed: { "@type": "Country", name: "Egypt" },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+201097477503",
    contactType: "sales",
    areaServed: "EG",
  },
};
