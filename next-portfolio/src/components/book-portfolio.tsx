"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
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
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  MousePointerClick,
  Award
} from "lucide-react";
import jackolImage from "@/assets/project_images/jackol.jpg";
import motominiGif from "@/assets/project_images/motomini.gif";
import { ChatbotWidget } from "@/components/chatbot-widget";
import { TechBackground } from "@/components/tech-background";
import { ThemeToggle } from "@/components/theme-toggle";
import { BookPageSheet } from "./book-page-sheet";

// Staging constants matching original portfolio data
const skills = [
  {
    title: "Frontend Craft",
    description: "Responsive interfaces built with React, TypeScript, Tailwind, and component-driven structure.",
    icon: MonitorSmartphone,
  },
  {
    title: "Interface Systems",
    description: "Consistent layouts, reusable sections, visual hierarchy, and interaction patterns that scale cleanly.",
    icon: Gem,
  },
  {
    title: "Workflow Rhythm",
    description: "Git-based iteration, practical prototyping, debugging, and implementation that stays organized.",
    icon: Layers3,
  },
  {
    title: "Growth Track",
    description: "Deployment, API integration, stronger product thinking, and production-style collaboration habits.",
    icon: BriefcaseBusiness,
  },
];

const projects = [
  {
    title: "Mathivity",
    description: "An educational 2D tower defense game designed to reinforce mathematical fluency. Reduces student anxiety and makes mathematical problem-solving feel rewarding.",
    stack: ["Godot 4", "GDScript", "HTML5/WebGL", "Windows Export"],
    href: "https://amirulgodot.itch.io/mathivity",
    label: "Educational Game",
    year: "FYP",
    ctaLabel: "Play on itch.io",
    embedSrc: "https://itch.io/embed-upload/16436534?color=333333",
    detailTitle: "A 2D mathematical tower defense experience that turns core maths practice into a rewarding gameplay loop.",
    detailSummary: "Mathivity uses Math Popups, narrative-driven challenges, and three distinct thematic worlds to reinforce percentages, ratios, and fractions.",
    metaCards: [
      { label: "Learning layer", value: "Three thematic worlds designed around percentages, ratios, and fractions." },
      { label: "Gameplay logic", value: "Mathematical answers become strategic requirements for placement and victory." },
      { label: "Deployment", value: "Optimized export builds for Windows Desktop and HTML5/WebGL to support low-end school hardware." }
    ],
    features: [
      "Implemented a Target Lock system to synchronize ballistic projectiles with moving enemy targets.",
      "Built spatial validation logic with a 60-pixel distance check to prevent tower overlap.",
      "Created Math Popup assessment modals that pause the game state."
    ]
  },
  {
    title: "MotoGP FansBot",
    description: "A campaign-style landing page built to practice conversion flow, section pacing, and stronger call-to-action placement.",
    stack: ["UI Design", "Responsive", "Layout"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "Landing Page",
    year: "2025",
  },
  {
    title: "UiTM Perak Departments Dashboard",
    description: "An experimental web app used to explore conversational interactions, logic flow, and reusable UI patterns.",
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
    description: "Studying at Universiti Teknologi Mara while building web applications and improving frontend discipline through projects.",
    icon: GraduationCap,
  },
  {
    phase: "Focus",
    title: "Tech-Driven Frontend Interfaces",
    description: "Centering work on responsive layouts, motion systems, cleaner UI patterns, and stronger frontend presentation.",
    icon: Sparkles,
  },
  {
    phase: "Next",
    title: "Internship or Freelance Role",
    description: "Ready to contribute to product teams, sharpen implementation quality, and learn through real delivery environments.",
    icon: BriefcaseBusiness,
  },
];

const contactLinks = [
  { label: "Email", value: "amirulfariz901@gmail.com", href: "mailto:amirulfariz901@gmail.com", icon: Mail },
  { label: "Phone", value: "017-556-4825", href: "tel:0175564825", icon: Phone },
  { label: "GitHub", value: "github.com/ProfFariz", href: "https://github.com/ProfFariz", icon: GitFork },
  { label: "Location", value: "Malaysia", href: "#contact", icon: MapPin },
];

export function BookPortfolio() {
  const [currentPage, setCurrentPage] = useState(0); // 0 (Cover) to 5 (Back Cover)
  const [isFlipping, setIsFlipping] = useState<number>(-1);
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Form state
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const turnToPage = (targetPage: number) => {
    if (targetPage === currentPage || targetPage < 0 || targetPage > 5) return;
    
    // Staging flip target
    const flippingSheet = targetPage > currentPage ? currentPage : targetPage;
    setIsFlipping(flippingSheet);
    setCurrentPage(targetPage);

    setTimeout(() => {
      setIsFlipping(-1);
    }, 950);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  if (!isClient) return null;

  // Header Nav items mapping
  const navItems = [
    { label: "Start", target: 0 },
    { label: "About", target: 1 },
    { label: "Skills", target: 2 },
    { label: "Projects", target: 3 },
    { label: "Experience", target: 3 }, // Experience is page 6 on Sheet 3 (currentPage 3)
    { label: "Contact", target: 4 },
  ];

  // ---------------- MOBILE SCROLLABLE FALLBACK LAYOUT ----------------
  if (isMobile) {
    return (
      <main suppressHydrationWarning className="relative overflow-hidden min-h-screen px-4 pb-20 pt-6">
        <TechBackground />
        <div className="pointer-events-none absolute inset-0 -z-10 grid-glow opacity-30" />
        <div className="pointer-events-none absolute inset-0 -z-10 grain-overlay" />

        <header className="flex items-center justify-between border-b border-sky-500/20 bg-slate-950/80 px-4 py-4 rounded-2xl backdrop-blur-xl mb-8 sticky top-3 z-50">
          <span className="font-mono font-bold text-sky-400 tracking-[0.15em] text-lg">FARIZ</span>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ChatbotWidget
              triggerLabel="Let&apos;s Talk"
              triggerClassName="button-primary rounded-full border border-sky-500/30 px-4 py-2 text-xs font-bold"
            />
          </div>
        </header>

        {/* Mobile Stacked Sections */}
        <div className="flex flex-col gap-10 max-w-2xl mx-auto">
          {/* Cover Section */}
          <section className="bg-slate-900 border border-sky-500/20 rounded-3xl p-6 relative overflow-hidden shadow-xl">
            <div className="absolute top-4 right-4 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-ping" />
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            </div>
            <p className="font-mono text-[10px] text-sky-500/60 uppercase tracking-widest">Core Workspace</p>
            <h1 className="display-title text-4xl font-extrabold text-white mt-4 tracking-tight">
              AMIRUL FARIZ
            </h1>
            <p className="text-sm font-mono text-sky-400 mt-1 uppercase tracking-widest border-b border-sky-500/20 pb-4">
              Frontend / UI Systems Builder
            </p>
            <p className="text-slate-300 text-sm mt-4 leading-relaxed">
              Studying at UiTM Perak. Designing interface systems that merge visual discipline, interactive polish, and clean codebase structure.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <span className="text-xs bg-sky-950/60 border border-sky-500/30 text-sky-400 rounded-full px-3 py-1 font-mono">React</span>
              <span className="text-xs bg-sky-950/60 border border-sky-500/30 text-sky-400 rounded-full px-3 py-1 font-mono">Next.js</span>
              <span className="text-xs bg-sky-950/60 border border-sky-500/30 text-sky-400 rounded-full px-3 py-1 font-mono">Tailwind</span>
            </div>
          </section>

          {/* About Section */}
          <section id="about" className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Sparkles className="size-5" /> About Me
            </h2>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-sky-500/20">
                <Image src={jackolImage} alt="Amirul Fariz portrait" className="object-cover object-center w-full h-full" />
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                I study at Universiti Teknologi MARA while building production-ready projects. I am passionate about structured layout patterns and creating components that scale.
              </p>
              <div className="grid gap-3 grid-cols-2 mt-2">
                <div className="bg-slate-950/50 border border-sky-500/10 p-3 rounded-xl">
                  <p className="font-mono text-[9px] text-sky-500/60 uppercase">Primary Focus</p>
                  <p className="text-xs text-white mt-1 font-bold">Responsive Frontends</p>
                </div>
                <div className="bg-slate-950/50 border border-sky-500/10 p-3 rounded-xl">
                  <p className="font-mono text-[9px] text-sky-500/60 uppercase">Collaboration</p>
                  <p className="text-xs text-white mt-1 font-bold">Internship Ready</p>
                </div>
              </div>
            </div>
          </section>

          {/* Skills Section */}
          <section id="skills" className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-6 flex items-center gap-2">
              <Layers3 className="size-5" /> Skills Map
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {skills.map((skill, index) => {
                const Icon = skill.icon;
                return (
                  <div key={index} className="bg-slate-950/60 border border-sky-500/10 p-4 rounded-2xl flex flex-col gap-2">
                    <div className="inline-flex rounded-xl bg-sky-950/80 border border-sky-500/30 p-2 text-sky-400 w-fit">
                      <Icon className="size-4" />
                    </div>
                    <h3 className="font-semibold text-white text-sm">{skill.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed">{skill.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Mathivity Section */}
          <section id="projects" className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Code2 className="size-5" /> Featured: Mathivity
            </h2>
            <div className="flex flex-col gap-4">
              <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-sky-500/30 bg-black/40">
                <iframe
                  title="Play Mathivity on itch.io"
                  src={projects[0].embedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                An educational 2D mathematical tower defense game built in Godot 4. Students tackle percentage, fraction, and ratio questions in active gameplay.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {projects[0].stack.map((tag) => (
                  <span key={tag} className="text-[10px] font-mono bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={projects[0].href}
                target="_blank"
                rel="noreferrer"
                className="button-primary inline-flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-center mt-2"
              >
                Play on itch.io <ArrowUpRight className="size-3.5" />
              </a>
            </div>
          </section>

          {/* Other Projects Section */}
          <section className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-4">Other Projects</h2>
            <div className="flex flex-col gap-4">
              {projects.slice(1).map((proj, idx) => (
                <div key={idx} className="bg-slate-950/50 border border-sky-500/10 p-4 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-sky-400/80">{proj.label}</span>
                    <span className="text-[10px] font-mono text-slate-500">{proj.year}</span>
                  </div>
                  <h3 className="font-semibold text-white text-sm mt-1">{proj.title}</h3>
                  <p className="text-slate-400 text-xs mt-2 leading-relaxed">{proj.description}</p>
                  <a href={proj.href} className="inline-flex items-center gap-1.5 text-xs text-sky-400 font-bold mt-3 hover:text-sky-300">
                    Github Repository <ArrowUpRight className="size-3" />
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Section */}
          <section id="experience" className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-6 flex items-center gap-2">
              <Award className="size-5" /> Experience
            </h2>
            <div className="flex flex-col gap-6 relative border-l border-sky-500/20 ml-2 pl-4">
              {experience.map((exp, index) => {
                const Icon = exp.icon;
                return (
                  <div key={index} className="relative">
                    <div className="absolute -left-[25px] top-0.5 rounded-full border border-sky-500/40 bg-slate-950 p-1 text-sky-400">
                      <Icon className="size-3" />
                    </div>
                    <span className="text-[10px] font-mono text-sky-500/60 uppercase">{exp.phase}</span>
                    <h3 className="font-semibold text-white text-sm mt-0.5">{exp.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 leading-relaxed">{exp.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="blueprint-page-bg border border-sky-500/20 rounded-3xl p-6 relative shadow-xl">
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <h2 className="display-title text-2xl font-bold text-sky-300 mb-4 flex items-center gap-2">
              <Mail className="size-5" /> Contact Me
            </h2>
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-950/80 border border-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-slate-950/80 border border-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                required
              />
              <textarea
                placeholder="Message"
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-slate-950/80 border border-sky-500/20 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
                required
              />
              <button type="submit" className="button-primary rounded-xl py-2.5 text-xs font-bold text-center mt-1">
                {formSubmitted ? "Sent Successfully!" : "Submit Inquiry"}
              </button>
            </form>

            <div className="grid grid-cols-2 gap-3 mt-6 border-t border-sky-500/10 pt-6">
              {contactLinks.map((link, idx) => (
                <a key={idx} href={link.href} className="flex items-center gap-2 text-slate-300 hover:text-sky-300">
                  <link.icon className="size-3.5 text-sky-400 shrink-0" />
                  <span className="text-[10px] font-mono truncate">{link.value}</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        {/* Mobile floating chatbot trigger */}
        <div className="fixed bottom-5 right-5 z-[90]">
          <ChatbotWidget
            triggerLabel="Open chatbot"
            triggerClassName="group inline-flex items-center justify-center rounded-full bg-transparent focus:outline-none"
            triggerContent={
              <span className="relative inline-flex rounded-full border border-sky-500/30 bg-slate-950/80 p-2 shadow-lg backdrop-blur-md">
                <Image src={motominiGif} alt="Mascot" unoptimized className="h-12 w-12 rounded-full object-cover" />
              </span>
            }
          />
        </div>
      </main>
    );
  }

  // ---------------- DESKTOP 3D POP-UP BOOK LAYOUT ----------------

  return (
    <main suppressHydrationWarning className="relative overflow-hidden w-full min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100">
      <TechBackground />
      <div className="pointer-events-none absolute inset-0 -z-10 grid-glow opacity-30" />
      
      {/* Dynamic Ambient Backlight glow reacting to open pages */}
      <div 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[550px] -z-10 rounded-full transition-all duration-1000 blur-[130px]"
        style={{
          background: currentPage === 0 
            ? "radial-gradient(circle, rgba(184,134,11,0.1) 0%, transparent 70%)" 
            : "radial-gradient(circle, rgba(56,189,248,0.08) 0%, rgba(236,72,153,0.04) 50%, transparent 80%)"
        }}
      />

      {/* HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 border-b border-sky-500/10 bg-slate-950/60 backdrop-blur-xl transition-all duration-300">
        <div className="mx-auto flex w-[min(1150px,calc(100vw-3rem))] items-center justify-between gap-4 py-4">
          <button 
            onClick={() => turnToPage(0)}
            className="font-mono text-2xl font-black tracking-[0.12em] text-white hover:text-sky-400 transition-colors duration-300"
          >
            FARIZ
          </button>
          
          <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1 border border-sky-500/10 rounded-full">
            {navItems.map((item) => {
              // Highlight active section based on current open sheet
              const isActive = currentPage === item.target;
              return (
                <button
                  key={item.label}
                  onClick={() => turnToPage(item.target)}
                  className={`text-[10px] font-bold uppercase tracking-[0.16em] px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? "bg-sky-500 text-slate-950 font-black shadow-[0_0_15px_rgba(56,189,248,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-sky-500/5"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <ChatbotWidget
              triggerLabel="Let&apos;s Talk"
              triggerClassName="button-primary rounded-full border border-sky-500/30 px-5 py-2.5 text-xs font-bold hover:shadow-[0_0_18px_rgba(56,189,248,0.3)] transition-all duration-300"
            />
          </div>
        </div>
      </header>

      {/* 3D WORKSPACE / DESK VIEWPORT */}
      <div 
        className="w-full flex-grow flex items-center justify-center py-6 px-12 book-viewport"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* Tilting Desk */}
        <motion.div
          className="relative preserve-3d w-[1000px] h-[630px] flex items-center justify-center"
          animate={{
            rotateX: 18 + mousePos.y * -8, // Parallax desk tilt
            rotateY: mousePos.x * 10,
            // Centering book translation: Shift left if closed cover (page 0), right if closed back cover (page 5)
            x: currentPage === 0 ? -250 : currentPage === 5 ? 250 : 0
          }}
          transition={{
            type: "spring",
            stiffness: 140,
            damping: 24,
            mass: 0.8
          }}
        >
          {/* Desk shadow reflecting book orientation */}
          <div className="absolute inset-0 w-[1000px] h-[630px] bg-black/60 rounded-3xl blur-3xl transform translate-y-16 scale-95 pointer-events-none -z-20" />

          {/* THE 3D BOOK CONTAINER */}
          <div className="relative preserve-3d w-[1000px] h-[630px] rounded-3xl book-shadow">
            
            {/* BOOK SPINE/BINDING (Always visible in center when open) */}
            {currentPage > 0 && currentPage < 5 && (
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-full bg-gradient-to-r from-slate-950 via-slate-800 to-slate-950 z-50 border-y border-slate-700/30 shadow-2xl" 
                style={{ transform: "translateZ(1px)" }}
              />
            )}

            {/* SHEET 0 (Front Cover / Page 1 - Bio) */}
            <BookPageSheet
              sheetIndex={0}
              currentPage={currentPage}
              totalPages={5}
              isCover={true}
              isFlipping={isFlipping === 0}
              onCornerClick={() => turnToPage(1)}
              frontContent={
                /* FRONT COVER ART */
                <div className="w-full h-full flex flex-col justify-between p-12 text-white relative">
                  <div>
                    <span className="font-mono text-xs text-sky-400 font-bold uppercase tracking-[0.2em] flex items-center gap-1.5">
                      <Cpu className="size-4 text-sky-400 animate-pulse" /> Workspace Journal v2.0
                    </span>
                    <h2 className="display-title text-6xl font-black tracking-tight mt-12 text-white leading-none">
                      AMIRUL <br />
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-pink-500">FARIZ</span>
                    </h2>
                    <p className="text-xs font-mono uppercase tracking-[0.25em] text-slate-400 border-b border-sky-500/20 pb-4 mt-2">
                      Interactive 3D Portfolio
                    </p>
                  </div>

                  <div className="space-y-6">
                    <p className="text-xs text-slate-400 max-w-sm font-mono leading-relaxed">
                      This journal uses pure CSS 3D projections. Double click page corners or use the header nav to browse elements.
                    </p>
                    <button 
                      onClick={() => turnToPage(1)}
                      className="group flex items-center gap-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-black px-6 py-3 rounded-full text-xs uppercase tracking-[0.15em] shadow-[0_0_25px_rgba(56,189,248,0.3)] transition-all duration-300 hover:scale-105 active:scale-95"
                    >
                      Initialize System
                      <BookOpen className="size-4 group-hover:rotate-12 transition-transform" />
                    </button>
                  </div>
                </div>
              }
              backContent={
                /* PAGE 1: BIO & PORTRAIT PANEL (LEFT SIDE OF OPEN STAGE 1) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 01</span>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase">BIO SUMMARY</p>
                    </div>

                    <PopUpElement isOpen={currentPage === 1} delay={0.25}>
                      <span className="text-[10px] font-mono font-bold uppercase text-sky-400 tracking-wider">Hi, I&apos;m Amirul Fariz</span>
                      <h2 className="display-title text-4xl font-extrabold text-white mt-1 leading-none tracking-tight">
                        Lets get to know each other.
                      </h2>
                    </PopUpElement>

                    <PopUpElement isOpen={currentPage === 1} delay={0.4}>
                      <p className="text-slate-300 text-xs leading-relaxed max-w-md">
                        I am a student developer currently based in Malaysia, attending UiTM. I write clean React and Next.js and compile responsive UI blueprints built for modern technology products.
                      </p>
                    </PopUpElement>
                  </div>

                  <PopUpElement isOpen={currentPage === 1} delay={0.55}>
                    <div className="grid grid-cols-2 gap-3 border-t border-sky-500/10 pt-4">
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-sky-500/5">
                        <span className="font-mono text-[8px] text-sky-500/50 uppercase">Primary Stack</span>
                        <p className="text-[10px] font-bold text-white mt-0.5">Next.js / TS / Tailwind</p>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-sky-500/5">
                        <span className="font-mono text-[8px] text-sky-500/50 uppercase">Status</span>
                        <p className="text-[10px] font-bold text-white mt-0.5">Open for Internship</p>
                      </div>
                    </div>
                  </PopUpElement>
                </div>
              }
            />

            {/* SHEET 1 (Page 2 - About / Page 3 - Skills) */}
            <BookPageSheet
              sheetIndex={1}
              currentPage={currentPage}
              totalPages={5}
              isFlipping={isFlipping === 1}
              onCornerClick={() => turnToPage(currentPage > 1 ? 1 : 2)}
              frontContent={
                /* PAGE 2: ABOUT ME DETAILED (RIGHT SIDE OF OPEN STAGE 1) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase font-bold">PROFILE SHEET</p>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 02</span>
                    </div>

                    <PopUpElement isOpen={currentPage === 1} delay={0.3} className="flex gap-4 items-center">
                      <div className="relative w-28 aspect-[3/4.2] rounded-xl overflow-hidden border border-sky-500/20 bg-slate-950">
                        <Image src={jackolImage} alt="Amirul portrait" fill className="object-cover" />
                      </div>
                      <div className="flex-grow space-y-2">
                        <span className="text-[9px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md px-2 py-0.5">ACTIVE WORKER</span>
                        <h3 className="font-bold text-white text-base">Amirul Fariz</h3>
                        <p className="text-[10px] text-slate-400 leading-relaxed">
                          Developing layouts and interactions that merge clean presentation with functional engineering.
                        </p>
                      </div>
                    </PopUpElement>

                    <PopUpElement isOpen={currentPage === 1} delay={0.45}>
                      <div className="bg-slate-950/50 border border-sky-500/10 p-4 rounded-xl space-y-2">
                        <h4 className="font-mono text-[10px] font-bold text-sky-400 uppercase tracking-wider">Current Focus</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">
                          Building responsive frontends and motion systems that add direct narrative value to the product without compromising layout speed.
                        </p>
                      </div>
                    </PopUpElement>
                  </div>

                  <PopUpElement isOpen={currentPage === 1} delay={0.6}>
                    <div className="flex flex-wrap gap-1.5 border-t border-sky-500/10 pt-4">
                      {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"].map((tag) => (
                        <span key={tag} className="text-[9px] font-mono bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </PopUpElement>
                </div>
              }
              backContent={
                /* PAGE 3: SKILLS MAP (LEFT SIDE OF OPEN STAGE 2) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 03</span>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase">CAPABILITIES</p>
                    </div>

                    <PopUpElement isOpen={currentPage === 2} delay={0.25}>
                      <span className="text-[9px] font-mono font-bold uppercase text-sky-400 tracking-wider">Technical Blueprint</span>
                      <h2 className="display-title text-3xl font-extrabold text-white mt-0.5 leading-none">
                        Page of Skills
                      </h2>
                    </PopUpElement>

                    {/* Skill Cards Fold-up Grid */}
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      {skills.map((skill, index) => {
                        const Icon = skill.icon;
                        return (
                          <PopUpElement key={index} isOpen={currentPage === 2} delay={0.35 + index * 0.1}>
                            <div className="bg-slate-950/60 border border-sky-500/10 p-3 rounded-xl hover:border-sky-500/30 transition-all duration-300 group">
                              <div className="flex items-center gap-2">
                                <div className="p-1.5 rounded-lg bg-sky-950 text-sky-400 border border-sky-500/20 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-300">
                                  <Icon className="size-3.5" />
                                </div>
                                <h4 className="font-bold text-white text-[11px] truncate">{skill.title}</h4>
                              </div>
                              <p className="text-[9px] text-slate-400 mt-2 leading-normal line-clamp-2">
                                {skill.description}
                              </p>
                            </div>
                          </PopUpElement>
                        );
                      })}
                    </div>
                  </div>

                  <PopUpElement isOpen={currentPage === 2} delay={0.75}>
                    <p className="text-[10px] text-slate-400/70 text-center font-mono border-t border-sky-500/10 pt-3">
                      Hover components to check hover state offsets
                    </p>
                  </PopUpElement>
                </div>
              }
            />

            {/* SHEET 2 (Page 4 - Mathivity Game Console / Page 5 - Projects Grid) */}
            <BookPageSheet
              sheetIndex={2}
              currentPage={currentPage}
              totalPages={5}
              isFlipping={isFlipping === 2}
              onCornerClick={() => turnToPage(currentPage > 2 ? 2 : 3)}
              frontContent={
                /* PAGE 4: MATHIVITY GAME CONSOLE (RIGHT SIDE OF OPEN STAGE 2) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase font-bold">GAME SHOWCASE</p>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 04</span>
                    </div>

                    <PopUpElement isOpen={currentPage === 2} delay={0.3}>
                      <span className="text-[9px] font-mono bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded px-1.5 py-0.5 uppercase tracking-wide">
                        Godot WebGL Embed
                      </span>
                      <h3 className="display-title font-black text-2xl text-white mt-1.5 leading-tight">
                        Play Mathivity Tower Defense
                      </h3>
                    </PopUpElement>

                    {/* Standup Arcade Monitor frame housing the itch.io embed */}
                    <PopUpElement isOpen={currentPage === 2} delay={0.45} className="w-full">
                      <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-sky-500/40 bg-black shadow-[0_0_30px_rgba(56,189,248,0.25)] ring-1 ring-sky-500/20">
                        <iframe
                          title="Play Mathivity on itch.io"
                          src={projects[0].embedSrc}
                          className="absolute inset-0 h-full w-full border-0"
                          allowFullScreen
                          loading="lazy"
                        />
                        {/* Monitor glossy/scanline styling */}
                        <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%]" />
                      </div>
                    </PopUpElement>
                  </div>

                  <PopUpElement isOpen={currentPage === 2} delay={0.6}>
                    <div className="flex items-center justify-between border-t border-sky-500/10 pt-4">
                      <span className="text-[9px] font-mono text-slate-400">Usability: 81.9% tested</span>
                      <a
                        href={projects[0].href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1"
                      >
                        Open Fullscreen <ArrowUpRight className="size-3" />
                      </a>
                    </div>
                  </PopUpElement>
                </div>
              }
              backContent={
                /* PAGE 5: PROJECTS LIST (LEFT SIDE OF OPEN STAGE 3) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 05</span>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase">PROTOTYPES LIST</p>
                    </div>

                    <PopUpElement isOpen={currentPage === 3} delay={0.25}>
                      <span className="text-[9px] font-mono font-bold uppercase text-sky-400 tracking-wider">Other Projects</span>
                      <h2 className="display-title text-3xl font-extrabold text-white mt-0.5 leading-none">
                        Technical Builds
                      </h2>
                    </PopUpElement>

                    {/* Blueprint file folders */}
                    <div className="flex flex-col gap-3 mt-4">
                      {projects.slice(1).map((proj, index) => (
                        <PopUpElement key={index} isOpen={currentPage === 3} delay={0.35 + index * 0.15}>
                          <div className="bg-slate-950/50 border border-sky-500/15 p-4 rounded-xl relative overflow-hidden group hover:border-sky-500/30 transition-all duration-300">
                            {/* Blueprint folder tab design */}
                            <div className="absolute top-0 right-0 bg-sky-950 border-l border-b border-sky-500/20 px-3 py-1 rounded-bl-lg text-[9px] font-mono text-sky-400">
                              {proj.year}
                            </div>
                            <span className="text-[9px] font-mono text-slate-500">{proj.label}</span>
                            <h4 className="font-bold text-white text-xs mt-1">{proj.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                              {proj.description}
                            </p>
                            <div className="flex items-center justify-between mt-3 border-t border-sky-500/5 pt-3">
                              <div className="flex gap-1">
                                {proj.stack.map((tag) => (
                                  <span key={tag} className="text-[8px] font-mono bg-slate-900 border border-sky-500/10 text-slate-400 px-1.5 py-0.5 rounded">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <a
                                href={proj.href}
                                className="text-[10px] font-bold text-sky-400 flex items-center gap-1 hover:underline"
                              >
                                Github <ArrowUpRight className="size-3" />
                              </a>
                            </div>
                          </div>
                        </PopUpElement>
                      ))}
                    </div>
                  </div>

                  <PopUpElement isOpen={currentPage === 3} delay={0.7}>
                    <p className="text-[9px] font-mono text-slate-400/50 text-center">
                      Fariz Portfolio Index / v2.0
                    </p>
                  </PopUpElement>
                </div>
              }
            />

            {/* SHEET 3 (Page 6 - Experience / Page 7 - Contact) */}
            <BookPageSheet
              sheetIndex={3}
              currentPage={currentPage}
              totalPages={5}
              isFlipping={isFlipping === 3}
              onCornerClick={() => turnToPage(currentPage > 3 ? 3 : 4)}
              frontContent={
                /* PAGE 6: EXPERIENCE TIMELINE (RIGHT SIDE OF OPEN STAGE 3) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase font-bold">TIMELINE BLUEPRINT</p>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 06</span>
                    </div>

                    <PopUpElement isOpen={currentPage === 3} delay={0.3}>
                      <span className="text-[9px] font-mono font-bold uppercase text-sky-400 tracking-wider">Career path</span>
                      <h2 className="display-title text-3xl font-extrabold text-white mt-0.5 leading-none">
                        Experience Timeline
                      </h2>
                    </PopUpElement>

                    {/* 3D Vertical standing timeline */}
                    <div className="relative flex flex-col gap-3 mt-4 border-l border-sky-500/20 pl-4 ml-2">
                      {experience.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <PopUpElement key={index} isOpen={currentPage === 3} delay={0.4 + index * 0.12}>
                            <div className="relative bg-slate-950/40 border border-sky-500/10 p-3.5 rounded-xl hover:border-sky-500/25 transition-all duration-300">
                              {/* Timeline indicator node */}
                              <div className="absolute -left-[27px] top-1.5 p-1 rounded-full bg-slate-950 border border-sky-500/40 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
                                <Icon className="size-3.5" />
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[8px] font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded px-1.5">
                                  {item.phase}
                                </span>
                                <span className="font-mono text-[8px] text-slate-500">PHASE 0{index + 1}</span>
                              </div>
                              <h4 className="font-bold text-white text-xs mt-1.5 leading-none">{item.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </PopUpElement>
                        );
                      })}
                    </div>
                  </div>

                  <PopUpElement isOpen={currentPage === 3} delay={0.8}>
                    <p className="text-[9px] font-mono text-slate-400/50 text-center">
                      Currently available for 2026/2027 internship roles
                    </p>
                  </PopUpElement>
                </div>
              }
              backContent={
                /* PAGE 7: CONTACT FORM & SOCIALS (LEFT SIDE OF OPEN STAGE 4) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 07</span>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase">COMMUNICATION</p>
                    </div>

                    <PopUpElement isOpen={currentPage === 4} delay={0.25}>
                      <span className="text-[9px] font-mono font-bold uppercase text-sky-400 tracking-wider">Inquiries</span>
                      <h2 className="display-title text-3xl font-extrabold text-white mt-0.5 leading-none">
                        Get in Touch
                      </h2>
                    </PopUpElement>

                    {/* 3D Envelope Input form */}
                    <PopUpElement isOpen={currentPage === 4} delay={0.35}>
                      <form onSubmit={handleFormSubmit} className="flex flex-col gap-2.5 bg-slate-950/80 p-4 border border-sky-500/10 rounded-xl relative shadow-inner">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            placeholder="Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-900 border border-sky-500/20 rounded-lg px-3 py-2 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                            required
                          />
                          <input
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="bg-slate-900 border border-sky-500/20 rounded-lg px-3 py-2 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-sky-400"
                            required
                          />
                        </div>
                        <textarea
                          placeholder="Your Message"
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="bg-slate-900 border border-sky-500/20 rounded-lg px-3 py-2 text-[10px] text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 resize-none"
                          required
                        />
                        <button 
                          type="submit" 
                          className="button-primary rounded-lg py-2 text-[10px] font-bold text-center uppercase tracking-wider transition-all duration-300 hover:shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                        >
                          {formSubmitted ? "Submission Sent!" : "Send Message"}
                        </button>
                      </form>
                    </PopUpElement>
                  </div>

                  {/* Social Grid */}
                  <PopUpElement isOpen={currentPage === 4} delay={0.55}>
                    <div className="grid grid-cols-2 gap-2 border-t border-sky-500/10 pt-4">
                      {contactLinks.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.href} 
                          className="flex items-center gap-2 text-slate-400 hover:text-sky-300 bg-slate-950/40 p-2 rounded-lg border border-sky-500/5 hover:border-sky-500/15 transition-all duration-300"
                        >
                          <link.icon className="size-3.5 text-sky-400 shrink-0" />
                          <span className="text-[9px] font-mono truncate">{link.value}</span>
                        </a>
                      ))}
                    </div>
                  </PopUpElement>
                </div>
              }
            />

            {/* SHEET 4 (Page 8 - Thank You / Back Cover) */}
            <BookPageSheet
              sheetIndex={4}
              currentPage={currentPage}
              totalPages={5}
              isBackCover={true}
              isFlipping={isFlipping === 4}
              onCornerClick={() => turnToPage(currentPage > 4 ? 4 : 5)}
              frontContent={
                /* PAGE 8: THANK YOU & SHUTDOWN (RIGHT SIDE OF OPEN STAGE 4) */
                <div className="w-full h-full p-8 flex flex-col justify-between">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-[9px] text-sky-500/60 uppercase font-bold">TERMINAL SHUTDOWN</p>
                      <div className="h-px bg-sky-500/10 flex-grow" />
                      <span className="font-mono text-[9px] bg-sky-950/60 border border-sky-500/20 text-sky-400 px-2 py-0.5 rounded">SHEET 08</span>
                    </div>

                    <PopUpElement isOpen={currentPage === 4} delay={0.3} className="text-center space-y-3">
                      <div className="mx-auto w-12 h-12 rounded-full bg-sky-950 border border-sky-500/30 flex items-center justify-center text-sky-400 animate-pulse">
                        <Cpu className="size-6" />
                      </div>
                      <h3 className="display-title font-black text-3xl text-white">
                        Thank You for Visiting!
                      </h3>
                      <p className="text-[11px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                        I appreciate you reviewing my interactive workspace log. Feel free to interact with my chatbot in the corner for any immediate inquiries!
                      </p>
                    </PopUpElement>
                  </div>

                  <PopUpElement isOpen={currentPage === 4} delay={0.5} className="flex flex-col gap-2.5">
                    <button
                      onClick={() => turnToPage(0)}
                      className="button-secondary rounded-lg py-2.5 text-[10px] font-bold text-center uppercase tracking-widest text-slate-300 hover:text-white transition-all duration-300"
                    >
                      Return to Beginning
                    </button>
                    <button
                      onClick={() => turnToPage(5)}
                      className="bg-slate-900 hover:bg-slate-800 text-[10px] text-slate-400 hover:text-white font-bold uppercase tracking-wider py-2.5 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-all duration-300 shadow-md"
                    >
                      Close Tech Journal
                    </button>
                  </PopUpElement>
                </div>
              }
              backContent={
                /* BACK COVER ART */
                <div className="w-full h-full flex flex-col justify-between p-12 text-white relative">
                  <div>
                    <h2 className="display-title text-4xl font-black tracking-tight text-white/50 leading-none">
                      AMIRUL <br />
                      FARIZ
                    </h2>
                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-600 mt-2">
                      Workspace Journal v2.0
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 max-w-sm font-mono">
                      System offline. Tap corner or click below to reopen the log.
                    </p>
                    <button 
                      onClick={() => turnToPage(4)}
                      className="flex items-center gap-2 border border-sky-500/20 hover:border-sky-400 bg-sky-950/20 hover:bg-sky-950/40 text-sky-400 font-bold px-5 py-2.5 rounded-full text-[10px] uppercase tracking-[0.15em] transition-all duration-300"
                    >
                      Open Journal
                    </button>
                  </div>
                </div>
              }
            />

          </div>
        </motion.div>
      </div>

      {/* FOOTER DESK UTILITIES */}
      <footer className="w-full border-t border-sky-500/10 bg-slate-950/50 py-3 text-center relative z-10 select-none">
        <div className="mx-auto max-w-2xl flex items-center justify-between px-6">
          <div className="flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
            <MousePointerClick className="size-3 text-sky-500/70" />
            <span>Interactive Parallax active</span>
          </div>

          {/* Direct page click triggers */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => turnToPage(currentPage - 1)}
              disabled={currentPage === 0}
              className={`p-1.5 rounded-full border border-sky-500/20 text-sky-400 bg-slate-900 transition-all ${
                currentPage === 0 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-sky-500 hover:text-slate-950 active:scale-90"
              }`}
              title="Prev Sheet"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            
            <span className="font-mono text-[10px] text-sky-400 tracking-wider">
              {currentPage === 0 
                ? "CLOSED" 
                : currentPage === 5 
                  ? "CLOSED" 
                  : `SHEET 0${currentPage} / 04`
              }
            </span>

            <button
              onClick={() => turnToPage(currentPage + 1)}
              disabled={currentPage === 5}
              className={`p-1.5 rounded-full border border-sky-500/20 text-sky-400 bg-slate-900 transition-all ${
                currentPage === 5 
                  ? "opacity-30 cursor-not-allowed" 
                  : "hover:bg-sky-500 hover:text-slate-950 active:scale-90"
              }`}
              title="Next Sheet"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          <div className="font-mono text-[9px] text-slate-500">
            © 2026 Fariz. Made with Next.js & Framer
          </div>
        </div>
      </footer>

      {/* Floating Chatbot Mascot widget */}
      <div className="fixed bottom-6 right-6 z-[90]">
        <ChatbotWidget
          triggerLabel="Open chatbot"
          triggerClassName="group inline-flex items-center justify-center rounded-full bg-transparent focus:outline-none hover:-translate-y-1 transition-transform duration-300"
          triggerContent={
            <span className="relative inline-flex rounded-full border border-sky-500/30 bg-slate-950/70 p-2 shadow-2xl backdrop-blur-md">
              <Image src={motominiGif} alt="Mascot" unoptimized className="h-16 w-16 rounded-full object-cover" />
            </span>
          }
        />
      </div>
    </main>
  );
}

// ---------------- SUB-COMPONENT FOR 3D POP-UP FOLDING ----------------
interface PopUpElementProps {
  children: React.ReactNode;
  isOpen: boolean;
  delay?: number;
  className?: string;
}

function PopUpElement({ children, isOpen, delay = 0.2, className = "" }: PopUpElementProps) {
  return (
    <motion.div
      className={`popup-3d-element ${className}`}
      initial={{ rotateX: 0, opacity: 0.1 }}
      animate={{
        // 3D Folding action: rotate upward when open, flatten when page is flipped away/closed
        rotateX: isOpen ? -72 : 0,
        opacity: isOpen ? 1 : 0.1,
        z: isOpen ? 8 : 0,
      }}
      transition={{
        duration: 0.8,
        delay: isOpen ? delay : 0,
        ease: [0.22, 1, 0.36, 1], // premium physics easing
      }}
    >
      {children}
    </motion.div>
  );
}
