import type { ReactNode } from "react";

export default function PageHero({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 md:pt-48 md:pb-24">
      <div className="glow-green breathe pointer-events-none absolute left-1/2 top-24 h-[520px] w-[820px] -translate-x-1/2" />
      <div className="dust pointer-events-none absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <p className="eyebrow rise">{eyebrow}</p>
        <h1 className="display rise rise-1 mt-6 max-w-4xl text-5xl md:text-7xl lg:text-8xl">{title}</h1>
        {children && <div className="rise rise-2 mt-8 max-w-2xl text-base leading-relaxed text-muted md:text-lg">{children}</div>}
      </div>
    </section>
  );
}
