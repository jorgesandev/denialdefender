import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProofBar from "./components/ProofBar";
import WorkflowSection from "./components/WorkflowSection";
import DemoSection from "./components/DemoSection";
import EvidenceSection from "./components/EvidenceSection";
import GuardrailsSection from "./components/GuardrailsSection";
import FinalCTASection from "./components/FinalCTASection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <ProofBar />
        <WorkflowSection />
        <DemoSection />
        <EvidenceSection />
        <GuardrailsSection />
        <FinalCTASection />
      </main>
      <Footer />
    </>
  );
}
