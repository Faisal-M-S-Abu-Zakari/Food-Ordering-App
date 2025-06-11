import About from "@/components/about";
import Contact from "./contact/page";
import BestSellers from "./_components/BestSellers";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <main>
      <Hero />
      <BestSellers />
      <About />
      <Contact />
    </main>
  );
}
