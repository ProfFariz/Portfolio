import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fariz Portfolio",
  description: "Animated personal portfolio built with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full font-[family-name:var(--font-inter)]">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (() => {
                try {
                  const saved = localStorage.getItem("portfolio-theme");
                  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
                  if (saved === "dark" || (!saved && prefersDark)) {
                    document.documentElement.classList.add("dark");
                  }
                } catch (error) {
                  console.warn("Theme init failed", error);
                }
              })();
            `,
          }}
        />
        {children}
      </body>
    </html>
  );
}
