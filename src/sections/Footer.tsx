import { Container } from "../components/Container";
import { navItems } from "../data/portfolio";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--page)] py-8 transition-colors duration-500">
      <Container className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-bold text-[var(--muted)]">
          &copy; {new Date().getFullYear()} Ayush Singh. Built with React and Tailwind CSS.
        </p>
        <nav className="flex flex-wrap gap-x-5 gap-y-3" aria-label="Footer navigation">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)] transition hover:text-flame"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </Container>
    </footer>
  );
}
