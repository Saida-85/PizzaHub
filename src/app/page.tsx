import Banner from "@/components/Banner";
import FeaturedMenuSection from "@/components/FeaturedMenuSection";
import PizzaCategoriesSection from "@/components/PizzaCategoriesSection";
import WhyChooseSection from "@/components/WhyChooseSection";

export default function Home() {
  return (
    <div className="w-full bg-[#0B1315]">
      <Banner />
      <FeaturedMenuSection />
      <PizzaCategoriesSection />
      <WhyChooseSection />
    </div>
  );
}
