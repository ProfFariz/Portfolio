"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, VolumeX, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, ExternalLink,
  Home, User, Code, Folder, Mail,
  Gamepad2, Settings, ChevronRight,
  LineChart
} from "lucide-react";
import jackolImage from "@/assets/project_images/jackol.jpg";

// ==========================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// ==========================================
class MarioSynth {
  private ctx: AudioContext | null = null;
  private bgmAudio: HTMLAudioElement | null = null;
  public sfxMuted = false;
  public bgmMuted = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (!this.bgmAudio && typeof window !== "undefined") {
      this.bgmAudio = new Audio("/Mossy Save Point.mp3");
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = 0.25; // 25% volume for a gentle background ambiance
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
    if (this.bgmAudio && !this.bgmMuted && this.bgmAudio.paused) {
      this.bgmAudio.play().catch(() => {});
    }
  }

  playCoin() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    // B5 (988Hz) then E6 (1319Hz)
    this.playTone(988, 0.08, "square", 0.05, t);
    this.playTone(1319, 0.25, "square", 0.05, t + 0.08);
  }

  playJump() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(160, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(650, this.ctx.currentTime + 0.17);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.17);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  playStomp() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    // A low-pitched sweep to mimic squishing
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(20, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.13);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  playPowerUp() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    const notes = [330, 392, 660, 523, 587, 784]; // E4, G4, E5, C5, D5, G5
    const t = this.ctx.currentTime;
    notes.forEach((freq, idx) => {
      this.playTone(freq, 0.07, "triangle", 0.04, t + idx * 0.07);
    });
  }

  playStageClear() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    // Victory short fanfare: G4 C5 E5 G5 C6 E6 G6 E6
    const t = this.ctx.currentTime;
    const notes = [392, 523, 659, 784, 1047, 1318, 1568, 1318];
    const durs = [0.08, 0.08, 0.08, 0.08, 0.08, 0.08, 0.15, 0.3];
    let curr = t;
    notes.forEach((n, idx) => {
      this.playTone(n, durs[idx], "square", 0.05, curr);
      curr += durs[idx] + 0.02;
    });
  }

  playClick() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    // Satisfying retro 8-bit double-beep selection sound
    const t = this.ctx.currentTime;
    this.playTone(880, 0.05, "square", 0.03, t);
    this.playTone(1320, 0.05, "square", 0.02, t + 0.04);
  }

  playShrink() {
    if (this.sfxMuted) return;
    this.resume();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    this.playTone(440, 0.08, "sawtooth", 0.04, t);
    this.playTone(330, 0.08, "sawtooth", 0.04, t + 0.08);
    this.playTone(220, 0.15, "sawtooth", 0.04, t + 0.16);
  }

  private playTone(freq: number, duration: number, type: OscillatorType, volume: number, startTime: number) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);
    
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);

    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  }

  startBGM() {
    this.init();
    if (this.bgmMuted || !this.bgmAudio) return;
    this.bgmAudio.play().catch(err => {
      console.warn("Autoplay blocked or BGM failed to play:", err);
    });
  }

  stopBGM() {
    if (this.bgmAudio) {
      this.bgmAudio.pause();
    }
  }
}

const synth = new MarioSynth();

// ==========================================
// 2. PIXEL ART SPRITES (NES STYLE STRING MATRICES)
// ==========================================
const COLOR_MAP: Record<string, string> = {
  r: "#FF3333", // Mario Red
  b: "#3333FF", // Mario Blue
  p: "#FFCC99", // Peach skin
  y: "#FFD700", // Yellow (gold coin / Q block)
  o: "#FF6600", // Orange
  d: "#7A431D", // Dark brown (shoes / goomba / bricks)
  g: "#24C124", // Green
  t: "#006C00", // Dark Green shading
  k: "#000000", // Black
  w: "#FFFFFF", // White
  s: "#8A8A8A", // Grey (empty block)
  l: "#38BDF8", // Sky blue highlight
  a: "#FFAAAA", // Light pink
  n: "#DEB887", // Wood tan
  v: "#EAEAEA", // Light grey
};

const SPRITES = {
  mario: {
    idle: [
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "   vvbvvv    ",
      "  vvvbvvbvvv ",
      " vvvvbbbbvvv",
      " pp vbbybv pp",
      " pppbbbbbbppp",
      "  p bbbbbbbb ",
      "   bbb  bbb  ",
      "  www    www ",
      " wwww    wwww"
    ],
    walk1: [
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "   vvbvvv    ",
      "  vvvbbbrv   ",
      "  vvvbbbbbrv ",
      "   vbybyv pp ",
      "   bbbbbb ppp",
      "  bbbbbbbb p ",
      " wwww  bbb   ",
      "  www  www   ",
      "       wwww  "
    ],
    walk2: [
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "   vvbvvv    ",
      "   vvbbbrvv  ",
      "   vvbbbbbrv ",
      "  pp vbybyv  ",
      " ppp bbbbbb  ",
      "  p bbbbbbbb ",
      "    bbb  wwww",
      "    www   www",
      "   wwww      "
    ],
    jump: [
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "  vvvbvvv    ",
      " vvvvbbbrv   ",
      " vvvvbbbbbrv ",
      "  pp vbybyv  ",
      "   pppbbbb   ",
      "    bbbbbbbb ",
      "   bbbb  bbb ",
      "  www    www ",
      " wwww    wwww"
    ],
    squashed: [
      "             ",
      "             ",
      "             ",
      "             ",
      "             ",
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "  vvvbvvv    ",
      " vvvvbbbrv   ",
      " vvvvbbbbbrv ",
      "  pp vbybyv  "
    ],
    victory: [
      "    kkkkk    ",
      "   kkkkkkkkk ",
      "   kkkppkp   ",
      "  kppkppppp  ",
      "  kppkppkppp ",
      "  kkppkpppp  ",
      "    pppppp   ",
      "   vvbvvv    ",
      "  vvvbvvbvvv ",
      " vvvvbbbbvvv",
      " pp vbbybv pp",
      " pppbbbbbbppp",
      "  p bbbbbbbb ",
      "   bbb  bbb  ",
      "  www    www ",
      " wwww    wwww"
    ]
  },
  goomba: {
    walk1: [
      "    g      g    ",
      "     g    g     ",
      "   gggggggggg   ",
      "  gggdkgggdkggg ",
      " gggggggggggggg ",
      " g gggggggggg g ",
      " g  g      g  g ",
      "    gg    gg    "
    ],
    walk2: [
      "    g      g    ",
      "   g g    g g   ",
      "   gggggggggg   ",
      "  gggdkgggdkggg ",
      " gggggggggggggg ",
      "  gggggggggggg  ",
      "   gg    gg     ",
      "  g        g    "
    ],
    squashed: [
      "  g   g   g   g ",
      "   g  g   g  g  ",
      "    g g g g     ",
      "  g g     g g   ",
      "    g g g g     ",
      "   g  g   g  g  ",
      "  g   g   g   g "
    ]
  },
  brick: [
    "dddddddddddddddd",
    "drrrrrrrrrrrrrrd",
    "drrrrrrrrrrrrrrd",
    "dddddddddddddddd",
    "drrrrrrd drrrrrd",
    "drrrrrrd drrrrrd",
    "dddddddd ddddddd",
    "drrrrrrrrrrrrrrd",
    "drrrrrrrrrrrrrrd",
    "dddddddddddddddd",
    "drrrrrrd drrrrrd",
    "drrrrrrd drrrrrd",
    "dddddddd ddddddd",
    "drrrrrrrrrrrrrrd",
    "drrrrrrrrrrrrrrd",
    "dddddddddddddddd"
  ],
  question: [
    "yyyyyyyyyyyyyyyy",
    "yooooooooooooooy",
    "yoowwwwwwwwooooy",
    "yowwkooookkwoooy",
    "yowwkooookkwoooy",
    "yookooookkwooooy",
    "yooooookkwoooooo",
    "yoooookkwooooooo",
    "yoooookkwooooooo",
    "yoooooookooooooo",
    "yoooooookooooooo",
    "yoooookkwooooooo",
    "yoooookkwooooooo",
    "yoowwkooookkwooy",
    "yooooooooooooooy",
    "yyyyyyyyyyyyyyyy"
  ],
  empty: [
    "ssssssssssssssss",
    "skkkkkkkkkkkkkks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skssssssssssssks",
    "skkkkkkkkkkkkkks",
    "ssssssssssssssss"
  ],
  coin: [
    "  yyyy  ",
    " yyyyyy ",
    "yyyoyyyy",
    "yyyoyyyy",
    "yyyoyyyy",
    "yyyoyyyy",
    " yyyyyy ",
    "  yyyy  "
  ],
  cloud: [
    "      ssssss      ",
    "    ssssssssss    ",
    "  ssssssssssssss  ",
    "ssssssssssssssssss",
    "ssssssssssssssssss",
    "ssssssssssssssssss",
    "  ssssssssssssss  "
  ],
  hill: [
    "      tttt      ",
    "    tttttttt    ",
    "   tttttttttt   ",
    "  tttttttttttt  ",
    " tttttttttttttt ",
    "tttttttttttttttt",
    "tttttttttttttttt"
  ],
  moon: [
    "   yyyyy  ",
    "  yyyyyy  ",
    " yyyyy    ",
    "yyyy      ",
    "yyyy      ",
    " yyyyy    ",
    "  yyyyyy  ",
    "   yyyyy  "
  ]
};

function drawPixelSprite(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  sprite: string[],
  scale: number = 2,
  flipX: boolean = false
) {
  const height = sprite.length;
  if (height === 0) return;
  const width = sprite[0].length;

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const char = sprite[r][c];
      if (char !== " " && COLOR_MAP[char]) {
        ctx.fillStyle = COLOR_MAP[char];
        const px = flipX ? x + (width - 1 - c) * scale : x + c * scale;
        const py = y + r * scale;
        ctx.fillRect(Math.floor(px), Math.floor(py), scale, scale);
      }
    }
  }
}

// ==========================================
// 3. DATA CONFIGURATION
// ==========================================
const PROFILE_DATA = {
  name: "Amirul Fariz",
  nickname: "Jackal",
  title: "Computer Science Student & Frontend Developer",
  bio: "A passionate student developer studying at Universiti Teknologi MARA (UiTM), focused on building interactive, highly animated, and user-centric web applications. Specializes in custom UI frameworks, pixel precision, and micro-interactions.",
  location: "Malaysia",
  email: "amirulfariz901@gmail.com",
  phone: "017-556-4825",
  github: "https://github.com/ProfFariz",
  favoriteFood: "Nasi Impit with Kuah Kacang 🍢"
};

const EDUCATION_DATA = {
  school: "Universiti Teknologi MARA (UiTM)",
  status: "Active Student",
  focus: "Computer Science / Software Engineering focus",
  description: "Studying core algorithms, system design, software development lifecycles, and interface systems. Actively prototyping dynamic web designs during academic career."
};

