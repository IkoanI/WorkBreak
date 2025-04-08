import HeroSection from "./components/TopSection";
import FeaturesSection from "./components/MiddleSection";
import CTASection from "./components/LowerSection";
import "./components/styles.css";


export default function Page() {
  return (
    <div className="homepage-wrapper">
      <main className="homepage-main">
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
    </div>
  );
}
