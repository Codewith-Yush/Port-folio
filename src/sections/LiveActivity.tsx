import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { cn } from "../utils/cn";
import { ambientSynth } from "../utils/ambientSynthesizer";
import { playClick, playSuccess } from "../utils/soundEffects";

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

function LocalTimeClock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    let timer: number;
    const update = () => setTime(new Date());

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(timer);
      } else {
        clearInterval(timer);
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

  return (
    <span className="text-xs font-mono font-bold text-[var(--ink)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
      {time.toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })}
    </span>
  );
}

export function LiveActivity() {
  const containerRef = useRef<HTMLElement>(null);
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Interactive Terminal State
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalLogs, setTerminalLogs] = useState<string[]>(DEFAULT_LOGS);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleSoundtrack = async () => {
    if (isPlayingAudio) {
      ambientSynth.stop();
      setIsPlayingAudio(false);
      playClick();
    } else {
      playClick();
      const started = await ambientSynth.start();
      if (started) {
        setIsPlayingAudio(true);
      }
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && ambientSynth.getIsPlaying()) {
        ambientSynth.stop();
        setIsPlayingAudio(false);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      ambientSynth.stop();
    };
  }, []);

  const runCommand = (rawCmd: string) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      setTerminalLogs(["Terminal screen cleared.", "Type 'help' for commands."]);
      setTerminalInput("");
      return;
    }

    const newLogs = [...terminalLogs, `> ${rawCmd}`];

    switch (cmd) {
      case "help":
        newLogs.push("Available commands: [about, skills, projects, contact, whoami, date, matrix, clear]");
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

  const handleCommandSubmit = (e: FormEvent) => {
    e.preventDefault();
    playClick();
    runCommand(terminalInput);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("ayushsingh7360@gmail.com");
    setCopiedEmail(true);
    playSuccess();
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Clean panel reveal
      gsap.fromTo(
        ".dashboard-panel",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );

      const streakEl = containerRef.current?.querySelector(".streak-counter");
      if (streakEl) {
        const streakObj = { val: 0 };
        gsap.to(streakObj, {
          val: 68,
          duration: 1.6,
          ease: "power2.out",
          onUpdate: () => {
            if (streakEl) streakEl.textContent = `${Math.round(streakObj.val)}+`;
          },
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            once: true,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="telemetry"
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

      {/* Cyber Status Bar */}
      <div className="w-full border-y border-black/10 dark:border-white/10 bg-[var(--surface)]/50 overflow-hidden flex whitespace-nowrap py-2.5 mb-8 sm:mb-10 relative z-10 shadow-sm">
        <div className="flex gap-8 px-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-80 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex gap-6 sm:gap-8 items-center shrink-0">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
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
          </span>
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
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:border-emerald-500/20">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 via-teal-400 to-transparent" />
              {/* Subtle ambient glow on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/[0.03] group-hover:to-teal-500/[0.03] transition-all duration-700 rounded-3xl" />
              <h3 className="relative text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Core Status
              </h3>

              <div className="relative space-y-3.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs sm:text-sm font-medium text-[var(--ink)]">Availability</span>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-md border border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.15)]">
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
                  <LocalTimeClock />
                </div>
              </div>
            </div>

            {/* Spotify Interactive Music Visualizer */}
            <div
              onClick={toggleSoundtrack}
              className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/70 backdrop-blur-xl rounded-3xl p-6 relative overflow-hidden group shadow-sm transition-all hover:shadow-md hover:border-emerald-500/20 cursor-pointer"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-zinc-700 via-emerald-500 to-cyan-500" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/60 mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full bg-emerald-500", isPlayingAudio && "animate-pulse")} />
                  Focused Soundtrack
                </span>
                <span
                  className="text-[9px] uppercase font-bold text-emerald-500 hover:underline transition-colors hover:text-emerald-400"
                >
                  {isPlayingAudio ? "Pause Audio" : "Play Lo-Fi"}
                </span>
              </h3>
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-12 h-12 rounded-2xl bg-gradient-to-br from-[#252A34] via-zinc-800 to-emerald-700 shadow-lg flex-shrink-0 relative overflow-hidden flex items-center justify-center text-white text-lg transition-all duration-500",
                  isPlayingAudio && "shadow-[0_4px_20px_rgba(16,185,129,0.3)] scale-105"
                )}>
                  <span className={cn("transition-transform duration-700", isPlayingAudio && "scale-110")}>🎧</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-bold text-[var(--ink)] truncate leading-tight mb-1">
                    Synthwave & Ambient Flow
                  </p>
                  <p className="text-xs font-medium text-[var(--ink)]/60 truncate">
                    {isPlayingAudio ? "Synthesizing generative lo-fi (0KB)" : "Click to play generative audio"}
                  </p>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 w-full rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                    <div className={cn(
                      "h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000",
                      isPlayingAudio ? "w-[85%] animate-pulse" : "w-[20%]"
                    )} />
                  </div>
                </div>
                {/* Audio Visualizer Bars */}
                <div className="ml-auto flex gap-[3px] items-end h-6 flex-shrink-0">
                  <div className={cn("w-1 rounded-full transition-all duration-300", isPlayingAudio ? "bg-emerald-500 h-4 animate-bounce" : "bg-emerald-500/40 h-1.5")} />
                  <div className={cn("w-1 rounded-full transition-all duration-300", isPlayingAudio ? "bg-teal-400 h-6 animate-pulse" : "bg-teal-400/40 h-2")} />
                  <div className={cn("w-1 rounded-full transition-all duration-300", isPlayingAudio ? "bg-emerald-500 h-3.5 animate-bounce" : "bg-emerald-500/40 h-1")} />
                  <div className={cn("w-1 rounded-full transition-all duration-300", isPlayingAudio ? "bg-cyan-400 h-5 animate-pulse" : "bg-cyan-400/40 h-1.5")} />
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
                      title={`${val === 0 ? "No" : val * 3} contributions`}
                      className={cn(
                        "rounded-[2px] transition-all duration-300 hover:scale-125 cursor-pointer",
                        val === 0
                          ? "bg-black/5 dark:bg-white/5"
                          : val === 1
                            ? "bg-emerald-500/30 dark:bg-[var(--flame)]/30"
                            : val === 2
                              ? "bg-emerald-500/50 dark:bg-[var(--flame)]/50 shadow-[0_0_6px_rgba(16,185,129,0.3)] dark:shadow-[0_0_6px_rgba(163,230,53,0.3)]"
                              : val === 3
                                ? "bg-emerald-500/80 dark:bg-[var(--flame)]/80 shadow-[0_0_10px_rgba(16,185,129,0.5)] dark:shadow-[0_0_10px_rgba(163,230,53,0.5)]"
                                : "bg-emerald-500 dark:bg-[var(--flame)] shadow-[0_0_12px_rgba(16,185,129,0.7)] dark:shadow-[0_0_12px_rgba(163,230,53,0.7)]"
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

              {/* Terminal Quick Command Chips */}
              <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5 pb-1">
                {["help", "about", "projects", "skills", "contact", "clear"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => runCommand(cmd)}
                    className="rounded border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-300 transition-colors hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Interactive Input Form */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/10 pt-2.5">
                <span className="text-[var(--flame)] font-bold">$</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type a command or click a chip above..."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none caret-[var(--flame)]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-2.5 py-1 rounded bg-white/10 text-[9px] font-bold text-zinc-300 hover:bg-emerald-500 hover:text-black transition-colors"
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