const SKILLS_DATA = [
  { name: "Frontend Craft", desc: "React, Next.js, TypeScript, Tailwind", rating: 90, item: "Super Mushroom 🍄" },
  { name: "Interface Systems", desc: "Layout hierarchy, micro-animations, typography", rating: 82, item: "Fire Flower 🔥" },
  { name: "Workflow Rhythm", desc: "Git iteration, shell debugging, prototyping", rating: 85, item: "Super Star ⭐" },
  { name: "Growth Track", desc: "API integration, database bindings, server code", rating: 60, item: "1-Up Mushroom 🟢" }
];

const EXPERIENCE_DATA = [
  { role: "Student Developer", company: "UiTM", period: "Present", desc: "Building core software development principles while designing custom web tools, UI kits, and experimental websites." },
  { role: "UI/UX & Layout Experimentation", company: "Personal Sandbox", period: "2024 - 2025", desc: "Analyzing conversion paths, CTA layouts, and responsive CSS boundaries. Porting complex mockups into React codebases." },
  { role: "Next Step", company: "Industry Internship", period: "Upcoming", desc: "Open to joining fast-paced software teams to work on real-world web applications and collaborative products." }
];

const PROJECTS_DATA = [
  {
    id: "mathivity",
    title: "Mathivity TD",
    desc: "An educational 2D mathematical tower defense game built in Godot 4. Students tackle percentage, fraction, and ratio questions in active gameplay to reduce mathematical anxiety.",
    stack: ["Godot 4", "GDScript", "WebGL", "Windows Export"],
    href: "https://amirulgodot.itch.io/mathivity",
    badge: "Final Year Project"
  },
  {
    id: "motogp",
    title: "MotoGP FanBot",
    desc: "A responsive landing page built to test and practice layout conversion flow, CTA pacing, and clean structure.",
    stack: ["HTML", "CSS", "UI Design"],
    href: "https://github.com/ProfFariz/Portfolio",
    badge: "Landing Page"
  },
  {
    id: "dashboard",
    title: "UiTM Departments Portal",
    desc: "An experimental admin department dashboard mockup built for validating layouts, widgets, and charts.",
    stack: ["JavaScript", "HTML/CSS", "Charts"],
    href: "https://github.com/ProfFariz/Portfolio",
    badge: "Mockup App"
  }
];

// ==========================================
// 3.5. CUSTOM ANIMATED SVG HUD ICONS
// ==========================================
function AnimatedProfileIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#ef4444";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <rect x="12" y="6" width="8" height="8" stroke={color} strokeWidth="2" />
      <rect x="14" y="14" width="4" height="2" stroke={color} strokeWidth="2" />
      <path d="M 6,24 L 6,18 L 26,18 L 26,24" stroke={color} strokeWidth="2" />
    </motion.svg>
  );
}

function AnimatedEducationIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#60a5fa";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <rect x="8" y="12" width="16" height="12" stroke={color} strokeWidth="2" />
      <path d="M 12,12 L 12,8 L 20,8 L 20,12" stroke={color} strokeWidth="2" />
      <rect x="11" y="20" width="2" height="4" fill={color} stroke="none" />
      <rect x="19" y="20" width="2" height="4" fill={color} stroke="none" />
    </motion.svg>
  );
}

function AnimatedProjectsIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#facc15";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <path d="M 4,8 L 12,8 L 15,12 L 28,12 L 28,26 L 4,26 Z" stroke={color} strokeWidth="2" />
      <line x1="8" y1="16" x2="24" y2="16" stroke={color} strokeWidth="2" />
      <line x1="8" y1="20" x2="20" y2="20" stroke={color} strokeWidth="2" />
    </motion.svg>
  );
}

function AnimatedExperienceIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#34d399";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <rect x="4" y="6" width="24" height="20" stroke={color} strokeWidth="2" />
      <line x1="4" y1="12" x2="28" y2="12" stroke={color} strokeWidth="2" />
      <path d="M 8,16 L 12,19 L 8,22" stroke={color} strokeWidth="2" />
      <line x1="14" y1="22" x2="19" y2="22" stroke={color} strokeWidth="2" />
    </motion.svg>
  );
}

function AnimatedSkillsIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#c084fc";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <rect x="8" y="14" width="16" height="4" stroke={color} strokeWidth="2" />
      <rect x="4" y="8" width="4" height="16" stroke={color} strokeWidth="2" />
      <rect x="24" y="8" width="4" height="16" stroke={color} strokeWidth="2" />
    </motion.svg>
  );
}

function AnimatedContactIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#f472b6";
  return (
    <motion.svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      className="fill-none stroke-current"
      animate={isHovered ? { y: [0, -3, 0] } : {}}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <rect x="4" y="8" width="24" height="16" stroke={color} strokeWidth="2" />
      <path d="M 4,8 L 16,16 L 28,8" stroke={color} strokeWidth="2" />
    </motion.svg>
  );
}

interface MenuCardProps {
  title: string;
  hexColor: string;
  isActive: boolean;
  onClick: () => void;
  renderIcon: (isHovered: boolean, hexColor: string) => React.ReactNode;
}

