"use client";

import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export function TechBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setReady(true);
    });
  }, []);

  const options = useMemo<ISourceOptions>(
    () => ({
      fullScreen: {
        enable: false,
      },
      background: {
        color: {
          value: "transparent",
        },
      },
      fpsLimit: 60,
      detectRetina: true,
      interactivity: {
        events: {
          onHover: {
            enable: true,
            mode: "grab",
          },
          resize: {
            enable: true,
          },
        },
        modes: {
          grab: {
            distance: 150,
            links: {
              opacity: 0.35,
            },
          },
        },
      },
      particles: {
        color: {
          value: ["#8b5cf6", "#a855f7", "#d8b4fe"],
        },
        links: {
          color: "#a855f7",
          distance: 130,
          enable: true,
          opacity: 0.18,
          width: 1,
        },
        move: {
          direction: "none",
          enable: true,
          outModes: {
            default: "out",
          },
          random: false,
          speed: 0.7,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            width: 900,
            height: 700,
          },
          value: 68,
        },
        opacity: {
          value: {
            min: 0.14,
            max: 0.34,
          },
        },
        shape: {
          type: "circle",
        },
        size: {
          value: {
            min: 1,
            max: 3.2,
          },
        },
      },
      motion: {
        disable: false,
        reduce: {
          factor: 2,
          value: true,
        },
      },
    }),
    [],
  );

  if (!ready) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_22%,transparent),transparent_28%),radial-gradient(circle_at_82%_18%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_24%),linear-gradient(180deg,color-mix(in_oklab,var(--background)_95%,var(--secondary))_0%,var(--background)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--background)_24%,transparent)_100%)]" />
      <Particles id="tech-background" className="absolute inset-0" options={options} />
    </div>
  );
}
