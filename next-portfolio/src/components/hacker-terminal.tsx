"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { synth } from "@/lib/audio-synthesizer";
import { Terminal, Cpu, User, Sparkles, Folder, Calendar, Mail, Play, Trash2 } from "lucide-react";

interface CommandLog {
  type: "input" | "system" | "error" | "success";
  text: string;
  isHtml?: boolean;
}

const helpOutput = `
AVAILABLE INTERACTIVE COMMANDS:
===================================
[about]      - Profile bio & current status
[skills]     - Tech stack & proficiency bars
[projects]   - Interactive project catalog
[experience] - Career path timeline
[contact]    - Start terminal message wizard
[game]       - Launch playable Mathivity game
[clear]      - Reset terminal print buffers
[help]       - Display this assistance list
`;

const bannerText = `
███████  █████  ██████  ██ ███████
██      ██   ██ ██   ██ ██ ▀▀▀▀███
█████   ███████ ██████  ██   ███▀ 
██      ██   ██ ██   ██ ██  ███   
██      ██   ██ ██   ██ ██ ███████
==================================
FARIZ CORE TERMINAL SYSTEMS v3.0
==================================
Type a command or click shortcut tags.
`;

export function HackerTerminal({ onExit }: { onExit?: () => void }) {
  const [history, setHistory] = useState<CommandLog[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [booting, setBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [contactStep, setContactStep] = useState<"idle" | "name" | "email" | "message">("idle");
  const [contactData, setContactData] = useState({ name: "", email: "", message: "" });
  const [showGame, setShowGame] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of log
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [history, booting]);

  // Terminal boot script animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const bootLines: string[] = [
      "INITIALIZING CORE SYSTEM FLUIDS...",
      "LOADING MONOCHROME PHOSPHOR EMULATOR...",
      "SYNCHRONIZING AUDIO TRANSIENT OSCILLATORS... [OK]",
      "ESTABLISHING SECURE SSH TUNNEL ON PORT 8080...",
      "FETCHING REPOSITORIES FROM GITHUB/PROFFARIZ...",
      "SYSTEM CHECK: ALL PORTFOLIO MODULES LOADED SUCCESSFULLY.",
      "BOOT COMPLETED."
    ];

    let currentLineIdx = 0;

    const printNextBootLine = () => {
      if (currentLineIdx < bootLines.length) {
        synth.playBeep(600 + currentLineIdx * 80, 0.08);
        setHistory(prev => [...prev, { type: "system", text: `> ${bootLines[currentLineIdx]}` }]);
        setBootProgress(Math.floor(((currentLineIdx + 1) / bootLines.length) * 100));
        currentLineIdx++;
        timer = setTimeout(printNextBootLine, 450);
      } else {
        setTimeout(() => {
          synth.playBootHum();
          setHistory(prev => [
            ...prev,
            { type: "success", text: bannerText },
            { type: "system", text: "System ready. Enter commands in the prompt below." }
          ]);
          setBooting(false);
          // Autofocus input
          setTimeout(() => inputRef.current?.focus(), 100);
        }, 300);
      }
    };

    timer = setTimeout(printNextBootLine, 200);

    return () => clearTimeout(timer);
  }, []);

  const handleKeyPress = () => {
    // Sync synthetic keyboard click sounds
    synth.playKeyClick();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const command = inputVal.trim();
    if (!command) return;

    // Log input command
    setHistory(prev => [...prev, { type: "input", text: `$ ${command}` }]);
    setInputVal("");

    // Contact step wizard capture
    if (contactStep !== "idle") {
      handleContactStep(command);
      return;
    }

    processCommand(command.toLowerCase());
  };

  const executeShortcut = (cmd: string) => {
    if (booting) return;
    synth.playBeep(900, 0.08);
    setHistory(prev => [...prev, { type: "input", text: `$ ${cmd}` }]);
    
    if (contactStep !== "idle") {
      setContactStep("idle");
      setHistory(prev => [...prev, { type: "system", text: "Contact questionnaire canceled." }]);
    }
    
    processCommand(cmd);
  };

  // Main terminal command processor
  const processCommand = (cmd: string) => {
    const args = cmd.split(" ");
    const primaryCmd = args[0];

    switch (primaryCmd) {
      case "help":
        setHistory(prev => [...prev, { type: "system", text: helpOutput }]);
        break;

      case "clear":
        setHistory([]);
        break;

      case "about":
        setHistory(prev => [
          ...prev,
          {
            type: "success",
            text: `
+------------------------------------------------------------+
| BIO PORTRAIT DATABASE LOG                                  |
+------------------------------------------------------------+
| NAME: Amirul Fariz                                         |
| TITLE: Student Developer / UI builder                     |
| ADDRESS: Universiti Teknologi MARA (UiTM), Malaysia        |
| STATUS: Open for Internships / Freelance builds            |
+------------------------------------------------------------+
| DESCRIPTION:                                               |
| I build digital interfaces that merge strict visual layouts |
| with clear interactive animations. Focused on React,       |
| Next.js, TypeScript, and clean responsive CSS frameworks.  |
+------------------------------------------------------------+
`
          }
        ]);
        break;

      case "skills":
        setHistory(prev => [
          ...prev,
          {
            type: "success",
            text: `
CAPABILITIES RATING SYSTEM:
===========================
[01] FRONTEND CRAFT     [████████████████░░] 88%
     React.js, Next.js, TypeScript, Tailwind
[02] INTERFACE SYSTEMS  [██████████████░░░░] 80%
     Layout spacing, micro-motions, typography
[03] WORKFLOW RHYTHM    [████████████████░░] 82%
     Git workflows, prototyping, shell debugging
[04] GROWTH TRACK       [██████████░░░░░░░░] 60%
     API delivery, database hooks, server builds
`
          }
        ]);
        break;

      case "projects":
        setHistory(prev => [
          ...prev,
          {
            type: "success",
            text: `
PROJECT CATALOG REGISTERED:
===========================
1. MATHIVITY [FYP EDUCATIONAL GAME]
   - Description: A 2D maths tower defense built in Godot 4.
   - Stack: Godot 4, GDScript, WebGL, Windows Build.
   - Command: Type 'game' to play Mathivity fullscreen!
   
2. MOTOGP FANSBOT [CONVERSION SYSTEM]
   - Description: Campaign landing page practicing interface pacing.
   - URL: https://github.com/ProfFariz/Portfolio
   
3. UITM DEPARTMENTS DASHBOARD [EXPERIMENTAL WORKSPACE]
   - Description: Web portal built for testing UI layouts.
   - URL: https://github.com/ProfFariz/Portfolio
`
          }
        ]);
        break;

      case "experience":
        setHistory(prev => [
          ...prev,
          {
            type: "success",
            text: `
CAREER TIMELINE STRUCT:
=======================
[PRESENT] - Student Developer at UiTM
  Building responsive web frontends and mastering TS discipline.
  
[FOCUS]   - Motion & Layout Systems
  Creating component-driven architectures that scale cleanly.
  
[NEXT]    - Open for Internship Roles
  Ready to contribute to frontend engineering teams.
`
          }
        ]);
        break;

      case "contact":
        setContactStep("name");
        setHistory(prev => [
          ...prev,
          { type: "system", text: "INITIALIZING ENCRYPTED MAIL TUNNEL..." },
          { type: "system", text: "ENTER YOUR NAME:" }
        ]);
        break;

      case "game":
      case "play":
        synth.playBeep(1000, 0.15);
        setShowGame(true);
        setHistory(prev => [...prev, { type: "success", text: "LAUNCHING GAME SYSTEM SHELL..." }]);
        break;

      default:
        setHistory(prev => [
          ...prev,
          {
            type: "error",
            text: `COMMAND NOT FOUND: "${cmd}". Type 'help' for core commands.`
          }
        ]);
        break;
    }
  };

  // Contact form state machine
  const handleContactStep = (input: string) => {
    if (contactStep === "name") {
      setContactData(prev => ({ ...prev, name: input }));
      setContactStep("email");
      setHistory(prev => [
        ...prev,
        { type: "system", text: `NAME RECORDED: ${input}` },
        { type: "system", text: "ENTER YOUR EMAIL ADDRESS:" }
      ]);
    } else if (contactStep === "email") {
      setContactData(prev => ({ ...prev, email: input }));
      setContactStep("message");
      setHistory(prev => [
        ...prev,
        { type: "system", text: `EMAIL RECORDED: ${input}` },
        { type: "system", text: "ENTER YOUR ENCRYPTED MESSAGE:" }
      ]);
    } else if (contactStep === "message") {
      const finalMsg = input;
      setContactStep("idle");
      setHistory(prev => [
        ...prev,
        { type: "system", text: "COMPILING PACKET BLOCKS..." },
        { type: "success", text: `
=========================================
TRANSMISSION SENT SUCCESSFULLY!
-----------------------------------------
FROM:    ${contactData.name}
EMAIL:   ${contactData.email}
BODY:    ${finalMsg}
-----------------------------------------
Thank you! Fariz will react back shortly.
=========================================
` }
      ]);
      setContactData({ name: "", email: "", message: "" });
    }
  };

  return (
    <div className="w-full h-full bg-slate-950 font-mono text-emerald-400 p-6 flex flex-col relative overflow-hidden select-none border border-emerald-500/30 rounded-2xl shadow-[0_0_40px_rgba(16,185,129,0.15)]">
      {/* Phosphor glass CRT scanline overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[size:100%_5px] z-10 opacity-30" />
      <div className="pointer-events-none absolute inset-0 bg-radial-glow z-10 opacity-15" />

      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3 mb-4 text-xs">
        <div className="flex items-center gap-2">
          <Terminal className="size-4 animate-pulse text-emerald-400" />
          <span className="font-bold tracking-wider">FARIZ-CORE@WORKSPACE_SYS</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
            <Cpu className="size-3 text-emerald-400" />
            <span>SYS_OK</span>
          </div>
          {onExit && (
            <button 
              onClick={onExit}
              className="text-emerald-500 hover:text-emerald-300 font-bold border border-emerald-500/30 hover:border-emerald-400 bg-emerald-950/20 px-2.5 py-0.5 rounded transition-all duration-300"
            >
              EXIT [ESC]
            </button>
          )}
        </div>
      </div>

      {/* History scroll logs viewport */}
      <div 
        ref={containerRef}
        className="flex-grow overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-emerald-500/20 pr-2 pb-6 max-h-[calc(100%-120px)]"
      >
        {history.map((log, idx) => (
          <div 
            key={idx} 
            className={`whitespace-pre-wrap leading-relaxed break-all ${
              log.type === "input" 
                ? "text-emerald-300 font-bold" 
                : log.type === "error" 
                  ? "text-rose-500 font-bold" 
                  : log.type === "success" 
                    ? "text-emerald-400" 
                    : "text-emerald-500/80"
            }`}
          >
            {log.text}
          </div>
        ))}

        {/* Booting Loader progress bar */}
        {booting && (
          <div className="space-y-2 pt-4">
            <div className="flex justify-between text-xs">
              <span>BOOT_SYSTEM_INTEGRATION...</span>
              <span>{bootProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-900 border border-emerald-500/30 rounded overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 shadow-[0_0_10px_#10b981]" 
                style={{ width: `${bootProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Terminal input bottom shelf */}
      {!booting && (
        <div className="border-t border-emerald-500/20 pt-4 flex flex-col gap-3">
          {/* Quick command buttons links */}
          <div className="flex flex-wrap gap-2 text-xs items-center select-none">
            <span className="text-emerald-500/50 uppercase tracking-widest font-bold">Quick Links:</span>
            {[
              { label: "About", cmd: "about", icon: User },
              { label: "Skills", cmd: "skills", icon: Sparkles },
              { label: "Projects", cmd: "projects", icon: Folder },
              { label: "Experience", cmd: "experience", icon: Calendar },
              { label: "Contact", cmd: "contact", icon: Mail },
              { label: "Play Game", cmd: "game", icon: Play },
              { label: "Clear", cmd: "clear", icon: Trash2 },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => executeShortcut(btn.cmd)}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-950/20 border border-emerald-500/20 hover:border-emerald-400 text-emerald-400 hover:text-emerald-300 transition-all duration-300 active:scale-95"
              >
                <btn.icon className="size-3" />
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleCommandSubmit} className="flex gap-2 relative">
            <span className="text-emerald-300 font-bold shrink-0">
              {contactStep === "idle" ? "fariz-core:~$ " : `[CONTACT:${contactStep.toUpperCase()}] > `}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onKeyDown={handleKeyPress}
              onChange={(e) => setInputVal(e.target.value)}
              className="flex-grow bg-transparent text-emerald-300 focus:outline-none placeholder-emerald-500/20 text-sm font-mono tracking-wide"
              placeholder={contactStep === "idle" ? "Type command (e.g. 'help', 'about')..." : "Enter value..."}
              autoFocus
            />
          </form>
        </div>
      )}

      {/* FULLSCREEN GAME SHELL OVERLAY */}
      <AnimatePresence>
        {showGame && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 z-50 bg-slate-950 flex flex-col p-4 border border-emerald-500/40 rounded-2xl"
          >
            {/* Game Header */}
            <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2 mb-3">
              <span className="font-bold flex items-center gap-2">
                <Play className="size-4 animate-pulse" /> MATHIVITY SHELL SIMULATION
              </span>
              <button 
                onClick={() => {
                  synth.playBeep(700, 0.1);
                  setShowGame(false);
                }}
                className="text-xs bg-rose-950/60 border border-rose-500/30 text-rose-400 hover:text-rose-300 hover:border-rose-400 px-3 py-1 rounded-full font-bold transition-all duration-300"
              >
                TERMINATE SIMULATOR [ESC]
              </button>
            </div>

            {/* Embed Game Frame */}
            <div className="flex-grow rounded-xl overflow-hidden border border-emerald-500/30 bg-black relative shadow-[0_0_40px_rgba(16,185,129,0.1)]">
              <iframe
                title="Play Mathivity"
                src="https://itch.io/embed-upload/16436534?color=333333"
                className="absolute inset-0 w-full h-full border-none"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
