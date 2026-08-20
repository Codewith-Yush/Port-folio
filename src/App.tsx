import { Header } from "./components/Header";
import { CustomCursor } from "./components/CustomCursor";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Hero } from "./sections/Hero";
import { About } from "./sections/About";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Contact } from "./sections/Contact";
import { LiveActivity } from "./sections/LiveActivity";
import { Footer } from "./sections/Footer";

export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page)] text-[var(--ink)] transition-colors duration-500">
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
        <LiveActivity />
      </main>
      <Footer />
    </div>
  );
}
