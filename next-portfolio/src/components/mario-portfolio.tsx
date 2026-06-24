"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Volume2, VolumeX, ArrowLeft, ArrowRight,
  ArrowUp, ArrowDown, ExternalLink, RefreshCw
} from "lucide-react";

// ==========================================
// 1. SOUND SYNTHESIZER (WEB AUDIO API)
// ==========================================
class MarioSynth {
  private ctx: AudioContext | null = null;
  private bgmInterval: NodeJS.Timeout | null = null;
  private bgmStep = 0;
  public sfxMuted = false;
  public bgmMuted = true;

  private init() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  resume() {
    this.init();
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
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

    this.playTone(600, 0.04, "sine", 0.04, this.ctx.currentTime);
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
    if (!this.ctx || this.bgmMuted) return;
    this.stopBGM();

    // A simple retro 8-bit baseline loop
    // Mario theme main motifs simplified
    const melody = [
      660, 660, 0, 660, 0, 523, 660, 0,
      784, 0, 0, 0, 392, 0, 0, 0,
      523, 0, 0, 392, 0, 0, 330, 0,
      440, 0, 494, 0, 466, 440, 0, 0
    ];
    
    this.bgmStep = 0;
    this.bgmInterval = setInterval(() => {
      if (this.bgmMuted || !this.ctx) return;
      if (this.ctx.state === "suspended") return;

      const note = melody[this.bgmStep];
      if (note > 0) {
        this.playTone(note, 0.12, "square", 0.02, this.ctx.currentTime);
      }
      this.bgmStep = (this.bgmStep + 1) % melody.length;
    }, 150); // 150ms per beat
  }

  stopBGM() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
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
      "    rrrrr    ",
      "   rrrrrrrrr ",
      "   dddppkp   ",
      "  dppkppppp  ",
      "  dppdppkppp ",
      "  ddppdpppp  ",
      "    pppppp   ",
      "   rrbrrr    ",
      "  rrrbrrbrrr ",
      " rrrrbbbbbrrr",
      " pp rbybyr pp",
      " pppbbbbbbppp",
      "  p bbbbbbbb ",
      "   bbb  bbb  ",
      "  ddd    ddd ",
      " dddd    dddd"
    ],
    walk1: [
      "    rrrrr    ",
      "   rrrrrrrrr ",
      "   dddppkp   ",
      "  dppkppppp  ",
      "  dppdppkppp ",
      "  ddppdpppp  ",
      "    pppppp   ",
      "   rrbrrr    ",
      "  rrrbbbrr   ",
      "  rrrbbbbbrr ",
      "   rbybyr pp ",
      "   bbbbbb ppp",
      "  bbbbbbbb p ",
      " dddd  bbb   ",
      "  ddd  ddd   ",
      "       dddd  "
    ],
    walk2: [
      "    rrrrr    ",
      "   rrrrrrrrr ",
      "   dddppkp   ",
      "  dppkppppp  ",
      "  dppdppkppp ",
      "  ddppdpppp  ",
      "    pppppp   ",
      "   rrbrrr    ",
      "   rrbbbrrr  ",
      "   rrbbbbbrr ",
      "  pp rbybyr  ",
      " ppp bbbbbb  ",
      "  p bbbbbbbb ",
      "    bbb  dddd",
      "    ddd   ddd",
      "   dddd      "
    ],
    jump: [
      "    rrrrr    ",
      "   rrrrrrrrr ",
      "   dddppkp   ",
      "  dppkppppp  ",
      "  dppdppkppp ",
      "  ddppdpppp  ",
      "    pppppp   ",
      "  rrrbrrr    ",
      " rrrrbbbrr   ",
      " rrrrbbbbbrr ",
      "  pp rbybyr  ",
      "   pppbbbb   ",
      "    bbbbbbbb ",
      "   bbbb  bbb ",
      "  ddd    ddd ",
      " dddd    dddd"
    ],
    squashed: [
      "             ",
      "             ",
      "             ",
      "             ",
      "             ",
      "    rrrrr    ",
      "   rrrrrrrr  ",
      "  ddddppkppp ",
      "  ddppdppppp ",
      "   pppppppp  ",
      "  rrrbbbrrrr ",
      " pprbybyrppp ",
      "  pbbbbbbp   ",
      "  bbbbbbbb   ",
      "  dddddddd   ",
      " dddddddddd  "
    ],
    victory: [
      "    rrrrr    ",
      "   rrrrrrrrr ",
      "   dddppkp   ",
      "  dppkppppp  ",
      "  dppdppkppp ",
      "  ddppdpppp  ",
      "    pppppp   ",
      "   rrbrrr    ",
      "  rrrbrrbrrr ",
      " rrrrbbbbbrrr",
      " pp rbybyr pp",
      " pppbbbbbbppp",
      "  p bbbbbbbb ",
      "   bbb  bbb  ",
      "  ddd    ddd ",
      " dddd    dddd"
    ]
  },
  goomba: {
    walk1: [
      "      dddddd      ",
      "    dddddddddd    ",
      "   dddddddddddd   ",
      "  dddwkddkddwddd  ",
      " ddddwkddkddwdddd ",
      " dddddddddddddddd ",
      " dddddkddddkddddd ",
      " ddddddkkkkdddddd ",
      "  dddddddddddddd  ",
      "    nnnnnnnnnn    ",
      "   nnnnnnnnnnnn   ",
      "  nnnnnnnnnnnnnn  ",
      "  ddddd    ddddd  ",
      " dddddd   dddddd  ",
      " ddddd     ddddd  ",
      "  ddd       ddd   "
    ],
    walk2: [
      "      dddddd      ",
      "    dddddddddd    ",
      "   dddddddddddd   ",
      "  dddwkddkddwddd  ",
      " ddddwkddkddwdddd ",
      " dddddddddddddddd ",
      " dddddkddddkddddd ",
      " ddddddkkkkdddddd ",
      "  dddddddddddddd  ",
      "    nnnnnnnnnn    ",
      "   nnnnnnnnnnnn   ",
      "  nnnnnnnnnnnnnn  ",
      "   ddddd    dddd  ",
      "   dddddd  dddddd ",
      "   ddddd    ddddd ",
      "    ddd      ddd  "
    ],
    squashed: [
      "                  ",
      "                  ",
      "                  ",
      "                  ",
      "                  ",
      "                  ",
      "                  ",
      "    dddddddddd    ",
      "  dddddddddddddd  ",
      " ddddkddddddkdddd ",
      " ddddddkkkkdddddd ",
      "  dddddddddddddd  ",
      "   nnnnnnnnnnnn   ",
      "  dddddddddddddd  ",
      " dddddddddddddddd ",
      "dddddddddddddddddd"
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
    "      wwwwww      ",
    "    wwwwwwwwww    ",
    "  wwwwwwwwwwwwww  ",
    "wwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwww",
    "wwwwwwwwwwwwwwwwww",
    "  wwwwwwwwwwwwww  "
  ],
  hill: [
    "      gggg      ",
    "    gggggggg    ",
    "   gggggggggg   ",
    "  gggggggggggg  ",
    " gggggggggggggg ",
    "gggggggggggggggg",
    "gggggggggggggggg"
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
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      {/* Selector arrow (yellow) */}
      <motion.path
        d="M 2,12 L 6,16 L 2,20 Z"
        fill="#facc15"
        stroke="none"
        animate={isHovered ? { opacity: [0, 1, 0] } : { opacity: 0 }}
        transition={{ repeat: Infinity, duration: 0.3 }}
      />
      {/* Silhouette head (red) */}
      <motion.circle
        cx="16"
        cy="11"
        r="5"
        stroke={color}
        strokeWidth="2"
        animate={isHovered ? { scale: [1, 1.05, 1], y: [0, -0.5, 0] } : { y: [0, -0.4, 0] }}
        transition={{ repeat: Infinity, duration: isHovered ? 1 : 3, ease: "easeInOut" }}
      />
      {/* Eyes (white) */}
      <motion.line
        x1="14" y1="11" x2="14.5" y2="11"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.15 }}
      />
      <motion.line
        x1="17.5" y1="11" x2="18" y2="11"
        stroke="#ffffff"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ repeat: Infinity, repeatDelay: 4, duration: 0.15 }}
      />
      {/* Silhouette body (red) */}
      <motion.path
        d="M 8,23 C 8,19 11,18 16,18 C 21,18 24,19 24,23 L 24,26 L 8,26 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        animate={isHovered ? { y: [0, -0.5, 0] } : { y: 0 }}
      />
    </svg>
  );
}

function AnimatedEducationIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#60a5fa";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      <path d="M 16,24 L 16,8" stroke={color} strokeWidth="2.5" />
      <path d="M 16,24 C 11,24 6,21 6,21 L 6,9 C 6,9 11,12 16,12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <path d="M 16,24 C 21,24 26,21 26,21 L 26,9 C 26,9 21,12 16,12" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <motion.path
        d="M 16,12 C 20,12 23,10 25,9"
        stroke="#ffffff"
        strokeWidth="1.5"
        animate={isHovered ? { rotateY: [0, -180, 0] } : { rotateY: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
        style={{ originX: "16px" }}
      />
      <motion.path
        d="M 16,12 C 12,12 9,10 7,9"
        stroke="#ffffff"
        strokeWidth="1.5"
        animate={isHovered ? { rotateY: [0, 180, 0] } : { rotateY: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut", delay: 0.3 }}
        style={{ originX: "16px" }}
      />
      <motion.path
        d="M 8,15 L 14,15"
        stroke="#ffffff"
        strokeWidth="1"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
      <motion.path
        d="M 18,15 L 24,15"
        stroke="#ffffff"
        strokeWidth="1"
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
      />
    </svg>
  );
}

function AnimatedProjectsIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#facc15";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      <path d="M 4,26 L 4,8 C 4,8 6,6 9,6 L 14,6 L 17,9 L 28,9 L 28,26 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <motion.path
        d="M 4,26 L 4,12 L 28,12 L 28,26 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(0,0,0,0.2)"
        animate={isHovered ? { skewX: -6, scaleY: 0.85, originY: "26px" } : { skewX: 0, scaleY: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      />
      <motion.g
        animate={isHovered ? { y: [-2, -14, -2], opacity: [0.4, 1, 0.4] } : { y: [0, -3, 0], opacity: 0.6 }}
        transition={{ repeat: Infinity, duration: isHovered ? 1.5 : 3, ease: "easeInOut" }}
      >
        <path d="M 12,11 L 9,14 L 12,17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 20,11 L 23,14 L 20,17" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 17,9 L 15,19" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </motion.g>
    </svg>
  );
}

function AnimatedExperienceIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#34d399";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      <motion.path
        d="M 2,4 L 4,2 L 6,4 L 4,6 Z"
        fill="#ffffff"
        stroke="none"
        animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.8, delay: 0.2 }}
      />
      <motion.path
        d="M 28,6 L 29,4 L 30,6 L 29,8 Z"
        fill="#ffffff"
        stroke="none"
        animate={{ scale: [0, 1, 0], opacity: [0, 0.8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.9 }}
      />
      <path d="M 6,18 L 6,26 L 26,26 L 26,18 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      <rect x="14" y="16" width="4" height="4" rx="1" fill="#facc15" stroke="none" />
      <motion.path
        d="M 6,18 L 6,12 C 6,12 11,8 16,8 C 21,8 26,12 26,12 L 26,18 Z"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        fill="rgba(0,0,0,0.15)"
        animate={isHovered ? { y: -6, rotate: -8, originX: "6px", originY: "18px" } : { y: 0, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      />
      <motion.g
        animate={isHovered ? { y: [4, -12, 4], opacity: [0, 1, 0], scale: [0.8, 1.2, 0.8] } : { y: 4, opacity: 0 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
      >
        <circle cx="16" cy="12" r="3.5" stroke="#facc15" strokeWidth="1.5" fill="rgba(250,204,21,0.2)" />
        <line x1="16" y1="10.5" x2="16" y2="13.5" stroke="#facc15" strokeWidth="1" />
      </motion.g>
    </svg>
  );
}

function AnimatedSkillsIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#c084fc";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      <motion.g
        animate={isHovered ? { 
          x: [-1, 1, -1, 1, 0],
          y: [-0.5, 0.5, -0.5, 0.5, 0],
        } : { 
          rotate: [-3, 3, -3],
        }}
        transition={isHovered ? { 
          repeat: Infinity, 
          duration: 0.12, 
          ease: "linear"
        } : { 
          repeat: Infinity, 
          duration: 4, 
          ease: "easeInOut" 
        }}
        style={{ originX: "16px", originY: "16px" }}
      >
        <line x1="6" y1="16" x2="26" y2="16" stroke="#ffffff" strokeWidth="2.5" />
        <rect x="4" y="11" width="3" height="10" rx="1.5" stroke={color} strokeWidth="2" fill={color} />
        <rect x="1.5" y="13" width="2" height="6" rx="1" stroke={color} strokeWidth="1.5" />
        <rect x="25" y="11" width="3" height="10" rx="1.5" stroke={color} strokeWidth="2" fill={color} />
        <rect x="28.5" y="13" width="2" height="6" rx="1" stroke={color} strokeWidth="1.5" />
        <motion.path
          d="M 12,6 L 10,4"
          stroke="#facc15"
          strokeWidth="1.5"
          animate={isHovered ? { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] } : { opacity: 0 }}
          transition={{ repeat: Infinity, duration: 0.6 }}
        />
        <motion.path
          d="M 20,6 L 22,4"
          stroke="#facc15"
          strokeWidth="1.5"
          animate={isHovered ? { opacity: [0, 1, 0], scale: [0.5, 1, 0.5] } : { opacity: 0 }}
          transition={{ repeat: Infinity, duration: 0.6, delay: 0.3 }}
        />
      </motion.g>
    </svg>
  );
}

