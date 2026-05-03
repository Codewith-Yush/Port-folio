import { useState } from "react";
import { navItems } from "../data/portfolio";
import { cn } from "../utils/cn";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  const [open, setOpen] = useState(false);

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--line)] bg-[var(--page)]/90 backdrop-blur-xl transition-colors duration-500">
      <Container className="flex h-20 items-center justify-between">
        <a
          href="#hero"
          onClick={closeMenu}
          className="group flex items-center gap-3 text-sm font-black uppercase tracking-[0.22em] text-[var(--ink)]"
          aria-label="Ayush Singh home"
        >
          <span className="grid h-10 w-10 place-items-center bg-flame text-white transition duration-300 group-hover:rotate-6">
            AS
          </span>
          <span className="hidden sm:block">Ayush Singh</span>
        </a>

        <nav className="hidden items-center gap-2 md:flex" aria-label="Primary navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-flame"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="grid h-11 w-11 place-items-center border border-[var(--line)] bg-[var(--surface)] md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((current) => !current)}
          >
            <span className="flex h-4 w-5 flex-col justify-between">
              <span className={cn("h-0.5 bg-flame transition", open && "translate-y-[7px] rotate-45")} />
              <span className={cn("h-0.5 bg-flame transition", open && "opacity-0")} />
              <span className={cn("h-0.5 bg-flame transition", open && "-translate-y-[7px] -rotate-45")} />
            </span>
          </button>
        </div>
      </Container>

      <div
        className={cn(
          "grid overflow-hidden border-t border-[var(--line)] bg-[var(--page)] transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <nav className="min-h-0 px-5" aria-label="Mobile navigation">
          <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-[var(--line)] py-4 text-sm font-bold uppercase tracking-[0.18em] text-[var(--ink)]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
