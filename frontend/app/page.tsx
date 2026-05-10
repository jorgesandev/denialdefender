import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import DemoSection from "./components/DemoSection";
import DataHubSection from "./components/DataHubSection";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <DemoSection />
        <DataHubSection />
      </main>
      <Footer />
    </>
  );
}
