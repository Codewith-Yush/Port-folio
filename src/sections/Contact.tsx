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
    <a href={href} className="group relative overflow-hidden rounded-full border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-6 py-3 shadow-sm backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-black/30 dark:hover:border-white/30 active:scale-95">
      <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-black/70 dark:text-white/70 transition-colors group-hover:text-[var(--ink)]">
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
      gsap.fromTo(".contact-reveal", { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: containerRef.current, start: "top 75%" } });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!WEB3FORMS_KEY) {
      event.preventDefault();
      setStatus({ type: "error", message: "Email service is missing its access key. Please use the direct email link." });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    if (!name || !email || !message) {
      event.preventDefault();
      setStatus({ type: "error", message: "Please fill in your name, email, and message before sending." });
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
    setStatus({ type: "success", message: `Message submitted successfully. Please check ${CONTACT_EMAIL}.` });
    formRef.current?.reset();
    window.setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <section id="contact" ref={containerRef} className="relative overflow-hidden border-t border-black/5 dark:border-white/5 bg-[var(--page)] py-24 sm:py-32 text-black dark:text-white transition-colors duration-500">
      <div className="absolute right-0 top-0 h-[600px] w-[600px] translate-x-1/3 -translate-y-1/3 rounded-full bg-black/5 dark:bg-white/5 blur-[120px] pointer-events-none transition-colors duration-500" />

      <Container className="relative z-10">
        <div className="flex flex-col items-start gap-16 lg:flex-row lg:gap-24">
          <div className="flex w-full flex-col gap-10 lg:w-[45%]">
            <div className="contact-reveal">
              <h2 className="mb-6 text-[10px] font-bold uppercase tracking-[0.3em] text-black/50 dark:text-white/50 transition-colors duration-500">
                Connect
              </h2>
              <h3 className="text-[clamp(3rem,6vw,5rem)] font-light leading-[1.05] tracking-tight text-[var(--ink)] transition-colors duration-500">
                Let's build <br />
                <span className="font-serif italic text-black/70 dark:text-white/70">something great.</span>
              </h3>
              <p className="mt-6 max-w-md text-lg font-normal text-[var(--muted)] leading-relaxed transition-colors duration-500">
                Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
              </p>
            </div>

            <div className="contact-reveal group relative overflow-hidden rounded-3xl border border-black/10 dark:border-white/10 bg-[var(--surface-strong)]/40 p-8 backdrop-blur-xl transition-colors duration-500">
              <div className="relative z-10 mb-8 flex items-center gap-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--ink)]">
                  Available for Work
                </span>
              </div>

              <div className="relative z-10 flex flex-col gap-5">
                <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-5">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    Response Time
                  </span>
                  <span className="text-sm font-light text-[var(--ink)]">&lt; 12 Hours</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                    Email
                  </span>
                  <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-right text-sm font-light text-[var(--ink)] transition-colors hover:text-black/70 dark:hover:text-white/70">
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-reveal mt-2 flex flex-wrap gap-4">
              <SocialButton href={`mailto:${CONTACT_EMAIL}`} label="Email" />
              <SocialButton href="https://linkedin.com" label="LinkedIn" />
              <SocialButton href="https://github.com" label="GitHub" />
            </div>
          </div>

          <div className="contact-reveal w-full lg:w-[55%]">
            <form ref={formRef} onSubmit={handleSubmit} action="https://api.web3forms.com/submit" method="POST" target="contact-delivery-frame" className="relative overflow-hidden rounded-[2.5rem] border border-black/10 dark:border-white/10 bg-white/50 dark:bg-white/5 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-2xl backdrop-blur-xl sm:rounded-[3rem] sm:p-12 transition-colors duration-500">
              <input type="hidden" name="access_key" value={WEB3FORMS_KEY ?? ""} />
              <input type="hidden" name="subject" value="New portfolio message" />
              <input type="hidden" name="from_name" value="Ayush Singh Portfolio" />
              <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />
              <iframe title="Contact form delivery" name="contact-delivery-frame" className="hidden" onLoad={handleDeliveryFrameLoad} />

              <div className="grid gap-12">
                <div className="group relative">
                  <input type="text" id="name" name="name" required autoComplete="name" className="peer w-full border-b border-black/20 dark:border-white/20 bg-transparent px-1 py-3 text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-black dark:focus:border-white focus:outline-none" placeholder=" " />
                  <label htmlFor="name" className="absolute left-1 top-3 cursor-text text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-light peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-black dark:peer-focus:text-white peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[var(--ink)] peer-[:not(:placeholder-shown)]:opacity-100">
                    Your Name
                  </label>
                </div>

                <div className="group relative">
                  <input type="email" id="email" name="email" required autoComplete="email" className="peer w-full border-b border-black/20 dark:border-white/20 bg-transparent px-1 py-3 text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-black dark:focus:border-white focus:outline-none" placeholder=" " />
                  <label htmlFor="email" className="absolute left-1 top-3 cursor-text text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-light peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-black dark:peer-focus:text-white peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[var(--ink)] peer-[:not(:placeholder-shown)]:opacity-100">
                    Email Address
                  </label>
                </div>

                <div className="group relative">
                  <textarea id="message" name="message" required rows={4} className="peer w-full resize-none border-b border-black/20 dark:border-white/20 bg-transparent px-1 py-3 text-lg font-light text-[var(--ink)] placeholder-transparent transition-all focus:border-black dark:focus:border-white focus:outline-none" placeholder=" " />
                  <label htmlFor="message" className="absolute left-1 top-3 cursor-text text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] transition-all duration-300 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:font-light peer-placeholder-shown:opacity-70 peer-focus:-top-4 peer-focus:text-[9px] peer-focus:text-black dark:peer-focus:text-white peer-focus:opacity-100 peer-[:not(:placeholder-shown)]:-top-4 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:text-[var(--ink)] peer-[:not(:placeholder-shown)]:opacity-100">
                    Project Details
                  </label>
                </div>

                <button type="submit" disabled={isSubmitting || submitted || !WEB3FORMS_KEY} className="group relative w-full overflow-hidden rounded-full bg-[var(--ink)] py-5 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--page)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70">
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--page)] border-t-transparent" /> : submitted ? "Message Received" : "Send Message"}
                  </span>
                </button>

                {status.message && (
                  <p role={status.type === "error" ? "alert" : "status"} className={`rounded-xl border px-4 py-3 text-sm font-medium leading-6 ${status.type === "success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300" : "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-300"}`}>
                    {status.message}
                  </p>
                )}
                
                {!WEB3FORMS_KEY && (
                  <a href={`mailto:${CONTACT_EMAIL}`} className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 dark:text-white/50 underline-offset-4 hover:text-[var(--ink)] hover:underline transition-colors">
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
