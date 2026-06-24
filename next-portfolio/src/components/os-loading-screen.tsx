"use client";

import React, { useState, useEffect } from "react";
import { Cpu } from "lucide-react";
import { synth } from "@/lib/audio-synthesizer";

interface OSLoadingScreenProps {
  onComplete: () => void;
}

export function OSLoadingScreen({ onComplete }: OSLoadingScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Play boot sound at start of loading screen
    synth.playBootHum();

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment progress randomly for realistic load speed feel
        const step = Math.floor(Math.random() * 15) + 5;
        return Math.min(prev + step, 100);
      });
    }, 180);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        // Play success startup chime: minor/major triad beep
        synth.playBeep(523.25, 0.1); // C5
        setTimeout(() => synth.playBeep(659.25, 0.1), 80); // E5
        setTimeout(() => synth.playBeep(783.99, 0.1), 160); // G5
        setTimeout(() => synth.playBeep(1046.50, 0.35), 240); // C6

        // Complete loading
        setTimeout(onComplete, 600);
      }, 300);

      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative select-none">
      <div className="absolute inset-0 grid-glow opacity-10 pointer-events-none" />

      {/* Cybernetic loading ring and status */}
      <div className="flex flex-col items-center gap-8 max-w-sm w-full z-20">
        <div className="relative flex items-center justify-center">
          {/* Cybernetic loading ring spinning */}
          <div className="w-20 h-20 rounded-full border-4 border-slate-900 border-t-sky-500 animate-spin shadow-[0_0_20px_rgba(56,189,248,0.25)]" />
          <Cpu className="size-8 text-sky-400 absolute animate-pulse" />
        </div>

        <div className="text-center w-full space-y-4 font-mono">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em]">INITIALIZING FARIZOS</h2>
            <p className="text-[10px] text-sky-500/40">COMPILING BLUEPRINT ASSETS</p>
          </div>

          {/* Progress bar loader */}
          <div className="space-y-1.5 w-full">
            <div className="w-full h-1.5 bg-slate-900 border border-sky-500/10 rounded-full overflow-hidden p-px">
              <div 
                className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full shadow-[0_0_8px_#38bdf8] transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-sky-500/50">
              <span>LOADING_CORE...</span>
              <span>{progress}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
