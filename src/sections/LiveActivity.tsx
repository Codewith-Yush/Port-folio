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
        newLogs.push("Available commands: [about, skills, projects, resume, github, contact, whoami, date, matrix, clear]");
        break;
      case "about":
        newLogs.push("Ayush Singh — Full Stack Developer & AI Creator focused on high-performance web systems.");
        break;
      case "skills":
        newLogs.push("Stack: React 19, TypeScript, Next.js, Python, Power BI, Tailwind CSS, GSAP, REST APIs.");
        break;
      case "projects":
        newLogs.push("Highlighted: AI Creator Hub, PulseAnalytics BI, Canva Design Showcase, Tadka Restaurant.");
        break;
      case "resume":
      case "cv":
        newLogs.push("Opening Ayush Singh's interactive resume...");
        window.open("/resume", "_blank");
        break;
      case "github":
        newLogs.push("Navigating to https://github.com/codewith-Yush...");
        window.open("https://github.com/codewith-Yush", "_blank");
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
      data-section="live-activity"
      ref={containerRef}
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-[var(--page)] border-t border-[var(--line)] transition-colors duration-500"
    >
      {/* Anchor alias so both #telemetry and #live-activity navigation work seamlessly */}
      <div id="live-activity" className="absolute -top-24 left-0 pointer-events-none" aria-hidden="true" />

      {/* Cyber Status Bar */}
      <div className="w-full border-y border-[var(--line)] bg-[var(--surface)] overflow-hidden flex whitespace-nowrap py-2.5 mb-12 sm:mb-16 relative z-10 font-mono">
        <div className="flex gap-8 px-6 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] text-[var(--muted)] overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span className="flex gap-6 sm:gap-8 items-center shrink-0">
            <span className="flex items-center gap-2 text-[var(--ink)]">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              SYSTEM STATUS: ONLINE
            </span>
            <span>/</span>
            <span className="text-emerald-700 dark:text-emerald-400">
              ACTIVE FOCUS: FULL STACK &amp; AI
            </span>
            <span>/</span>
            <span>FREELANCE: OPEN FOR SELECT WORK</span>
            <span>/</span>
            <span>TIMEZONE: IST (UTC +5:30)</span>
          </span>
        </div>
      </div>

      <Container>
        {/* Frame Top Sub-Bar */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px] mb-12 sm:mb-16">
          <span className="flex items-center gap-3 text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" aria-hidden="true" />
            <span>04 <span className="px-2">—</span> Live Telemetry</span>
          </span>
          <span className="text-[var(--muted)]">Realtime Feed <span className="px-2">/</span> New Delhi, IST</span>
        </div>

        <div className="mb-10 sm:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-6 sm:text-xs">
              System health <span className="px-1 text-emerald-700 dark:text-emerald-400">×</span> real-time activity
            </p>
            <h2 className="font-sans text-[clamp(2.5rem,5.5vw,4.8rem)] font-bold uppercase leading-[0.88] tracking-[-0.07em] text-[var(--ink)]">
              <span>Live</span>{" "}
              <span className="font-serif font-normal italic lowercase tracking-[-0.07em] text-emerald-700 dark:text-emerald-400">
                telemetry
              </span>
              <span>.</span>
            </h2>
          </div>

          <button
            onClick={handleCopyEmail}
            className="group inline-flex h-11 items-center justify-between gap-3 border border-[var(--line)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)] w-fit"
          >
            <span>{copiedEmail ? "Copied to Clipboard! ✓" : "Copy Direct Email"}</span>
            <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 md:gap-6">
          {/* LEFT COL: Status & Spotify */}
          <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
            {/* Status Panel */}
            <div className="dashboard-panel border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-6 relative overflow-hidden group transition-colors shadow-sm">
              <h3 className="relative font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-5 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Core Status
              </h3>

              <div className="relative space-y-4">
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--muted)] uppercase tracking-wider">Availability</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center font-mono text-xs">
                  <span className="text-[var(--muted)] uppercase tracking-wider">Freelance</span>
                  <span className="px-2 py-0.5 border border-[var(--line)] text-[var(--ink)] text-[10px] font-bold uppercase tracking-widest">
                    Accepting
                  </span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-[var(--line)] font-mono text-xs">
                  <span className="text-[var(--muted)] uppercase tracking-wider">Local Time</span>
                  <LocalTimeClock />
                </div>
              </div>
            </div>

            {/* Spotify Interactive Music Visualizer */}
            <div
              onClick={toggleSoundtrack}
              className="dashboard-panel border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-6 relative overflow-hidden group transition-colors shadow-sm cursor-pointer"
            >
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className={cn("h-2 w-2 rounded-full bg-emerald-500", isPlayingAudio && "animate-pulse")} />
                  Focused Soundtrack
                </span>
                <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-colors">
                  {isPlayingAudio ? "Pause Audio" : "Play Lo-Fi"}
                </span>
              </h3>
              <div className="flex items-center gap-3.5">
                <div className={cn(
                  "w-12 h-12 border border-[var(--line)] bg-[var(--surface-strong)] flex-shrink-0 flex items-center justify-center text-lg transition-all duration-300",
                  isPlayingAudio && "border-emerald-500 scale-105"
                )}>
                  <span>🎧</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-sans text-xs sm:text-sm font-bold uppercase tracking-tight text-[var(--ink)] truncate leading-tight mb-1">
                    Synthwave &amp; Ambient Flow
                  </p>
                  <p className="text-xs font-normal text-[var(--muted)] truncate">
                    {isPlayingAudio ? "Synthesizing generative lo-fi (0KB)" : "Click to play generative audio"}
                  </p>
                  {/* Mini progress bar */}
                  <div className="mt-2 h-1 w-full bg-[var(--line)] overflow-hidden">
                    <div className={cn(
                      "h-full bg-emerald-500 transition-all duration-1000",
                      isPlayingAudio ? "w-[85%] animate-pulse" : "w-[20%]"
                    )} />
                  </div>
                </div>
                {/* Audio Visualizer Bars */}
                <div className="ml-auto flex gap-[3px] items-end h-6 flex-shrink-0">
                  <div className={cn("w-1 transition-all duration-300", isPlayingAudio ? "bg-emerald-500 h-4 animate-bounce" : "bg-[var(--line)] h-1.5")} />
                  <div className={cn("w-1 transition-all duration-300", isPlayingAudio ? "bg-teal-400 h-6 animate-pulse" : "bg-[var(--line)] h-2")} />
                  <div className={cn("w-1 transition-all duration-300", isPlayingAudio ? "bg-emerald-500 h-3.5 animate-bounce" : "bg-[var(--line)] h-1")} />
                  <div className={cn("w-1 transition-all duration-300", isPlayingAudio ? "bg-cyan-400 h-5 animate-pulse" : "bg-[var(--line)] h-1.5")} />
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE COL: Metrics & GitHub Grid */}
          <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
            {/* GitHub Grid */}
            <div className="dashboard-panel border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-6 relative overflow-hidden group shadow-sm flex-1">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4 flex items-center justify-between">
                <span>Contribution Activity</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-[9px] uppercase tracking-wider">
                  Live Ticker
                </span>
              </h3>

              <div className="overflow-x-auto pb-1">
                <div className="grid grid-cols-14 grid-rows-7 gap-1 sm:gap-1.5 h-28 w-full min-w-[220px]">
                  {GITHUB_GRAPH.map((val, i) => (
                    <div
                      key={i}
                      title={`${val === 0 ? "No" : val * 3} contributions`}
                      className={cn(
                        "rounded-[1px] transition-all duration-200 hover:scale-125 cursor-pointer",
                        val === 0
                          ? "bg-black/5 dark:bg-white/5"
                          : val === 1
                            ? "bg-emerald-500/30"
                            : val === 2
                              ? "bg-emerald-500/50"
                              : val === 3
                                ? "bg-emerald-500/80"
                                : "bg-emerald-500"
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
              <div className="dashboard-panel border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-5 flex flex-col justify-center items-center text-center shadow-sm transition-colors">
                <div className="font-sans text-3xl font-bold uppercase tracking-tight text-[var(--ink)] flex items-center leading-none mb-1">
                  <span className="streak-counter">0</span>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold text-[var(--muted)]">
                  Day Streak
                </p>
              </div>

              <div className="dashboard-panel border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-5 flex flex-col justify-center items-center text-center shadow-sm transition-colors">
                <div className="font-sans text-base font-bold uppercase tracking-tight text-[var(--ink)] leading-tight mb-1">
                  Production
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.18em] font-semibold text-[var(--muted)]">
                  Latest Build
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COL: Interactive Terminal Emulator */}
          <div className="lg:col-span-4 flex flex-col gap-5 md:gap-6">
            <div className="dashboard-panel border border-[var(--ink)] dark:border-[var(--line)] bg-[#09090c] text-zinc-100 p-5 sm:p-6 relative overflow-hidden group shadow-md flex-1 flex flex-col justify-between font-mono text-xs">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 bg-emerald-500" />
                  <span className="text-[10px] text-zinc-400">ayush@kernel:~</span>
                </div>
                <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">BASH</span>
              </div>

              {/* Terminal Output Log Area */}
              <div className="h-44 overflow-y-auto space-y-1.5 pr-1 mb-3 text-[11px] leading-relaxed select-text font-mono">
                {terminalLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      log.startsWith(">") ? "text-emerald-400 font-bold" : "text-zinc-300"
                    )}
                  >
                    {log}
                  </div>
                ))}
                <div ref={terminalBottomRef} />
              </div>

              {/* Terminal Quick Command Chips */}
              <div className="flex flex-wrap gap-1.5 border-t border-white/10 pt-2.5 pb-1">
                {["help", "about", "projects", "skills", "resume", "github", "contact", "clear"].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => runCommand(cmd)}
                    className="border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-mono text-zinc-300 transition-colors hover:border-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Interactive Input Form */}
              <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 border-t border-white/10 pt-2.5">
                <span className="text-emerald-400 font-bold">$</span>
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={terminalInput}
                    onChange={(e) => setTerminalInput(e.target.value)}
                    placeholder="Type command..."
                    className="w-full bg-transparent text-xs text-white placeholder-zinc-500 focus:outline-none caret-emerald-400 font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="px-2.5 py-1 border border-white/20 text-[9px] font-mono font-bold text-zinc-300 hover:bg-white hover:text-black transition-colors"
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
