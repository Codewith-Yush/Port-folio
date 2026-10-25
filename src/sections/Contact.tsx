import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMagnetic } from "../hooks/useMagnetic";
import { GooeyTextReveal } from "../components/ui/gooey-text-reveal";

gsap.registerPlugin(ScrollTrigger);

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
    <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)]">
      {children}
    </span>
  );
}

function SocialButton({ href, label }: { href: string; label: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const magnetic = useMagnetic<HTMLAnchorElement>(0.2, reducedMotion);

  return (
    <a
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-11 items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--ink)] transition-colors hover:border-[#9baa9d] hover:bg-[#f7faf6] dark:border-[#39463c] dark:bg-[#1b241d] dark:hover:border-[#627766] dark:hover:bg-[#222e25] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52745f] dark:focus-visible:outline-[#9ac59f]"
    >
      <span>{label}</span>
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[#f2f6f1] text-[var(--ink)] dark:border-[#39463c] dark:bg-[#263329]">
        <span className="text-xs transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
          ↗
        </span>
      </span>
    </a>
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
    "peer w-full rounded-xl border border-[var(--line)] bg-[#f7f9f6] px-4 pb-3 pt-7 text-base text-[var(--ink)] placeholder-transparent transition-colors duration-200 focus:border-[#7f9b85] dark:focus:border-[#78977d] focus:bg-white focus:outline-none dark:border-[#39463c] dark:bg-[#202b23] dark:focus:border-[#78977d] dark:focus:bg-[#1b241d] sm:text-lg";

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
        className="pointer-events-none absolute left-4 top-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)] transition-colors duration-200 peer-focus:text-[#52745f] peer-[:not(:placeholder-shown)]:text-[#52745f] dark:peer-focus:text-[#a9cfad] dark:peer-[:not(:placeholder-shown)]:text-[#a9cfad]"
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
  useEffect(() => {
    if (reducedMotion) return;
    const ctx = gsap.context(() => {
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
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  /* Move focus to the confirmation so screen-reader users hear it */
  useEffect(() => {
    if (phase !== "success") return;
    successRef.current?.focus();
    if (!reducedMotion && successRef.current) {
      gsap.fromTo(
        successRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    }
  }, [phase, reducedMotion]);

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
      className="relative overflow-hidden border-t border-[#e2e8e1] bg-[#f5f7f3] py-16 text-[#24332a] [--page:#f5f7f3] [--surface:#ffffff] [--ink:#24332a] [--muted:#68766d] [--line:#dce4dc] dark:border-[#29352c] dark:bg-[#121a14] dark:text-[#edf3ed] dark:[--page:#121a14] dark:[--surface:#1b241d] dark:[--ink:#edf3ed] dark:[--muted:#a4b0a6] dark:[--line:#344137] sm:py-24 md:py-28"
    >
      <style>{CSS}</style>

      <Container className="relative z-10">
        {/* Sub-bar */}
        <div className="mb-12 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.22em] text-[var(--muted)] sm:mb-16">
          <span className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>( 04 ) — Contact</span>
          </span>
          <span>Replies within 12h</span>
        </div>

        <div className="flex flex-col items-start gap-14 lg:flex-row lg:gap-20">
          {/* Left: intro + details */}
          <div className="flex w-full flex-col gap-10 lg:w-[45%]">
            <div>
              <GooeyTextReveal
                mode="scroll"
                start="top 85%"
                blurAmount={0.35}
                duration={1.4}
                stagger={0.08}
                disabled={reducedMotion}
              >
                <h2 className="font-sans text-[clamp(2.4rem,5vw,4rem)] font-bold leading-[1.02] tracking-tight">
                  Let&rsquo;s build something together.
                </h2>
              </GooeyTextReveal>
              <p className="contact-reveal mt-5 max-w-md text-base font-normal leading-relaxed text-[var(--muted)]">
                Whether you have an upcoming project, a freelance inquiry, or an architectural
                challenge, my inbox is always open.
              </p>
            </div>

            <dl className="contact-reveal divide-y divide-[var(--line)] border-y border-[var(--line)] text-sm">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-4">
                <dt>
                  <Label>Email</Label>
                </dt>
                <dd className="flex items-center gap-3">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="ct-link font-medium text-[var(--ink)]"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    aria-live="polite"
                    className="font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:text-[var(--ink)]"
                  >
                    {copied ? "Copied ✓" : "Copy"}
                  </button>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt>
                  <Label>Response</Label>
                </dt>
                <dd className="font-medium">Under 12 hours</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt>
                  <Label>Based in</Label>
                </dt>
                <dd className="font-medium">New Delhi · IST (UTC+5:30)</dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <dt>
                  <Label>Status</Label>
                </dt>
                <dd className="flex items-center gap-2.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Open to freelance &amp; full-time
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
            {phase === "success" ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                className="flex min-h-[26rem] flex-col items-start justify-center rounded-2xl border border-[var(--line)] bg-white p-8 shadow-[0_12px_35px_rgba(36,51,42,0.06)] focus:outline-none dark:bg-[#1b241d] dark:shadow-none sm:p-12"
              >
                <svg
                  viewBox="0 0 52 52"
                  className="h-14 w-14 text-emerald-700"
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
                <h3 className="mt-8 font-sans text-3xl font-bold uppercase tracking-[-0.04em] sm:text-4xl">
                  Message sent.
                </h3>
                <p className="mt-3 max-w-sm text-base leading-relaxed text-[var(--muted)]">
                  Thanks for reaching out. I&rsquo;ll reply to your email within 12 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setPhase("idle");
                    setErrorMessage("");
                  }}
                  className="mt-8 inline-flex h-11 items-center justify-center rounded-xl border border-[var(--line)] bg-white px-6 text-sm font-semibold text-[var(--ink)] transition-colors hover:bg-[#f7faf6] dark:bg-[#222e25] dark:hover:bg-[#29372c] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52745f] dark:focus-visible:outline-[#9ac59f]"
                >
                  Send another
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                aria-busy={sending}
                className="rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[0_12px_35px_rgba(36,51,42,0.06)] dark:bg-[#1b241d] dark:shadow-none sm:p-10"
              >
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

                <div className="mb-8 flex items-center justify-between border-b border-[var(--line)] pb-4">
                  <Label>New inquiry</Label>
                  <Label>All fields required</Label>
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
                          <span className="inline-flex items-center rounded-full border border-[var(--line)] bg-[#f7f9f6] px-3.5 py-2 text-[13px] text-[var(--muted)] transition-colors duration-200 hover:border-[#9baa9d] hover:bg-white hover:text-[var(--ink)] peer-checked:border-[#b7d0bb] peer-checked:bg-[#eaf3e9] peer-checked:text-[#31553a] dark:border-[#39463c] dark:bg-[#202b23] dark:hover:border-[#627766] dark:hover:bg-[#27352a] dark:peer-checked:border-[#6b8f70] dark:peer-checked:bg-[#2c4431] dark:peer-checked:text-[#d7ead8] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#52745f] dark:focus-visible:outline-[#9ac59f]">
                            {t}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <FloatingField id="message" label="Project scope & brief" multiline />

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <button
                      ref={submitMagnetic.ref}
                      onMouseMove={submitMagnetic.onMouseMove}
                      onMouseLeave={submitMagnetic.onMouseLeave}
                      type="submit"
                      disabled={sending}
                      className="group inline-flex h-12 w-full items-center justify-between gap-6 rounded-xl bg-[#dcebdc] pl-6 pr-2.5 text-sm font-semibold text-[#28452d] transition-colors hover:bg-[#cfe2d0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#52745f] dark:focus-visible:outline-[#9ac59f] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
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
                      <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/75 text-[#28452d] dark:bg-[#304536] dark:text-[#edf3ed]">
                        <span className="text-sm font-bold transition-transform duration-300 group-hover:translate-x-1">
                          →
                        </span>
                      </span>
                    </button>

                    <p className="font-mono text-[11px] text-[var(--muted)]">
                      No spam. Only replies.
                    </p>
                  </div>

                  {phase === "error" && errorMessage && (
                    <p
                      role="alert"
                      className="rounded-xl border border-[#f0c7bd] bg-[#fff3ef] px-4 py-3 text-sm leading-relaxed text-[#9a3e2d]"
                    >
                      {errorMessage}
                    </p>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}


