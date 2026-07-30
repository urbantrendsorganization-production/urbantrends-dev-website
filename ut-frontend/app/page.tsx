import type { Metadata } from "next";
import HomeContent from "@/components/HomeContent";

// ISR window, declared explicitly rather than inferred from the fetches
// below: when the API is unreachable at build time those fetches fall back
// instead of registering a cache entry, and the page would otherwise be
// frozen as fully static with no revalidation. See lib/cache.ts.
export const revalidate = 300;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <HomeContent />;
}
