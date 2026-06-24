"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Folder, Mail, Play, Cpu, 
  X, ExternalLink, ChevronRight, Gamepad2, 
  Trophy, Search, Award, Send, Volume2, 
  VolumeX, Copy, Check, Info, CheckCircle2,
  Gamepad, ArrowLeft, ArrowUpRight, MessageSquare
} from "lucide-react";
import { synth } from "@/lib/audio-synthesizer";
import amirulImage from "@/assets/project_images/amirul.jpg";
import jackolImage from "@/assets/project_images/jackol.jpg";
import motominiGif from "@/assets/project_images/motomini.gif";

// --- DATA DEFINITIONS ---
const PROFILE_DATA = {
  name: "Amirul Fariz",
  nickname: "Jackal",
  title: "Junior Frontend Developer",
  bio: "I build clean web experiences, turn ideas into working products, and keep learning through real projects that improve both design and code. Focus is on interface consistency and motion patterns.",
  email: "amirulfariz901@gmail.com",
  phone: "017-556-4825",
  location: "Malaysia",
  github: "https://github.com/ProfFariz",
  favoriteFood: "Nasi Lemak 🍛",
  playtime: "1,337 hrs",
  level: 25
};

const EDUCATION_DATA = {
  school: "Universiti Teknologi MARA (UiTM)",
  status: "Active Student",
  focus: "Information Technology",
  description: "Focusing on Software Engineering, Web Development, and human-computer interactions. Maintaining strong foundations in algorithms, data structures, and responsive layouts.",
  achievements: [
    "GPA 3.85 / 4.00 (Deans List)",
    "Final Year Project: Mathivity Educational Game",
    "Active member of Student IT Club"
  ]
};

const EXPERIENCE_DATA = [
  {
    phase: "Present",
    company: "UiTM Perak",
    role: "Student Developer",
    period: "2023 - Present",
    desc: "Studying while building local web projects, standardizing code repositories, and improving frontend layout design systems."
  },
  {
    phase: "Focus",
    company: "Personal Sandbox",
    role: "UI/UX Engineering",
    period: "2024 - 2025",
    desc: "Creating responsive, interactive web application interfaces using React, TypeScript, and Tailwind CSS. Implementing complex animations using Framer Motion."
  },
  {
    phase: "Next Step",
    company: "Production Teams",
    role: "Open for Internships",
    period: "2025 Onward",
    desc: "Looking to join product teams as an intern, eager to collaborate, write clean component-driven React, and tackle real-world development challenges."
  }
];

const PROJECTS_DATA = [
  {
    id: "mathivity",
    title: "Mathivity TD",
    desc: "An educational 2D tower defense built in Godot 4. Designed to reinforce mathematical fluency and reduce primary school students' anxiety through engaging game mechanics.",
    stack: ["Godot 4", "GDScript", "HTML5/WebGL", "Windows Export"],
    href: "https://amirulgodot.itch.io/mathivity",
    embedSrc: "https://itch.io/embed-upload/16436534?color=333333",
    badge: "FYP Project",
    playtime: "45 hrs played",
    features: [
      "Ballistic target calculations synchronized with 2D path follow nodes.",
      "Overlay GUI modals parsing math fractions, percentages, and ratios.",
      "Custom level state machine managing wave timers and stats."
    ]
  },
  {
    id: "motogp",
    title: "MotoGP FansBot",
    desc: "A campaign-style landing page built to practice conversion flow, section pacing, and stronger call-to-action placement.",
    stack: ["Tailwind CSS", "React", "Responsive UI"],
    href: "https://github.com/ProfFariz/Portfolio",
    badge: "Practice Build",
    playtime: "12 hrs played",
    features: [
      "Fully responsive section flow adapting cleanly across screens.",
      "Optimized layout conversion matching Figma blueprints.",
      "Animated scroll cues directing attention to key conversion nodes."
    ]
  },
  {
    id: "uitm",
    title: "UiTM Perak Departments Portal",
    desc: "An admin department dashboard mockup built for testing UI layouts, datagrid state, and navigation layouts.",
    stack: ["JavaScript", "HTML/CSS", "Dashboard Mockup"],
    href: "https://github.com/ProfFariz/Portfolio",
    badge: "Prototype Portal",
    playtime: "24 hrs played",
    features: [
      "Custom vanilla JS router swapping layout nodes on request.",
      "Responsive navigation sidebar folding dynamically on mobile.",
      "Interactive data cards summarizing dummy department statistics."
    ]
  }
];

