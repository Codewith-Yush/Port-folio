import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import { Loader } from "./components/Loader";
import "./styles/index.css";

const CanvaGallery = lazy(() => import("./pages/CanvaGallery"));

function RouteFallback() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--page)] text-[var(--ink)] relative overflow-hidden">
      <Loader />
      <span className="absolute bottom-12 font-mono text-xs uppercase tracking-widest text-[var(--muted)]">
        Loading Showcase...
      </span>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/canva-gallery" element={<CanvaGallery />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