function MenuCard({
  title,
  hexColor,
  isActive,
  onClick,
  renderIcon
}: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [scanIdx, setScanIdx] = useState(0);

  useEffect(() => {
    // 8 segments + 4 steps pause = 12 total steps in one animation sweep cycle
    const interval = setInterval(() => {
      setScanIdx(prev => (prev + 1) % 12);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  const key = title.toLowerCase();
  const headerText = key === "profile" ? "ABOUT ME" : title.toUpperCase();

  const descMap: Record<string, string> = {
    profile: "Get to know me",
    education: "My academic path",
    projects: "Things I've built",
    experience: "Where I've worked",
    skills: "What I'm good at",
    contact: "Let's connect",
  };

  const segmentMap: Record<string, number> = {
    profile: 3,      // 3/8 segments filled
    education: 2,    // 2/8 segments filled
    projects: 5,     // 5/8 segments filled
    experience: 4,   // 4/8 segments filled
    skills: 6,       // 6/8 segments filled
    contact: 2,      // 2/8 segments filled
  };

  const desc = descMap[key] || "";
  const filledSegments = segmentMap[key] || 2;

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex flex-col aspect-square cursor-pointer transition-all duration-300 border-[6px] border-[#16171d] rounded-xl overflow-hidden font-retro"
      style={{
        boxShadow: isHovered || isActive
          ? `0 0 24px ${hexColor}80`
          : `0 0 8px rgba(0,0,0,0.5)`,
      }}
    >
      {/* Inner Glowing and Grid Panel */}
      <div 
        className="flex-1 flex flex-col justify-between p-3 bg-[#08090d] border"
        style={{
          borderColor: isHovered || isActive ? hexColor : `${hexColor}40`,
          boxShadow: isHovered || isActive
            ? `0 0 12px ${hexColor}50, inset 0 0 8px ${hexColor}25`
            : `inset 0 0 6px ${hexColor}10`,
          backgroundImage: `
            linear-gradient(${hexColor}0f 1px, transparent 1px),
            linear-gradient(to right, ${hexColor}0f 1px, transparent 1px)
          `,
          backgroundSize: "12px 12px",
        }}
      >
        {/* Top Capsule Status Bar */}
        <div 
          className="w-[85%] mx-auto h-[10px] border flex items-center justify-between rounded-full overflow-hidden p-[1.5px] mb-2"
          style={{ borderColor: `${hexColor}40` }}
        >
          {Array.from({ length: 5 }).map((_, idx) => (
            <div 
              key={idx}
              className="h-full flex-1 border-r last:border-r-0"
              style={{ 
                borderColor: `${hexColor}20`,
                backgroundColor: "transparent"
              }}
            />
          ))}
        </div>

        {/* Icon Box */}
        <div className="flex-1 flex flex-col items-center justify-center text-center py-1">
          <div className="mb-2 flex items-center justify-center scale-90 sm:scale-100">
            {renderIcon(isHovered, hexColor)}
          </div>

          {/* Heading */}
          <div 
            className="text-xs sm:text-[13px] font-retro font-bold uppercase tracking-wider mb-1"
            style={{ 
              color: "white", 
              textShadow: `0 0 8px ${hexColor}70` 
            }}
          >
            {headerText}
          </div>

          {/* Description */}
          <div className="text-[8px] sm:text-[9px] text-slate-400 font-retro tracking-normal leading-normal text-center max-w-[90%]">
            {desc}
          </div>
        </div>

        {/* 8-Segmented Status Progress Blocks with sweep animation */}
        <div className="mt-2 flex justify-between gap-[3px] items-center px-0.5">
          {Array.from({ length: 8 }).map((_, idx) => {
            const isFilled = idx < filledSegments;
            const isScanning = idx === scanIdx;

            let bgStyle = "transparent";
            let borderStyle = `1.5px solid ${hexColor}33`;
            let shadowStyle = "none";

            if (isFilled) {
              if (isScanning) {
                // Bright scan highlight on filled segment
                bgStyle = "#ffffff";
                borderStyle = `1.5px solid #ffffff`;
                shadowStyle = `0 0 14px #ffffff, 0 0 8px ${hexColor}`;
              } else {
                // Normal filled segment
                bgStyle = hexColor;
                borderStyle = `1.5px solid ${hexColor}`;
                shadowStyle = `0 0 8px ${hexColor}b0, inset 0 0 2px ${hexColor}`;
              }
            } else {
              if (isScanning) {
                // Faint sweep trace on unfilled segment
                bgStyle = `${hexColor}aa`;
                borderStyle = `1.5px solid ${hexColor}`;
                shadowStyle = `0 0 8px ${hexColor}b0`;
              }
            }

            return (
              <div
                key={idx}
                className="h-[6px] flex-1 rounded-[1px] transition-all duration-100"
                style={{
                  backgroundColor: bgStyle,
                  border: borderStyle,
                  boxShadow: shadowStyle,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export function MarioPortfolio() {
  const [phase, setPhase] = useState<"start" | "loading" | "dashboard" | "minigame">("start");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [transitionState, setTransitionState] = useState<{
    isActive: boolean;
    targetSection: string | null;
    phase: "idle" | "closing" | "opening";
  }>({
    isActive: false,
    targetSection: null,
    phase: "idle",
  });

  const navigateToSection = useCallback((section: string | null) => {
    if (transitionState.isActive) return;
    if (section === null) {
      synth.playShrink();
    } else {
      synth.playClick();
    }
    setTransitionState({
      isActive: true,
      targetSection: section,
      phase: "closing"
    });
    
    setTimeout(() => {
      setActiveSection(section);
      setTransitionState(prev => ({
        ...prev,
        phase: "opening"
      }));
      if (section === null) {
        synth.playPowerUp();
      } else {
        synth.playCoin();
      }
      
      setTimeout(() => {
        setTransitionState({
          isActive: false,
          targetSection: null,
          phase: "idle"
        });
      }, 450);
    }, 450);
  }, [transitionState.isActive]);

  const navigateToPhase = useCallback((newPhase: "start" | "loading" | "dashboard" | "minigame") => {
    if (transitionState.isActive) return;
    synth.playClick();
    setTransitionState({
      isActive: true,
      targetSection: null,
      phase: "closing"
    });
    
    setTimeout(() => {
      setPhase(newPhase);
      setTransitionState(prev => ({
        ...prev,
        phase: "opening"
      }));
      synth.playPowerUp();
      
      setTimeout(() => {
        setTransitionState({
          isActive: false,
          targetSection: null,
          phase: "idle"
        });
      }, 450);
    }, 450);
  }, [transitionState.isActive]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("WORLD 1-1");
  const [bgmMuted, setBgmMuted] = useState(true);
  const [sfxMuted] = useState(false);

  // Form states for Contact peach letter
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, fieldName: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      synth.playCoin();
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000);
    }
  };

  // Virtual Gameboy keys active states
  const [keys, setKeys] = useState({ left: false, right: false, up: false, down: false });

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const starsRef = useRef<{x: number, y: number, size: number, speed: number, alpha: number}[]>([]);

  // Core stats for UI
  const [coinsCollected, setCoinsCollected] = useState(0);
  const [score, setScore] = useState(0);

  // ==========================================
  // LOADING TIMER
  // ==========================================
  useEffect(() => {
    if (phase === "loading") {
      const logs = [
        "SPAWNING GOOMBAS...",
        "PLANTING GREEN PIPES...",
        "PLACING BRICK BLOCKS...",
        "POLISHING COINS...",
        "FEEDING YOSHI...",
        "PREPARING PORTFOLIO WORLD..."
      ];
      let progress = 0;
      const interval = setInterval(() => {
        progress += 4;
        setLoadingProgress(Math.min(progress, 100));

        // Update log text based on progress
        const logIndex = Math.floor((progress / 100) * logs.length);
        if (logIndex < logs.length) {
          setLoadingText(logs[logIndex]);
        }

        if (progress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setPhase("dashboard");
            synth.playPowerUp();
          }, 400);
        }
      }, 80);

      return () => clearInterval(interval);
    }
  }, [phase]);

  // Audio syncer between state and synth class
  useEffect(() => {
    synth.bgmMuted = bgmMuted;
    if (bgmMuted) {
      synth.stopBGM();
    } else {
      synth.startBGM();
    }
  }, [bgmMuted]);

  useEffect(() => {
    synth.sfxMuted = sfxMuted;
  }, [sfxMuted]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      synth.stopBGM();
    };
  }, []);

  const handleStartGame = () => {
    synth.resume();
    navigateToPhase("loading");
    // Attempt BGM start after short interaction delay
    setTimeout(() => {
      setBgmMuted(false);
      synth.startBGM();
    }, 1000);
  };

  const openSection = useCallback((section: string) => {
    navigateToSection(section);
  }, [navigateToSection]);

  const closeSection = useCallback(() => {
    navigateToSection(null);
  }, [navigateToSection]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    synth.playStageClear();
    setFormSubmitted(true);
    setContactForm({ name: "", email: "", message: "" });
  };

  const handleResetGame = () => {
    synth.playPowerUp();
    setCoinsCollected(0);
    setScore(0);
    if (phase === "minigame") {
      // Re-trigger minigame reset
      setPhase("dashboard");
      setTimeout(() => setPhase("minigame"), 100);
    }
  };

  // ==========================================
  // 5. 2D PLATFORMER CANVAS ENGINE
  // ==========================================
  const startPlatformer = () => {
    navigateToPhase("minigame");
  };

  useEffect(() => {
    if (phase !== "minigame" || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fixed internal size for perfect pixel layouts
    canvas.width = 800;
    canvas.height = 450;

    // Game Variables
    let gameActive = true;
    let cameraX = 0;
    const levelWidth = 2400;

    // Generate twinkling night stars if not already done
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 80 }, () => ({
        x: Math.random() * levelWidth,
        y: Math.random() * 220,
        size: Math.random() * 1.8 + 0.8,
        speed: 0.01 + Math.random() * 0.03,
        alpha: Math.random()
      }));
    }

    // Player state
    const player = {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      width: 45,
      height: 56,
      grounded: false,
      facing: "right" as "left" | "right",
      animFrame: 0,
      animTimer: 0,
      isBlinking: false,
      blinkTimer: 0,
      victoryWalk: false,
      victoryWalkX: 0
    };

    // Keyboard handlers
    const keyMap = {
      ArrowLeft: false,
      ArrowRight: false,
      ArrowUp: false,
      ArrowDown: false,
      KeyA: false,
      KeyD: false,
      KeyW: false,
      KeyS: false,
      Space: false
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Space"].includes(e.code)) {
        e.preventDefault();
      }
      if (e.code in keyMap) {
        keyMap[e.code as keyof typeof keyMap] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code in keyMap) {
        keyMap[e.code as keyof typeof keyMap] = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // Map elements
    // Ground level: y = 380 (so player sits at 380 - height = 348)
    const groundY = 384;

    // 16x16 pixels scaled by 2 = 32x32 size
    const tileSize = 32;

    // Bricks and Questions
    interface MapBlock {
      x: number;
      y: number;
      type: "brick" | "question" | "empty";
      content?: string; // Floating text spawned when hit
      hit: boolean;
      bounceY: number;
    }

    const blocks: MapBlock[] = [
      // Block group 1
      { x: 250, y: groundY - 120, type: "question", content: "React ⚛️", hit: false, bounceY: 0 },
      { x: 282, y: groundY - 120, type: "brick", hit: false, bounceY: 0 },
      { x: 314, y: groundY - 120, type: "question", content: "TypeScript 📘", hit: false, bounceY: 0 },
      { x: 346, y: groundY - 120, type: "brick", hit: false, bounceY: 0 },
      { x: 378, y: groundY - 120, type: "question", content: "Next.js 🚀", hit: false, bounceY: 0 },
      
      // Block group 2 (higher)
      { x: 550, y: groundY - 180, type: "question", content: "Tailwind 🎨", hit: false, bounceY: 0 },
      { x: 582, y: groundY - 180, type: "question", content: "Framer Motion ✨", hit: false, bounceY: 0 },

      // Block group 3
      { x: 850, y: groundY - 120, type: "brick", hit: false, bounceY: 0 },
      { x: 882, y: groundY - 120, type: "question", content: "UX Design 📐", hit: false, bounceY: 0 },
      { x: 914, y: groundY - 120, type: "brick", hit: false, bounceY: 0 },

      // Block group 4 (skills blocks)
      { x: 1350, y: groundY - 120, type: "question", content: "Git 🔧", hit: false, bounceY: 0 },
      { x: 1382, y: groundY - 120, type: "question", content: "Godot 🎮", hit: false, bounceY: 0 },
      { x: 1414, y: groundY - 120, type: "question", content: "Node.js 🟢", hit: false, bounceY: 0 },
    ];

    // Pipes (Portals)
    interface MapPipe {
      x: number;
      y: number;
      width: 60;
      height: 70;
      targetSection: string;
      label: string;
    }

    const pipes: MapPipe[] = [
      { x: 450, y: groundY - 70, width: 60, height: 70, targetSection: "profile", label: "PROFILE" },
      { x: 750, y: groundY - 70, width: 60, height: 70, targetSection: "education", label: "EDUCATION" },
      { x: 1050, y: groundY - 70, width: 60, height: 70, targetSection: "experience", label: "EXPERIENCE" },
      { x: 1550, y: groundY - 70, width: 60, height: 70, targetSection: "skills", label: "SKILLS" },
      { x: 1850, y: groundY - 70, width: 60, height: 70, targetSection: "contact", label: "CONTACT" }
    ];

    // Goombas
    interface Enemy {
      x: number;
      y: number;
      vx: number;
      width: 32;
      height: 32;
      isSquashed: boolean;
      squashTimer: number;
    }

    const enemies: Enemy[] = [
      { x: 300, y: 110, vx: 1.0, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 500, y: 110, vx: -1.0, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 700, y: 110, vx: 1.2, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1000, y: 140, vx: -0.8, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1200, y: 140, vx: 1.0, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1400, y: 110, vx: -1.2, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1700, y: 130, vx: 1.1, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1900, y: 130, vx: -1.0, width: 32, height: 32, isSquashed: false, squashTimer: 0 }
    ];

    let lasers: { x: number; y: number; active: boolean }[] = [];
    let enemyBullets: { x: number; y: number; active: boolean }[] = [];
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      color: string;
      alpha: number;
      size: number;
    }
    const particles: Particle[] = [];
    let shakeAmt = 0;
    let fireCooldown = 0;

    // Flying texts spawned when block is hit
    interface FloatingText {
      x: number;
      y: number;
      text: string;
      vy: number;
      alpha: number;
    }
    const floatingTexts: FloatingText[] = [];

    // Flagpole y position
    const flagPoleX = 2150;
    const flagYStart = groundY - 240;
    const flagY = flagYStart;
    let flagHit = false;

    // Game loop
    const update = () => {
      if (!gameActive) return;

      // HITTING THE FLAGPOLE WALK LOGIC
      if (player.victoryWalk) {
        player.animTimer++;
        if (player.animTimer > 8) {
          player.animFrame = player.animFrame === 1 ? 2 : 1;
          player.animTimer = 0;
        }

        if (player.y < groundY - player.height) {
          player.y += 2; // Slide down pole
        } else {
          // Walk to the castle
          player.x += 1.5;
          if (player.x >= flagPoleX + 80) {
            gameActive = false;
            synth.playStageClear();
            openSection("clear");
          }
        }

        // Camera follow
        cameraX = Math.max(0, Math.min(levelWidth - canvas.width, player.x - 200));
        return;
      }

      const goLeft = keyMap.ArrowLeft || keyMap.KeyA || keys.left;
      const goRight = keyMap.ArrowRight || keyMap.KeyD || keys.right;
      const enterPipe = keyMap.ArrowDown || keyMap.KeyS || keys.down;

      if (goLeft) {
        player.vx = -4.5;
        player.facing = "left";
      } else if (goRight) {
        player.vx = 4.5;
        player.facing = "right";
      } else {
        player.vx = 0;
      }

      // Movement bounds clamping
      player.x += player.vx;
      if (player.x < 0) player.x = 0;
      if (player.x > levelWidth - player.width) player.x = levelWidth - player.width;

      player.grounded = true; // Stay grounded for animations

      // Animation calculations
      if (player.vx !== 0) {
        player.animTimer++;
        if (player.animTimer > 6) {
          player.animFrame = player.animFrame === 1 ? 2 : 1;
          player.animTimer = 0;
        }
      } else {
        player.animFrame = 0; // standing
      }

      // Blinking timer for hit invincibility
      if (player.isBlinking) {
        player.blinkTimer -= 16;
        if (player.blinkTimer <= 0) {
          player.isBlinking = false;
        }
      }

      // Fire Lasers: triggered by Space, UP D-pad, UP Arrow, Key W
      if (fireCooldown > 0) fireCooldown -= 16;
      const wantsToFire = keyMap.Space || keys.up || keyMap.ArrowUp || keyMap.KeyW;
      if (wantsToFire && fireCooldown <= 0) {
        // Fire dual lasers from both left and right sides of the player
        lasers.push({
          x: player.x + 8,
          y: player.y + 4,
          active: true
        });
        lasers.push({
          x: player.x + player.width - 12,
          y: player.y + 4,
          active: true
        });
        fireCooldown = 260; // Faster cooldown for fire rate satisfaction
        shakeAmt = 2.0; // Small kickback shake on fire!
        synth.playCoin(); // laser fire sound
      }

      // Update Player Lasers
      lasers.forEach(laser => {
        laser.y -= 7.5; // speed upward
        if (laser.y < 0) {
          laser.active = false;
          return;
        }

        // Hit invaders
        enemies.forEach(enemy => {
          if (enemy.isSquashed) return;

          if (
            laser.x > enemy.x &&
            laser.x < enemy.x + enemy.width &&
            laser.y > enemy.y &&
            laser.y < enemy.y + enemy.height
          ) {
            laser.active = false;
            enemy.isSquashed = true;
            enemy.squashTimer = 0;
            synth.playStomp(); // stomp hit sound
            setScore(s => s + 200);
            shakeAmt = 6.0; // screen shake on hit!

            // Spawn green explosion particles
            for (let i = 0; i < 12; i++) {
              particles.push({
                x: enemy.x + enemy.width / 2,
                y: enemy.y + enemy.height / 2,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: "#24C124",
                alpha: 1.0,
                size: Math.random() * 3 + 2
              });
            }

            floatingTexts.push({
              x: enemy.x,
              y: enemy.y - 10,
              text: "+200",
              vy: -1.5,
              alpha: 1.0
            });
          }
        });

        // Hit blocks from below
        blocks.forEach(b => {
          const size = tileSize;
          if (
            laser.x > b.x &&
            laser.x < b.x + size &&
            laser.y > b.y &&
            laser.y < b.y + size
          ) {
            laser.active = false;
            if (!b.hit) {
              b.bounceY = 8;
              b.hit = true;
              if (b.type === "question") {
                b.type = "empty";
                synth.playCoin();
                setCoinsCollected(c => c + 1);
                setScore(s => s + 100);
                if (b.content) {
                  floatingTexts.push({
                    x: b.x - 10,
                    y: b.y - 15,
                    text: b.content,
                    vy: -2,
                    alpha: 1.0
                  });
                }
              } else {
                synth.playStomp();
              }
            }
          }
        });
      });
      lasers = lasers.filter(l => l.active);

      // Invaders pacing and shooting back
      enemies.forEach(enemy => {
        if (enemy.isSquashed) {
          enemy.squashTimer += 16;
          return;
        }

        // Pace back and forth
        enemy.x += enemy.vx;
        if (enemy.x < 50 || enemy.x > levelWidth - 50) {
          enemy.vx *= -1;
        }

        // Alien shooting back
        if (Math.random() < 0.005) {
          enemyBullets.push({
            x: enemy.x + enemy.width / 2,
            y: enemy.y + enemy.height,
            active: true
          });
        }
      });

      // Update Enemy Plasma Bullets
      enemyBullets.forEach(bullet => {
        bullet.y += 4.0; // speed downward
        if (bullet.y > canvas.height) {
          bullet.active = false;
          return;
        }

        // Collision with player
        if (
          bullet.x > player.x &&
          bullet.x < player.x + player.width &&
          bullet.y > player.y &&
          bullet.y < player.y + player.height
        ) {
          bullet.active = false;
          if (!player.isBlinking) {
            synth.playShrink();
            player.isBlinking = true;
            player.blinkTimer = 1200; // 1.2s invincibility
            setScore(s => Math.max(0, s - 50)); // penalty
            shakeAmt = 12.0; // BIG screen shake on hit!
          }
        }
      });
      enemyBullets = enemyBullets.filter(b => b.active);

      // Block Bounce animations
      blocks.forEach(b => {
        if (b.bounceY > 0) {
          b.bounceY -= 1;
        }
      });

      // PIPE PORTAL TRIGGER (WARP TO SECTIONS)
      pipes.forEach(pipe => {
        if (
          player.x + player.width / 2 > pipe.x &&
          player.x + player.width / 2 < pipe.x + pipe.width
        ) {
          // Standing under portal and pressing down
          if (enterPipe) {
            synth.playShrink();
            player.vx = 0;
            player.vy = 0;
            setTimeout(() => {
              openSection(pipe.targetSection);
            }, 300);
          }
        }
      });

      // FLAGPOLE END-OF-STAGE COLLISION (Optional, walk to end stage)
      if (!flagHit && player.x >= flagPoleX) {
        flagHit = true;
        player.vx = 0;
        player.vy = 0;
        player.x = flagPoleX;
        player.victoryWalk = true;
        synth.playStageClear();
      }

      // Update flying texts
      floatingTexts.forEach((ft, idx) => {
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) {
          floatingTexts.splice(idx, 1);
        }
      });

      // Update particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02; // fade out
        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });

      // Camera follow
      cameraX = Math.max(0, Math.min(levelWidth - canvas.width, player.x - canvas.width / 2 + player.width / 2));
    };

    const draw = () => {
      if (!ctx) return;

      ctx.save();
      // Apply screen shake
      if (shakeAmt > 0) {
        const dx = (Math.random() - 0.5) * shakeAmt;
        const dy = (Math.random() - 0.5) * shakeAmt;
        ctx.translate(dx, dy);
      }

      // 1. Draw Night Sky Gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      skyGrad.addColorStop(0, "#02040a"); // Midnight black
      skyGrad.addColorStop(0.7, "#091021"); // Deep blue-violet
      skyGrad.addColorStop(1, "#111b33"); // Moonlit blue
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Twinkling & Scrolling Stars (Simulating space travel)
      starsRef.current.forEach(star => {
        star.y += star.speed * 6; // Move stars downward
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * levelWidth;
        }

        star.alpha += star.speed;
        const starOpacity = 0.2 + Math.abs(Math.sin(star.alpha)) * 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${starOpacity})`;
        ctx.fillRect(Math.floor(star.x - cameraX * 0.9), Math.floor(star.y), Math.floor(star.size), Math.floor(star.size));
      });

      // Draw Crescent Moon (Parallax)
      drawPixelSprite(ctx, 600 - cameraX * 0.2, 35, SPRITES.moon, 3.5);

      // 2. Draw Clouds (Static / Parallax)
      const cloudPositions = [
        { x: 100, y: 50 }, { x: 500, y: 70 }, { x: 900, y: 40 },
        { x: 1300, y: 60 }, { x: 1700, y: 50 }, { x: 2100, y: 80 }
      ];
      cloudPositions.forEach(cloud => {
        drawPixelSprite(ctx, cloud.x - cameraX * 0.3, cloud.y, SPRITES.cloud, 2.5);
      });

      // 3. Draw Parallax Hills
      const hillPositions = [
        { x: 50, y: groundY - 28 }, { x: 600, y: groundY - 28 },
        { x: 1200, y: groundY - 28 }, { x: 1800, y: groundY - 28 }
      ];
      hillPositions.forEach(hill => {
        drawPixelSprite(ctx, hill.x - cameraX * 0.5, hill.y, SPRITES.hill, 4.0);
      });

      // 4. Draw Ground Blocks (Futuristic Neon Grid Highway!)
      ctx.fillStyle = "#0c0e17"; // Ultra dark space runway
      ctx.fillRect(0 - cameraX, groundY, levelWidth, canvas.height - groundY);
      
      // Draw glowing blue horizontal horizon line
      ctx.fillStyle = "#00ffcc"; // Neon cyan horizon top
      ctx.fillRect(0 - cameraX, groundY, levelWidth, 3);
      
      // Perspective grid lines
      ctx.strokeStyle = "rgba(0, 255, 204, 0.18)";
      ctx.lineWidth = 1.5;
      
      // Horizontal grid lines
      const linesCount = 8;
      for (let i = 0; i < linesCount; i++) {
        const ly = groundY + (i / linesCount) * (canvas.height - groundY);
        ctx.beginPath();
        ctx.moveTo(0 - cameraX, ly);
        ctx.lineTo(levelWidth - cameraX, ly);
        ctx.stroke();
      }

      // Vertical perspective lines
      for (let gx = -100; gx < levelWidth + 200; gx += 50) {
        ctx.beginPath();
        ctx.moveTo(gx - cameraX, groundY);
        ctx.lineTo(gx - cameraX - 100, canvas.height); // perspective slant
        ctx.stroke();
      }

      // 5. Draw Blocks (Space Stations/Asteroids)
      blocks.forEach(b => {
        const sprite = SPRITES[b.type as "brick" | "question" | "empty"] || SPRITES.brick;
        drawPixelSprite(ctx, b.x - cameraX, b.y - b.bounceY, sprite, 2.0);
      });

      // Draw Player Lasers
      ctx.fillStyle = "#ff007f";
      lasers.forEach(laser => {
        ctx.fillRect(laser.x - cameraX, laser.y, 4, 12);
      });

      // Draw Enemy Plasma Bullets
      ctx.fillStyle = "#00ffcc";
      enemyBullets.forEach(bullet => {
        ctx.beginPath();
        ctx.arc(bullet.x - cameraX, bullet.y, 3.5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw Explosion Particles
      particles.forEach(p => {
        ctx.fillStyle = `rgba(36, 193, 36, ${p.alpha})`; // green matching color
        ctx.fillRect(p.x - cameraX, p.y, p.size, p.size);
      });

      // 6. Draw Space Portals
      pipes.forEach(pipe => {
        // Draw label text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '8px "Press Start 2P", Courier, monospace';
        ctx.textAlign = "center";
        ctx.fillText(pipe.label, pipe.x + pipe.width / 2 - cameraX, pipe.y - 15);
        ctx.fillStyle = "#00ffcc";
        ctx.fillText("[ WARP ]", pipe.x + pipe.width / 2 - cameraX, pipe.y + pipe.height / 2 + 5);

        // Glow outer ring
        ctx.strokeStyle = "rgba(0, 255, 204, 0.3)";
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(pipe.x + pipe.width / 2 - cameraX, pipe.y + pipe.height / 2, 32, 0, Math.PI * 2);
        ctx.stroke();

        // Solid inner ring
        ctx.strokeStyle = "#00ffcc";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(pipe.x + pipe.width / 2 - cameraX, pipe.y + pipe.height / 2, 28, 0, Math.PI * 2);
        ctx.stroke();

        // Portal center light
        ctx.fillStyle = "rgba(0, 255, 204, 0.15)";
        ctx.beginPath();
        ctx.arc(pipe.x + pipe.width / 2 - cameraX, pipe.y + pipe.height / 2, 26, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Draw Space Invaders
      enemies.forEach(enemy => {
        if (enemy.isSquashed && enemy.squashTimer > 400) return; // Hide squashed invader after 400ms

        const sprite = enemy.isSquashed 
          ? SPRITES.goomba.squashed 
          : (Math.floor(Date.now() / 200) % 2 === 0 ? SPRITES.goomba.walk1 : SPRITES.goomba.walk2);

        drawPixelSprite(ctx, enemy.x - cameraX, enemy.y, sprite, 2.0);
      });

      // 8. Draw Flagpole and Castle
      // Pole
      ctx.fillStyle = "#8A8A8A";
      ctx.fillRect(flagPoleX - cameraX + 8, flagYStart, 4, groundY - flagYStart);
      
      // Top Ball
      ctx.fillStyle = "#24C124";
      ctx.beginPath();
      ctx.arc(flagPoleX - cameraX + 10, flagYStart - 4, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Flag
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(flagPoleX - cameraX - 20, flagY, 28, 18);
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.strokeRect(flagPoleX - cameraX - 20, flagY, 28, 18);
      
      // Draw Red Star on flag
      ctx.fillStyle = "#FF3333";
      ctx.font = '10px "Press Start 2P"';
      ctx.fillText("★", flagPoleX - cameraX - 6, flagY + 14);

      // Castle (y=groundY - 120, x = flagPoleX + 120)
      const castleX = flagPoleX + 120 - cameraX;
      const castleY = groundY - 96;

      ctx.fillStyle = "#8A8A8A"; // Castle walls
      ctx.fillRect(castleX, castleY, 96, 96);
      
      // Battlements
      ctx.fillRect(castleX, castleY - 16, 20, 16);
      ctx.fillRect(castleX + 38, castleY - 16, 20, 16);
      ctx.fillRect(castleX + 76, castleY - 16, 20, 16);

      // Castle Door
      ctx.fillStyle = "#000000";
      ctx.fillRect(castleX + 32, castleY + 48, 32, 48);

      // 9. Draw Player (Mario)
      if (!player.isBlinking || Math.floor(Date.now() / 100) % 2 === 0) {
        let marioSprite = SPRITES.mario.idle;
        if (player.victoryWalk) {
          marioSprite = player.animFrame === 3 ? SPRITES.mario.jump : (player.animFrame === 1 ? SPRITES.mario.walk1 : SPRITES.mario.walk2);
        } else if (!player.grounded) {
          marioSprite = SPRITES.mario.jump;
        } else if (player.vx !== 0) {
          marioSprite = player.animFrame === 1 ? SPRITES.mario.walk1 : SPRITES.mario.walk2;
        }

        drawPixelSprite(
          ctx, 
          player.x - cameraX, 
          player.y, 
          marioSprite, 
          3.5, 
          player.facing === "left"
        );
      }

      // 10. Draw Floating text effects
      floatingTexts.forEach(ft => {
        ctx.fillStyle = `rgba(255, 255, 255, ${ft.alpha})`;
        ctx.font = '8px "Press Start 2P", Courier, monospace';
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x - cameraX, ft.y);
      });

      // 11. Screen Borders (Vignette Retro styling)
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    };

    // Main animation runner
    const loop = () => {
      update();
      draw();
      animationFrameId.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [phase, keys, openSection]);

  // ==========================================
  // VIEW RENDER PARTS
  // ==========================================

  // Start Screen view
  const renderStartScreen = () => (
    <div className="w-full min-h-screen bg-[#070b12] flex flex-col items-center justify-center p-6 relative select-none font-retro crt-screen overflow-hidden">
      {/* CRT Scanline and Flicker layers */}
      <div className="scanlines" />
      <div className="crt-flicker" />

      <div className="bg-black/35 backdrop-blur-[20px] border border-white/10 p-8 max-w-lg w-full text-center relative z-10 rounded-[2rem] hover:border-white/20 transition-all">
        <div className="flex justify-center gap-2 mb-6">
          <span className="text-yellow-400 text-3xl animate-bounce">★</span>
          <span className="text-red-500 text-3xl animate-pulse">🍄</span>
          <span className="text-yellow-400 text-3xl animate-bounce">★</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-yellow-400 uppercase tracking-wider leading-relaxed text-shadow mb-4 font-retro">
          SUPER FARIZ<br />PORTFOLIO
        </h1>
        <p className="text-[10px] md:text-xs text-sky-400 tracking-wide leading-loose mb-8">
          WORLD 1-1: COMPUTER SCIENCE TRAJECTORY
        </p>

        <button
          onClick={handleStartGame}
          className="px-8 py-5 bg-white/5 border border-white/20 hover:bg-white/15 active:scale-95 text-white text-xs uppercase font-bold tracking-widest transition-all rounded-2xl backdrop-blur-md cursor-pointer font-retro"
        >
          Press Start Game
        </button>

        <div className="mt-8 text-[9px] text-slate-400 flex flex-col gap-2">
          <span>© 2026 AMIRUL FARIZ (JACKAL)</span>
          <span>BUILT WITH REACT / NEXT.JS / TAILWIND</span>
        </div>
      </div>
    </div>
  );

  // Loading Screen view
  const renderLoadingScreen = () => (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-6 select-none font-retro text-white">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="text-sm tracking-widest uppercase">
          WORLD 1-1
        </div>

        <div className="flex items-center justify-center gap-4">
          {/* Animated jumping emoji as simple standalone loader */}
          <span className="text-4xl animate-bounce">🏃‍♂️</span>
          <span className="text-xl font-bold uppercase">x 3 LIVES</span>
        </div>

        {/* loading progress bar */}
        <div className="space-y-3">
          <div className="w-full h-8 bg-slate-900 border-4 border-white p-1">
            <div 
              className="h-full bg-yellow-400 transition-all duration-75"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <div className="text-[10px] text-yellow-400 font-bold uppercase tracking-wider animate-pulse">
            {loadingText}
          </div>
        </div>
      </div>
    </div>
  );

  const getSectionTitle = (section: string) => {
    switch (section) {
      case "profile": return "PROFILE: AMIRUL FARIZ";
      case "education": return "WORLD 1-2: EDUCATION";
      case "experience": return "WORLD 1-3: EXPERIENCE";
      case "projects": return "WORLD 1-4: PROJECTS CASTLE";
      case "skills": return "POWER-UPS: SKILLS";
      case "contact": return "PEACH LETTER: CONTACT";
      case "playground": return "WORLD 2-1: PLAYGROUND";
      default: return "";
    }
  };

  const getSectionContent = (section: string) => {
    switch (section) {
      case "profile":
        return (
          <div className="space-y-6">
            {/* Main Profile Info Header Card */}
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className="flex items-center gap-6 flex-col sm:flex-row bg-[#080d16] border-4 border-black p-5 rounded-none shadow-[4px_4px_0px_#000] outline outline-2 outline-sky-500 relative overflow-hidden text-white w-full"
            >
              {/* Circular Avatar with red dashed border */}
              <div className="rounded-full border-4 border-dashed border-red-500 p-1 bg-red-950/40 w-24 h-24 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center relative select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={jackolImage.src} 
                  alt="Amirul Fariz (Jackal)" 
                  className="w-full h-full object-cover rounded-full" 
                  style={{ imageRendering: "pixelated" }}
                />
              </div>
              <div className="text-center sm:text-left space-y-2.5 z-10 flex-1">
                <div className="text-base sm:text-lg font-black text-yellow-400 font-retro uppercase tracking-wider text-shadow">
                  {PROFILE_DATA.name} ({PROFILE_DATA.nickname})
                </div>
                <div className="text-[10px] sm:text-xs text-sky-400 uppercase tracking-widest font-black font-retro">
                  {PROFILE_DATA.title}
                </div>
              </div>
            </motion.div>

            {/* Bio Box with custom retro scrollbar and high contrast */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-[#05070a] border-4 border-black p-5 rounded-none font-retro leading-relaxed text-slate-200 text-xs sm:text-sm uppercase max-h-[180px] overflow-y-auto pr-2.5 retro-scrollbar shadow-[4px_4px_0px_#000]"
            >
              {PROFILE_DATA.bio}
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Email Card (Interactive Copy) */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(PROFILE_DATA.email, "email")}
                className="cursor-pointer bg-slate-950 p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_#000] relative group transition-all"
              >
                <span className="text-red-400 font-bold text-[10px] tracking-wider uppercase font-retro">EMAIL (CLICK TO COPY)</span>
                <div className="text-[11px] text-slate-200 mt-1.5 truncate group-hover:text-red-400 transition-colors font-retro uppercase">{PROFILE_DATA.email}</div>
                {copiedField === "email" && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-3 right-4 px-2.5 py-1 bg-yellow-400 text-black text-[8px] font-black border-2 border-black rounded-none font-retro"
                  >
                    COPIED! 🪙
                  </motion.span>
                )}
              </motion.div>

              {/* Phone Card (Interactive Copy) */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(PROFILE_DATA.phone, "phone")}
                className="cursor-pointer bg-slate-950 p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_#000] relative group transition-all"
              >
                <span className="text-blue-400 font-bold text-[10px] tracking-wider uppercase font-retro">PHONE (CLICK TO COPY)</span>
                <div className="text-[11px] text-slate-200 mt-1.5 group-hover:text-blue-400 transition-colors font-retro uppercase">{PROFILE_DATA.phone}</div>
                {copiedField === "phone" && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-3 right-4 px-2.5 py-1 bg-yellow-400 text-black text-[8px] font-black border-2 border-black rounded-none font-retro"
                  >
                    COPIED! 🪙
                  </motion.span>
                )}
              </motion.div>

              {/* Location Card */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-slate-950 p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_#000]"
              >
                <span className="text-yellow-400 font-bold text-[10px] tracking-wider uppercase font-retro">LOCATION</span>
                <div className="text-[11px] text-slate-200 mt-1.5 flex items-center gap-1.5 font-retro uppercase">
                  <span>{PROFILE_DATA.location}</span> 
                  <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>🇲🇾</motion.span>
                </div>
              </motion.div>

              {/* GitHub Card */}
              <motion.a
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                href={PROFILE_DATA.github}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-950 p-4 border-4 border-black rounded-none shadow-[4px_4px_0px_#000] block group transition-all"
              >
                <span className="text-green-400 font-bold text-[10px] tracking-wider uppercase flex justify-between items-center font-retro">
                  <span>GITHUB CASTLE</span>
                  <ExternalLink className="size-3.5 text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <div className="text-[11px] text-slate-200 mt-1.5 group-hover:text-green-400 transition-colors font-retro uppercase">github.com/ProfFariz</div>
              </motion.a>
            </div>

            {/* Favorite Food Item Block */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-yellow-950/60 p-4 border-4 border-black rounded-none text-xs text-yellow-400 uppercase tracking-widest text-center shadow-[4px_4px_0px_rgba(234,179,8,0.25)] font-retro"
            >
              ⚡ Favorite Food Power-Up: <span className="text-white font-bold">{PROFILE_DATA.favoriteFood}</span>
            </motion.div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-950/40 border-4 border-blue-500 p-5 rounded-none shadow-[4px_4px_0px_#000] space-y-3.5 relative overflow-hidden"
            >
              <div className="absolute top-2 right-4 text-3xl opacity-20 pointer-events-none select-none">🎓</div>
              <div className="text-yellow-400 font-black text-sm sm:text-base uppercase tracking-wider font-retro">{EDUCATION_DATA.school}</div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[9px] px-2.5 py-1 bg-emerald-500 text-white font-black border-2 border-black rounded-none uppercase tracking-wider font-retro">
                  STATUS: {EDUCATION_DATA.status}
                </span>
                <span className="text-[9px] px-2.5 py-1 bg-sky-500 text-white font-black border-2 border-black rounded-none uppercase tracking-wider font-retro">
                  {EDUCATION_DATA.focus}
                </span>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-950 border-4 border-black p-5 rounded-none leading-relaxed text-slate-200 text-xs sm:text-sm tracking-wide uppercase font-retro shadow-[4px_4px_0px_#000]"
            >
              {EDUCATION_DATA.description}
            </motion.p>

            {/* Interactive Subjects/Badges block */}
            <div className="space-y-3">
              <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black font-retro">CLICK COURSES TO BOUNCE:</div>
              <div className="flex flex-wrap gap-2.5">
                {["Data Structures", "Algorithms", "Web Architecture", "UI Design", "Software Life Cycle", "Database Systems"].map((subj, idx) => (
                   <motion.button
                     key={idx}
                     whileHover={{ scale: 1.08, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => synth.playJump()}
                     className="px-3.5 py-2 bg-slate-950 border-2 border-slate-700 hover:border-sky-400 text-sky-400 text-[10px] uppercase font-black rounded-none transition-colors shadow-[2px_2px_0px_#000] font-retro cursor-pointer"
                   >
                     📘 {subj}
                   </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6 relative pl-6 sm:pl-8 py-2">
            {/* Vertical level track line */}
            <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-1.5 bg-slate-800 border-l border-r border-slate-600 rounded-none" />

            {EXPERIENCE_DATA.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-slate-950 border-4 border-black p-5 rounded-none shadow-[4px_4px_0px_#000] flex flex-col md:flex-row gap-4"
              >
                {/* Timeline Dot Node */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: idx * 0.5 }}
                  className="absolute -left-[27px] sm:-left-[35px] top-6 w-5 h-5 bg-emerald-500 border-4 border-black flex items-center justify-center text-[7px] rounded-none font-retro"
                >
                  ⭐
                </motion.div>

                <div className="md:w-36 text-yellow-400 shrink-0 uppercase tracking-wider space-y-1.5 font-retro">
                  <div className="text-[11px] font-black">{exp.period}</div>
                  <div className="text-[9px] text-sky-400 font-bold bg-sky-950/40 px-2.5 py-1 border border-sky-800/40 rounded-none inline-block md:block text-center">{exp.company}</div>
                </div>
                <div className="flex-1 text-slate-300 leading-relaxed uppercase tracking-wider space-y-2 font-retro">
                  <div className="text-white font-black text-xs sm:text-sm">{exp.role}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-retro leading-normal">{exp.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1 font-retro">STAGES CLEAR SELECTION:</div>
            {PROJECTS_DATA.map((proj, idx) => (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.12, type: "spring" }}
                whileHover={{ y: -6, scale: 1.02, transition: { type: "spring", stiffness: 450, damping: 8 } }}
                className="bg-slate-950 border-4 border-black p-5 text-xs sm:text-sm rounded-none space-y-3.5 relative overflow-hidden shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all font-retro"
              >
                <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-black text-[8px] font-black border-2 border-black rounded-none uppercase tracking-wider font-retro">
                  {proj.badge}
                </div>
                
                <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider font-retro flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-red-500 border border-black text-white rounded-none text-[8px]">{idx+1}</span>
                  {proj.title}
                </h3>
                
                <p className="text-[10px] sm:text-xs text-slate-200 uppercase tracking-wide leading-relaxed font-retro">
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/40">
                  {proj.stack.map((s, i) => (
                    <motion.span 
                      key={i} 
                      whileHover={{ y: -2, scale: 1.05 }}
                      onClick={() => synth.playCoin()}
                      className="cursor-default px-2.5 py-1 bg-slate-900 border-2 border-slate-700 text-[8px] text-sky-400 font-bold uppercase tracking-wider rounded-none shadow-[1px_1px_0px_#000]"
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                <div className="pt-2">
                  <motion.a
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={proj.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => synth.playCoin()}
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-red-600 border-4 border-black text-[10px] text-white uppercase font-bold tracking-widest font-retro shadow-[3px_3px_0px_#000] hover:bg-red-500 hover:shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-none cursor-pointer"
                  >
                    <span>VISIT CASTLE</span>
                    <ExternalLink className="size-3 stroke-[2.5px]" />
                  </motion.a>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <p className="text-center text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2 animate-pulse font-retro">
              ❓ HIT QUESTION BLOCKS TO SEE POWER RATING ❓
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {SKILLS_DATA.map((skill, idx) => (
                <motion.div 
                  key={idx} 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1, type: "spring" }}
                  whileHover={{ 
                    scale: 1.03, 
                    y: -4, 
                    boxShadow: "6px 6px 0px #000",
                    transition: { type: "spring", stiffness: 300, damping: 10 }
                  }}
                  onClick={() => synth.playCoin()}
                  className="cursor-pointer bg-slate-950 border-4 border-black p-4 rounded-none space-y-3.5 shadow-[4px_4px_0px_#000] relative overflow-hidden select-none transition-all group animate-fade-in font-retro"
                >
                  <div className="flex justify-between items-center gap-2 font-retro">
                    <span className="text-[11px] font-black text-yellow-400 uppercase tracking-wider">{skill.name}</span>
                    <span className="text-[8px] px-2 py-0.5 bg-indigo-900 border-2 border-indigo-500 text-white font-black rounded-none uppercase group-hover:animate-bounce">
                      {skill.item.split(" ").slice(-1)[0]}
                    </span>
                  </div>
                  
                  <p className="text-[10px] text-slate-350 leading-normal uppercase font-retro">
                    {skill.desc}
                  </p>

                  <div className="space-y-1.5 font-retro">
                    <div className="flex justify-between text-[8px] text-slate-400 font-bold">
                      <span>POWER LEVEL</span>
                      <span className="text-emerald-400 group-hover:scale-110 transition-transform">{skill.rating}%</span>
                    </div>
                    {/* Retro health/power bar that animates from 0% to rating% */}
                    <div className="w-full h-4 bg-slate-900 border-2 border-black p-0.5 rounded-none overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.rating}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-emerald-500 rounded-none"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case "contact":
        return (
          <div className="space-y-6">
            {formSubmitted ? (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-slate-950 border-4 border-black p-8 text-center space-y-5 font-retro uppercase rounded-none shadow-[6px_6px_0px_#000]"
              >
                <motion.span 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ repeat: Infinity, duration: 2.2 }}
                  className="text-6xl block select-none"
                >
                  💌
                </motion.span>
                <div className="text-sm text-yellow-400 font-black tracking-widest">THANK YOU!</div>
                <p className="text-[10px] sm:text-xs text-slate-300 leading-relaxed max-w-sm mx-auto font-retro">
                  {"Your letter has been sent to Princess Peach's Castle. Fariz will reply to you as soon as possible!"}
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    synth.playCoin();
                    setFormSubmitted(false);
                  }}
                  className="px-5 py-2.5 bg-red-600 border-4 border-black text-white hover:bg-red-500 text-[10px] uppercase font-bold tracking-widest shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-none cursor-pointer font-retro"
                >
                  Send another letter
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-retro text-[10px] sm:text-xs bg-[#fdf6e2] p-5 sm:p-6 border-4 border-black text-slate-900 rounded-none shadow-[6px_6px_0px_#000] relative text-left">
                <div className="absolute top-2 right-4 text-xs opacity-50 font-bold font-mono tracking-tighter text-slate-600 select-none">
                  POSTAGE 1-UP
                </div>
                
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-700 uppercase font-retro">YOUR NAME:</label>
                  <input
                    type="text"
                    required
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-none focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase font-retro"
                    placeholder="E.G. MARIO"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-700 uppercase font-retro">YOUR EMAIL:</label>
                  <input
                    type="email"
                    required
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-none focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase font-retro"
                    placeholder="E.G. MARIO@MUSHROOM.COM"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-black text-slate-700 uppercase font-retro">YOUR LETTER:</label>
                  <textarea
                    required
                    rows={3}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-none focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase font-retro"
                    placeholder="ENTER COOPERATIVE WORK DETAILS..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 border-4 border-black text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-none cursor-pointer font-retro"
                >
                  Send Letter ✉️
                </motion.button>
              </form>
            )}
          </div>
        );
      case "playground":
        return (
          <div className="space-y-6 max-w-4xl mx-auto w-full text-center">
            <div className="text-[10px] text-slate-400 uppercase tracking-widest font-black mb-1 font-retro">STAGE 2-1: PLAYGROUND & FYP GAME</div>
            
            <div className="bg-slate-950 border-4 border-black p-5 rounded-none space-y-4 shadow-[6px_6px_0px_#000] font-retro text-left">
              <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider font-retro flex items-center gap-2">
                🎮 MATHIVITY TD
              </h3>
              <p className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wide leading-relaxed font-retro">
                An educational 2D mathematical tower defense game built in Godot 4. Students tackle percentage, fraction, and ratio questions in active gameplay to reduce mathematical anxiety.
              </p>
              
              {/* Playable WebGL Game Frame Container */}
              <div className="relative border-4 border-black bg-slate-900 w-full overflow-hidden aspect-[16/9] crt-screen">
                <div className="scanlines" />
                <div className="crt-flicker" />
                
                <iframe
                  src="https://html-classic.itch.zone/html/16436534/index.html?v=1782694771"
                  className="w-full h-full border-none"
                  allow="autoplay; fullscreen; gamepad"
                  scrolling="no"
                  title="Mathivity TD Game View"
                />
              </div>
              
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                <div className="text-[8px] text-slate-400 uppercase font-retro">
                  FYP GAME • DEVELOPED IN GODOT 4.5 • AMIRUL FARIZ
                </div>
                <a 
                  href="https://amirulgodot.itch.io/mathivity" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 border-2 border-black hover:bg-red-500 active:scale-95 text-white text-[9px] uppercase font-bold tracking-wider font-retro shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none"
                >
                  Open Game on Itch.io
                </a>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Main menu dashboard screen view
  const renderDashboard = () => {
    // Determine color of current active section for the details panel outline glow
    const activeColor = 
      activeSection === "profile" ? "#ef4444" :
      activeSection === "education" ? "#60a5fa" :
      activeSection === "projects" ? "#facc15" :
      activeSection === "experience" ? "#34d399" :
      activeSection === "skills" ? "#c084fc" :
      activeSection === "playground" ? "#ff007f" :
      activeSection === "contact" ? "#f472b6" : "#00ffcc";

    return (
      <div className="w-full min-h-screen bg-transparent flex flex-col relative select-none font-retro overflow-hidden">
        
        {/* 2. Top Header HUD Panel */}
        <div className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 text-white px-6 py-3 flex justify-between items-center z-20 relative select-none">
          <div className="flex items-center gap-2 text-[9px] sm:text-[10px] tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 font-bold uppercase mr-1">PLAYER</span>
            <span className="text-white font-retro font-black">FARIZ</span>
          </div>

          {/* Global Controls & Mode HUD */}
          <div className="flex items-center gap-5 text-[9px] sm:text-[10px] tracking-widest font-retro">
            {/* Mode label */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-bold uppercase">MODE</span>
              <span className="text-white font-retro font-black uppercase">EXPLORE</span>
            </div>
            
            {/* Level label */}
            <div className="flex items-center gap-1.5 border-l border-white/20 pl-4">
              <span className="text-slate-400 font-bold uppercase">LVL</span>
              <span className="text-yellow-400 font-retro font-black">01</span>
            </div>

            {/* HUD controls (gamepad, mute, settings) */}
            <div className="flex items-center gap-3.5 border-l border-white/20 pl-4">
              {/* Gamepad Icon */}
              <Gamepad2 className="size-3.5 text-emerald-400 animate-pulse" />

              {/* Speaker / Music Mute */}
              <button 
                onClick={() => {
                  synth.playClick();
                  setBgmMuted(!bgmMuted);
                }}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Toggle Music"
              >
                {bgmMuted ? <VolumeX className="size-3.5 text-red-500" /> : <Volume2 className="size-3.5 text-slate-300" />}
              </button>

              {/* Reset / Settings */}
              <button 
                onClick={handleResetGame}
                className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Reset Game"
              >
                <Settings className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. Main Split View: Sidebar + Content Area */}
        <div className="flex-1 flex flex-row relative z-10 overflow-hidden">
          {/* Left Vertical Sidebar Navigation */}
          <div className="w-14 lg:w-44 shrink-0 bg-black/25 backdrop-blur-[10px] border-r border-white/10 flex flex-col justify-between py-6 px-2 lg:px-4 z-10 select-none">
            <div className="flex flex-col gap-2.5">
              {[
                { id: "home", label: "HOME", icon: Home, section: null },
                { id: "about", label: "ABOUT", icon: User, section: "profile" },
                { id: "skills", label: "SKILLS", icon: Code, section: "skills" },
                { id: "projects", label: "PROJECTS", icon: Folder, section: "projects" },
                { id: "journey", label: "JOURNEY", icon: LineChart, section: "experience" },
                { id: "playground", label: "PLAYGROUND", icon: Gamepad2, section: "playground" },
                { id: "contact", label: "CONTACT", icon: Mail, section: "contact" }
              ].map(item => {
                const isItemActive = activeSection === item.section;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => openSection(item.section as string)}
                    className={`w-full flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 border rounded-xl font-retro text-[9px] tracking-widest transition-all duration-200 uppercase font-bold cursor-pointer ${
                      isItemActive 
                        ? "bg-[#0d1e1f] text-[#00ffcc] border-[#00ffcc]/40 shadow-[0_0_15px_rgba(0,255,204,0.25)]"
                        : "bg-transparent text-slate-400 border-transparent hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="hidden lg:inline-block">{item.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Explore Indicator at Sidebar Bottom */}
            <div className="flex items-center justify-center lg:justify-start gap-2.5 px-1 mt-auto">
              <div className="w-8 h-8 rounded-full border border-slate-500/50 flex items-center justify-center text-[10px] font-retro text-slate-400 font-bold shrink-0">
                N
              </div>
              <div className="hidden lg:block text-[7px] text-slate-400 font-retro leading-tight uppercase font-bold select-none">
                SCROLL<br />TO EXPLORE
              </div>
            </div>
          </div>

          {/* Right Main Content Panel */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 flex justify-center items-center">
            <div className="max-w-7xl w-full flex flex-col lg:flex-row gap-8 items-center justify-center">
              
              {/* Left Column: 3x2 Grid (Hidden on mobile if a section is active) */}
              <div className={`w-full flex flex-col gap-6 ${
                activeSection && activeSection !== "clear" ? "hidden" : "flex"
              }`}>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.08
                      }
                    }
                  }}
                  className="grid grid-cols-3 gap-4 sm:gap-6 w-full"
                >
                  {/* Profile Card */}
                  <MenuCard
                    title="Profile"
                    hexColor="#ef4444"
                    isActive={activeSection === "profile"}
                    onClick={() => openSection("profile")}
                    renderIcon={(isHovered, hexColor) => <AnimatedProfileIcon isHovered={isHovered} hexColor={hexColor} />}
                  />

                  {/* Education Card */}
                  <MenuCard
                    title="Education"
                    hexColor="#60a5fa"
                    isActive={activeSection === "education"}
                    onClick={() => openSection("education")}
                    renderIcon={(isHovered, hexColor) => <AnimatedEducationIcon isHovered={isHovered} hexColor={hexColor} />}
                  />

                  {/* Projects Card */}
                  <MenuCard
                    title="Projects"
                    hexColor="#facc15"
                    isActive={activeSection === "projects"}
                    onClick={() => openSection("projects")}
                    renderIcon={(isHovered, hexColor) => <AnimatedProjectsIcon isHovered={isHovered} hexColor={hexColor} />}
                  />

                  {/* Experience Card */}
                  <MenuCard
                    title="Experience"
                    hexColor="#34d399"
                    isActive={activeSection === "experience"}
                    onClick={() => openSection("experience")}
                    renderIcon={(isHovered, hexColor) => <AnimatedExperienceIcon isHovered={isHovered} hexColor={hexColor} />}
                  />

                  {/* Skills Card */}
                  <MenuCard
                    title="Skills"
                    hexColor="#c084fc"
                    isActive={activeSection === "skills"}
                    onClick={() => openSection("skills")}
                    renderIcon={(isHovered, hexColor) => <AnimatedSkillsIcon isHovered={isHovered} hexColor={hexColor} />}
                  />

                  {/* Contact Card */}
                  <MenuCard
                    title="Contact"
                    hexColor="#f472b6"
                    isActive={activeSection === "contact"}
                    onClick={() => openSection("contact")}
                    renderIcon={(isHovered, hexColor) => <AnimatedContactIcon isHovered={isHovered} hexColor={hexColor} />}
                  />
                </motion.div>
              </div>

              {/* Right Column: Adventure Time Dashboard Welcome OR Content Detail Panel */}
              <div className={`flex-1 w-full flex flex-col justify-center items-center ${
                activeSection && activeSection !== "clear" ? "max-w-4xl" : "lg:w-[45%] xl:w-[40%]"
              }`}>
                <AnimatePresence mode="wait">
                  {!activeSection || activeSection === "clear" ? (
                    <motion.div 
                      key="adventure-time"
                      initial={{ opacity: 0, x: 30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col justify-between items-center lg:items-start min-h-[420px] py-4 w-full relative"
                    >
                      {/* Welcome Headers */}
                      <div className="flex-1 flex flex-col justify-center items-center lg:items-start text-center lg:text-left w-full">
                        <div className="text-[9px] text-[#00ffcc] uppercase tracking-widest font-black mb-3 bg-black/40 border border-[#00ffcc]/30 px-3.5 py-1.5 rounded-none backdrop-blur-md">
                          WELCOME TO MY PORTFOLIO 💖
                        </div>
                        
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-retro select-none mb-4">
                          ADVENTURE<br />TIME!
                        </h2>

                        <p className="text-[9px] sm:text-[10px] text-slate-400 tracking-wide leading-relaxed font-retro max-w-sm uppercase mb-6">
                          {"I'm Fariz, a passionate developer who turns ideas into immersive digital experiences. Explore my journey, projects, and skills."}
                        </p>

                        {/* Slanted red exploration button */}
                        <motion.button
                          onClick={startPlatformer}
                          whileHover={{ scale: 1.05, skewX: -12 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-4 bg-gradient-to-r from-[#ef4444] to-[#991b1b] border-2 border-red-500/30 text-white font-retro text-[10px] tracking-widest font-black uppercase flex items-center gap-2.5 skew-x-[-12deg] shadow-[0_0_15px_rgba(239,68,68,0.3)] cursor-pointer"
                        >
                          <span className="skew-x-[12deg] flex items-center gap-2">
                            START EXPLORING <ChevronRight className="size-3.5 stroke-[3px]" />
                          </span>
                        </motion.button>
                      </div>

                      {/* Current Location Box */}
                      <div className="relative w-full max-w-sm mt-10 z-10">
                        <div 
                          className="w-full p-4 bg-[#0c0d10] border-2 border-black rounded-none text-left relative z-10" 
                          style={{ outline: "1px solid #00ffcc", boxShadow: "0 0 12px rgba(0,255,204,0.15)" }}
                        >
                          <div className="text-[7.5px] text-[#00ffcc] font-retro tracking-widest uppercase font-bold mb-1">
                            CURRENT LOCATION
                          </div>
                          <div className="text-[11px] font-retro text-white font-black tracking-wide uppercase mb-2">
                            PIXEL CITY, CREATIVE DISTRICT
                          </div>
                          <div className="text-[7.5px] text-slate-400 font-retro tracking-wider uppercase font-bold flex gap-4">
                            <span>• DAY 01</span>
                            <span>• 08:30 PM</span>
                            <span>• CLEAR</span>
                          </div>
                        </div>
                      </div>

                      {/* Pointing Avatar Character positioned relative to parent welcome panel */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 30 }}
                        animate={{ 
                          opacity: 1, 
                          scale: 1, 
                          y: [0, -4, 0]
                        }}
                        transition={{ 
                          opacity: { duration: 0.3 },
                          scale: { type: "spring" },
                          y: {
                            repeat: Infinity,
                            duration: 2.2,
                            ease: "easeInOut"
                          }
                        }}
                        className="absolute right-[-40px] sm:right-[-90px] bottom-[-20px] sm:bottom-[-40px] w-[17rem] h-[11.3rem] sm:w-[26rem] sm:h-[17.3rem] pointer-events-none select-none z-0 overflow-visible"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src="/amirulfarizavatar.png"
                          alt="Amirul Fariz Avatar pointing"
                          className="w-full h-full object-contain object-bottom"
                          style={{ imageRendering: "pixelated" }}
                        />
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={activeSection}
                      initial={{ opacity: 0, scale: 0.92, y: 30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.92, y: 30 }}
                      transition={{ type: "spring", stiffness: 180, damping: 15 }}
                      className="w-full bg-[#0c0d10] border-4 border-black text-white p-6 sm:p-8 rounded-none flex flex-col relative z-10 text-left"
                      style={{
                        outline: `2px solid ${activeColor}`,
                        boxShadow: `0 0 25px ${activeColor}50, 8px 8px 0px #000`,
                      }}
                    >
                      {/* Back Button */}
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={closeSection}
                        className="absolute top-4 right-4 bg-[#cccccc] border-2 border-black hover:bg-[#b3b3b3] active:translate-y-0.5 text-black px-4 py-2 rounded-none text-[9px] font-black tracking-wider transition-all flex items-center gap-1.5 cursor-pointer font-retro shadow-[3px_3px_0px_#000] hover:shadow-[2px_2px_0px_#000]"
                        title="Return to Menu"
                      >
                        <ArrowLeft className="size-3 stroke-[3px]" />
                        <span>BACK</span>
                      </motion.button>

                      <h3 className="text-xs sm:text-sm text-yellow-400 border-b border-black pb-4 mb-6 uppercase tracking-widest font-black pr-28 leading-relaxed font-retro">
                        {getSectionTitle(activeSection)}
                      </h3>

                      <div className="text-xs max-h-[60vh] overflow-y-auto pr-2.5 retro-scrollbar">
                        {getSectionContent(activeSection)}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        </div>

        {/* Floating Social Pill Capsule (Bottom Right) */}
        {phase === "dashboard" && (
          <div 
            className="absolute bottom-6 right-20 bg-[#0c0d10] border-2 border-black rounded-full py-3 px-6 flex items-center gap-5 z-20 shadow-[0_0_15px_rgba(0,0,0,0.6)] select-none hover:scale-105 active:scale-95 transition-transform duration-200"
            style={{ outline: "1px solid rgba(255,255,255,0.1)" }}
          >
            <a 
              href="https://github.com/ProfFariz" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => synth.playClick()}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-none"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => synth.playClick()}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={() => synth.playClick()}
              className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-none"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
            </a>
          </div>
        )}
      </div>
    );
  };

  // Platformer Minigame view (with retro arcade layout and touch buttons)
  const renderMinigame = () => (
    <div className="w-full min-h-screen bg-transparent flex flex-col select-none font-retro text-white p-4">
      {/* Back button */}
      <div className="max-w-5xl mx-auto w-full mb-3 flex justify-between items-center">
        <button
          onClick={() => {
            navigateToPhase("dashboard");
          }}
          className="px-3 py-1.5 bg-slate-800 border-2 border-white hover:bg-slate-700 text-[9px] uppercase tracking-wider flex items-center gap-1.5"
        >
          <ArrowLeft className="size-3" />
          <span>Exit Arcade</span>
        </button>

        <div className="flex gap-4 text-[9px] md:text-[10px] text-yellow-400 uppercase">
          <div>🪙 Coins: {coinsCollected}</div>
          <div>★ Score: {score}</div>
        </div>
      </div>

      {/* Main Arcade Cabinet Box */}
      <div className="max-w-5xl mx-auto w-full bg-slate-950 border-4 border-red-600 p-2 md:p-4 shadow-[12px_12px_0px_#000] rounded-lg">
        {/* Canvas viewport container */}
        <div className="relative border-4 border-black bg-sky-400 w-full overflow-hidden aspect-[16/9] crt-screen">
          {/* CRT scanline and flicker overlays */}
          <div className="scanlines" />
          <div className="crt-flicker" />

          <canvas
            ref={canvasRef}
            className="w-full h-full block image-render-pixel"
          />

          {/* Quick Level Instructions overlay */}
          <div className="absolute top-2 left-2 bg-black/60 p-2 text-[8px] rounded border border-white/20 text-slate-200 space-y-1 pointer-events-none">
            <div>KEYS: A/D/Arrows = Move</div>
            <div>SPACE / RED JUMP = Fire Laser</div>
            <div>S / YELLOW DOWN = Warp Portal</div>
          </div>
        </div>

        {/* Mobile touch game controls wrapper */}
        <div className="mt-4 p-3 bg-slate-900 border-4 border-black grid grid-cols-3 items-center gap-4">
          {/* D-Pad controls */}
          <div className="flex flex-col items-center gap-1.5">
            <button
              onMouseDown={() => setKeys(k => ({ ...k, up: true }))}
              onMouseUp={() => setKeys(k => ({ ...k, up: false }))}
              onTouchStart={() => setKeys(k => ({ ...k, up: true }))}
              onTouchEnd={() => setKeys(k => ({ ...k, up: false }))}
              className="w-12 h-10 bg-slate-800 border-2 border-white active:bg-slate-700 flex items-center justify-center text-xs rounded-t"
            >
              <ArrowUp className="size-4" />
            </button>
            <div className="flex gap-1.5">
              <button
                onMouseDown={() => setKeys(k => ({ ...k, left: true }))}
                onMouseUp={() => setKeys(k => ({ ...k, left: false }))}
                onTouchStart={() => setKeys(k => ({ ...k, left: true }))}
                onTouchEnd={() => setKeys(k => ({ ...k, left: false }))}
                className="w-12 h-10 bg-slate-800 border-2 border-white active:bg-slate-700 flex items-center justify-center text-xs rounded-l"
              >
                <ArrowLeft className="size-4" />
              </button>
              <button
                onMouseDown={() => setKeys(k => ({ ...k, down: true }))}
                onMouseUp={() => setKeys(k => ({ ...k, down: false }))}
                onTouchStart={() => setKeys(k => ({ ...k, down: true }))}
                onTouchEnd={() => setKeys(k => ({ ...k, down: false }))}
                className="w-12 h-10 bg-slate-800 border-2 border-white active:bg-slate-700 flex items-center justify-center text-xs"
              >
                <ArrowDown className="size-4" />
              </button>
              <button
                onMouseDown={() => setKeys(k => ({ ...k, right: true }))}
                onMouseUp={() => setKeys(k => ({ ...k, right: false }))}
                onTouchStart={() => setKeys(k => ({ ...k, right: true }))}
                onTouchEnd={() => setKeys(k => ({ ...k, right: false }))}
                className="w-12 h-10 bg-slate-800 border-2 border-white active:bg-slate-700 flex items-center justify-center text-xs rounded-r"
              >
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Center Logo branding */}
          <div className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-500">
            PORTABLE<br />FARIZ-BOY
          </div>

          {/* Action A/B Buttons */}
          <div className="flex justify-end gap-3.5 pr-2">
            <button
              onMouseDown={() => setKeys(k => ({ ...k, down: true }))}
              onMouseUp={() => setKeys(k => ({ ...k, down: false }))}
              onTouchStart={() => setKeys(k => ({ ...k, down: true }))}
              onTouchEnd={() => setKeys(k => ({ ...k, down: false }))}
              className="w-12 h-12 bg-yellow-500 border-4 border-black text-[9px] rounded-full font-bold active:bg-yellow-600 active:scale-95 transition-all text-black shadow-md flex items-center justify-center"
            >
              DOWN
            </button>
            <button
              onMouseDown={() => setKeys(k => ({ ...k, up: true }))}
              onMouseUp={() => setKeys(k => ({ ...k, up: false }))}
              onTouchStart={() => setKeys(k => ({ ...k, up: true }))}
              onTouchEnd={() => setKeys(k => ({ ...k, up: false }))}
              className="w-12 h-12 bg-red-600 border-4 border-black text-[9px] rounded-full font-bold active:bg-red-700 active:scale-95 transition-all text-white shadow-md flex items-center justify-center"
            >
              JUMP
            </button>
          </div>
        </div>
      </div>
    </div>
  );


  const renderSectionModal = () => {
    if (activeSection !== "clear") return null;

    const title = "STAGE CLEAR! WORLD COMPLETE";
    const content = (
      <div className="text-center p-4 space-y-6 font-retro uppercase">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl select-none"
        >
          🏰
        </motion.div>
        <div className="text-xs text-yellow-400 font-black tracking-widest text-shadow">
          CONGRATULATIONS!
        </div>
        
        <p className="text-[10px] text-slate-300 leading-relaxed uppercase tracking-wider max-w-md mx-auto font-retro">
          You cleared the CS Portfolio world! Thank you for playing. Here are your stats:
        </p>

        <div className="bg-black/40 border border-white/10 p-4 max-w-xs mx-auto grid grid-cols-2 text-[10px] gap-2.5 text-left font-retro rounded-2xl">
          <span className="text-slate-400">COINS:</span>
          <span className="text-yellow-300 font-bold">🪙 x{coinsCollected}</span>
          <span className="text-slate-400">SCORE:</span>
          <span className="text-white font-bold">{score} PTS</span>
          <span className="text-slate-400">DEVELOPER:</span>
          <span className="text-sky-400 font-bold">FARIZ</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setActiveSection(null);
            navigateToPhase("dashboard");
          }}
          className="px-6 py-3.5 bg-white/5 border border-white/20 hover:bg-white/15 active:scale-95 text-white text-[10px] tracking-wider uppercase font-bold font-retro rounded-2xl backdrop-blur-md transition-all cursor-pointer"
        >
          Back to Main Menu
        </motion.button>
      </div>
    );

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-retro select-none">
        <motion.div 
          initial={{ scale: 0.85, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="relative w-full max-w-md bg-black/45 backdrop-blur-[20px] border border-white/10 text-white p-6 md:p-8 max-h-[85vh] overflow-y-auto rounded-[2.5rem] z-10 animate-fade-in hover:border-white/20 transition-all"
        >
          <h2 className="text-base sm:text-lg md:text-xl text-yellow-400 border-b border-white/10 pb-4 mb-6 uppercase tracking-widest text-shadow text-center font-retro leading-relaxed">
            {title}
          </h2>

          <div className="text-xs font-retro leading-relaxed">
            {content}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderPixelTransition = () => {
    const cols = 16;
    const rows = 12;
    const totalBlocks = cols * rows;
    const blocks = Array.from({ length: totalBlocks });

    const centerX = (cols - 1) / 2;
    const centerY = (rows - 1) / 2;
    const maxDist = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2));

    return (
      <div 
        className="fixed inset-0 z-[9999] pointer-events-auto w-screen h-screen overflow-hidden grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`
        }}
      >
        {blocks.map((_, idx) => {
          const col = idx % cols;
          const row = Math.floor(idx / cols);
          
          // Radial distance from center of the screen
          const dist = Math.sqrt(Math.pow(col - centerX, 2) + Math.pow(row - centerY, 2));
          // Normalize delay so the wave sweeps from the center outwards
          const delay = (dist / maxDist) * 0.22;

          const isClosing = transitionState.phase === "closing";

          return (
            <motion.div
              key={idx}
              initial={{ 
                scale: isClosing ? 0 : 1.05,
                rotate: isClosing ? -180 : 0
              }}
              animate={{ 
                scale: isClosing ? 1.05 : 0,
                rotate: isClosing ? 0 : 180
              }}
              transition={{
                duration: 0.24,
                delay: delay,
                ease: [0.34, 1.56, 0.64, 1] // Snappy elastic overshoot easeOut
              }}
              className="w-full h-full bg-[#08090d] border border-black/40 origin-center"
            />
          );
        })}
      </div>
    );
  };

  // Switch between stages
  return (
    <div className="w-full min-h-screen relative overflow-hidden select-none bg-slate-950 text-white">
      {/* Global Background Video (only on start, dashboard, minigame phases) */}
      {phase !== "loading" && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            src="/watermark-removed-Swaying_cherry_blossom_branche.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay for better contrast and readability */}
          <div className="absolute inset-0 bg-black/20 z-0" />
        </div>
      )}

      {/* Main content wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col overflow-x-hidden">
        {phase === "start" && renderStartScreen()}
        {phase === "loading" && renderLoadingScreen()}
        {phase === "dashboard" && (
          <>
            {renderDashboard()}
            {renderSectionModal()}
          </>
        )}
        {phase === "minigame" && (
          <>
            {renderMinigame()}
            {renderSectionModal()}
          </>
        )}
      </div>

      {/* Pixel Art Screen Transition Overlay */}
      {transitionState.isActive && renderPixelTransition()}
    </div>
  );
}
