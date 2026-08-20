import { useEffect, useRef, useState, type FormEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger);

const CONTACT_EMAIL = "ayushsingh7360@gmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY as string | undefined;

type FormStatus = {
  type: "idle" | "success" | "error";
  message: string;
};

function SocialButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="group relative overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-5 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-[#252A34] hover:bg-[#252A34] hover:text-white active:scale-95"
    >
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[var(--ink)]/80 transition-colors group-hover:text-white">
        {label}
      </span>
    </a>
  );
}

export function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hasSubmittedRef = useRef(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState<FormStatus>({ type: "idle", message: "" });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-reveal",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: containerRef.current, start: "top 75%" },
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!WEB3FORMS_KEY) {
      event.preventDefault();
      setStatus({
        type: "error",
        message: "Email service access key is not set. Please reach out directly via email.",
      });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      event.preventDefault();
      setStatus({
        type: "error",
        message: "Please fill in your name, email, and project details before sending.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });
    hasSubmittedRef.current = true;
  };

  const handleDeliveryFrameLoad = () => {
    if (!hasSubmittedRef.current) return;
    hasSubmittedRef.current = false;
    setIsSubmitting(false);
    setSubmitted(true);
    setStatus({
      type: "success",
      message: `Message sent successfully! I will get back to you promptly at ${CONTACT_EMAIL}.`,
    });
    formRef.current?.reset();
    window.setTimeout(() => setSubmitted(false), 6000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden border-t border-black/5 dark:border-white/5 bg-[var(--page)] py-12 sm:py-16 md:py-20 text-[var(--ink)] transition-colors duration-500"
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
                <span className="font-serif italic text-[var(--flame)] dark:text-[var(--blush)]">
                  something great.
                </span>
              </h2>
              <p className="mt-5 max-w-md text-sm sm:text-base font-normal text-[var(--ink)]/70 leading-relaxed">
                Whether you have an upcoming project, freelance inquiry, or architectural challenge,
                my inbox is always open.
              </p>
            </div>

            {/* Quick Status Card */}
            <div className="contact-reveal group relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 sm:p-7 backdrop-blur-xl shadow-sm transition-all hover:shadow-md">
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
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-all text-right font-medium text-[var(--flame)] dark:text-[var(--blush)] hover:underline"
                  >
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
              ref={formRef}
              onSubmit={handleSubmit}
              action="https://api.web3forms.com/submit"
              method="POST"
              target="contact-delivery-frame"
              className="relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface)] p-6 sm:p-10 shadow-lg backdrop-blur-2xl transition-colors duration-500"
            >
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
                    className="peer w-full border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] focus:outline-none"
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
                    className="peer w-full border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] focus:outline-none"
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
                    className="peer w-full resize-none border-b border-black/15 dark:border-white/15 bg-transparent px-1 py-3 text-base sm:text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-[var(--flame)] focus:outline-none"
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
                  type="submit"
                  disabled={isSubmitting || submitted || !WEB3FORMS_KEY}
                  className="group relative w-full overflow-hidden rounded-full bg-[#252A34] py-4 sm:py-4.5 text-xs font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:bg-[#252A34]/90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 shadow-md"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--page)] border-t-transparent" />
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
                    className={`rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium leading-relaxed ${
                      status.type === "success"
                        ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300"
                        : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"
                    }`}
                  >
                    {status.message}
                  </p>
                )}

                {!WEB3FORMS_KEY && (
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--flame)] dark:text-[var(--blush)] hover:underline"
                  >
                    Email {CONTACT_EMAIL} directly
                  </a>
                )}
              </div>
            </form>
          </div>
        </div>
      </Container>
    </section>
  );
}
