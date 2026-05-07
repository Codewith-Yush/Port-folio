import { Header } from "./components/Header";
import { LazySection } from "./components/LazySection";
import { useSmoothScroll } from "./hooks/useSmoothScroll";
import { Footer } from "./sections/Footer";
import { About } from "./sections/About";
import { Hero } from "./sections/Hero";

export default function App() {
  useSmoothScroll();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--page)] text-[var(--ink)] transition-colors duration-500">
      <Header />
      <main>
        <Hero />
        <About />
        <LazySection
          loader={() =>
            import("./sections/Projects").then((module) => ({ default: module.Projects }))
          }
          placeholder={<div className="h-24" />}
        />
        <LazySection
          loader={() =>
            import("./sections/Skills").then((module) => ({ default: module.Skills }))
          }
          placeholder={<div className="h-24" />}
        />
        <LazySection
          loader={() =>
            import("./sections/Contact").then((module) => ({ default: module.Contact }))
          }
          placeholder={<div className="h-24" />}
        />
      </main>
      <Footer />
    </div>
  );
}
