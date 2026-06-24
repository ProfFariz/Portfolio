"use client";

import React, { useState, useEffect } from "react";
import { synth } from "@/lib/audio-synthesizer";
import { motion, AnimatePresence } from "framer-motion";
import { HackerTerminal } from "./hacker-terminal";
import { Power, ArrowRight, Laptop, Cpu } from "lucide-react";

interface WorkspaceDesk3DProps {
  onZoomComplete?: () => void;
}

export function WorkspaceDesk3D({ onZoomComplete }: WorkspaceDesk3DProps) {
  const [currentPage, setCurrentPage] = useState<"desk" | "zooming" | "terminal">("desk");
  const [laptopOpen, setLaptopOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (currentPage !== "desk") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const startSequence = () => {
    if (currentPage !== "desk") return;

    // Phase 1: Play Swoosh & Open Laptop
    synth.playHingeSwoosh();
    setLaptopOpen(true);
    setCurrentPage("zooming");

    // Phase 2: Wait for hinge swing, then zoom camera
    setTimeout(() => {
      // Zoom camera trigger is automatically driven by CSS transition state
      synth.playBeep(980, 0.18);
    }, 700);

    // Phase 3: Transition to full terminal screen or trigger zoom complete
    setTimeout(() => {
      if (onZoomComplete) {
        onZoomComplete();
      } else {
        setCurrentPage("terminal");
      }
    }, 2400); // 2.4s matches zoom transform ease duration
  };

  const exitTerminal = () => {
    synth.playBeep(450, 0.2);
    setCurrentPage("desk");
    setLaptopOpen(false);
    setMousePos({ x: 0, y: 0 });
  };

  if (!isClient) return null;

  if (isMobile) {
    return (
      <div className="w-full min-h-screen p-4 bg-slate-950">
        <HackerTerminal />
      </div>
    );
  }

  // CSS 3D Transform calculations
  const isZoomed = currentPage === "zooming" || currentPage === "terminal";

  // Desk tilt angles
  const rotateX = isZoomed ? 0 : 54 + mousePos.y * -8;
  const rotateY = isZoomed ? 0 : mousePos.x * 6;
  const rotateZ = isZoomed ? 0 : -12 + mousePos.x * 8;
  const translateZ = isZoomed ? 680 : 0; // Moves workspace closer to screen (zooming)
  const translateY = isZoomed ? 110 : 0; // Shifting table to center laptop screen

  return (
    <div 
      className="w-full min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
        perspectiveOrigin: "50% 38%",
      }}
    >
      {/* Background space grids */}
      <div className="absolute inset-0 grid-glow opacity-15 pointer-events-none" />
      
      {/* Dynamic backlight glow behind table desk */}
      <div 
        className="absolute w-[800px] h-[450px] rounded-full blur-[140px] pointer-events-none transition-all duration-[2s] -z-10"
        style={{
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          background: isZoomed
            ? "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(56,189,248,0.08) 0%, transparent 70%)"
        }}
      />

      {/* 3D DESK AND WORKSPACE STAGE */}
      <AnimatePresence mode="wait">
        {currentPage !== "terminal" && (
          <motion.div
            className="w-[900px] h-[550px] relative preserve-3d"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translate3d(0px, ${translateY}px, ${translateZ}px)`,
              transition: "transform 2.2s cubic-bezier(0.25, 1, 0.45, 1)",
            }}
          >
            {/* 1. TABLE SURFACE BOARD */}
            <div 
              className="absolute inset-0 bg-slate-900 border-2 border-sky-500/20 rounded-[2.5rem] shadow-[0_45px_100px_rgba(0,0,0,0.85)] flex flex-col justify-between p-8 preserve-3d"
              style={{
                transform: "translateZ(0px)",
                backgroundImage: "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 80%)"
              }}
            >
              {/* Grid detail on the desk board surface */}
              <div className="absolute inset-4 border border-sky-500/5 rounded-[2rem] pointer-events-none" />
              
              {/* Table labels schema */}
              <div className="flex justify-between font-mono text-[9px] text-sky-500/30">
                <span>GRID_STATION_A1</span>
                <span>FARIZ_DESK_MATRIX</span>
              </div>
            </div>

            {/* 2. ERGONOMIC CHAIR MESH (Sits slightly below and behind desk) */}
            <div
              className="absolute -bottom-24 left-[350px] w-[200px] h-[150px] bg-slate-950/70 border border-sky-500/10 rounded-2xl shadow-xl transition-transform duration-700"
              style={{
                transform: `translate3d(${mousePos.x * -16}px, ${mousePos.y * -8}px, -110px) rotateX(10deg)`,
                transformStyle: "preserve-3d",
              }}
            />

            {/* 3. GLOWING LAMPOST (Sticks up from table back edge) */}
            <div
              className="absolute top-6 left-12 w-6 h-6 bg-slate-950 border border-sky-500/20 rounded-full flex items-center justify-center text-[8px] font-mono text-sky-500/50"
              style={{
                transform: "translateZ(120px) rotateY(-10deg)",
                transformStyle: "preserve-3d"
              }}
            >
              <div className="absolute -top-3 w-1.5 h-12 bg-slate-800 border-x border-sky-500/20" />
              {/* Glowing bulb cone */}
              <div className="absolute -top-16 w-12 h-12 rounded-full bg-sky-500/10 blur-md animate-pulse" />
              <div className="absolute -top-24 w-1 h-20 bg-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.5)]" />
            </div>

            {/* 4. THE LAPTOP COMPUTER */}
            <div
              className="absolute left-[280px] top-[140px] w-[340px] h-[220px] preserve-3d"
              style={{
                transform: "translateZ(2px)",
                transformStyle: "preserve-3d"
              }}
            >
              {/* LAPTOP KEYBOARD BASE */}
              <div 
                className="absolute inset-0 bg-slate-950 border border-slate-700/60 rounded-xl flex flex-col justify-end p-4 shadow-xl"
                style={{
                  transform: "translateZ(0px)",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.6)"
                }}
              >
                {/* Visual Keyboard outline */}
                <div className="w-full h-20 bg-slate-900/60 border border-sky-500/15 rounded-md p-2 flex flex-col justify-between mb-2">
                  <div className="flex justify-between w-full h-3 border-b border-sky-500/10" />
                  <div className="grid grid-cols-12 gap-1 h-8">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="bg-slate-950/80 border border-sky-500/5 rounded-sm" />
                    ))}
                  </div>
                </div>
                {/* Touchpad trackpad */}
                <div className="w-20 h-10 bg-slate-900 border border-sky-500/10 rounded-sm mx-auto shadow-inner" />
              </div>

              {/* LAPTOP LID / SCREEN (Pivots around back hinge) */}
              <div
                className="absolute top-0 left-0 w-full h-[210px] preserve-3d"
                style={{
                  transformOrigin: "bottom center",
                  transform: `translate3d(0, -210px, 0) rotateX(${laptopOpen ? -15 : -178}deg)`,
                  transition: "transform 1.8s cubic-bezier(0.2, 0.8, 0.2, 1)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* GLOSSY LID OUTER BACK COVER (Visible when laptop is closed) */}
                <div
                  className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-center backface-hidden"
                  style={{
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden"
                  }}
                >
                  {/* Glowing schematic gold/blue icon on laptop cover */}
                  <div className="w-10 h-10 rounded-full border border-sky-500/20 bg-slate-950/40 flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.1)]">
                    <Laptop className="size-5 text-sky-500/40" />
                  </div>
                </div>

                {/* ACTIVE LCD DISPLAY SCREEN (Visible when laptop is open) */}
                <div
                  className="absolute inset-0 bg-slate-950 border-2 border-slate-800 rounded-xl p-2 backface-hidden overflow-hidden flex flex-col justify-between"
                  style={{
                    transform: "rotateY(0deg)",
                    backfaceVisibility: "hidden",
                    boxShadow: laptopOpen ? "0 0 35px rgba(56, 189, 248, 0.15)" : "none"
                  }}
                >
                  {/* Display scanlines grids */}
                  <div className="absolute inset-0 bg-grid-lines pointer-events-none opacity-5" />
                  
                  {/* Screen contents: Cyan glowing prompt */}
                  <div className="w-full h-full bg-slate-900/90 border border-sky-500/20 rounded-lg p-3 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between font-mono text-[8px] text-sky-400 border-b border-sky-500/10 pb-1">
                      <span>CONSOLE v3.0</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    <div className="flex-grow flex flex-col justify-center items-center text-center p-2">
                      {laptopOpen ? (
                        <div className="space-y-1">
                          <Cpu className="size-6 text-sky-400 animate-spin mx-auto mb-1.5" />
                          <p className="font-mono text-[9px] text-sky-400 font-bold uppercase tracking-wider">SYSTEM CONNECTING...</p>
                          <p className="font-mono text-[7px] text-sky-500/40">LOADING KERNEL LOGS</p>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <Power className="size-6 text-slate-700 animate-pulse mx-auto mb-1.5" />
                          <p className="font-mono text-[9px] text-slate-600 font-bold uppercase tracking-wider">OFFLINE</p>
                        </div>
                      )}
                    </div>

                    <div className="h-px bg-sky-500/10" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* OVERLAY USER START TRIGGER HUD (Fades out when zooming) */}
      {currentPage === "desk" && (
        <div className="absolute inset-x-0 bottom-16 flex justify-center items-center z-30 select-none">
          <motion.button
            onClick={startSequence}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative flex items-center gap-3 px-8 py-4 bg-slate-900/80 hover:bg-slate-900 border-2 border-sky-500/30 hover:border-sky-400 text-sky-400 hover:text-white font-mono text-sm font-extrabold uppercase tracking-[0.2em] rounded-full shadow-[0_0_35px_rgba(56,189,248,0.25)] hover:shadow-[0_0_45px_rgba(56,189,248,0.45)] transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {/* Glowing border orb */}
            <span className="absolute -left-1 -top-1 w-3 h-3 rounded-full bg-sky-500 blur-sm animate-pulse" />
            Initialize Terminal
            <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
          </motion.button>
        </div>
      )}

      {/* FULLSCREEN TERMINAL CONSOLE MOUNT */}
      {currentPage === "terminal" && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 z-50 p-4 md:p-6"
        >
          <HackerTerminal onExit={exitTerminal} />
        </motion.div>
      )}
    </div>
  );
}
