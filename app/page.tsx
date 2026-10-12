import Storefront from "@/components/Storefront";
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
