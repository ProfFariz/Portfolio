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
import amirulImage from "@/assets/project_images/amirul.jpg";
import jackolImage from "@/assets/project_images/jackol.jpg";
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

const projects = [
  {
    title: "Mathivity",
    description:
      "A modern web experience focused on smooth motion, responsive behavior, and polished interface storytelling.",
    stack: ["Next.js", "Tailwind", "Framer Motion"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "UI System",
    year: "2025",
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
  children,
}: {
  id: string;
  number: string;
  label: string;
  title: string;
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
        <div className="grid gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="md:sticky md:top-28 md:self-start">
            <div className="flex items-center gap-4">
              <span className="section-number">{number}</span>
              <div className="section-divider flex-1" />
            </div>
            <p className="mt-5 caps-label">
              {label}
            </p>
            <h2 className="display-title mt-4 text-4xl font-semibold leading-none md:text-6xl">
              {title}
            </h2>
          </div>
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
                  src={amirulImage}
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
                <h2 className="display-title mt-3 text-4xl font-semibold text-white">Amirul Fariz</h2>
                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/75">
                  Student developer / frontend engineer
                </p>
              </div>
              <div className="absolute left-4 top-4 z-20 rounded-2xl border border-cyan-300/20 bg-slate-950/55 px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Status
                </p>
                <p className="mt-1 text-sm font-semibold text-white">Online and building</p>
              </div>
              <div className="absolute bottom-24 right-4 z-20 rounded-2xl border border-violet-300/20 bg-slate-950/55 px-4 py-3 backdrop-blur-md">
                <p className="font-mono text-[0.62rem] font-bold uppercase tracking-[0.22em] text-violet-200">
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

      <div className="mx-auto flex w-[min(1120px,calc(100vw-1.5rem))] flex-col gap-10 pb-24">
        <SectionBlock
          id="about"
          number="01"
          label="About"
          title="Modern frontend builder with a product-first mindset."
        >
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: easing }}
            className="frame-panel p-4 md:p-5"
          >
            <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
              <div className="relative overflow-hidden rounded-[1.9rem] border border-[color:color-mix(in_oklab,var(--border)_82%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_60%,transparent)]">
                <div className="relative aspect-[4/4.8] w-full">
                  <Image
                    src={jackolImage}
                    alt="Jackol profile"
                    className="h-full w-full object-cover"
                    sizes="(max-width: 1024px) 100vw, 28vw"
                    priority={false}
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/72 via-black/18 to-transparent px-5 pb-5 pt-16">
                  <p className="font-mono text-[0.68rem] font-bold uppercase tracking-[0.24em] text-white/70">
                    Developer identity
                  </p>
                  <h3 className="display-title mt-2 text-3xl font-semibold text-white">
                    Jackal
                  </h3>
                  <p className="mt-2 text-sm uppercase tracking-[0.18em] text-white/75">
                    UiTM student / frontend builder
                  </p>
                </div>
              </div>

              <div className="grid content-start gap-5">
                <div className="rounded-[1.9rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)] px-6 py-6 md:px-7 md:py-7">
                  <p className="caps-label">Profile note</p>
                  <p className="display-title mt-4 max-w-2xl text-2xl font-semibold leading-tight md:text-[2.35rem]">
                    I build interfaces that feel clear, modern, and ready for real products.
                  </p>
                  <p className="mt-5 max-w-2xl text-base leading-8 text-muted">
                    I am a UiTM student focused on frontend development with React, TypeScript,
                    and Next.js. Most of my work goes into responsive layouts, cleaner UI systems,
                    and digital experiences that look sharp without sacrificing usability.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)] px-6 py-6">
                    <p className="caps-label">Focus</p>
                    <p className="mt-4 text-sm leading-8 text-muted">
                      Responsive frontends, motion polish, and reusable UI patterns for product-style interfaces.
                    </p>
                  </div>
                  <div className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_78%,transparent)] bg-[color:color-mix(in_oklab,var(--background)_70%,transparent)] px-6 py-6">
                    <p className="caps-label">Goal</p>
                    <p className="mt-4 text-sm leading-8 text-muted">
                      Keep growing through internships and practical builds that strengthen both design sense and implementation quality.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["React.js", "TypeScript", "Next.js", "Motion UI"].map((item) => (
                    <span
                      key={item}
                      className="tech-badge rounded-full px-3 py-1.5 font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </SectionBlock>

        <SectionBlock
          id="skills"
          number="02"
          label="Skills"
          title="Core capabilities for shipping polished frontend work and stronger UI systems."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.article
                  key={skill.title}
                  initial={{ opacity: 0, y: 36, rotateX: 10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: index * 0.08, ease: easing }}
                  className="frame-panel px-6 py-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="mb-5 inline-flex rounded-2xl border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_28%,var(--background))] p-3 text-theme-primary">
                    <Icon className="size-5" />
                  </div>
                  <p className="caps-label">Capability {String(index + 1).padStart(2, "0")}</p>
                  <h3 className="display-title mt-3 text-3xl font-semibold leading-none">{skill.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-muted">{skill.description}</p>
                </motion.article>
              );
            })}
          </div>
        </SectionBlock>

        <SectionBlock
          id="projects"
          number="03"
          label="Projects"
          title="Selected builds that show my approach to layout, interaction, and product presentation."
        >
          <div className="grid gap-5 lg:grid-cols-3">
            {projects.map((project, index) => (
              <motion.article
                key={project.title}
                initial={{ opacity: 0, y: 36, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.62, delay: index * 0.08, ease: easing }}
                className="frame-panel group px-6 py-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="rounded-[1.6rem] border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[linear-gradient(135deg,color-mix(in_oklab,var(--accent)_40%,var(--background))_0%,color-mix(in_oklab,var(--secondary)_86%,var(--background))_100%)] px-5 py-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="caps-label">{project.label}</p>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                      {project.year}
                    </p>
                  </div>
                  <div className="soft-rule mt-5" />
                  <p className="display-title mt-5 text-4xl font-semibold leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
                <h3 className="display-title mt-6 text-3xl font-semibold leading-none">{project.title}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{project.description}</p>
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
                <div className="mt-6 flex items-center gap-4">
                  <a
                    href={project.href}
                    className="inline-flex items-center gap-2 text-sm font-bold text-theme-primary"
                  >
                    View Project
                    <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                  <a
                    href="https://github.com/ProfFariz/Portfolio"
                    className="inline-flex items-center gap-2 text-sm font-bold text-[color:var(--muted-foreground)]"
                  >
                    <GitFork className="size-4" />
                    GitHub
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </SectionBlock>

        <SectionBlock
          id="experience"
          number="04"
          label="Experience"
          title="A growing path shaped by technical practice, frontend execution, and real-world readiness."
        >
          <div className="grid gap-5">
            {experience.map((item, index) => {
              const Icon = item.icon;
              return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -24 : 24, scale: 0.98 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.62, ease: easing, delay: index * 0.05 }}
                className="frame-panel px-6 py-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="inline-flex rounded-2xl border border-[color:color-mix(in_oklab,var(--border)_88%,transparent)] bg-[color:color-mix(in_oklab,var(--accent)_24%,var(--background))] p-3 text-theme-primary">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="caps-label">{item.phase}</p>
                      <h3 className="display-title mt-3 text-3xl font-semibold leading-none">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                  <p className="max-w-xl text-sm leading-8 text-muted">{item.description}</p>
                </div>
              </motion.article>
            )})}
          </div>
        </SectionBlock>

        <SectionBlock
          id="contact"
          number="05"
          label="Contact"
          title="Interested in building something modern, interactive, and useful together?"
        >
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.65, ease: easing }}
              className="frame-panel px-8 py-8"
            >
              <p className="caps-label">Availability</p>
              <h3 className="display-title mt-4 text-4xl font-semibold leading-none md:text-5xl">
                Let&apos;s build something tech-focused together.
              </h3>
              <p className="mt-6 max-w-xl text-base leading-8 text-muted">
                I am open to internships, freelance work, and collaborative projects where strong
                frontend execution, responsive UI, and modern visual presentation matter.
              </p>
              <div className="soft-rule mt-6" />
              <p className="mt-6 text-sm leading-8 text-muted">
                You can reach me directly through email or phone, or browse my GitHub profile for
                current work and experiments.
              </p>
            </motion.div>

            <div className="grid gap-3">
              {contactLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, x: 22 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.25 }}
                    transition={{ duration: 0.55, ease: easing }}
                    href={item.href}
                    className="surface-popover frame-panel flex items-center justify-between rounded-[24px] px-5 py-4 transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.18em] text-theme-primary">
                        {item.label}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[color:var(--foreground)]">
                        {item.value}
                      </p>
                    </div>
                    <Icon className="size-5 text-theme-primary" />
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
