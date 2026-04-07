"use client";

const meteors = [
  { top: "-6%", right: "-6rem", delay: "0s", duration: "5.9s", width: "10rem" },
  { top: "-2%", right: "-14rem", delay: "0.7s", duration: "6.5s", width: "13rem" },
  { top: "2%", right: "-22rem", delay: "1.5s", duration: "7.1s", width: "16rem" },
  { top: "5%", right: "-10rem", delay: "2.2s", duration: "6.2s", width: "11rem" },
  { top: "8%", right: "-18rem", delay: "0.35s", duration: "7.3s", width: "15rem" },
  { top: "12%", right: "-4rem", delay: "1.1s", duration: "5.8s", width: "9rem" },
  { top: "15%", right: "-16rem", delay: "2.8s", duration: "6.8s", width: "12.5rem" },
  { top: "18%", right: "-24rem", delay: "3.4s", duration: "7.6s", width: "17rem" },
  { top: "22%", right: "-8rem", delay: "1.9s", duration: "6.1s", width: "10.5rem" },
  { top: "26%", right: "-20rem", delay: "2.6s", duration: "7s", width: "14rem" },
];

export function TechBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,color-mix(in_oklab,var(--primary)_20%,transparent),transparent_26%),radial-gradient(circle_at_82%_18%,color-mix(in_oklab,var(--accent)_16%,transparent),transparent_22%),linear-gradient(180deg,color-mix(in_oklab,var(--background)_95%,var(--secondary))_0%,var(--background)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,color-mix(in_oklab,var(--background)_24%,transparent)_100%)]" />
      <div className="meteor-field absolute inset-0">
        {meteors.map((meteor, index) => (
          <span
            key={`${meteor.top}-${meteor.delay}-${index}`}
            className="meteor-streak"
            style={{
              top: meteor.top,
              right: meteor.right,
              width: meteor.width,
              animationDelay: meteor.delay,
              animationDuration: meteor.duration,
            }}
          />
        ))}
      </div>
    </div>
  );
}
