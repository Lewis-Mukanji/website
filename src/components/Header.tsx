"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, site } from "@/lib/site";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open ? "bg-black/85 backdrop-blur-md border-b hairline" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:h-20 md:px-10">
          <Link href="/" className="flex items-center gap-3" aria-label={`${site.name} home`}>
            <span className="relative block h-11 w-11 overflow-hidden md:h-12 md:w-12">
              <Image src="/images/logo.jpg" alt="" fill sizes="48px" className="object-cover scale-[1.55] object-[50%_40%]" priority />
            </span>
            <span className="leading-none">
              <span className="block font-serif text-lg tracking-[0.18em] text-green md:text-xl">NOURISHED</span>
              <span className="block text-[0.55rem] tracking-[0.42em] text-gold">BY MITCHELL</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
            {nav.slice(1).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[0.68rem] font-semibold uppercase tracking-[0.22em] transition-colors hover:text-ink ${
                  pathname === item.href ? "text-gold" : "text-muted"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact#enquire" className="btn btn-gold !px-5 !py-3">
              Book
            </Link>
          </nav>

          <button
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-[6px] lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
            <span className={`h-px w-6 bg-ink transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-500 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="glow-green pointer-events-none absolute left-1/2 top-1/3 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2" />
        <nav className="relative flex h-full flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="display flex items-baseline gap-4 py-1 text-4xl text-ink"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="w-8 font-sans text-[0.6rem] tracking-[0.3em] text-gold">0{i + 1}</span>
              {item.label}
            </Link>
          ))}
          <Link href="/contact#enquire" className="btn btn-gold mt-8 self-start">
            Book a consultation →
          </Link>
        </nav>
      </div>
    </>
  );
}