const SKILLS_DATA = [
  {
    name: "Frontend Craft",
    desc: "React/Next.js, TypeScript, Tailwind, component architecture, state management.",
    rating: 90,
    item: "Component Blueprint",
    unlocked: true
  },
  {
    name: "Interface Systems",
    desc: "Visual hierarchy, typography, smooth micro-animations, theme design, transitions.",
    rating: 82,
    item: "Animation Keyframe",
    unlocked: true
  },
  {
    name: "Workflow Rhythm",
    desc: "Git collaboration, package management, CLI troubleshooting, incremental review.",
    rating: 85,
    item: "Git Committer Star",
    unlocked: true
  },
  {
    name: "Growth Track",
    desc: "REST APIs, database bindings, serverless functions, developer onboarding.",
    rating: 60,
    item: "REST API Key",
    unlocked: false
  }
];

export function SteamPortfolio() {
  const [activeTab, setActiveTab] = useState<string>("library"); // "library" or category IDs
  const [searchQuery, setSearchQuery] = useState("");
  const [sfxMuted, setSfxMuted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Contact form
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "jackal"; text: string; time: string }>>([]);

  // Skills Tree
  const [selectedSkill, setSelectedSkill] = useState<typeof SKILLS_DATA[0] | null>(SKILLS_DATA[0]);

  // Project Detail selection
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS_DATA[0] | null>(null);

  // Play navigation chime
  const playClick = () => {
    if (!sfxMuted) {
      synth.playKeyClick();
    }
  };

  const playSuccess = () => {
    if (!sfxMuted) {
      synth.playBeep(980, 0.18);
    }
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    playSuccess();
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) return;
    
    playSuccess();
    setFormSubmitted(true);
    
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newChatLog = [
      { sender: "user" as const, text: `Hello! I am ${contactForm.name} (${contactForm.email}). Here is my letter: "${contactForm.message}"`, time: timeStr },
      { sender: "jackal" as const, text: `Message received! Thanks for reaching out, ${contactForm.name}. I will reply to you at ${contactForm.email} as soon as possible! ✉️`, time: timeStr }
    ];
    setChatLog(newChatLog);
  };

  const handleResetForm = () => {
    playClick();
    setContactForm({ name: "", email: "", message: "" });
    setFormSubmitted(false);
    setChatLog([]);
  };

  // Filter categories
  const categories = [
    { id: "profile", label: "Profile", icon: User, playtime: "135 hrs", desc: "RPG / Simulation" },
    { id: "education", label: "Education", icon: Award, playtime: "120 hrs", desc: "Adventure / Puzzle" },
    { id: "experience", label: "Experience", icon: Trophy, playtime: "280 hrs", desc: "Strategy / Quest" },
    { id: "projects", label: "Projects", icon: Folder, playtime: "450 hrs", desc: "Simulation / Sandbox" },
    { id: "skills", label: "Skills", icon: Cpu, playtime: "350 hrs", desc: "Attributes Tree" },
    { id: "contact", label: "Contact", icon: Mail, playtime: "18 hrs", desc: "Co-op / Multiplayer" },
  ];

  const filteredCategories = categories.filter(cat => 
    cat.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f3f4f6] text-slate-800 font-plus-jakarta select-none flex flex-col steam-light-bg">
      
      {/* 1. STEAM TOP NAVIGATION HEADER (SLATE-900 RETRO STYLING) */}
      <header className="w-full bg-[#171a21] text-[#c5c3c0] text-[11px] font-medium border-b-2 border-black/30 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex justify-between items-center">
          {/* Logo & Main Nav Tabs */}
          <div className="flex items-center gap-6">
            <div 
              onClick={() => { setActiveTab("library"); playClick(); }}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="size-6 bg-gradient-to-br from-blue-500 to-indigo-700 rounded-full flex items-center justify-center text-white border border-slate-700 shadow-inner group-hover:scale-105 transition-transform">
                <Gamepad2 className="size-3.5" />
              </div>
              <span className="font-outfit font-extrabold tracking-wider text-white text-sm">JACKAL HUB</span>
            </div>

            <nav className="hidden sm:flex items-center gap-5 font-bold uppercase tracking-wider text-[11px]">
              <span 
                onClick={() => { setActiveTab("library"); playClick(); }}
                className={`cursor-pointer hover:text-white transition-colors ${activeTab === "library" ? "text-white border-b-2 border-blue-500 pb-0.5" : "text-[#b8b6b4]"}`}
              >
                Store
              </span>
              <span 
                onClick={() => { setActiveTab("library"); playClick(); }}
                className={`cursor-pointer hover:text-white transition-colors ${activeTab !== "library" ? "text-white border-b-2 border-blue-500 pb-0.5" : "text-[#b8b6b4]"}`}
              >
                Library
              </span>
              <a 
                href={PROFILE_DATA.github} 
                target="_blank" 
                rel="noreferrer"
                onClick={playClick}
                className="text-[#b8b6b4] hover:text-white transition-colors flex items-center gap-1"
              >
                Community <ExternalLink className="size-2.5" />
              </a>
              <span 
                onClick={() => { setActiveTab("profile"); playClick(); }}
                className="cursor-pointer text-[#b8b6b4] hover:text-white transition-colors"
              >
                About Fariz
              </span>
            </nav>
          </div>

          {/* Right: Sound Control and Profile Quick Peek */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSfxMuted(!sfxMuted)}
              className="p-1.5 bg-[#2a2e38] border border-slate-700 hover:bg-[#343844] text-[#c5c3c0] rounded-lg transition-colors"
              title={sfxMuted ? "Unmute Sounds" : "Mute Sounds"}
            >
              {sfxMuted ? <VolumeX className="size-3.5 text-rose-500" /> : <Volume2 className="size-3.5 text-emerald-400" />}
            </button>

            <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
              <div className="relative">
                <Image 
                  src={jackolImage} 
                  alt="Avatar" 
                  width={28} 
                  height={28} 
                  className="rounded-md border border-slate-600 object-cover"
                />
                <span className="absolute -bottom-0.5 -right-0.5 size-2 bg-emerald-500 rounded-full border border-[#171a21] status-pulse-ring" />
              </div>
              <div className="hidden md:block text-left leading-none">
                <div className="text-white font-bold text-xs">{PROFILE_DATA.nickname}</div>
                <div className="text-emerald-400 text-[9px] mt-0.5">Online: Coding</div>
              </div>
              <div className="bg-blue-600/30 border border-blue-500/50 text-[#63b3ed] text-[9px] font-black px-1.5 py-0.5 rounded ml-1">
                Lv {PROFILE_DATA.level}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 2. SUBHEADER HUD (LIBRARY SUB BANNER) */}
      <section className="bg-white border-b border-slate-200 shadow-sm py-4 px-6 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Currently Active Session</div>
            <h1 className="font-outfit font-extrabold text-2xl text-slate-900 flex items-center gap-2 mt-0.5">
              <span>{PROFILE_DATA.name}</span>
              <span className="text-sm font-normal text-slate-500 font-plus-jakarta mt-1">({PROFILE_DATA.title})</span>
            </h1>
          </div>

          <div className="flex gap-6 text-xs text-slate-600">
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
              <div className="font-bold text-slate-900 font-outfit text-sm">{PROFILE_DATA.playtime}</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Total Play Time</div>
            </div>
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
              <div className="font-bold text-emerald-600 font-outfit text-sm">12 / 12</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Achievements</div>
            </div>
            <div className="bg-slate-100 border border-slate-200 px-3.5 py-2 rounded-xl text-center shadow-sm">
              <div className="font-bold text-blue-600 font-outfit text-sm">3 Builds</div>
              <div className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Projects Unlocked</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT split SCREEN */}
      <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col lg:flex-row p-4 md:p-6 gap-6 relative z-10">
        
        {/* Left Side: Steam Library Sidebar */}
        <aside className="w-full lg:w-72 bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl p-4 flex flex-col gap-4 shadow-sm self-start">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search in Library..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium uppercase text-slate-700 tracking-wider placeholder:text-slate-400"
            />
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider mb-2 px-2">
              <span>My Portfolio Sections</span>
              <span>({filteredCategories.length})</span>
            </div>

            <div className="space-y-1">
              <button
                onClick={() => { setActiveTab("library"); playClick(); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                  activeTab === "library" 
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Gamepad className="size-4" />
                  <span className="uppercase tracking-wider">ALL LIBRARY GAMES</span>
                </div>
              </button>

              {filteredCategories.map((cat) => {
                const IconComp = cat.icon;
                const isActive = activeTab === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveTab(cat.id); playClick(); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between group ${
                      isActive 
                        ? "bg-slate-100 text-indigo-600 border-l-4 border-indigo-600 pl-2 shadow-sm font-extrabold" 
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`p-1.5 rounded-lg ${isActive ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 transition-colors"}`}>
                        <IconComp className="size-3.5" />
                      </div>
                      <span className="uppercase tracking-wider">{cat.label}</span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-semibold group-hover:text-slate-600 transition-colors">{cat.playtime}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Access Card */}
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100/60 p-4 rounded-xl mt-2 text-left">
            <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest flex items-center gap-1.5">
              <Info className="size-3 text-indigo-600" />
              <span>Developer Spec</span>
            </h4>
            <p className="text-[10px] text-slate-500 leading-relaxed mt-2 uppercase font-medium tracking-wide">
              Level 25 is currently searching for a co-op software internship. Press peach letter / contact to invite!
            </p>
          </div>
        </aside>

        {/* Right Side: Display monitor dashboard */}
        <section className="flex-1 flex flex-col gap-6">
          <AnimatePresence mode="wait">
            
            {/* VIEW A: STORE & CARDS DECK GRID (tab === "library") */}
            {activeTab === "library" ? (
              <motion.div
                key="library-dashboard"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className="space-y-6 flex flex-col"
              >
                {/* 1. HERO SPOTLIGHT CAROUSEL AREA */}
                <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row relative">
                  {/* Banner image/gif Left */}
                  <div className="w-full md:w-[45%] relative aspect-video md:aspect-auto min-h-[180px] bg-slate-950 overflow-hidden">
                    <Image 
                      src={motominiGif} 
                      alt="Featured Showcase" 
                      fill
                      className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute top-3 left-3 bg-indigo-600 border border-indigo-500 text-white font-black text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-lg">
                      FEATURED & RECOMMENDED
                    </div>
                  </div>

                  {/* Info details Right */}
                  <div className="flex-1 p-5 md:p-6 flex flex-col justify-between text-left space-y-4">
                    <div className="space-y-2">
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">GAME OF THE FYP</div>
                      <h2 className="font-outfit font-black text-slate-900 text-xl md:text-2xl uppercase tracking-tight leading-none">
                        Mathivity TD
                      </h2>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[9px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-full uppercase tracking-wider">
                          Overwhelmingly Positive
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          (98% User Reviews)
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 leading-relaxed pt-1.5">
                        An educational 2D mathematical tower defense game built in Godot 4. Defend your base, deploy towers, and answer percentage, ratio, and fraction arithmetic popups to defeat enemies!
                      </p>
                    </div>

                    <div className="flex items-end justify-between flex-wrap gap-4 pt-2 border-t border-slate-100">
                      {/* Tech badges */}
                      <div className="flex flex-wrap gap-1.5">
                        {["Godot 4", "GDScript", "HTML5"].map(tag => (
                          <span key={tag} className="text-[8px] font-black px-2 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Launch button */}
                      <a
                        href="https://amirulgodot.itch.io/mathivity"
                        target="_blank"
                        rel="noreferrer"
                        onClick={playSuccess}
                        className="px-4 py-2 bg-gradient-to-r from-[#70b01c] to-[#5c9214] hover:from-[#7fc523] hover:to-[#6ba318] text-white text-[11px] font-black uppercase tracking-widest rounded-xl shadow-md border-b-4 border-black/20 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center gap-2"
                      >
                        <Play className="size-3 fill-white" />
                        <span>Play Game</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* 2. CARD DECK GRID */}
                <div>
                  <h3 className="font-outfit font-black text-slate-900 text-base uppercase tracking-wider text-left mb-4 flex items-center gap-2">
                    <Gamepad className="size-5 text-indigo-600" />
                    <span>Library Deck Selection</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {categories.map((cat, idx) => {
                      const Icon = cat.icon;
                      
                      // Gradient backgrounds for card thumbnails based on index
                      const colorGradients = [
                        "from-rose-400 to-pink-500", // Profile
                        "from-blue-500 to-indigo-600", // Education
                        "from-amber-400 to-yellow-500", // Experience
                        "from-emerald-500 to-teal-600", // Projects
                        "from-purple-500 to-violet-600", // Skills
                        "from-pink-500 to-rose-600"  // Contact
                      ];
                      
                      return (
                        <motion.div
                          key={cat.id}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05, type: "spring", stiffness: 120 }}
                          whileHover={{ 
                            y: -6, 
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.08)",
                          }}
                          onClick={() => { setActiveTab(cat.id); playClick(); }}
                          className="group bg-white border border-slate-200 rounded-3xl p-4 flex flex-col justify-between cursor-pointer shadow-sm relative overflow-hidden transition-all text-left"
                        >
                          <div className="space-y-4">
                            {/* Rich Thumbnail Top Banner */}
                            <div className={`w-full h-24 bg-gradient-to-br ${colorGradients[idx % colorGradients.length]} rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner`}>
                              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                              {/* Abstract shapes inside banner */}
                              <div className="absolute -bottom-4 -right-4 size-16 bg-white/10 rounded-full blur-md" />
                              <div className="absolute -top-4 -left-4 size-12 bg-white/10 rounded-full blur-md" />

                              {cat.id === "profile" ? (
                                <Image 
                                  src={amirulImage} 
                                  alt="Fariz Profile" 
                                  className="size-16 rounded-full border-2 border-white/80 object-cover shadow-md z-10 group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <Icon className="size-10 text-white z-10 drop-shadow-[2px_2px_0px_rgba(0,0,0,0.25)] group-hover:scale-110 group-hover:rotate-6 transition-transform duration-250" />
                              )}
                            </div>

                            {/* Card text */}
                            <div className="space-y-1">
                              <h4 className="font-outfit font-extrabold text-slate-800 text-sm uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                                {cat.label}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{cat.desc}</p>
                            </div>
                          </div>

                          {/* Card bottom specs */}
                          <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-4">
                            <div className="text-slate-500 text-[10px] font-medium uppercase">
                              Played: <span className="font-bold text-slate-700">{cat.playtime}</span>
                            </div>
                            <div className="px-2 py-1 bg-slate-100 group-hover:bg-indigo-600 group-hover:text-white rounded-lg text-[9px] font-black uppercase text-slate-500 tracking-wider transition-colors flex items-center gap-1.5 shadow-sm">
                              <span>PLAY</span>
                              <ChevronRight className="size-2.5" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ) : (
              
              // VIEW B: CATEGORY STORE PAGE DETAILED TABS (tab !== "library")
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white border border-slate-200 rounded-3xl p-5 md:p-6 shadow-sm flex flex-col text-left relative overflow-hidden"
              >
                {/* 1. Category Banner Header */}
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5 flex-wrap gap-4">
                  <button 
                    onClick={() => { setActiveTab("library"); playClick(); }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-wider rounded-xl shadow-sm transition-colors active:scale-95"
                  >
                    <ArrowLeft className="size-3" />
                    <span>Back to Library</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Store Page</span>
                    <span className="size-1.5 bg-slate-300 rounded-full" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{activeTab}</span>
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left main pane (Category details) */}
                  <div className="flex-1 space-y-6 max-h-[65vh] overflow-y-auto pr-1 steam-scrollbar">
                    {/* --- TAB A: PROFILE CONTENT --- */}
                    {activeTab === "profile" && (
                      <div className="space-y-5">
                        <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-4 flex-col sm:flex-row relative overflow-hidden">
                          <Image 
                            src={amirulImage} 
                            alt="Amirul Fariz" 
                            width={72} 
                            height={72} 
                            className="rounded-full border-2 border-indigo-500 object-cover shadow"
                          />
                          <div className="space-y-1 text-center sm:text-left">
                            <h4 className="font-outfit font-black text-slate-800 text-base">{PROFILE_DATA.name}</h4>
                            <p className="text-[10px] text-indigo-600 font-black uppercase tracking-widest">{PROFILE_DATA.title}</p>
                            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Nickname: {PROFILE_DATA.nickname}</p>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-slate-600 text-xs">
                          <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Game Summary (Bio)</div>
                          <p className="leading-relaxed bg-slate-50 border border-slate-200 p-4 rounded-xl">
                            {PROFILE_DATA.bio}
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Copy Mail */}
                          <div 
                            onClick={() => copyToClipboard(PROFILE_DATA.email, "email")}
                            className="bg-slate-50 border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition-colors relative group"
                          >
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">EMAIL ADDRESS</span>
                            <div className="text-xs font-bold text-slate-700 mt-1 truncate group-hover:text-indigo-600 transition-colors">{PROFILE_DATA.email}</div>
                            
                            <div className="absolute right-3 top-3.5 text-slate-400 group-hover:text-indigo-600">
                              {copiedField === "email" ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-3.5" />}
                            </div>

                            {copiedField === "email" && (
                              <span className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full border border-emerald-600 shadow-md">
                                COPIED 🪙
                              </span>
                            )}
                          </div>

                          {/* Copy Phone */}
                          <div 
                            onClick={() => copyToClipboard(PROFILE_DATA.phone, "phone")}
                            className="bg-slate-50 border border-slate-200 hover:border-indigo-400 p-4 rounded-xl cursor-pointer transition-colors relative group"
                          >
                            <span className="text-slate-400 text-[9px] font-black uppercase tracking-widest">PHONE NUMBER</span>
                            <div className="text-xs font-bold text-slate-700 mt-1 group-hover:text-indigo-600 transition-colors">{PROFILE_DATA.phone}</div>
                            
                            <div className="absolute right-3 top-3.5 text-slate-400 group-hover:text-indigo-600">
                              {copiedField === "phone" ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-3.5" />}
                            </div>

                            {copiedField === "phone" && (
                              <span className="absolute -top-3 left-4 px-2 py-0.5 bg-emerald-500 text-white text-[8px] font-black rounded-full border border-emerald-600 shadow-md">
                                COPIED 🪙
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Extra profile details */}
                        <div className="bg-[#eff6ff] border border-blue-200/50 p-4 rounded-xl flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Favorite Food Power-Up:</span>
                          <span className="font-bold text-blue-700">{PROFILE_DATA.favoriteFood}</span>
                        </div>
                      </div>
                    )}

                    {/* --- TAB B: EDUCATION CONTENT --- */}
                    {activeTab === "education" && (
                      <div className="space-y-5">
                        <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-3 relative overflow-hidden">
                          <span className="absolute top-2 right-4 text-4xl opacity-10">🎓</span>
                          <h4 className="font-outfit font-black text-slate-800 text-base">{EDUCATION_DATA.school}</h4>
                          <div className="flex gap-2 flex-wrap">
                            <span className="text-[9px] px-2.5 py-0.5 bg-blue-100 text-blue-700 border border-blue-200 rounded-full font-black uppercase tracking-wider">
                              {EDUCATION_DATA.status}
                            </span>
                            <span className="text-[9px] px-2.5 py-0.5 bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-full font-black uppercase tracking-wider">
                              {EDUCATION_DATA.focus}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-slate-600 text-xs">
                          <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider font-outfit">Syllabus Overview</div>
                          <p className="leading-relaxed bg-slate-50 border border-slate-200 p-4 rounded-xl">
                            {EDUCATION_DATA.description}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <div className="font-bold text-slate-800 text-[10px] uppercase tracking-wider">Quest Accomplishments</div>
                          <div className="space-y-2">
                            {EDUCATION_DATA.achievements.map((item, idx) => (
                              <div key={idx} className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl flex items-center gap-3">
                                <CheckCircle2 className="size-4.5 text-emerald-600 shrink-0" />
                                <span className="text-xs text-slate-700 font-bold uppercase tracking-wide">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* --- TAB C: EXPERIENCE CONTENT (TIMELINE ACHIEVEMENTS) --- */}
                    {activeTab === "experience" && (
                      <div className="space-y-5">
                        {/* Progress Meter */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-2">
                          <div className="flex justify-between items-center text-[10px] text-slate-500 font-black uppercase tracking-wider">
                            <span>Quest Stages Unlocked</span>
                            <span className="text-emerald-600">3 / 3 Completed</span>
                          </div>
                          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                            <div className="h-full bg-emerald-500 rounded-full w-full" />
                          </div>
                        </div>

                        {/* Timeline */}
                        <div className="space-y-4">
                          {EXPERIENCE_DATA.map((exp, idx) => (
                            <div 
                              key={idx}
                              className="bg-slate-50 border border-slate-200 hover:border-slate-300 p-4 rounded-xl relative flex flex-col sm:flex-row justify-between gap-4 transition-colors"
                            >
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <span className="size-5 bg-amber-500 rounded-full text-white flex items-center justify-center text-[10px] font-black border border-amber-600 shadow shadow-amber-500/20">
                                    ★
                                  </span>
                                  <span className="font-outfit font-black text-slate-800 text-sm uppercase tracking-wide">{exp.role}</span>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                  {exp.company} | {exp.period}
                                </p>
                                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wide">
                                  {exp.desc}
                                </p>
                              </div>

                              <div className="self-start sm:self-center">
                                <span className="text-[8px] px-2.5 py-1 bg-amber-100 text-amber-800 border border-amber-200 rounded-full font-black uppercase tracking-widest">
                                  {exp.phase}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* --- TAB D: PROJECTS CONTENT --- */}
                    {activeTab === "projects" && (
                      <div className="space-y-5">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">STORE PRODUCTS / PROJECTS ({PROJECTS_DATA.length})</div>
                        
                        <div className="space-y-4">
                          {PROJECTS_DATA.map((proj) => (
                            <div 
                              key={proj.id}
                              className="bg-slate-50 border border-slate-200 hover:border-indigo-200 p-5 rounded-2xl space-y-4 text-left transition-colors"
                            >
                              <div className="flex justify-between items-start flex-wrap gap-2">
                                <div className="space-y-0.5">
                                  <h4 className="font-outfit font-black text-slate-800 text-base uppercase tracking-wider">{proj.title}</h4>
                                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{proj.badge} | {proj.playtime}</span>
                                </div>

                                <div className="flex flex-wrap gap-1">
                                  {proj.stack.map(s => (
                                    <span key={s} className="text-[8px] font-black px-2 py-0.5 bg-slate-200 text-slate-600 rounded">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <p className="text-xs text-slate-500 leading-relaxed font-medium">
                                {proj.desc}
                              </p>

                              {/* Features checklist */}
                              <div className="space-y-1 bg-white border border-slate-100 p-3.5 rounded-xl">
                                <div className="text-[9px] text-slate-400 font-black uppercase tracking-wider mb-1">Key Features:</div>
                                {proj.features.map((feat, i) => (
                                  <div key={i} className="text-[10px] text-slate-600 flex items-start gap-1.5 font-medium leading-normal">
                                    <span className="text-emerald-500 font-bold shrink-0">✓</span>
                                    <span>{feat}</span>
                                  </div>
                                ))}
                              </div>

                              <div className="flex gap-2">
                                {proj.id === "mathivity" ? (
                                  <button
                                    onClick={() => { setSelectedProject(proj); playSuccess(); }}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-1.5 shadow"
                                  >
                                    <Gamepad2 className="size-3.5" />
                                    <span>Launch Demo Frame</span>
                                  </button>
                                ) : null}

                                <a
                                  href={proj.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  onClick={playClick}
                                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors flex items-center gap-1.5"
                                >
                                  <span>View Repository</span>
                                  <ArrowUpRight className="size-3.5" />
                                </a>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* --- TAB E: SKILLS TREE CONTENT --- */}
                    {activeTab === "skills" && (
                      <div className="space-y-5">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">CHARACTER SKILL SPECS & PROGRESSION</div>
                        
                        <div className="flex flex-col md:flex-row gap-5">
                          {/* Skill Selection Deck */}
                          <div className="w-full md:w-56 space-y-2.5">
                            {SKILLS_DATA.map((skill) => (
                              <div
                                key={skill.name}
                                onClick={() => { setSelectedSkill(skill); playClick(); }}
                                className={`p-3.5 border rounded-2xl cursor-pointer text-left transition-all ${
                                  selectedSkill?.name === skill.name
                                    ? "bg-indigo-50 border-indigo-400 shadow-sm"
                                    : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                                }`}
                              >
                                <div className="font-outfit font-black text-slate-800 text-xs uppercase tracking-wide">{skill.name}</div>
                                <div className="flex justify-between items-center mt-1.5">
                                  <span className="text-[8px] px-2 py-0.5 bg-slate-200 text-slate-600 rounded font-black uppercase">{skill.item}</span>
                                  <span className="text-[10px] font-black text-indigo-600">{skill.rating}%</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Skill Info display panel */}
                          {selectedSkill && (
                            <div className="flex-1 bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex justify-between items-center border-b border-slate-200 pb-2 flex-wrap gap-2">
                                  <h4 className="font-outfit font-black text-slate-800 text-sm uppercase tracking-wider">{selectedSkill.name}</h4>
                                  <span className={`text-[8px] px-2.5 py-1 rounded-full font-black uppercase border tracking-wider ${
                                    selectedSkill.unlocked 
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200" 
                                      : "bg-amber-100 text-amber-800 border-amber-200"
                                  }`}>
                                    {selectedSkill.unlocked ? "Mastered" : "In Training"}
                                  </span>
                                </div>

                                <p className="text-xs text-slate-500 leading-relaxed uppercase tracking-wide font-medium">
                                  {selectedSkill.desc}
                                </p>
                              </div>

                              <div className="space-y-2 pt-4 border-t border-slate-200">
                                <div className="flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-wider">
                                  <span>PROFICIENCY POWER</span>
                                  <span className="text-indigo-600 font-bold">{selectedSkill.rating}%</span>
                                </div>

                                <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden p-0.5 border border-slate-300">
                                  <motion.div 
                                    key={selectedSkill.name}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${selectedSkill.rating}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* --- TAB F: CONTACT CHAT CONTENT --- */}
                    {activeTab === "contact" && (
                      <div className="space-y-5">
                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">CO-OP DM LOBBY</div>

                        {/* Interactive Chat bubble screen */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 h-64 overflow-y-auto space-y-3.5 flex flex-col steam-scrollbar">
                          {chatLog.length === 0 ? (
                            <div className="text-center py-12 text-slate-400 text-xs space-y-1.5 uppercase font-medium">
                              <MessageSquare className="size-8 text-slate-300 mx-auto animate-bounce" />
                              <p>No messages sent yet.</p>
                              <p className="text-[9px] text-slate-400">Fill in the letter form below to chat with Jackal.</p>
                            </div>
                          ) : (
                            chatLog.map((chat, idx) => {
                              const isJackal = chat.sender === "jackal";
                              return (
                                <motion.div
                                  key={idx}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className={`flex gap-3 max-w-[85%] ${isJackal ? "self-start" : "self-end flex-row-reverse"}`}
                                >
                                  {/* Avatar */}
                                  <div className="size-8 rounded-full border border-slate-200 overflow-hidden shrink-0">
                                    <Image 
                                      src={isJackal ? jackolImage : amirulImage} 
                                      alt="Avatar" 
                                      width={32} 
                                      height={32}
                                      className="object-cover"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1.5 text-[9px] text-slate-400 font-bold uppercase">
                                      <span>{isJackal ? "Jackal" : "Guest Player"}</span>
                                      <span>•</span>
                                      <span>{chat.time}</span>
                                    </div>
                                    <div className={`p-3 rounded-2xl text-xs leading-normal font-medium ${
                                      isJackal 
                                        ? "bg-white text-slate-700 border border-slate-200 rounded-tl-none shadow-sm" 
                                        : "bg-indigo-600 text-white rounded-tr-none shadow-md"
                                    }`}>
                                      {chat.text}
                                    </div>
                                  </div>
                                </motion.div>
                              );
                            })
                          )}
                        </div>

                        {/* Inputs Form */}
                        {formSubmitted ? (
                          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between flex-wrap gap-4">
                            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                              Message Sent to Developer Box!
                            </div>
                            <button
                              onClick={handleResetForm}
                              className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow transition-all active:scale-95"
                            >
                              Send another letter
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleContactSubmit} className="space-y-4 bg-slate-50 border border-slate-200 p-4 sm:p-5 rounded-2xl text-xs font-semibold text-slate-700 text-left">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Your Name:</label>
                                <input 
                                  type="text" 
                                  required
                                  placeholder="E.G. GUEST DEVELOPER"
                                  value={contactForm.name}
                                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase text-slate-800 text-xs font-bold"
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Your Email:</label>
                                <input 
                                  type="email" 
                                  required
                                  placeholder="E.G. GUEST@COMPANY.COM"
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase text-slate-800 text-xs font-bold"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <label className="text-[9px] font-black uppercase tracking-wider text-slate-400">Your Letter Message:</label>
                              <textarea 
                                required
                                rows={3}
                                placeholder="ENTER WORK OFFER DETAILS OR GREETINGS..."
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase text-slate-800 text-xs font-bold"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow transition-all active:scale-98 flex items-center justify-center gap-2"
                            >
                              <Send className="size-3.5" />
                              <span>Submit Message</span>
                            </button>
                          </form>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right side panel (Metadata / Quick info pane) */}
                  <div className="w-full md:w-56 shrink-0 space-y-4">
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl text-left space-y-3.5">
                      <div className="text-[10px] text-slate-400 font-black uppercase tracking-wider border-b border-slate-200 pb-1.5">
                        Category Specs
                      </div>

                      <div className="space-y-2 text-[10px] text-slate-500 uppercase font-medium">
                        <div className="flex justify-between">
                          <span>Genre:</span>
                          <span className="font-bold text-slate-700">
                            {activeTab === "profile" && "RPG / Adventure"}
                            {activeTab === "education" && "Puzzle / Reading"}
                            {activeTab === "experience" && "Campaign / Quest"}
                            {activeTab === "projects" && "Simulation / Sandbox"}
                            {activeTab === "skills" && "Spec Tree"}
                            {activeTab === "contact" && "Co-op Lobby"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Play Time:</span>
                          <span className="font-bold text-slate-700">
                            {categories.find(c => c.id === activeTab)?.playtime}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Status:</span>
                          <span className="font-bold text-emerald-600">Unlocked</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Achievements:</span>
                          <span className="font-bold text-slate-700">
                            {activeTab === "experience" ? "3 / 3 Unlocked" : "100% Sync"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 p-4 rounded-2xl text-left space-y-2">
                      <div className="text-[10px] text-indigo-900 font-black uppercase tracking-wider flex items-center gap-1.5">
                        <Award className="size-3.5 text-indigo-600" />
                        <span>Recent Drop</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-relaxed uppercase tracking-wide font-medium">
                        Unlocking this store section grants the player extra insights. Keep explore!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Mathivity Demo Iframe Modal Popup */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 select-none">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#171a21] border-2 border-slate-700 w-full max-w-4xl rounded-2xl p-4 shadow-2xl flex flex-col text-left text-[#c5c3c0]"
            >
              <div className="flex justify-between items-center pb-2 mb-3 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <Gamepad2 className="size-5 text-indigo-500" />
                  <span className="font-outfit font-black text-white text-sm uppercase tracking-wide">
                    {selectedProject.title} - Live Sandbox Frame
                  </span>
                </div>
                <button
                  onClick={() => { setSelectedProject(null); playClick(); }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {selectedProject.embedSrc ? (
                <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 shadow-inner">
                  <iframe 
                    src={selectedProject.embedSrc}
                    width="100%" 
                    height="100%" 
                    allowFullScreen
                    className="border-none"
                    title={selectedProject.title}
                  />
                </div>
              ) : (
                <div className="py-20 text-center text-slate-400 text-xs">
                  Sandbox demo frame is not configured for this game.
                </div>
              )}

              <div className="pt-3 flex justify-between items-center text-[10px] text-slate-500 uppercase font-medium">
                <span>🎮 Move: WASD / Arrows | SPACE: JUMP</span>
                <span className="text-slate-400">Deployed via itch.io iframe</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
