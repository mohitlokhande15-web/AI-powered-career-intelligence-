import CareerPreview from "@/components/landing/CareerPreview";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import JobRecommendations from "@/components/landing/JobRecommendations";
import Navbar from "@/components/landing/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CareerPreview />
      <JobRecommendations />
      <FinalCTA />
      <Footer />
    </main>
  );
}