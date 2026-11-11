"use client";

import { useEffect, useRef, useState } from "react";

type Part = { text: string; accent?: boolean };

/** A large statement whose words light up one by one as you scroll past it. */
export default function ScrollLitText({ parts, className = "" }: { parts: Part[]; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);

  const words = parts.flatMap((p) => p.text.split(" ").filter(Boolean).map((w) => ({ w, accent: p.accent })));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.3;
      const p = (start - r.top) / (start - end + r.height * 0.6);
      setProgress(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const lit = Math.round(progress * words.length);

  return (
    <p ref={ref} className={`display ${className}`}>
      {words.map(({ w, accent }, i) => (
        <span
          key={i}
          className={`transition-[opacity,color] duration-500 ${accent ? "italic text-green" : "text-ink"}`}
          style={{ opacity: i < lit ? 1 : 0.16 }}
        >
          {w}{" "}
        </span>
      ))}
    </p>
  );
}
