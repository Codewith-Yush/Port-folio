import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "./components/Loader";
import { CustomCursor } from "./components/CustomCursor";
import { ScrollManager } from "./components/ScrollManager";
import "./styles/index.css";

const App = lazy(() => import("./App"));
const CanvaGallery = lazy(() => import("./pages/CanvaGallery"));
const Resume = lazy(() => import("./pages/Resume"));

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
      <ScrollManager />
      <CustomCursor />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/canva-gallery" element={<CanvaGallery />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
);
