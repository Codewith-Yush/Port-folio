import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { cn } from "../utils/cn";

gsap.registerPlugin(ScrollTrigger);

// Mock data generator for GitHub-style graph (14 columns * 7 rows)
const GITHUB_GRAPH = Array.from({ length: 14 * 7 }).map(() => {
  const rand = Math.random();
  if (rand > 0.85) return 4;
  if (rand > 0.65) return 3;
  if (rand > 0.4) return 2;
  if (rand > 0.2) return 1;
  return 0;
});

const DEFAULT_LOGS = [
  "system --init --environment production",
  "loaded kernel modules: [React, GSAP, Tailwind, Vite]",
  "telemetry status: online [latency: 18ms]",
  "github sync: 15 commits pushed in last 48h",
  "type 'help' to explore interactive commands",
];

export function LiveActivity() {
  const containerRef = useRef<HTMLElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);
  const [time, setTime] = useState(new Date());

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>(DEFAULT_LOGS);
  const [isPlayingAudio, setIsPlayingAudio] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Clock tick
  useEffect(() => {
    let timer: number;
    const update = () => setTime(new Date());

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        timer = window.setInterval(update, 1000);
        update();
      }
    };

    timer = window.setInterval(update, 1000);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    const cmd = terminalInput.trim().toLowerCase();
    if (!cmd) return;

    const newLogs = [...terminalLogs, `> ${terminalInput}`];

    switch (cmd) {
      case "help":
        newLogs.push("Available commands: [about, skills, projects, contact, whoami, clear, matrix, date]");
        break;
      case "about":
        newLogs.push("Ayush Singh — Full Stack Developer & AI Creator focused on high-performance web systems.");
        break;
      case "skills":
        newLogs.push("Stack: React 19, TypeScript, Next.js, GSAP, TailwindCSS, Python, Power BI, Web3.");
        break;
      case "projects":
        newLogs.push("Highlighted: AI Creator Hub, Canva Design Showcase, Tadka Restaurant Platform.");
        break;
      case "contact":
        newLogs.push("Email: ayushsingh7360@gmail.com | GitHub: github.com/codewith-Yush | LinkedIn: Ayush Singh");
        break;
      case "whoami":
        newLogs.push("Guest User // Future Client & Collaborator 🚀");
        break;
      case "date":
        newLogs.push(new Date().toString());
        break;
      case "matrix":
        newLogs.push("Wake up, Neo... Follow the white rabbit. 🟢 01000001 01011001 01010101 01010011 01001000");
        break;
      case "clear":
        setTerminalLogs(["Terminal screen cleared.", "Type 'help' for commands."]);
        setTerminalInput("");
        return;
      default:
        newLogs.push(`Command not found: '${cmd}'. Type 'help' for available commands.`);
        break;
    }

    setTerminalLogs(newLogs);
    setTerminalInput("");

    window.setTimeout(() => {
      terminalBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ayushsingh7360@gmail.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Endless scrolling ticker with GPU compositing
      gsap.to(".ticker-track", {
        xPercent: -50,
        ease: "none",
        duration: 25,
        repeat: -1,
        force3D: true,
      });

      // Panel stagger reveal
      gsap.fromTo(
        ".dashboard-panel",
        { y: 30, opacity: 0, scale: 0.97 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );

      // Streak counter animation
      gsap.fromTo(
        ".streak-counter",
        { innerHTML: 0 },
        {
          innerHTML: 42,
          duration: 2.0,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative py-8 sm:py-12 md:py-16 overflow-hidden bg-[var(--page)] border-t border-black/5 dark:border-white/5 transition-colors duration-500"
    >
      {/* Background Subtle Grid Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          backgroundPosition: "center center",
        }}
      />

      {/* Cyber Ticker */}
      <div className="w-full border-y border-black/10 dark:border-white/10 bg-[var(--surface)]/50 backdrop-blur-md overflow-hidden flex whitespace-nowrap py-2.5 mb-8 sm:mb-10 relative z-10 shadow-sm">
        <div className="ticker-track flex gap-8 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <span key={i} className="flex gap-6 sm:gap-8 items-center shrink-0">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  SYSTEM STATUS: ONLINE
                </span>
                <span>•</span>
                <span className="text-[var(--flame)]">
                  ACTIVE FOCUS: FULL STACK & AI
                </span>
                <span>•</span>
                <span>FREELANCE: OPEN FOR BOOKING</span>
                <span>•</span>
                <span>PRODUCTION METRICS: HEALTHY</span>
                <span>•</span>
              </span>
            ))}
        </div>
      </div>

      <Container>
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-[var(--ink)] flex items-center gap-3">
              <div className="relative flex h-4 w-4 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              LIVE TELEMETRY
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm font-semibold uppercase tracking-widest text-[var(--flame)]">
              Developer activity & interactive terminal
            </p>
          </div>

          <button
            onClick={handleCopyEmail}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface)] text-xs font-medium text-[var(--ink)] hover:bg-[#252A34] hover:text-white hover:border-[#252A34] transition-all shadow-sm w-fit"
          >
            <span>{copiedEmail ? "Copied to Clipboard! ✓" : "Copy Direct Email"}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          {/* LEFT COL: Status & Spotify */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            {/* Status Panel */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-transparent" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-5">
                Core Status
              </h3>

              <div className="space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">Availability</span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">Freelance</span>
                  <span className="px-2.5 py-1 bg-[#252A34]/10 dark:bg-white/10 text-[var(--ink)] text-[10px] font-bold uppercase tracking-widest rounded-md border border-[#252A34]/20 dark:border-white/20">
                    Accepting
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/5">
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)]/70">Local Time</span>
                  <span className="text-xs font-mono font-bold text-[var(--ink)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                    {time.toLocaleTimeString("en-US", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Spotify Interactive Music Visualizer */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-700 to-emerald-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full bg-emerald-500", isPlayingAudio && "animate-pulse")} />
                  Focused Soundtrack
                </span>
                <button
                  onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                  className="text-[9px] uppercase font-bold text-emerald-500 hover:underline"
                >
                  {isPlayingAudio ? "Pause EQ" : "Play EQ"}
                </button>
              </h3>
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#252A34] via-zinc-800 to-emerald-700 shadow-md flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white text-lg">
                  🎧
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight mb-1">
                    Synthwave & Ambient Flow
                  </p>
                  <p className="text-xs font-medium text-[var(--ink)]/60 truncate">
                    High Performance Mode
                  </p>
                </div>
                {/* Audio Visualizer Bars */}
                <div className="ml-auto flex gap-[3px] items-end h-5 flex-shrink-0">
                  <div className={cn("w-1 bg-emerald-500 rounded-full", isPlayingAudio ? "animate-[bounce_1s_infinite_0ms]" : "h-1")} />
                  <div className={cn("w-1 bg-emerald-500 rounded-full", isPlayingAudio ? "animate-[bounce_1s_infinite_150ms]" : "h-2")} />
                  <div className={cn("w-1 bg-emerald-500 rounded-full", isPlayingAudio ? "animate-[bounce_1s_infinite_300ms]" : "h-1")} />
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COL: Metrics & GitHub Grid */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            {/* GitHub Grid */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group shadow-sm flex-1">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-[var(--flame)] to-[var(--blush)]" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-4 flex items-center justify-between">
                <span>Contribution Heatmap</span>
                <span className="text-[var(--flame)] bg-[var(--flame)]/10 px-2 py-0.5 rounded text-[9px]">
                  Recent Activity
                </span>
              </h3>

              <div className="overflow-x-auto pb-1">
                <div className="grid grid-cols-14 grid-rows-7 gap-1 sm:gap-1.5 h-28 w-full min-w-[220px]">
                  {GITHUB_GRAPH.map((val, i) => (
                    <div
                      key={i}
                      className={cn(
                        "rounded-[2px] transition-all duration-300 hover:scale-125",
                        val === 0
                          ? "bg-black/5 dark:bg-white/5"
                          : val === 1
                          ? "bg-[var(--flame)]/30"
                          : val === 2
                          ? "bg-[var(--flame)]/50 shadow-[0_0_6px_rgba(163,230,53,0.3)]"
                          : val === 3
                          ? "bg-[var(--flame)]/80 shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                          : "bg-[var(--flame)] shadow-[0_0_12px_rgba(163,230,53,0.7)]"
                      )}
                    />
                  ))}
                </div>
              </div>
              <style>{`
                .grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); }
                .grid-rows-7 { grid-template-rows: repeat(7, minmax(0, 1fr)); }
              `}</style>
            </div>

            {/* Streak & Milestone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--flame)] to-transparent" />
                <div className="text-3xl font-light text-[var(--ink)] flex items-center leading-none mb-1">
                  <span className="streak-counter">0</span>
                </div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--ink)]/60">
                  Day Streak
                </p>
              </div>

              <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-5 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--blush)] to-transparent" />
                <div className="text-base font-bold text-[var(--ink)] leading-tight mb-1">
                  Portfolio v2.5
                </div>
                <p className="text-[9px] uppercase tracking-widest font-bold text-[var(--ink)]/60">
                  Latest Build
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Interactive Terminal Emulator */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[#09090c] text-zinc-100 rounded-3xl p-5 sm:p-6 relative overflow-hidden group shadow-md flex-1 flex flex-col justify-between font-mono text-xs">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[var(--flame)] via-emerald-400 to-indigo-500" />
              
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
                  <span className="text-[10px] text-zinc-400 ml-2">ayush@kernel:~</span>
                </div>
                <span className="text-[9px] text-[var(--flame)] font-bold">BASH</span>
              </div>

              {/* Terminal Output Log Area */}
              <div className="h-44 overflow-y-auto space-y-1.5 pr-1 mb-3 text-[11px] leading-relaxed select-text">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      log.startsWith(">") ? "text-[var(--flame)] font-bold" : "text-zinc-300"
                    )}
                  >
                    {log}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Terminal Interactive Input Form */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/10 pt-3">
                <span className="text-[var(--flame)] font-bold">$</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  placeholder="Type 'help' or command..."
                  className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-white/10 text-[9px] font-bold text-zinc-300 hover:bg-[#252A34] hover:text-white transition-colors"
                >
                  RUN
                </button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
