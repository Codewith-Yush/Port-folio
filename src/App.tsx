import { Header } from "./components/Header";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Footer } from "./sections/Footer";
import { About } from "./sections/About";
import { Contact } from "./sections/Contact";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";

export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page)] text-[var(--ink)] transition-colors duration-500">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
