---
name: Ayush Singh Portfolio Design System
description: Modern architectural dark-mode portfolio bridging creative technology, full-stack engineering, and data science.
colors:
  primary: "#B39CFF"
  secondary: "#1E90FF"
  hover: "#FF0099"
  neutral-bg: "#0D0D0D"
  surface: "#141416"
  surface-strong: "#1C1C20"
  ink: "#FFFFFF"
  muted: "#9E9EA8"
  line: "rgba(255, 255, 255, 0.10)"
typography:
  display-monumental:
    fontFamily: '"Syne", "Space Grotesk", sans-serif'
    fontSize: "clamp(3.5rem, 14vw, 11.5rem)"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.04em"
  display:
    fontFamily: '"Syne", "Space Grotesk", sans-serif'
    fontSize: "clamp(2.5rem, 6vw, 5rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: '"Syne", "Space Grotesk", sans-serif'
    fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: '"Syne", "Space Grotesk", sans-serif'
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  small:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.01em"
  caption:
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
  editorial:
    fontFamily: '"Instrument Serif", Georgia, serif'
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  mono:
    fontFamily: '"JetBrains Mono", monospace'
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: "0.02em"
rounded:
  sm: "6px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  xxl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.neutral-bg}"
    rounded: "{rounded.full}"
    padding: "12px 28px"
  card-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.xl}"
    padding: "24px 32px"
---

# Design System

## Overview

The visual language of Ayush Singh's portfolio merges the precision of architectural diagrams and data intelligence with the expressive energy of creative technology. It establishes a strong dark visual identity anchored by signature **Electric Lavender (`#B39CFF`)**, **Electric Blue (`#1E90FF`)**, and dominant **Almost-Black (`#0D0D0D`)**, with **Vivid Pink (`#FF0099`)** reserved for selective interactive hover accents.

## Colors

- **Primary Accent (`#B39CFF` - Electric Lavender):** Used for focal calls-to-action, key active indicators, signature badges, and typographic highlights. High contrast against dark surfaces.
- **Secondary Accent (`#1E90FF` - Electric Blue):** Used for secondary badges, technology labels, links, telemetry points, and developer tech stack chips.
- **Hover Accent (`#FF0099` - Vivid Pink):** Reserved strictly for micro-interactions, subtle hover accents, and selective special details.
- **Dark Ground (`#0D0D0D` - Dominant Almost-Black):** Dominant dark canvas background.
- **Surfaces (`#141416` & `#1C1C20`):** Matte charcoal cards framed with crisp razor-sharp borders.
- **Ink & Typography (`#FFFFFF` & `#9E9EA8`):** Pure legible contrast with deliberate hierarchical fading.
- **Light Theme Ground (`#F7F5F5`):** Soft off-white canvas with `#2C2C2C` charcoal typography, preserving the exact same electric lavender and blue accents.

## Typography

- **Display & Section Titles:** `Syne` and `Space Grotesk`—geometric, impactful, and architectonic with tight negative letter-spacing (`-0.03em`).
- **Body & Longform:** `Plus Jakarta Sans`—clean geometric humanist sans-serif ensuring reading comfort and clarity at dense information densities.
- **Editorial Flourishes:** `Instrument Serif`—used sparingly for italicized contrast phrases (e.g. *"crafting systems"*, *"predictive analytics"*).
- **Technical & Metrics:** `JetBrains Mono`—for data points, tags, dates, and code snippets.

## Layout

- **Grid:** Responsive fluid container (`max-w-7xl` / `1280px` max content bounds) with asymmetric editorial balance.
- **Spacing Scale:** Generous vertical rhythm (`py-20` to `py-32` between sections) giving individual project case studies room to breathe.
- **Mobile Adaptability:** Single-column stacked layouts below 768px with tactile bottom navigation and swipe-friendly sheet overlays.

## Elevation & Depth

- **Tonal Layering:** Depth is constructed through surface lightness contrast (`#08080A` -> `#101015` -> `#171720`) rather than muddy drop shadows.
- **Hairline Borders:** `rgba(255, 255, 255, 0.12)` razor-sharp hairline borders providing architectural discipline.
- **Glassmorphism:** Subdued `backdrop-blur-md` on sticky header bars and navigation pill menus.

## Shapes

- **Badges & CTAs:** Continuous pill geometry (`rounded-full`) for interactive anchors and tech tags.
- **Cards & Visual Containers:** `rounded-2xl` (16px) or `rounded-3xl` (24px) with subtle internal paddings.

## Components

- **Project Feature Cards:** Multi-column split layouts featuring high-fidelity mockups, live preview action links, quantifiable metric tags, and technical stack chips.
- **Skill Matrices:** Grouped by architectural domains (Full-Stack Web, Data & Machine Learning, Creative Technology, Tools) with proficiency indicators.
- **Interactive Contact Hub:** Modal and embedded workflows featuring instant copy-to-clipboard, social connection direct links, and validated message forms.

## Do's and Don'ts

### Do's
- Pair data-driven case studies (metrics, GitHub, live link) with interactive polish.
- Maintain high contrast ratios for readability (WCAG AA minimum).
- Use `JetBrains Mono` for metadata, tags, and metrics to reinforce technical credibility.
- Treat smooth animations and micro-interactions as feedback mechanisms, not gratuitous distractions.

### Don'ts
- Do not use generic rainbow gradients, generic blur blobs, or muddy drop shadows.
- Do not hide live project URLs or GitHub links behind extra clicks.
- Do not mix mismatched serif or cursive fonts outside of the defined `Instrument Serif` editorial token.
- Do not sacrifice mobile readability or touch target sizes (minimum 44x44px).
