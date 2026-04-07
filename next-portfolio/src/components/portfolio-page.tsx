"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Gem,
  GitFork,
  GraduationCap,
  Layers3,
  Mail,
  MapPin,
  MonitorSmartphone,
  Phone,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { useRef } from "react";
import jackolImage from "@/assets/project_images/jackol.jpg";
import motominiGif from "@/assets/project_images/motomini.gif";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { TechBackground } from "@/components/tech-background";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const skills = [
  {
    title: "Frontend Craft",
    description:
      "Responsive interfaces built with React, TypeScript, Tailwind, and component-driven structure.",
    icon: MonitorSmartphone,
  },
  {
    title: "Interface Systems",
    description:
      "Consistent layouts, reusable sections, visual hierarchy, and interaction patterns that scale cleanly.",
    icon: Gem,
  },
  {
    title: "Workflow Rhythm",
    description:
      "Git-based iteration, practical prototyping, debugging, and implementation that stays organized.",
    icon: Layers3,
  },
  {
    title: "Growth Track",
    description:
      "Deployment, API integration, stronger product thinking, and production-style collaboration habits.",
    icon: BriefcaseBusiness,
  },
];

type Project = {
  title: string;
  description: string;
  stack: string[];
  href: string;
  label: string;
  year: string;
  ctaLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  embedSrc?: string;
  detailTitle?: string;
  detailSummary?: string;
  metaCards?: Array<{ label: string; value: string }>;
  features?: string[];
  achievements?: string[];
};

const projects: Project[] = [
  {
    title: "Mathivity",
    description:
      "An educational 2D tower defense game built as a final year project to help primary school students learn percentages, ratios, and fractions through immersive strategic play.",
    stack: ["Godot 4", "GDScript", "HTML5/WebGL", "Windows Export", "Live2D Cubism"],
    href: "https://amirulgodot.itch.io/mathivity",
    label: "Educational Game",
    year: "FYP",
    ctaLabel: "Play on itch.io",
    secondaryHref: "#showcase",
    secondaryLabel: "Open live showcase",
    embedSrc: "https://itch.io/embed-upload/16436534?color=333333",
    detailTitle:
      "A 2D mathematical tower defense experience that turns core maths practice into a rewarding gameplay loop.",
    detailSummary:
      "Mathivity uses Math Popups, narrative-driven challenges, and three distinct thematic worlds to reduce student anxiety and make mathematical problem-solving feel more engaging than traditional worksheet-based learning.",
    metaCards: [
      {
        label: "Learning layer",
        value: "Three thematic worlds designed around percentages, ratios, and fractions.",
      },
      {
        label: "Gameplay logic",
        value: "Mathematical answers become strategic requirements for placement, path decisions, and victory.",
      },
      {
        label: "Deployment",
        value: "Optimized export builds for Windows Desktop and HTML5/WebGL to support low-end school hardware.",
      },
    ],
    features: [
      "Implemented a Target Lock system to synchronize ballistic projectiles with moving enemy targets for more accurate hit animation.",
      "Built spatial validation logic with a 60-pixel distance check to prevent tower overlap and preserve path integrity.",
      "Created Math Popup assessment modals that pause the game state with get_tree().paused = true while students answer questions.",
      "Developed a dialogue system that gives actionable cues about upcoming path splits using percentage-based strategic hints.",
      "Configured cross-platform delivery for offline Windows desktop play and browser-based HTML5/WebGL access.",
    ],
    achievements: [
      "Presented successfully at the SULAM International Project in Perak, Malaysia.",
      "Validated through user testing with an 81.9% usability rating.",
      "Received 100% positive feedback on the visual art style.",
      "Used Live2D Cubism for character assets and built related mobile security challenge work with Android Studio.",
      "Completed the UiTM Mobile SecOps 21 Days Challenge with the Rentverse Defender project.",
    ],
  },
  {
    title: "MotoGP FansBot",
    description:
      "A campaign-style landing page built to practice conversion flow, section pacing, and stronger call-to-action placement.",
    stack: ["UI Design", "Responsive", "Layout"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "Landing Page",
    year: "2025",
  },
  {
    title: "UiTM Perak Departments Dashboard",
    description:
      "An experimental web app used to explore conversational interactions, logic flow, and reusable UI patterns.",
    stack: ["JavaScript", "Interaction", "Web App"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "Prototype App",
    year: "2024",
  },
];

const experience = [
  {
    phase: "Present",
    title: "Student Developer at UiTM",
    description:
      "I am currently studying at Universiti Teknologi Mara while building web applications and improving my frontend discipline through practical projects.",
    icon: GraduationCap,
  },
  {
    phase: "Focus",
    title: "Tech-Driven Frontend Interfaces",
    description:
      "My recent work centers on responsive layouts, motion systems, cleaner UI patterns, and stronger frontend presentation.",
    icon: Sparkles,
  },
  {
    phase: "Next",
    title: "Internship or Freelance Role",
    description:
      "I am ready to contribute to product teams, sharpen implementation quality, and learn through real delivery environments.",
    icon: BriefcaseBusiness,
  },
];

const contactLinks = [
  {
    label: "Email",
    value: "amirulfariz901@gmail.com",
    href: "mailto:amirulfariz901@gmail.com",
    icon: Mail,
  },
  {
    label: "Phone",
    value: "017-556-4825",
    href: "tel:0175564825",
    icon: Phone,
  },
  {
    label: "GitHub",
    value: "github.com/ProfFariz",
    href: "https://github.com/ProfFariz",
    icon: GitFork,
  },
  {
    label: "Location",
    value: "Malaysia",
    href: "#contact",
    icon: MapPin,
  },
];

const easing = [0.22, 1, 0.36, 1] as const;

const fadeInUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.65, ease: easing },
};

