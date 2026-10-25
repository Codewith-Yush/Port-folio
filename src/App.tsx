import { Header } from "./components/Header";
import { CommandShortcuts } from "./components/CommandShortcuts";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-[100svh] overflow-x-clip bg-[var(--page)] text-[var(--ink)] transition-colors duration-300 relative">
      <Header />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <CommandShortcuts />
    </div>
  );
}