function AnimatedContactIcon({ isHovered, hexColor }: { isHovered: boolean; hexColor?: string }) {
  const color = hexColor || "#f472b6";
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" className="fill-none stroke-current text-white overflow-visible">
      <motion.circle
        cx="27"
        cy="5"
        r="2.5"
        fill="#ef4444"
        stroke="none"
        animate={{ y: [0, -3, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      />
      <motion.path
        d="M 10,13 L 22,13 L 22,23 L 10,23 Z"
        stroke="#ffffff"
        strokeWidth="1.5"
        fill="#ffffff"
        animate={isHovered ? { y: -8, scaleY: 1.1 } : { y: 0, scaleY: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        style={{ originY: "23px" }}
      />
      <path d="M 5,12 L 5,25 L 27,25 L 27,12 Z" stroke={color} strokeWidth="2" strokeLinejoin="round" fill="rgba(0,0,0,0.2)" />
      <motion.path
        d="M 5,12 L 16,20 L 27,12"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        animate={isHovered ? { scaleY: -1, y: -0.5, originY: "12px" } : { scaleY: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      />
    </svg>
  );
}

interface MenuCardProps {
  title: string;
  hexColor: string;
  isActive: boolean;
  onClick: () => void;
  renderIcon: (isHovered: boolean, hexColor: string) => React.ReactNode;
}

const getLegibleColor = (hex: string) => {
  switch (hex) {
    case "#ef4444": return "#b91c1c";
    case "#60a5fa": return "#1d4ed8";
    case "#facc15": return "#a16207";
    case "#34d399": return "#047857";
    case "#c084fc": return "#6b21a8";
    case "#f472b6": return "#be185d";
    default: return hex;
  }
};

function MenuCard({
  title,
  hexColor,
  isActive,
  onClick,
  renderIcon
}: MenuCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const baseBoxShadow = isActive ? `6px 6px 0px ${hexColor}` : "4px 4px 0px #000000";
  const baseTranslate = isActive ? { x: -2, y: -2 } : { x: 0, y: 0 };
  const contrastColor = getLegibleColor(hexColor);

  return (
    <motion.button
      variants={{
        hidden: { opacity: 0, scale: 0.85, y: 25 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 12 } }
      }}
      animate={baseTranslate}
      whileHover={{ 
        x: -6,
        y: -6,
        boxShadow: `10px 10px 0px ${hexColor}`,
        borderColor: "#000000",
        transition: { type: "spring", stiffness: 450, damping: 14 }
      }}
      whileTap={{ 
        x: 4,
        y: 4,
        boxShadow: "0px 0px 0px #000000",
        transition: { type: "spring", stiffness: 450, damping: 14 }
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ boxShadow: baseBoxShadow }}
      className="group relative flex flex-col items-center justify-center p-[3px] bg-[#a2a6a8] border-4 border-black text-white rounded-none aspect-[1/1] transition-colors duration-200 overflow-hidden"
    >
      {/* Inner dashed console border frame */}
      <div 
        className="w-full h-full border-2 border-dashed p-4 flex flex-col items-center justify-center relative rounded-none transition-all duration-200 z-10"
        style={{ 
          borderColor: isHovered || isActive ? contrastColor : `${contrastColor}25`,
          boxShadow: isHovered || isActive ? "inset 0 0 16px rgba(0,0,0,0.15)" : "inset 0 0 8px rgba(0,0,0,0.06)"
        }}
      >
        {/* Dynamic Center Glow */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-300"
          style={{ 
            background: `radial-gradient(circle at center, ${contrastColor}18 0%, transparent 75%)`,
            opacity: isHovered || isActive ? 1 : 0
          }}
        />

        {/* Diagonal Gloss Glass Reflection */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 opacity-40"
          style={{ 
            background: "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 45%, transparent 45.1%)"
          }}
        />

        {/* Tech Vector Grid texture */}
        <div 
          className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
          style={{ 
            backgroundImage: isHovered || isActive
              ? `linear-gradient(to right, ${contrastColor}22 1px, transparent 1px), linear-gradient(to bottom, ${contrastColor}22 1px, transparent 1px)`
              : `linear-gradient(to right, ${contrastColor}0f 1px, transparent 1px), linear-gradient(to bottom, ${contrastColor}0f 1px, transparent 1px)`,
            backgroundSize: "16px 16px"
          }}
        />
        
        {/* Scanline moving overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div 
            className="w-full h-1/2 bg-gradient-to-b from-transparent via-black/5 to-transparent absolute top-0 left-0 arcade-scanline transition-opacity duration-300"
            style={{ opacity: isHovered || isActive ? 0.6 : 0.15 }}
          />
        </div>

        {/* Retro HUD Corner L-Brackets */}
        <div 
          className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t-2 border-l-2 transition-colors duration-200 pointer-events-none"
          style={{ borderColor: isHovered || isActive ? contrastColor : `${contrastColor}35` }}
        />
        <div 
          className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t-2 border-r-2 transition-colors duration-200 pointer-events-none"
          style={{ borderColor: isHovered || isActive ? contrastColor : `${contrastColor}35` }}
        />
        <div 
          className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b-2 border-l-2 transition-colors duration-200 pointer-events-none"
          style={{ borderColor: isHovered || isActive ? contrastColor : `${contrastColor}35` }}
        />
        <div 
          className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b-2 border-r-2 transition-colors duration-200 pointer-events-none"
          style={{ borderColor: isHovered || isActive ? contrastColor : `${contrastColor}35` }}
        />

        {/* Pulsing indicator block (square) */}
        <span 
          className="absolute top-2 right-2 w-2 h-2 rounded-none shadow-[0_0_6px_currentColor] arcade-flicker"
          style={{ backgroundColor: contrastColor, color: contrastColor }}
        />

        {/* Custom Icon Box container (dark insert slot) */}
        <div className="relative mb-2 flex items-center justify-center">
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-200 rounded-none"
            style={{ backgroundColor: hexColor }}
          />
          <div className="relative p-3 bg-[#18181b] border-2 border-black rounded-none group-hover:scale-105 group-hover:bg-[#111113] transition-all duration-200 shadow-md">
            {renderIcon(isHovered, hexColor)}
          </div>
        </div>

        <span 
          className="text-[10px] sm:text-xs font-bold uppercase tracking-wider select-none font-retro transition-colors duration-200"
          style={{ color: isHovered || isActive ? "#000000" : contrastColor }}
        >
          {title}
        </span>
      </div>
    </motion.button>
  );
}

// ==========================================
// 4. MAIN COMPONENT
// ==========================================
export function MarioPortfolio() {
  const [phase, setPhase] = useState<"start" | "loading" | "dashboard" | "minigame">("start");
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("WORLD 1-1");
  const [bgmMuted, setBgmMuted] = useState(true);
  const [sfxMuted, setSfxMuted] = useState(false);

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
    synth.playCoin();
    setPhase("loading");
    // Attempt BGM start after short interaction delay
    setTimeout(() => {
      setBgmMuted(false);
      synth.startBGM();
    }, 1000);
  };

  const openSection = (section: string) => {
    synth.playCoin();
    setActiveSection(section);
  };

  const closeSection = () => {
    synth.playShrink();
    setActiveSection(null);
  };

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
    synth.playCoin();
    setPhase("minigame");
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
    const gravity = 0.45;

    // Player state
    const player = {
      x: 100,
      y: 300,
      vx: 0,
      vy: 0,
      width: 26,
      height: 32,
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
      { x: 320, y: groundY - 32, vx: -1.2, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 620, y: groundY - 32, vx: -1.0, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 950, y: groundY - 32, vx: -1.5, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1250, y: groundY - 32, vx: -0.8, width: 32, height: 32, isSquashed: false, squashTimer: 0 },
      { x: 1680, y: groundY - 32, vx: -1.3, width: 32, height: 32, isSquashed: false, squashTimer: 0 }
    ];

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
    let flagY = flagYStart;
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

      // Input Check
      const goLeft = keyMap.ArrowLeft || keyMap.KeyA || keys.left;
      const goRight = keyMap.ArrowRight || keyMap.KeyD || keys.right;
      const jump = keyMap.ArrowUp || keyMap.Space || keyMap.KeyW || keys.up;
      const enterPipe = keyMap.ArrowDown || keyMap.KeyS || keys.down;

      if (goLeft) {
        player.vx = -4;
        player.facing = "left";
      } else if (goRight) {
        player.vx = 4;
        player.facing = "right";
      } else {
        player.vx = 0;
      }

      // Jump
      if (jump && player.grounded) {
        player.vy = -11.5;
        player.grounded = false;
        synth.playJump();
      }

      // Gravity and Movement
      player.vy += gravity;
      player.x += player.vx;
      player.y += player.vy;

      // Platformer constraints
      if (player.x < 0) player.x = 0;
      if (player.x > levelWidth - player.width) player.x = levelWidth - player.width;

      // Ground collision
      if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.grounded = true;
      }

      // Animation calculations
      if (!player.grounded) {
        player.animFrame = 3; // jump sprite
      } else if (player.vx !== 0) {
        player.animTimer++;
        if (player.animTimer > 6) {
          player.animFrame = player.animFrame === 1 ? 2 : 1;
          player.animTimer = 0;
        }
      } else {
        player.animFrame = 0; // standing
      }

      // Blink timer for Goomba hit protection
      if (player.isBlinking) {
        player.blinkTimer -= 16;
        if (player.blinkTimer <= 0) {
          player.isBlinking = false;
        }
      }

      // Block Bounce animations
      blocks.forEach(b => {
        if (b.bounceY > 0) {
          b.bounceY -= 1;
        }
      });

      // COLLISION WITH BLOCKS (FROM BELOW)
      blocks.forEach(b => {
        // Simple AABB box collision
        const blockX = b.x;
        const blockY = b.y - b.bounceY;
        const size = tileSize;

        if (
          player.x < blockX + size &&
          player.x + player.width > blockX &&
          player.y < blockY + size &&
          player.y + player.height > blockY
        ) {
          // Resolve vertical collision
          const overlapX = Math.min(player.x + player.width - blockX, blockX + size - player.x);
          const overlapY = Math.min(player.y + player.height - blockY, blockY + size - player.y);

          if (overlapY < overlapX) {
            if (player.vy < 0) {
              // Hitting block from below
              player.y = blockY + size;
              player.vy = 0;

              if (!b.hit) {
                b.bounceY = 8;
                b.hit = true;
                if (b.type === "question") {
                  b.type = "empty";
                  synth.playCoin();
                  setCoinsCollected(c => c + 1);
                  setScore(s => s + 100);

                  // Spawn flying text content
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
                  synth.playStomp(); // break noise
                }
              }
            } else {
              // Landing on top of block
              player.y = blockY - player.height;
              player.vy = 0;
              player.grounded = true;
            }
          } else {
            // Horizontal side collision
            if (player.vx > 0) {
              player.x = blockX - player.width;
            } else if (player.vx < 0) {
              player.x = blockX + size;
            }
          }
        }
      });

      // PIPE PORTAL TRIGGER
      pipes.forEach(pipe => {
        if (
          player.x + player.width / 2 > pipe.x &&
          player.x + player.width / 2 < pipe.x + pipe.width &&
          player.y + player.height >= pipe.y &&
          player.y + player.height <= pipe.y + 10
        ) {
          if (enterPipe) {
            synth.playShrink();
            player.vx = 0;
            player.vy = 0;
            // Enter transition
            setTimeout(() => {
              openSection(pipe.targetSection);
            }, 300);
          }
        }
      });

      // ENEMY COLLISION & RUNNING LOGIC
      enemies.forEach(enemy => {
        if (enemy.isSquashed) {
          enemy.squashTimer += 16;
          return;
        }

        // Pacing back and forth
        enemy.x += enemy.vx;
        // Collision with map boundaries for enemy
        if (enemy.x < 150 || enemy.x > levelWidth - 300) {
          enemy.vx *= -1;
        }

        // Simple box check with player
        if (
          player.x < enemy.x + enemy.width &&
          player.x + player.width > enemy.x &&
          player.y < enemy.y + enemy.height &&
          player.y + player.height > enemy.y
        ) {
          // Check if Mario is landing on top of the Goomba
          const isLanding = (player.y + player.height - player.vy <= enemy.y + 12) && player.vy > 0;
          if (isLanding) {
            enemy.isSquashed = true;
            player.vy = -6; // bounce
            synth.playStomp();
            setScore(s => s + 200);
          } else if (!player.isBlinking) {
            // Player gets hit - no death, just bounce back and temporary blink protection
            synth.playShrink();
            player.isBlinking = true;
            player.blinkTimer = 1000; // 1s protection
            player.vx = player.facing === "right" ? -5 : 5;
            player.vy = -3;
          }
        }
      });

      // FLAGPOLE END-OF-STAGE COLLISION
      if (!flagHit && player.x >= flagPoleX) {
        flagHit = true;
        player.vx = 0;
        player.vy = 0;
        player.x = flagPoleX;
        player.victoryWalk = true;
        synth.playStageClear();
      }

      // Update flying text positions
      floatingTexts.forEach((ft, idx) => {
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) {
          floatingTexts.splice(idx, 1);
        }
      });

      // Flag slide down animation
      if (flagHit && flagY < groundY - 40) {
        flagY += 4;
      }

      // Camera Scrolling
      // Center camera on player, clamp bounds
      cameraX = Math.max(0, Math.min(levelWidth - canvas.width, player.x - canvas.width / 2 + player.width / 2));
    };

    const draw = () => {
      if (!ctx) return;

      // 1. Draw Sky Background
      ctx.fillStyle = "#38BDF8";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 2. Draw Clouds (Static / Parallax)
      // Clouds
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

      // 4. Draw Ground Blocks
      // Simple ground drawing
      ctx.fillStyle = "#7A431D"; // Dark brown dirt
      ctx.fillRect(0 - cameraX, groundY, levelWidth, canvas.height - groundY);
      
      // Ground top green trim
      ctx.fillStyle = "#24C124";
      ctx.fillRect(0 - cameraX, groundY, levelWidth, 8);

      // 5. Draw Blocks
      blocks.forEach(b => {
        const sprite = SPRITES[b.type as "brick" | "question" | "empty"] || SPRITES.brick;
        drawPixelSprite(ctx, b.x - cameraX, b.y - b.bounceY, sprite, 2.0);
      });

      // 6. Draw Pipes (Portals)
      pipes.forEach(pipe => {
        // Draw label text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = '8px "Press Start 2P", Courier, monospace';
        ctx.textAlign = "center";
        ctx.fillText(pipe.label, pipe.x + pipe.width / 2 - cameraX, pipe.y - 15);
        ctx.fillStyle = "#000000";
        ctx.fillText("▼ ENTER", pipe.x + pipe.width / 2 - cameraX, pipe.y - 5);

        // Draw Pipe Base
        ctx.fillStyle = COLOR_MAP.g;
        ctx.fillRect(pipe.x - cameraX, pipe.y + 16, pipe.width, pipe.height - 16);
        ctx.fillStyle = COLOR_MAP.t; // Shadow
        ctx.fillRect(pipe.x + pipe.width - 12 - cameraX, pipe.y + 16, 12, pipe.height - 16);
        
        // Draw Pipe Top Rim
        ctx.fillStyle = COLOR_MAP.g;
        ctx.fillRect(pipe.x - 4 - cameraX, pipe.y, pipe.width + 8, 16);
        ctx.fillStyle = COLOR_MAP.t;
        ctx.fillRect(pipe.x + pipe.width - 8 - cameraX, pipe.y, 12, 16);

        // Draw Pipe Borders
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x - cameraX, pipe.y + 16, pipe.width, pipe.height - 16);
        ctx.strokeRect(pipe.x - 4 - cameraX, pipe.y, pipe.width + 8, 16);
      });

      // 7. Draw Goombas
      enemies.forEach(enemy => {
        if (enemy.isSquashed && enemy.squashTimer > 400) return; // Hide squashed goomba after 400ms

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
          2.0, 
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
  }, [phase, keys]);

  // ==========================================
  // VIEW RENDER PARTS
  // ==========================================

  // Start Screen view
  const renderStartScreen = () => (
    <div className="w-full min-h-screen bg-transparent flex flex-col items-center justify-center p-6 relative select-none font-retro">
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
      default: return "";
    }
  };

  const getSectionContent = (section: string) => {
    switch (section) {
      case "profile":
        return (
          <div className="space-y-6">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 12 }}
              className="flex items-center gap-4 flex-col sm:flex-row bg-slate-950 border-4 border-black p-4 rounded-2xl shadow-[4px_4px_0px_#000] relative overflow-hidden text-white"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -z-10 pointer-events-none" />
              <motion.span 
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="text-5xl bg-red-500/20 p-4 border-2 border-dashed border-red-500 rounded-full"
              >
                👨‍💻
              </motion.span>
              <div className="text-center sm:text-left space-y-1.5 z-10">
                <div className="text-base sm:text-lg font-bold text-yellow-400">{PROFILE_DATA.name} ({PROFILE_DATA.nickname})</div>
                <div className="text-[10px] sm:text-xs text-sky-400 uppercase tracking-widest font-black">{PROFILE_DATA.title}</div>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-xs leading-relaxed uppercase tracking-wider text-slate-300 bg-slate-950/60 p-4 border-2 border-black rounded-2xl"
            >
              {PROFILE_DATA.bio}
            </motion.p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email Card (Interactive Copy) */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => copyToClipboard(PROFILE_DATA.email, "email")}
                className="cursor-pointer bg-slate-950 p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] relative group transition-all"
              >
                <span className="text-red-400 font-bold text-[10px] tracking-wider uppercase">EMAIL (CLICK TO COPY)</span>
                <div className="text-xs text-slate-200 mt-1 truncate group-hover:text-red-400 transition-colors">{PROFILE_DATA.email}</div>
                {copiedField === "email" && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-3 right-4 px-2 py-1 bg-yellow-400 text-black text-[8px] font-black border-2 border-black rounded-full"
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
                className="cursor-pointer bg-slate-950 p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] relative group transition-all"
              >
                <span className="text-blue-400 font-bold text-[10px] tracking-wider uppercase">PHONE (CLICK TO COPY)</span>
                <div className="text-xs text-slate-200 mt-1 group-hover:text-blue-400 transition-colors">{PROFILE_DATA.phone}</div>
                {copiedField === "phone" && (
                  <motion.span 
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute -top-3 right-4 px-2 py-1 bg-yellow-400 text-black text-[8px] font-black border-2 border-black rounded-full"
                  >
                    COPIED! 🪙
                  </motion.span>
                )}
              </motion.div>

              {/* Location Card */}
              <motion.div
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-slate-950 p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000]"
              >
                <span className="text-yellow-400 font-bold text-[10px] tracking-wider uppercase">LOCATION</span>
                <div className="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
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
                className="bg-slate-950 p-4 border-4 border-black rounded-2xl shadow-[4px_4px_0px_#000] block group transition-all"
              >
                <span className="text-green-400 font-bold text-[10px] tracking-wider uppercase flex justify-between items-center">
                  <span>GITHUB CASTLE</span>
                  <ExternalLink className="size-3 text-green-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
                <div className="text-xs text-slate-200 mt-1 group-hover:text-green-400 transition-colors">github.com/ProfFariz</div>
              </motion.a>
            </div>

            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="bg-yellow-950/60 p-3.5 border-2 border-yellow-500 rounded-2xl text-[10px] text-yellow-400 uppercase tracking-widest text-center shadow-[4px_4px_0px_rgba(234,179,8,0.2)]"
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
              className="bg-blue-950/40 border-4 border-blue-500 p-5 rounded-2xl shadow-[4px_4px_0px_#000] space-y-3 relative overflow-hidden"
            >
              <div className="absolute top-2 right-4 text-3xl opacity-20 pointer-events-none select-none">🎓</div>
              <div className="text-yellow-400 font-bold text-sm sm:text-base uppercase tracking-wider">{EDUCATION_DATA.school}</div>
              <div className="flex gap-2 flex-wrap">
                <span className="text-[9px] px-2 py-0.5 bg-emerald-500 text-white font-black border-2 border-black rounded-full uppercase tracking-wider">
                  STATUS: {EDUCATION_DATA.status}
                </span>
                <span className="text-[9px] px-2 py-0.5 bg-sky-500 text-white font-black border-2 border-black rounded-full uppercase tracking-wider">
                  {EDUCATION_DATA.focus}
                </span>
              </div>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="bg-slate-950 border-4 border-black p-5 rounded-2xl leading-relaxed text-slate-300 text-[11px] sm:text-xs tracking-wide uppercase font-retro"
            >
              {EDUCATION_DATA.description}
            </motion.p>

            {/* Interactive Subjects/Badges block */}
            <div className="space-y-2.5">
              <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black">CLICK COURSES TO BOUNCE:</div>
              <div className="flex flex-wrap gap-2">
                {["Data Structures", "Algorithms", "Web Architecture", "UI Design", "Software Life Cycle", "Database Systems"].map((subj, idx) => (
                   <motion.button
                     key={idx}
                     whileHover={{ scale: 1.08, y: -2 }}
                     whileTap={{ scale: 0.95 }}
                     onClick={() => synth.playJump()}
                     className="px-3 py-1.5 bg-slate-950 border-2 border-slate-700 text-sky-400 text-[9px] uppercase font-bold rounded-xl hover:border-sky-400 transition-colors shadow-[2px_2px_0px_#000]"
                   >
                     📘 {subj}
                   </motion.button>
                ))}
              </div>
            </div>

            <div className="flex justify-center text-4xl animate-bounce pt-2">
              🎓
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6 relative pl-6 sm:pl-8 py-2">
            {/* Vertical level track line */}
            <div className="absolute left-[13px] sm:left-[17px] top-4 bottom-4 w-1.5 bg-slate-800 border-l border-r border-slate-600 rounded-full" />

            {EXPERIENCE_DATA.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.02 }}
                className="relative bg-slate-950 border-4 border-black p-4 sm:p-5 rounded-2xl shadow-[4px_4px_0px_#000] flex flex-col md:flex-row gap-4"
              >
                {/* Timeline Dot Node */}
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 3, delay: idx * 0.5 }}
                  className="absolute -left-[27px] sm:-left-[35px] top-6 w-5 h-5 rounded-full bg-emerald-500 border-4 border-black flex items-center justify-center text-[7px]"
                >
                  ⭐
                </motion.div>

                <div className="md:w-36 text-yellow-400 shrink-0 uppercase tracking-wider space-y-1">
                  <div className="text-[10px] font-black">{exp.period}</div>
                  <div className="text-[9px] text-sky-400 font-bold bg-sky-950/40 px-2 py-0.5 border border-sky-800/40 rounded-full inline-block md:block text-center">{exp.company}</div>
                </div>
                <div className="flex-1 text-slate-300 leading-relaxed uppercase tracking-wider space-y-1.5">
                  <div className="text-white font-bold text-xs sm:text-sm">{exp.role}</div>
                  <div className="text-[10px] sm:text-xs text-slate-400 font-retro leading-normal">{exp.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <div className="text-[9px] text-slate-400 uppercase tracking-widest font-black mb-1">STAGES CLEAR SELECTION:</div>
            {PROJECTS_DATA.map((proj, idx) => (
              <motion.div 
                key={proj.id} 
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: idx * 0.12, type: "spring" }}
                whileHover={{ scale: 1.02 }}
                className="bg-slate-950 border-4 border-black p-5 text-[10px] sm:text-xs rounded-2xl space-y-3 relative overflow-hidden shadow-[6px_6px_0px_#000] hover:shadow-[8px_8px_0px_#000] transition-all"
              >
                <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-black text-[7px] font-black border-2 border-black rounded-full uppercase tracking-wider font-retro">
                  {proj.badge}
                </div>
                
                <h3 className="text-sm font-black text-yellow-400 uppercase tracking-wider font-retro flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center bg-red-500 border border-black text-white rounded text-[8px]">1-{idx+1}</span>
                  {proj.title}
                </h3>
                
                <p className="text-[10px] sm:text-xs text-slate-300 uppercase tracking-wide leading-relaxed font-retro">
                  {proj.desc}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-800/40">
                  {proj.stack.map((s, i) => (
                    <motion.span 
                      key={i} 
                      whileHover={{ y: -2, scale: 1.05 }}
                      onClick={() => synth.playCoin()}
                      className="cursor-default px-2.5 py-1 bg-slate-900 border-2 border-slate-700 text-[8px] text-sky-400 font-bold uppercase tracking-wider rounded-lg shadow-[1px_1px_0px_#000]"
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
                    className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-red-600 border-4 border-black text-[10px] text-white uppercase font-bold tracking-widest font-retro shadow-[3px_3px_0px_#000] hover:bg-red-500 hover:shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-xl"
                  >
                    <span>Visit Castle</span>
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
            <p className="text-center text-slate-400 text-[10px] uppercase font-black tracking-widest mb-2 animate-pulse">
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
                  className="cursor-pointer bg-slate-950 border-4 border-black p-4 rounded-2xl space-y-3 shadow-[4px_4px_0px_#000] relative overflow-hidden select-none transition-all group animate-fade-in"
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[11px] font-black text-yellow-400 uppercase tracking-wider">{skill.name}</span>
                    <span className="text-[8px] px-2 py-0.5 bg-indigo-900 border-2 border-indigo-500 text-white font-black rounded-full uppercase group-hover:animate-bounce">
                      {skill.item.split(" ").slice(-1)[0]}
                    </span>
                  </div>
                  
                  <p className="text-[9px] text-slate-400 leading-normal uppercase">
                    {skill.desc}
                  </p>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] text-slate-550 font-bold">
                      <span>POWER LEVEL</span>
                      <span className="text-emerald-400 group-hover:scale-110 transition-transform">{skill.rating}%</span>
                    </div>
                    {/* Retro health/power bar that animates from 0% to rating% */}
                    <div className="w-full h-4 bg-slate-900 border-2 border-black p-0.5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.rating}%` }}
                        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                        className="h-full bg-emerald-500 rounded-full"
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
                className="bg-slate-950 border-4 border-black p-8 text-center space-y-5 font-retro uppercase rounded-2xl shadow-[6px_6px_0px_#000]"
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
                  className="px-5 py-2.5 bg-red-600 border-4 border-black text-white hover:bg-red-500 text-[10px] uppercase font-bold tracking-widest shadow-[3px_3px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-xl"
                >
                  Send another letter
                </motion.button>
              </motion.div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 font-retro text-[10px] sm:text-xs bg-amber-50 p-5 sm:p-6 border-4 border-black text-slate-900 rounded-3xl shadow-[6px_6px_0px_#000] relative text-left">
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
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase"
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
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase"
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
                    className="w-full p-3 bg-white border-2 border-black text-slate-950 font-bold rounded-xl focus:ring-2 focus:ring-pink-500 focus:outline-none uppercase"
                    placeholder="ENTER COOPERATIVE WORK DETAILS..."
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 border-4 border-black text-white font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-[4px_4px_0px_#000] active:translate-y-0.5 active:shadow-none transition-all rounded-2xl"
                >
                  Send Letter ✉️
                </motion.button>
              </form>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  // Main menu dashboard screen view
  const renderDashboard = () => (
    <div className="w-full min-h-screen bg-transparent flex flex-col relative select-none font-retro overflow-hidden">
      
      {/* 2. Top Header HUD Panel */}
      <div className="w-full bg-black/40 backdrop-blur-md border-b border-white/10 text-white px-6 py-3 flex justify-between items-center z-10 relative select-none">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs tracking-wider">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400 font-bold uppercase mr-1">PLAYER</span>
          <span className="text-white font-retro font-black">FARIZ</span>
        </div>

        {/* Global Controls & Mode HUD */}
        <div className="flex items-center gap-6 text-[10px] sm:text-xs tracking-wider">
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

          {/* Audio & Reset Controls */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-4">
            <button 
              onClick={() => setBgmMuted(!bgmMuted)}
              className="p-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-colors"
              title="Toggle Music"
            >
              {bgmMuted ? <VolumeX className="size-3.5 text-red-500" /> : <Volume2 className="size-3.5 text-green-500" />}
            </button>
            <button 
              onClick={() => setSfxMuted(!sfxMuted)}
              className="p-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-[8px] font-bold rounded transition-colors uppercase px-1.5"
              title="Toggle SFX"
            >
              SFX: {sfxMuted ? "OFF" : "ON"}
            </button>
            <button 
              onClick={handleResetGame}
              className="p-1 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded transition-colors"
              title="Reset Game"
            >
              <RefreshCw className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Layout splits */}
      <div className="flex-1 flex flex-col lg:flex-row z-10 relative max-w-7xl mx-auto w-full p-4 md:p-8 gap-8 items-center justify-center">
        
        {/* Left Side: Playground 3x2 Grid and Helper Text */}
        <div className={`w-full lg:w-[55%] xl:w-[60%] flex flex-col gap-6 ${
          activeSection && activeSection !== "clear" ? "hidden lg:flex" : "flex"
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

          {/* Description Helper text card */}
          <div className="bg-black/25 backdrop-blur-[20px] border border-white/10 p-4 rounded-2xl text-[9px] sm:text-[10px] text-slate-400 max-w-md uppercase tracking-wider leading-relaxed text-left">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-slate-400 mr-2 animate-pulse" />
            Ultra-thin glass — 25% black, 20px blur, 1px border. No heavy fills, just subtle dots. Designed to showcase your GIF, not compete with it.
          </div>
        </div>

        {/* Right Side: Interactive Display Console Screen */}
        <div className={`flex-1 w-full lg:w-[45%] xl:w-[40%] flex flex-col justify-center items-center ${
          activeSection && activeSection !== "clear" ? "block" : "block"
        }`}>
          <AnimatePresence mode="wait">
            {!activeSection || activeSection === "clear" ? (
              <motion.div 
                key="adventure-time"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
                className="flex flex-col justify-between items-center lg:items-end min-h-[400px] py-4 w-full"
              >
                {/* Main Menu Title Box */}
                <div className="flex-1 flex flex-col justify-center items-center text-center lg:text-right w-full pr-0 lg:pr-8">
                  <div className="text-[9px] text-yellow-400 uppercase tracking-widest font-black mb-3 bg-black/40 border border-white/10 px-3.5 py-1 rounded-full backdrop-blur-md">
                    MAIN MENU
                  </div>
                  
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)] font-retro select-none">
                    ADVENTURE<br />TIME!
                  </h2>
                </div>

                {/* Circular Play button with text label */}
                <div className="flex items-center gap-4 justify-end w-full pr-0 lg:pr-8 mt-6">
                  <div className="text-[9px] text-slate-400 font-bold uppercase tracking-wider text-right max-w-[180px] leading-normal hidden sm:block">
                    Elegant floating controls.<br />Let your animated background shine through.
                  </div>
                  
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
                      transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                      className="absolute inset-0 border-2 border-white/20 rounded-full pointer-events-none"
                    />
                    <motion.button
                      onClick={startPlatformer}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center bg-black/25 backdrop-blur-[20px] border border-white/10 rounded-full hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all cursor-pointer"
                      title="Play Minigame"
                    >
                      <svg 
                        className="w-10 h-10 text-white fill-white translate-x-1" 
                        viewBox="0 0 24 24"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key={activeSection}
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 30 }}
                transition={{ type: "spring", stiffness: 180, damping: 15 }}
                className="w-full bg-black/35 backdrop-blur-[20px] border border-white/10 text-white p-5 sm:p-6 md:p-8 rounded-[2rem] flex flex-col relative z-10"
              >
                {/* Back Button */}
                <motion.button
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeSection}
                  className="absolute top-4 right-4 bg-white/5 border border-white/10 hover:bg-white/15 text-white px-3.5 py-1.5 rounded-2xl text-[9px] font-black tracking-wider transition-all flex items-center gap-1 cursor-pointer font-retro"
                  title="Return to Menu"
                >
                  <ArrowLeft className="size-3" />
                  <span>BACK</span>
                </motion.button>

                <h3 className="text-sm sm:text-base md:text-lg text-yellow-400 border-b border-white/10 pb-4 mb-6 uppercase tracking-widest font-black pr-16 text-left leading-relaxed">
                  {getSectionTitle(activeSection)}
                </h3>

                <div className="text-xs text-left max-h-[50vh] overflow-y-auto pr-1">
                  {getSectionContent(activeSection)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  // Platformer Minigame view (with retro arcade layout and touch buttons)
  const renderMinigame = () => (
    <div className="w-full min-h-screen bg-transparent flex flex-col select-none font-retro text-white p-4">
      {/* Back button */}
      <div className="max-w-4xl mx-auto w-full mb-3 flex justify-between items-center">
        <button
          onClick={() => {
            synth.playShrink();
            setPhase("dashboard");
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
      <div className="max-w-4xl mx-auto w-full bg-slate-950 border-4 border-red-600 p-2 md:p-4 shadow-[12px_12px_0px_#000] rounded-lg">
        {/* Canvas viewport container */}
        <div className="relative border-4 border-black bg-sky-400 w-full overflow-hidden aspect-[16/9]">
          <canvas
            ref={canvasRef}
            className="w-full h-full block image-render-pixel"
          />

          {/* Quick Level Instructions overlay */}
          <div className="absolute top-2 left-2 bg-black/60 p-2 text-[8px] rounded border border-white/20 text-slate-200 space-y-1 pointer-events-none">
            <div>KEYS: A/D/Arrows = Move</div>
            <div>SPACE/W/Up = Jump</div>
            <div>S/Down = Enter Pipe Portal</div>
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
            synth.playCoin();
            closeSection();
            setPhase("dashboard");
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

  // Switch between stages
  return (
    <div className="w-full min-h-screen relative overflow-hidden select-none bg-slate-950 text-white">
      {/* Global Background GIF (only on start, dashboard, minigame phases) */}
      {phase !== "loading" && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/209343.gif"
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay for better contrast and readability */}
          <div className="absolute inset-0 bg-black/20 z-0" />
        </div>
      )}

      {/* Main content wrapper */}
      <div className="relative z-10 w-full min-h-screen flex flex-col">
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
    </div>
  );
}
