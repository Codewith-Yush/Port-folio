import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Container } from "../components/Container";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMagnetic } from "../hooks/useMagnetic";
import { GooeyTextReveal } from "../components/ui/gooey-text-reveal";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CONTACT_EMAIL = "ayushsingh7360@gmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;
const WEB3FORMS_URL = "https://api.web3forms.com/submit";
const REQUEST_TIMEOUT_MS = 15000;

type Phase = "idle" | "sending" | "success" | "error";

const PROJECT_TYPES = ["Web app", "AI / Data", "Design", "Something else"];

const CSS = `
@keyframes ct-draw { to { stroke-dashoffset: 0; } }
.ct-check-circle { stroke-dasharray: 151; stroke-dashoffset: 151; animation: ct-draw .7s cubic-bezier(.65,0,.35,1) .05s forwards; }
.ct-check-tick   { stroke-dasharray: 36;  stroke-dashoffset: 36;  animation: ct-draw .45s cubic-bezier(.65,0,.35,1) .6s forwards; }
.ct-link { position: relative; display: inline-block; }
.ct-link::after {
  content: ""; position: absolute; left: 0; bottom: -2px; height: 1px; width: 100%;
  background: currentColor; transform: scaleX(0); transform-origin: right;
  transition: transform .45s cubic-bezier(.65,0,.35,1);
}
.ct-link:hover::after, .ct-link:focus-visible::after { transform: scaleX(1); transform-origin: left; }
@media (prefers-reduced-motion: reduce) {
  .ct-check-circle, .ct-check-tick { animation: none; stroke-dashoffset: 0; }
}
`;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-xs uppercase tracking-[0.22em] text-[var(--muted)]">
      {children}
    </span>
  );
}

function SocialButton({ href, label }: { href: string; label: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const magnetic = useMagnetic<HTMLAnchorElement>(0.2, reducedMotion);

  return (
    <motion.a
      whileHover={{ scale: 1.03, x: 2 }}
      whileTap={{ scale: 0.97 }}
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-11 items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[var(--flame)] hover:bg-[var(--surface-strong)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--flame)]"
    >
      <span>{label}</span>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--ink)]">
        <span className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </span>
    </motion.a>
  );
}

/** Filled field with a compact label and a clear, quiet focus state. */
function FloatingField({
  id,
  label,
  type = "text",
  multiline = false,
  autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const base =
    "peer w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] px-4 pb-3 pt-7 text-base text-[var(--ink)] placeholder-transparent transition-colors duration-200 focus:border-[var(--flame)] focus:bg-[var(--surface-strong)] focus:outline-none sm:text-lg";

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          id={id}
          name={id}
          required
          rows={4}
          placeholder=" "
          className={`${base} min-h-36 resize-y`}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          spellCheck={type === "email" ? false : undefined}
          placeholder=" "
          className={base}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)] transition-colors duration-200 peer-focus:text-[var(--flame)] peer-[:not(:placeholder-shown)]:text-[var(--flame)]"
      >
        {label}
      </label>
      <span
        aria-hidden="true"
        className="hidden"
      />
    </div>
  );
}

