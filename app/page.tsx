import Storefront from "@/components/Storefront";
import type { Metadata } from "next";
export const metadata: Metadata = { alternates: { canonical: "/" } };
import {
  Introduction,
  ClosingSections,
  SiteFooter,
} from "@/components/HomeSections";
export default function Home() {
  return (
    <Storefront
      introduction={<Introduction />}
      closing={<ClosingSections />}
      footer={<SiteFooter />}
    />
  );
}
