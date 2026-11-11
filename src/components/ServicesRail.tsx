"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { serviceGroups } from "@/lib/site";

/** Swipeable full-height panels, one per service category, numbered I–VIII. */
export default function ServicesRail() {
  const rail = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const total = serviceGroups.length;

  const go = (dir: number) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-panel]");
    el.scrollBy({ left: dir * ((card?.offsetWidth ?? 320) + 16), behavior: "smooth" });
  };

  const onScroll = () => {
    const el = rail.current;
    const card = el?.querySelector<HTMLElement>("[data-panel]");
    if (!el || !card) return;
    setActive(Math.min(total - 1, Math.round(el.scrollLeft / (card.offsetWidth + 16))));
  };

  return (
    <div className="relative mt-14">
      <div
        ref={rail}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 [scrollbar-width:none] md:px-10 [&::-webkit-scrollbar]:hidden"
      >
        {serviceGroups.map((g, i) => (
          <Link
            key={g.slug}
            href={`/services#${g.slug}`}
            data-panel
            className="group relative flex h-[440px] w-[82vw] shrink-0 snap-start flex-col justify-end overflow-hidden border hairline bg-[var(--panel)] p-8 transition-colors hover:border-green/50 sm:w-[420px] md:h-[520px] md:p-10"
          >
            <div
              className={`pointer-events-none absolute -right-24 -top-24 h-80 w-80 transition-opacity duration-700 group-hover:opacity-100 ${
                i % 2 ? "glow-gold" : "glow-green"
              } opacity-70`}
            />
            <span className="pointer-events-none absolute right-6 top-2 select-none font-serif text-[11rem] italic leading-none text-white/[0.04] md:text-[13rem]">
              {g.numeral}
            </span>
            <span className="absolute right-8 top-8 text-[0.6rem] font-semibold tracking-[0.3em] text-faint">
              {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </span>
            <div className="relative">
              <p className="font-serif text-4xl italic text-gold">{g.numeral}</p>
              <h3 className="mt-3 text-3xl font-extrabold uppercase tracking-tight md:text-4xl">{g.title}</h3>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">{g.line}</p>
              <p className="mt-6 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-green transition-transform group-hover:translate-x-1">
                {g.services.length} services →
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mx-auto mt-4 flex max-w-7xl items-center justify-between px-5 md:px-10">
        <div className="flex gap-1.5" aria-hidden>
          {serviceGroups.map((g, i) => (
            <span key={g.slug} className={`h-px transition-all duration-500 ${i === active ? "w-10 bg-gold" : "w-4 bg-white/20"}`} />
          ))}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[0.6rem] font-semibold uppercase tracking-[0.3em] text-faint">Swipe</span>
          <button onClick={() => go(-1)} aria-label="Previous" className="flex h-10 w-10 items-center justify-center border hairline text-muted hover:border-gold hover:text-gold">
            ‹
          </button>
          <button onClick={() => go(1)} aria-label="Next" className="flex h-10 w-10 items-center justify-center border hairline text-muted hover:border-gold hover:text-gold">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
