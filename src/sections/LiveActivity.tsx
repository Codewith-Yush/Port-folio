import { useEffect, useRef, useState } from "react";
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

const RECENT_ACTIVITY = [
  { id: 1, type: "commit", message: "Pushed to main in Codewith-Yush/Port-folio", time: "2m ago", color: "bg-blue-400" },
  { id: 2, type: "deploy", message: "Production deployment successful", time: "15m ago", color: "bg-green-400" },
  { id: 3, type: "star", message: "Starred locomotivemtl/locomotive-scroll", time: "1h ago", color: "bg-yellow-400" },
  { id: 4, type: "pr", message: "Merged PR #42 in geometric-saas", time: "3h ago", color: "bg-purple-400" },
  { id: 5, type: "commit", message: "Refactored GSAP animations", time: "5h ago", color: "bg-blue-400" },
];

export function LiveActivity() {
  const containerRef = useRef<HTMLElement>(null);
  const [time, setTime] = useState(new Date());

  // Clock tick
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Endless scrolling ticker
      gsap.to(".ticker-track", {
        xPercent: -50,
        ease: "none",
        duration: 30,
        repeat: -1,
      });

      // Panel stagger reveal
      gsap.fromTo(
        ".dashboard-panel",
        { y: 30, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Streak counter animation
      gsap.fromTo(
        ".streak-counter",
        { innerHTML: 0 },
        {
          innerHTML: 42,
          duration: 2.5,
          snap: { innerHTML: 1 },
          ease: "power2.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative py-12 sm:py-16 overflow-hidden bg-[var(--page)] border-t border-[var(--line)]">
      {/* Subtle Data Grid Background */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" 
        style={{ 
          backgroundImage: "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)", 
          backgroundSize: "40px 40px",
          backgroundPosition: "center center"
        }} 
      />
      
      {/* Floating UI Particles */}
      <div className="absolute top-40 right-[15%] w-2 h-2 rounded-full bg-flame animate-ping opacity-50" />
      <div className="absolute bottom-40 left-[10%] w-3 h-3 rounded-full bg-blush animate-pulse opacity-40" />

      {/* Cyberpunk Ticker */}
      <div className="w-full border-y border-[var(--line)] bg-[var(--surface)]/30 backdrop-blur-md overflow-hidden flex whitespace-nowrap py-2.5 mb-16 relative z-10 shadow-sm">
        <div className="ticker-track flex gap-8 px-4 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-90">
           {Array(6).fill(0).map((_, i) => (
             <span key={i} className="flex gap-8 items-center">
               <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"/> SYSTEM STATUS: OPERATIONAL</span>
               <span>•</span>
               <span className="text-flame">LAST DEPLOY: 15M AGO</span>
               <span>•</span>
               <span>COFFEE LEVEL: CRITICAL</span>
               <span>•</span>
               <span>CURRENT FOCUS: AI INTEGRATION</span>
               <span>•</span>
             </span>
           ))}
        </div>
      </div>

      <Container>
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-black tracking-tighter text-[var(--ink)] flex items-center gap-4">
            <div className="relative flex h-5 w-5 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
            </div>
            LIVE ACTIVITY
          </h2>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-[var(--ink)] opacity-80">
            Real-time developer metrics & telemetry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 md:gap-6">
          
          {/* LEFT COL: Status & Vitals */}
          <div className="lg:col-span-3 flex flex-col gap-4 md:gap-6">
            
            {/* Status Panel */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-transparent opacity-80" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 mb-5">Core Status</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--ink)]">Availability</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 text-[10px] font-black uppercase tracking-widest rounded-md border border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]">ONLINE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-[var(--ink)]">Freelance</span>
                  <span className="px-2 py-1 bg-flame/10 text-flame text-[10px] font-black uppercase tracking-widest rounded-md border border-flame/20 shadow-[0_0_10px_rgba(223,108,79,0.2)]">ACCEPTING</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-black/5 dark:border-white/5">
                  <span className="text-sm font-bold text-[var(--ink)] opacity-70">Local Time</span>
                  <span className="text-sm font-mono font-bold text-[var(--ink)] bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                    {time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' })}
                  </span>
                </div>
              </div>
            </div>

            {/* Spotify Panel */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-green-600 opacity-80" />
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 mb-4 flex items-center gap-2">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-green-500"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.24 1.02zm1.44-3.3c-.301.42-.84.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.84.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.781-.18-.6.18-1.2.78-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.56.3z"/></svg>
                Now Playing
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 relative overflow-hidden">
                   {/* Abstract album art */}
                   <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.8),transparent)]" />
                   <div className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black/30 blur-sm" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-black text-[var(--ink)] truncate leading-tight mb-1">Cyberpunk 2077 OST</p>
                  <p className="text-xs font-semibold text-[var(--ink)] opacity-90 truncate">Marcin Przybyłowicz</p>
                </div>
                {/* EQ bars */}
                <div className="ml-auto flex gap-[2px] items-end h-4 flex-shrink-0">
                  <div className="w-1 bg-green-500 rounded-t-sm animate-[bounce_1s_infinite_0ms]" />
                  <div className="w-1 bg-green-500 rounded-t-sm animate-[bounce_1s_infinite_200ms]" />
                  <div className="w-1 bg-green-500 rounded-t-sm animate-[bounce_1s_infinite_400ms]" />
                </div>
              </div>
            </div>

          </div>

          {/* MIDDLE COL: Metrics & Graph */}
          <div className="lg:col-span-5 flex flex-col gap-4 md:gap-6">
            
            {/* GitHub Grid */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 md:p-6 relative overflow-hidden group shadow-sm flex-1">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 mb-5 flex items-center justify-between">
                 <span>Commit Activity</span>
                 <span className="text-flame bg-flame/10 px-2 py-0.5 rounded border border-flame/20">Last 98 Days</span>
               </h3>
               
               <div className="grid grid-cols-14 grid-rows-7 gap-1 md:gap-1.5 h-32 w-full">
                  {GITHUB_GRAPH.map((val, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "rounded-[2px] md:rounded-sm transition-all duration-300 hover:scale-125 hover:z-10",
                        val === 0 ? "bg-black/5 dark:bg-white/5" :
                        val === 1 ? "bg-flame/30" :
                        val === 2 ? "bg-flame/50 shadow-[0_0_8px_rgba(223,108,79,0.4)]" :
                        val === 3 ? "bg-flame/80 shadow-[0_0_12px_rgba(223,108,79,0.6)]" :
                        "bg-flame shadow-[0_0_16px_rgba(223,108,79,0.8)]"
                      )} 
                    />
                  ))}
               </div>
               <style>{`
                 .grid-cols-14 { grid-template-columns: repeat(14, minmax(0, 1fr)); }
                 .grid-rows-7 { grid-template-rows: repeat(7, minmax(0, 1fr)); }
               `}</style>
            </div>

            {/* Metrics Double */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
               <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
                 <svg className="w-6 h-6 text-flame mb-2 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                 <div className="text-4xl font-black text-[var(--ink)] flex items-center leading-none mb-1"><span className="streak-counter">0</span></div>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--ink)] opacity-80">Day Streak</p>
               </div>
               
               <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 flex flex-col justify-center items-center text-center shadow-sm">
                 <div className="w-8 h-8 rounded-full bg-blush/20 text-blush flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(235,164,151,0.4)]">🚀</div>
                 <div className="text-lg font-black text-[var(--ink)] leading-tight mb-1">Portfolio v2</div>
                 <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--ink)] opacity-80">Latest Deploy</p>
               </div>
            </div>

          </div>

          {/* RIGHT COL: Logs & Feed */}
          <div className="lg:col-span-4 flex flex-col gap-4 md:gap-6">
            
            {/* Activity Feed */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-5 relative overflow-hidden group shadow-sm flex-1">
               <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-transparent via-[var(--ink)] to-transparent opacity-10" />
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 mb-6 flex items-center justify-between">
                 <span>Terminal Logs</span>
                 <div className="w-1.5 h-1.5 rounded-full bg-[var(--ink)] animate-ping opacity-60" />
               </h3>
               
               <div className="space-y-5">
                 {RECENT_ACTIVITY.map(act => (
                   <div key={act.id} className="flex gap-4 items-start group/item">
                     <div className="mt-1 relative">
                        <div className={`w-2.5 h-2.5 rounded-full ${act.color} shadow-[0_0_8px_currentColor] opacity-80 group-hover/item:opacity-100 transition-opacity`} />
                        {act.id !== RECENT_ACTIVITY.length && <div className="absolute top-3 left-1/2 -translate-x-1/2 w-px h-8 bg-black/10 dark:bg-white/10" />}
                     </div>
                     <div>
                       <p className="text-xs font-mono font-bold text-[var(--ink)] opacity-90 leading-tight mb-1">{act.message}</p>
                       <p className="text-[10px] font-mono text-[var(--ink)] opacity-40 uppercase tracking-widest">{act.time}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>

            {/* Current Stack/Learning minimal row */}
            <div className="dashboard-panel border border-black/10 dark:border-white/10 bg-[var(--surface)]/60 backdrop-blur-xl rounded-2xl p-4 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 mb-3">Active Workspace</h3>
               <div className="flex flex-wrap gap-2">
                 <span className="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[10px] uppercase tracking-widest font-black">Web3.js</span>
                 <span className="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[10px] uppercase tracking-widest font-black">tRPC</span>
                 <span className="px-2.5 py-1 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-md text-[10px] uppercase tracking-widest font-black">GraphQL</span>
               </div>
            </div>

          </div>
        </div>
      </Container>
    </section>
  );
}
