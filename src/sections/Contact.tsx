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
      className="group relative overflow-hidden rounded-full border border-black/10 bg-[var(--surface)]/50 px-4 py-2.5 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(223,108,79,0.2)] active:scale-95 dark:border-white/10 sm:px-6 sm:py-3"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-flame to-blush opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
      <span className="relative z-10 text-[10px] font-black uppercase tracking-widest text-[var(--ink)] transition-colors group-hover:text-flame sm:text-xs">
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
        { y: 42, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!WEB3FORMS_KEY) {
      event.preventDefault();
      setStatus({
        type: "error",
        message: "Email service is missing its access key. Please use the direct email link.",
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
        message: "Please fill in your name, email, and message before sending.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: "idle", message: "" });
    hasSubmittedRef.current = true;
  };

  const handleDeliveryFrameLoad = () => {
    if (!hasSubmittedRef.current) {
      return;
    }

    hasSubmittedRef.current = false;
    setIsSubmitting(false);
    setSubmitted(true);
    setStatus({
      type: "success",
      message: `Message submitted successfully. Please check ${CONTACT_EMAIL}.`,
    });
    formRef.current?.reset();
    window.setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] py-12 sm:py-16"
    >
      <div className="absolute right-0 top-0 h-[300px] w-[300px] translate-x-1/4 -translate-y-1/4 rounded-full bg-gradient-to-b from-flame/5 to-transparent blur-[80px] pointer-events-none sm:h-[600px] sm:w-[600px] sm:translate-x-1/3 sm:-translate-y-1/3 sm:blur-[120px]" />

      <Container className="relative z-10">
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:gap-24">
          <div className="flex w-full flex-col gap-8 md:gap-10 lg:w-[45%]">
            <div className="contact-reveal">
              <h2 className="mb-4 text-xs font-black uppercase tracking-[0.3em] text-flame sm:mb-6 sm:text-sm">
                Connect
              </h2>
              <h3 className="text-4xl font-black leading-[0.95] tracking-tighter text-[var(--ink)] sm:text-5xl md:text-6xl lg:text-7xl">
                Let's build <br />
                <span className="bg-gradient-to-r from-flame to-blush bg-clip-text text-transparent">
                  something great.
                </span>
              </h3>
              <p className="mt-4 max-w-md text-base font-medium text-[var(--ink)] opacity-90 sm:mt-6 sm:text-lg">
                Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
              </p>
            </div>

            <div className="contact-reveal group relative overflow-hidden rounded-3xl border border-black/10 bg-[var(--surface)]/60 p-6 shadow-[0_20px_40px_rgba(0,0,0,0.05)] backdrop-blur-xl dark:border-white/10 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 transition-opacity duration-700 pointer-events-none group-hover:opacity-100" />

              <div className="relative z-10 mb-6 flex items-center gap-3 sm:mb-8 sm:gap-4">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-[var(--ink)] sm:text-sm">
                  Available for Work
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-4 sm:gap-5">
                <div className="flex items-center justify-between border-b border-black/5 pb-4 dark:border-white/5 sm:pb-5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 sm:text-xs">
                    Response Time
                  </span>
                  <span className="text-xs font-black text-[var(--ink)] sm:text-sm">&lt; 12 Hours</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink)] opacity-80 sm:text-xs">
                    Email
                  </span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="break-all text-right text-xs font-black text-[var(--ink)] transition-colors hover:text-flame sm:text-sm"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-reveal mt-2 flex flex-wrap gap-3 sm:gap-4">
              <SocialButton href={`mailto:${CONTACT_EMAIL}`} label="Email" />
              <SocialButton href="https://linkedin.com" label="LinkedIn" />
              <SocialButton href="https://github.com" label="GitHub" />
            </div>
          </div>

          <div className="contact-reveal w-full lg:w-[55%]">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              action="https://api.web3forms.com/submit"
              method="POST"
              target="contact-delivery-frame"
              className="relative overflow-hidden rounded-[2.5rem] border border-black/5 bg-white/[0.03] p-6 shadow-[0_40px_100px_rgba(0,0,0,0.25)] backdrop-blur-2xl dark:border-white/5 dark:bg-black/20 sm:rounded-[3rem] sm:p-10 md:p-14"
            >
              <input type="hidden" name="access_key" value={WEB3FORMS_KEY ?? ""} />
              <input type="hidden" name="subject" value="New portfolio message" />
              <input type="hidden" name="from_name" value="Ayush Singh Portfolio" />
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <iframe
                title="Contact form delivery"
                name="contact-delivery-frame"
                className="hidden"
                onLoad={handleDeliveryFrameLoad}
              />

              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-flame/50 to-transparent opacity-60" />

              <div className="grid gap-10 sm:gap-12">
                <div className="group relative">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    className="peer w-full border-b-2 border-black/10 bg-transparent px-1 py-3 text-base font-creative font-bold text-[var(--ink)] placeholder-transparent transition-all focus:border-flame focus:outline-none dark:border-white/10 sm:text-lg"
                    placeholder=" "
                  />
                  <label
                    htmlFor="name"
                    className="absolute left-1 top-3 cursor-text font-modern text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-flame peer-focus:opacity-100 sm:peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:text-flame peer-[:not(:placeholder-shown)]:opacity-100"
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
                    className="peer w-full border-b-2 border-black/10 bg-transparent px-1 py-3 text-base font-creative font-bold text-[var(--ink)] placeholder-transparent transition-all focus:border-flame focus:outline-none dark:border-white/10 sm:text-lg"
                    placeholder=" "
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-1 top-3 cursor-text font-modern text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-flame peer-focus:opacity-100 sm:peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:text-flame peer-[:not(:placeholder-shown)]:opacity-100"
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
                    className="peer w-full resize-none border-b-2 border-black/10 bg-transparent px-1 py-3 text-base font-creative font-bold text-[var(--ink)] placeholder-transparent transition-all focus:border-flame focus:outline-none dark:border-white/10 sm:text-lg"
                    placeholder=" "
                  />
                  <label
                    htmlFor="message"
                    className="absolute left-1 top-3 cursor-text font-modern text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)] opacity-50 transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-medium peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-flame peer-focus:opacity-100 sm:peer-placeholder-shown:text-lg peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black peer-[:not(:placeholder-shown)]:text-flame peer-[:not(:placeholder-shown)]:opacity-100"
                  >
                    Project Details
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || submitted || !WEB3FORMS_KEY}
                  className="group relative mt-6 w-full overflow-hidden rounded-2xl bg-[var(--ink)] py-4 text-xs font-black uppercase tracking-[0.25em] text-[var(--page)] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_25px_50px_rgba(0,0,0,0.2)] active:scale-[0.98] disabled:opacity-70 disabled:hover:scale-100 sm:mt-8 sm:py-5 sm:text-sm"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-flame via-ember to-blush opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--page)] border-t-transparent sm:h-5 sm:w-5" />
                    ) : submitted ? (
                      "Message Received"
                    ) : (
                      <>
                        Send Message
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </>
                    )}
                  </span>
                </button>

                {status.message && (
                  <p
                    role={status.type === "error" ? "alert" : "status"}
                    className={`rounded-xl border px-4 py-3 text-sm font-bold leading-6 ${status.type === "success"
                      ? "border-green-500/20 bg-green-500/10 text-green-700 dark:text-green-300"
                      : "border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-300"
                      }`}
                  >
                    {status.message}
                  </p>
                )}

                {!WEB3FORMS_KEY && (
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-center text-xs font-black uppercase tracking-[0.18em] text-flame underline-offset-4 hover:underline"
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
