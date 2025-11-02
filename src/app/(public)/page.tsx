import EmailSignups from "@/components/hero/hero-emails";
import BentoFeatures from "@/components/hero/hero-feature";
import HeroPricing from "@/components/hero/hero-pricing";
import HeroSection from "@/components/hero/hero-section";

async function Page() {
  return (
    <div className="flex flex-col w-full items-center justify-start">
      <HeroSection />
      <BentoFeatures />
      <HeroPricing />
      <EmailSignups />
    </div>
  );
}

export default Page;