function SectionBlock({
  id,
  number,
  label,
  title,
  description,
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 35%"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.42, 1, 1, 0.92]);
  const y = useTransform(scrollYProgress, [0, 0.25, 1], [56, 0, -12]);
  const scale = useTransform(scrollYProgress, [0, 0.28, 0.92, 1], [0.975, 1, 1, 0.99]);

  return (
    <div id={id} ref={ref} className="section-stack">
      <motion.section
        style={{ opacity, y, scale }}
        className="section-shell section-sticky px-6 py-8 [transform-origin:top_center] md:px-10 md:py-10"
      >
        <div className="flex flex-col gap-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3">
                <span className="section-number">{number}</span>
                <div className="section-divider w-14 sm:w-20" />
                <p className="caps-label">{label}</p>
              </div>
              <h2 className="display-title mt-5 max-w-4xl text-4xl font-semibold leading-[0.94] sm:text-5xl lg:text-[4.7rem]">
                {title}
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-7 text-muted sm:text-base sm:leading-8">
              {description}
            </p>
          </div>
          <div className="soft-rule" />
          <div>{children}</div>
        </div>
      </motion.section>
    </div>
  );
}

export function PortfolioPage() {
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: pageProgress } = useScroll();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.3]);
  const featuredProject = projects[0];
  const playableProject = projects[0];

  return (
    <main suppressHydrationWarning className="relative overflow-hidden">
      <TechBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-glow opacity-40" />
      <div className="pointer-events-none absolute inset-0 -z-10 grain-overlay" />
      <motion.div
        className="fixed right-4 top-1/2 z-30 hidden h-36 w-px -translate-y-1/2 lg:block scroll-progress-rail"
        aria-hidden="true"
      >
        <motion.div
          className="w-full origin-top bg-[linear-gradient(180deg,var(--primary),color-mix(in_oklab,var(--accent)_85%,white))]"
          style={{ scaleY: pageProgress }}
        />
      </motion.div>
      <div className="fixed bottom-5 right-5 z-[90]">
        <ChatbotWidget
          triggerLabel="Open Amirul chatbot"
          triggerClassName="group inline-flex items-center justify-center rounded-full bg-transparent transition-transform duration-300 hover:-translate-y-1 focus:outline-none"
          triggerContent={
            <span className="relative inline-flex items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[color:color-mix(in_oklab,var(--primary)_20%,transparent)] blur-2xl transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative inline-flex rounded-full border border-[color:color-mix(in_oklab,var(--primary)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_34%,transparent)] p-2 shadow-[0_18px_40px_-24px_color-mix(in_oklab,var(--primary)_55%,transparent)] backdrop-blur-md">
                <Image
                  src={motominiGif}
                  alt="Motomini chatbot mascot"
                  unoptimized
                  className="h-16 w-16 rounded-full object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                  sizes="72px"
                  priority={false}
                />
              </span>
            </span>
          }
        />
      </div>

      <header className="sticky top-0 z-40 border-b border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex w-[min(1120px,calc(100vw-1.5rem))] items-center justify-between gap-4 py-4">
          <a href="#home" className="display-title text-2xl font-semibold tracking-[0.08em]">
            FARIZ
          </a>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-foreground)] transition-colors duration-300 hover:text-[color:var(--foreground)]"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ChatbotWidget
              triggerLabel="Let&apos;s Talk"
              triggerClassName="button-primary hidden rounded-full border border-[color:color-mix(in_oklab,var(--primary)_40%,transparent)] px-5 py-2.5 text-sm font-bold sm:inline-flex"
            />
          </div>
        </div>
      </header>

      <motion.section
        id="home"
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="mx-auto grid w-[min(1120px,calc(100vw-1.5rem))] gap-10 pb-16 pt-16 md:grid-cols-[1.05fr_0.95fr] md:pt-24"
      >
        <motion.div {...fadeInUp} className="space-y-8">
          <div className="tech-badge ornament-line inline-flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.24em] text-theme-primary">
            <Sparkles className="size-3.5" />
            Frontend developer / UI builder / tech portfolio
          </div>

          <div className="space-y-5">
            <h1 className="display-title max-w-4xl text-6xl font-semibold leading-[0.92] md:text-[5.7rem]">
              Hi, Im Amirul Fariz. People call me Fariz. Lets get to know each other.
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-muted md:text-xl">
              I&apos;m Amirul Fariz, a student developer focused on React, Next.js, and frontend
              systems that feel fast, sharp, and clearly built for technology products.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="button-primary inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--primary)_40%,transparent)] px-6 py-3 text-sm font-bold transition-transform duration-300 hover:-translate-y-0.5"
            >
              Explore Projects
              <ArrowUpRight className="size-4" />
            </a>
            <a
              href="#contact"
              className="button-secondary inline-flex items-center gap-2 rounded-full border border-[color:var(--border)] px-6 py-3 text-sm font-bold transition-colors duration-300 hover:bg-[color:color-mix(in_oklab,var(--secondary)_92%,transparent)]"
            >
              Contact Me
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Projects Shipped", value: "03+" },
              { label: "Primary Stack", value: "React / Next.js / TS" },
              { label: "Status", value: "Open for internship" },
            ].map((item) => (
              <motion.div
                key={item.label}
                {...fadeInUp}
                className="frame-panel px-6 py-5"
              >
                <p className="caps-label">{item.label}</p>
                <p className="display-title mt-3 text-3xl font-semibold leading-none">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          {...fadeInUp}
          className="grid content-start gap-5"
          transition={{ duration: 0.7, ease: easing, delay: 0.1 }}
        >
          <div className="frame-panel p-4 md:p-5">
            <div className="relative overflow-hidden rounded-[1.7rem] border border-[color:color-mix(in_oklab,var(--border)_72%,transparent)] bg-[linear-gradient(180deg,color-mix(in_oklab,var(--accent)_18%,var(--background))_0%,color-mix(in_oklab,var(--secondary)_86%,var(--background))_100%)]">
              <div className="scan-line absolute inset-x-0 top-[18%] z-20 h-24 opacity-50 blur-xl" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.06)_100%)] dark:bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.28)_100%)]" />
              <div className="relative aspect-[4/4.85] w-full">
                <Image
                  src={jackolImage}
                  alt="Amirul portrait"
                  className="h-full w-full object-cover"
                  sizes="(max-width: 768px) 100vw, 42vw"
                  priority={false}
                />
              </div>
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 via-black/24 to-transparent px-6 pb-6 pt-16">
                <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/70">
                  Live profile panel
                </p>
                <h2 className="display-title mt-3 text-4xl font-semibold text-white">
                  <span className="typewriter-line typewriter-line-primary">
                    Amirul Fariz
                  </span>
                </h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/75">
                  <span className="typewriter-line typewriter-line-secondary">
                    Student developer / frontend engineer
                  </span>
                </p>
              </div>
              <div className="absolute left-4 top-4 z-20 rounded-2xl border border-[color:color-mix(in_oklab,var(--primary)_28%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_18%,black)] px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[color:color-mix(in_oklab,white_24%,var(--primary))]">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Online and building</p>
              </div>
              <div className="absolute bottom-24 right-4 z-20 rounded-2xl border border-[color:color-mix(in_oklab,var(--accent)_26%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_18%,black)] px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[color:color-mix(in_oklab,white_24%,var(--accent))]">
                  Stack
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Next.js / Tailwind</p>
              </div>
            </div>
          </div>

          <div className="frame-panel px-7 py-6">
            <p className="caps-label">Current focus</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Responsive frontends", "Motion systems", "Reusable UI", "Tech branding"].map((item) => (
                <span
                  key={item}
                  className="tech-badge rounded-full px-3 py-1.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                >
                  {item}
                </span>
              ))}
            </div>
            <div className="soft-rule mt-6" />
            <p className="mt-6 text-sm leading-8 text-muted">
              Focused on building product-facing interfaces that combine clear interaction, sharp
              visual polish, and maintainable frontend structure.
            </p>
          </div>
        </motion.div>
      </motion.section>

      <motion.section
        id="showcase"
        initial={{ opacity: 0, y: 36 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, ease: easing }}
        className="mx-auto w-[min(1120px,calc(100vw-1.5rem))] pb-10"
      >
        <div className="section-shell px-6 py-6 md:px-8 md:py-8">
          <div className="max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="section-number">00</span>
              <div className="section-divider w-14 sm:w-20" />
              <p className="caps-label">Main attraction</p>
            </div>
            <h2 className="display-title mt-5 max-w-4xl text-4xl font-semibold leading-[0.94] sm:text-5xl lg:text-[4.5rem]">
              Play Mathivity directly from the portfolio.
            </h2>
          </div>

          <div className="soft-rule mt-7" />

          <div className="mt-7 grid gap-6 xl:grid-cols-[1.18fr_0.82fr]">
            <div className="grid gap-5 content-start">
              <div className="frame-panel p-3 md:p-4">
                <div className="relative overflow-hidden rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-black/35">
                  <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-black/20 to-transparent" />
                  <div className="absolute left-4 top-4 z-10 rounded-full border border-[color:color-mix(in_oklab,var(--primary)_28%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_24%,black)] px-3 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[color:color-mix(in_oklab,white_18%,var(--primary))] backdrop-blur-md">
                    Browser playable
                  </div>
                  <div className="relative aspect-[1152/668] w-full">
                    <iframe
                      title="Play Mathivity on itch.io"
                      src={playableProject.embedSrc}
                      allowFullScreen
                      loading="eager"
                      className="absolute inset-0 h-full w-full border-0"
                    />
                  </div>
                </div>
              </div>

              <div className="frame-panel px-6 py-6 md:px-7 md:py-7">
                <p className="caps-label">About this game</p>
                <h3 className="display-title mt-4 text-3xl font-semibold leading-[0.96]">
                  A final year project that mixes tower defense gameplay with mathematical learning.
                </h3>
                <p className="mt-5 text-sm leading-8 text-muted sm:text-base">
                  {playableProject.description}
                </p>
                <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
                  {playableProject.detailSummary}
                </p>
              </div>
            </div>

            <div className="grid gap-5 content-start">
              <div className="frame-panel px-6 py-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="caps-label">Featured now</span>
                  <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_32%,transparent)] bg-[color:color-mix(in_oklab,var(--secondary)_88%,transparent)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                    Final year project
                  </span>
                </div>
                <h3 className="display-title mt-5 text-4xl font-semibold leading-[0.95]">
                  {playableProject.title}
                </h3>
                <p className="mt-4 text-sm leading-8 text-muted sm:text-base">
                  Educational tower defense built with Godot 4, interactive Math Popups, and accessible Windows plus HTML5 deployment.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {["Playable on itch.io", "Windows + HTML5", "Educational tower defense"].map(
                    (item) => (
                      <span
                        key={item}
                        className="tech-badge rounded-full px-3 py-1.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                      >
                        {item}
                      </span>
                    ),
                  )}
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <a
                    href={playableProject.href}
                    target="_blank"
                    rel="noreferrer"
                    className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
                  >
                    {playableProject.ctaLabel}
                    <ArrowUpRight className="size-4" />
                  </a>
                  <a
                    href={playableProject.secondaryHref}
                    className="button-secondary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
                  >
                    {playableProject.secondaryLabel}
                  </a>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
                {[
                  ["Worlds", "3 thematic learning worlds"],
                  ["Validation", "81.9% usability rating"],
                  ["Feedback", "100% positive art-style response"],
                ].map(([labelText, valueText]) => (
                  <div key={labelText} className="frame-panel px-5 py-5">
                    <p className="caps-label">{labelText}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{valueText}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="mx-auto flex w-[min(1120px,calc(100vw-1.5rem))] flex-col gap-10 pb-24">
        <SectionBlock
          id="about"
          number="01"
          label="About"
          title="Clear interfaces, cleaner systems, and a frontend style built for modern products."
          description="A quick view into how I work, what I care about, and the direction I am building toward as a frontend developer."
        >
          <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: easing }}
              className="frame-panel px-6 py-6 md:px-8 md:py-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="caps-label">Profile note</span>
                <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_30%,transparent)] bg-[color:color-mix(in_oklab,var(--secondary)_85%,transparent)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                  UiTM / Malaysia
                </span>
              </div>
              <h3 className="display-title mt-5 max-w-3xl text-3xl font-semibold leading-[0.95] sm:text-4xl md:text-[3.2rem]">
                I build digital experiences that feel sharp, responsive, and ready for real users.
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-muted sm:text-base">
                I am a UiTM student focused on frontend development with React, TypeScript, and
                Next.js. My work leans into structured layouts, modern interaction design, and UI
                systems that stay polished without losing clarity.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {[
                  {
                    label: "Focus",
                    value: "Product pages, clean UI systems, and motion that supports the story.",
                  },
                  {
                    label: "Mindset",
                    value: "Design-first thinking backed by maintainable code and reusable structure.",
                  },
                  {
                    label: "Next step",
                    value: "Grow through internships and real delivery environments with stronger product work.",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[1.55rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5"
                  >
                    <p className="caps-label">{item.label}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["React.js", "TypeScript", "Next.js", "Tailwind", "Motion UI"].map((item) => (
                  <span
                    key={item}
                    className="tech-badge rounded-full px-3 py-1.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-5 content-start">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: easing, delay: 0.05 }}
                className="frame-panel p-4"
              >
                <div className="relative overflow-hidden rounded-[1.8rem] border border-[color:color-mix(in_oklab,var(--border)_86%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_60%,transparent)]">
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={jackolImage}
                      alt="Amirul Fariz profile"
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 1024px) 100vw, 30vw"
                      priority={false}
                    />
                  </div>
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,20,0.06)_0%,rgba(6,10,20,0.12)_34%,rgba(6,10,20,0.78)_100%)]" />
                  <div className="absolute left-4 top-4 rounded-2xl border border-white/15 bg-black/28 px-4 py-3 backdrop-blur-md">
                    <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[color:color-mix(in_oklab,white_26%,var(--primary))]">
                      Visual profile
                    </p>
                    <p className="mt-2 text-sm font-medium text-white/78">
                      Frontend student builder
                    </p>
                  </div>
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/84 via-black/36 to-transparent px-5 pb-5 pt-20">
                    <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/70">
                      Current identity
                    </p>
                    <h3 className="display-title mt-2 text-3xl font-semibold text-white">
                      Amirul Fariz
                    </h3>
                    <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/75">
                      UiTM student / frontend builder
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.6, ease: easing, delay: 0.1 }}
                className="grid gap-4 sm:grid-cols-2"
              >
                {[
                  ["Current focus", "Responsive frontends and stronger interaction polish."],
                  ["2026 direction", "Internship-ready work with better product presentation."],
                ].map(([labelText, valueText]) => (
                  <div
                    key={labelText}
                    className="frame-panel px-5 py-5"
                  >
                    <p className="caps-label">{labelText}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{valueText}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="skills"
          number="02"
          label="Skills"
          title="A stack designed for product pages, UI systems, and responsive experiences."
          description="These are the areas I rely on most when turning ideas into interfaces that feel modern, usable, and ready to scale."
        >
          <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.62, ease: easing }}
              className="frame-panel px-6 py-6 md:px-8 md:py-8"
            >
              <p className="caps-label">Capability map</p>
              <h3 className="display-title mt-5 max-w-2xl text-3xl font-semibold leading-[0.96] sm:text-4xl">
                I care about the balance between visual polish, responsive behavior, and code that stays organized.
              </h3>
              <p className="mt-5 max-w-2xl text-sm leading-8 text-muted sm:text-base">
                My strongest work happens where layout systems, clean frontend structure, and subtle interaction design meet. I like building interfaces that feel premium but still easy to use.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5">
                  <p className="caps-label">Primary stack</p>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    React, Next.js, TypeScript, Tailwind CSS, and component-based UI structure.
                  </p>
                </div>
                <div className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5">
                  <p className="caps-label">Workflow</p>
                  <p className="mt-4 text-sm leading-7 text-muted">
                    Practical prototyping, Git-based iteration, debugging, and frontend refinement.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {["Next.js", "Tailwind CSS", "Framer Motion", "Responsive UI", "Git Workflow"].map(
                  (item) => (
                    <span
                      key={item}
                      className="rounded-full border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_84%,transparent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
                    >
                      {item}
                    </span>
                  ),
                )}
              </div>
            </motion.div>

            <div className="grid gap-5 sm:grid-cols-2">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <motion.article
                    key={skill.title}
                    initial={{ opacity: 0, y: 36, rotateX: 8 }}
                    whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.6, delay: index * 0.08, ease: easing }}
                    className="frame-panel px-6 py-6 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="mb-5 inline-flex rounded-2xl border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_24%,var(--background))] p-3 text-theme-primary">
                      <Icon className="size-5" />
                    </div>
                    <p className="caps-label">Capability {String(index + 1).padStart(2, "0")}</p>
                    <h3 className="display-title mt-3 text-3xl font-semibold leading-none">
                      {skill.title}
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-muted">{skill.description}</p>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="projects"
          number="03"
          label="Projects"
          title="Recent builds that show how I approach flow, hierarchy, and product storytelling."
          description="A small set of projects that reflect my current design direction: cleaner sections, stronger pacing, and more intentional frontend presentation."
        >
          <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <motion.article
              initial={{ opacity: 0, y: 36, scale: 0.97 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.62, ease: easing }}
              className="frame-panel px-6 py-6 md:px-8 md:py-8"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="caps-label">Featured build</span>
                  <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_34%,transparent)] bg-[color:color-mix(in_oklab,var(--secondary)_88%,transparent)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                    {featuredProject.year}
                  </span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                  {featuredProject.label}
                </span>
              </div>

              <div className="mt-7 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div>
                  <h3 className="display-title text-4xl font-semibold leading-[0.94] md:text-[3.2rem]">
                    {featuredProject.title}
                  </h3>
                  <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-[color:var(--foreground)]/88">
                    {featuredProject.detailTitle}
                  </p>
                  <p className="mt-5 max-w-2xl text-sm leading-8 text-muted sm:text-base">
                    {featuredProject.description}
                  </p>
                  <p className="mt-4 max-w-2xl text-sm leading-8 text-muted sm:text-base">
                    {featuredProject.detailSummary}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {featuredProject.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_84%,transparent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-4">
                    <a
                      href={featuredProject.href}
                      target="_blank"
                      rel="noreferrer"
                      className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
                    >
                      {featuredProject.ctaLabel ?? "View project"}
                      <ArrowUpRight className="size-4" />
                    </a>
                    <a
                      href={featuredProject.secondaryHref ?? "#showcase"}
                      className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] px-5 py-3 text-sm font-bold text-[color:var(--foreground)]"
                    >
                      <ArrowUpRight className="size-4" />
                      {featuredProject.secondaryLabel ?? "Open showcase"}
                    </a>
                  </div>
                </div>

                <div className="grid gap-4">
                  {featuredProject.metaCards?.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5"
                    >
                      <p className="caps-label">{item.label}</p>
                      <p className="mt-4 text-sm leading-7 text-muted">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
                <div className="rounded-[1.7rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5 md:px-6 md:py-6">
                  <p className="caps-label">Key technical features</p>
                  <div className="mt-4 grid gap-3">
                    {featuredProject.features?.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.2rem] border border-[color:color-mix(in_oklab,var(--border)_62%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_84%,transparent)] px-4 py-4"
                      >
                        <p className="text-sm leading-7 text-muted">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-[1.7rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5 md:px-6 md:py-6">
                  <p className="caps-label">Validation & achievements</p>
                  <div className="mt-4 grid gap-3">
                    {featuredProject.achievements?.map((item) => (
                      <div
                        key={item}
                        className="rounded-[1.2rem] border border-[color:color-mix(in_oklab,var(--border)_62%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_84%,transparent)] px-4 py-4"
                      >
                        <p className="text-sm leading-7 text-muted">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.article>

            <div className="grid gap-5">
              {projects.slice(1).map((project, index) => (
                <motion.article
                  key={project.title}
                  initial={{ opacity: 0, y: 36, scale: 0.97 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.62, delay: index * 0.08, ease: easing }}
                  className="frame-panel px-6 py-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="caps-label">{project.label}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {project.year}
                    </p>
                  </div>
                  <h3 className="display-title mt-5 text-3xl font-semibold leading-[0.98]">
                    {project.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-muted">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_84%,transparent)] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-theme-primary"
                  >
                    Explore build
                    <ArrowUpRight className="size-4" />
                  </a>
                </motion.article>
              ))}
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="experience"
          number="04"
          label="Experience"
          title="A frontend path built through learning fast, shipping often, and raising the quality bar."
          description="I am still early in the journey, but the direction is clear: better product work, stronger execution, and more real-world team experience."
        >
          <div className="grid gap-5">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: easing }}
              className="frame-panel px-6 py-6 md:px-8 md:py-8"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl">
                  <p className="caps-label">Trajectory</p>
                  <h3 className="display-title mt-4 text-3xl font-semibold leading-[0.96] sm:text-4xl">
                    Student foundation, product-facing practice, and a clear next step into internship-level work.
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-8 text-muted">
                  My experience is being shaped by building interfaces, improving visual judgment, and learning how frontend systems should look, feel, and scale in real products.
                </p>
              </div>
            </motion.div>

            <div className="relative">
              <div className="pointer-events-none absolute left-8 right-8 top-9 hidden h-px bg-[linear-gradient(90deg,transparent,color-mix(in_oklab,var(--accent)_55%,transparent),transparent)] lg:block" />
              <div className="grid gap-5 lg:grid-cols-3">
                {experience.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.article
                      key={item.title}
                      initial={{ opacity: 0, y: 32 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, ease: easing, delay: index * 0.06 }}
                      className="frame-panel px-6 py-6"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="inline-flex rounded-2xl border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_22%,var(--background))] p-3 text-theme-primary">
                          <Icon className="size-5" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                          0{index + 1}
                        </span>
                      </div>
                      <p className="mt-5 caps-label">{item.phase}</p>
                      <h3 className="display-title mt-3 text-3xl font-semibold leading-[0.98]">
                        {item.title}
                      </h3>
                      <p className="mt-4 text-sm leading-7 text-muted">{item.description}</p>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          </div>
        </SectionBlock>

        <SectionBlock
          id="contact"
          number="05"
          label="Contact"
          title="Open to internships, freelance projects, and product collaborations."
          description="If the brief needs modern UI, responsive execution, and someone who cares about the final details, this is the easiest way to reach me."
        >
          <div className="grid gap-5 xl:grid-cols-[1.08fr_0.92fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: easing }}
              className="frame-panel px-6 py-6 md:px-8 md:py-8"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className="caps-label">Availability</span>
                <span className="rounded-full border border-[color:color-mix(in_oklab,var(--accent)_35%,transparent)] bg-[color:color-mix(in_oklab,var(--secondary)_88%,transparent)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[color:var(--muted-foreground)]">
                  Open for opportunities
                </span>
              </div>
              <h3 className="display-title mt-5 max-w-3xl text-4xl font-semibold leading-[0.95] md:text-[3.25rem]">
                Let&apos;s build something useful, modern, and visually sharp together.
              </h3>
              <p className="mt-6 max-w-2xl text-sm leading-8 text-muted sm:text-base">
                I am open to internships, freelance work, and collaborative builds where frontend quality, responsive UI, and polished presentation really matter.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:amirulfariz901@gmail.com"
                  className="button-primary inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold"
                >
                  Email me
                  <ArrowUpRight className="size-4" />
                </a>
                <ChatbotWidget
                  triggerLabel="Ask AI about me"
                  triggerClassName="button-secondary inline-flex rounded-full px-5 py-3 text-sm font-bold"
                />
                <a
                  href="https://github.com/ProfFariz"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] px-5 py-3 text-sm font-bold text-[color:var(--foreground)]"
                >
                  <GitFork className="size-4" />
                  GitHub
                </a>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  ["Response", "Best through email or the portfolio chat window."],
                  ["Location", "Based in Malaysia and currently studying at UiTM."],
                ].map(([labelText, valueText]) => (
                  <div
                    key={labelText}
                    className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_72%,transparent)] px-5 py-5"
                  >
                    <p className="caps-label">{labelText}</p>
                    <p className="mt-4 text-sm leading-7 text-muted">{valueText}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              {contactLinks.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, ease: easing, delay: index * 0.04 }}
                    href={item.href}
                    className="frame-panel flex items-center justify-between gap-4 px-5 py-5 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-theme-primary">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[color:var(--foreground)] sm:text-base">
                        {item.value}
                      </p>
                    </div>
                    <div className="inline-flex rounded-2xl border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_18%,var(--background))] p-3 text-theme-primary">
                      <Icon className="size-5" />
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </SectionBlock>
      </div>
    </main>
  );
}
