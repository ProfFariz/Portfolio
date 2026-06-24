"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { synth } from "@/lib/audio-synthesizer";
import { 
  User, Sparkles, Folder, Calendar, Mail, Play, Cpu, 
  X, Minus, Square, Power, Clock, ExternalLink,
  Laptop, Gamepad2, ChevronRight
} from "lucide-react";
import jackolImage from "@/assets/project_images/jackol.jpg";

// Types for OS windows
interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  icon: React.ComponentType<{ className?: string }>;
}

// Portfolio Data
const skills = [
  { title: "Frontend Craft", desc: "React, Next.js, TypeScript, Tailwind", rating: 90 },
  { title: "Interface Systems", desc: "Layout hierarchy, micro-animations, typography", rating: 82 },
  { title: "Workflow Rhythm", desc: "Git iteration, shell debugging, prototyping", rating: 85 },
  { title: "Growth Track", desc: "API integration, database bindings, server code", rating: 60 },
];

const projects = [
  {
    id: "mathivity",
    title: "Mathivity TD",
    desc: "An educational 2D tower defense built in Godot 4. Students practice maths in active gameplay.",
    stack: ["Godot 4", "GDScript", "WebGL", "Windows Export"],
    href: "https://amirulgodot.itch.io/mathivity",
    embedSrc: "https://itch.io/embed-upload/16436534?color=333333",
    label: "Final Year Project",
    year: "FYP"
  },
  {
    id: "motogp",
    title: "MotoGP FanBot",
    desc: "A landing page built to test and practice layout conversion flow and CTA pacing.",
    stack: ["UI Design", "Responsive Layout"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "Landing Page",
    year: "2025"
  },
  {
    id: "dashboard",
    title: "UiTM Departments Portal",
    desc: "An experimental admin department dashboard mockup built for testing UI layouts.",
    stack: ["JavaScript", "HTML/CSS"],
    href: "https://github.com/ProfFariz/Portfolio",
    label: "Experimental Webapp",
    year: "2024"
  }
];

const experience = [
  { phase: "Present", title: "Student Developer at UiTM", desc: "Studying at Universiti Teknologi Mara while building web projects.", icon: Cpu },
  { phase: "Focus", title: "Tech-Driven UI Systems", desc: "Centering work on clean layouts, motion animations, and TS.", icon: Sparkles },
  { phase: "Next", title: "Open for Internships", desc: "Ready to contribute and learn within production software teams.", icon: Laptop }
];

const contactLinks = [
  { label: "Email", value: "amirulfariz901@gmail.com", href: "mailto:amirulfariz901@gmail.com", icon: Mail },
  { label: "Phone", value: "017-556-4825", href: "tel:0175564825", icon: PhoneWrapper },
  { label: "GitHub", value: "github.com/ProfFariz", href: "https://github.com/ProfFariz", icon: Folder },
  { label: "Location", value: "Malaysia", href: "#", icon: Cpu }
];

function PhoneWrapper() {
  return <span className="text-xs">📞</span>;
}

export function DesktopOS({ onShutdown, isMobile }: { onShutdown?: () => void; isMobile?: boolean }) {
  // Clock state
  const [time, setTime] = useState("");
  const [showStartMenu, setShowStartMenu] = useState(false);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [topZIndex, setTopZIndex] = useState(10);

  // Form states
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  
  // Custom project detail view
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);

  // Window State Machine
  const [windows, setWindows] = useState<WindowState[]>([
    { id: "about", title: "About Me - Notepad", isOpen: false, isMinimized: false, isMaximized: false, x: 80, y: 60, width: 520, height: 380, zIndex: 1, icon: User },
    { id: "skills", title: "Skills Analyzer", isOpen: false, isMinimized: false, isMaximized: false, x: 140, y: 100, width: 480, height: 360, zIndex: 1, icon: Sparkles },
    { id: "projects", title: "Projects Explorer", isOpen: false, isMinimized: false, isMaximized: false, x: 200, y: 140, width: 500, height: 380, zIndex: 1, icon: Folder },
    { id: "experience", title: "Experience Timeline", isOpen: false, isMinimized: false, isMaximized: false, x: 260, y: 80, width: 460, height: 400, zIndex: 1, icon: Calendar },
    { id: "contact", title: "Mail Client", isOpen: false, isMinimized: false, isMaximized: false, x: 320, y: 160, width: 440, height: 390, zIndex: 1, icon: Mail },
  ]);

  // Clock runner
  useEffect(() => {
    const updateTime = () => {
      const date = new Date();
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 12-hour formatting
      const minStr = minutes < 10 ? `0${minutes}` : minutes;
      setTime(`${hours}:${minStr} ${ampm}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Bring window to focus
  const focusWindow = (id: string) => {
    setActiveWindowId(id);
    const nextZ = topZIndex + 1;
    setTopZIndex(nextZ);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ, isMinimized: false } : w));
  };

  // Open window
  const openWindow = (id: string) => {
    synth.playBeep(900, 0.08);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: true, isMinimized: false } : w));
    focusWindow(id);
    setShowStartMenu(false);
  };

  // Close window
  const closeWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    synth.playBeep(700, 0.08);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isOpen: false } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  // Minimize window
  const minimizeWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    synth.playBeep(800, 0.08);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    if (activeWindowId === id) setActiveWindowId(null);
  };

  // Toggle Maximize window
  const toggleMaximizeWindow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    synth.playBeep(880, 0.08);
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
    focusWindow(id);
  };

  // CUSTOM REACT DRAGGING HANDLER (LIGHWEIGHT, COMPATIBLE WITH REACT 19)
  const dragStartRef = useRef<{ startX: number; startY: number; winX: number; winY: number; winId: string } | null>(null);

  const handleMouseDown = (winId: string, e: React.MouseEvent<HTMLDivElement>) => {
    focusWindow(winId);
    
    // Disable drag if window is maximized
    const win = windows.find(w => w.id === winId);
    if (win?.isMaximized) return;

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      winX: win?.x || 0,
      winY: win?.y || 0,
      winId: winId
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragStartRef.current) return;
    const { startX, startY, winX, winY, winId } = dragStartRef.current;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    // Boundaries containment
    const newX = Math.max(0, Math.min(window.innerWidth - 150, winX + dx));
    const newY = Math.max(0, Math.min(window.innerHeight - 150, winY + dy));

    setWindows(prev => prev.map(w => w.id === winId ? { ...w, x: newX, y: newY } : w));
  };

  const handleMouseUp = () => {
    dragStartRef.current = null;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setFormSubmitted(true);
    synth.playBeep(980, 0.2);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", email: "", message: "" });
    }, 3000);
  };

  const shutdownSystem = () => {
    setShowStartMenu(false);
    if (onShutdown) onShutdown();
  };

  if (isMobile) {
    return (
      <main className="w-full min-h-screen bg-[linear-gradient(135deg,#e0f2fe_0%,#f3e8ff_50%,#fce7f3_100%)] p-4 pb-20 text-slate-700 flex flex-col gap-6 font-sans relative overflow-y-auto">
        {/* Dynamic glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-pink-400/15 rounded-full blur-[100px] pointer-events-none" />

        {/* Mobile Header */}
        <header className="flex justify-between items-center bg-white/70 border border-slate-200/60 rounded-2xl px-4 py-3 backdrop-blur-xl shadow-sm">
          <span className="font-sans text-xs font-bold tracking-widest text-sky-600">FARIZ.OS v3.0</span>
          {onShutdown && (
            <button
              onClick={onShutdown}
              className="text-[10px] font-sans font-bold text-rose-600 border border-rose-200 bg-rose-50 px-3 py-1 rounded-full transition-all duration-300 hover:bg-rose-100"
            >
              SHUTDOWN
            </button>
          )}
        </header>

        {/* Widgets Stack */}
        
        {/* Widget 1: About */}
        <section className="bg-white/75 border border-slate-200/60 rounded-2xl p-5 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <User className="size-4 text-sky-600" />
            <h3 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">ABOUT_ME.TXT</h3>
          </div>
          <div className="flex gap-4 items-start">
            <div className="relative w-20 aspect-[3/4] rounded-lg overflow-hidden border border-slate-200 shrink-0 shadow-sm">
              <Image src={jackolImage} alt="Portrait of Fariz" fill className="object-cover" />
            </div>
            <div className="space-y-1.5 min-w-0">
              <h4 className="font-bold text-slate-800 text-sm">Amirul Fariz</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Student Developer</p>
              <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-3">
                I study at UiTM. I write clean, responsive layouts and motion systems that feel fast and look high-end.
              </p>
            </div>
          </div>
          <div className="bg-slate-50/80 border border-slate-100 p-3 rounded-lg text-[10px] text-slate-500 leading-relaxed">
            Focused on building component-driven interfaces that scale cleanly.
          </div>
        </section>

        {/* Widget 2: Skills */}
        <section className="bg-white/75 border border-slate-200/60 rounded-2xl p-5 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Sparkles className="size-4 text-sky-600" />
            <h3 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">SKILLS_ANALYZER.SYS</h3>
          </div>
          <div className="space-y-3">
            {skills.map((skill, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-700 font-bold">{skill.title}</span>
                  <span className="text-sky-600 font-bold">{skill.rating}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden p-px">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${skill.rating}%` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Widget 3: Projects */}
        <section className="bg-white/75 border border-slate-200/60 rounded-2xl p-5 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Folder className="size-4 text-sky-600" />
            <h3 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">PROJECTS_FOLDER.DIR</h3>
          </div>
          <div className="flex flex-col gap-3">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-slate-50/80 border border-slate-100 p-4 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-[9px] font-sans text-slate-400">
                  <span>{proj.year}</span>
                  <span>{proj.label}</span>
                </div>
                <h4 className="font-bold text-slate-800 text-xs">{proj.title}</h4>
                <p className="text-[10px] text-slate-600 leading-relaxed">{proj.desc}</p>
                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <span className="text-[9px] font-sans text-slate-400">{proj.stack[0]}</span>
                  <a
                    href={proj.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1.5"
                  >
                    Explore <ExternalLink className="size-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Widget 4: Experience */}
        <section className="bg-white/75 border border-slate-200/60 rounded-2xl p-5 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Calendar className="size-4 text-sky-600" />
            <h3 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">TIMELINE.LOG</h3>
          </div>
          <div className="relative flex flex-col gap-5 border-l border-sky-200 pl-4 ml-2">
            {experience.map((exp, idx) => (
              <div key={idx} className="relative space-y-1">
                <div className="absolute -left-[23px] top-0.5 w-2.5 h-2.5 rounded-full bg-white border border-sky-300 shadow-sm" />
                <span className="text-[8px] font-sans bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-semibold uppercase">{exp.phase}</span>
                <h4 className="font-bold text-slate-800 text-xs mt-1">{exp.title}</h4>
                <p className="text-[10px] text-slate-500 leading-normal">{exp.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Widget 5: Contact */}
        <section className="bg-white/75 border border-slate-200/60 rounded-2xl p-5 backdrop-blur-xl space-y-4 shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Mail className="size-4 text-sky-600" />
            <h3 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">CONTACT_MAIL.LNK</h3>
          </div>
          <form onSubmit={handleContactSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
              required
            />
            <textarea
              placeholder="Message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 resize-none"
              required
            />
            <button type="submit" className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2 text-[10px] font-bold uppercase tracking-wider transition-all">
              {formSubmitted ? "Sent Successfully!" : "Submit Inquiry"}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <div className="w-full min-h-screen relative overflow-hidden select-none bg-[linear-gradient(135deg,#e0f2fe_0%,#f3e8ff_50%,#fce7f3_100%)] text-slate-800 flex flex-col justify-between font-sans">
      
      {/* Windows 11 Flow Wallpaper Bloom Blobs */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-300/25 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[30%] left-[-10%] w-[400px] h-[400px] bg-pink-300/20 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Desktop Workspace Screen Area */}
      <div className="flex-grow w-full relative p-6">
        
        {/* DESKTOP ICON SHORTCUTS GRID */}
        <div className="flex flex-col gap-6 w-24">
          {windows.map((win) => {
            const IconComp = win.icon;
            return (
              <button
                key={win.id}
                onDoubleClick={() => openWindow(win.id)}
                onClick={() => openWindow(win.id)} // Support single tap for touch accessibility
                className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-transparent hover:bg-white/20 hover:border-slate-300/40 group transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/70 border border-slate-200/50 flex items-center justify-center text-sky-600 group-hover:text-sky-700 shadow-md backdrop-blur-md group-hover:shadow-[0_0_15px_rgba(56,189,248,0.25)] transition-all">
                  <IconComp className="size-6" />
                </div>
                <span className="text-[10px] font-sans font-semibold text-slate-700 group-hover:text-slate-900 truncate max-w-full tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
                  {win.id.toUpperCase()}
                </span>
              </button>
            );
          })}
        </div>

        {/* DRAGGABLE OS WINDOWS MANAGER */}
        {windows.map((win) => {
          if (!win.isOpen) return null;
          
          const IconComp = win.icon;
          const isActive = activeWindowId === win.id;

          const winStyle: React.CSSProperties = win.isMaximized 
            ? {
                top: 0,
                left: 0,
                width: "100%",
                height: "calc(100vh - 48px)",
                zIndex: win.zIndex,
                display: win.isMinimized ? "none" : "flex",
              }
            : {
                top: win.y,
                left: win.x,
                width: win.width,
                height: win.height,
                zIndex: win.zIndex,
                display: win.isMinimized ? "none" : "flex",
              };

          return (
            <div
              key={win.id}
              onClick={() => focusWindow(win.id)}
              style={winStyle}
              className={`absolute flex-col bg-white/75 backdrop-blur-2xl border rounded-2xl overflow-hidden shadow-xl transition-all duration-300 ${
                isActive 
                  ? "border-sky-400/40 shadow-[0_20px_50px_-10px_rgba(14,165,233,0.15)] ring-1 ring-sky-400/10" 
                  : "border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
              }`}
            >
              {/* WINDOW GLOSSY TITLEBAR HEADER (Draggable handle) */}
              <div
                onMouseDown={(e) => handleMouseDown(win.id, e)}
                className={`flex items-center justify-between pl-4 pr-0 py-0 cursor-move border-b transition-colors select-none h-9 ${
                  isActive 
                    ? "bg-white/40 border-slate-200/50 text-slate-800" 
                    : "bg-slate-50/30 border-slate-200/30 text-slate-500"
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComp className={`size-4 ${isActive ? "text-sky-600" : "text-slate-400"}`} />
                  <span className="text-[11px] font-sans font-semibold tracking-wide">{win.title}</span>
                </div>
                
                {/* Windows 11 Style Window controls */}
                <div className="flex items-center -mr-0">
                  <button 
                    onClick={(e) => minimizeWindow(win.id, e)}
                    className="h-9 w-11 hover:bg-slate-200/60 flex items-center justify-center transition-colors text-slate-600 hover:text-slate-950"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <button 
                    onClick={(e) => toggleMaximizeWindow(win.id, e)}
                    className="h-9 w-11 hover:bg-slate-200/60 flex items-center justify-center transition-colors text-slate-600 hover:text-slate-950"
                  >
                    <Square className="size-3" />
                  </button>
                  <button 
                    onClick={(e) => closeWindow(win.id, e)}
                    className="h-9 w-11 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors text-slate-600"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              </div>

              {/* WINDOW INNER VIEWPORT CONTENT */}
              <div className="flex-grow overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-slate-200 text-xs text-slate-600 select-text leading-relaxed">
                
                {/* 1. ABOUT ME APP (Notepad content) */}
                {win.id === "about" && (
                  <div className="space-y-4">
                    <div className="flex gap-5 items-start">
                      <div className="relative w-28 aspect-[3/4] rounded-xl overflow-hidden border border-slate-200 shrink-0 shadow-sm">
                        <Image src={jackolImage} alt="Portrait of Fariz" fill className="object-cover" />
                      </div>
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-sans font-bold bg-sky-50 border border-sky-200 text-sky-700 px-2.5 py-0.5 rounded-full">STATUS: ACTIVE</span>
                        <h3 className="text-lg font-bold text-slate-800 leading-none">Amirul Fariz</h3>
                        <p className="text-[11px] text-slate-500">Student Frontend Developer / UI Builder</p>
                        <p className="text-[11px] leading-relaxed text-slate-600">
                          Hi, I&apos;m Amirul Fariz (people call me Fariz). I study at Universiti Teknologi MARA (UiTM). I focus on creating interface layouts and motion scripts that look high-end and run lightning fast.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/85 p-4 border border-slate-200/60 rounded-xl space-y-2">
                      <h4 className="font-sans text-[10px] font-bold text-sky-600 uppercase tracking-wider">Focus Statement</h4>
                      <p className="text-[11px] text-slate-600">
                        My frontend discipline focuses on layout hierarchy, fluid micro-interactions, and reusable component structure. I build products that are easy to browse and maintain.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-50/85 border border-slate-200/60 p-3 rounded-lg">
                        <span className="font-sans text-[9px] text-sky-600/70 uppercase font-semibold">Primary Stack</span>
                        <p className="font-bold text-slate-800 mt-1">React, Next.js, TS, Tailwind</p>
                      </div>
                      <div className="bg-slate-50/85 border border-slate-200/60 p-3 rounded-lg">
                        <span className="font-sans text-[9px] text-sky-600/70 uppercase font-semibold">Availability</span>
                        <p className="font-bold text-slate-800 mt-1">Open for Internship Roles</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. SKILLS APP (Proficiency Analyzer) */}
                {win.id === "skills" && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800">Capabilities Mapping</h3>
                      <p className="text-[11px] text-slate-500">Quantifiable stats of core developer skills</p>
                    </div>

                    <div className="space-y-4">
                      {skills.map((skill, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-bold text-slate-700">{skill.title}</span>
                            <span className="text-sky-600 font-bold">{skill.rating}%</span>
                          </div>
                          {/* Custom ProgressBar */}
                          <div className="w-full h-2 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden p-px">
                            <div 
                              className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full shadow-[0_0_8px_rgba(56,189,248,0.2)]"
                              style={{ width: `${skill.rating}%` }}
                            />
                          </div>
                          <p className="text-[10px] text-slate-500">{skill.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-slate-200/50 pt-4 flex flex-wrap gap-1.5">
                      {["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Git Workflows", "API Integration"].map((tag) => (
                        <span key={tag} className="text-[9px] font-sans font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. PROJECTS APP (Folder details and Sub-window Launcher) */}
                {win.id === "projects" && (
                  <div className="space-y-4 h-full">
                    {!selectedProject ? (
                      <div className="grid grid-cols-2 gap-4">
                        {projects.map((proj) => (
                          <div
                            key={proj.id}
                            className="bg-slate-55/70 border border-slate-200/60 p-4 rounded-xl hover:border-sky-400/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                          >
                            <div>
                              <div className="flex justify-between items-start text-[9px] font-sans font-medium text-slate-400">
                                <span>{proj.year}</span>
                                <span>{proj.label}</span>
                              </div>
                              <h4 className="font-bold text-slate-800 text-sm mt-1">{proj.title}</h4>
                              <p className="text-[10px] text-slate-500 mt-2 leading-relaxed line-clamp-2">{proj.desc}</p>
                            </div>
                            <div className="flex justify-between items-center mt-3 border-t border-slate-200/50 pt-3">
                              <span className="text-[9px] font-sans font-medium text-sky-600/80">{proj.stack[0]}</span>
                              
                              {proj.id === "mathivity" ? (
                                <button
                                  onClick={() => {
                                    synth.playBeep(1000, 0.1);
                                    setSelectedProject(proj);
                                  }}
                                  className="text-[10px] font-bold text-sky-700 hover:text-sky-800 flex items-center gap-1 bg-sky-50 border border-sky-200/60 px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  Run app <Play className="size-2.5 fill-sky-700" />
                                </button>
                              ) : (
                                <a
                                  href={proj.href}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[10px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
                                >
                                  Repository <ExternalLink className="size-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Playable Godot Game nested frame */
                      <div className="flex flex-col h-full space-y-3 min-h-[300px]">
                        <div className="flex justify-between items-center">
                          <span className="font-bold font-sans text-[11px] text-sky-700 flex items-center gap-1.5">
                            <Gamepad2 className="size-4 animate-pulse" /> RUNNING: {selectedProject.title}
                          </span>
                          <button 
                            onClick={() => setSelectedProject(null)}
                            className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-2.5 py-1 rounded font-sans transition-colors"
                          >
                            ← Back to Folder
                          </button>
                        </div>
                        <div className="flex-grow rounded-xl overflow-hidden border border-slate-200 bg-black aspect-video relative">
                          <iframe
                            title="Play Mathivity"
                            src={selectedProject.embedSrc}
                            className="absolute inset-0 w-full h-full border-none"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* 4. EXPERIENCE APP (Timeline display) */}
                {win.id === "experience" && (
                  <div className="space-y-5">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800">Experience Timeline</h3>
                      <p className="text-[11px] text-slate-500">Personal education and building trajectory</p>
                    </div>

                    <div className="relative flex flex-col gap-6 ml-3 pl-5 border-l border-sky-300/40">
                      {experience.map((exp, index) => {
                        const Icon = exp.icon;
                        return (
                          <div key={index} className="relative space-y-1">
                            {/* Bullet node */}
                            <div className="absolute -left-[29px] top-0.5 p-1 rounded-full bg-white border border-sky-300 text-sky-600 shadow-sm">
                              <Icon className="size-3.5" />
                            </div>
                            <div className="flex justify-between items-center text-[10px] font-sans">
                              <span className="font-bold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded">{exp.phase}</span>
                              <span className="text-slate-400 font-semibold">STAGE 0{index + 1}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-xs mt-1">{exp.title}</h4>
                            <p className="text-[11px] text-slate-500 leading-relaxed">{exp.desc}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 5. CONTACT APP (Form editor client) */}
                {win.id === "contact" && (
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-800">Transmit Message Inquiry</h3>
                      <p className="text-[11px] text-slate-500">Fill in the packet parameters to communicate</p>
                    </div>

                    <form onSubmit={handleContactSubmit} className="space-y-3 bg-slate-50/75 p-4 border border-slate-200/60 rounded-xl">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-semibold text-slate-500 uppercase">Sender Name</label>
                          <input
                            type="text"
                            placeholder="Fariz"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-sans font-semibold text-slate-500 uppercase">Return Address</label>
                          <input
                            type="email"
                            placeholder="mail@address.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-sans font-semibold text-slate-500 uppercase">Message Block</label>
                        <textarea
                          placeholder="Type inquiry details here..."
                          rows={3}
                          value={formData.message}
                          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                          className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[11px] text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-500 resize-none"
                          required
                        />
                      </div>
                      <button 
                        type="submit" 
                        className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-lg py-2.5 text-[11px] font-bold text-center uppercase tracking-wider shadow-sm hover:shadow-[0_0_12px_rgba(14,165,233,0.3)] transition-all"
                      >
                        {formSubmitted ? "Packet Transmitted!" : "Send Packets"}
                      </button>
                    </form>

                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                      {contactLinks.map((link, idx) => (
                        <a 
                          key={idx} 
                          href={link.href}
                          className="flex items-center gap-2 bg-slate-50/75 p-2.5 rounded-lg border border-slate-200/50 hover:border-sky-400/40 text-slate-500 hover:text-slate-800 transition-all duration-300"
                        >
                          <link.icon className="size-3.5 text-sky-600 shrink-0" />
                          <span className="font-sans truncate">{link.value}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

      </div>

      {/* OS TASKBAR / BOTTOM DOCK */}
      <footer className="w-full h-12 border-t border-slate-200/50 bg-white/60 backdrop-blur-xl flex items-center justify-between px-6 z-40 relative select-none">
        
        {/* Left corner: Start Menu Trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              synth.playBeep(920, 0.08);
              setShowStartMenu(!showStartMenu);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white/70 hover:bg-slate-50 text-sky-600 font-sans text-[11px] font-bold shadow-sm hover:shadow transition-all duration-300"
          >
            <div className="grid grid-cols-2 gap-0.5 size-3.5 shrink-0">
              <div className="bg-sky-500 rounded-sm"></div>
              <div className="bg-sky-500 rounded-sm"></div>
              <div className="bg-sky-500 rounded-sm"></div>
              <div className="bg-sky-500 rounded-sm"></div>
            </div>
            <span>Start</span>
          </button>
        </div>

        {/* Center Taskbar icons dock (Lists minimized/open apps) */}
        <div className="flex items-center gap-2 bg-slate-50/50 px-3 py-1 rounded-xl border border-slate-200/50 max-w-lg overflow-x-auto">
          {windows.map((win) => {
            const IconComp = win.icon;
            if (!win.isOpen) return null;
            return (
              <button
                key={win.id}
                onClick={() => {
                  synth.playBeep(850, 0.06);
                  if (win.isMinimized || activeWindowId !== win.id) {
                    focusWindow(win.id);
                  } else {
                    setWindows(prev => prev.map(w => w.id === win.id ? { ...w, isMinimized: true } : w));
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-[10px] font-bold uppercase transition-all duration-300 ${
                  activeWindowId === win.id
                    ? "bg-sky-100 border-sky-300 text-sky-800 font-bold shadow-sm"
                    : "bg-white/60 border-slate-200/40 text-slate-600 hover:text-slate-800 hover:bg-slate-100/80"
                }`}
              >
                <IconComp className="size-3" />
                <span className="font-sans tracking-wide">{win.id}</span>
              </button>
            );
          })}
        </div>

        {/* Right corner: Live clock display */}
        <div className="flex items-center gap-2 font-sans text-[11px] text-slate-600 font-medium">
          <Clock className="size-3.5 text-sky-600" />
          <span>{time}</span>
        </div>
      </footer>

      {/* START SYSTEM MENU POPUP */}
      <AnimatePresence>
        {showStartMenu && (
          <div
            className="absolute bottom-14 left-6 w-64 bg-white/95 border border-slate-200/60 backdrop-blur-2xl rounded-2xl p-4 shadow-xl z-50 font-sans text-xs flex flex-col space-y-4"
          >
            <div className="border-b border-slate-100 pb-2.5">
              <p className="text-[10px] text-sky-600 uppercase tracking-widest font-bold">Logged Operator</p>
              <h4 className="text-slate-800 font-bold mt-1 text-sm">Amirul Fariz</h4>
              <p className="text-[9px] text-slate-500 mt-0.5">student_dev@uitm.perak</p>
            </div>
            
            <div className="flex flex-col gap-1">
              {[
                { label: "Open About Me", id: "about", icon: User },
                { label: "Launch Skills Map", id: "skills", icon: Sparkles },
                { label: "Explore Projects", id: "projects", icon: Folder },
                { label: "View Experience", id: "experience", icon: Calendar },
                { label: "Mail Client Inquiry", id: "contact", icon: Mail },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => openWindow(item.id)}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100/60 text-[11px] text-slate-600 hover:text-slate-950 text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <item.icon className="size-3 text-sky-600" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight className="size-3 text-slate-400" />
                </button>
              ))}
            </div>

            <button
              onClick={shutdownSystem}
              className="flex items-center justify-center gap-2 w-full py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all duration-300 active:scale-95"
            >
              <Power className="size-3" />
              <span>Shut Down OS</span>
            </button>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Simple AnimatePresence fallback wrapper for React 19 / Framer Motion
function AnimatePresence({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
