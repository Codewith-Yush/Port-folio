import { Preloader } from "./components/Loader";
import { Header } from "./components/Header";
import { CustomCursor } from "./components/CustomCursor";
import { CommandShortcuts } from "./components/CommandShortcuts";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { LiveActivity } from "./sections/LiveActivity";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-screen overflow-x-clip bg-[var(--page)] text-[var(--ink)] transition-colors duration-500 relative">
      <Preloader />
      <CustomCursor />
      <Header />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <LiveActivity />
        <Contact />
      </main>
      <Footer />
      <CommandShortcuts />
    </div>
  );
}
