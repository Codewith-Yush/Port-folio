import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Container } from "../components/Container";
import { navItems } from "../data/portfolio";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/codewith-Yush",
    icon: "M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.154-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.933.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/ayush-singh-643a4b25a",
    icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z",
  },
  {
    label: "Twitter",
    href: "https://twitter.com",
    icon: "M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z",
  },
  {
    label: "Email",
    href: "mailto:ayushsingh7360@gmail.com",
    icon: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6",
  },
];

export function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* floating particles */
      const dots =
        particlesRef.current?.querySelectorAll<HTMLSpanElement>(".fp");

      dots?.forEach((d) => {
        gsap.to(d, {
          y: gsap.utils.random(-30, 30),
          x: gsap.utils.random(-18, 18),
          opacity: gsap.utils.random(0.25, 0.9),
          duration: gsap.utils.random(3, 6),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: gsap.utils.random(0, 2),
        });
      });

      /* ambient glow pulse */
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.2,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      /* split text */
      const split = SplitText.create(nameRef.current!, {
        type: "chars",
      });

      /* timeline */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 85%",
          end: "bottom top",
          toggleActions: "restart none restart none",
        },
        defaults: {
          ease: "expo.out",
        },
      });

      /* reset state before animation */
      gsap.set(split.chars, {
        opacity: 0,
        y: 60,
        rotateX: -90,
      });

      gsap.set(
        [
          taglineRef.current,
          dividerRef.current,
          navRef.current?.querySelectorAll("a"),
          socialsRef.current?.querySelectorAll(".social-icon"),
          bottomRef.current,
        ],
        {
          opacity: 0,
        }
      );

      /* name animation */
      tl.to(split.chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        stagger: 0.045,
        duration: 1,
      });

      /* tagline */
      tl.to(
        taglineRef.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
        },
        "-=0.5"
      );

      /* divider */
      tl.fromTo(
        dividerRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
        },
        "-=0.4"
      );

      /* nav links */
      const navLinks = navRef.current?.querySelectorAll("a");

      tl.fromTo(
        navLinks!,
        {
          opacity: 0,
          y: 20,
        },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.7,
        },
        "-=0.5"
      );

      /* social icons */
      const icons =
        socialsRef.current?.querySelectorAll<HTMLAnchorElement>(
          ".social-icon"
        );

      tl.fromTo(
        icons!,
        {
          opacity: 0,
          scale: 0.4,
          rotate: -25,
        },
        {
          opacity: 1,
          scale: 1,
          rotate: 0,
          stagger: 0.08,
          duration: 0.6,
          ease: "back.out(2)",
        },
        "-=0.45"
      );

      /* copyright */
      tl.fromTo(
        bottomRef.current,
        {
          opacity: 0,
          y: 18,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
        },
        "-=0.35"
      );

      /* nav hover */
      navLinks?.forEach((link) => {
        const enter = () => {
          gsap.to(link, {
            color: "#DF6C4F",
            x: 4,
            duration: 0.25,
          });
        };

        const leave = () => {
          gsap.to(link, {
            color: "",
            x: 0,
            duration: 0.25,
          });
        };

        link.addEventListener("mouseenter", enter);
        link.addEventListener("mouseleave", leave);
      });

      /* social hover */
      icons?.forEach((icon) => {
        const enter = () => {
          gsap.to(icon, {
            scale: 1.18,
            rotate: 8,
            duration: 0.3,
            ease: "back.out(2)",
          });
        };

        const leave = () => {
          gsap.to(icon, {
            scale: 1,
            rotate: 0,
            duration: 0.3,
          });
        };

        icon.addEventListener("mouseenter", enter);
        icon.addEventListener("mouseleave", leave);
      });

      /* footer floating effect */
      gsap.to(footerRef.current, {
        backgroundPosition: "200% center",
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      /* footer title loop */
      gsap.to(nameRef.current, {
        y: 6,
        rotationZ: 0.4,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden border-t border-[var(--line)] bg-[var(--page)] transition-colors duration-500"
    >
      {/* glow */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-1/2 top-0 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.13]"
        style={{
          background:
            "radial-gradient(circle, #DF6C4F 0%, transparent 70%)",
        }}
      />

      {/* particles */}
      <div
        ref={particlesRef}
        className="pointer-events-none absolute inset-0"
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="fp absolute rounded-full"
            style={{
              width: `${3 + (i % 4)}px`,
              height: `${3 + (i % 4)}px`,
              top: `${10 + ((i * 17) % 78)}%`,
              left: `${5 + ((i * 23) % 92)}%`,
              background:
                i % 3 === 0
                  ? "#DF6C4F"
                  : i % 3 === 1
                  ? "#FF9398"
                  : "#D14836",
              opacity: 0.25,
            }}
          />
        ))}
      </div>

      <Container className="relative z-10 pb-10 pt-16">
        {/* heading */}
        <div className="mb-10 text-center">
          <h2
            ref={nameRef}
            className="font-black tracking-tight text-[var(--ink)] footer-name-loop"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
              lineHeight: 1.05,
              perspective: "600px",
            }}
          >
            See you again soon 👋
          </h2>

          <p
            ref={taglineRef}
            className="mt-3 text-sm font-semibold uppercase tracking-[0.22em] text-[var(--muted)]"
          >
           Hope you enjoyed the experience.
          </p>
        </div>

        {/* divider */}
        <div
          ref={dividerRef}
          className="mx-auto mb-10 h-px w-full max-w-xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, #DF6C4F 40%, #FF9398 60%, transparent)",
          }}
        />

        {/* nav + socials */}
        <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <nav
            ref={navRef}
            className="flex flex-wrap justify-center gap-x-6 gap-y-3"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-xs font-black uppercase tracking-[0.18em] text-[var(--muted)]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* socials */}
          <div ref={socialsRef} className="flex items-center gap-4">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                aria-label={s.label}
                target="_blank"
                rel="noopener noreferrer"
                className="social-icon flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--muted)] transition-colors hover:border-[#DF6C4F] hover:text-[#D14836]"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d={s.icon} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* divider */}
        <div className="my-8 h-px w-full bg-[var(--line)]" />

        {/* bottom */}
        <div
          ref={bottomRef}
          className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-between sm:text-left"
        >
          <p className="text-xs font-bold text-[var(--muted)]">
            © {new Date().getFullYear()} Thanks for scrolling till the end. Feel free to connect, collaborate, or just say hello.
          </p>

          <p className="text-xs text-[var(--muted)]">
            Crafted with{" "}
            <span
              className="inline-block text-[#D14836]"
              style={{
                animation: "heartbeat 1.5s ease-in-out infinite",
              }}
            >
              ♥
            </span>{" "}
            & lots of coffee.
          </p>
        </div>
      </Container>

      <style>{`
        @keyframes heartbeat {
          0%,100% {
            transform: scale(1);
          }

          14% {
            transform: scale(1.3);
          }

          28% {
            transform: scale(1);
          }

          42% {
            transform: scale(1.2);
          }

          70% {
            transform: scale(1);
          }
        }
      `}</style>
    </footer>
  );
}