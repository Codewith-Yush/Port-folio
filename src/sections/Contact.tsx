import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Container } from "../components/Container";
import { SectionHeading } from "../components/SectionHeading";

type FormState = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = {
  name: "",
  email: "",
  message: "",
};

const ownerEmail = "ayushsingh7360@gmail.com";
const contactEndpoint = `https://formsubmit.co/ajax/${ownerEmail}`;

const socialLinks = [
  { label: "LinkedIn", href: "https://www.linkedin.com/" },
  { label: "GitHub", href: "https://github.com/" },
  { label: "Email", href: `mailto:${ownerEmail}` },
];

function validate(form: FormState) {
  const errors: FormErrors = {};

  if (form.name.trim().length < 2) {
    errors.name = "Enter your name.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email.";
  }

  if (form.message.trim().length < 12) {
    errors.message = "Share a little more detail.";
  }

  return errors;
}

export function Contact() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );

  const updateField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      setStatus("sending");

      try {
        const response = await fetch(contactEndpoint, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            email: form.email,
            message: form.message,
            _subject: `Portfolio inquiry from ${form.name}`,
            _template: "table",
          }),
        });

        if (!response.ok) {
          throw new Error("Contact form request failed.");
        }

        setStatus("success");
        setForm(initialForm);
      } catch {
        setStatus("error");
      }
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-[var(--surface)] py-16 transition-colors duration-500 sm:py-20 lg:py-24">
      <Container className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Have a product surface that needs clarity?"
            copy="Send a note with the shape of the work. I usually respond with a few sharp questions and a practical next step."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            {socialLinks.map((link) => (
              <Button key={link.label} href={link.href} variant="secondary">
                {link.label}
              </Button>
            ))}
          </div>
        </div>

        <form
          className="contact-form border border-[var(--line)] bg-[var(--page)] p-5 sm:p-8"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-flame dark:text-blush">
                Name
              </span>
              <input
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                className="form-control min-h-14 border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--ink)] outline-none transition focus:border-flame"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                autoComplete="name"
              />
              {errors.name ? (
                <span id="name-error" className="text-sm font-bold text-flame">
                  {errors.name}
                </span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-flame dark:text-blush">
                Email
              </span>
              <input
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                className="form-control min-h-14 border border-[var(--line)] bg-[var(--surface)] px-4 text-[var(--ink)] outline-none transition focus:border-flame"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email ? (
                <span id="email-error" className="text-sm font-bold text-flame">
                  {errors.email}
                </span>
              ) : null}
            </label>
          </div>

          <label className="mt-5 grid gap-2">
            <span className="text-xs font-black uppercase tracking-[0.18em] text-flame dark:text-blush">
              Message
            </span>
            <textarea
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="form-control min-h-40 resize-y border border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-[var(--ink)] outline-none transition focus:border-flame"
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "message-error" : undefined}
            />
            {errors.message ? (
              <span id="message-error" className="text-sm font-bold text-flame">
                {errors.message}
              </span>
            ) : null}
          </label>

          <div className="mt-7 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={status === "sending"}
              className="premium-button premium-button--primary min-h-12 border border-flame bg-flame px-6 text-sm font-black uppercase tracking-[0.18em] text-white shadow-shape transition duration-300 hover:-translate-y-1 hover:bg-ember disabled:cursor-wait disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-flame focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--page)] dark:shadow-shape-dark"
            >
              {status === "sending" ? "Sending..." : "Send Message"}
            </button>
            {status === "success" ? (
              <p className="text-sm font-bold text-[var(--ink)]" role="status">
                Message sent to {ownerEmail}.
              </p>
            ) : null}
            {status === "error" ? (
              <p className="text-sm font-bold text-flame" role="alert">
                Message could not be sent. Please try again or email {ownerEmail}.
              </p>
            ) : null}
          </div>
        </form>
      </Container>
    </section>
  );
}
