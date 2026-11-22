import Banner from "@/components/Banner";
import FeaturedMenuSection from "@/components/FeaturedMenuSection";
import PizzaCategoriesSection from "@/components/PizzaCategoriesSection";
import WhyChooseSection from "@/components/WhyChooseSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import { toItem } from "@/lib/adapters";
import type { MenuItem } from "@/lib/mock-data";
import { serverApi } from "@/lib/server-api";

export default async function Home() {
  // Approved items only. The server lists Premium vendors first.
  let featured: MenuItem[] = [];
  try {
    const { items } = await serverApi<{ items: unknown[] }>("/api/menu-items", {
      auth: false,
    });
    featured = items.slice(0, 6).map((i) => toItem(i));
  } catch {
    // If the API is down, the home page still loads and shows the empty state.
  }

  return (
    <div className="w-full bg-[#0B1315]">
      <Banner />
      <FeaturedMenuSection items={featured} />
      <PizzaCategoriesSection />
      <WhyChooseSection />
      <HowItWorksSection />
    </div>
  );
}