export function Contact() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const mountedRef = useRef(true);

  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const submitMagnetic = useMagnetic<HTMLButtonElement>(0.15, reducedMotion);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  /* Scroll reveal */
  useGSAP(
    () => {
      if (reducedMotion) return;
      gsap.fromTo(
        ".contact-reveal",
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%", once: true },
        },
      );
    },
    { scope: sectionRef, dependencies: [reducedMotion] }
  );

  /* Move focus to the confirmation so screen-reader users hear it */
  useEffect(() => {
    if (phase === "success") {
      successRef.current?.focus();
    }
  }, [phase]);

  useGSAP(
    () => {
      if (phase !== "success" || reducedMotion || !successRef.current) return;
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    },
    { scope: sectionRef, dependencies: [phase, reducedMotion] }
  );

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = CONTACT_EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => mountedRef.current && setCopied(false), 2200);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phase === "sending") return;

    if (!WEB3FORMS_KEY) {
      setPhase("error");
      setErrorMessage(`The form isn't configured yet. Please email ${CONTACT_EMAIL} directly.`);
      return;
    }

    const data = new FormData(e.currentTarget);

    // Honeypot: bots tick the hidden box. Pretend it worked, send nothing.
    if (data.get("botcheck")) {
      setPhase("success");
      return;
    }

    setPhase("sending");
    setErrorMessage("");

    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const res = await fetch(WEB3FORMS_URL, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
        signal: controller.signal,
      });
      const json = (await res.json().catch(() => null)) as
        | { success?: boolean; message?: string }
        | null;

      if (!mountedRef.current) return;

      if (res.ok && json?.success) {
        setPhase("success");
      } else {
        setPhase("error");
        setErrorMessage(
          json?.message
            ? `Couldn't send: ${json.message}`
            : `Something went wrong. Please try again or email ${CONTACT_EMAIL}.`,
        );
      }
    } catch (err) {
      if (!mountedRef.current) return;
      setPhase("error");
      setErrorMessage(
        err instanceof DOMException && err.name === "AbortError"
          ? `The request timed out. Please try again or email ${CONTACT_EMAIL}.`
          : `Network error. Please check your connection or email ${CONTACT_EMAIL}.`,
      );
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const sending = phase === "sending";

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] py-16 text-[var(--ink)] sm:py-24 md:py-28"
    >
      <style>{CSS}</style>

      <Container className="relative z-10">
        {/* Architectural Sub-bar */}
        <div className="mb-10 flex items-center justify-between border-b border-[var(--line)] pb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-14">
          <span className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span className="font-semibold text-[var(--ink)]">[04 // INITIATE TRANSMISSION]</span>
          </span>
          <span className="hidden sm:inline">[SLA // RESPONSE WITHIN 12H]</span>
        </div>

        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
          {/* Left: intro + details */}
          <div className="flex w-full flex-col gap-8 lg:w-[45%]">
            <div>
              <GooeyTextReveal
                mode="scroll"
                start="top 85%"
                blurAmount={0.35}
                duration={1.4}
                stagger={0.08}
                disabled={reducedMotion}
              >
                <h2 className="font-sans text-[clamp(2.5rem,5.2vw,4.2rem)] font-extrabold leading-[1.02] tracking-tight text-[var(--ink)]">
                  Let&rsquo;s engineer something resilient.
                </h2>
              </GooeyTextReveal>
              <p className="contact-reveal mt-5 max-w-md text-base font-normal leading-relaxed text-[var(--muted)]">
                Whether you have an upcoming project, a freelance contract, or an architectural
                data challenge, my inbox is always open.
              </p>
            </div>

            <dl className="contact-reveal divide-y divide-[var(--line)] border-y border-[var(--line)] font-mono text-xs">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-3.5">
                <dt className="uppercase tracking-[0.18em] text-[var(--muted)]">
                  [DIRECT EMAIL]
                </dt>
                <dd className="flex items-center gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="ct-link font-sans text-sm font-bold text-[var(--ink)]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-live="polite"
                    className="rounded-sm border border-[var(--line)] px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-[var(--muted)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] hover:bg-[var(--surface-strong)]"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="uppercase tracking-[0.18em] text-[var(--muted)]">
                  [RESPONSE TIME]
                </dt>
                <dd className="font-sans font-semibold text-[var(--ink)]">Under 12 hours</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="uppercase tracking-[0.18em] text-[var(--muted)]">
                  [LOCATION & TIME]
                </dt>
                <dd className="font-sans font-semibold text-[var(--ink)]">New Delhi, IN · IST (UTC+5:30)</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3.5">
                <dt className="uppercase tracking-[0.18em] text-[var(--muted)]">
                  [ENGAGEMENT]
                </dt>
                <dd className="flex items-center gap-2 font-sans font-bold text-[var(--ink)]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Open for Q2/Q3 Roles
                </dd>
              </div>
            </dl>

            <div className="contact-reveal flex flex-wrap gap-2.5">
              <SocialButton href="https://linkedin.com/in/ayush-singh-643a4b25a" label="LinkedIn" />
              <SocialButton href="https://github.com/codewith-Yush" label="GitHub" />
            </div>
          </div>

          {/* Right: form / confirmation */}
          <div className="contact-reveal w-full lg:w-[55%]">
            <AnimatePresence mode="wait">
              {phase === "success" ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.96, y: 16 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: -16 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  ref={successRef}
                  tabIndex={-1}
                  role="status"
                  className="flex min-h-[26rem] flex-col items-start justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-8 shadow-sm focus:outline-none sm:p-12"
                >
                  <svg
                    viewBox="0 0 52 52"
                    className="h-14 w-14 text-emerald-500 dark:text-[#C7ED70]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <circle className="ct-check-circle" cx="26" cy="26" r="24" />
                    <path className="ct-check-tick" d="M15 27l8 8 14-16" />
                  </svg>
                  <h3 className="mt-8 font-sans text-3xl font-bold uppercase tracking-[-0.04em] sm:text-4xl text-[var(--ink)]">
                    Message sent.
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--muted)]">
                    Thanks for reaching out. I&rsquo;ll reply to your email within 12 hours.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => {
                      setPhase("idle");
                      setErrorMessage("");
                    }}
                    className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] px-6 text-sm font-semibold text-[var(--ink)] transition-colors hover:border-[var(--flame)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--flame)]"
                  >
                    Send another
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="contact-form"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  onSubmit={handleSubmit}
                  aria-busy={sending}
                  className="relative rounded-xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[6px_6px_0px_var(--line)] transition-all duration-200 hover:border-[var(--ink)] sm:p-10"
                >
                  {/* Corner crosshairs */}
                  <span className="brutal-corner-cross left-3 top-2.5">+</span>
                  <span className="brutal-corner-cross right-3 top-2.5">+</span>

                  {/* Web3Forms fields */}
                  <input type="hidden" name="access_key" value={WEB3FORMS_KEY ?? ""} />
                  <input
                    type="hidden"
                    name="subject"
                    value="New portfolio message from Ayush Singh Portfolio"
                  />
                  <input type="hidden" name="from_name" value="Portfolio Contact Form" />
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    <span>[NEW INQUIRY]</span>
                    <span>[TRANSMISSION READY]</span>
                  </div>

                  <div className="grid gap-8 sm:gap-9">
                    <FloatingField id="name" label="Your name" autoComplete="name" />
                    <FloatingField id="email" label="Email address" type="email" autoComplete="email" />

                    <fieldset>
                      <legend className="mb-3">
                        <Label>Project type (optional)</Label>
                      </legend>
                      <div className="flex flex-wrap gap-2">
                        {PROJECT_TYPES.map((t) => (
                          <label key={t} className="cursor-pointer">
                            <input type="radio" name="project_type" value={t} className="peer sr-only" />
                            <span className="inline-flex items-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] px-3.5 py-2 text-xs text-[var(--muted)] transition-colors duration-200 hover:border-[var(--flame)] hover:text-[var(--ink)] peer-checked:border-[var(--flame)] peer-checked:bg-[var(--flame)] peer-checked:text-black font-semibold peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--flame)]">
                              {t}
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <FloatingField id="message" label="Project scope & brief" multiline />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        ref={submitMagnetic.ref}
                        onMouseMove={submitMagnetic.onMouseMove}
                        onMouseLeave={submitMagnetic.onMouseLeave}
                        type="submit"
                        disabled={sending}
                        className="btn-neo-base btn-neo-primary group inline-flex h-12 w-full items-center justify-between gap-6 pl-6 pr-2 text-sm font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                      >
                        <span>
                          {sending ? (
                            <span className="flex items-center gap-2">
                              <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                              <span>Sending…</span>
                            </span>
                          ) : phase === "error" ? (
                            "Try again"
                          ) : (
                            "Send message"
                          )}
                        </span>
                        <span className="btn-icon-pod h-8 w-8 rounded-full bg-[var(--page)] text-[var(--ink)] dark:bg-black dark:text-[#C7ED70]">
                          <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-0.5">
                            →
                          </span>
                        </span>
                      </motion.button>

                      <p className="font-mono text-xs text-[var(--muted)]">
                        No spam. Only replies.
                      </p>
                    </div>

                    {phase === "error" && errorMessage && (
                      <p
                        role="alert"
                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm leading-relaxed text-rose-600 dark:text-rose-400"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </section>
  );
}


