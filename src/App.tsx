import { lazy, Suspense } from "react";
import { Preloader } from "./components/Loader";
import { Header } from "./components/Header";
import { WriteOnText } from "./components/WriteOnText";
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
      <div aria-hidden="true" className="jeppesen-grain" />
      <Preloader />
      <Header />
      <main>
        <Hero />
        <WriteOnText
          eyebrow="Philosophy"
          text="Great engineering deserves great presentation. I build full-stack products, data systems, and interfaces that make complex work effortless to understand, trust, and use."
        />
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