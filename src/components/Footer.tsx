"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav, site, whatsappLink } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden border-t hairline bg-black">
      <div className="glow-green pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[800px] -translate-x-1/2 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="relative h-40 w-40">
              <Image src="/images/logo.jpg" alt={`${site.name} logo`} fill sizes="160px" className="object-contain" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Personalised nutrition, meal plans and coaching from Nairobi, online across Kenya and beyond.
            </p>
          </div>

          <div>
            <p className="eyebrow">Explore</p>
            <ul className="mt-6 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-muted transition-colors hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow">Reach Mitchell</p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  WhatsApp · {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`tel:+${site.phoneIntl}`} className="hover:text-ink">
                  Call · {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ink">
                  Instagram · @{site.instagram}
                </a>
              </li>
              {site.email && (
                <li>
                  <a href={`mailto:${site.email}`} className="hover:text-ink">
                    {site.email}
                  </a>
                </li>
              )}
              <li>{site.city} · Online & in person</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t hairline pt-8 text-xs text-faint md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="max-w-2xl md:text-right">
            Information on this site and the free starter plan is general guidance, not medical advice. For medical
            conditions, pregnancy or medication, please consult Mitchell or your doctor.{" "}
            <Link href="/privacy" className="underline hover:text-muted">
              Privacy policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
