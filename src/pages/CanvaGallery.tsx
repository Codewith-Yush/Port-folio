import { useEffect, useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";

/* ─── Data ─────────────────────────────────────────────────────────── */
type DesignItem = { n: string; src: string; label: string; cat: string };
const DESIGNS: DesignItem[] = [
  { n: "01", src: "/images/projects/design1.jpeg", label: "Neon Drop",    cat: "brand"  },
  { n: "02", src: "/images/projects/design2.jpeg", label: "Cyber Social", cat: "social" },
  { n: "03", src: "/images/projects/design3.png",  label: "Rave Print",   cat: "print"  },
  { n: "04", src: "/images/projects/design4.png",  label: "Acid Brand",   cat: "brand"  },
  { n: "05", src: "/images/projects/design5.png",  label: "Fluid Motion", cat: "motion" },
  { n: "06", src: "/images/projects/design6.png",  label: "Glitch Post",  cat: "social" },
  { n: "07", src: "/images/projects/design7.png",  label: "Y2K Print",    cat: "print"  },
  { n: "08", src: "/images/projects/design8.png",  label: "Brutal ID",    cat: "brand"  },
  { n: "09", src: "/images/projects/design9.png",  label: "Kinetic",      cat: "motion" },
  { n: "10", src: "/images/projects/design10.png", label: "Grid Lock",    cat: "social" },
  { n: "11", src: "/images/projects/design11.png", label: "Chrome Core",  cat: "brand"  },
  { n: "12", src: "/images/projects/design12.png", label: "Max Print",    cat: "print"  },
  { n: "13", src: "/images/projects/design13.png", label: "Vapor Social", cat: "social" },
  { n: "14", src: "/images/projects/design14.png", label: "Liquid Move",  cat: "motion" },
  { n: "15", src: "/images/projects/design15.png", label: "Neo Brand",    cat: "brand"  },
];
const CATS = ["all", "brand", "social", "print", "motion"] as const;
type Cat = (typeof CATS)[number];

/* ─── Lightbox ──────────────────────────────────────────────────────── */
function Lightbox({
  item, onClose, onPrev, onNext,
}: { item: DesignItem; onClose: () => void; onPrev: () => void; onNext: () => void }) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNext();
      if (e.key === "ArrowLeft") onPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      style={{ animation: "lbFadeIn 0.3s ease forwards" }}
    >
      <div className="absolute inset-0 bg-[#F4F4F0]/95" onClick={onClose} />

      <button
        onClick={onClose}
        className="absolute top-6 right-[5%] z-10 bg-white border border-black/10 text-[#111] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition hover:bg-[#FF3366] hover:text-white hover:border-[#FF3366]"
      >
        Close ✕
      </button>

      <button onClick={onPrev} className="absolute left-[5%] top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center text-lg font-bold transition hover:bg-[#FF3366] hover:text-white">←</button>
      <button onClick={onNext} className="absolute right-[5%] top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white border border-black/10 flex items-center justify-center text-lg font-bold transition hover:bg-[#FF3366] hover:text-white">→</button>

      <div className="relative z-10 flex flex-col items-center w-[90vw] max-w-5xl">
        <div className="rounded-xl overflow-hidden shadow-2xl border border-black/5 bg-white">
          <img src={item.src} alt={item.label} className="max-w-full max-h-[70vh] object-contain block" />
        </div>
        <div className="mt-6 text-center">
          <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-3xl font-extrabold uppercase text-[#111] leading-none">
            {item.label}
          </p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FF3366]">
            {item.cat} · {item.n}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Gallery Card ──────────────────────────────────────────────────── */
function GalleryCard({ item, onClick }: { item: DesignItem; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="break-inside-avoid mb-6 cursor-pointer"
      style={{ animation: "cardReveal 0.6s cubic-bezier(0.16,1,0.3,1) both" }}
    >
      <div className="relative rounded-2xl overflow-hidden bg-white border border-black/5 group transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)]">
        <img src={item.src} alt={item.label} loading="lazy" className="w-full block object-cover transition-transform duration-700 group-hover:scale-105" />

        {/* Desktop hover info */}
        <div className="absolute inset-0 p-6 flex flex-col justify-end bg-gradient-to-t from-white/95 via-white/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.12em] text-[#FF3366] mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            {item.cat} · {item.n}
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-2xl font-extrabold uppercase text-[#111] leading-none translate-y-2 group-hover:translate-y-0 transition-transform duration-300 delay-75">
            {item.label}
          </p>
        </div>

        {/* Mobile always-visible info */}
        <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent sm:hidden">
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-white/70 mb-1">{item.cat}</p>
          <p style={{ fontFamily: "'Syne', sans-serif" }} className="text-lg font-extrabold uppercase text-white leading-none">{item.label}</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────────────────────────── */
export default function CanvaGallery() {
  const [activeCat, setActiveCat] = useState<Cat>("all");
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const hasFinePointer = useRef(typeof window !== "undefined" && window.matchMedia("(pointer:fine)").matches);
  const cursorRef = useRef<HTMLDivElement>(null);
  const cx = useRef(0); const cy = useRef(0);
  const tx = useRef(0); const ty = useRef(0);

  // Custom cursor (desktop only)
  useEffect(() => {
    if (!hasFinePointer.current) return;
    const move = (e: MouseEvent) => { tx.current = e.clientX; ty.current = e.clientY; };
    document.addEventListener("mousemove", move, { passive: true });
    let raf: number;
    const tick = () => {
      cx.current += (tx.current - cx.current) * 0.2;
      cy.current += (ty.current - cy.current) * 0.2;
      if (cursorRef.current) {
        cursorRef.current.style.setProperty("--x", cx.current + "px");
        cursorRef.current.style.setProperty("--y", cy.current + "px");
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => { document.removeEventListener("mousemove", move); cancelAnimationFrame(raf); };
  }, []);

  const filtered = activeCat === "all" ? DESIGNS : DESIGNS.filter(d => d.cat === activeCat);
  const closeLb = useCallback(() => setLightboxIdx(null), []);
  const nextLb = useCallback(() => setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length), [filtered.length]);
  const prevLb = useCallback(() => setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length), [filtered.length]);

  return (
    <>
      {/* Injected fonts & keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Syne:wght@400;600;700;800&display=swap');
        .canva-page { font-family: 'Space Grotesk', sans-serif; background: #F4F4F0; color: #111; min-height: 100vh; overflow-x: hidden; }
        @keyframes lbFadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes cardReveal { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        .cursor-el {
          position: fixed; top:0; left:0; width:14px; height:14px;
          background:#FF3366; border-radius:50%; pointer-events:none; z-index:9999;
          transform: translate3d(var(--x,-200px),var(--y,-200px),0) translate(-50%,-50%);
          transition: width .3s, height .3s, background-color .3s;
          will-change: transform;
        }
        .cursor-el.big { width:60px; height:60px; background:rgba(255,51,102,0.1); border:1px solid #FF3366; }
        @media(pointer:fine) { .canva-page * { cursor: none !important; } }
        @media(pointer:coarse),(max-width:1024px),(hover:none) { .cursor-el { display:none!important; } }
        .marquee { animation: marqScroll 25s linear infinite; will-change:transform; }
        @keyframes marqScroll { 0%{transform:translate3d(0,0,0)} 100%{transform:translate3d(-50%,0,0)} }
        .masonry-grid { columns:3; column-gap:24px; }
        @media(max-width:1024px) { .masonry-grid { columns:2; } }
        @media(max-width:640px) { .masonry-grid { columns:1; } }
      `}</style>

      <div className="canva-page">
        {/* Custom cursor */}
        <div ref={cursorRef} className="cursor-el" />

        {/* Ambient blobs */}
        <div className="fixed pointer-events-none z-0 top-[-20%] right-[-20%] w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full" style={{ background: "radial-gradient(circle,rgba(67,56,202,0.15),transparent 60%)", animation: "none" }} />
        <div className="fixed pointer-events-none z-0 bottom-[-20%] left-[-20%] w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] rounded-full" style={{ background: "radial-gradient(circle,rgba(255,51,102,0.15),transparent 60%)" }} />

        {/* ── Portfolio Navbar ── */}
        <nav className="fixed top-0 w-full z-50 flex justify-center border-b border-black/5 bg-[#F4F4F0]/80 backdrop-blur-xl">
          <div className="flex w-full max-w-[1400px] items-center justify-between px-[5%] py-5">
            <Link to="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.45em] text-[#111] no-underline transition hover:opacity-70">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ff5a3d]" style={{ boxShadow: "0 0 20px rgba(255,90,61,0.4)" }} />
              Ayush Singh
            </Link>
            <div className="hidden sm:flex gap-8">
              {[["About","/#about"],["Work","/#work"],["Skills","/#skills"],["Contact","/#contact"]].map(([label,href])=>(
                <a key={label} href={href} className="text-xs font-semibold uppercase tracking-[0.35em] text-black/50 no-underline transition hover:text-black">{label}</a>
              ))}
            </div>
            <Link to="/" className="text-[0.7rem] font-bold uppercase tracking-[0.2em] bg-[#111] text-white px-6 py-2.5 rounded-full no-underline transition hover:bg-[#333] hover:scale-105">
              ← Home
            </Link>
          </div>
        </nav>

        {/* ── Hero ── */}
        <div className="relative z-10 max-w-[1400px] mx-auto px-[5%] pt-[180px] pb-20 text-center">
          <div className="overflow-hidden inline-block pb-2">
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontSize:"clamp(3rem,10vw,8rem)", fontWeight:800, lineHeight:0.9, letterSpacing:"-0.04em", textTransform:"uppercase" }}>
              Hyper{" "}
              <span style={{ color:"transparent", WebkitTextStroke:"1px #111", transition:"all 0.4s" }}>Visuals</span>
            </h1>
          </div>
          <p className="max-w-md mx-auto mt-8 text-lg text-black/60 font-medium leading-relaxed">
            A high-fidelity curation of bold, striking Canva works. Welcome to the new wave of design aesthetics.
          </p>
        </div>

        {/* ── Marquee ── */}
        <div className="relative z-10 overflow-hidden bg-[#FF3366] py-4" style={{ transform: "rotate(-2deg) scale(1.05)", marginTop: "8px" }}>
          <div className="marquee flex gap-10 whitespace-nowrap" style={{ fontFamily:"'Syne',sans-serif", fontSize:"1.4rem", fontWeight:800, color:"#fff", textTransform:"uppercase", letterSpacing:"0.05em" }}>
            {[...Array(4)].flatMap(()=>["✦ Graphic Design","✦ Creative Direction","✦ UI/UX","✦ Branding","✦ Motion"]).map((t,i)=>(
              <span key={i}>{t}</span>
            ))}
          </div>
        </div>

        {/* ── Filters ── */}
        <div className="relative z-10 flex flex-wrap justify-center gap-3 max-w-[1400px] mx-auto px-[5%] pt-20 pb-10">
          {CATS.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`px-6 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] border transition-all duration-300 ${
                activeCat === cat
                  ? "bg-[#FF3366] text-white border-[#FF3366] shadow-[0_8px_20px_rgba(255,51,102,0.2)] -translate-y-0.5"
                  : "bg-transparent text-black/50 border-black/10 hover:border-[#FF3366] hover:text-[#FF3366] hover:-translate-y-0.5"
              }`}
            >
              {cat === "all" ? "All Works" : cat}
            </button>
          ))}
        </div>

        {/* ── Masonry Gallery ── */}
        <div className="relative z-10 masonry-grid max-w-[1400px] mx-auto px-[5%] pb-24" key={activeCat}>
          {filtered.map((item, i) => (
            <GalleryCard key={item.n + activeCat} item={item} onClick={() => setLightboxIdx(i)} />
          ))}
        </div>

        {/* ── Footer ── */}
        <footer className="relative z-10 border-t border-black/5 py-16 text-center text-xs font-semibold uppercase tracking-[0.15em] text-black/40 bg-[#F4F4F0]">
          © 2025 Portfolio · <span className="text-[#FF3366]">GenZ Edition</span>
        </footer>

        {/* ── Lightbox ── */}
        {lightboxIdx !== null && (
          <Lightbox item={filtered[lightboxIdx]} onClose={closeLb} onNext={nextLb} onPrev={prevLb} />
        )}
      </div>
    </>
  );
}
