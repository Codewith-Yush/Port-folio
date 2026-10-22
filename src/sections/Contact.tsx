import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { useMagnetic } from "../hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAIL = "ayushsingh7360@gmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type FormStatus = {
  type: "idle" | "success" | "error";
  message: string;
};

function SocialButton({ href, label }: { href: string; label: string }) {
  const magnetic = useMagnetic<HTMLAnchorElement>(0.2);

  return (
    <a
      ref={magnetic.ref}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group inline-flex h-11 items-center justify-between gap-3 border border-[var(--line)] bg-[var(--surface)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--ink)] transition-colors duration-300 hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--page)]"
    >
      <span>{label}</span>
      <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
    </a>
  );
}

export function Contact() {
  const reducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLElement>(null);
  const formCardRef = useRef<HTMLFormElement>(null);
  const shockwaveRef = useRef<HTMLDivElement>(null);
  const hasSubmittedRef = useRef(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  // 3D Tilt state for Contact Form Card (zero-render requestAnimationFrame)
  const glareRef = useRef<HTMLDivElement>(null);
  const rafId = useRef(0);

  // Magnetic button for submit
  const submitMagnetic = useMagnetic<HTMLButtonElement>(0.15, reducedMotion);

  const triggerSubmitCelebration = () => {
    if (reducedMotion) return;
    if (shockwaveRef.current) {
      gsap.fromTo(
        shockwaveRef.current,
        { scale: 0.96, opacity: 0.9, borderColor: "#10b981" },
        { scale: 1.05, opacity: 0, duration: 0.85, ease: "power2.out", force3D: true }
      );
    }
    if (formCardRef.current) {
      gsap.fromTo(
        formCardRef.current,
        { scale: 0.985 },
        { scale: 1, duration: 0.5, ease: "back.out(2)", force3D: true }
      );
    }
  };

  const handleFormMouseMove = (e: MouseEvent<HTMLFormElement>) => {
    if (reducedMotion || !formCardRef.current || (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches)) return;
    const clientX = e.clientX;
    const clientY = e.clientY;

    if (rafId.current) return;
    rafId.current = requestAnimationFrame(() => {
      rafId.current = 0;
      const el = formCardRef.current;
      const glareEl = glareRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = (((y - centerY) / centerY) * -3).toFixed(2);
      const tiltY = (((x - centerX) / centerX) * 3).toFixed(2);

      el.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.005)`;

      if (glareEl) {
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 65%)`;
        glareEl.style.opacity = "1";
      }
    });
  };

  const handleFormMouseEnter = () => {
    if (formCardRef.current) {
      formCardRef.current.style.transition = "transform 0.12s ease-out";
    }
  };

  const handleFormMouseLeave = () => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = 0;
    }
    const el = formCardRef.current;
    const glareEl = glareRef.current;
    if (el) {
      el.style.transition = "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)";
      el.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
    if (glareEl) {
      glareEl.style.opacity = "0";
    }
  };

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!WEB3FORMS_KEY) {
      setStatus({
        type: "error",
        message: "Form configuration missing. Please email ayushsingh7360@gmail.com directly.",
      });
      return;
    }

    setIsSubmitting(true);
    hasSubmittedRef.current = true;
    setStatus({ type: "idle", message: "" });
    formCardRef.current?.submit();

    window.setTimeout(() => {
      if (hasSubmittedRef.current && isSubmitting) {
        setIsSubmitting(false);
        setSubmitted(true);
        triggerSubmitCelebration();
        setStatus({
          type: "success",
          message: "Transmission delivered successfully! I will reply within 12 hours.",
        });
        formCardRef.current?.reset();
      }
    }, 1800);
  };

  const handleDeliveryFrameLoad = () => {
    if (!hasSubmittedRef.current) return;
    setIsSubmitting(false);
    setSubmitted(true);
    triggerSubmitCelebration();
    setStatus({
      type: "success",
      message: "Transmission delivered successfully! I will reply within 12 hours.",
    });
    formCardRef.current?.reset();
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] py-16 sm:py-24 md:py-28 text-[var(--ink)] transition-colors duration-500"
    >
      <Container className="relative z-10">
        {/* Frame Top Sub-Bar */}
        <div className="flex items-center justify-between border-b border-[var(--line)] pb-4 font-mono text-[10px] uppercase tracking-[0.18em] sm:text-[11px] mb-12 sm:mb-16">
          <span className="flex items-center gap-3 text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" aria-hidden="true" />
            <span>05 <span className="px-2">—</span> Transmission</span>
          </span>
          <span className="text-[var(--muted)]">Inquiries <span className="px-2">/</span> Q1–Q2 2026</span>
        </div>

        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
          {/* Left Column: Intro & Info */}
          <div className="flex w-full flex-col gap-8 lg:w-[45%]">
            <div className="contact-reveal">
              <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] sm:mb-7 sm:text-xs">
                Direct inquiries <span className="px-1 text-emerald-700 dark:text-emerald-400">×</span> collaboration
              </p>
              <h2 className="font-sans text-[clamp(2.8rem,6vw,5.5rem)] font-bold uppercase leading-[0.85] tracking-[-0.075em] text-[var(--ink)]">
                <span>Let's build</span><br />
                <span className="font-serif font-normal italic lowercase tracking-[-0.07em] text-emerald-700 dark:text-emerald-400">
                  together
                </span>
                <span>.</span>
              </h2>
              <p className="mt-6 max-w-md text-sm leading-7 text-[var(--muted)] sm:text-base font-normal">
                Whether you have an upcoming project, freelance inquiry, or architectural challenge,
                my inbox is always open.
              </p>
            </div>

            {/* Quick Status Card */}
            <div className="contact-reveal border border-[var(--line)] hover:border-[var(--ink)] bg-[var(--surface)] p-6 sm:p-7 shadow-sm transition-colors">
              <div className="mb-5 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Availability</span>
                </span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">Active</span>
              </div>

              <div className="flex flex-col gap-3.5 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <span className="text-[var(--muted)] uppercase tracking-wider">Response Window</span>
                  <span className="font-semibold text-[var(--ink)]">&lt; 12 Hours</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[var(--muted)] uppercase tracking-wider">Direct Channel</span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="contact-reveal flex flex-wrap gap-2.5">
              <SocialButton href={`mailto:${CONTACT_EMAIL}`} label="Direct Email" />
              <SocialButton href="https://linkedin.com/in/ayush-singh-643a4b25a" label="LinkedIn" />
              <SocialButton href="https://github.com/codewith-Yush" label="GitHub" />
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-reveal w-full lg:w-[55%]">
            <form
              ref={formCardRef}
              onSubmit={handleSubmit}
              onMouseMove={handleFormMouseMove}
              onMouseEnter={handleFormMouseEnter}
              onMouseLeave={handleFormMouseLeave}
              action="https://api.web3forms.com/submit"
              method="POST"
              target="contact-delivery-frame"
              style={{
                transform: "perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)",
                willChange: "transform",
              }}
              className="group/form relative overflow-hidden border border-[var(--ink)] dark:border-[var(--line)] bg-[var(--surface)] p-6 sm:p-10 shadow-lg transition-all duration-300"
            >
              {/* Dynamic Glare Overlay */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
              />

              {/* Submission Celebration Shockwave Ring */}
              <div
                ref={shockwaveRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 border-2 border-emerald-400 opacity-0 z-10"
              />

              <div className="relative z-20">
                <input type="hidden" name="access_key" value={WEB3FORMS_KEY ?? ""} />
                <input type="hidden" name="subject" value="New portfolio message from Ayush Singh Portfolio" />
                <input type="hidden" name="from_name" value="Portfolio Contact Form" />
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
                <iframe
                  title="Contact form delivery"
                  name="contact-delivery-frame"
                  className="hidden"
                  onLoad={handleDeliveryFrameLoad}
                />

                <div className="grid gap-8 sm:gap-10">
                  <div className="group relative">
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      autoComplete="name"
                      className="peer w-full border-b border-[var(--line)] bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--ink)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-1 top-3 cursor-text font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--ink)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      01 / Your Name
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="peer w-full border-b border-[var(--line)] bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--ink)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-1 top-3 cursor-text font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--ink)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      02 / Email Address
                    </label>
                  </div>

                  <div className="group relative">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="peer w-full resize-none border-b border-[var(--line)] bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--ink)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-1 top-3 cursor-text font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-xs peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--ink)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px]"
                    >
                      03 / Project Scope &amp; Brief
                    </label>
                  </div>

                  <button
                    ref={submitMagnetic.ref}
                    onMouseMove={submitMagnetic.onMouseMove}
                    onMouseLeave={submitMagnetic.onMouseLeave}
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className="group inline-flex h-12 w-full sm:w-auto items-center justify-between gap-8 border border-[var(--ink)] bg-[var(--ink)] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.13em] text-[var(--page)] transition-colors duration-300 hover:bg-transparent hover:text-[var(--ink)] disabled:opacity-50"
                  >
                    <span>
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Dispatching...</span>
                        </span>
                      ) : submitted ? (
                        "Transmission Sent ✓"
                      ) : (
                        "Send Message"
                      )}
                    </span>
                    <span className="text-base transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </button>

                  {status.message && (
                    <p
                      role={status.type === "error" ? "alert" : "status"}
                      className={`border px-4 py-3 font-mono text-xs leading-relaxed ${
                        status.type === "success"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
                      }`}
                    >
                      {status.message}
                    </p>
                  )}

                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--muted)]">
                    Direct inquiries:{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
