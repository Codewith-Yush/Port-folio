import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "../components/Container";

gsap.registerPlugin(ScrollTrigger);

function SocialButton({ href, label }: { href: string; label: string }) {
  return (
    <a 
      href={href}
      className="group relative px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-black/10 dark:border-white/10 bg-[var(--surface)]/50 backdrop-blur-md overflow-hidden hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(223,108,79,0.2)] active:scale-95"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-flame to-blush opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      <span className="relative z-10 text-[10px] sm:text-xs font-black uppercase tracking-widest text-[var(--ink)] group-hover:text-flame transition-colors">
        {label}
      </span>
    </a>
  );
}

export function Contact() {
  const containerRef = useRef<HTMLElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Staggered reveal animations
      gsap.fromTo(
        ".contact-reveal",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    // You can also add custom subjects or other Web3Forms features here
    // formData.append("subject", "New Contact from Portfolio");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        e.currentTarget.reset();
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        console.error("Error", data);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={containerRef} className="relative py-24 sm:py-32 overflow-hidden bg-[var(--page)] border-t border-[var(--line)]">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-b from-flame/5 to-transparent rounded-full blur-[80px] sm:blur-[120px] pointer-events-none transform translate-x-1/4 -translate-y-1/4 sm:translate-x-1/3 sm:-translate-y-1/3" />
      
      <Container className="relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-24 items-start">
          
          {/* LEFT COLUMN: Info & Availability */}
          <div className="w-full lg:w-[45%] flex flex-col gap-8 md:gap-10">
            <div className="contact-reveal">
              <h2 className="text-xs sm:text-sm font-black uppercase tracking-[0.3em] text-flame mb-4 sm:mb-6 animate-pulse">
                Connect
              </h2>
              <h3 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[var(--ink)] tracking-tighter leading-[0.95]">
                Let's build <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-flame to-blush">something great.</span>
              </h3>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-[var(--ink)] opacity-90 max-w-md">
                Whether you have a specific project in mind or just want to explore possibilities, my inbox is always open.
              </p>
            </div>
            
            {/* Freelance Availability Card */}
            <div className="contact-reveal p-6 sm:p-8 rounded-3xl bg-[var(--surface)]/60 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.05)] relative overflow-hidden group">
              {/* Dynamic Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              
              <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 relative z-10">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>
                </span>
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-[var(--ink)]">Available for Work</span>
              </div>
              
              <div className="flex flex-col gap-4 sm:gap-5 relative z-10">
                <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 pb-4 sm:pb-5">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--ink)] opacity-80">Response Time</span>
                  <span className="text-xs sm:text-sm font-black text-[var(--ink)]">&lt; 12 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--ink)] opacity-80">Email</span>
                  <span className="text-xs sm:text-sm font-black text-[var(--ink)] cursor-pointer hover:text-flame transition-colors break-all ml-4">ayushsingh7360@gmail.com</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="contact-reveal flex flex-wrap gap-3 sm:gap-4 mt-2">
              <SocialButton href="mailto:ayushsingh7360@gmail.com" label="Email" />
              <SocialButton href="https://linkedin.com" label="LinkedIn" />
              <SocialButton href="https://github.com" label="GitHub" />
            </div>
          </div>

          {/* RIGHT COLUMN: Modern Form */}
          <div className="w-full lg:w-[55%] contact-reveal">
            <form 
              onSubmit={handleSubmit}
              className="bg-[var(--surface)]/40 backdrop-blur-lg p-6 sm:p-8 md:p-12 rounded-[2rem] sm:rounded-[2.5rem] border border-black/5 dark:border-white/5 shadow-2xl relative overflow-hidden"
            >
              {/* Web3Forms Access Key - Get yours for free at https://web3forms.com/ */}
              <input 
                type="hidden" 
                name="access_key" 
                value={import.meta.env.VITE_WEB3FORMS_KEY || "YOUR_ACCESS_KEY_HERE"} 
              />
              
              {/* Form subtle glow */}
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-flame to-transparent opacity-50" />
              
              <div className="grid gap-6 sm:gap-8">
                {/* Name Input */}
                <div className="relative group">
                  <input 
                    type="text" 
                    id="name" 
                    name="name"
                    required
                    className="peer w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 text-[var(--ink)] py-3 px-1 focus:outline-none focus:border-flame transition-colors text-base sm:text-lg font-medium placeholder-transparent"
                    placeholder="Name"
                  />
                  <label 
                    htmlFor="name" 
                    className="absolute left-1 top-3 text-[var(--ink)] opacity-80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-flame peer-focus:opacity-100 peer-focus:font-bold peer-placeholder-shown:top-3 peer-placeholder-shown:text-base sm:peer-placeholder-shown:text-lg peer-placeholder-shown:opacity-50 uppercase tracking-widest cursor-text"
                  >
                    Your Name
                  </label>
                </div>

                {/* Email Input */}
                <div className="relative group">
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    required
                    className="peer w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 text-[var(--ink)] py-3 px-1 focus:outline-none focus:border-flame transition-colors text-base sm:text-lg font-medium placeholder-transparent"
                    placeholder="Email"
                  />
                  <label 
                    htmlFor="email" 
                    className="absolute left-1 top-3 text-[var(--ink)] opacity-80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-flame peer-focus:opacity-100 peer-focus:font-bold peer-placeholder-shown:top-3 peer-placeholder-shown:text-base sm:peer-placeholder-shown:text-lg peer-placeholder-shown:opacity-50 uppercase tracking-widest cursor-text"
                  >
                    Email Address
                  </label>
                </div>

                {/* Message Input */}
                <div className="relative group">
                  <textarea 
                    id="message" 
                    name="message"
                    required
                    rows={4}
                    className="peer w-full bg-transparent border-b-2 border-black/10 dark:border-white/10 text-[var(--ink)] py-3 px-1 focus:outline-none focus:border-flame transition-colors text-base sm:text-lg font-medium placeholder-transparent resize-none"
                    placeholder="Message"
                  />
                  <label 
                    htmlFor="message" 
                    className="absolute left-1 top-3 text-[var(--ink)] opacity-80 transition-all duration-300 peer-focus:-top-4 peer-focus:text-[10px] sm:peer-focus:text-xs peer-focus:text-flame peer-focus:opacity-100 peer-focus:font-bold peer-placeholder-shown:top-3 peer-placeholder-shown:text-base sm:peer-placeholder-shown:text-lg peer-placeholder-shown:opacity-50 uppercase tracking-widest cursor-text"
                  >
                    Project Details
                  </label>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={isSubmitting || submitted}
                  className="mt-4 sm:mt-6 w-full py-4 sm:py-5 rounded-xl sm:rounded-2xl bg-[var(--ink)] text-[var(--page)] text-xs sm:text-sm font-black uppercase tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group disabled:opacity-70 disabled:hover:scale-100"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-flame to-blush opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <span className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-[var(--page)] border-t-transparent rounded-full" />
                    ) : submitted ? (
                      "Message Sent ✓"
                    ) : (
                      "Send Message →"
                    )}
                  </span>
                </button>

              </div>
            </form>
          </div>

        </div>
      </Container>
    </section>
  );
}
