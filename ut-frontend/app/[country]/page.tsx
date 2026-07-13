import { notFound } from "next/navigation";
import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

const COUNTRY_NAMES: Record<string, string> = {
  ke: "Kenya", tz: "Tanzania", ug: "Uganda", rw: "Rwanda", et: "Ethiopia",
  ng: "Nigeria", gh: "Ghana", za: "South Africa", eg: "Egypt",
  us: "United States", gb: "United Kingdom", ca: "Canada", au: "Australia",
  in: "India", sg: "Singapore", ae: "UAE", de: "Germany", fr: "France",
  nl: "Netherlands", se: "Sweden", no: "Norway", fi: "Finland",
  jp: "Japan", cn: "China", kr: "South Korea", br: "Brazil", mx: "Mexico",
  zm: "Zambia", mz: "Mozambique", zw: "Zimbabwe", bw: "Botswana",
  na: "Namibia", sn: "Senegal", ci: "Côte d'Ivoire",
};

type Props = { params: Promise<{ country: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { country } = await params;
  const name = COUNTRY_NAMES[country.toLowerCase()];
  if (!name) return {};
  return {
    title: `UrbanTrends — Infrastructure for the East African internet`,
    description: `Viewing UrbanTrends from ${name}. M-Pesa-native SaaS and developer tooling for East African operators.`,
    // These country variants render the same home page — point Google at the
    // single canonical home URL so they don't compete with `/` in the index.
    alternates: { canonical: "/" },
  };
}

export default async function CountryPage({ params }: Props) {
  const { country } = await params;
  const cc = country.toLowerCase();

  if (cc.length !== 2 || !/^[a-z]{2}$/.test(cc) || !COUNTRY_NAMES[cc]) {
    notFound();
  }

  return <HomeContent />;
}
