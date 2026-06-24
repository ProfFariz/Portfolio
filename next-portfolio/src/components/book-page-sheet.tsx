"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BookPageSheetProps {
  sheetIndex: number;
  currentPage: number;
  totalPages: number;
  frontContent: ReactNode;
  backContent: ReactNode;
  isFlipping: boolean;
  onCornerClick?: () => void;
  isCover?: boolean;
  isBackCover?: boolean;
}

export function BookPageSheet({
  sheetIndex,
  currentPage,
  totalPages,
  frontContent,
  backContent,
  isFlipping,
  onCornerClick,
  isCover = false,
  isBackCover = false,
}: BookPageSheetProps) {
  const isFlipped = currentPage > sheetIndex;

  // Stacking logic:
  // Flipped sheets (on the left) stack with higher sheetIndex on top: z-index = sheetIndex
  // Unflipped sheets (on the right) stack with lower sheetIndex on top: z-index = totalPages - sheetIndex
  // The actively flipping sheet gets a very high z-index (100) so it animates above everything else
  let zIndex = isFlipped ? sheetIndex + 5 : totalPages - sheetIndex + 5;
  if (isFlipping) {
    zIndex = 100;
  }

  return (
    <motion.div
      className="absolute top-0 right-0 w-1/2 h-full preserve-3d"
      style={{
        originX: 0, // Pivot around the center spine
        transformStyle: "preserve-3d",
        zIndex: zIndex,
      }}
      animate={{
        rotateY: isFlipped ? -180 : 0,
      }}
      transition={{
        duration: 0.95,
        ease: [0.22, 1, 0.36, 1], // Smooth premium easing
      }}
    >
      {/* FRONT SIDE of sheet (Even pages: visible on the right when closed/turning) */}
      <div
        className={`absolute inset-0 w-full h-full backface-hidden preserve-3d ${
          isCover 
            ? "bg-slate-900 border border-slate-700/60 rounded-r-2xl shadow-2xl overflow-hidden" 
            : "blueprint-page-bg rounded-r-2xl border-l border-sky-500/20"
        }`}
        style={{
          transform: "rotateY(0deg)",
          backfaceVisibility: "hidden",
        }}
      >
        {isCover && (
          <>
            {/* Metallic corner decorations for Cover */}
            <div className="metal-corner metal-corner-tr" />
            <div className="metal-corner metal-corner-br" />
            {/* Circuit decorative glowing overlays */}
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_20%_30%,#38bdf8_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="absolute inset-x-0 bottom-0 top-[60%] bg-[linear-gradient(to_bottom,transparent,rgba(56,189,248,0.05))]" />
          </>
        )}
        
        {!isCover && (
          <>
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />
          </>
        )}

        {frontContent}

        {/* Page turn button on bottom right corner */}
        {onCornerClick && !isFlipped && !isBackCover && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCornerClick();
            }}
            className="absolute bottom-6 right-6 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 text-sky-400 hover:text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 active:scale-95"
            title="Next Page"
          >
            Next Page →
          </button>
        )}
      </div>

      {/* BACK SIDE of sheet (Odd pages: visible on the left after flipping) */}
      <div
        className={`absolute inset-0 w-full h-full backface-hidden preserve-3d ${
          isBackCover 
            ? "bg-slate-900 border border-slate-700/60 rounded-l-2xl shadow-2xl overflow-hidden" 
            : "blueprint-page-bg rounded-l-2xl border-r border-sky-500/20"
        }`}
        style={{
          transform: "rotateY(180deg)", // Backface rotated 180 degrees
          backfaceVisibility: "hidden",
        }}
      >
        {isBackCover && (
          <>
            <div className="metal-corner metal-corner-tl" />
            <div className="metal-corner metal-corner-bl" />
            <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_80%_30%,#38bdf8_1px,transparent_1px)] bg-[size:16px_16px]" />
          </>
        )}

        {!isBackCover && (
          <>
            <div className="blueprint-corner blueprint-corner-tl" />
            <div className="blueprint-corner blueprint-corner-tr" />
            <div className="blueprint-corner blueprint-corner-bl" />
            <div className="blueprint-corner blueprint-corner-br" />
          </>
        )}

        {backContent}

        {/* Page turn button on bottom left corner */}
        {onCornerClick && isFlipped && !isCover && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCornerClick();
            }}
            className="absolute bottom-6 left-6 z-[60] flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-950/40 border border-sky-500/30 hover:border-sky-400 text-sky-400 hover:text-sky-300 font-mono text-[10px] font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(56,189,248,0.2)] hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] transition-all duration-300 active:scale-95"
            title="Previous Page"
          >
            ← Previous
          </button>
        )}
      </div>
    </motion.div>
  );
}
