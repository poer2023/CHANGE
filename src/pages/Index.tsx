import LandingNavigation from "@/components/LandingNavigation";
import LandingHero from "@/components/LandingHero";
import LandingFeatures from "@/components/LandingFeatures";
import LandingWorkflow from "@/components/LandingWorkflow";
import LandingCTA from "@/components/LandingCTA";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <LandingNavigation />
      <LandingHero />
      <LandingFeatures />
      <LandingWorkflow />
      <LandingCTA />
    </div>
  );
};

export default Index;
