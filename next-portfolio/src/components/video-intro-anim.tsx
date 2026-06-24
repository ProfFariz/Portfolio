"use client";

import React, { useState, useEffect, useRef } from "react";
import { WorkspaceDesk3D } from "./workspace-desk-3d";
import { Play, Laptop, Cpu } from "lucide-react";
import { synth } from "@/lib/audio-synthesizer";

interface VideoIntroAnimProps {
  onComplete: () => void;
  isMobile: boolean;
}

export function VideoIntroAnim({ onComplete, isMobile }: VideoIntroAnimProps) {
  const [loadState, setLoadState] = useState<"loading" | "ready" | "playing" | "failed">("loading");
  const videoRef = useRef<HTMLVideoElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // A high-quality public developer room 3D walk-and-zoom loop video
  const videoUrl = "https://assets.mixkit.co/videos/preview/mixkit-software-developer-working-on-his-computer-34282-large.mp4";

  useEffect(() => {
    // If the video takes more than 2.5 seconds to load, fallback to CSS 3D desk
    timeoutRef.current = setTimeout(() => {
      if (loadState === "loading") {
        setLoadState("failed");
      }
    }, 2500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [loadState]);

  const handleCanPlayThrough = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (loadState === "loading") {
      setLoadState("ready");
    }
  };

  const handleVideoError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setLoadState("failed");
  };

  const startPlayback = () => {
    if (!videoRef.current) return;
    synth.playHingeSwoosh();
    setLoadState("playing");
    videoRef.current.play().catch(() => {
      // Browser blocked play, fallback
      setLoadState("failed");
    });
  };

  const handleVideoEnded = () => {
    synth.playBeep(900, 0.15);
    onComplete();
  };

  // If mobile or video load fails, load the CSS 3D desk fallback
  if (loadState === "failed" || isMobile) {
    return <WorkspaceDesk3D onZoomComplete={onComplete} />;
  }

  return (
    <div className="w-full min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative select-none">
      {/* Ambient tech styling grid */}
      <div className="absolute inset-0 grid-glow opacity-20 pointer-events-none" />

      {/* Hidden video player for pre-caching */}
      <video
        ref={videoRef}
        src={videoUrl}
        preload="auto"
        muted
        playsInline
        onCanPlayThrough={handleCanPlayThrough}
        onError={handleVideoError}
        onEnded={handleVideoEnded}
        className={`w-full max-w-4xl rounded-3xl border border-sky-500/20 shadow-2xl bg-black transition-opacity duration-1000 ${
          loadState === "playing" ? "opacity-100 relative z-20" : "opacity-0 absolute pointer-events-none"
        }`}
      />

      {/* Start Button Overlay */}
      {loadState === "ready" && (
        <div className="flex flex-col items-center gap-6 z-30">
          <div className="w-16 h-16 rounded-full bg-slate-900 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.2)] animate-pulse mb-2">
            <Laptop className="size-8" />
          </div>
          <div className="text-center space-y-2 max-w-md">
            <h1 className="font-mono text-2xl font-black tracking-widest text-white">FARIZ OS WORKSPACE</h1>
            <p className="font-mono text-xs text-sky-500/60 leading-relaxed">
              3D Workspace Animation initialized. Click the button to enter the interactive office desktop.
            </p>
          </div>
          <button
            onClick={startPlayback}
            className="flex items-center gap-2.5 px-8 py-4 bg-sky-500 text-slate-950 font-mono text-xs font-black uppercase tracking-wider rounded-full shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Play className="size-4 fill-slate-950" />
            <span>Enter Office Desk</span>
          </button>
        </div>
      )}

      {/* Loading Spinner */}
      {loadState === "loading" && (
        <div className="flex flex-col items-center gap-4 z-30 font-mono">
          <Cpu className="size-8 text-sky-400 animate-spin" />
          <span className="text-xs text-sky-400 font-bold uppercase tracking-wider animate-pulse">
            LOADING OFFICE CONTEXT...
          </span>
        </div>
      )}
    </div>
  );
}
