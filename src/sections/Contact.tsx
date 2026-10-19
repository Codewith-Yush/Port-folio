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
      className="group relative overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-2.5 shadow-sm backdrop-blur-md transition-colors duration-300 hover:border-[#252A34] hover:bg-[#252A34] hover:text-white dark:hover:bg-white dark:hover:text-black active:scale-95"
    >
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/80 transition-colors group-hover:text-white dark:group-hover:text-black">
        {label}
      </span>
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

      const tiltX = (((y - centerY) / centerY) * -4).toFixed(2);
      const tiltY = (((x - centerX) / centerX) * 4).toFixed(2);

      el.style.transform = `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.01)`;

      if (glareEl) {
        const glareX = ((x / rect.width) * 100).toFixed(1);
        const glareY = ((y / rect.height) * 100).toFixed(1);
        glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12) 0%, transparent 65%)`;
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
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.95,
          stagger: 0.12,
          ease: "power3.out",
          force3D: true,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setStatus({
        type: "error",
        message: "Please fill in your name, email, and project details before sending.",
      });
      return;
    }

    // If Web3Forms key is present, submit asynchronously via Web3Forms
    if (WEB3FORMS_KEY) {
      setIsSubmitting(true);
      setStatus({ type: "idle", message: "" });
      hasSubmittedRef.current = true;
      triggerSubmitCelebration();
      form.submit();
      return;
    }

    // Graceful direct fallback: open mailto with prefilled details
    setIsSubmitting(true);
    triggerSubmitCelebration();
    const subject = encodeURIComponent(`Project Inquiry from ${name}`);
    const body = encodeURIComponent(
      `Hello Ayush,\n\nMy name is ${name} (${email}).\n\nProject details:\n${message}\n\nBest regards,\n${name}`
    );
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setStatus({
        type: "success",
        message: `Opening your email client to deliver message to ${CONTACT_EMAIL}! You can also copy my email directly below.`,
      });
      formCardRef.current?.reset();
      setTimeout(() => setSubmitted(false), 6000);
    }, 400);
  };

  const handleDeliveryFrameLoad = () => {
    if (!hasSubmittedRef.current) return;
    hasSubmittedRef.current = false;
    setIsSubmitting(false);
    setSubmitted(true);
    triggerSubmitCelebration();
    setStatus({
      type: "success",
      message: `Message sent successfully! I will get back to you promptly at ${CONTACT_EMAIL}.`,
    });
    formCardRef.current?.reset();
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden border-t border-black/5 dark:border-white/5 bg-[var(--page)] py-16 sm:py-20 md:py-24 text-[var(--ink)] transition-colors duration-500"
    >
      <div className="absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 -translate-y-1/3 rounded-full bg-[var(--flame)]/5 dark:bg-[var(--flame)]/10 blur-[130px] pointer-events-none" />

      <Container className="relative z-10">
        <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-20">
          {/* Left Column: Intro & Info */}
          <div className="flex w-full flex-col gap-8 lg:w-[45%]">
            <div className="contact-reveal">
              <span className="mb-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] dark:text-[var(--blush)]">
                Get In Touch
              </span>
              <h2 className="text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.08] tracking-tight text-[var(--ink)]">
                Let's build <br />
                <span className="font-serif italic text-[var(--flame)] dark:text-[var(--blush)] font-normal">
                  something great.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm sm:text-base font-light text-[var(--ink)]/70 leading-relaxed">
                Whether you have an upcoming project, freelance inquiry, or architectural challenge,
                my inbox is always open.
              </p>
            </div>

            {/* Quick Status Card with subtle hover */}
            <div className="contact-reveal group relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 sm:p-7 backdrop-blur-xl shadow-sm transition-all duration-300 hover:shadow-lg hover:border-black/25 dark:hover:border-white/25">
              <div className="relative z-10 mb-6 flex items-center gap-3">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                  Available for New Projects
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-4 text-xs">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4">
                  <span className="font-semibold uppercase tracking-wider text-[var(--ink)]/50">
                    Typical Response
                  </span>
                  <span className="font-medium text-[var(--ink)]">&lt; 12 Hours</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="font-semibold uppercase tracking-wider text-[var(--ink)]/50">
                    Direct Email
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="break-all text-right font-medium text-emerald-500 hover:underline"
                    >
                      {CONTACT_EMAIL}
                    </a>
                    <button
                      type="button"
                      onClick={handleCopyEmail}
                      aria-label="Copy email address"
                      className="inline-flex items-center rounded-lg border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-2 py-1 text-[10px] font-semibold text-[var(--ink)] transition hover:bg-emerald-500 hover:text-white"
                    >
                      {copiedEmail ? "Copied! ✓" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Buttons with Magnetic Physics */}
            <div className="contact-reveal flex flex-wrap gap-2.5">
              <SocialButton href={`mailto:${CONTACT_EMAIL}`} label="Direct Email" />
              <SocialButton href="https://linkedin.com/in/ayush-singh-643a4b25a" label="LinkedIn" />
              <SocialButton href="https://github.com/codewith-Yush" label="GitHub" />
            </div>
          </div>

          {/* Right Column: Contact Form with 3D Perspective Tilt */}
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
              className="group/form relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 sm:p-10 shadow-xl backdrop-blur-2xl transition-all duration-500 hover:shadow-2xl hover:border-emerald-500/20"
            >
              {/* Animated gradient border ring */}
              <div
                className="pointer-events-none absolute -inset-[1px] rounded-3xl opacity-0 group-hover/form:opacity-100 transition-opacity duration-700 z-0"
                style={{
                  background: "conic-gradient(from 180deg, var(--flame), #10B981, #06B6D4, #8B5CF6, var(--flame))",
                  mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                  maskComposite: "exclude",
                  WebkitMaskComposite: "xor",
                  padding: "1.5px",
                  animation: "form-border-spin 8s linear infinite",
                }}
              />
              {/* Dynamic Glare Overlay */}
              <div
                ref={glareRef}
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 z-10"
              />

              {/* Submission Celebration Shockwave Ring */}
              <div
                ref={shockwaveRef}
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-3xl border-2 border-emerald-400 opacity-0 z-10"
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
                      className="peer w-full border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] dark:focus:border-[var(--blush)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="name"
                      className="absolute left-1 top-3 cursor-text text-xs uppercase tracking-[0.2em] text-[var(--ink)]/50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--flame)] dark:peer-focus:text-[var(--blush)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[var(--ink)]/70"
                    >
                      Your Name
                    </label>
                  </div>

                  <div className="group relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      autoComplete="email"
                      className="peer w-full border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] dark:focus:border-[var(--blush)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-1 top-3 cursor-text text-xs uppercase tracking-[0.2em] text-[var(--ink)]/50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--flame)] dark:peer-focus:text-[var(--blush)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[var(--ink)]/70"
                    >
                      Email Address
                    </label>
                  </div>

                  <div className="group relative">
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={4}
                      className="peer w-full resize-none border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] dark:focus:border-[var(--blush)] focus:outline-none"
                      placeholder=" "
                    />
                    <label
                      htmlFor="message"
                      className="absolute left-1 top-3 cursor-text text-xs uppercase tracking-[0.2em] text-[var(--ink)]/50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-focus:-top-4 peer-focus:text-[10px] peer-focus:text-[var(--flame)] dark:peer-focus:text-[var(--blush)] peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:text-[var(--ink)]/70"
                    >
                      Project Details & Scope
                    </label>
                  </div>

                  <button
                    ref={submitMagnetic.ref}
                    onMouseMove={submitMagnetic.onMouseMove}
                    onMouseLeave={submitMagnetic.onMouseLeave}
                    type="submit"
                    disabled={isSubmitting || submitted}
                    className="group relative w-full overflow-hidden rounded-full bg-[#252A34] dark:bg-white py-4 sm:py-4.5 text-xs font-bold uppercase tracking-[0.2em] text-white dark:text-black transition-all duration-300 hover:scale-[1.01] hover:bg-emerald-500 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-black active:scale-[0.99] disabled:opacity-70 shadow-lg"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : submitted ? (
                        "Message Received ✓"
                      ) : (
                        "Send Message →"
                      )}
                    </span>
                  </button>

                  {status.message && (
                    <p
                      role={status.type === "error" ? "alert" : "status"}
                      className={`rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed ${status.type === "success"
                          ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                          : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
                        }`}
                    >
                      {status.message}
                    </p>
                  )}

                  <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]/50">
                    Direct inquiries:{" "}
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-emerald-500 hover:underline"
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
