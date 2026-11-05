import { lazy, Suspense } from "react";
import { Preloader } from "./components/Loader";
import { Header } from "./components/Header";
import { Hero } from "./sections/Hero";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Services } from "./sections/Services";
import { Contact } from "./sections/Contact";
import { Footer } from "./sections/Footer";

const CommandShortcuts = lazy(() =>
  import("./components/CommandShortcuts").then((m) => ({ default: m.CommandShortcuts }))
);

export default function App() {
  return (
    <div className="relative min-h-[100svh] overflow-x-clip bg-[var(--page)] text-[var(--ink)] transition-colors duration-300">
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Projects />
        <Skills />
        <Services />
        <Contact />
      </main>
      <Footer />
      <Suspense fallback={null}>
        <CommandShortcuts />
      </Suspense>
    </div>
  );
}
